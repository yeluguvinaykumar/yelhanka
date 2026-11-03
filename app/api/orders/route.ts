import { NextResponse } from "next/server";
import { addOrder, getContent, getOrders, getProducts, saveProducts } from "@/lib/store";
import { isAdmin } from "@/lib/admin";
import { orderNumber } from "@/lib/utils";
import type { Customer, Order, OrderItem } from "@/lib/types";

function validCustomer(value: Partial<Customer>): value is Customer {
  return Boolean(
    value.name &&
      value.name.trim().length >= 2 &&
      value.phone &&
      value.phone.replace(/\D/g, "").length >= 10 &&
      value.address &&
      value.address.trim().length >= 8 &&
      value.city &&
      value.state &&
      /^\d{5,6}$/.test(value.pincode ?? ""),
  );
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await getOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      customer?: Partial<Customer>;
      items?: { productId?: string; packLabel?: string; qty?: number }[];
      payment?: "cod" | "whatsapp";
    };

    if (!body.customer || !validCustomer(body.customer)) {
      return NextResponse.json(
        { error: "Please check your delivery details and try again." },
        { status: 400 },
      );
    }
    if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 40) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const products = await getProducts();
    const orderItems: OrderItem[] = [];
    const stockUpdates = new Map<string, number>();

    for (const requested of body.items) {
      const qty = Number(requested.qty);
      if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
        return NextResponse.json({ error: "Invalid item quantity." }, { status: 400 });
      }
      const product = products.find((item) => item.id === requested.productId);
      if (!product) {
        return NextResponse.json(
          { error: "One of the products is no longer available." },
          { status: 400 },
        );
      }
      const pack = product.packs.find((item) => item.label === requested.packLabel);
      if (!pack) {
        return NextResponse.json(
          { error: `The selected pack for ${product.name} is unavailable.` },
          { status: 400 },
        );
      }
      const already = stockUpdates.get(product.id) ?? 0;
      const next = already + qty;
      if (product.stock < next) {
        return NextResponse.json(
          { error: `Only ${product.stock} of ${product.name} remain in stock.` },
          { status: 409 },
        );
      }
      stockUpdates.set(product.id, next);
      orderItems.push({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        packLabel: pack.label,
        grams: pack.grams,
        price: pack.price,
        qty,
      });
    }

    const content = await getContent();
    const subtotal = orderItems.reduce((total, item) => total + item.price * item.qty, 0);
    const shipping =
      subtotal >= content.site.freeShippingThreshold ? 0 : content.site.shippingFee;

    const order: Order = {
      id: orderNumber(),
      createdAt: new Date().toISOString(),
      customer: {
        name: body.customer.name.trim(),
        phone: body.customer.phone.trim(),
        email: body.customer.email?.trim() || undefined,
        address: body.customer.address.trim(),
        city: body.customer.city.trim(),
        state: body.customer.state.trim(),
        pincode: body.customer.pincode.trim(),
        notes: body.customer.notes?.trim() || undefined,
      },
      items: orderItems,
      subtotal,
      shipping,
      total: subtotal + shipping,
      payment: body.payment === "whatsapp" ? "whatsapp" : "cod",
      status: "new",
    };

    const updatedProducts = products.map((product) => {
      const decrement = stockUpdates.get(product.id);
      return decrement ? { ...product, stock: Math.max(product.stock - decrement, 0) } : product;
    });

    await addOrder(order);
    await saveProducts(updatedProducts);

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json(
      { error: "We couldn't place the order just now. Please try WhatsApp." },
      { status: 500 },
    );
  }
}

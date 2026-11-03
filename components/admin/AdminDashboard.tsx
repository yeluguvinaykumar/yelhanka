"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  CheckCheck,
  Clock,
  Copy,
  Download,
  ExternalLink,
  LayoutDashboard,
  Leaf,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  Package,
  Phone,
  PlugZap,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  ShoppingBag,
  Trash2,
  Truck,
  Users,
} from "lucide-react";
import type {
  Enquiry,
  IntegrationStatus,
  Order,
  OrderStatus,
  Product,
  SiteContent,
  Subscriber,
} from "@/lib/types";
import { ProductsPanel } from "@/components/admin/ProductsPanel";
import { ContentPanel } from "@/components/admin/ContentPanel";
import { IntegrationsPanel } from "@/components/admin/IntegrationsPanel";
import { LeafMark } from "@/components/ui/Botanical";
import { cn, formatINR, initials, waLink } from "@/lib/utils";

type Tab =
  | "overview"
  | "products"
  | "orders"
  | "enquiries"
  | "subscribers"
  | "content"
  | "integrations";

const navItems: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "enquiries", label: "Enquiries", icon: MessageSquare },
  { id: "subscribers", label: "Subscribers", icon: Users },
  { id: "content", label: "Content", icon: Settings2 },
  { id: "integrations", label: "Integrations", icon: PlugZap },
];

function delhiveryTrackingUrl(awb: string) {
  return `https://www.delhivery.com/track/package/${encodeURIComponent(awb)}`;
}

const statusMeta: Record<OrderStatus, { label: string; className: string }> = {
  new: { label: "New", className: "bg-gold/15 text-[#8a6f2d]" },
  confirmed: { label: "Confirmed", className: "bg-botanical/10 text-botanical" },
  packed: { label: "Packed", className: "bg-forest/10 text-forest" },
  shipped: { label: "Shipped", className: "bg-[#2f5d7c]/10 text-[#2f5d7c]" },
  delivered: { label: "Delivered", className: "bg-botanical text-ivory" },
  cancelled: { label: "Cancelled", className: "bg-burgundy/10 text-burgundy" },
};

const statusOptions: OrderStatus[] = [
  "new",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

const SHIPPABLE: OrderStatus[] = ["new", "confirmed", "packed"];

function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = statusMeta[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em]", meta.className)}>
      <span className="h-1 w-1 rounded-full bg-current" />
      {meta.label}
    </span>
  );
}

function Overview({
  products,
  orders,
  enquiries,
  subscribers,
  integrations,
  onTab,
}: {
  products: Product[];
  orders: Order[];
  enquiries: Enquiry[];
  subscribers: Subscriber[];
  integrations: IntegrationStatus;
  onTab: (tab: Tab) => void;
}) {
  const activeOrders = orders.filter((order) => order.status !== "cancelled");
  const requestValue = activeOrders.reduce((total, order) => total + order.total, 0);
  const newOrders = orders.filter((order) => order.status === "new").length;
  const unread = enquiries.filter((enquiry) => !enquiry.read).length;
  const lowStock = products.filter((product) => product.stock <= 5);
  const recent = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const metrics = [
    {
      label: "Order value",
      value: formatINR(requestValue),
      detail: `${activeOrders.length} active requests · not paid online`,
      icon: ShoppingBag,
      tone: "bg-forest text-ivory",
      onClick: () => onTab("orders"),
    },
    {
      label: "New requests",
      value: String(newOrders),
      detail: newOrders === 0 ? "All caught up" : "Waiting for confirmation",
      icon: Clock,
      tone: "bg-gold/15 text-[#8a6f2d]",
      onClick: () => onTab("orders"),
    },
    {
      label: "Unread enquiries",
      value: String(unread),
      detail: `${enquiries.length} total messages`,
      icon: MessageSquare,
      tone: "bg-burgundy/10 text-burgundy",
      onClick: () => onTab("enquiries"),
    },
    {
      label: "Pantry list",
      value: String(subscribers.length),
      detail: "Newsletter subscribers",
      icon: Users,
      tone: "bg-botanical/10 text-botanical",
      onClick: () => onTab("subscribers"),
    },
  ];

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[8px] uppercase tracking-[0.22em] text-gold">Studio overview</p>
          <h1 className="mt-1.5 font-serif text-[clamp(1.9rem,3.2vw,2.7rem)] leading-tight text-forest">
            The pantry at a glance.
          </h1>
          <p className="mt-1 text-[10.5px] text-charcoal/45">
            Requests, stock and messages — all in one quiet place.
          </p>
        </div>
        <Link href="/" target="_blank" className="btn btn-secondary btn-sm">
          <ExternalLink className="h-3.5 w-3.5" />
          <span>View storefront</span>
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <button
            key={metric.label}
            type="button"
            onClick={metric.onClick}
            className="group rounded-xl border border-forest/10 bg-ivory p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-soft sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <span className={cn("grid h-9 w-9 place-items-center rounded-full", metric.tone)}>
                <metric.icon className="h-4 w-4" strokeWidth={1.6} />
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-charcoal/20 transition-colors group-hover:text-gold" />
            </div>
            <p className="mt-4 font-serif text-[clamp(1.5rem,2.4vw,2rem)] leading-none text-forest">
              {metric.value}
            </p>
            <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.14em] text-charcoal/50">
              {metric.label}
            </p>
            <p className="mt-1 text-[9px] leading-relaxed text-charcoal/35">{metric.detail}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="overflow-hidden rounded-xl border border-forest/10 bg-ivory">
          <div className="flex items-center justify-between gap-3 border-b border-forest/10 px-5 py-4">
            <div>
              <h2 className="font-serif text-[1.2rem] text-forest">Recent requests</h2>
              <p className="text-[9px] text-charcoal/40">Newest first · values are requests, not payments</p>
            </div>
            <button
              type="button"
              onClick={() => onTab("orders")}
              className="text-[8px] font-semibold uppercase tracking-[0.12em] text-burgundy hover:text-forest"
            >
              View all
            </button>
          </div>

          {recent.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <ShoppingBag className="mx-auto h-7 w-7 text-forest/20" />
              <p className="mt-3 font-serif text-[1.2rem] text-forest">No orders yet.</p>
              <p className="mt-1 text-[10px] text-charcoal/45">New requests will appear here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-forest/10">
              {recent.map((order) => (
                <li key={order.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream text-[10px] font-semibold text-forest">
                    {initials(order.customer.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[11.5px] font-medium text-forest">{order.customer.name}</p>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="mt-0.5 text-[8.5px] text-charcoal/40">
                      {order.id} · {formatDate(order.createdAt)} · {order.items.length} item
                      {order.items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <p className="text-[11.5px] text-forest">{formatINR(order.total)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-forest/10 bg-ivory p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-[1.2rem] text-forest">Low stock</h2>
              <p className="text-[9px] text-charcoal/40">Five units or fewer</p>
            </div>
            <button
              type="button"
              onClick={() => onTab("products")}
              className="text-[8px] font-semibold uppercase tracking-[0.12em] text-burgundy hover:text-forest"
            >
              Manage
            </button>
          </div>

          {lowStock.length === 0 ? (
            <div className="mt-6 flex flex-col items-center rounded-lg border border-dashed border-forest/15 px-4 py-8 text-center">
              <Leaf className="h-6 w-6 text-botanical/50" />
              <p className="mt-2 text-[10.5px] text-charcoal/50">Every pouch is comfortably stocked.</p>
            </div>
          ) : (
            <ul className="mt-4 space-y-2.5">
              {lowStock.slice(0, 6).map((product) => (
                <li key={product.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[10.5px] text-forest">{product.name}</p>
                    <p className="text-[8px] text-charcoal/35">{product.packs[0]?.label}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-1 text-[8px] uppercase tracking-[0.08em]",
                      product.stock <= 0 ? "bg-burgundy/10 text-burgundy" : "bg-gold/15 text-[#8a6f2d]",
                    )}
                  >
                    {product.stock <= 0 ? "Out" : `${product.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 border-t border-forest/10 pt-4">
            <p className="text-[8px] uppercase tracking-[0.16em] text-gold">Quick actions</p>
            <div className="mt-2.5 grid gap-2">
              <button
                type="button"
                onClick={() => onTab("products")}
                className="flex items-center justify-between rounded-md border border-forest/10 px-3 py-2 text-[9px] text-forest transition-colors hover:border-gold"
              >
                Add a product <Plus className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => onTab("content")}
                className="flex items-center justify-between rounded-md border border-forest/10 px-3 py-2 text-[9px] text-forest transition-colors hover:border-gold"
              >
                Update studio details <Settings2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-forest/10 bg-ivory p-5">
        <div>
          <h2 className="font-serif text-[1.2rem] text-forest">Connections</h2>
          <p className="text-[9px] text-charcoal/40">
            Live status of the services this studio runs on
          </p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Database",
              name: integrations.mongodb ? "MongoDB" : "Local JSON files",
              connected: integrations.mongodb,
              detail: integrations.mongodb
                ? "MONGODB_URI is set — data persists."
                : "Set MONGODB_URI before deploying to Vercel.",
            },
            {
              label: "Images",
              name: integrations.cloudinary ? "Cloudinary" : "Local uploads",
              connected: integrations.cloudinary,
              detail: integrations.cloudinary
                ? "Uploads go to your cloud library."
                : "Set CLOUDINARY_* keys before deploying.",
            },
            {
              label: "Courier",
              name: integrations.delhivery ? "Delhivery" : "Not configured",
              connected: integrations.delhivery,
              detail: integrations.delhivery
                ? "Shipments can be manifested from Orders."
                : "Set DELHIVERY_API_TOKEN and DELHIVERY_CLIENT.",
            },
          ].map((service) => (
            <div
              key={service.label}
              className="rounded-lg border border-forest/10 bg-cream/40 p-3.5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-charcoal/40">
                  {service.label}
                </p>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[7.5px] font-semibold uppercase tracking-[0.08em]",
                    service.connected
                      ? "bg-botanical/10 text-botanical"
                      : "bg-gold/15 text-[#8a6f2d]",
                  )}
                >
                  <span
                    className={cn(
                      "h-1 w-1 rounded-full",
                      service.connected ? "bg-botanical" : "bg-gold",
                    )}
                  />
                  {service.connected ? "Connected" : "Pending"}
                </span>
              </div>
              <p className="mt-2 font-serif text-[1.05rem] text-forest">{service.name}</p>
              <p className="mt-1 text-[9px] leading-relaxed text-charcoal/45">{service.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function OrdersPanel({
  orders,
  onChange,
  siteName,
  delhiveryReady,
}: {
  orders: Order[];
  onChange: (orders: Order[]) => void;
  siteName: string;
  delhiveryReady: boolean;
}) {
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [shipping, setShipping] = useState<string | null>(null);
  const [tracking, setTracking] = useState<string | null>(null);
  const [copiedAwb, setCopiedAwb] = useState<string | null>(null);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .filter((order) => {
        const matchesStatus = filter === "all" || order.status === filter;
        const matchesTerm =
          !term ||
          order.id.toLowerCase().includes(term) ||
          order.customer.name.toLowerCase().includes(term) ||
          order.customer.phone.replace(/\D/g, "").includes(term.replace(/\D/g, ""));
        return matchesStatus && matchesTerm;
      });
  }, [orders, filter, query]);

  const updateStatus = async (order: Order, status: OrderStatus) => {
    setUpdating(order.id);
    setError("");
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = (await response.json()) as { order?: Order; error?: string };
      if (!response.ok || !data.order) throw new Error(data.error || "Could not update the order.");
      onChange(orders.map((item) => (item.id === order.id ? data.order! : item)));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not update the order.");
    } finally {
      setUpdating(null);
    }
  };

  const createShipment = async (order: Order) => {
    if (
      !window.confirm(
        `Hand ${order.id} over to Delhivery? A waybill will be created and the order marked shipped.`,
      )
    ) {
      return;
    }
    setShipping(order.id);
    setError("");
    try {
      const response = await fetch(`/api/orders/${order.id}/shipment`, { method: "POST" });
      const data = (await response.json()) as { order?: Order; error?: string };
      if (!response.ok || !data.order) {
        throw new Error(data.error || "Delhivery could not create the shipment.");
      }
      onChange(orders.map((item) => (item.id === order.id ? data.order! : item)));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create the shipment.");
    } finally {
      setShipping(null);
    }
  };

  const trackShipment = async (order: Order) => {
    setTracking(order.id);
    setError("");
    try {
      const response = await fetch(`/api/orders/${order.id}/shipment`, { method: "GET" });
      const data = (await response.json()) as { order?: Order; error?: string };
      if (!response.ok || !data.order) {
        throw new Error(data.error || "Could not fetch tracking.");
      }
      onChange(orders.map((item) => (item.id === order.id ? data.order! : item)));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not fetch tracking.");
    } finally {
      setTracking(null);
    }
  };

  const copyAwb = async (awb: string) => {
    try {
      await navigator.clipboard.writeText(awb);
      setCopiedAwb(awb);
      window.setTimeout(() => setCopiedAwb(null), 2000);
    } catch {
      setCopiedAwb(null);
    }
  };

  const exportCsv = () => {
    const rows = [
      [
        "Order",
        "Created",
        "Status",
        "Customer",
        "Phone",
        "Email",
        "Address",
        "City",
        "State",
        "Pincode",
        "Items",
        "Payment",
        "Subtotal",
        "Shipping",
        "Total",
        "Courier",
        "AWB",
        "Courier status",
      ],
      ...filtered.map((order) => [
        order.id,
        order.createdAt,
        order.status,
        order.customer.name,
        order.customer.phone,
        order.customer.email ?? "",
        order.customer.address,
        order.customer.city,
        order.customer.state,
        order.customer.pincode,
        order.items.map((item) => `${item.name} ${item.packLabel} x${item.qty}`).join(" | "),
        order.payment === "cod" ? "COD request" : "WhatsApp",
        order.subtotal,
        order.shipping,
        order.total,
        order.shipment ? "Delhivery" : "",
        order.shipment?.awb ?? "",
        order.shipment?.status ?? "",
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tasty-treasures-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[8px] uppercase tracking-[0.22em] text-gold">Fulfilment</p>
          <h1 className="mt-1.5 font-serif text-[clamp(1.8rem,3vw,2.5rem)] leading-tight text-forest">
            Orders
          </h1>
          <p className="mt-1 text-[10.5px] text-charcoal/45">
            {orders.filter((order) => order.status === "new").length} new ·{" "}
            {orders.filter((order) => order.status === "shipped").length} shipped ·{" "}
            {orders.filter((order) => order.status === "cancelled").length} cancelled
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="btn btn-secondary btn-sm"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest/30" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="field h-11 pl-10 text-[12px]"
            placeholder="Search order, name or phone"
            aria-label="Search orders"
          />
        </div>
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as OrderStatus | "all")}
          className="field h-11 w-full appearance-none text-[11px] sm:w-48"
          aria-label="Filter orders by status"
        >
          <option value="all">All statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>{statusMeta[status].label}</option>
          ))}
        </select>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-burgundy/25 bg-burgundy/5 px-4 py-3 text-[11px] text-burgundy">
          {error}
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="mt-5 rounded-xl border border-forest/10 bg-ivory px-6 py-14 text-center">
          <ShoppingBag className="mx-auto h-8 w-8 text-forest/20" />
          <p className="mt-3 font-serif text-[1.3rem] text-forest">No orders here.</p>
          <p className="mt-1 text-[10.5px] text-charcoal/45">
            New requests from the checkout will appear in this list.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {filtered.map((order) => {
            const message = [
              `Hi ${order.customer.name.split(" ")[0]}, this is ${siteName}.`,
              "",
              `Thank you for your order request ${order.id}.`,
              "We are checking availability and will confirm the next steps shortly.",
              "",
              `Items: ${order.items.map((item) => `${item.name} × ${item.qty}`).join(", ")}`,
              `Total: ${formatINR(order.total)}`,
              "",
              "Warmly, the studio.",
            ].join("\n");

            return (
              <article key={order.id} className="overflow-hidden rounded-xl border border-forest/10 bg-ivory">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-forest/10 bg-cream/40 px-4 py-3.5 sm:px-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-forest text-[10px] font-semibold text-ivory">
                      {initials(order.customer.name)}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[11.5px] font-medium text-forest">{order.customer.name}</p>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="mt-0.5 text-[8.5px] text-charcoal/40">
                        {order.id} · {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label htmlFor={`status-${order.id}`} className="sr-only">
                      Status for {order.id}
                    </label>
                    <select
                      id={`status-${order.id}`}
                      value={order.status}
                      disabled={updating === order.id}
                      onChange={(event) => updateStatus(order, event.target.value as OrderStatus)}
                      className="h-8 rounded-full border border-forest/15 bg-ivory px-3 text-[9px] uppercase tracking-[0.08em] text-forest"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{statusMeta[status].label}</option>
                      ))}
                    </select>
                    {updating === order.id && <Loader2 className="h-3.5 w-3.5 animate-spin text-gold" />}
                  </div>
                </div>

                {(order.shipment?.awb || SHIPPABLE.includes(order.status)) && (
                  <div
                    className={
                      order.shipment?.awb || delhiveryReady
                        ? "border-b border-forest/10 bg-botanical/5 px-4 py-3 sm:px-5"
                        : "border-b border-forest/10 px-4 py-2.5 sm:px-5"
                    }
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-[9.5px]">
                        <Truck
                          className={cn(
                            "h-3.5 w-3.5",
                            order.shipment?.awb ? "text-botanical" : "text-charcoal/30",
                          )}
                        />
                        {order.shipment?.awb ? (
                          <>
                            <span className="font-semibold uppercase tracking-[0.1em] text-forest">
                              Delhivery
                            </span>
                            <button
                              type="button"
                              onClick={() => copyAwb(order.shipment!.awb)}
                              title="Copy waybill number"
                              className="inline-flex items-center gap-1.5 rounded-full border border-forest/15 bg-ivory px-2.5 py-1 font-mono text-[9px] text-forest transition-colors hover:border-gold"
                            >
                              {copiedAwb === order.shipment.awb ? (
                                <Check className="h-3 w-3 text-botanical" />
                              ) : (
                                <Copy className="h-3 w-3 text-charcoal/40" />
                              )}
                              {order.shipment.awb}
                            </button>
                            <span className="text-charcoal/50">
                              {order.shipment.status}
                              {order.shipment.updatedAt
                                ? ` · ${formatDateTime(order.shipment.updatedAt)}`
                                : ""}
                            </span>
                            <a
                              href={delhiveryTrackingUrl(order.shipment.awb)}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open Delhivery tracking for ${order.shipment.awb}`}
                              className="text-charcoal/35 transition-colors hover:text-gold"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                            {order.shipment.location && (
                              <span className="inline-flex items-center gap-1 text-charcoal/40">
                                <MapPin className="h-3 w-3" />
                                {order.shipment.location}
                              </span>
                            )}
                          </>
                        ) : delhiveryReady ? (
                          <span className="text-charcoal/50">
                            Packed and ready to hand over to Delhivery.
                          </span>
                        ) : (
                          <span className="text-charcoal/40">
                            Delhivery is not configured — set the DELHIVERY_* environment
                            variables to ship this order.
                          </span>
                        )}
                      </div>

                      {order.shipment?.awb ? (
                        <button
                          type="button"
                          onClick={() => trackShipment(order)}
                          disabled={tracking === order.id}
                          className="inline-flex items-center gap-1.5 rounded-full border border-botanical/30 bg-botanical/10 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-botanical transition-colors hover:border-botanical disabled:opacity-50"
                        >
                          {tracking === order.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3" />
                          )}
                          {tracking === order.id ? "Tracking" : "Track"}
                        </button>
                      ) : (
                        delhiveryReady && (
                          <button
                            type="button"
                            onClick={() => createShipment(order)}
                            disabled={shipping === order.id}
                            className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-ivory transition-colors hover:bg-botanical disabled:opacity-50"
                          >
                            {shipping === order.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Truck className="h-3 w-3" />
                            )}
                            {shipping === order.id ? "Creating" : "Ship with Delhivery"}
                          </button>
                        )
                      )}
                    </div>

                    {order.shipment?.scans && order.shipment.scans.length > 0 && (
                      <ul className="mt-2 space-y-1 border-t border-forest/10 pt-2">
                        {order.shipment.scans.slice(0, 3).map((scan, index) => (
                          <li
                            key={`${scan.at}-${index}`}
                            className="flex flex-wrap gap-x-2 text-[8.5px] text-charcoal/45"
                          >
                            <span className="uppercase tracking-[0.06em] text-charcoal/35">
                              {scan.at ? formatDateTime(scan.at) : ""}
                            </span>
                            <span className="text-forest/70">{scan.status}</span>
                            {scan.location && <span>· {scan.location}</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <div className="grid gap-4 px-4 py-4 sm:px-5 lg:grid-cols-[1.1fr_0.9fr]">
                  <div>
                    <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-gold">Items</p>
                    <ul className="mt-2 space-y-1.5">
                      {order.items.map((item) => (
                        <li
                          key={`${item.productId}-${item.packLabel}`}
                          className="flex justify-between gap-3 text-[10.5px]"
                        >
                          <span className="text-charcoal/60">
                            {item.name}
                            <span className="text-charcoal/35"> · {item.packLabel} × {item.qty}</span>
                          </span>
                          <span className="shrink-0 text-forest">{formatINR(item.price * item.qty)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 border-t border-forest/10 pt-2.5 text-[9px] text-charcoal/45">
                      <span>Subtotal {formatINR(order.subtotal)}</span>
                      <span>Shipping {order.shipping === 0 ? "Free" : formatINR(order.shipping)}</span>
                      <span className="font-semibold text-forest">Total {formatINR(order.total)}</span>
                      <span className="uppercase tracking-[0.1em]">
                        {order.payment === "cod" ? "COD request" : "WhatsApp"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-forest/10 bg-cream/30 p-3">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-gold">
                      Deliver to
                    </p>
                    <p className="mt-1.5 text-[10.5px] leading-[1.7] text-charcoal/60">
                      {order.customer.address}, {order.customer.city}, {order.customer.state}{" "}
                      {order.customer.pincode}
                    </p>
                    {order.customer.notes && (
                      <p className="mt-1.5 border-t border-forest/10 pt-1.5 text-[9px] leading-relaxed text-charcoal/45">
                        Note: {order.customer.notes}
                      </p>
                    )}
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <a
                        href={`tel:${order.customer.phone.replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-1 rounded-full border border-forest/15 px-2.5 py-1 text-[8px] text-forest hover:border-gold"
                      >
                        <Phone className="h-3 w-3" /> {order.customer.phone}
                      </a>
                      {order.customer.email && (
                        <a
                          href={`mailto:${order.customer.email}`}
                          className="inline-flex items-center gap-1 rounded-full border border-forest/15 px-2.5 py-1 text-[8px] text-forest hover:border-gold"
                        >
                          <Mail className="h-3 w-3" /> Email
                        </a>
                      )}
                      <a
                        href={waLink(order.customer.phone, message)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-botanical/25 bg-botanical/5 px-2.5 py-1 text-[8px] text-botanical hover:border-botanical"
                      >
                        <MessageCircle className="h-3 w-3" /> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EnquiriesPanel({
  enquiries,
  onChange,
}: {
  enquiries: Enquiry[];
  onChange: (enquiries: Enquiry[]) => void;
}) {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [query, setQuery] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return enquiries.filter((enquiry) => {
      const matchesFilter =
        filter === "all" || (filter === "unread" ? !enquiry.read : enquiry.read);
      const matchesTerm =
        !term ||
        enquiry.name.toLowerCase().includes(term) ||
        enquiry.email.toLowerCase().includes(term) ||
        enquiry.subject.toLowerCase().includes(term) ||
        enquiry.message.toLowerCase().includes(term);
      return matchesFilter && matchesTerm;
    });
  }, [enquiries, filter, query]);

  const setRead = async (enquiry: Enquiry) => {
    setUpdating(enquiry.id);
    setError("");
    try {
      const response = await fetch(`/api/enquiries/${enquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !enquiry.read }),
      });
      const data = (await response.json()) as { enquiry?: Enquiry; error?: string };
      if (!response.ok || !data.enquiry) throw new Error(data.error || "Could not update.");
      onChange(enquiries.map((item) => (item.id === enquiry.id ? data.enquiry! : item)));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not update.");
    } finally {
      setUpdating(null);
    }
  };

  const remove = async (enquiry: Enquiry) => {
    if (!window.confirm(`Delete the message from ${enquiry.name}?`)) return;
    setUpdating(enquiry.id);
    setError("");
    try {
      const response = await fetch(`/api/enquiries/${enquiry.id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "Could not delete.");
      }
      onChange(enquiries.filter((item) => item.id !== enquiry.id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not delete.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div>
        <p className="text-[8px] uppercase tracking-[0.22em] text-gold">Inbox</p>
        <h1 className="mt-1.5 font-serif text-[clamp(1.8rem,3vw,2.5rem)] leading-tight text-forest">
          Enquiries
        </h1>
        <p className="mt-1 text-[10.5px] text-charcoal/45">
          {enquiries.filter((enquiry) => !enquiry.read).length} unread of {enquiries.length} messages
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-forest/30" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="field h-11 pl-10 text-[12px]"
            placeholder="Search name, email or message"
            aria-label="Search enquiries"
          />
        </div>
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as "all" | "unread" | "read")}
          className="field h-11 w-full appearance-none text-[11px] sm:w-44"
          aria-label="Filter enquiries"
        >
          <option value="all">All messages</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-burgundy/25 bg-burgundy/5 px-4 py-3 text-[11px] text-burgundy">
          {error}
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="mt-5 rounded-xl border border-forest/10 bg-ivory px-6 py-14 text-center">
          <MessageSquare className="mx-auto h-8 w-8 text-forest/20" />
          <p className="mt-3 font-serif text-[1.3rem] text-forest">No messages here.</p>
          <p className="mt-1 text-[10.5px] text-charcoal/45">
            Contact form messages will appear in this inbox.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {filtered.map((enquiry) => (
            <article
              key={enquiry.id}
              className={cn(
                "rounded-xl border bg-ivory p-4 transition-colors sm:p-5",
                enquiry.read ? "border-forest/10" : "border-gold/40 shadow-soft",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream text-[10px] font-semibold text-forest">
                    {initials(enquiry.name)}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[11.5px] font-medium text-forest">{enquiry.name}</p>
                      {!enquiry.read && (
                        <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[7.5px] font-semibold uppercase tracking-[0.1em] text-[#8a6f2d]">
                          New
                        </span>
                      )}
                      <span className="text-[8px] uppercase tracking-[0.1em] text-charcoal/35">
                        {enquiry.subject}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[8.5px] text-charcoal/40">
                      {enquiry.email}
                      {enquiry.phone ? ` · ${enquiry.phone}` : ""} · {formatDate(enquiry.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setRead(enquiry)}
                    disabled={updating === enquiry.id}
                    aria-label={enquiry.read ? "Mark as unread" : "Mark as read"}
                    className="grid h-8 w-8 place-items-center rounded-md border border-forest/10 text-charcoal/40 hover:border-botanical hover:text-botanical disabled:opacity-40"
                  >
                    {updating === enquiry.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : enquiry.read ? (
                      <CheckCheck className="h-3.5 w-3.5" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(enquiry)}
                    disabled={updating === enquiry.id}
                    aria-label="Delete message"
                    className="grid h-8 w-8 place-items-center rounded-md border border-forest/10 text-charcoal/35 hover:border-burgundy/40 hover:text-burgundy disabled:opacity-40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <p className="mt-3 whitespace-pre-wrap border-t border-forest/10 pt-3 text-[11px] leading-[1.8] text-charcoal/60">
                {enquiry.message}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={`mailto:${enquiry.email}?subject=${encodeURIComponent(`Re: ${enquiry.subject}`)}`}
                  className="inline-flex items-center gap-1 rounded-full border border-forest/15 px-2.5 py-1 text-[8px] text-forest hover:border-gold"
                >
                  <Mail className="h-3 w-3" /> Reply by email
                </a>
                {enquiry.phone && (
                  <>
                    <a
                      href={`tel:${enquiry.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-1 rounded-full border border-forest/15 px-2.5 py-1 text-[8px] text-forest hover:border-gold"
                    >
                      <Phone className="h-3 w-3" /> Call
                    </a>
                    <a
                      href={waLink(enquiry.phone, `Hi ${enquiry.name.split(" ")[0]}, this is the Tasty Treasures studio.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-botanical/25 bg-botanical/5 px-2.5 py-1 text-[8px] text-botanical hover:border-botanical"
                    >
                      <MessageCircle className="h-3 w-3" /> WhatsApp
                    </a>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function SubscribersPanel({
  subscribers,
  onChange,
}: {
  subscribers: Subscriber[];
  onChange: (subscribers: Subscriber[]) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const remove = async (subscriber: Subscriber) => {
    if (!window.confirm(`Remove ${subscriber.email} from the pantry list?`)) return;
    setBusyId(subscriber.id);
    setError("");
    try {
      const response = await fetch(`/api/subscribers/${subscriber.id}`, { method: "DELETE" });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok) throw new Error(data.error || "Could not remove the subscriber.");
      onChange(subscribers.filter((item) => item.id !== subscriber.id));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not remove the subscriber.");
    } finally {
      setBusyId(null);
    }
  };

  const exportCsv = () => {
    const rows = [
      ["Name", "Email", "Joined"],
      ...subscribers.map((subscriber) => [
        subscriber.name,
        subscriber.email,
        new Date(subscriber.createdAt).toISOString(),
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tasty-treasures-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyEmails = async () => {
    try {
      await navigator.clipboard.writeText(subscribers.map((subscriber) => subscriber.email).join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[8px] uppercase tracking-[0.22em] text-gold">Pantry list</p>
          <h1 className="mt-1.5 font-serif text-[clamp(1.8rem,3vw,2.5rem)] leading-tight text-forest">
            Subscribers
          </h1>
          <p className="mt-1 text-[10.5px] text-charcoal/45">
            {subscribers.length} people have asked for notes from the pantry.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyEmails}
            disabled={subscribers.length === 0}
            className="btn btn-secondary btn-sm"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied" : "Copy emails"}</span>
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={subscribers.length === 0}
            className="btn btn-primary btn-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-burgundy/25 bg-burgundy/5 px-4 py-3 text-[11px] text-burgundy">
          {error}
        </p>
      )}

      {subscribers.length === 0 ? (
        <div className="mt-6 rounded-xl border border-forest/10 bg-ivory px-6 py-14 text-center">
          <Users className="mx-auto h-8 w-8 text-forest/20" />
          <p className="mt-3 font-serif text-[1.3rem] text-forest">The list is quiet.</p>
          <p className="mt-1 text-[10.5px] text-charcoal/45">
            Newsletter sign-ups from the storefront will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-forest/10 bg-ivory">
          <div className="hidden grid-cols-[1fr_1.4fr_120px_46px] gap-4 border-b border-forest/10 bg-cream/50 px-5 py-3 text-[8px] font-semibold uppercase tracking-[0.14em] text-charcoal/40 sm:grid">
            <span>Name</span>
            <span>Email</span>
            <span>Joined</span>
            <span className="text-right">Action</span>
          </div>
          <ul className="divide-y divide-forest/10">
            {subscribers.map((subscriber) => (
              <li key={subscriber.id} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[1fr_1.4fr_120px_46px] sm:items-center sm:gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-cream text-[9px] font-semibold text-forest">
                    {initials(subscriber.name)}
                  </span>
                  <p className="text-[11px] text-forest">{subscriber.name}</p>
                </div>
                <a href={`mailto:${subscriber.email}`} className="text-[10.5px] text-charcoal/55 hover:text-burgundy">
                  {subscriber.email}
                </a>
                <p className="text-[9px] text-charcoal/40">{formatDate(subscriber.createdAt)}</p>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => remove(subscriber)}
                    disabled={busyId === subscriber.id}
                    aria-label={`Remove ${subscriber.email}`}
                    className="grid h-8 w-8 place-items-center rounded-md border border-forest/10 text-charcoal/35 hover:border-burgundy/40 hover:text-burgundy disabled:opacity-40"
                  >
                    {busyId === subscriber.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-4 text-[9px] leading-relaxed text-charcoal/35">
        Export contains names, emails and sign-up dates. Use it only for the pantry notes people
        asked to receive, and honour unsubscribe requests promptly.
      </p>
    </div>
  );
}

export function AdminDashboard({
  products: initialProducts,
  orders: initialOrders,
  enquiries: initialEnquiries,
  subscribers: initialSubscribers,
  content: initialContent,
  integrations,
}: {
  products: Product[];
  orders: Order[];
  enquiries: Enquiry[];
  subscribers: Subscriber[];
  content: SiteContent;
  integrations: IntegrationStatus;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [content, setContent] = useState(initialContent);
  const [signingOut, setSigningOut] = useState(false);

  const signOut = async () => {
    setSigningOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const unread = enquiries.filter((enquiry) => !enquiry.read).length;
  const newOrders = orders.filter((order) => order.status === "new").length;

  const badgeFor = (id: Tab) => {
    if (id === "orders" && newOrders > 0) return String(newOrders);
    if (id === "enquiries" && unread > 0) return String(unread);
    return null;
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-forest/10 bg-ivory lg:flex">
        <div className="border-b border-forest/10 px-5 py-5">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="relative grid h-10 w-10 place-items-center rounded-full border border-gold/50 text-forest">
              <LeafMark className="h-5 w-5" />
              <span className="absolute -right-0.5 top-1 h-1.5 w-1.5 rounded-full bg-gold" />
            </span>
            <span>
              <span className="block font-serif text-[1rem] leading-none text-forest">Tasty Treasures</span>
              <span className="mt-1 block text-[6.5px] font-semibold uppercase tracking-[0.3em] text-charcoal/40">
                The studio
              </span>
            </span>
          </Link>
        </div>

        <nav aria-label="Studio sections" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const badge = badgeFor(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-current={tab === item.id ? "page" : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[10.5px] transition-colors",
                  tab === item.id
                    ? "bg-forest text-ivory"
                    : "text-charcoal/55 hover:bg-cream hover:text-forest",
                )}
              >
                <item.icon
                  className={cn("h-4 w-4 shrink-0", tab === item.id ? "text-gold" : "text-charcoal/35")}
                  strokeWidth={1.6}
                />
                <span className="flex-1 text-left">{item.label}</span>
                {badge && (
                  <span
                    className={cn(
                      "grid h-4 min-w-4 place-items-center rounded-full px-1 text-[7.5px] font-semibold",
                      tab === item.id ? "bg-gold text-forest" : "bg-burgundy text-ivory",
                    )}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-forest/10 px-3 py-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-[9.5px] text-charcoal/50 hover:bg-cream hover:text-forest"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View storefront
          </Link>
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[9.5px] text-charcoal/50 hover:bg-burgundy/5 hover:text-burgundy disabled:opacity-50"
          >
            {signingOut ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
            {signingOut ? "Signing out" : "Sign out"}
          </button>
          <p className="mt-3 px-3 text-[7.5px] uppercase tracking-[0.16em] text-charcoal/25">
            Protected studio · {content.site.name}
          </p>
        </div>
      </aside>

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 border-b border-forest/10 bg-cream/90 backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <span className="grid h-8 w-8 place-items-center rounded-full border border-gold/40 text-forest">
                <LeafMark className="h-4 w-4" />
              </span>
              <div>
                <p className="font-serif text-[0.95rem] leading-none text-forest">Tasty Treasures</p>
                <p className="mt-1 text-[6.5px] uppercase tracking-[0.26em] text-charcoal/40">The studio</p>
              </div>
            </div>

            <div className="hidden items-center gap-2 text-[8.5px] uppercase tracking-[0.16em] text-charcoal/35 lg:flex">
              <span>Studio</span>
              <span className="text-gold">/</span>
              <span className="text-forest">{navItems.find((item) => item.id === tab)?.label}</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                target="_blank"
                className="hidden items-center gap-1.5 rounded-full border border-forest/15 px-3 py-1.5 text-[8px] uppercase tracking-[0.1em] text-forest hover:border-gold sm:inline-flex"
              >
                <ExternalLink className="h-3 w-3" /> Storefront
              </Link>
              <button
                type="button"
                onClick={signOut}
                disabled={signingOut}
                className="grid h-8 w-8 place-items-center rounded-full border border-forest/15 text-charcoal/45 hover:border-burgundy/40 hover:text-burgundy lg:hidden"
                aria-label="Sign out"
              >
                {signingOut ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
              </button>
              <span className="hidden text-[9px] text-charcoal/35 xl:block">
                Signed in as the studio
              </span>
            </div>
          </div>

          <nav aria-label="Studio sections" className="no-scrollbar flex gap-1 overflow-x-auto border-t border-forest/8 px-3 py-2 lg:hidden">
            {navItems.map((item) => {
              const badge = badgeFor(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={cn(
                    "relative flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[8.5px] font-medium uppercase tracking-[0.08em]",
                    tab === item.id ? "bg-forest text-ivory" : "text-charcoal/45 hover:bg-cream",
                  )}
                >
                  <item.icon className="h-3 w-3" />
                  {item.label}
                  {badge && (
                    <span className="grid h-3.5 min-w-3.5 place-items-center rounded-full bg-gold px-1 text-[6.5px] font-semibold text-forest">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </header>

        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {tab === "overview" && (
            <Overview
              products={products}
              orders={orders}
              enquiries={enquiries}
              subscribers={subscribers}
              integrations={integrations}
              onTab={setTab}
            />
          )}
          {tab === "products" && <ProductsPanel products={products} onChange={setProducts} />}
          {tab === "orders" && (
            <OrdersPanel
              orders={orders}
              onChange={setOrders}
              siteName={content.site.name}
              delhiveryReady={integrations.delhivery && integrations.delhiveryPickup}
            />
          )}
          {tab === "enquiries" && (
            <EnquiriesPanel enquiries={enquiries} onChange={setEnquiries} />
          )}
          {tab === "subscribers" && (
            <SubscribersPanel subscribers={subscribers} onChange={setSubscribers} />
          )}
          {tab === "content" && <ContentPanel content={content} onSaved={setContent} />}
          {tab === "integrations" && <IntegrationsPanel status={integrations} />}
        </main>
      </div>
    </div>
  );
}

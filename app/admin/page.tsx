import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { getIntegrationStatus } from "@/lib/integrations";
import {
  getContent,
  getEnquiries,
  getOrders,
  getProducts,
  getSubscribers,
} from "@/lib/store";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "The studio",
  description: "Private Tasty Treasures administration.",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  const [products, orders, enquiries, subscribers, content] = await Promise.all([
    getProducts(),
    getOrders(),
    getEnquiries(),
    getSubscribers(),
    getContent(),
  ]);

  return (
    <AdminDashboard
      products={products}
      orders={orders}
      enquiries={enquiries}
      subscribers={subscribers}
      content={content}
      integrations={getIntegrationStatus()}
    />
  );
}

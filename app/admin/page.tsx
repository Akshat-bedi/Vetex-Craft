import Link from "next/link";
import {
  DollarSign,
  Package,
  ShoppingCart,
  Ticket,
} from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { OrderStatusBadge } from "@/components/public/OrderStatusBadge";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    monthOrders,
    pendingOrders,
    totalProducts,
    activeCoupons,
    recentOrders,
    settings,
  ] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: monthStart }, status: { not: "CANCELLED" } },
      select: { total: true },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.count(),
    prisma.coupon.count({ where: { active: true } }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
  ]);

  const monthRevenue = monthOrders.reduce((sum, order) => sum + order.total, 0);
  const currency = settings?.currency ?? "USD";

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Revenue (this month)"
          value={formatPrice(monthRevenue, currency)}
          icon={DollarSign}
        />
        <StatsCard
          label="Pending orders"
          value={pendingOrders}
          icon={ShoppingCart}
        />
        <StatsCard label="Total products" value={totalProducts} icon={Package} />
        <StatsCard label="Active coupons" value={activeCoupons} icon={Ticket} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/admin/products/new">Add New Product</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/orders?status=PENDING">View Pending Orders</Link>
        </Button>
      </div>

      <section>
        <h2 className="mb-4 font-pixel text-xs text-text-gold">RECENT ORDERS</h2>
        <div className="border-[3px] border-[#555] bg-bg-card shadow-pixel">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#555] font-retro text-text-gold">
                <th className="p-3">Order</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-[#555]/50 font-body text-sm">
                  <td className="p-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-text-accent hover:underline"
                    >
                      #{order.id.slice(-8)}
                    </Link>
                  </td>
                  <td className="p-3">{order.customerName}</td>
                  <td className="p-3 font-retro text-text-gold">
                    {formatPrice(order.total, currency)}
                  </td>
                  <td className="p-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="p-3 text-text-secondary">
                    {order.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center font-retro text-text-secondary">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

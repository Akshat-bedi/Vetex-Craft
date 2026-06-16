import { OrdersTable } from "@/components/admin/OrdersTable";

type PageProps = {
  searchParams: { status?: string };
};

export default function AdminOrdersPage({ searchParams }: PageProps) {
  return (
    <div className="space-y-6">
      <p className="font-retro text-lg text-text-secondary">
        {searchParams.status
          ? `Showing ${searchParams.status} orders`
          : "All customer orders"}
      </p>
      <OrdersTable statusFilter={searchParams.status} />
    </div>
  );
}

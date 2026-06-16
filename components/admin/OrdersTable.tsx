"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/admin/DataTable";
import { OrderStatusBadge } from "@/components/public/OrderStatusBadge";
import { adminFetch } from "@/lib/admin-fetch";
import { formatPrice } from "@/lib/utils";

type OrderRow = {
  id: string;
  customerName: string;
  customerEmail: string;
  status: string;
  total: number;
  createdAt: string;
  itemCount: number;
};

export function OrdersTable({ statusFilter }: { statusFilter?: string }) {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = statusFilter
      ? `/api/orders?status=${statusFilter}&limit=100`
      : "/api/orders?limit=100";

    adminFetch<OrderRow[]>(url)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const columns: ColumnDef<OrderRow, unknown>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => (
        <Link
          href={`/admin/orders/${row.original.id}`}
          className="font-mono text-text-accent hover:underline"
        >
          #{row.original.id.slice(-8)}
        </Link>
      ),
    },
    { accessorKey: "customerName", header: "Customer" },
    { accessorKey: "customerEmail", header: "Email" },
    {
      id: "items",
      header: "Items",
      accessorFn: (row) => row.itemCount,
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => (
        <span className="font-retro text-text-gold">
          {formatPrice(row.original.total)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleString(),
    },
  ];

  if (loading) {
    return <p className="font-retro text-text-secondary">Loading orders...</p>;
  }

  return (
    <DataTable
      columns={columns}
      data={orders}
      searchPlaceholder="Search orders..."
      searchColumn="customerName"
    />
  );
}

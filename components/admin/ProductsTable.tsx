"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminFetch } from "@/lib/admin-fetch";
import { formatPrice } from "@/lib/utils";
import { parseStringArray } from "@/lib/product";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  price: number;
  status: string;
  featured: boolean;
  category?: { name: string; slug: string };
  images: string[];
  stock?: number;
};

export function ProductsTable() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await adminFetch<ProductRow[]>("/api/products?all=true");
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminFetch(`/api/products/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  const columns: ColumnDef<ProductRow, unknown>[] = [
    {
      id: "thumb",
      header: "",
      cell: ({ row }) => {
        const images = Array.isArray(row.original.images)
          ? row.original.images
          : parseStringArray(row.original.images);
        const src = images[0] ?? "/textures/stone.png";
        return (
          <div className="relative h-10 w-10 bg-bg-secondary">
            <Image src={src} alt="" fill unoptimized className="object-contain" />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <Link
          href={`/admin/products/${row.original.id}`}
          className="font-retro text-text-accent hover:underline"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      id: "category",
      header: "Category",
      accessorFn: (row) => row.category?.name ?? "—",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-retro text-text-gold">
          {formatPrice(row.original.price)}
        </span>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) =>
        row.original.stock === -1 ? "∞" : row.original.stock ?? "—",
    },
    {
      accessorKey: "featured",
      header: "Featured",
      cell: ({ row }) => (row.original.featured ? "Yes" : "No"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "PUBLISHED" ? "default" : "secondary"}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button asChild size="sm" variant="outline">
            <Link href={`/admin/products/${row.original.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setDeleteId(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <p className="font-retro text-text-secondary">Loading products...</p>;
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={products}
        searchPlaceholder="Search products..."
        searchColumn="name"
      />
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete product?"
        description="This cannot be undone. Products with orders will be archived instead."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  );
}

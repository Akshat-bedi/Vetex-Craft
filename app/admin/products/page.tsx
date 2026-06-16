import Link from "next/link";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { Button } from "@/components/ui/button";

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="font-retro text-lg text-text-secondary">
          Manage your store catalog
        </p>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>
      <ProductsTable />
    </div>
  );
}

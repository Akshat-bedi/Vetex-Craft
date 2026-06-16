"use client";

import { useEffect, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminFetch } from "@/lib/admin-fetch";
import { slugify } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
  productCount?: number;
};

const empty = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  displayOrder: 0,
};

export function CategoriesManager() {
  const [items, setItems] = useState<Category[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await adminFetch<Category[]>("/api/categories");
    setItems(data);
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  function openCreate() {
    setEditId(null);
    setForm(empty);
    setOpen(true);
  }

  function openEdit(row: Category) {
    setEditId(row.id);
    setForm({
      name: row.name,
      slug: row.slug,
      description: row.description ?? "",
      imageUrl: row.imageUrl ?? "",
      displayOrder: row.displayOrder,
    });
    setOpen(true);
  }

  async function save() {
    setLoading(true);
    try {
      const payload = {
        ...form,
        description: form.description || null,
        imageUrl: form.imageUrl || null,
        slug: form.slug || slugify(form.name),
      };
      if (editId) {
        await adminFetch(`/api/categories/${editId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/api/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setOpen(false);
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    if (!deleteId) return;
    setLoading(true);
    try {
      await adminFetch(`/api/categories/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  const columns: ColumnDef<Category, unknown>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "slug", header: "Slug" },
    { accessorKey: "productCount", header: "Products" },
    { accessorKey: "displayOrder", header: "Order" },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => openEdit(row.original)}>
            <Pencil className="h-4 w-4" />
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

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" /> Add Category
        </Button>
      </div>
      <DataTable columns={columns} data={items} searchColumn="name" />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-[3px] border-[#555] bg-bg-card">
          <DialogHeader>
            <DialogTitle className="font-pixel text-xs">
              {editId ? "EDIT CATEGORY" : "NEW CATEGORY"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="font-retro">Name</Label>
              <Input
                value={form.name}
                onChange={(event) =>
                  setForm({
                    ...form,
                    name: event.target.value,
                    slug: editId ? form.slug : slugify(event.target.value),
                  })
                }
                className="font-retro"
              />
            </div>
            <div>
              <Label className="font-retro">Slug</Label>
              <Input
                value={form.slug}
                onChange={(event) => setForm({ ...form, slug: event.target.value })}
                className="font-retro"
              />
            </div>
            <div>
              <Label className="font-retro">Description</Label>
              <Textarea
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
              />
            </div>
            <div>
              <Label className="font-retro">Image URL</Label>
              <Input
                value={form.imageUrl}
                onChange={(event) =>
                  setForm({ ...form, imageUrl: event.target.value })
                }
                className="font-retro"
              />
            </div>
            <div>
              <Label className="font-retro">Display order</Label>
              <Input
                type="number"
                value={form.displayOrder}
                onChange={(event) =>
                  setForm({
                    ...form,
                    displayOrder: parseInt(event.target.value, 10) || 0,
                  })
                }
                className="font-retro"
              />
            </div>
            <Button onClick={save} disabled={loading} className="w-full">
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete category?"
        description="Products must be reassigned first."
        onConfirm={remove}
        loading={loading}
      />
    </>
  );
}

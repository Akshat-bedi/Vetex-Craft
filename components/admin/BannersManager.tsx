"use client";

import { useEffect, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { adminFetch } from "@/lib/admin-fetch";

type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  ctaText: string | null;
  ctaLink: string | null;
  active: boolean;
  displayOrder: number;
};

const empty = {
  title: "",
  subtitle: "",
  imageUrl: "",
  ctaText: "",
  ctaLink: "",
  active: true,
  displayOrder: 0,
};

export function BannersManager() {
  const [items, setItems] = useState<Banner[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await adminFetch<Banner[]>("/api/banners");
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

  function openEdit(row: Banner) {
    setEditId(row.id);
    setForm({
      title: row.title,
      subtitle: row.subtitle ?? "",
      imageUrl: row.imageUrl,
      ctaText: row.ctaText ?? "",
      ctaLink: row.ctaLink ?? "",
      active: row.active,
      displayOrder: row.displayOrder,
    });
    setOpen(true);
  }

  async function save() {
    if (!form.imageUrl) {
      alert("Image is required");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        subtitle: form.subtitle || null,
        ctaText: form.ctaText || null,
        ctaLink: form.ctaLink || null,
      };
      if (editId) {
        await adminFetch(`/api/banners/${editId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/api/banners", {
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
      await adminFetch(`/api/banners/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  const columns: ColumnDef<Banner, unknown>[] = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "displayOrder", header: "Order" },
    {
      accessorKey: "active",
      header: "Active",
      cell: ({ row }) => (
        <Badge variant={row.original.active ? "default" : "secondary"}>
          {row.original.active ? "Yes" : "No"}
        </Badge>
      ),
    },
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
          <Plus className="mr-1 h-4 w-4" /> Add Banner
        </Button>
      </div>
      <DataTable columns={columns} data={items} searchColumn="title" />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-[3px] border-[#555] bg-bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-pixel text-xs">
              {editId ? "EDIT BANNER" : "NEW BANNER"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="font-retro">Title</Label>
              <Input
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                className="font-retro"
              />
            </div>
            <div>
              <Label className="font-retro">Subtitle</Label>
              <Input
                value={form.subtitle}
                onChange={(event) =>
                  setForm({ ...form, subtitle: event.target.value })
                }
                className="font-retro"
              />
            </div>
            <div>
              <Label className="font-retro">Background image</Label>
              <ImageUploader
                endpoint="siteAsset"
                value={form.imageUrl ? [form.imageUrl] : []}
                onChange={(urls) =>
                  setForm({ ...form, imageUrl: urls[0] ?? "" })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="font-retro">CTA text</Label>
                <Input
                  value={form.ctaText}
                  onChange={(event) =>
                    setForm({ ...form, ctaText: event.target.value })
                  }
                  className="font-retro"
                />
              </div>
              <div>
                <Label className="font-retro">CTA link</Label>
                <Input
                  value={form.ctaLink}
                  onChange={(event) =>
                    setForm({ ...form, ctaLink: event.target.value })
                  }
                  className="font-retro"
                />
              </div>
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
            <div className="flex items-center gap-2">
              <Switch
                checked={form.active}
                onCheckedChange={(checked) => setForm({ ...form, active: checked })}
              />
              <Label className="font-retro">Active</Label>
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
        title="Delete banner?"
        description="This will remove the hero banner."
        onConfirm={remove}
        loading={loading}
      />
    </>
  );
}

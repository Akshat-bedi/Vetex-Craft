"use client";

import { useEffect, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { adminFetch } from "@/lib/admin-fetch";

type Testimonial = {
  id: string;
  username: string;
  avatarUrl: string | null;
  review: string;
  rating: number;
  active: boolean;
};

const empty = {
  username: "",
  avatarUrl: "",
  review: "",
  rating: 5,
  active: true,
};

export function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await adminFetch<Testimonial[]>("/api/testimonials");
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

  function openEdit(row: Testimonial) {
    setEditId(row.id);
    setForm({
      username: row.username,
      avatarUrl: row.avatarUrl ?? "",
      review: row.review,
      rating: row.rating,
      active: row.active,
    });
    setOpen(true);
  }

  async function save() {
    setLoading(true);
    try {
      const payload = {
        ...form,
        avatarUrl: form.avatarUrl || null,
      };
      if (editId) {
        await adminFetch(`/api/testimonials/${editId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/api/testimonials", {
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
      await adminFetch(`/api/testimonials/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  const columns: ColumnDef<Testimonial, unknown>[] = [
    { accessorKey: "username", header: "Username" },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => `${row.original.rating}/5`,
    },
    {
      accessorKey: "review",
      header: "Review",
      cell: ({ row }) => (
        <span className="line-clamp-2 max-w-xs">{row.original.review}</span>
      ),
    },
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
          <Plus className="mr-1 h-4 w-4" /> Add Testimonial
        </Button>
      </div>
      <DataTable columns={columns} data={items} searchColumn="username" />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-[3px] border-[#555] bg-bg-card">
          <DialogHeader>
            <DialogTitle className="font-pixel text-xs">
              {editId ? "EDIT TESTIMONIAL" : "NEW TESTIMONIAL"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="font-retro">Username / IGN</Label>
              <Input
                value={form.username}
                onChange={(event) =>
                  setForm({ ...form, username: event.target.value })
                }
                className="font-retro"
              />
            </div>
            <div>
              <Label className="font-retro">Avatar URL</Label>
              <Input
                value={form.avatarUrl}
                onChange={(event) =>
                  setForm({ ...form, avatarUrl: event.target.value })
                }
                className="font-retro"
              />
            </div>
            <div>
              <Label className="font-retro">Review</Label>
              <Textarea
                value={form.review}
                onChange={(event) =>
                  setForm({ ...form, review: event.target.value })
                }
              />
            </div>
            <div>
              <Label className="font-retro">Rating (1-5)</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={form.rating}
                onChange={(event) =>
                  setForm({
                    ...form,
                    rating: parseInt(event.target.value, 10) || 5,
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
        title="Delete testimonial?"
        description="This will remove the review from the homepage."
        onConfirm={remove}
        loading={loading}
      />
    </>
  );
}

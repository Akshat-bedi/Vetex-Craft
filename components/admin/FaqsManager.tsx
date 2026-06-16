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

type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
};

const empty = {
  question: "",
  answer: "",
  category: "General",
  displayOrder: 0,
};

export function FaqsManager() {
  const [items, setItems] = useState<Faq[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await adminFetch<Faq[]>("/api/faqs");
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

  function openEdit(row: Faq) {
    setEditId(row.id);
    setForm({
      question: row.question,
      answer: row.answer,
      category: row.category,
      displayOrder: row.displayOrder,
    });
    setOpen(true);
  }

  async function save() {
    setLoading(true);
    try {
      if (editId) {
        await adminFetch(`/api/faqs/${editId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await adminFetch("/api/faqs", {
          method: "POST",
          body: JSON.stringify(form),
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
      await adminFetch(`/api/faqs/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  const columns: ColumnDef<Faq, unknown>[] = [
    { accessorKey: "category", header: "Category" },
    { accessorKey: "question", header: "Question" },
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
          <Plus className="mr-1 h-4 w-4" /> Add FAQ
        </Button>
      </div>
      <DataTable columns={columns} data={items} searchColumn="question" />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-[3px] border-[#555] bg-bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-pixel text-xs">
              {editId ? "EDIT FAQ" : "NEW FAQ"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="font-retro">Category</Label>
              <Input
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
                }
                className="font-retro"
              />
            </div>
            <div>
              <Label className="font-retro">Question</Label>
              <Input
                value={form.question}
                onChange={(event) =>
                  setForm({ ...form, question: event.target.value })
                }
                className="font-retro"
              />
            </div>
            <div>
              <Label className="font-retro">Answer</Label>
              <Textarea
                rows={5}
                value={form.answer}
                onChange={(event) =>
                  setForm({ ...form, answer: event.target.value })
                }
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
        title="Delete FAQ?"
        description="This will permanently remove the FAQ entry."
        onConfirm={remove}
        loading={loading}
      />
    </>
  );
}

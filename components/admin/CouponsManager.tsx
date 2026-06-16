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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminFetch } from "@/lib/admin-fetch";

type Coupon = {
  code: string;
  type: string;
  value: number;
  minOrderValue: number;
  usageLimit: number;
  timesUsed: number;
  expiryDate: string | null;
  active: boolean;
};

const empty = {
  code: "",
  type: "PERCENTAGE",
  value: 10,
  minOrderValue: 0,
  usageLimit: 0,
  expiryDate: "",
  active: true,
};

export function CouponsManager() {
  const [items, setItems] = useState<Coupon[]>([]);
  const [form, setForm] = useState(empty);
  const [editCode, setEditCode] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteCode, setDeleteCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const data = await adminFetch<Coupon[]>("/api/coupons");
    setItems(data);
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  function openCreate() {
    setEditCode(null);
    setForm(empty);
    setOpen(true);
  }

  function openEdit(row: Coupon) {
    setEditCode(row.code);
    setForm({
      code: row.code,
      type: row.type,
      value: row.value,
      minOrderValue: row.minOrderValue,
      usageLimit: row.usageLimit,
      expiryDate: row.expiryDate
        ? new Date(row.expiryDate).toISOString().slice(0, 16)
        : "",
      active: row.active,
    });
    setOpen(true);
  }

  async function save() {
    setLoading(true);
    try {
      const payload = {
        code: form.code.toUpperCase(),
        type: form.type,
        value: form.value,
        minOrderValue: form.minOrderValue,
        usageLimit: form.usageLimit,
        expiryDate: form.expiryDate
          ? new Date(form.expiryDate).toISOString()
          : null,
        active: form.active,
      };
      if (editCode) {
        await adminFetch(`/api/coupons/${editCode}`, {
          method: "PUT",
          body: JSON.stringify({
            type: payload.type,
            value: payload.value,
            minOrderValue: payload.minOrderValue,
            usageLimit: payload.usageLimit,
            expiryDate: payload.expiryDate,
            active: payload.active,
          }),
        });
      } else {
        await adminFetch("/api/coupons", {
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
    if (!deleteCode) return;
    setLoading(true);
    try {
      await adminFetch(`/api/coupons/${deleteCode}`, { method: "DELETE" });
      setDeleteCode(null);
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  const columns: ColumnDef<Coupon, unknown>[] = [
    { accessorKey: "code", header: "Code" },
    { accessorKey: "type", header: "Type" },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) =>
        row.original.type === "PERCENTAGE"
          ? `${row.original.value}%`
          : `$${row.original.value}`,
    },
    { accessorKey: "timesUsed", header: "Used" },
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
            onClick={() => setDeleteCode(row.original.code)}
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
          <Plus className="mr-1 h-4 w-4" /> Add Coupon
        </Button>
      </div>
      <DataTable columns={columns} data={items} searchColumn="code" />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-[3px] border-[#555] bg-bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-pixel text-xs">
              {editCode ? "EDIT COUPON" : "NEW COUPON"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="font-retro">Code</Label>
              <Input
                value={form.code}
                disabled={!!editCode}
                onChange={(event) =>
                  setForm({ ...form, code: event.target.value.toUpperCase() })
                }
                className="font-retro uppercase"
              />
            </div>
            <div>
              <Label className="font-retro">Type</Label>
              <Select
                value={form.type}
                onValueChange={(value) => setForm({ ...form, type: value })}
              >
                <SelectTrigger className="font-retro">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                  <SelectItem value="FIXED">Fixed amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="font-retro">Value</Label>
                <Input
                  type="number"
                  value={form.value}
                  onChange={(event) =>
                    setForm({ ...form, value: parseFloat(event.target.value) || 0 })
                  }
                  className="font-retro"
                />
              </div>
              <div>
                <Label className="font-retro">Min order</Label>
                <Input
                  type="number"
                  value={form.minOrderValue}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      minOrderValue: parseFloat(event.target.value) || 0,
                    })
                  }
                  className="font-retro"
                />
              </div>
            </div>
            <div>
              <Label className="font-retro">Usage limit (0 = unlimited)</Label>
              <Input
                type="number"
                value={form.usageLimit}
                onChange={(event) =>
                  setForm({
                    ...form,
                    usageLimit: parseInt(event.target.value, 10) || 0,
                  })
                }
                className="font-retro"
              />
            </div>
            <div>
              <Label className="font-retro">Expiry date</Label>
              <Input
                type="datetime-local"
                value={form.expiryDate}
                onChange={(event) =>
                  setForm({ ...form, expiryDate: event.target.value })
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
        open={!!deleteCode}
        onOpenChange={(o) => !o && setDeleteCode(null)}
        title="Delete coupon?"
        description="This will permanently remove the coupon."
        onConfirm={remove}
        loading={loading}
      />
    </>
  );
}

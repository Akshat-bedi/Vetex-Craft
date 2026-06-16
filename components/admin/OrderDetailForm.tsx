"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { OrderStatusBadge } from "@/components/public/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminFetch } from "@/lib/admin-fetch";
import { formatPrice } from "@/lib/utils";

const STATUSES = ["PENDING", "PROCESSING", "DELIVERED", "CANCELLED"] as const;

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    slug: string;
    images: string[];
    deliveryInstructions: string | null;
  };
};

type OrderDetail = {
  id: string;
  customerName: string;
  customerEmail: string;
  discordUsername: string | null;
  status: string;
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string | null;
  stripeSessionId: string | null;
  internalNotes: string | null;
  createdAt: string;
  items: OrderItem[];
};

export function OrderDetailForm({ order: initial }: { order: OrderDetail }) {
  const router = useRouter();
  const [order, setOrder] = useState(initial);
  const [status, setStatus] = useState(initial.status);
  const [internalNotes, setInternalNotes] = useState(initial.internalNotes ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await adminFetch<OrderDetail>(`/api/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status, internalNotes: internalNotes || null }),
      });
      setOrder(updated);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div className="border-[3px] border-[#555] bg-bg-card p-6 shadow-pixel">
          <div className="flex items-center justify-between">
            <h2 className="font-pixel text-xs text-text-gold">
              ORDER #{order.id.slice(-8).toUpperCase()}
            </h2>
            <OrderStatusBadge status={order.status} />
          </div>
          <dl className="mt-4 space-y-2 font-body text-sm">
            <div>
              <dt className="text-text-secondary">Customer</dt>
              <dd>{order.customerName}</dd>
            </div>
            <div>
              <dt className="text-text-secondary">Email</dt>
              <dd>{order.customerEmail}</dd>
            </div>
            {order.discordUsername && (
              <div>
                <dt className="text-text-secondary">Discord</dt>
                <dd>{order.discordUsername}</dd>
              </div>
            )}
            {order.couponCode && (
              <div>
                <dt className="text-text-secondary">Coupon</dt>
                <dd>{order.couponCode}</dd>
              </div>
            )}
            <div>
              <dt className="text-text-secondary">Placed</dt>
              <dd>{new Date(order.createdAt).toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        <div className="border-[3px] border-[#555] bg-bg-card p-6 shadow-pixel">
          <h3 className="font-pixel text-xs text-text-gold">ITEMS</h3>
          <ul className="mt-4 space-y-3">
            {order.items.map((item) => (
              <li key={item.id} className="flex gap-3 border-b border-[#555]/50 pb-3">
                <div className="relative h-12 w-12 bg-bg-secondary">
                  <Image
                    src={item.product.images[0] ?? "/textures/stone.png"}
                    alt=""
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="font-retro">{item.product.name}</p>
                  <p className="text-sm text-text-secondary">
                    ×{item.quantity} — {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 font-retro">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-accent-green">
                <span>Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg text-text-gold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 border-[3px] border-[#555] bg-bg-card p-6 shadow-pixel h-fit">
        <h3 className="font-pixel text-xs text-text-gold">UPDATE STATUS</h3>
        <div className="space-y-2">
          <Label className="font-retro">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="border-[3px] border-[#555] bg-bg-secondary font-retro">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="font-retro">Internal notes (admin only)</Label>
          <Textarea
            rows={5}
            value={internalNotes}
            onChange={(event) => setInternalNotes(event.target.value)}
            className="border-[3px] border-[#555] bg-bg-secondary font-body"
          />
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full font-retro">
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}

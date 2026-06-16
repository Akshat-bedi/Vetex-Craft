"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminFetch } from "@/lib/admin-fetch";
import { slugify } from "@/lib/utils";

type Category = { id: string; name: string; slug: string };

export type ProductFormData = {
  id?: string;
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  longDescription: string;
  images: string[];
  price: number;
  comparePrice: number | null;
  tier: string;
  tags: string[];
  whatsIncluded: string[];
  stock: number;
  featured: boolean;
  status: string;
  paymentLink: string;
  deliveryInstructions: string;
};

const TIERS = ["WOOD", "IRON", "GOLD", "DIAMOND", "NETHERITE"] as const;
const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

const emptyForm: ProductFormData = {
  name: "",
  slug: "",
  categoryId: "",
  shortDescription: "",
  longDescription: "",
  images: [],
  price: 0,
  comparePrice: null,
  tier: "WOOD",
  tags: [],
  whatsIncluded: [],
  stock: -1,
  featured: false,
  status: "DRAFT",
  paymentLink: "",
  deliveryInstructions: "",
};

type ProductFormProps = {
  initial?: Partial<ProductFormData>;
  productId?: string;
};

export function ProductForm({ initial, productId }: ProductFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>({
    ...emptyForm,
    ...initial,
    comparePrice: initial?.comparePrice ?? null,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [includedInput, setIncludedInput] = useState("");
  const [slugManual, setSlugManual] = useState(!!initial?.slug);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminFetch<Category[]>("/api/categories")
      .then(setCategories)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!slugManual && form.name) {
      setForm((current) => ({ ...current, slug: slugify(form.name) }));
    }
  }, [form.name, slugManual]);

  function updateField<K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function addTag() {
    const tag = tagInput.trim().replace(/^#/, "");
    if (tag && !form.tags.includes(tag)) {
      updateField("tags", [...form.tags, tag]);
      setTagInput("");
    }
  }

  function addIncluded() {
    const item = includedInput.trim();
    if (item && !form.whatsIncluded.includes(item)) {
      updateField("whatsIncluded", [...form.whatsIncluded, item]);
      setIncludedInput("");
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      ...form,
      images: form.images.filter(Boolean),
      comparePrice: form.comparePrice || null,
      paymentLink: form.paymentLink || null,
      shortDescription: form.shortDescription || null,
      longDescription: form.longDescription || null,
      deliveryInstructions: form.deliveryInstructions || null,
    };

    try {
      if (productId) {
        await adminFetch(`/api/products/${productId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/api/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {error && (
        <p className="border-2 border-accent-red bg-bg-nether p-3 font-retro text-accent-red">
          {error}
        </p>
      )}

      <section className="space-y-4 border-[3px] border-[#555] bg-bg-card p-6 shadow-pixel">
        <h2 className="font-pixel text-xs text-text-gold">BASIC INFO</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="font-retro">Name *</Label>
            <Input
              required
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="border-[3px] border-[#555] bg-bg-secondary font-retro"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-retro">Slug *</Label>
            <Input
              required
              value={form.slug}
              onChange={(event) => {
                setSlugManual(true);
                updateField("slug", event.target.value);
              }}
              className="border-[3px] border-[#555] bg-bg-secondary font-retro"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="font-retro">Category *</Label>
          <Select
            value={form.categoryId}
            onValueChange={(value) => updateField("categoryId", value)}
            required
          >
            <SelectTrigger className="border-[3px] border-[#555] bg-bg-secondary font-retro">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="font-retro">Short description (max 160)</Label>
          <Textarea
            maxLength={160}
            value={form.shortDescription}
            onChange={(event) =>
              updateField("shortDescription", event.target.value)
            }
            className="border-[3px] border-[#555] bg-bg-secondary font-body"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-retro">Long description (Markdown)</Label>
          <Textarea
            rows={8}
            value={form.longDescription}
            onChange={(event) =>
              updateField("longDescription", event.target.value)
            }
            className="border-[3px] border-[#555] bg-bg-secondary font-body font-mono text-sm"
          />
        </div>
      </section>

      <section className="space-y-4 border-[3px] border-[#555] bg-bg-card p-6 shadow-pixel">
        <h2 className="font-pixel text-xs text-text-gold">YOUTUBE VIDEOS</h2>
        <p className="font-body text-sm text-text-secondary">
          Add one or more YouTube video links. Customers will see video
          thumbnails and open the video on YouTube when they click.
        </p>
        <div className="space-y-2">
          {form.images.map((url, index) => (
            <div key={`${url}-${index}`} className="flex gap-2">
              <Input
                type="url"
                required
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(event) => {
                  const next = [...form.images];
                  next[index] = event.target.value;
                  updateField("images", next);
                }}
                className="border-[3px] border-[#555] bg-bg-secondary font-retro"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  updateField(
                    "images",
                    form.images.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => updateField("images", [...form.images, ""])}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add video link
        </Button>
      </section>

      <section className="space-y-4 border-[3px] border-[#555] bg-bg-card p-6 shadow-pixel">
        <h2 className="font-pixel text-xs text-text-gold">PRICING & TIER</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label className="font-retro">Price *</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              required
              value={form.price || ""}
              onChange={(event) =>
                updateField("price", parseFloat(event.target.value) || 0)
              }
              className="border-[3px] border-[#555] bg-bg-secondary font-retro"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-retro">Compare price</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={form.comparePrice ?? ""}
              onChange={(event) =>
                updateField(
                  "comparePrice",
                  event.target.value
                    ? parseFloat(event.target.value)
                    : null,
                )
              }
              className="border-[3px] border-[#555] bg-bg-secondary font-retro"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-retro">Stock (-1 = unlimited)</Label>
            <Input
              type="number"
              value={form.stock}
              onChange={(event) =>
                updateField("stock", parseInt(event.target.value, 10) || -1)
              }
              className="border-[3px] border-[#555] bg-bg-secondary font-retro"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="font-retro">Tier</Label>
            <Select value={form.tier} onValueChange={(v) => updateField("tier", v)}>
              <SelectTrigger className="border-[3px] border-[#555] bg-bg-secondary font-retro">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIERS.map((tier) => (
                  <SelectItem key={tier} value={tier}>
                    {tier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="font-retro">Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => updateField("status", v)}
            >
              <SelectTrigger className="border-[3px] border-[#555] bg-bg-secondary font-retro">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={form.featured}
            onCheckedChange={(checked) => updateField("featured", checked)}
          />
          <Label className="font-retro">Featured on homepage</Label>
        </div>
      </section>

      <section className="space-y-4 border-[3px] border-[#555] bg-bg-card p-6 shadow-pixel">
        <h2 className="font-pixel text-xs text-text-gold">TAGS</h2>
        <div className="flex flex-wrap gap-2">
          {form.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 border border-black bg-bg-stone px-2 font-retro text-sm"
            >
              #{tag}
              <button
                type="button"
                onClick={() =>
                  updateField(
                    "tags",
                    form.tags.filter((item) => item !== tag),
                  )
                }
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add tag"
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), addTag())}
            className="border-[3px] border-[#555] bg-bg-secondary font-retro"
          />
          <Button type="button" variant="outline" onClick={addTag}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <section className="space-y-4 border-[3px] border-[#555] bg-bg-card p-6 shadow-pixel">
        <h2 className="font-pixel text-xs text-text-gold">WHAT&apos;S INCLUDED</h2>
        <ul className="space-y-1">
          {form.whatsIncluded.map((item) => (
            <li
              key={item}
              className="flex items-center justify-between border border-[#555] bg-bg-secondary px-3 py-1 font-body text-sm"
            >
              {item}
              <button
                type="button"
                onClick={() =>
                  updateField(
                    "whatsIncluded",
                    form.whatsIncluded.filter((entry) => entry !== item),
                  )
                }
              >
                <Trash2 className="h-4 w-4 text-accent-red" />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <Input
            placeholder="Add bullet point"
            value={includedInput}
            onChange={(event) => setIncludedInput(event.target.value)}
            onKeyDown={(event) =>
              event.key === "Enter" && (event.preventDefault(), addIncluded())
            }
            className="border-[3px] border-[#555] bg-bg-secondary font-retro"
          />
          <Button type="button" variant="outline" onClick={addIncluded}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <section className="space-y-4 border-[3px] border-[#555] bg-bg-card p-6 shadow-pixel">
        <h2 className="font-pixel text-xs text-text-gold">DELIVERY & PAYMENT</h2>
        <div className="space-y-2">
          <Label className="font-retro">Payment link (optional)</Label>
          <Input
            type="url"
            value={form.paymentLink}
            onChange={(event) => updateField("paymentLink", event.target.value)}
            className="border-[3px] border-[#555] bg-bg-secondary font-retro"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-retro">Delivery instructions</Label>
          <Textarea
            value={form.deliveryInstructions}
            onChange={(event) =>
              updateField("deliveryInstructions", event.target.value)
            }
            className="border-[3px] border-[#555] bg-bg-secondary font-body"
          />
        </div>
      </section>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} className="font-retro">
          {loading ? "Saving..." : productId ? "Update product" : "Create product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

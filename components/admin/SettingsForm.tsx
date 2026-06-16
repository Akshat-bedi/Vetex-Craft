"use client";

import { useEffect, useState } from "react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminFetch } from "@/lib/admin-fetch";

type Settings = {
  siteName: string;
  tagline: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  currency: string;
  contactEmail: string | null;
  discordLink: string | null;
  twitterLink: string | null;
  youtubeLink: string | null;
  instagramLink: string | null;
  tiktokLink: string | null;
  stripeEnabled: boolean;
  manualPaymentInstructions: string | null;
  defaultDeliveryInstructions: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
};

export function SettingsForm() {
  const [form, setForm] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    adminFetch<Settings>("/api/settings")
      .then(setForm)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  }

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    setMessage(null);
    try {
      await adminFetch("/api/settings", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      setMessage("Settings saved successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !form) {
    return <p className="font-retro text-text-secondary">Loading settings...</p>;
  }

  return (
    <div className="max-w-3xl space-y-4">
      {message && (
        <p className="border-2 border-accent-green bg-bg-card p-3 font-retro text-text-accent">
          {message}
        </p>
      )}
      <Tabs defaultValue="general">
        <TabsList className="flex flex-wrap border-[3px] border-[#555] bg-bg-secondary p-1">
          <TabsTrigger value="general" className="font-retro">
            General
          </TabsTrigger>
          <TabsTrigger value="social" className="font-retro">
            Social
          </TabsTrigger>
          <TabsTrigger value="payment" className="font-retro">
            Payment
          </TabsTrigger>
          <TabsTrigger value="delivery" className="font-retro">
            Delivery
          </TabsTrigger>
          <TabsTrigger value="seo" className="font-retro">
            SEO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-4 border-[3px] border-[#555] bg-bg-card p-6">
          <div>
            <Label className="font-retro">Site name</Label>
            <Input
              value={form.siteName}
              onChange={(event) => update("siteName", event.target.value)}
              className="font-retro"
            />
          </div>
          <div>
            <Label className="font-retro">Tagline</Label>
            <Input
              value={form.tagline ?? ""}
              onChange={(event) => update("tagline", event.target.value)}
              className="font-retro"
            />
          </div>
          <div>
            <Label className="font-retro">Currency</Label>
            <Select
              value={form.currency}
              onValueChange={(value) => update("currency", value)}
            >
              <SelectTrigger className="font-retro">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="INR">INR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-retro">Contact email</Label>
            <Input
              type="email"
              value={form.contactEmail ?? ""}
              onChange={(event) => update("contactEmail", event.target.value)}
              className="font-retro"
            />
          </div>
          <div>
            <Label className="font-retro">Logo</Label>
            <ImageUploader
              endpoint="siteAsset"
              value={form.logoUrl ? [form.logoUrl] : []}
              onChange={(urls) => update("logoUrl", urls[0] ?? null)}
            />
          </div>
          <div>
            <Label className="font-retro">Favicon</Label>
            <ImageUploader
              endpoint="siteAsset"
              value={form.faviconUrl ? [form.faviconUrl] : []}
              onChange={(urls) => update("faviconUrl", urls[0] ?? null)}
            />
          </div>
        </TabsContent>

        <TabsContent value="social" className="mt-4 space-y-4 border-[3px] border-[#555] bg-bg-card p-6">
          {(
            [
              ["discordLink", "Discord"],
              ["twitterLink", "Twitter / X"],
              ["youtubeLink", "YouTube"],
              ["instagramLink", "Instagram"],
              ["tiktokLink", "TikTok"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <Label className="font-retro">{label}</Label>
              <Input
                value={form[key] ?? ""}
                onChange={(event) => update(key, event.target.value)}
                className="font-retro"
              />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="payment" className="mt-4 space-y-4 border-[3px] border-[#555] bg-bg-card p-6">
          <div className="flex items-center gap-2">
            <Switch
              checked={form.stripeEnabled}
              onCheckedChange={(checked) => update("stripeEnabled", checked)}
            />
            <Label className="font-retro">Enable Stripe checkout</Label>
          </div>
          <p className="font-body text-xs text-text-secondary">
            Stripe keys are configured via environment variables (STRIPE_SECRET_KEY,
            etc.).
          </p>
          <div>
            <Label className="font-retro">Manual payment instructions</Label>
            <Textarea
              rows={6}
              value={form.manualPaymentInstructions ?? ""}
              onChange={(event) =>
                update("manualPaymentInstructions", event.target.value)
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="delivery" className="mt-4 space-y-4 border-[3px] border-[#555] bg-bg-card p-6">
          <div>
            <Label className="font-retro">Default delivery instructions</Label>
            <Textarea
              rows={6}
              value={form.defaultDeliveryInstructions ?? ""}
              onChange={(event) =>
                update("defaultDeliveryInstructions", event.target.value)
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="seo" className="mt-4 space-y-4 border-[3px] border-[#555] bg-bg-card p-6">
          <div>
            <Label className="font-retro">Meta title</Label>
            <Input
              value={form.metaTitle ?? ""}
              onChange={(event) => update("metaTitle", event.target.value)}
              className="font-retro"
            />
          </div>
          <div>
            <Label className="font-retro">Meta description</Label>
            <Textarea
              value={form.metaDescription ?? ""}
              onChange={(event) =>
                update("metaDescription", event.target.value)
              }
            />
          </div>
          <div>
            <Label className="font-retro">OG image</Label>
            <ImageUploader
              endpoint="siteAsset"
              value={form.ogImageUrl ? [form.ogImageUrl] : []}
              onChange={(urls) => update("ogImageUrl", urls[0] ?? null)}
            />
          </div>
        </TabsContent>
      </Tabs>

      <Button onClick={handleSave} disabled={saving} className="font-retro">
        {saving ? "Saving..." : "Save all settings"}
      </Button>
    </div>
  );
}

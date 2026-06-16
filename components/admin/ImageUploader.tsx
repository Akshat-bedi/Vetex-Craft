"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { UploadButton } from "@/lib/uploadthing-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ImageUploaderProps = {
  value: string[];
  onChange: (urls: string[]) => void;
  endpoint?: "productImage" | "siteAsset";
};

export function ImageUploader({
  value,
  onChange,
  endpoint = "productImage",
}: ImageUploaderProps) {
  const [urlInput, setUrlInput] = useState("");

  function addUrl() {
    const trimmed = urlInput.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setUrlInput("");
    }
  }

  function removeUrl(url: string) {
    onChange(value.filter((item) => item !== url));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {value.map((url) => (
          <div
            key={url}
            className="relative h-20 w-20 border-2 border-[#555] bg-bg-secondary"
          >
            <Image src={url} alt="" fill unoptimized className="object-contain p-1" />
            <button
              type="button"
              onClick={() => removeUrl(url)}
              className="absolute -right-1 -top-1 bg-accent-red p-0.5 text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <UploadButton
        endpoint={endpoint}
        onClientUploadComplete={(files) => {
          const urls = files.map((file) => file.url);
          onChange([...value, ...urls.filter((url) => !value.includes(url))]);
        }}
        onUploadError={(error) => {
          alert(error.message);
        }}
        appearance={{
          button:
            "bg-accent-green text-black font-retro text-sm px-4 py-2 ut-ready:bg-accent-green",
          allowedContent: "font-body text-xs text-text-secondary",
        }}
      />
      <div className="flex gap-2">
        <Input
          placeholder="Or paste image URL"
          value={urlInput}
          onChange={(event) => setUrlInput(event.target.value)}
          className="border-[3px] border-[#555] bg-bg-secondary font-retro"
        />
        <Button type="button" variant="outline" onClick={addUrl}>
          Add URL
        </Button>
      </div>
    </div>
  );
}

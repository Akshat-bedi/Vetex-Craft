import { MessageCircle } from "lucide-react";
import { MinecraftLinkButton } from "@/components/public/MinecraftButton";
import { TextureSection } from "@/components/public/TextureSection";

export function DiscordCta({ discordLink }: { discordLink?: string | null }) {
  const href = discordLink ?? "https://discord.gg/fN47Pq4VF";

  return (
    <TextureSection texture="none" className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="texture-overlay texture-nether flex flex-col items-center gap-6 border-[3px] border-[#555] bg-bg-nether p-6 text-center shadow-pixel sm:p-8">
          <MessageCircle className="h-12 w-12 text-accent-purple" />
          <h2 className="font-pixel text-xs text-text-accent sm:text-sm">
            JOIN OUR DISCORD
          </h2>
          <p className="max-w-lg font-body text-text-secondary">
            Get support, sneak peeks at new releases, and connect with other
            server owners and builders in our community.
          </p>
          <MinecraftLinkButton href={href} variant="gold">
            JOIN DISCORD
          </MinecraftLinkButton>
        </div>
      </div>
    </TextureSection>
  );
}

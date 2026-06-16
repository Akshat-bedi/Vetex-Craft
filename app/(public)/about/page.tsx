import { MessageCircle, Mail } from "lucide-react";
import { MinecraftLinkButton } from "@/components/public/MinecraftButton";
import { getSiteSettings } from "@/lib/data";

export const metadata = {
  title: "About | Minecraft Store",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-pixel text-sm text-text-accent sm:text-base">ABOUT US</h1>
      <p className="mt-4 font-retro text-2xl text-text-gold">
        {settings?.siteName ?? "Minecraft Store"}
      </p>

      <div className="mt-8 space-y-6 border-[3px] border-[#555] bg-bg-card p-6 shadow-pixel">
        <section>
          <h2 className="font-pixel text-xs text-text-gold">OUR MISSION</h2>
          <p className="mt-3 font-body text-text-secondary">
            We build and curate premium Minecraft modpacks, plugins, maps, and
            resource packs for server owners and players who want polished
            experiences without spending weeks assembling everything themselves.
          </p>
        </section>
        <section>
          <h2 className="font-pixel text-xs text-text-gold">OUR STORY</h2>
          <p className="mt-3 font-body text-text-secondary">
            Started by longtime server admins and builders, {settings?.siteName}{" "}
            grew from a small Discord community sharing configs into a full
            storefront trusted by hundreds of players worldwide.
          </p>
        </section>
        <section>
          <h2 className="font-pixel text-xs text-text-gold">THE TEAM</h2>
          <p className="mt-3 font-body text-text-secondary">
            A small crew of developers, map makers, and support staff — all
            active in the Minecraft community. We dogfood every product on our
            own servers before listing it here.
          </p>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        {settings?.discordLink && (
          <MinecraftLinkButton href={settings.discordLink} variant="gold">
            <span className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              DISCORD
            </span>
          </MinecraftLinkButton>
        )}
        {settings?.contactEmail && (
          <a
            href={`mailto:${settings.contactEmail}`}
            className="inline-flex items-center gap-2 border-[3px] border-[#555] bg-bg-secondary px-6 py-3 font-retro text-lg shadow-pixel hover:bg-bg-card"
          >
            <Mail className="h-5 w-5" />
            {settings.contactEmail}
          </a>
        )}
      </div>
    </div>
  );
}

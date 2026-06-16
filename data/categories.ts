export const defaultCategories = [
  {
    name: "Modpacks",
    slug: "modpacks",
    description: "Complete mod collections",
    displayOrder: 0,
  },
  {
    name: "Plugins",
    slug: "plugins",
    description: "Server plugins (Spigot/Paper)",
    displayOrder: 1,
  },
  {
    name: "Maps",
    slug: "maps",
    description: "Custom adventure and build maps",
    displayOrder: 2,
  },
  {
    name: "Resource Packs",
    slug: "resource-packs",
    description: "Textures and sounds",
    displayOrder: 3,
  },
  {
    name: "Custom Services",
    slug: "custom-services",
    description: "Bespoke builds and mods",
    displayOrder: 4,
  },
  {
    name: "Bundles",
    slug: "bundles",
    description: "Multi-product value packs",
    displayOrder: 5,
  },
] as const;

export const defaultFaqs = [
  {
    question: "How do I receive my purchase?",
    answer:
      "After payment is confirmed, delivery instructions are sent to your email and shown on your order page. Most digital products arrive within 24 hours.",
    category: "Orders",
    displayOrder: 0,
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We support secure card payments via Stripe when enabled, or manual payment instructions (PayPal, bank transfer, etc.) as listed at checkout.",
    category: "Orders",
    displayOrder: 1,
  },
  {
    question: "Can I get a refund?",
    answer:
      "Due to the digital nature of our products, refunds are handled case-by-case. Contact support on Discord with your order ID within 7 days.",
    category: "General",
    displayOrder: 2,
  },
  {
    question: "Which Minecraft version do modpacks support?",
    answer:
      "Each product page lists supported versions. Most of our modpacks target Forge or Fabric 1.20.1 unless noted otherwise.",
    category: "Technical",
    displayOrder: 3,
  },
  {
    question: "Do you offer installation help?",
    answer:
      "Yes! Join our Discord after purchase for setup help, config tips, and troubleshooting from our team.",
    category: "Support",
    displayOrder: 4,
  },
  {
    question: "How do discount codes work?",
    answer:
      "Enter your code on the cart page before checkout. Valid codes apply automatically to your order subtotal.",
    category: "Orders",
    displayOrder: 5,
  },
] as const;

import type { SiteContent } from "./types";

export type PolicySlug = "privacy" | "shipping" | "returns" | "terms";

export type PolicyBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "note"; text: string };

export type PolicySection = {
  title: string;
  blocks: PolicyBlock[];
};

export type Policy = {
  slug: PolicySlug;
  title: string;
  eyebrow: string;
  description: string;
  updated: string;
  intro: string;
  sections: PolicySection[];
};

export const policies: Policy[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    eyebrow: "Your information",
    description:
      "What we collect when you shop, write to us or join the pantry list — and how we look after it.",
    updated: "2 November 2026",
    intro:
      "{siteName} collects only the information needed to answer you, pack your order and keep the website working. We do not sell personal information.",
    sections: [
      {
        title: "Who we are",
        blocks: [
          {
            type: "p",
            text: "This website is operated by {siteName}. For privacy questions, contact us at {email} or write to {address}.",
          },
          {
            type: "p",
            text: "This policy applies to information collected through this website, including the shop, contact form, newsletter and order request flow. It does not apply to third-party websites we link to, such as WhatsApp, Instagram or Facebook.",
          },
        ],
      },
      {
        title: "Information we collect",
        blocks: [
          {
            type: "p",
            text: "We collect information you choose to give us. Depending on how you use the site, this may include:",
          },
          {
            type: "ul",
            items: [
              "Contact details such as your name, email address, phone number and WhatsApp number.",
              "Delivery details such as your address, city, state, pincode and delivery notes.",
              "Order details, including products, pack sizes, quantities and the payment preference you select.",
              "Messages you send through the contact form, by email or on WhatsApp.",
              "Your name and email address when you subscribe to pantry notes.",
            ],
          },
          {
            type: "p",
            text: "When you add products to your basket, the selection is stored in your own browser using local storage. It stays on your device and is not sent to us until you place an order request.",
          },
        ],
      },
      {
        title: "Information collected automatically",
        blocks: [
          {
            type: "p",
            text: "We do not run advertising trackers or third-party analytics on this site. The admin studio uses a strictly necessary session cookie so that authorised staff can sign in and manage the store.",
          },
          {
            type: "p",
            text: "Our hosting provider may keep standard technical logs, such as request times and IP addresses, for security and reliability. Those logs are managed under the provider's own retention practices.",
          },
        ],
      },
      {
        title: "How we use your information",
        blocks: [
          {
            type: "ul",
            items: [
              "To respond to enquiries and provide product or order support.",
              "To review, confirm, pack and deliver order requests.",
              "To arrange payment or cash-on-delivery confirmation where applicable.",
              "To send pantry notes and occasional studio updates when you have asked for them.",
              "To keep records of orders, enquiries and consent for accounting and legal purposes.",
              "To protect the site against misuse, fraud and unauthorised access.",
            ],
          },
          {
            type: "p",
            text: "We do not use your information to make automated decisions that would significantly affect you.",
          },
        ],
      },
      {
        title: "When we share information",
        blocks: [
          {
            type: "p",
            text: "We share information only where it is needed to run the service or where the law requires it. This may include courier and delivery partners, payment or banking providers where a refund or payment arrangement is made, and technology providers who host or maintain the site.",
          },
          {
            type: "p",
            text: "If you choose to contact us on WhatsApp, your message is handled through WhatsApp and is subject to its own privacy terms. We do not sell, rent or trade personal information.",
          },
        ],
      },
      {
        title: "How long we keep information",
        blocks: [
          {
            type: "p",
            text: "We keep order and transaction records for as long as needed to fulfil the order and meet accounting, tax or legal obligations. Enquiries are kept until they are resolved and for a reasonable follow-up period. Newsletter details are kept until you unsubscribe or ask us to delete them.",
          },
          {
            type: "p",
            text: "Where information is no longer needed, we delete it or remove the details that identify you.",
          },
        ],
      },
      {
        title: "Your choices and rights",
        blocks: [
          {
            type: "p",
            text: "You can ask us to access, correct or delete the personal information we hold about you, or ask us to stop using it for marketing. You can also unsubscribe from pantry notes at any time by using the unsubscribe link in an email or by writing to {email}.",
          },
          {
            type: "p",
            text: "We may need to keep certain order records even after a deletion request where the law requires it. We will explain if that applies.",
          },
        ],
      },
      {
        title: "Security",
        blocks: [
          {
            type: "p",
            text: "We use reasonable technical and organisational measures to protect the information we hold, including restricted access to the admin studio and encrypted connections to the site. No method of transmission or storage is completely secure, so we cannot promise absolute security.",
          },
        ],
      },
      {
        title: "Children",
        blocks: [
          {
            type: "p",
            text: "This website is intended for adults placing orders or making enquiries. It is not directed at children. If you believe a child has sent us personal information, contact us and we will remove it.",
          },
        ],
      },
      {
        title: "Changes to this policy",
        blocks: [
          {
            type: "p",
            text: "We may update this policy as the studio or the law changes. The revised version will be published on this page with a new update date. Please check back before placing a new order if you would like to see the current version.",
          },
        ],
      },
      {
        title: "Contact us",
        blocks: [
          {
            type: "p",
            text: "Questions about privacy can be sent to {email}, by phone on {phone}, or on WhatsApp at {whatsapp}. Our studio hours are {hours}.",
          },
          {
            type: "note",
            text: "Please include enough detail for us to identify the order or enquiry you are asking about. Do not send payment details or identity documents by email unless we specifically ask for them.",
          },
        ],
      },
    ],
  },
  {
    slug: "shipping",
    title: "Shipping Policy",
    eyebrow: "Getting it to you",
    description:
      "Where we deliver, how orders are packed and what to expect after you place an order request.",
    updated: "2 November 2026",
    intro:
      "Every order is reviewed by a person before it is packed. This page explains our delivery areas, timelines and charges. Timelines are estimates, not guarantees.",
    sections: [
      {
        title: "Where we deliver",
        blocks: [
          {
            type: "p",
            text: "{siteName} currently delivers within India through courier partners. We do not offer international delivery at this time.",
          },
          {
            type: "p",
            text: "Some remote pincodes or restricted areas may not be serviceable. If we cannot deliver to your address, we will contact you before accepting the order.",
          },
        ],
      },
      {
        title: "Order requests and confirmation",
        blocks: [
          {
            type: "p",
            text: "Placing an order request on this website does not take payment and does not automatically confirm the order. We check stock and delivery serviceability, then confirm with you on WhatsApp or by phone.",
          },
          {
            type: "p",
            text: "An order is accepted only when we confirm it. If an item is unavailable, we may suggest an alternative, a partial order or a cancellation.",
          },
        ],
      },
      {
        title: "Packing and dispatch",
        blocks: [
          {
            type: "p",
            text: "Most orders are packed within 1–2 working days after confirmation. Orders placed on Sundays or public holidays are handled on the next working day.",
          },
          {
            type: "p",
            text: "Each pouch is checked and sealed before dispatch. If your parcel contains glass or other fragile items, it will be packed with additional protection.",
          },
        ],
      },
      {
        title: "Delivery estimates",
        blocks: [
          {
            type: "p",
            text: "Delivery usually takes 3–7 working days after dispatch, depending on your location. Remote pincodes and periods of high demand may take longer.",
          },
          {
            type: "p",
            text: "These are estimates based on typical courier performance. Weather, strikes, local restrictions and courier delays are outside our control.",
          },
        ],
      },
      {
        title: "Shipping charges",
        blocks: [
          {
            type: "p",
            text: "Delivery is free on orders of {freeShipping} or more. Below that threshold, a flat shipping fee of {shippingFee} applies. The current charge is always shown in your basket and at checkout before you submit an order request.",
          },
          {
            type: "p",
            text: "The free-delivery threshold and shipping fee may change from time to time. The amount shown at checkout applies to that order.",
          },
        ],
      },
      {
        title: "Tracking",
        blocks: [
          {
            type: "p",
            text: "When your parcel leaves the studio, we share the courier name and tracking details on WhatsApp or by email where you have provided one. If you have not received tracking details within the estimated dispatch window, contact us with your order reference.",
          },
        ],
      },
      {
        title: "Delays and failed delivery",
        blocks: [
          {
            type: "p",
            text: "If a courier attempts delivery and cannot reach you, they may try again or return the parcel to us. Please keep your phone reachable and share accurate delivery details. Re-dispatch charges may apply where a parcel is returned because of an incorrect address or repeated failed delivery.",
          },
        ],
      },
      {
        title: "Damaged or missing parcels",
        blocks: [
          {
            type: "p",
            text: "If a parcel arrives damaged, tampered with or incomplete, photograph the outer packaging and the affected products and contact us within 48 hours of delivery. We will review the issue and arrange a replacement or refund where appropriate. See our returns policy for details.",
          },
        ],
      },
      {
        title: "Contact",
        blocks: [
          {
            type: "p",
            text: "For delivery help, message us on WhatsApp at {whatsapp}, email {email}, or call {phone} during studio hours ({hours}). Please include your order reference.",
          },
        ],
      },
    ],
  },
  {
    slug: "returns",
    title: "Returns & Refunds",
    eyebrow: "If something is not right",
    description:
      "Food safety comes first. Here is how we handle damaged, incorrect or unopened products.",
    updated: "2 November 2026",
    intro:
      "We want every pouch to arrive in the condition it left the studio. Because our products are food, returns are limited for hygiene and safety reasons — but if something is wrong, we will make it right.",
    sections: [
      {
        title: "Our approach",
        blocks: [
          {
            type: "p",
            text: "Please contact us before sending anything back. We will ask for your order reference, a short description of the issue and, where relevant, photographs. This helps us review the problem quickly and avoid unnecessary return shipping.",
          },
        ],
      },
      {
        title: "Damaged, incorrect or quality issues",
        blocks: [
          {
            type: "p",
            text: "If your parcel arrives damaged, contains the wrong item, or a product does not meet the quality you expect, contact us within 48 hours of delivery. Please include photographs of the outer parcel, the pouch seal and the product itself.",
          },
          {
            type: "p",
            text: "After review, we may offer a replacement, a partial refund or a full refund depending on the issue and availability. If we ask you to return the product, we will explain how and cover reasonable return shipping for confirmed quality issues.",
          },
        ],
      },
      {
        title: "Unopened products",
        blocks: [
          {
            type: "p",
            text: "Unopened, undamaged pouches may be eligible for return within 7 days of delivery. Contact us first for approval. The product must be in its original sealed packaging and in a resalable condition.",
          },
          {
            type: "p",
            text: "Unless the return is due to our error or a confirmed quality issue, return shipping is arranged by you. We recommend a tracked service, as we cannot refund a return that does not reach us.",
          },
        ],
      },
      {
        title: "What cannot be returned",
        blocks: [
          {
            type: "ul",
            items: [
              "Opened or partly consumed food products, unless there is a confirmed quality or safety issue.",
              "Products that have been stored outside the recommended conditions after delivery.",
              "Gift boxes or combos with missing components after delivery.",
              "Items marked as final sale or personalised, where applicable.",
            ],
          },
          {
            type: "note",
            text: "This does not affect your rights where a product is faulty, unsafe or not as described.",
          },
        ],
      },
      {
        title: "Cancellations",
        blocks: [
          {
            type: "p",
            text: "If your order has not been packed, contact us as soon as possible on WhatsApp and we will try to cancel it. Once a parcel has been dispatched, the returns process applies instead.",
          },
        ],
      },
      {
        title: "Refunds",
        blocks: [
          {
            type: "p",
            text: "Approved refunds are arranged using the original payment method where possible, or by bank transfer where that is not available. We aim to process approved refunds within 5–10 working days, but bank or payment-provider timelines can vary.",
          },
          {
            type: "p",
            text: "Shipping charges are refunded only where the return is due to our error or a confirmed quality issue.",
          },
        ],
      },
      {
        title: "How to start a return",
        blocks: [
          {
            type: "ul",
            items: [
              "Message us on WhatsApp at {whatsapp} or email {email}.",
              "Include your order reference and the reason for the return.",
              "Attach clear photographs where the issue is visible.",
              "Wait for our team to confirm the next step before sending anything back.",
            ],
          },
        ],
      },
      {
        title: "Contact",
        blocks: [
          {
            type: "p",
            text: "Our studio is available {hours}. You can also write to {address} or call {phone}.",
          },
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    eyebrow: "The agreement",
    description:
      "The ground rules for using this website, placing an order request and enjoying our products.",
    updated: "2 November 2026",
    intro:
      "By using this website or placing an order request, you agree to these terms. Please read them together with our shipping, returns and privacy policies.",
    sections: [
      {
        title: "Using this website",
        blocks: [
          {
            type: "p",
            text: "This website is operated by {siteName}. You may browse the site, place order requests and contact us for personal, non-commercial use. You must be at least 18 years old, or have the permission of a parent or guardian, to place an order.",
          },
          {
            type: "p",
            text: "You agree not to misuse the site, attempt to gain unauthorised access to the admin studio, interfere with its operation, scrape it at scale, or use it for fraudulent or unlawful activity.",
          },
        ],
      },
      {
        title: "Products and availability",
        blocks: [
          {
            type: "p",
            text: "We describe our products as accurately as we can. Natural ingredients vary in colour, size and flavour between harvests, and product photography is illustrative. Minor variation is normal and is not a defect.",
          },
          {
            type: "p",
            text: "Stock is limited and updated as orders are placed. Adding an item to your basket does not reserve it. If an item becomes unavailable after you submit a request, we will contact you to discuss an alternative or cancellation.",
          },
        ],
      },
      {
        title: "Nutrition, allergens and health",
        blocks: [
          {
            type: "p",
            text: "Nutrition information on product pages is indicative and is provided for general information. It is not medical or dietary advice. Always read the product label and ingredient list before eating, especially if you have an allergy or medical condition.",
          },
          {
            type: "p",
            text: "Our products are packed in a facility that also handles tree nuts. If you have a severe allergy, contact us before ordering. Freeze-dried pieces can be firm; supervise young children. Nothing on this site is intended to diagnose, treat or cure any condition.",
          },
        ],
      },
      {
        title: "Pricing",
        blocks: [
          {
            type: "p",
            text: "Prices are shown in Indian rupees (INR) and include applicable taxes unless stated otherwise. Shipping is calculated separately and shown before you submit an order request. We may change prices and promotions at any time, but the price shown at checkout applies to that request.",
          },
        ],
      },
      {
        title: "Order requests and acceptance",
        blocks: [
          {
            type: "p",
            text: "Submitting the checkout form creates an order request, not a completed sale. We review stock, delivery serviceability and the details you provide. An order is accepted only when we confirm it on WhatsApp or by phone.",
          },
          {
            type: "p",
            text: "We may decline or cancel a request if an item is unavailable, the delivery address is not serviceable, the details appear incorrect or fraudulent, or we cannot confirm the order. If we have received any payment for a cancelled order, it will be refunded.",
          },
        ],
      },
      {
        title: "Payment",
        blocks: [
          {
            type: "p",
            text: "Online payment is not enabled on this website. Payment is arranged personally after confirmation, or cash on delivery may be available for selected pincodes. We will never ask for your card PIN, one-time password or internet banking password.",
          },
        ],
      },
      {
        title: "Delivery, returns and refunds",
        blocks: [
          {
            type: "p",
            text: "Delivery timelines, charges and returns are governed by our shipping and returns policies, which form part of these terms. Please read them before ordering.",
          },
        ],
      },
      {
        title: "Intellectual property",
        blocks: [
          {
            type: "p",
            text: "The Tasty Treasures name, logo, copy, photography, illustrations and site design are owned by us or used with permission. You may not copy, reproduce or use them commercially without written permission, except for normal sharing of product pages.",
          },
        ],
      },
      {
        title: "Third-party links",
        blocks: [
          {
            type: "p",
            text: "The site may link to WhatsApp, Instagram, Facebook or other third-party services. We do not control those services and are not responsible for their content, availability or privacy practices.",
          },
        ],
      },
      {
        title: "Limitation of liability",
        blocks: [
          {
            type: "p",
            text: "To the extent permitted by law, {siteName} is not liable for indirect or consequential loss arising from use of the site, delays outside our control, or reliance on general information on the site. Nothing in these terms excludes liability that cannot legally be excluded, including liability for death or personal injury caused by negligence.",
          },
        ],
      },
      {
        title: "Governing law",
        blocks: [
          {
            type: "p",
            text: "These terms are governed by the laws of India. Any dispute will be subject to the jurisdiction of the competent courts in India. We encourage you to contact us first so we can try to resolve the issue directly.",
          },
        ],
      },
      {
        title: "Changes and contact",
        blocks: [
          {
            type: "p",
            text: "We may update these terms from time to time. The version published on this page applies to your use of the site. Questions can be sent to {email}, by phone on {phone}, or on WhatsApp at {whatsapp}.",
          },
        ],
      },
    ],
  },
];

export const policySlugs = policies.map((policy) => policy.slug);

export function getPolicy(slug: string) {
  return policies.find((policy) => policy.slug === slug);
}

export function hydratePolicyText(text: string, site: SiteContent["site"]) {
  return text
    .replaceAll("{siteName}", site.name)
    .replaceAll("{email}", site.email)
    .replaceAll("{phone}", site.phone)
    .replaceAll("{whatsapp}", site.whatsapp)
    .replaceAll("{address}", site.address)
    .replaceAll("{hours}", site.hours)
    .replaceAll("{freeShipping}", new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(site.freeShippingThreshold))
    .replaceAll("{shippingFee}", new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(site.shippingFee));
}

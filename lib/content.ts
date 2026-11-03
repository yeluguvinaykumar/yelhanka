import type { SiteContent } from "./types";

export const defaultContent: SiteContent = {
  site: {
    name: "Tasty Treasures",
    tagline: "Bringing Nature's Goodness to You",
    email: "hello@tastytreasures.example",
    phone: "+91 98765 43210",
    whatsapp: "919876543210",
    address: "The Treasures Studio, 14 Green Lane, Kochi, Kerala 682016, India",
    hours: "Monday to Saturday, 9:30am – 6:00pm IST",
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    freeShippingThreshold: 999,
    shippingFee: 79,
  },
  announcements: [
    "Freeze-dried, never fried — real fruit in every pouch.",
    "Free delivery on orders above ₹999.",
    "Small-batch goodness, packed with care in India.",
  ],
  hero: {
    eyebrow: "Preserving Nature's Goodness",
    titleTop: "TASTY",
    titleBottom: "TREASURES",
    description:
      "Discover the goodness of nature with premium freeze-dried fruits, dehydrated vegetables and nutrient-rich superfood powders. Pure ingredients, delicious taste and goodness in every bite.",
    image: "/images/hero-fruits.jpg",
  },
  stats: [
    {
      value: 100,
      suffix: "%",
      label: "Real ingredients",
      detail: "Fruit, vegetables and leaves. Nothing else in the pouch.",
    },
    {
      value: 0,
      suffix: "",
      label: "Preservatives",
      detail: "No chemical preservatives, no artificial colours, no added flavours.",
    },
    {
      value: 7,
      suffix: "",
      label: "Gentle process steps",
      detail: "From harvest selection to a sealed pouch, handled with care.",
    },
    {
      value: 100,
      suffix: "%",
      label: "Small-batch packed",
      detail: "Every pouch is checked and packed by hand in our studio.",
    },
  ],
  about: {
    story:
      "Tasty Treasures began with a simple frustration: the best fruit of the season disappears too quickly. We wanted a way to keep it — not in syrup, not in sugar, not in a packet of additives, but as close to the fruit itself as possible. Freeze-drying gave us that. We work with growers we know, freeze at the peak of freshness, and let the water leave slowly under vacuum. What stays behind is fruit in its most honest form: bright, crisp and full of character.",
    mission:
      "To make honest, naturally preserved food that fits into real life — for lunchboxes, late nights, long journeys and everyday tables. Good food should not need a long list of explanations on the back of the pack.",
    vision:
      "A pantry where the shortest ingredient list wins. We want Tasty Treasures to be the name families reach for when they want something genuinely good, without having to decode the label.",
  },
};

export const benefits = [
  {
    title: "Natural",
    icon: "leaf" as const,
    description: "Fruit and vegetables, picked at their peak and nothing else.",
  },
  {
    title: "Preserved",
    icon: "snowflake" as const,
    description: "Freeze-drying locks in colour, shape and character — without preservatives.",
  },
  {
    title: "Nutritious",
    icon: "spark" as const,
    description: "A gentle, low-temperature process that protects what nature put there.",
  },
  {
    title: "Convenient",
    icon: "pouch" as const,
    description: "Lightweight, resealable and ready whenever hunger arrives.",
  },
  {
    title: "Tasty",
    icon: "heart" as const,
    description: "Crisp, bright and full-flavoured. Goodness you actually crave.",
  },
];

export const processSteps = [
  {
    number: "01",
    title: "Harvest & Selection",
    icon: "harvest" as const,
    description:
      "We choose produce at peak ripeness from growers we know, checking for colour, texture and flavour before anything enters the studio.",
    detail: "Fruit is harvested and sorted by hand. Only sound, ripe produce moves forward.",
  },
  {
    number: "02",
    title: "Cleaning & Preparation",
    icon: "wash" as const,
    description:
      "Ingredients are washed, trimmed and cut to size. Strawberries stay whole; mangoes become even cubes; vegetables are sliced thin.",
    detail: "Clean water, clean hands, clean surfaces. No shortcuts.",
  },
  {
    number: "03",
    title: "Rapid Freezing",
    icon: "freeze" as const,
    description:
      "The prepared produce is frozen quickly at low temperature. Fast freezing forms small ice crystals that protect the delicate cell structure.",
    detail: "The water inside the food becomes ice, holding the shape in place.",
  },
  {
    number: "04",
    title: "Vacuum Creation",
    icon: "vacuum" as const,
    description:
      "The frozen trays move into a vacuum chamber. With most of the air removed, the pressure drops and the ice is ready to change state without melting.",
    detail: "A low-pressure environment is what makes sublimation possible.",
  },
  {
    number: "05",
    title: "Primary Drying",
    icon: "sublimate" as const,
    description:
      "Gentle heat is applied under vacuum. The ice turns directly into vapour — sublimation — skipping the liquid phase and leaving the structure intact.",
    detail: "This is the defining step that separates freeze-drying from conventional dehydration.",
  },
  {
    number: "06",
    title: "Secondary Drying",
    icon: "dry" as const,
    description:
      "A final, careful drying phase removes the last bound moisture so the texture stays crisp and the product keeps its shelf life naturally.",
    detail: "The result is light, shelf-stable and intensely flavoured.",
  },
  {
    number: "07",
    title: "Packaging & Storage",
    icon: "pack" as const,
    description:
      "Each batch is checked, weighed and sealed in moisture-barrier pouches. We label by hand and store away from heat and light.",
    detail: "Sealed pouches protect the crunch until the moment you open them.",
  },
];

export const processComparison = [
  {
    label: "How water leaves",
    freeze: "Sublimation — ice becomes vapour directly",
    dehydrate: "Evaporation — heat drives water out",
  },
  {
    label: "Temperature",
    freeze: "Low temperature throughout drying",
    dehydrate: "Sustained heat, often 50–70°C",
  },
  {
    label: "Shape & texture",
    freeze: "Original shape retained; light, airy crunch",
    dehydrate: "Shrinks and firms; chewy or leathery",
  },
  {
    label: "Colour",
    freeze: "Bright, close to fresh",
    dehydrate: "Often darker or muted",
  },
  {
    label: "Rehydration",
    freeze: "Returns close to its original form",
    dehydrate: "Rehydrates unevenly",
  },
];

export const values = [
  {
    title: "Natural",
    icon: "leaf" as const,
    short: "Ingredient lists you can read at a glance.",
    long:
      "We start with produce and stop there. No artificial colours, flavours or preservatives are added to our single-ingredient products.",
  },
  {
    title: "Pure",
    icon: "drop" as const,
    short: "Nothing hidden, nothing extra.",
    long:
      "Our single-ingredient range contains exactly one thing. Blends list every component on the front of the pouch.",
  },
  {
    title: "Quality",
    icon: "seal" as const,
    short: "Small batches, checked by hand.",
    long:
      "Every batch is inspected for colour, aroma, texture and seal integrity before it is packed for you.",
  },
  {
    title: "Health",
    icon: "heart" as const,
    short: "Food that fits everyday life.",
    long:
      "Light, shelf-stable and easy to carry. Made for lunchboxes, desks, journeys and the space between meals.",
  },
  {
    title: "Sustainability",
    icon: "recycle" as const,
    short: "Less waste, more respect.",
    long:
      "We buy seasonal produce in considered quantities, work with local growers where possible, and keep packaging as light as the product allows.",
  },
];

export const comparisonPoints = [
  {
    title: "The shortest ingredient list",
    text: "Most of our pouches contain one ingredient. The blends name every component, in order, with nothing to decode.",
  },
  {
    title: "Texture you can hear",
    text: "Freeze-drying preserves the cell structure, so fruit stays crisp and light instead of turning leathery.",
  },
  {
    title: "Colour from the fruit",
    text: "No colourants, no gloss. The ruby of beetroot and the green of moringa are entirely their own.",
  },
  {
    title: "Packed for real life",
    text: "Resealable, lightweight pouches that travel well and keep their crunch to the last handful.",
  },
];

export const faqs = [
  {
    category: "Products",
    question: "What exactly is freeze-drying?",
    answer:
      "Freeze-drying is a low-temperature preservation process. Food is frozen, placed under vacuum, and the ice is turned directly into vapour. Because the water never becomes liquid, the original shape, colour and structure are largely preserved. It is not the same as conventional dehydration, which uses heat to evaporate water.",
  },
  {
    category: "Products",
    question: "Do your products contain added sugar or preservatives?",
    answer:
      "Our single-ingredient fruit, vegetable and moringa products contain no added sugar, preservatives, artificial colours or flavours. The sugars shown on the nutrition panel occur naturally in the produce. Always check the individual product page for the exact ingredient list.",
  },
  {
    category: "Products",
    question: "How should I store my pouches?",
    answer:
      "Keep them sealed in a cool, dry place away from direct sunlight. Reseal after opening and use a dry spoon for powders. Freeze-dried products are crisp when dry; if they soften, a short spell in a warm oven can help restore crunch.",
  },
  {
    category: "Products",
    question: "Are the products suitable for children?",
    answer:
      "Our fruit and vegetable products are made from real produce and are suitable for most children over the age of two, as part of a varied diet. Freeze-dried pieces can be firm; supervise young children and consider breaking larger pieces. If your child has allergies or a medical condition, check the ingredients and speak to your healthcare professional.",
  },
  {
    category: "Orders",
    question: "Where do you deliver?",
    answer:
      "We currently deliver across India through trusted courier partners. Delivery timelines depend on your pincode; you will receive a confirmation on WhatsApp once your order is packed.",
  },
  {
    category: "Orders",
    question: "How long does delivery take?",
    answer:
      "Most orders are packed within 1–2 working days. Delivery usually takes 3–7 working days depending on your location. Remote pincodes may take a little longer.",
  },
  {
    category: "Orders",
    question: "Can I track my order?",
    answer:
      "Yes. We share tracking details on WhatsApp and by email as soon as your parcel leaves the studio. You can also reply to your order confirmation to ask for an update.",
  },
  {
    category: "Orders",
    question: "How do I pay?",
    answer:
      "Online payment is not enabled on this website. You can place an order request and we will confirm availability and payment by WhatsApp. Cash on delivery may be available for selected pincodes and will be confirmed before dispatch.",
  },
  {
    category: "Orders",
    question: "Can I change or cancel my order?",
    answer:
      "If your order has not been packed, contact us as soon as possible on WhatsApp and we will do our best to help. Once dispatched, our returns policy applies.",
  },
  {
    category: "Returns",
    question: "What if something arrives damaged?",
    answer:
      "Please send us a photo of the parcel and the affected pouch within 48 hours of delivery. We will review it quickly and arrange a replacement or refund where appropriate. See our Return Policy for full details.",
  },
  {
    category: "Returns",
    question: "Can I return an opened food product?",
    answer:
      "For hygiene and food-safety reasons, opened food products cannot be returned unless there is a quality issue. Unopened, undamaged pouches may be eligible within 7 days of delivery. Please contact us first.",
  },
  {
    category: "Wholesale",
    question: "Do you offer bulk or wholesale orders?",
    answer:
      "Yes, we work with cafés, hotels, gifting partners and retailers. Write to us through the contact form with your requirements and we will share a trade sheet.",
  },
];

export const journeySteps = [
  {
    year: "The idea",
    title: "Keep the good part",
    text: "A season of excellent strawberries, gone in a week. We started looking for a way to hold on to that flavour without sugar or syrup.",
  },
  {
    year: "The process",
    title: "Learn the slow way",
    text: "Freeze-drying felt almost like magic: colour, shape and aroma staying close to fresh. We spent months learning the process batch by batch.",
  },
  {
    year: "Today",
    title: "A small studio, a big pantry",
    text: "We now work with a network of growers and a tightly run studio, packing fruit, vegetable chips and powders for homes across India.",
  },
];

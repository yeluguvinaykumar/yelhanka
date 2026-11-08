export type CategoryId =
  | "freeze-dried-fruits"
  | "dehydrated-chips"
  | "superfood-powders"
  | "gift-combos";

export type ProductType = "Fruits" | "Vegetables" | "Powders" | "Chips" | "Combos";

export type Benefit =
  | "Immunity"
  | "Energy"
  | "Digestion"
  | "Skin & Hair"
  | "Overall Wellness";

export type Accent = "forest" | "burgundy" | "gold" | "moss";

export type ProductTheme =
  | "strawberry"
  | "mango"
  | "kiwi"
  | "banana"
  | "okra"
  | "beet"
  | "sweet-potato"
  | "kale"
  | "berry"
  | "pineapple"
  | "powder"
  | "moringa"
  | "gift";

export type Pack = {
  label: string;
  grams: number;
  price: number;
  compareAt?: number;
};

export type NutritionRow = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  type: ProductType;
  benefits: Benefit[];
  short: string;
  description: string;
  ingredients: string;
  nutrition: NutritionRow[];
  storage: string;
  usage: string[];
  packs: Pack[];
  stock: number;
  featured: boolean;
  badge?: string;
  accent: Accent;
  theme: ProductTheme;
  image?: string;
  createdAt: string;
};

export type Category = {
  id: CategoryId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  href: string;
  theme: ProductTheme;
  accent: Accent;
};

export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  packLabel: string;
  grams: number;
  price: number;
  qty: number;
  accent: Accent;
  theme: ProductTheme;
  image?: string;
};

export type OrderStatus =
  | "new"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  packLabel: string;
  grams: number;
  price: number;
  qty: number;
};

export type Customer = {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
};

export type ShipmentScan = {
  at: string;
  status?: string;
  location?: string;
  detail?: string;
};

export type Shipment = {
  courier: "delhivery";
  awb: string;
  reference?: string;
  status: string;
  location?: string;
  createdAt: string;
  updatedAt?: string;
  scans?: ShipmentScan[];
};

export type Order = {
  id: string;
  createdAt: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  payment: "cod" | "whatsapp" | "razorpay";
  /** Only set for online payments — pending until the signature verifies. */
  paymentStatus?: "pending" | "paid" | "failed";
  razorpay?: {
    orderId: string;
    keyId?: string;
    paymentId?: string;
    signature?: string;
    amount: number;
    createdAt: string;
    paidAt?: string;
  };
  status: OrderStatus;
  shipment?: Shipment;
};

export type Enquiry = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
};

export type Subscriber = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
};

export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  detail: string;
};

export type SiteContent = {
  site: {
    name: string;
    tagline: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    hours: string;
    instagram: string;
    facebook: string;
    freeShippingThreshold: number;
    shippingFee: number;
  };
  announcements: string[];
  hero: {
    eyebrow: string;
    titleTop: string;
    titleBottom: string;
    description: string;
    image: string;
  };
  stats: Stat[];
  about: {
    story: string;
    mission: string;
    vision: string;
  };
};

export type AdminSession = {
  exp: number;
};

/**
 * Everything about how the shop takes money — editable from
 * Admin → Integrations → Payment settings. Secrets stored here override the
 * RAZORPAY_* environment variables.
 */
export type PaymentSettings = {
  razorpayEnabled: boolean;
  codEnabled: boolean;
  whatsappEnabled: boolean;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  razorpayWebhookSecret: string;
};

export type SiteSettings = {
  payments: PaymentSettings;
};

export type IntegrationStatus = {
  storage: "mongodb" | "local";
  mongodb: boolean;
  mongodbReachable: boolean;
  cloudinary: boolean;
  delhivery: boolean;
  delhiveryPickup: boolean;
  delhiveryEnv: "production" | "staging";
  delhiveryShippingMode: "Surface" | "Express";
  adminHardened: boolean;
  vercel: boolean;
  siteUrl: string;
};

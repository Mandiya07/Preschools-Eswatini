import { createDocument, updateDocument, fetchCollection } from "./firestoreUtils";

export type AddonCategory = 
  | 'infrastructure_domains'
  | 'usage_communications'
  | 'storage_cloud'
  | 'creative_media'
  | 'bespoke_services';

export interface AddonItem {
  id: string;
  title: string;
  subtitle: string;
  category: AddonCategory;
  categoryLabel: string;
  priceDisplay: string;
  basePrice: number;
  billingType: 'once_off' | 'monthly' | 'annual';
  badge?: string;
  popular?: boolean;
  deliveryTime: string;
  description: string;
  features: string[];
  whyNotBasePlan: string;
  iconName: string; // Lucide icon identifier
  tiers?: { name: string; price: number; details: string }[];
}

export interface AddonOrderRecord {
  id?: string;
  orderNumber: string; // e.g. ADD-PES-2026-00412
  schoolId: string;
  schoolName: string;
  submitterEmail?: string;
  submitterPhone?: string;
  addonId: string;
  addonTitle: string;
  category: AddonCategory;
  selectedTierName?: string;
  price: number;
  creditApplied: number;
  netAmount: number;
  billingType: 'once_off' | 'monthly' | 'annual';
  status: 'pending_payment' | 'paid_in_fulfillment' | 'active' | 'completed' | 'cancelled';
  paymentMethod: string;
  referenceNumber: string;
  customDetails?: {
    domainName?: string;
    emailUsernames?: string;
    preferredDate?: string;
    locationDistrict?: string;
    notes?: string;
  };
  orderedAt: string;
  fulfilledAt?: string;
  fulfilledBy?: string;
  notes?: string;
}

export const ADDON_MARKETPLACE_CATALOG: AddonItem[] = [
  {
    id: "custom_domain",
    title: "Custom School Domain (.sz / .co.sz / .com)",
    subtitle: "Brand your school website with your own registered top-level domain.",
    category: "infrastructure_domains",
    categoryLabel: "Domain & Identity",
    priceDisplay: "E350 – E600/year",
    basePrice: 450,
    billingType: "annual",
    popular: true,
    badge: "High Credibility",
    deliveryTime: "24–48 hours",
    description: "Connect your official national .sz or .co.sz domain (e.g. www.littlestars.sz) or international .com domain. Includes automated SSL certificate, DNS management, and uptime monitoring.",
    features: [
      "Official .sz, .co.sz, or .com registration",
      "Automated SSL security certificate (HTTPS)",
      "DNS records configuration and routing",
      "Zero downtime annual renewal management"
    ],
    whyNotBasePlan: "Registry renewal fees are paid directly to national registrar authorities (.sz / ICANN) annually.",
    iconName: "Globe",
    tiers: [
      { name: ".co.sz Domain", price: 350, details: "Standard Eswatini commercial registry" },
      { name: ".sz National Domain", price: 450, details: "Premium Eswatini national top-level domain" },
      { name: ".com Global Domain", price: 600, details: "International commercial top-level domain" }
    ]
  },
  {
    id: "pro_email",
    title: "Professional School Email Inboxes",
    subtitle: "Stop using personal @gmail.com addresses for official school admissions and billing.",
    category: "infrastructure_domains",
    categoryLabel: "Domain & Identity",
    priceDisplay: "E300 – E600/year",
    basePrice: 399,
    billingType: "annual",
    deliveryTime: "Same day setup",
    description: "Deploy branded business email accounts (e.g. principal@school.sz, admissions@school.sz, finance@school.sz) with webmail and mobile IMAP integration.",
    features: [
      "3 to 10 professional school inboxes",
      "Anti-spam & anti-virus filtration",
      "Works on iPhone, Android, and Outlook",
      "Official school signatures and forwarding"
    ],
    whyNotBasePlan: "Dedicated mailbox storage and enterprise SMTP routing incur recurring mailbox license overhead.",
    iconName: "Mail",
    tiers: [
      { name: "3 Inboxes Package", price: 300, details: "info@, principal@, admin@" },
      { name: "5 Inboxes Package", price: 450, details: "Recommended for growing preschools" },
      { name: "10 Inboxes Package", price: 600, details: "Full administrative staff coverage" }
    ]
  },
  {
    id: "sms_bundle",
    title: "Instant Parent SMS Credit Bundles",
    subtitle: "Direct SMS delivery to all Eswatini mobile networks (MTN & Eswatini Mobile).",
    category: "usage_communications",
    categoryLabel: "Communications & Alerts",
    priceDisplay: "E50 – E500 bundle",
    basePrice: 180,
    billingType: "once_off",
    popular: true,
    badge: "100% Open Rate",
    deliveryTime: "Instant activation",
    description: "Send instant emergency alerts, fee reminders, event notices, and homework updates that reach every parent without requiring mobile data or internet connectivity.",
    features: [
      "Bulk SMS dispatch to all parents in 1-click",
      "Dynamic sender name with your preschool name",
      "Instant fee balance & overdue reminders",
      "Full delivery receipt logs and analytics"
    ],
    whyNotBasePlan: "Direct telco per-SMS wholesale termination fees (E0.15 - E0.20/SMS) vary strictly by message volume.",
    iconName: "Smartphone",
    tiers: [
      { name: "Starter Bundle (250 SMS)", price: 50, details: "E0.20 per SMS • For small alerts" },
      { name: "Value Pack (1,000 SMS)", price: 180, details: "E0.18 per SMS • Most popular" },
      { name: "Mega Pack (3,000 SMS)", price: 450, details: "E0.15 per SMS • Maximum savings" }
    ]
  },
  {
    id: "whatsapp_scale",
    title: "WhatsApp Messaging at Scale (API)",
    subtitle: "Automated WhatsApp parent alerts, digital fee invoices, and newsletter broadcasts.",
    category: "usage_communications",
    categoryLabel: "Communications & Alerts",
    priceDisplay: "E150 – E450/month",
    basePrice: 250,
    billingType: "monthly",
    deliveryTime: "24 hours",
    description: "Unlock high-volume automated WhatsApp messaging through verified Meta Cloud API. Send automated PDF fee statements, attendance notices, and rich media announcements.",
    features: [
      "Automated parent chat templates",
      "PDF fee statements sent directly to parent WhatsApp",
      "Class daily photos & media broadcasts",
      "Multi-agent live WhatsApp web inbox"
    ],
    whyNotBasePlan: "Meta Cloud Business API charges per conversation session across Africa.",
    iconName: "MessageCircle",
    tiers: [
      { name: "500 WhatsApp Conversations", price: 150, details: "Standard preschool monthly tier" },
      { name: "1,500 WhatsApp Conversations", price: 250, details: "Active school announcements" },
      { name: "3,500 WhatsApp Conversations", price: 450, details: "Large multi-class daily updates" }
    ]
  },
  {
    id: "extra_storage",
    title: "Additional High-Speed Cloud Storage",
    subtitle: "Store thousands of high-resolution school photos, videos, and student portfolios.",
    category: "storage_cloud",
    categoryLabel: "Storage & Media",
    priceDisplay: "E50 – E150/month",
    basePrice: 100,
    billingType: "monthly",
    deliveryTime: "Instant upgrade",
    description: "Expand your digital media vault with secure cloud storage, automated daily backups, and encrypted student records archives.",
    features: [
      "High-speed CDN media delivery across Southern Africa",
      "Original resolution photo and video storage",
      "Multi-year digital student cumulative archives",
      "Encrypted and automated off-site backups"
    ],
    whyNotBasePlan: "Cloud object storage and egress bandwidth scale with high-volume video and image uploads.",
    iconName: "HardDrive",
    tiers: [
      { name: "+20 GB Storage", price: 50, details: "~10,000 photos or 50 hours of audio" },
      { name: "+50 GB Storage", price: 100, details: "Recommended for active daily photo sharing" },
      { name: "+100 GB Storage", price: 150, details: "Full HD video portfolios & multi-year archives" }
    ]
  },
  {
    id: "ai_content_pack",
    title: "AI Content & Teacher Lesson Assistant Package",
    subtitle: "High-volume AI lesson planner, newsletter drafting, and report card generator.",
    category: "usage_communications",
    categoryLabel: "AI & Productivity",
    priceDisplay: "E100 – E300/month",
    basePrice: 150,
    billingType: "monthly",
    badge: "Save 15hrs/week",
    deliveryTime: "Instant activation",
    description: "Supercharge your teachers with an extra monthly allowance of 500 to 2,000 AI prompts for ECD lesson plans, weekly parent newsletters, and individualized student term remarks.",
    features: [
      "500 to 2,000 monthly AI generation credits",
      "Eswatini ECCDE curriculum-aligned lesson ideas",
      "Automated personalized term report remarks",
      "Parent notice & bilingual drafting assistant"
    ],
    whyNotBasePlan: "Large Language Model API compute tokens are billed per million generation characters.",
    iconName: "Sparkles",
    tiers: [
      { name: "+500 AI Generation Credits", price: 100, details: "For small teaching staff" },
      { name: "+1,500 AI Generation Credits", price: 200, details: "Most popular for multi-class schools" },
      { name: "+3,500 AI Generation Credits", price: 300, details: "Unlimited termly report drafting" }
    ]
  },
  {
    id: "pro_photography",
    title: "On-Site Professional School Photoshoot",
    subtitle: "Turn website visitors into enrolled students with magazine-quality campus photography.",
    category: "creative_media",
    categoryLabel: "Media & Production",
    priceDisplay: "E1,500 – E3,500 once-off",
    basePrice: 1800,
    billingType: "once_off",
    popular: true,
    badge: "Boosts Admissions 40%",
    deliveryTime: "3–5 days after shoot",
    description: "Our professional media crew visits your preschool in Eswatini with studio lighting and high-end cameras to capture vibrant classrooms, playground facilities, staff portraits, and joyful learning moments.",
    features: [
      "Half-day or full-day on-site campus photoshoot",
      "50–150 professionally color-graded high-res photos",
      "Classroom activities, staff portraits, outdoor playground",
      "Full digital copyright and direct platform integration"
    ],
    whyNotBasePlan: "Involves on-site camera operators, travel across Eswatini districts, and manual post-production editing.",
    iconName: "Camera",
    tiers: [
      { name: "Essential Shoot (50 Photos)", price: 1500, details: "2-hour campus & classroom session" },
      { name: "Comprehensive Shoot (100 Photos)", price: 2200, details: "Half-day shoot with staff portraits" },
      { name: "Deluxe Shoot (150+ Photos)", price: 3500, details: "Full-day shoot + print-ready prospectus set" }
    ]
  },
  {
    id: "promo_video",
    title: "Cinematic School Promotional Video & Drone Reel",
    subtitle: "High-definition video tour with aerial drone shots and principal interview.",
    category: "creative_media",
    categoryLabel: "Media & Production",
    priceDisplay: "E1,500 – E5,000 once-off",
    basePrice: 2800,
    billingType: "once_off",
    deliveryTime: "5–7 days after filming",
    description: "A broadcast-quality 60–90 second cinematic promotional video to embed on your website homepage, Instagram, Facebook, and WhatsApp marketing campaigns.",
    features: [
      "4K video production with licensed cinematic music",
      "Licensed aerial drone footage of school grounds",
      "Short founder / principal testimonial segment",
      "Optimized vertical reels for WhatsApp Status & TikTok"
    ],
    whyNotBasePlan: "High-end cinema equipment, audio engineering, drone pilot licenses, and intensive editing suite time.",
    iconName: "Video",
    tiers: [
      { name: "Highlight Reel (45s)", price: 1500, details: "Fast-paced social media & website intro" },
      { name: "Cinematic Tour (90s + Drone)", price: 2800, details: "Full school tour with drone aerials" },
      { name: "Executive Suite (2min + Reels)", price: 4800, details: "Comprehensive documentary + 3 social reels" }
    ]
  },
  {
    id: "school_branding",
    title: "Preschool Logo & Visual Identity Design",
    subtitle: "Modern, professional logo, color palette, and vector brand assets.",
    category: "creative_media",
    categoryLabel: "Media & Production",
    priceDisplay: "E500 – E2,000 once-off",
    basePrice: 850,
    billingType: "once_off",
    deliveryTime: "3–4 business days",
    description: "Give your preschool an unforgettable identity. Includes vector logo files for uniforms, signage, letterheads, social media, and stamps.",
    features: [
      "3 custom logo concepts with unlimited revisions",
      "High-res vector formats (PNG, SVG, PDF, AI)",
      "Print-ready school letterhead & receipt template",
      "Color palette and typography style guide"
    ],
    whyNotBasePlan: "Dedicated graphic designer creative studio hours and custom vector illustration.",
    iconName: "Palette",
    tiers: [
      { name: "Logo Refresh", price: 500, details: "Vectorize and modernize existing school badge" },
      { name: "Brand Identity Kit", price: 850, details: "New logo, letterhead & color system" },
      { name: "Complete Brand Suite", price: 1800, details: "Logo, prospectus, uniform mockups & signage" }
    ]
  },
  {
    id: "premium_theme",
    title: "Premium Website Theme & Interactive Layout",
    subtitle: "Custom visual skin, interactive campus tour widget, and animations.",
    category: "creative_media",
    categoryLabel: "Media & Production",
    priceDisplay: "E500 – E1,500 once-off",
    basePrice: 750,
    billingType: "once_off",
    deliveryTime: "24 hours",
    description: "Elevate your website beyond standard layouts with bespoke preschool themes, interactive calendar visualizers, and curated color stories.",
    features: [
      "Exclusive theme styles designed for early learning",
      "Interactive 3D element treatments and hero layouts",
      "Custom parent testimonials slider and video cards",
      "One-click theme switching with preserved content"
    ],
    whyNotBasePlan: "Specialized design studio template licensing and bespoke CSS skinning.",
    iconName: "Layers",
    tiers: [
      { name: "Modern Minimalist Theme", price: 500, details: "Clean, spacious aesthetic" },
      { name: "Playful Montessori Theme", price: 750, details: "Vibrant illustrations and badge styling" },
      { name: "Academy Prestige Theme", price: 1200, details: "Traditional crest, navy gold luxury styling" }
    ]
  },
  {
    id: "data_migration",
    title: "Legacy Student Data & Financial Migration",
    subtitle: "Let our data experts import your old Excel spreadsheets, paper books, and fee ledgers.",
    category: "bespoke_services",
    categoryLabel: "Custom Engineering",
    priceDisplay: "E500 – E2,500 once-off",
    basePrice: 750,
    billingType: "once_off",
    deliveryTime: "48 hours",
    description: "Switch from paper notebooks or messy Excel files with zero headache. We clean, format, validate, and bulk-import all student profiles, parent contacts, and fee balances.",
    features: [
      "Full Excel / CSV data cleaning and normalization",
      "Student historical profiles and medical alerts import",
      "Parent emergency contacts and phone formatting",
      "Opening fee balances and outstanding balances transfer"
    ],
    whyNotBasePlan: "Manual data engineering, phone number verification, and sanitization labor.",
    iconName: "Database",
    tiers: [
      { name: "Up to 50 Students", price: 500, details: "Small school fast-track import" },
      { name: "Up to 200 Students", price: 850, details: "Multi-class complete import" },
      { name: "Unlimited / Complex Files", price: 1800, details: "Historical multi-year financial records" }
    ]
  },
  {
    id: "additional_branch",
    title: "Multi-Campus Branch Expansion License",
    subtitle: "Manage 2, 3, or 5 preschool branches from a single unified super account.",
    category: "infrastructure_domains",
    categoryLabel: "Domain & Identity",
    priceDisplay: "E300 – E750/month",
    basePrice: 450,
    billingType: "monthly",
    deliveryTime: "Same day activation",
    description: "If your preschool operates multiple branches (e.g. Mbabane, Ezulwini, Manzini), add linked campus profiles with centralized financial reporting and separate teacher rosters.",
    features: [
      "Dedicated sub-portal and website for second campus",
      "Unified executive reporting and fee consolidated view",
      "Independent teacher and attendance records per branch",
      "Cross-branch student transfers with 1-click"
    ],
    whyNotBasePlan: "Requires additional database provisioning, isolated campus tenants, and permissions matrix.",
    iconName: "Building2",
    tiers: [
      { name: "+1 Additional Branch", price: 300, details: "2 branches total" },
      { name: "+2 Additional Branches", price: 500, details: "3 branches total" },
      { name: "+4 Additional Branches", price: 750, details: "5 branches total" }
    ]
  },
  {
    id: "custom_development",
    title: "Bespoke Custom Feature Development",
    subtitle: "Specialized workflows, custom government forms, or proprietary payment bridges.",
    category: "bespoke_services",
    categoryLabel: "Custom Engineering",
    priceDisplay: "E500 – E5,000 quote",
    basePrice: 1500,
    billingType: "once_off",
    deliveryTime: "1–2 weeks",
    description: "Have a unique admission questionnaire, specialized report card layout, or custom transport fleet algorithm? Our engineering team builds it directly into your dashboard.",
    features: [
      "Custom React UI components and workflows",
      "Specialized Ministry / ECCDE compliance forms",
      "Tailored printable certificate and report templates",
      "Private API webhook integrations"
    ],
    whyNotBasePlan: "Dedicated senior software engineering and QA testing hours.",
    iconName: "Code2"
  }
];

/**
 * Generates an Add-on order reference
 */
export function generateAddonOrderNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ADD-${year}-${rand}`;
}

/**
 * Submits an Add-on Marketplace order
 */
export async function submitAddonOrder(params: {
  schoolId: string;
  schoolName: string;
  submitterEmail?: string;
  submitterPhone?: string;
  addonId: string;
  selectedTierName?: string;
  price: number;
  creditApplied: number;
  paymentMethod: string;
  customDetails?: Record<string, any>;
  notes?: string;
}): Promise<{ orderId: string; orderNumber: string; referenceNumber: string }> {
  const orderNumber = generateAddonOrderNumber();
  const addon = ADDON_MARKETPLACE_CATALOG.find(a => a.id === params.addonId);
  const addonTitle = addon ? addon.title : params.addonId;
  const category = addon ? addon.category : 'bespoke_services';
  const billingType = addon ? addon.billingType : 'once_off';
  
  const netAmount = Math.max(0, params.price - params.creditApplied);
  const now = new Date().toISOString();

  // If credit covers full amount, order is immediately paid
  const status = netAmount === 0 ? 'paid_in_fulfillment' : 'pending_payment';

  const orderPayload: AddonOrderRecord = {
    orderNumber,
    schoolId: params.schoolId,
    schoolName: params.schoolName,
    submitterEmail: params.submitterEmail,
    submitterPhone: params.submitterPhone,
    addonId: params.addonId,
    addonTitle,
    category,
    selectedTierName: params.selectedTierName,
    price: params.price,
    creditApplied: params.creditApplied,
    netAmount,
    billingType,
    status,
    paymentMethod: params.paymentMethod,
    referenceNumber: orderNumber,
    customDetails: params.customDetails,
    orderedAt: now,
    notes: params.notes
  };

  const orderId = `addon_${orderNumber.replace(/[^a-zA-Z0-9]/g, '_')}`;
  await createDocument("addon_orders", orderId, orderPayload);

  return {
    orderId,
    orderNumber,
    referenceNumber: orderNumber
  };
}

/**
 * Super Admin updates order status
 */
export async function updateAddonOrderStatus(
  orderId: string,
  status: 'pending_payment' | 'paid_in_fulfillment' | 'active' | 'completed' | 'cancelled',
  adminIdentifier: string = "SuperAdmin",
  notes?: string
): Promise<boolean> {
  const now = new Date().toISOString();
  const updates: Partial<AddonOrderRecord> = {
    status,
    fulfilledBy: adminIdentifier,
    ...(notes ? { notes } : {})
  };

  if (status === 'completed' || status === 'active') {
    updates.fulfilledAt = now;
  }

  await updateDocument("addon_orders", orderId, updates);
  return true;
}

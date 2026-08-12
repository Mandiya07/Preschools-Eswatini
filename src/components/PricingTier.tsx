import React from 'react';
import { Check, X, Sparkles, Building2, ShieldCheck, Zap } from 'lucide-react';

export type PlanId = 'starter' | 'standard' | 'professional' | 'enterprise';

export const FEATURES = {
  website: "Preschool Website & Mobile Layout",
  gallery: "Photo & Media Gallery",
  announcements: "School Dashboard & Announcements",
  seo: "Basic SEO & Google Indexing",
  whatsapp: "WhatsApp Chat & Inquiries",
  analytics: "Website & Traffic Analytics",
  admissions: "Online Admissions & Inquiries",
  communication: "Parent Email & Communication",
  events: "Events Calendar & Staff Profiles",
  blog: "School News & Blog Section",
  testimonials: "Testimonials & Video Support",
  faq: "Interactive FAQ Section",
  students: "Student Records & Profiles",
  attendance: "Digital Attendance Tracking",
  parent_portal: "Dedicated Parent Portal",
  finance: "Fee Billing, Invoices & Receipts",
  ai_tools: "AI Content, FAQ & Newsletter Tools",
  health: "Medical, Allergy & Emergency Info",
  sms: "SMS-Ready & Push Notifications",
  multi_branch: "Multi-Branch Group Management",
  advanced_roles: "Unlimited Staff & Custom Roles",
  hr_leave: "HR Records & Leave Management",
  portfolios: "Digital Portfolios & Milestones",
  priority_support: "Dedicated Onboarding & Support",
  custom_domain: "Custom Domain (.sz / .com)"
};

export const PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Get your preschool online.",
    bestFor: "Small preschool",
    trial: "14 days free trial",
    price: { 
      monthly: 199, 
      annual: 1990, 
      effectiveMonthly: 166,
      termly: { t1: 800, t2: 500, t3: 800 } 
    },
    features: ['website', 'gallery', 'announcements', 'seo', 'whatsapp', 'analytics'],
    limits: { 
      students: 50, 
      admins: 1, 
      storage: 0.5, 
      galleryImages: 50,
      applications: "Standard Inquiries",
      subdomain: "1 custom subdomain"
    },
    description: "The mass-market entry plan for small preschools to establish a professional web presence without upfront development costs (less than E7/day).",
    highlights: [
      "Professional 5–6 page mobile website",
      "School logo, colors & WhatsApp button",
      "School dashboard & photo manager",
      "Google indexing & basic SEO",
      "Secure hosting, SSL & backups",
      "1 admin user • 500MB storage"
    ]
  },
  {
    id: "standard",
    name: "Standard",
    tagline: "Turn your website into a communication tool.",
    bestFor: "Growing preschool",
    popular: true,
    trial: "14 days free trial",
    price: { 
      monthly: 399, 
      annual: 3990, 
      effectiveMonthly: 333,
      termly: { t1: 1600, t2: 1000, t3: 1600 } 
    },
    features: ['website', 'gallery', 'announcements', 'seo', 'whatsapp', 'analytics', 'admissions', 'communication', 'events', 'blog', 'testimonials', 'faq'],
    limits: { 
      students: 250, 
      admins: 3, 
      storage: 2, 
      galleryImages: 200,
      applications: "100 applications/mo",
      subdomain: "Custom subdomain & brand"
    },
    description: "Our main selling plan for growing preschools to automate admissions, publish school news, and streamline parent communications.",
    highlights: [
      "Everything in Starter, plus:",
      "8–12 pages with premium templates & video",
      "Online inquiry form & admission applications",
      "Application database & downloadable records",
      "Parent announcements & email alerts",
      "Events calendar, staff profiles & FAQs",
      "3 admin users • 2GB storage"
    ]
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Run your preschool digitally.",
    bestFor: "Established school",
    trial: "14 days free trial",
    price: { 
      monthly: 699, 
      annual: 6990, 
      effectiveMonthly: 583,
      termly: { t1: 2800, t2: 1800, t3: 2800 } 
    },
    features: ['website', 'gallery', 'announcements', 'seo', 'whatsapp', 'analytics', 'admissions', 'communication', 'events', 'blog', 'testimonials', 'faq', 'students', 'attendance', 'finance', 'parent_portal', 'ai_tools', 'health', 'sms'],
    limits: { 
      students: 1000, 
      admins: 10, 
      storage: 10, 
      galleryImages: 1000,
      applications: "500 applications/mo",
      subdomain: "Custom domain ready"
    },
    description: "A complete digital Preschool Management System with student records, parent portal, fee billing, and AI productivity tools.",
    highlights: [
      "Everything in Standard, plus:",
      "Complete Student Management & Daily Attendance",
      "Dedicated Parent Portal for live updates & records",
      "Fee billing, invoices, payment recording & receipts",
      "Admissions pipeline & waitlist workflow",
      "AI website content, FAQ & newsletter generator",
      "SMS-ready notification architecture",
      "10 staff logins • 10GB storage"
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For large schools & multi-branch groups.",
    bestFor: "Large / Multi-branch",
    trial: "30 days free trial",
    price: { 
      monthly: 1499, 
      annual: 14990, 
      effectiveMonthly: 1249,
      termly: { t1: 6000, t2: 4000, t3: 6000 } 
    },
    features: ['website', 'gallery', 'announcements', 'seo', 'whatsapp', 'analytics', 'admissions', 'communication', 'events', 'blog', 'testimonials', 'faq', 'students', 'attendance', 'finance', 'parent_portal', 'ai_tools', 'health', 'sms', 'multi_branch', 'advanced_roles', 'hr_leave', 'portfolios', 'priority_support', 'custom_domain'],
    limits: { 
      students: 9999, 
      admins: 999, 
      storage: 100, 
      galleryImages: 5000,
      applications: "Unlimited applications",
      subdomain: "Full custom domain & SSL"
    },
    description: "Designed for large preschools, premium academies, ECD chains, and multi-branch school groups with unified multi-campus oversight.",
    highlights: [
      "Everything in Professional, plus:",
      "Multi-Branch Group oversight (Main → Branches)",
      "Unlimited staff & custom permissions",
      "HR records & staff leave tracking",
      "Digital student portfolios & milestone records",
      "Advanced revenue & enrollment forecasting",
      "Priority VIP onboarding & custom integrations",
      "Unlimited staff • 100GB storage"
    ]
  }
];

interface PricingTierProps {
  selectedPlan: string;
  onSelectPlan: (plan: string, features: string[]) => void;
  billingCycle: 'monthly' | 'termly' | 'annual';
  onBillingCycleChange?: (cycle: 'monthly' | 'termly' | 'annual') => void;
}

export function PricingTier({ selectedPlan, onSelectPlan, billingCycle, onBillingCycleChange }: PricingTierProps) {
  return (
    <div className="space-y-8">
      {onBillingCycleChange && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit mx-auto border border-slate-200 shadow-inner">
          <button 
            type="button"
            className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${billingCycle === 'monthly' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => onBillingCycleChange('monthly')}
          >
            Monthly
          </button>
          <button 
            type="button"
            className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${billingCycle === 'termly' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => onBillingCycleChange('termly')}
          >
            Per Term
          </button>
          <button 
            type="button"
            className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 ${billingCycle === 'annual' ? 'bg-white shadow text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
            onClick={() => onBillingCycleChange('annual')}
          >
            Annual <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-black">2 Months Free</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRICING_TIERS.map((tier) => (
          <div 
            key={tier.id}
            className={`relative flex flex-col p-6 rounded-3xl border-2 transition-all cursor-pointer ${
              selectedPlan === tier.id 
                ? 'border-blue-600 bg-blue-50/15 shadow-xl ring-2 ring-blue-600/20 scale-[1.02] z-10' 
                : tier.popular
                ? 'border-blue-300 bg-white shadow-md hover:border-blue-500'
                : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
            }`}
            onClick={() => onSelectPlan(tier.id, tier.features)}
          >
            {tier.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-1 px-3.5 rounded-full shadow-sm">
                Main Selling Plan
              </div>
            )}
            
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-slate-900">{tier.name}</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {tier.bestFor}
                </span>
              </div>
              <p className="text-xs font-semibold text-blue-600 mt-1 italic">"{tier.tagline}"</p>
              <p className="text-xs text-slate-500 mt-2 min-h-[48px] leading-relaxed">{tier.description}</p>
            </div>
            
            <div className="mb-5 pb-5 border-b border-slate-100">
              {billingCycle === 'termly' && tier.price.termly ? (
                <div className="flex flex-col gap-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">Term 1 (Opening)</span>
                    <span className="font-black text-slate-900">E{tier.price.termly.t1}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">Term 2</span>
                    <span className="font-black text-slate-900">E{tier.price.termly.t2}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">Term 3 (Closing)</span>
                    <span className="font-black text-slate-900">E{tier.price.termly.t3}</span>
                  </div>
                </div>
              ) : billingCycle === 'annual' ? (
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">E{tier.price.annual.toLocaleString()}</span>
                    <span className="text-xs font-bold text-slate-500">/year</span>
                  </div>
                  <p className="text-[11px] font-bold text-emerald-600 mt-1">
                    ~E{tier.price.effectiveMonthly}/mo effective (Save 20%)
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">E{tier.price.monthly}</span>
                    <span className="text-xs font-bold text-slate-500">/month</span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-400 mt-1">
                    Billed monthly • {tier.trial}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex-grow space-y-2.5 mb-6 text-xs">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Key Features</p>
              {tier.highlights.map((h, hIdx) => (
                <div key={hIdx} className="flex items-start gap-2 text-slate-700">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-tight font-medium">{h}</span>
                </div>
              ))}
            </div>
            
            <button
              type="button"
              className={`w-full py-3 rounded-xl text-sm font-extrabold transition-all ${
                selectedPlan === tier.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-800 hover:bg-blue-600 hover:text-white'
              }`}
            >
              {selectedPlan === tier.id ? 'Selected' : 'Choose ' + tier.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

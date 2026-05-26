import { useState, ReactNode } from "react";
import { SEO } from "@/components/SEO";
import { motion } from "motion/react";
import { 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Minus, 
  Heart, 
  ShieldCheck, 
  DollarSign, 
  Building2 
} from "lucide-react";

interface FaqItem {
  question: string;
  answer: ReactNode;
  category: "schools" | "home_care" | "flatlets" | "general";
}

const FAQS: FaqItem[] = [
  {
    category: "home_care",
    question: "Are there subscription or matching fees to find home-based nannies and childminders?",
    answer: (
      <div className="space-y-2">
        <p>
          <strong>Absolutely not.</strong> There are <strong>E0.00 subscription fees, listing commissions, or recurring memberships</strong> charged by our platform. All parent-nanny matching links and direct contact details for verified local agencies (including Grace Nannies Placement Agency, END Network, GreatAuPair, and Bheleza Care Hub) are published completely free and open.
        </p>
        <p className="text-xs text-slate-500">
          *Individual agencies negotiate their own service rates directly with families (e.g. daily, hourly blocks, or staying-in arrangements), but they never pay platform commissions or placement fees.
        </p>
      </div>
    )
  },
  {
    category: "flatlets",
    question: "Do informal backyard nurseries or peri-urban daycare flatlets have to pay to register?",
    answer: (
      <p>
        No! We believe in <strong>digital equity and safety advocacy for all children</strong> in Eswatini. High-density backyard nurseries, informal playgroups, and peri-urban flatlets in Matsapha, Mbabane, and Manzini can join our free micro-directory with zero platform listing fees. They can choose <em>&quot;Directory Listing Only&quot;</em> or request material support like school porridge and mentorship packages.
      </p>
    )
  },
  {
    category: "flatlets",
    question: "What is the 'Neighborhood Care' mentoring network (Network Adoption Framework)?",
    answer: (
      <p>
        It is a solidarity framework where we match fully-accredited, registered professional preschools with nearby high-density backyard flatlets. Sponsoring schools help uplift neighborhood childcare quality by sharing surplus learning models, duplicate puzzles, baseline syllabus charts, and physical health monitoring schedules.
      </p>
    )
  },
  {
    category: "schools",
    question: "What are the administrative portal fees for formal registered preschools?",
    answer: (
      <p>
        Registered preschools and formal daycares can use our basic portal with up to 50 students starting under the Starter Tier (E299/mo). For expanded features like high-volume Parent Portals, custom domains, deep finance ledgers, and document archives, schools can upgrade to the Standard or Professional tiers. All plans offer an obligation-free 7-day trial.
      </p>
    )
  },
  {
    category: "general",
    question: "How are the safety and references of carers verified?",
    answer: (
      <p>
        Carers listed under verified agencies undergo background validation, police clearance records checkout, and structural training programs. For peer networks like the END Network (Eswatini Nanny Diaries), independent child minders upload neighborhood reference logs, cross-border passport validations, and physical references that you can independently verify.
      </p>
    )
  },
  {
    category: "general",
    question: "How do I get emergency baby minding or occasional babysitting help?",
    answer: (
      <p>
        Grace Nannies and Bheleza Care Hub offer on-demand backup care options that do not require any previous long-term subscription. These services include express on-call baby minding with options starting from a 4-hour minimum booking block, ideal for traveling parents or holiday scheduling conflicts.
      </p>
    )
  }
];

export function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<"all" | "schools" | "home_care" | "flatlets">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = activeCategory === "all" 
    ? FAQS 
    : FAQS.filter(faq => faq.category === activeCategory);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-16">
      <SEO title="FAQ | Preschools Eswatini Platform" />

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-bold text-indigo-700 border border-indigo-200 uppercase tracking-widest font-mono">
          <HelpCircle className="h-3.5 w-3.5" /> Eswatini Early Education Support
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-slate-500 text-lg leading-relaxed font-semibold">
          Find answers about preschool admin tools, home-based childcare, zero-subscription nanny matching, and backyard daycare flatlet relief.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {[
          { id: "all", label: "All Questions", icon: "✨" },
          { id: "home_care", label: "Home Nannies & Au Pairs", icon: "🏠" },
          { id: "flatlets", label: "Neighborhood Care & Flatlets", icon: "💝" },
          { id: "schools", label: "Professional Preschool Portals", icon: "🏫" }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id as any);
              setOpenIndex(0); // auto-expand first of new category
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-extrabold transition-all border ${
              activeCategory === cat.id 
                ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10" 
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto space-y-4 text-left">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx} 
              className={`rounded-2xl border transition-all duration-200 ${
                isOpen 
                  ? "border-indigo-200 bg-indigo-50/20 ring-1 ring-indigo-200/50" 
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-6 cursor-pointer text-left focus:outline-none"
              >
                <span className="font-extrabold text-slate-900 sm:text-lg select-none leading-snug">
                  {faq.question}
                </span>
                <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ml-4 ${
                  isOpen ? "bg-indigo-100 text-indigo-700" : "bg-slate-50 text-slate-400"
                }`}>
                  {isOpen ? <Minus className="h-4 w-4 stroke-[3px]" /> : <Plus className="h-4 w-4 stroke-[3px]" />}
                </div>
              </button>

              <div 
                className={`overflow-hidden transition-all duration-200 ${
                  isOpen ? "max-h-[500px] border-t border-slate-100 p-6 pt-5 bg-white/70 rounded-b-2xl" : "max-h-0"
                }`}
              >
                <div className="text-slate-600 text-sm font-medium leading-relaxed leading-7">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advisory Banner */}
      <div className="max-w-3xl mx-auto bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 flex items-start gap-4 text-left">
        <Sparkles className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
        <div className="space-y-1">
          <h4 className="font-extrabold text-slate-900">Need immediate help?</h4>
          <p className="text-slate-600 text-sm leading-relaxed">
            Parents seeking express nanny matching, childminders, or tutors can also fill out our custom specification forms directly inside the <a href="/flatlets" className="text-indigo-600 hover:underline font-extrabold">In-Home &amp; Flatlets Care Directory</a>. Everything is 100% free with no recurring subscriptions.
          </p>
        </div>
      </div>
    </div>
  );
}

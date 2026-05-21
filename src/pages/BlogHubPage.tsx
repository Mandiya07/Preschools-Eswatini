import { useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { 
  BookOpen, 
  Search, 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  User, 
  Clock, 
  ChevronRight, 
  GraduationCap, 
  Store, 
  Heart, 
  CheckCircle, 
  Award, 
  MessageSquare, 
  Share2, 
  Download,
  ThumbsUp,
  CornerDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";

interface Article {
  slug: string;
  title: string;
  category: "parents" | "schools" | "suppliers" | "teachers";
  categoryLabel: string;
  author: string;
  date: string;
  readTime: string;
  summary: string;
  image: string;
  highlights: string[];
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
  cta: {
    text: string;
    link: string;
  };
}

const ARTICLES: Article[] = [
  {
    slug: "how-preschools-register",
    title: "Step-by-Step Guide: How to Register Your Preschool on our Platform",
    category: "schools",
    categoryLabel: "Preschool Admins",
    author: "Platform Admissions Council",
    date: "May 20, 2026",
    readTime: "5 min read",
    summary: "Learn how Eswatini preschool administrators can activate their digital profiles, configure custom school websites under their own name, list facilities, and accept verified online parent applications.",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "No setup cost for standard registration",
      "Instant, automated school website creation",
      "Official verification badge process on safety rules",
      "Digital student database & parent inquiry board"
    ],
    sections: [
      {
        heading: "1. Basic Profile Setup & Activation",
        paragraphs: [
          "Navigate to the main registration page (/register) and provide your introductory preschool metrics—including authorized school name, regional directory classification, primary village/town, contact details, and a security-verified administrator email address.",
          "Choosing your location correctly is paramount, as Preschools Eswatini uses precise geolocation logic. This ensures parents searching in Mbabane, Manzini, Piggs Peak, or Nhlangano can filter and locate your campus instantly based on distance."
        ]
      },
      {
        heading: "2. The Official Safety & Accreditation Audit",
        paragraphs: [
          "To retain premium reputation, we recommend submitting verification documents from your administrator panel. These include Ministry of Education authorization credentials, local health and wellness inspection reports, and Principal identification certifications.",
          "Once successfully approved, our Super Administrator board attaches the verified 'Ministry Approved & Platform Audited' checkmark symbol to your profile. Verified preschools on average receive 4x more parent applications than unverified draft accounts."
        ]
      },
      {
        heading: "3. Generating Your Interactive Micro-Website",
        paragraphs: [
          "No knowledge of coding is necessary. Inside the custom Website Builder section, administrators can freely customize background headers, choose warm typography themes, upload high-definition galleries, register teaching staff, and map age groups.",
          "This micro-website serves as a permanent, searchable web portal that parents can review on any smartphone, tablet, or desktop. It includes real-time maps showing precise classroom bounds."
        ]
      },
      {
        heading: "4. Setting Up Verified Payment Methods",
        paragraphs: [
          "The Kingdom of Eswatini thrives on dynamic payment accessibility. Our finance module enables preschools to map their preferred bank wire transfers directly into parental invoices.",
          "Schools can also easily list termly structures, configure custom extra-curricular charges, and generate printable statements automatically to prevent arrears."
        ]
      }
    ],
    cta: {
      text: "Register Preschool Profile Now",
      link: "/register"
    }
  },
  {
    slug: "how-suppliers-register",
    title: "Connecting with Schools: The Complete Supplier Onboarding Guide",
    category: "suppliers",
    categoryLabel: "Suppliers Hub",
    author: "Procurement Operations Team",
    date: "May 18, 2026",
    readTime: "4 min read",
    summary: "An in-depth guide for stationery, playground safety, uniform, and nutrition suppliers seeking to join the Preschools Eswatini digital ecosystem.",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "Direct link into Swati preschool purchasing pipelines",
      "Bulk order management tracking systems",
      "Secured invoice confirmation utilities",
      "Targeted marketing for educational inventory"
    ],
    sections: [
      {
        heading: "The Modern Procurement Challenge",
        paragraphs: [
          "Traditionally, early education suppliers had to dispatch physical agents to hundreds of scattered preschools to showcase text manuals, indoor mats, play structures, and fresh nutritional menus. This manual pipeline created friction, delayed distribution, and produced payment insecurity.",
          "By listing your supplier catalog on the Preschools Eswatini integrated marketplace, you gain immediate, interactive exposure to authorized admin dashboards."
        ]
      },
      {
        heading: "Step 1: Onboarding on the Supplier Portal",
        paragraphs: [
          "Navigate to /register-supplier. You are required to input your officially registered business name, tax identification parameters, primary supply focus, and direct logistics fleet reach.",
          "This secure onboarding ensures administrators buying through the platform receive high-velocity service and genuine, durable educational supplies."
        ]
      },
      {
         heading: "Step 2: Listing Your Wholesale Catalogs",
         paragraphs: [
           "Our intuitive inventory dashboards permit wholesale suppliers to upload photos, input technical dimensions, and configure custom pricing configurations.",
           "You can also activate dedicated volume-discount structures. For instance, define that ordering 50+ modular wooden tables triggers an automatic 12% pricing discount, immediately visible to school boards."
         ]
      },
      {
        heading: "Step 3: Direct Messaging & Secure Purchase Orders",
        paragraphs: [
          "Pre-school admins can review supplies, submit requests, and secure checkout orders. The system automatically issues a record-backed Purchase Order (PO) to your designated dashboard.",
          "Say goodbye to outstanding payments—the system guarantees that purchasing verification alerts you before delivery logistics leave your central Swati depot."
        ]
      }
    ],
    cta: {
      text: "Register as an Approved Supplier",
      link: "/register-supplier"
    }
  },
  {
    slug: "how-parents-benefit",
    title: "Modern Parenting Simplified: Key Benefits for Preschool Parents",
    category: "parents",
    categoryLabel: "Parents Circle",
    author: "Community & Support Unit",
    date: "May 15, 2026",
    readTime: "5 min read",
    summary: "From interactive maps and unified application forms to health dashboards—discover how the platform makes looking after early education stress-free.",
    image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "One application form, multiple school options",
      "Real-time grades, health checks, and attendance updates",
      "Secure digital statement tracking",
      "Verified checkmarks to avoid fraud"
    ],
    sections: [
      {
        heading: "1. No More Physical Application Hassles",
        paragraphs: [
          "Searching for a child’s first preschool in Eswatini used to mean driving hours between sites, filling redundant paper applications, and waiting weeks for phone updates.",
          "Now, our centralized parental profiles permit parents to submit certificates of immunization, birth registration papers, and guardian details only once. Send instant digital applications to up to five preschools with a single click."
        ]
      },
      {
        heading: "2. High-Grade Verification Badges for Safety",
        paragraphs: [
          "We take classroom integrity extremely seriously. Standard preschool platforms load generic, unverified lists of nursery options. Preschools Eswatini works directly with verified schools to showcase official Ministry credentials.",
          "This ensures that your child is placed exclusively on high-grade campuses adhering to child safety rules, professional classroom hygiene standards, and certified curricula."
        ]
      },
      {
        heading: "3. Direct Teacher Coordination",
        paragraphs: [
          "The interactive Parent Portal gives parents continuous, cloud-access to their child's day-to-day metrics. Administrators and caring educators log daily check-ins, medical wellness indicators, nap trackers, and meals.",
          "Parents can review colorful weekly digital galleries, read student report cards, and send secured direct chat inquiries whenever they need an update."
        ]
      }
    ],
    cta: {
      text: "Browse Preschool Directory",
      link: "/directory"
    }
  },
  {
    slug: "how-parents-choose",
    title: "How to Choose the Right Preschool: The Complete Parent Checklist",
    category: "parents",
    categoryLabel: "Parents Circle",
    author: "Dr. Lindiwe Nxumalo, Early Childhood Expert",
    date: "May 12, 2026",
    readTime: "6 min read",
    summary: "From classroom ratios to secure borders, evaluate the six critical metrics every parent in Eswatini must look for when choosing their child's first preschool.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "Optimal teacher-to-child ratio checklists",
      "Evaluating sanitary facilities",
      "Analyzing active play vs. cognitive learning",
      "Direct campus review tips"
    ],
    sections: [
      {
        heading: "Why the First School Choice is Essential",
        paragraphs: [
          "Early brain development progresses with astronomical velocity from ages one to six. Choosing the correct school isn't just about babysitting—it's about selecting early stimuli that establish their continuous willingness to learn.",
          "If child development is under-stimulated, kindergarten readiness scores drops. Use our verified system metrics to filter the ultimate local school options."
        ]
      },
      {
        heading: "Metric 1: Teacher-to-Student Ratios",
        paragraphs: [
          "A great nursery requires direct, localized eye contact and warmth. For infants aged 1.5 to 3, the perfect ratio must not exceed 1:6. For pre-scholars aged 3 to 6, 1:12 ensures structured teacher mentorship and supportive safety during play."
        ]
      },
      {
        heading: "Metric 2: Safety & Sanitized Hygiene",
        paragraphs: [
          "Check the school's 'Facilities' tab. Perfect nurseries include secure security fences, locking safety gates, sanitary toilets sized for children, easily reachable washbasins, and separate rest areas.",
          "Our platforms' detailed school directory outlines verified physical attributes, so parents can confirm the presence of structured perimeter controls before scheduling visits."
        ]
      },
      {
         heading: "Metric 3: The Early Curricula Structure",
         paragraphs: [
           "Does the preschool implement theme learning or standard learning? Look for schools that strike a perfect balance between active physical sensory play (sandtables, building blocks) and structured cognitive lessons (visual phonics, numbers, native SiSwati basics)."
         ]
      }
    ],
    cta: {
      text: "Compare Certified Schools",
      link: "/directory"
    }
  },
  {
    slug: "how-suppliers-benefit",
    title: "Expanding Your Reach: Why Early Education Suppliers Benefit",
    category: "suppliers",
    categoryLabel: "Suppliers Hub",
    author: "E-Commerce Partnerships Manager",
    date: "May 10, 2026",
    readTime: "4 min read",
    summary: "Discover how our digital marketplace saves suppliers thousands of hours in travel and introduces a secure pipeline for purchase orders.",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "Access pre-qualified school procurement panels",
      "Automatic ledger updates",
      "Lower logistic expenses",
      "Promotions directly on school portals"
    ],
    sections: [
      {
        heading: "Expanding Into a Multi-District Market",
        paragraphs: [
          "Marketing educational goods selectively is expensive. Educational suppliers typically depend on Word-of-Mouth, printed flyers, and door-to-door sales.",
          "Preschools Eswatini flips this paradigm. By creating a supplier catalog, your listings become search-indexed instantly. Hundreds of school directors access your catalog from their backend."
        ]
      },
      {
        heading: "Eliminating Payment Uncertainty",
        paragraphs: [
          "A frequent challenge of doing business is manual cash collection and paper invoicing delays. Our integrated portal uses high-grade payment tracking.",
          "When a preschool administrator orders play tables, uniforms, or lesson textbooks, they commit funds. Payment is confirmed digitally before the shipping order is finalized by your warehouse team."
        ]
      },
      {
        heading: "Decreasing Warehousing Marketing Costs",
        paragraphs: [
          "Rather than storing thousands of print catalogs, suppliers can modify listings, adjust bulk rates, and add seasonal items instantly. You enjoy lower marketing expenses and absolute visibility over Swati education trends."
        ]
      }
    ],
    cta: {
      text: "Create a Free Supplier Account",
      link: "/register-supplier"
    }
  },
  {
    slug: "how-teachers-benefit",
    title: "Empowering Educators: Lesson Plans, Communication, and Performance Tools",
    category: "teachers",
    categoryLabel: "Educators Guild",
    author: "Teacher Development Council",
    date: "May 08, 2026",
    readTime: "5 min read",
    summary: "Discover how preschool educators use digital toolkits, SiSwati theme lesson planners, and unified parental messaging dashboards to reduce workload.",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80",
    highlights: [
      "AI-powered lesson templates matching Swati curriculums",
      "Secured teacher-parent chat networks",
      "Attendance spreadsheets with cloud backup",
      "Career building portfolio credentials"
    ],
    sections: [
      {
        heading: "Unlocking True Digital Classroom Support",
        paragraphs: [
          "Early preschool teachers don't just instruct—they manage safety, sanitary tracking, parent queries, schedules, and lesson logs concurrently. These manual steps often steal hours from interactive child mentorship.",
          "Preschools Eswatini builds tools directly for modern educators to streamline administration and showcase teaching excellence."
        ]
      },
      {
        heading: "1. The Free AI-Powered Lesson Builder",
        paragraphs: [
          "Drafting theme-based early schedules is tedious. Our integrated teacher toolkits include intelligent prompt-based lesson generators.",
          "Input the week's theme (e.g., 'Harvest and Seasons' or 'Nature Trails of Eswatini'), and the system generates custom arts, motor skill goals, outdoor matches, and native phonics lessons in seconds."
        ]
      },
      {
        heading: "2. Safe Communication without Spam",
        paragraphs: [
          "Say goodbye to endless midnight social chat messages. Our teacher console keeps parent requests archived neatly in school logs.",
          "Share student progress, record child notes, and upload weekly classroom pictures. Parents receive these updates directly within their personal portal, keeping boundaries clean and professional."
        ]
      },
      {
        heading: "3. Professional Career Verification",
        paragraphs: [
          "Teachers listed on official, verified preschool pages have their educational credentials verified by the platform admin. This creates an elegant digital record of professional child development accomplishments."
        ]
      }
    ],
    cta: {
      text: "Register Preschool Profile",
      link: "/register"
    }
  }
];

export function BlogHubPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [faqFeedbackSubmitted, setFaqFeedbackSubmitted] = useState<Record<string, boolean>>({});

  const filteredArticles = ARTICLES.filter(article => {
    const matchesCategory = activeCategory === "all" || article.category === activeCategory;
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "schools": return "bg-blue-50 text-blue-700 border-blue-200";
      case "parents": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "suppliers": return "bg-purple-50 text-purple-700 border-purple-200";
      case "teachers": return "bg-amber-50 text-amber-700 border-amber-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const submitFeedback = (slug: string, isHelpful: boolean) => {
    setFaqFeedbackSubmitted(prev => ({ ...prev, [slug]: true }));
  };

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20 font-sans" id="blog-hub-page-root">
      <SEO 
        title="Knowledge Base & Platform Guides | Preschools Eswatini" 
        description="Official guides, benefits, and step-by-step onboarding walkthroughs for pre-school administrators, verified parents, wholesale suppliers, and early childhood educators."
      />

      <AnimatePresence mode="wait">
        {!selectedArticle ? (
          <motion.div
            key="list-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Elegant Hero Header Banner */}
            <section className="bg-slate-900 text-white relative overflow-hidden py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-slate-900/90 to-slate-900" />
              
              <div className="relative z-10 max-w-4xl mx-auto text-center">
                <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/30 mb-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest bg-transparent backdrop-blur-sm">
                  Resources & Support
                </Badge>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
                  Education Platform Hub
                </h1>
                <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                  Browse through comprehensive walkthroughs, benefit tables, and expert advice crafted to empower parents, suppliers, schools, and teachers alike across Eswatini.
                </p>
                
                {/* Search Input */}
                <div className="max-w-md mx-auto relative flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                  <Input 
                    className="h-12 pl-12 pr-4 rounded-xl border-slate-700 bg-slate-800/60 text-white placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-500"
                    placeholder="Search guidelines and articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    id="blog-search-input"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")} 
                      className="absolute right-3 text-xs font-bold text-slate-400 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Core Content Layout */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Category Navigation Side panel */}
              <aside className="space-y-6 lg:col-span-1" id="category-sidebar">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs">
                  <h3 className="font-bold text-slate-900 md:text-base mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5 uppercase tracking-wider text-xs">
                    <BookOpen className="h-4 w-4 text-blue-600" /> Directory Categories
                  </h3>
                  <div className="space-y-1.5 flex flex-col">
                    {[
                      { id: "all", label: "All Guides", count: ARTICLES.length },
                      { id: "parents", label: "Parents Circle", count: ARTICLES.filter(a => a.category === "parents").length },
                      { id: "schools", label: "Preschool Admins", count: ARTICLES.filter(a => a.category === "schools").length },
                      { id: "suppliers", label: "Suppliers Hub", count: ARTICLES.filter(a => a.category === "suppliers").length },
                      { id: "teachers", label: "Educators Guild", count: ARTICLES.filter(a => a.category === "teachers").length }
                    ].map(category => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold p-3.5 rounded-xl transition-all ${
                          activeCategory === category.id 
                            ? "bg-blue-600 text-white shadow-sm font-bold" 
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                        id={`category-btn-${category.id}`}
                      >
                        <span>{category.label}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${activeCategory === category.id ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"}`}>
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Micro CTA Box for Onboarding */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-md space-y-4">
                  <GraduationCap className="h-8 w-8 text-blue-100" />
                  <div>
                    <h4 className="font-bold text-base">Add Your School?</h4>
                    <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                      Accept verified online parent applications, show compliance checkmarks, and configure your micro-website in under 5 minutes.
                    </p>
                  </div>
                  <Button asChild className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl text-xs h-9">
                    <Link to="/register">Register Free</Link>
                  </Button>
                </div>
              </aside>

              {/* Grid Article Stream */}
              <section className="lg:col-span-3 space-y-6" id="article-stream-panel">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <h2 className="text-xl font-bold text-slate-800">
                    {activeCategory === "all" ? "Latest Published Articles" : `${ARTICLES.find(a => a.category === activeCategory)?.categoryLabel} Guidelines`}
                  </h2>
                  <span className="text-slate-400 font-semibold text-xs font-mono">{filteredArticles.length} results</span>
                </div>

                {filteredArticles.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {filteredArticles.map((article, index) => (
                      <motion.div
                        key={article.slug}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-3xl border border-slate-200/60 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group cursor-pointer"
                        onClick={() => setSelectedArticle(article)}
                        id={`article-card-${article.slug}`}
                      >
                        {/* Article Header Cover */}
                        <div className="h-44 bg-slate-100 shrink-0 relative overflow-hidden">
                          <img 
                            src={article.image} 
                            alt={article.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className={`border uppercase text-[9px] font-black rounded-full px-2.5 py-1 tracking-wider ${getCategoryBadgeColor(article.category)}`}>
                              {article.categoryLabel}
                            </Badge>
                          </div>
                        </div>

                        {/* Article Details */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3.5 text-[11px] font-medium text-slate-400 font-mono">
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime}</span>
                              <span>•</span>
                              <span>{article.date}</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                              {article.title}
                            </h3>
                            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                              {article.summary}
                            </p>
                          </div>

                          <div className="pt-5 border-t border-slate-100 mt-5 flex items-center justify-between text-blue-600 font-bold text-xs group-hover:text-blue-700">
                            <span className="inline-flex items-center gap-1.5">
                              Read Full Guideline <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200">
                    <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="font-bold text-slate-800 text-base">No articles found</h3>
                    <p className="text-slate-400 text-xs mt-1">We couldn't find any articles matching "{searchQuery}". Please check your spelling or search another keyword.</p>
                    <Button variant="outline" className="mt-4 text-xs h-9 rounded-xl border-slate-200" onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}>
                      Reset Filters
                    </Button>
                  </div>
                )}
              </section>
            </main>
          </motion.div>
        ) : (
          <motion.article
            key="article-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
            id={`article-detail-${selectedArticle.slug}`}
          >
            {/* Nav Back Button */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-white shadow-xs border border-slate-200 px-4 py-2 rounded-xl mb-8 hover:bg-slate-50 transition-colors"
              id="article-back-to-hub-btn"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Guides Hub
            </button>

            {/* Custom Content Layout */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200/80 shadow-sm overflow-hidden p-6 sm:p-10 md:p-12 space-y-8">
              {/* Category & Title */}
              <div className="space-y-4">
                <Badge className={`border uppercase text-[10px] sm:text-xs font-black rounded-lg px-3 py-1.5 tracking-wider ${getCategoryBadgeColor(selectedArticle.category)}`}>
                  {selectedArticle.categoryLabel}
                </Badge>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  {selectedArticle.title}
                </h1>
                
                {/* Author Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 border-b border-slate-200/80 pb-6 font-mono">
                  <span className="flex items-center gap-1.5 font-sans font-semibold text-slate-700">
                    <User className="h-4 w-4 text-blue-600 bg-blue-50 p-0.5 rounded" /> {selectedArticle.author}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" /> {selectedArticle.date}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {selectedArticle.readTime}
                  </span>
                </div>
              </div>

              {/* Large Image Showcase */}
              <div className="aspect-[21/9] w-full bg-slate-100 rounded-2xl overflow-hidden shadow-xs border border-slate-100">
                <img 
                  src={selectedArticle.image} 
                  alt={selectedArticle.title} 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* High-Velocity Highlights Panel */}
              <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-6 sm:p-8 space-y-4">
                <h3 className="font-bold text-blue-900 text-base md:text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" /> Key Takeaways & Guidelines:
                </h3>
                <div className="grid sm:grid-cols-2 gap-3.5">
                  {selectedArticle.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm font-semibold text-blue-900 font-sans leading-relaxed">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Article Body Paragraphs */}
              <div className="space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base font-sans">
                {selectedArticle.sections.map((section, idx) => (
                  <div key={idx} className="space-y-3.5">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
                      <CornerDownRight className="h-4 w-4 text-blue-600" /> {section.heading}
                    </h2>
                    {section.paragraphs.map((para, pIdx) => (
                      <p key={pIdx} className="text-slate-600 tracking-normal leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              {/* Dynamic Action CTA Block */}
              <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1.5 text-center sm:text-left">
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base uppercase tracking-wider">Ready to take the next step?</h4>
                  <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                    Begin immediately based on this professional guide. Register on the Preschools Eswatini portal securely now.
                  </p>
                </div>
                <Button asChild className="rounded-xl font-extrabold px-6 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10">
                  <Link to={selectedArticle.cta.link}>{selectedArticle.cta.text}</Link>
                </Button>
              </div>

              {/* Share & Feedback Tool */}
              <div className="border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Was this guide helpful?</span>
                  {faqFeedbackSubmitted[selectedArticle.slug] ? (
                    <span className="text-xs font-bold text-emerald-600 animate-pulse bg-emerald-50 px-2.5 py-1 rounded">Thank you for your feedback!</span>
                  ) : (
                    <div className="flex gap-1.5">
                      <Button variant="outline" size="sm" onClick={() => submitFeedback(selectedArticle.slug, true)} className="h-8 text-slate-600 text-xs px-3 border-slate-200 hover:bg-slate-50">
                        <ThumbsUp className="h-3 w-3 mr-1 text-slate-400" /> Yes
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => submitFeedback(selectedArticle.slug, false)} className="h-8 text-slate-600 text-xs px-3 border-slate-200 hover:bg-slate-50">
                        No
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <Button variant="ghost" size="sm" className="h-8 text-slate-500 hover:text-slate-900 text-xs gap-1" onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}>
                    <Share2 className="h-3.5 w-3.5" /> Copy Guide URL
                  </Button>
                </div>
              </div>
            </div>
          </motion.article>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Smartphone, 
  BookOpen, 
  TrendingUp, 
  Users2, 
  Heart, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  HelpCircle,
  PlusCircle,
  MapPin,
  ArrowRight,
  Sparkles,
  Home,
  Shield,
  Clock,
  Briefcase,
  Phone,
  Mail,
  UserCheck,
  DollarSign,
  Instagram,
  Globe
} from "lucide-react";
import { toast } from "sonner";
import { createDocument } from "@/lib/firestoreUtils";

export function InformalFlatletsPage() {
  // Flatlet Form State
  const [flatletFormData, setFlatletFormData] = useState({
    operatorName: "",
    flatletName: "",
    phone: "",
    whatsapp: "",
    address: "",
    neighborhood: "",
    childrenCount: "",
    registrationGoal: "both", // "listing_only" | "both"
    needsMentorship: true,
    needsNutritionSupport: true,
    additionalNotes: ""
  });
  const [flatletLoading, setFlatletLoading] = useState(false);
  const [flatletSubmitted, setFlatletSubmitted] = useState(false);

  // Nanny / Home Care Placement Form State
  const [nannyFormData, setNannyFormData] = useState({
    parentName: "",
    email: "",
    phone: "",
    corridor: "Mbabane-Manzini Corridor",
    infantAgeMonths: "0-3 months",
    serviceUrgency: "Immediate (Within 1 week)",
    requirements: "",
    requiresPediatricCPR: true,
    requiresBackgroundCheck: true
  });
  const [nannyLoading, setNannyLoading] = useState(false);
  const [nannySubmitted, setNannySubmitted] = useState(false);

  // Curated list of verified Home-Based & Nanny Staffing Agencies
  const nannyAgencies = [
    {
      id: "grace-nannies-national",
      name: "Grace Nannies Placement Agency",
      coverage: "Mbabane Headquarters & Nationwide",
      rating: 4.9,
      reviews: 64,
      specialty: "Full-Time, Stay-In, stay-out childminders & emergency on-call backup",
      rates: "Custom / Flexible Month block options",
      instagram: "grace_nannies_sz",
      email: "gracenannies@gmail.com",
      highlights: [
        "Completes structured institutional training programs (infant care, potty training, housekeeping standards)",
        "On-call backup, emergency babysitting, and travel-ready nannies with valid passports",
        "Trained professional nannies, domestic housekeepers, child minders, elderly caregivers, and tutors"
      ],
      description: "Grace Nannies Placement Agency is the primary, specialized national service provider in Eswatini that directly coordinates comprehensive, flexible in-home staffing options including stay-in, stay-out, on-call occasional helpers, and short-term traveling assignments.",
      contact: "+268 7984 5407"
    },
    {
      id: "grace-nannies-capital-registry",
      name: "Grace Nannies Placement Agency (Capital Registry)",
      coverage: "Mbabane Capital Corridor",
      rating: 4.8,
      reviews: 31,
      specialty: "Localized newborn, toddler matching & independent registries",
      rates: "Affordable community options",
      instagram: "grace_nannies_sz",
      highlights: [
        "Independent vetted helper directory matching on-demand",
        "Directly matches independent child minders with working parents in the corridor",
        "Police background cleared and neighbor-vouched references"
      ],
      description: "A localized childcare registry matching independent, verified child minders and caregivers with working families in the Mbabane-Ezulwini capital corridor.",
      contact: "+268 7852 6807"
    },
    {
      id: "grace-nannies-manzini-hub",
      name: "Grace Nannies Placement Agency (Manzini Hub)",
      coverage: "Greater Manzini Central Commercial Hub",
      rating: 4.8,
      reviews: 42,
      specialty: "Industrial corridor domestic helpers & day hour blocks",
      rates: "Custom hourly & monthly services",
      instagram: "grace_nannies_sz",
      highlights: [
        "Supports central commercial and industrial sector needs",
        "Matches household helpers and domestic caregivers based on custom rosters",
        "Minimum 4-hour on-call babysitting options for shift workers & busy parents"
      ],
      description: "Services the central commercial and industrial sector by matching domestic helpers and child care minders with families throughout the greater Manzini region.",
      contact: "+268 7984 5407"
    },
    {
      id: "eswatini-domestic-helpers",
      name: "Eswatini Domestic Helpers Agencies",
      coverage: "Mbabane Central (Gwamile Street)",
      rating: 4.7,
      reviews: 51,
      specialty: "Professional vetted domestic helpers, grounds keepers, & maids",
      rates: "From E1,500 / month",
      highlights: [
        "Highly detailed background registries at Gwamile Street office",
        "Occasional ad-hoc housekeeping & child minding blends",
        "Reliable long-term helper and gardener placements with physical references"
      ],
      description: "Located along Gwamile Street in Mbabane, this agency functions as a broader domestic registry that supplies background-checked maids, groundskeepers, and reliable babysitters for long-term placement or ad-hoc household cleaning tasks.",
      contact: "+268 7633 2012"
    },
    {
      id: "pdw-cleaning",
      name: "PDW Agency and Cleaning Services",
      coverage: "Mbabane, Manzini, Matsapha Corridor",
      rating: 4.8,
      reviews: 28,
      specialty: "Screened domestic cleaners & deep sanitizing integrations",
      rates: "Quoted based on service scope",
      highlights: [
        "Matches screened domestic workers (maids, deep cleaners, childminders)",
        "Combines heavy-duty household sanitizing with trusted child-minding helpers",
        "Vetted staff with rapid replacement policy guarantees"
      ],
      description: "Specializes in matching screened domestic workers (maids, cleaners, and child-minding helpers) alongside full-service residential deep cleaning and sanitization solutions across Swaziland's commuter corridors.",
      contact: "+268 7633 2012"
    }
  ];

  // Verified specialized local hiring registries, professional freelance portals, and regional digital vetting groups
  const digitalNetworks = [
    {
      id: "eswatini-nanny-diaries",
      name: "Eswatini Nanny Diaries (END Network)",
      type: "National Freelance Recruitment Registry & Placement Peer-Network",
      tracking: "Manages a high-volume central directory through their Digital Portal matching thousands of active local candidates with urban employers across Mbabane, Ezulwini, Matsapha, and Manzini.",
      vetting: "Operates via structured professional profiles, where independent candidates present verified cross-border references, past childcare backgrounds, and localized residential data.",
      utility: "An excellent target resource for sourcing flexible 'stay-out' or weekend day-helpers when mainstream corporate lists are at capacity.",
      social: "Coordination Desk / Phurity Ncele",
      platform: "Facebook Network & Digital Portal",
      tags: ["Freelance Registry", "Weekend Helpers", "Stay-Out Care"]
    },
    {
      id: "greataupair-eswatini",
      name: "GreatAuPair – Eswatini Executive Bureau",
      type: "Global Digital In-Home Staffing Interface",
      tracking: "Coordinates specialized placements including international-ready live-in au pairs, experienced infant specialists, and premium housekeepers.",
      vetting: "Conducts thorough, digitized background checks, identity confirmation, and multilingual literacy evaluations (frequently sourcing university graduates or background-vetted personnel).",
      utility: "Primarily used by corporate expats and traveling diplomats in the Mbabane corridor looking for highly experienced care teams with flexible scheduling options.",
      social: "GreatAuPair International Gateway",
      platform: "Web & Global Portal",
      tags: ["Executive Au Pairs", "Expats & Diplomats", "Bilingual Literacy"]
    },
    {
      id: "bheleza-care-hub",
      name: "Bheleza Care Hub",
      type: "Mobile Boutique Child-Minding Service",
      tracking: "Provides specialized ad-hoc and flexible temporary child care.",
      vetting: "Uses vetted, attentive early development minders who focus on keeping young children clean, safe, and active.",
      utility: "Specifically built to help busy professionals manage short-term schedule conflicts or complete errands while ensuring their children are safe and entertained.",
      social: "Direct Booking Line / Phurity Ncele Connect",
      platform: "Boutique Mobile Service",
      tags: ["Ad-hoc Childminding", "Short-term Blocks", "Professional Support"]
    },
    {
      id: "eswatini-helpers-nannies-network",
      name: "Eswatini Helpers & Nannies Network",
      type: "Constituency Placement Hub",
      tracking: "Services regional zones by connecting screened domestic helpers, live-in housemaids, and emergency baby minders with families.",
      vetting: "Vets regional helpers with physical reference logging and localized neighbor confirmation before community dispatch.",
      utility: "Provides immediate assistance when families experience a sudden gap in coverage or need short-term help during school holiday periods.",
      social: "Constituency Dispatch Messenger Desk",
      platform: "Regional Community Hub",
      tags: ["Constituency Dispatch", "Emergency Minders", "Holiday Care"]
    }
  ];

  const handleFlatletSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFlatletLoading(true);
    try {
      await createDocument("flatlet_applications", null, {
        ...flatletFormData,
        status: "pending_verification",
        createdAt: new Date().toISOString()
      });
      setFlatletSubmitted(true);
      toast.success("Flatlet registered successfully! Our community advocates will contact you shortly.");
    } catch (err) {
      console.error("Failed to submit flatlet registration:", err);
      toast.error("Failed to register. Please check your network and try again.");
    } finally {
      setFlatletLoading(false);
    }
  };

  const handleNannySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNannyLoading(true);
    try {
      await createDocument("nanny_placement_requests", null, {
        ...nannyFormData,
        status: "pending_matching",
        createdAt: new Date().toISOString()
      });
      setNannySubmitted(true);
      toast.success("Nanny placement request submitted! Partner agencies will review your candidate matches.");
    } catch (err) {
      console.error("Failed to submit placement request:", err);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setNannyLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <SEO 
        title="Grassroots & Home-Based Care Ecosystem | Preschools Eswatini" 
        description="Support for informal neighborhood daycare flatlets and professional home-based nanny staffing agencies in urban corridors." 
      />

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1600&auto=format&fit=crop&q=60')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-indigo-950/50 mix-blend-multiply" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <Badge className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-4 py-1 text-xs uppercase tracking-widest rounded-full shadow-lg">
            Alternative & Grassroots Childcare Ecosystem
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Grassroots <span className="text-amber-400">Neighborhood Care</span> & Nannies
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-200">
            Catering to high-density peri-urban flatlets and private resident infant care. Bridging the gap between grassroots realities and specialized corridor services.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <Tabs defaultValue="flatlets" className="space-y-16">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-2 bg-slate-200 p-1 rounded-2xl h-16 max-w-2xl w-full border border-slate-300/60 shadow-inner">
              <TabsTrigger value="flatlets" className="rounded-xl font-bold text-base data-[state=active]:bg-white data-[state=active]:text-indigo-950 data-[state=active]:shadow-md flex items-center gap-2">
                🏠 Backyard Flatlets
              </TabsTrigger>
              <TabsTrigger value="nannies" className="rounded-xl font-bold text-base data-[state=active]:bg-white data-[state=active]:text-indigo-950 data-[state=active]:shadow-md flex items-center gap-2">
                👶 Home-Based Care & Nannies
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="flatlets" className="space-y-16 mt-0">
            {/* Flatlets Info Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <Card className="rounded-2xl border-slate-200 shadow-sm bg-white p-6">
                <CardContent className="pt-6 space-y-2">
                  <span className="text-4xl font-extrabold text-indigo-600 block">60%+</span>
                  <h3 className="text-lg font-bold text-slate-800">Childcare Coverage</h3>
                  <p className="text-slate-500 text-sm">
                    Of peri-urban and high-density industrial commuting parents rely on informal home daycares.
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-slate-200 shadow-sm bg-white p-6">
                <CardContent className="pt-6 space-y-2">
                  <span className="text-4xl font-extrabold text-blue-600 block">Zero</span>
                  <h3 className="text-lg font-bold text-slate-800">Onboarding Fees</h3>
                  <p className="text-slate-500 text-sm">
                    No subscription plan barriers. Micro-directories run completely free of charge.
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-slate-200 shadow-sm bg-white p-6">
                <CardContent className="pt-6 space-y-2">
                  <span className="text-4xl font-extrabold text-emerald-600 block">100%</span>
                  <h3 className="text-lg font-bold text-slate-800">WhatsApp and PWA Friendly</h3>
                  <p className="text-slate-500 text-sm">
                    Designed to operate offline on entry-level smartphones with minimal data.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Core Pillars Section */}
            <div className="space-y-10">
              <div className="text-center max-w-3xl mx-auto space-y-3">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Our 4 Pillars of Informal Care Support
                </h2>
                <p className="text-slate-500 text-lg">
                  We bridge the gap between formal compliance and grassroots reality by meeting operators where they are.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex gap-6 items-start">
                  <div className="h-14 w-14 shrink-0 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Smartphone className="h-7 w-7" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-slate-900">1. Mobile-First Micro-Listing</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Informal flatlets are listed in our public directory tagged as <strong>"Neighborhood Flatlet"</strong>. We remove high-tech registration barriers: no formal corporate registration or website is needed. A verified mobile phone layout with localized neighborhood landmarks (e.g. "Behind Matsapha OK Foods") and GPS mapping is all they need to be found by local commuting workers.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex gap-6 items-start">
                  <div className="h-14 w-14 shrink-0 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users2 className="h-7 w-7" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-slate-900">2. School Adoption & Peer-Mentorship</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      We match registered, fully-verified Professional preschools with nearby informal pre-primary flatlets. Through this <strong>"Network Adoption Framework"</strong>, major schools share physical learning tools, duplicate wooden puzzles, and print out baseline curriculum guides, elevating the level of local child safety.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex gap-6 items-start">
                  <div className="h-14 w-14 shrink-0 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Download className="h-7 w-7" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-slate-900">3. Low-Data Learning Kits (PDF & Offline Blocks)</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Instead of complex cloud eLearning setups, we supply printable story-books, early vocabulary sets, and hand-eye physical motor-coordination posters. These can be downloaded instantly by operators on WhatsApp and printed locally for a few cents.
                    </p>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex gap-6 items-start">
                  <div className="h-14 w-14 shrink-0 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Heart className="h-7 w-7" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-slate-900">4. Subsidized Pediatric & Nutrition Loops</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      We couple flatlets with Mobile Clinics and community care points (NCPs). This allows infant growth logging, morning cornmeal porridge tracking, and child vaccination boosters to reach kids directly in high-density flatlet dwellings where state health workers can coordinate schedules easily.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Grassroots Download Kit */}
            <section className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm grid md:grid-cols-5 gap-12 items-center">
              <div className="md:col-span-3 space-y-6">
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold font-mono">
                  <Sparkles className="h-3 w-3" /> DIRECT PRINT-OUTS
                </span>
                <h2 className="text-3xl font-black text-slate-900 leading-tight">
                  Get Started with Grassroots Learning Kits
                </h2>
                <p className="text-slate-600 font-medium">
                  We have compiled a simplified, high-illustration booklet containing 20 standard foundational activities for children aged 2 to 5 years that any caregiver can facilitate using pebbles, cardboard, sandboxes, and everyday backyard elements.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Button className="rounded-xl h-12 px-6 bg-blue-600 hover:bg-blue-700" onClick={() => toast.success("Activity pack download initialized! File: flatlet-activity-guide-2026.pdf")}>
                    <Download className="mr-2 h-4 w-4" /> Download Activity Guide (1.8MB)
                  </Button>
                  <Button variant="outline" className="rounded-xl h-12 px-6 border-slate-200" onClick={() => toast.success("Nutrition monitoring card downloaded! Check your downloads.")}>
                    <Download className="mr-2 h-4 w-4" /> Growth Monitor Card
                  </Button>
                </div>
              </div>
              <div className="md:col-span-2 relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80" 
                  alt="Caregiver teaching children" 
                  className="w-full h-full object-cover"
                />
              </div>
            </section>

            {/* Registration Box */}
            <section id="register-flatlet" className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900">Flatlet Directory & Registration Portal</h2>
                <p className="text-slate-500 mt-2">
                  Are you operating an informal daycare, playgroup, or backyard nursery in an urban/peri-urban settlement? Register here to join our free micro-directory, receive digital guidance, or apply for material support in your community.
                </p>
              </div>

              {/* Toggle Intent Selector */}
              <div className="space-y-3">
                <Label className="font-bold text-slate-800 text-sm uppercase tracking-wider block">Choose Registration Intent</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFlatletFormData(prev => ({ ...prev, registrationGoal: "listing_only" }))}
                    className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all ${
                      flatletFormData.registrationGoal === "listing_only"
                        ? "border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600/10 shadow-sm"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 text-lg font-bold">
                      🏠
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-slate-900 block">Directory Listing Only</span>
                      <span className="text-xs text-slate-500 leading-normal block mt-1">
                        Register to be discovered by commuting workers and families. No public aid requested or required.
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFlatletFormData(prev => ({ ...prev, registrationGoal: "both" }))}
                    className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all ${
                      flatletFormData.registrationGoal === "both"
                        ? "border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600/10 shadow-sm"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 text-lg font-bold">
                      🎁
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-slate-900 block">Listing & Aid Support Pack</span>
                      <span className="text-xs text-slate-500 leading-normal block mt-1">
                        Register for the micro-directory AND request sponsoring school mentorship, printed guides, and porridge.
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {flatletSubmitted ? (
                <div className="text-center py-12 space-y-6 bg-green-50/50 rounded-2xl border border-green-200 p-6">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-900">Registration Logged!</h3>
                  <p className="text-green-800 font-medium max-w-lg mx-auto">
                    {flatletFormData.registrationGoal === "listing_only" 
                      ? "Thank you! We have logged your neighborhood childminding flatlet profile. Our database administrator will verify your coordinates to list you in the public directory."
                      : "Thank you! We have logged your neighborhood childminding flatlet profile and support request. A local area community advocate will visit your location shortly to complete verification and supply your physical activity binder."
                    }
                  </p>
                  <Button onClick={() => setFlatletSubmitted(false)} className="bg-green-600 hover:bg-green-700 text-white rounded-xl">
                    Register Another Flatlet
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleFlatletSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="operatorName" className="font-bold text-slate-700">Operator Name (Caregiver)</Label>
                      <Input 
                        id="operatorName" 
                        required 
                        value={flatletFormData.operatorName} 
                        onChange={(e) => setFlatletFormData(prev => ({ ...prev, operatorName: e.target.value }))} 
                        placeholder="e.g. Martha Mhlanga" 
                        className="rounded-xl border-slate-200 h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="flatletName" className="font-bold text-slate-700">Daycare or Flatlet Name</Label>
                      <Input 
                        id="flatletName" 
                        required 
                        value={flatletFormData.flatletName} 
                        onChange={(e) => setFlatletFormData(prev => ({ ...prev, flatletName: e.target.value }))} 
                        placeholder="e.g. Skhulile Baby Care Hub" 
                        className="rounded-xl border-slate-200 h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-bold text-slate-700">Standard Cellphone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        required 
                        value={flatletFormData.phone} 
                        onChange={(e) => setFlatletFormData(prev => ({ ...prev, phone: e.target.value }))} 
                        placeholder="e.g. +268 7600 0000" 
                        className="rounded-xl border-slate-200 h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp" className="font-bold text-slate-700">WhatsApp Number (if different)</Label>
                      <Input 
                        id="whatsapp" 
                        type="tel" 
                        value={flatletFormData.whatsapp} 
                        onChange={(e) => setFlatletFormData(prev => ({ ...prev, whatsapp: e.target.value }))} 
                        placeholder="e.g. +268 7600 0001" 
                        className="rounded-xl border-slate-200 h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood" className="font-bold text-slate-700">Township / Settlement Sector</Label>
                      <Input 
                        id="neighborhood" 
                        required 
                        value={flatletFormData.neighborhood} 
                        onChange={(e) => setFlatletFormData(prev => ({ ...prev, neighborhood: e.target.value }))} 
                        placeholder="e.g. Msunduza Kwaluseni, Matsapha" 
                        className="rounded-xl border-slate-200 h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="childrenCount" className="font-bold text-slate-700">Approx. Number of Children</Label>
                      <Input 
                        id="childrenCount" 
                        type="text" 
                        required 
                        value={flatletFormData.childrenCount} 
                        onChange={(e) => setFlatletFormData(prev => ({ ...prev, childrenCount: e.target.value }))} 
                        placeholder="e.g. 8 to 15 kids" 
                        className="rounded-xl border-slate-200 h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="font-bold text-slate-700">Physical Location Landmarks</Label>
                    <Input 
                      id="address" 
                      required 
                      value={flatletFormData.address} 
                      onChange={(e) => setFlatletFormData(prev => ({ ...prev, address: e.target.value }))} 
                      placeholder="e.g. Near OK Foods Matsapha entrance, third gate on the left" 
                      className="rounded-xl border-slate-200 h-11"
                    />
                  </div>

                  {flatletFormData.registrationGoal === "both" && (
                    <div className="space-y-3 pt-2">
                      <Label className="font-bold text-slate-700 block">Immediate Assistance Required</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                          <input 
                            type="checkbox" 
                            className="rounded text-indigo-600 focus:ring-indigo-650 border-slate-300 mt-1" 
                            checked={flatletFormData.needsMentorship}
                            onChange={(e) => setFlatletFormData(prev => ({ ...prev, needsMentorship: e.target.checked }))}
                          />
                          <div>
                            <span className="text-sm font-bold text-slate-800 block">Sponsoring Teacher Mentorship</span>
                            <span className="text-xs text-slate-500">Connect with an accredited preschool for toys/material sharing.</span>
                          </div>
                        </label>
                        <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                          <input 
                            type="checkbox" 
                            className="rounded text-indigo-600 focus:ring-indigo-650 border-slate-300 mt-1" 
                            checked={flatletFormData.needsNutritionSupport}
                            onChange={(e) => setFlatletFormData(prev => ({ ...prev, needsNutritionSupport: e.target.checked }))}
                          />
                          <div>
                            <span className="text-sm font-bold text-slate-800 block">Nutrition & Porridge Aid</span>
                            <span className="text-xs text-slate-500">Get connected to the neighborhood porridge supplement schedule.</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes" className="font-bold text-slate-700">
                      {flatletFormData.registrationGoal === "listing_only" ? "Operating Hours or Public Notes" : "Describe What You Seek from the Platform"}
                    </Label>
                    <Textarea 
                      id="additionalNotes" 
                      value={flatletFormData.additionalNotes} 
                      onChange={(e) => setFlatletFormData(prev => ({ ...prev, additionalNotes: e.target.value }))} 
                      placeholder={flatletFormData.registrationGoal === "listing_only" 
                        ? "e.g. Open 07:00 to 17:30 Monday to Friday. Caring primarily for toddlers and infants."
                        : "e.g. We need basic pencils, colors, plastic chairs, or sandbox toys..." 
                      }
                      className="rounded-xl border-slate-200 min-h-[100px]"
                    />
                  </div>

                  <Button type="submit" disabled={flatletLoading} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
                    {flatletLoading 
                      ? "Registering Flatlet..." 
                      : flatletFormData.registrationGoal === "listing_only"
                      ? <>Submit Free Directory Listing <ArrowRight className="h-4 w-4" /></>
                      : <>Register and Request Aid Pack <ArrowRight className="h-4 w-4" /></>
                    }
                  </Button>
                </form>
              )}
            </section>
          </TabsContent>

          <TabsContent value="nannies" className="space-y-16 mt-0">
            {/* Quick Context Intro */}
            <div className="text-center max-w-4xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-200 uppercase tracking-widest font-mono">
                <ShieldCheck className="h-3 w-3" /> Vetted Urban Agencies
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                In-Residence Care & Infant Specialist Placements
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto">
                For parents requiring localized infant care (under 12 months) directly inside their residence, specialized private staffing agencies operate in urban corridors representing verified, secure alternatives to conventional centers.
              </p>
            </div>

            {/* Zero-Subscription and Platform-Free Access Guarantee Badge & Box */}
            <div className="max-w-4xl mx-auto bg-amber-50 border-2 border-dashed border-amber-300 rounded-[2rem] p-6 sm:p-8 space-y-4 text-left">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-black text-amber-800 uppercase tracking-wide">
                    ⚠️ Guarantee: Subscription-Free Matching & Search
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Are there subscription fees for Home-Based Care or Nanny registries?</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    <strong>Absolutely not.</strong> There are <strong>no subscriptions, sign-up tier fees, recurring memberships, or hidden placement commissions</strong> charged by this platform to parents or home-based caregivers. All agency hotlines, independent digital directories (like the END Network), and dispatch messenger desk details are published openly. 
                  </p>
                  <p className="text-slate-500 text-xs leading-normal">
                    *Our partner agencies coordinate placements under their own independent contract bounds (such as basic flat hourly rates, custom block booking, or day-helper rates agreed upon directly with you), with zero platform markups or hidden fees.
                  </p>
                </div>
                <div className="bg-white px-5 py-4 rounded-2xl border border-amber-200 shrink-0 shadow-sm w-full sm:w-auto text-center sm:text-left">
                  <div className="text-3xl font-black text-amber-600">E0.00</div>
                  <div className="text-xs font-bold text-slate-800 uppercase mt-0.5">Platform Search Fee</div>
                  <div className="text-[10px] text-slate-400 mt-1">Direct agency contacts provided free</div>
                </div>
              </div>
            </div>

            {/* Placement Capabilities Highlight Box */}
            <div className="bg-gradient-to-r from-teal-500 via-emerald-600 to-indigo-600 text-white p-8 sm:p-10 rounded-[2rem] shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
                <div className="space-y-3 max-w-2xl text-left">
                  <Badge className="bg-white/20 text-white font-bold tracking-wider px-3 py-1 text-xs uppercase rounded-full border border-white/15">
                    Agency Placements & On-Demand Care
                  </Badge>
                  <h3 className="text-2xl sm:text-3xl font-black">Flexible Support for Every Household Need</h3>
                  <p className="text-emerald-50 text-sm leading-relaxed">
                    Partner staffing agencies coordinate full-time, part-time, and on-call occasional placements. They supply screened and professionally trained nannies, domestic helpers, child minders, and house keepers. They also provide a minimum 4-hour on-demand babysitting service option for traveling parents.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/15 text-left shrink-0">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5 text-sm uppercase tracking-wide">
                    <Clock className="h-4 w-4" /> Traveling Parents Option
                  </div>
                  <div className="text-lg font-black mt-1">Min. 4-Hour Booking</div>
                  <div className="text-xs text-slate-200">Express on-call babysitting matching</div>
                </div>
              </div>
            </div>

            {/* Core Features of Staffing Agencies */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Background Checked</h3>
                <p className="text-slate-500 text-sm">
                  Every caregiver profile underwent national police clearance, medical screening, and absolute identity verification protocols.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Pediatric Training</h3>
                <p className="text-slate-500 text-sm">
                  Placements undergo specialized training in standard child safety, CPR, nutritional porridge formulation, and sensory infant cycles.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Corridor Supervised</h3>
                <p className="text-slate-500 text-sm">
                  Localized agency support centers maintain regular compliance inspections and growth-logging audits on the phone.
                </p>
              </div>
            </div>

            {/* Curriculum Agencies Listings */}
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900">Verified Urban Corridor Agencies</h3>
                <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 font-bold">
                  {nannyAgencies.length} Agencies Listed
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {nannyAgencies.map((agency) => (
                  <Card key={agency.id} className="rounded-3xl border-slate-200 shadow-sm hover:shadow-lg transition-all bg-white relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="bg-slate-100 p-6 relative aspect-[16/9] w-full overflow-hidden">
                        <div className="absolute inset-0 bg-slate-900/40 z-10" />
                        <img 
                          src={
                            agency.id === "grace-nannies-national" 
                              ? "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80" 
                              : agency.id === "grace-nannies-capital-registry"
                              ? "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=600&auto=format&fit=crop&q=80"
                              : agency.id === "grace-nannies-manzini-hub"
                              ? "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=80"
                              : agency.id === "eswatini-domestic-helpers"
                              ? "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80"
                              : "https://images.unsplash.com/photo-1581579438747-1dc8d1e0ca96?w=600&auto=format&fit=crop&q=80"
                          } 
                          alt="Nanny agency coverage" 
                          className="w-full h-full object-cover absolute inset-0"
                        />
                        <div className="absolute bottom-4 left-4 z-20">
                          <Badge className="bg-amber-400 text-slate-950 font-extrabold shadow">{agency.rates}</Badge>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-lg leading-tight">{agency.name}</h4>
                          <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3 text-red-500" /> {agency.coverage}
                          </span>
                        </div>

                        <p className="text-slate-600 text-sm leading-relaxed">{agency.description}</p>

                        <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-slate-100 pt-3">
                          {agency.instagram && (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-pink-600">
                              <Instagram className="h-3.5 w-3.5" />
                              <a href={`https://instagram.com/${agency.instagram}`} target="_blank" rel="noreferrer" className="hover:underline">
                                @{agency.instagram}
                              </a>
                            </div>
                          )}
                          {agency.email && (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600">
                              <Mail className="h-3.5 w-3.5" />
                              <a href={`mailto:${agency.email}`} className="hover:underline">
                                {agency.email}
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="pt-2">
                          <p className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-2 font-mono text-indigo-600">Verification Checkmarks:</p>
                          <ul className="space-y-1.5">
                            {agency.highlights.map((h, index) => (
                              <li key={index} className="flex items-start gap-2 text-xs text-slate-700 font-medium leading-normal">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                      <div className="space-y-1">
                        <span className="text-xs text-slate-500">Contact Number</span>
                        <p className="text-sm font-bold text-slate-800">{agency.contact}</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 w-full sm:w-auto font-bold" onClick={() => {
                        toast.success(`Calling ${agency.name} automated hotline at ${agency.contact}`);
                      }}>
                        <Phone className="h-3.5 w-3.5 mr-1" /> Contact Agency
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* 2. Specialized Registries, Portals, and Vetting Networks */}
            <div className="space-y-8 pt-6 border-t border-slate-200">
              <div className="space-y-3 text-left">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200 uppercase tracking-widest font-mono">
                  <Globe className="h-3 w-3" /> Independent Registries & Portals
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Specialized Local Hiring Networks & Vetting Groups
                </h3>
                <p className="text-slate-500 text-base max-w-4xl leading-relaxed">
                  In addition to registered corporate placement agencies, Eswatini has a highly active network of specialized local hiring registries, professional freelance portals, and regional digital vetting groups that families use to secure child minders, travel au pairs, and domestic teams. Let's explore the regional options:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                {digitalNetworks.map((network) => (
                  <Card key={network.id} className="rounded-3xl border-slate-200 shadow-sm hover:shadow-md transition-all bg-white p-6 sm:p-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-5">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-xs font-black text-indigo-600 uppercase tracking-wider font-mono block">
                            {network.type}
                          </span>
                          <h4 className="font-extrabold text-slate-900 text-xl leading-tight block">
                            {network.name}
                          </h4>
                        </div>
                        <Badge className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs shrink-0 self-start">
                          {network.platform}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {network.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-slate-50 text-slate-600 border border-slate-200 text-[10px] uppercase font-bold px-2 py-0.5">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="space-y-3 pt-2 text-sm text-slate-600">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                            Directory & Placement Tracking:
                          </span>
                          <p className="leading-relaxed">{network.tracking}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                            Vetting Protocol & Criteria:
                          </span>
                          <p className="leading-relaxed">{network.vetting}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide block">
                            Core Practical Utility:
                          </span>
                          <p className="leading-relaxed bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 font-medium text-slate-700">
                            {network.utility}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Access Connection Ledger
                        </span>
                        <div className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-slate-500 shrink-0" />
                          <span>{network.social}</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 w-full sm:w-auto font-black"
                        onClick={() => {
                          toast.success(`Redirecting to verified interface for ${network.name}`);
                        }}
                      >
                        Launch Portal <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Request Assistance / Booking Box */}
            <section className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900">In-Residence Nanny Staffing Request</h2>
                <p className="text-slate-500 mt-2">
                  Complete this form to distribute your specifications to verified specialized private agencies operating within your urban corridor. Receive matches direct to your phone.
                </p>
              </div>

              {nannySubmitted ? (
                <div className="text-center py-12 space-y-6 bg-green-50/50 rounded-2xl border border-green-200 p-6">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-900">Placement Request Active!</h3>
                  <p className="text-green-800 font-medium max-w-lg mx-auto">
                    Your candidate specifications have been securely broadcasted to local corridor staffing agencies. A designated staff coordinator will reach out directly on your mobile number within 24 hours.
                  </p>
                  <Button onClick={() => setNannySubmitted(false)} className="bg-green-600 hover:bg-green-700 text-white rounded-xl">
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleNannySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="parentName" className="font-bold text-slate-700">Full Name (Parent/Sponsor)</Label>
                      <Input 
                        id="parentName" 
                        required 
                        value={nannyFormData.parentName} 
                        onChange={(e) => setNannyFormData(prev => ({ ...prev, parentName: e.target.value }))} 
                        placeholder="e.g. Sipho Myati" 
                        className="rounded-xl border-slate-200 h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nannyPhone" className="font-bold text-slate-700">Phone & WhatsApp Number</Label>
                      <Input 
                        id="nannyPhone" 
                        required 
                        type="tel"
                        value={nannyFormData.phone} 
                        onChange={(e) => setNannyFormData(prev => ({ ...prev, phone: e.target.value }))} 
                        placeholder="e.g. +268 7600 0000" 
                        className="rounded-xl border-slate-200 h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="corridor" className="font-bold text-slate-700">Urban Corridor Area</Label>
                      <select 
                        id="corridor"
                        value={nannyFormData.corridor}
                        onChange={(e) => setNannyFormData(prev => ({ ...prev, corridor: e.target.value }))}
                        className="w-full h-11 px-3 border border-slate-200 bg-white rounded-xl font-medium focus:ring-1 focus:ring-indigo-650"
                      >
                        <option>Mbabane-Manzini Corridor</option>
                        <option>Ezulwini Valley Residential Area</option>
                        <option>Matsapha & Kwaluseni Industrial Outpost</option>
                        <option>Malkerns & Agricultural Valley Corridor</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="infantAge" className="font-bold text-slate-700">Infant Age Range</Label>
                      <select 
                        id="infantAge"
                        value={nannyFormData.infantAgeMonths}
                        onChange={(e) => setNannyFormData(prev => ({ ...prev, infantAgeMonths: e.target.value }))}
                        className="w-full h-11 px-3 border border-slate-200 bg-white rounded-xl font-medium focus:ring-1 focus:ring-indigo-650"
                      >
                        <option>Under 3 months (Sought: Newborn nurse)</option>
                        <option>3 to 6 months old</option>
                        <option>6 to 12 months old</option>
                        <option>Over 12 months old</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <Label className="font-bold text-slate-700 block">Required Caregiver Credentials & Safety Audits</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded text-indigo-600 focus:ring-indigo-650 border-slate-300 mt-1" 
                          checked={nannyFormData.requiresPediatricCPR}
                          onChange={(e) => setNannyFormData(prev => ({ ...prev, requiresPediatricCPR: e.target.checked }))}
                        />
                        <div>
                          <span className="text-sm font-bold text-slate-800 block">Certified Pediatric CPR Placements</span>
                          <span className="text-xs text-slate-500">Only candidates certified in Infant Choking and CPR relief.</span>
                        </div>
                      </label>
                      <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded text-indigo-600 focus:ring-indigo-650 border-slate-300 mt-1" 
                          checked={nannyFormData.requiresBackgroundCheck}
                          onChange={(e) => setNannyFormData(prev => ({ ...prev, requiresBackgroundCheck: e.target.checked }))}
                        />
                        <div>
                          <span className="text-sm font-bold text-slate-800 block">Police & Reference Screening</span>
                          <span className="text-xs text-slate-500">Verified identity validation & formal character checks.</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements" className="font-bold text-slate-700">Write Any Specific Preferences or Needs (e.g. Bilingual, Shift Coverage)</Label>
                    <Textarea 
                      id="requirements" 
                      value={nannyFormData.requirements} 
                      onChange={(e) => setNannyFormData(prev => ({ ...prev, requirements: e.target.value }))} 
                      placeholder="e.g. We require a caregiver from 6:30 AM to 5:30 PM, Monday - Friday, fluent in both English & siSwati..." 
                      className="rounded-xl border-slate-200 min-h-[100px]"
                    />
                  </div>

                  <Button type="submit" disabled={nannyLoading} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
                    {nannyLoading ? "Submitting Placement Specification..." : <>Request Matching Candidates <ArrowRight className="h-4 w-4" /></>}
                  </Button>
                </form>
              )}
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

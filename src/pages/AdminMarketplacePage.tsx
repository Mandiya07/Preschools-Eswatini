import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MonitorSmartphone, Camera, TrendingUp, ShieldCheck, 
  Palette, Bus, FileSpreadsheet, GraduationCap,
  Sparkles, CheckCircle2, ChevronRight, ShoppingCart,
  Shirt, PenTool, Puzzle, Download, Armchair, BookOpen, Store, Gift, Coins
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/lib/AuthContext";
import { AddonMarketplaceCatalog } from "@/components/AddonMarketplaceCatalog";
import { ReferralProgramCard } from "@/components/ReferralProgramCard";
import { getOrCreateSchoolCreditAccount, SchoolCreditAccount } from "@/lib/referralUtils";

const MODULES = [
  {
    id: "transport",
    name: "Transport Tracking",
    description: "Live GPS tracking of school buses, driver assignments, and automated parent notifications.",
    price: "E199/mo",
    icon: <Bus className="h-6 w-6" />,
    color: "bg-amber-50 text-amber-600",
    status: "available",
  },
  {
    id: "report-cards",
    name: "Digital Report Cards",
    description: "Advanced grading system, customizable templates, and secure digital publishing for parents.",
    price: "E149/mo",
    icon: <FileSpreadsheet className="h-6 w-6" />,
    color: "bg-blue-50 text-blue-600",
    status: "active",
  },
  {
    id: "e-learning",
    name: "E-Learning Suite",
    description: "Course builder, video hosting, assignment submissions, and AI-assisted grading.",
    price: "E299/mo",
    icon: <GraduationCap className="h-6 w-6" />,
    color: "bg-indigo-50 text-indigo-600",
    status: "available",
  },
];

const STOREFRONTS = [
  {
    id: "uniforms",
    name: "Uniforms & Merchandise",
    description: "Launch your own online store with full inventory management for branded school uniforms and merchandise.",
    price: "5% Rev Share",
    icon: <Shirt className="h-6 w-6" />,
    color: "bg-blue-50 text-blue-600",
    status: "available",
  },
  {
    id: "supplies",
    name: "Learning Kits & Supplies",
    description: "Sell approved back-to-school learning kits and everyday classroom supplies directly to parents.",
    price: "5% Rev Share",
    icon: <PenTool className="h-6 w-6" />,
    color: "bg-amber-50 text-amber-600",
    status: "available",
  },
  {
    id: "events",
    name: "Event Ticketing",
    description: "Sell and manage digital tickets for graduations, sports days, and other premium school events.",
    price: "Free to Setup",
    icon: <ShoppingCart className="h-6 w-6" />,
    color: "bg-rose-50 text-rose-600",
    status: "available",
  },
  {
    id: "downloads",
    name: "Educational Resources",
    description: "Sell premium digital educational resources, worksheets, coloring books, and at-home lesson guides.",
    price: "Free to Setup",
    icon: <Download className="h-6 w-6" />,
    color: "bg-purple-50 text-purple-600",
    status: "available",
  },
];

const WHOLESALE = [
  {
    id: "furniture",
    name: "Preschool Furniture Marketplace",
    description: "Buy wholesale desks, cots, cubbies, and play kitchens directly from trusted manufacturers.",
    icon: <Armchair className="h-6 w-6" />,
    color: "bg-orange-50 text-orange-600",
  },
  {
    id: "teacher-resources",
    name: "Teacher Resources Marketplace",
    description: "Marketplace for schools to buy/sell lesson plans, classroom decor, and specialized tools.",
    icon: <BookOpen className="h-6 w-6" />,
    color: "bg-teal-50 text-teal-600",
  }
];

const SERVICES = [
  {
    name: "Digital Marketing & SEO",
    description: "Let our experts handle your social media, Google ads, and search engine optimization to boost enrollments.",
    icon: <TrendingUp className="h-6 w-6" />,
  },
  {
    name: "Professional Photography",
    description: "High-quality drone and on-the-ground photography to make your website and social media stand out.",
    icon: <Camera className="h-6 w-6" />,
  },
  {
    name: "Official Verification",
    description: "Get the 'Verified Institution' badge on our national directory to build trust with parents.",
    icon: <ShieldCheck className="h-6 w-6" />,
  }
];

export function AdminMarketplacePage() {
  const { user, activeSchoolId } = useAuth();
  const effectiveSchoolId = user?.role === 'SuperAdmin' ? activeSchoolId : user?.schoolId;

  const [activeTab, setActiveTab] = useState("addons");
  const [creditAccount, setCreditAccount] = useState<SchoolCreditAccount | null>(null);

  useEffect(() => {
    if (effectiveSchoolId) {
      getOrCreateSchoolCreditAccount(effectiveSchoolId, (user as any)?.schoolName || "Preschool").then(setCreditAccount);
    }
  }, [effectiveSchoolId, user]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <SEO title="Marketplace | Preschools Eswatini Admin" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-8 rounded-[2rem] shadow-lg overflow-hidden relative border border-slate-800">
        <div className="absolute top-0 right-0 opacity-10">
          <Sparkles className="h-48 w-48 -mt-10 -mr-10" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
            <Coins className="h-3.5 w-3.5" /> Fair Usage & Organic Growth Marketplace
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">App Marketplace &amp; Referrals</h1>
          <p className="text-slate-300 mt-2 text-base font-medium max-w-2xl">
            Access transparent school add-ons (SMS, AI, Domains, Media) and earn E100 credit for every preschool you refer to the platform.
          </p>
        </div>
        <div className="relative z-10 hidden md:block">
           <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
             <p className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1">Available Credits</p>
             <p className="text-3xl font-black text-white">E{creditAccount?.availableCredit?.toLocaleString() || "0.00"}</p>
             <p className="text-[10px] text-slate-300 mt-0.5">Earned via referrals</p>
           </div>
        </div>
      </div>

      <Tabs defaultValue="addons" className="w-full mt-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:w-[900px] h-auto p-1 mb-8 bg-slate-100 rounded-2xl">
          <TabsTrigger value="addons" className="rounded-xl text-xs md:text-sm font-bold py-2.5 px-3">Add-On Marketplace</TabsTrigger>
          <TabsTrigger value="referrals" className="rounded-xl text-xs md:text-sm font-bold py-2.5 px-3 text-emerald-800 bg-emerald-50/60">Earn E100 Credit</TabsTrigger>
          <TabsTrigger value="storefronts" className="rounded-xl text-xs md:text-sm font-bold py-2.5 px-3">School Storefronts</TabsTrigger>
          <TabsTrigger value="wholesale" className="rounded-xl text-xs md:text-sm font-bold py-2.5 px-3">Wholesale B2B</TabsTrigger>
          <TabsTrigger value="services" className="rounded-xl text-xs md:text-sm font-bold py-2.5 px-3">Expert Services</TabsTrigger>
        </TabsList>

        <TabsContent value="addons" className="space-y-6">
          <AddonMarketplaceCatalog 
            schoolId={effectiveSchoolId || "demo_school"}
            schoolName={(user as any)?.schoolName || "Preschool"}
            userEmail={user?.email || ""}
            userName={user?.name || ""}
          />
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <ReferralProgramCard 
            schoolId={effectiveSchoolId || "demo_school"}
            schoolName={(user as any)?.schoolName || "Preschool"}
            userEmail={user?.email || ""}
            userName={user?.name || ""}
          />
        </TabsContent>

        <TabsContent value="storefronts" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STOREFRONTS.map((module) => (
              <Card key={module.id} className="rounded-[2rem] border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className={`h-14 w-14 rounded-2xl ${module.color} flex items-center justify-center mb-4`}>
                    {module.icon}
                  </div>
                  <CardTitle className="text-xl font-extrabold">{module.name}</CardTitle>
                  <CardDescription className="text-base font-medium h-20">{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2 mb-4">
                     <span className="text-2xl font-extrabold">{module.price}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full h-12 text-base font-bold rounded-xl shadow-md">
                    <Store className="mr-2 h-5 w-5" /> Enable Storefront
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="wholesale" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHOLESALE.map((module) => (
              <Card key={module.id} className="rounded-[2rem] border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className={`h-14 w-14 rounded-2xl ${module.color} flex items-center justify-center mb-4`}>
                    {module.icon}
                  </div>
                  <CardTitle className="text-xl font-extrabold">{module.name}</CardTitle>
                  <CardDescription className="text-base font-medium h-20">{module.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-6">
                  <Button className="w-full h-12 text-base font-bold rounded-xl shadow-md">
                    <ShoppingCart className="mr-2 h-5 w-5" /> Browse Products
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
           <div className="max-w-4xl mx-auto space-y-6">
             {SERVICES.map((service, idx) => (
               <Card key={idx} className="rounded-[2rem] border-slate-200 shadow-sm hover:border-primary/30 transition-colors cursor-pointer">
                 <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                   <div className="h-20 w-20 shrink-0 rounded-[1.5rem] bg-secondary/20 text-secondary-foreground flex items-center justify-center">
                     {service.icon}
                   </div>
                   <div className="flex-1 text-center md:text-left">
                     <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{service.name}</h3>
                     <p className="text-lg text-slate-600 font-medium">{service.description}</p>
                   </div>
                   <div className="shrink-0">
                     <Button className="h-14 px-8 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20">
                       Request Quote <ChevronRight className="ml-2 h-5 w-5" />
                     </Button>
                   </div>
                 </CardContent>
               </Card>
             ))}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


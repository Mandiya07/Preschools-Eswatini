import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MonitorSmartphone, Camera, TrendingUp, ShieldCheck, 
  Palette, Bus, FileSpreadsheet, GraduationCap,
  Sparkles, CheckCircle2, ChevronRight, ShoppingCart,
  Shirt, PenTool, Puzzle, Download, Armchair, BookOpen, Store
} from "lucide-react";
import { SEO } from "@/components/SEO";

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

const THEMES = [
  {
    id: "theme-modern",
    name: "African Modern",
    description: "A beautiful, vibrant theme with warm colors and a modern aesthetic.",
    price: "E499",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop",
    type: "Premium",
  },
  {
    id: "theme-classic",
    name: "Collegiate Classic",
    description: "Traditional and professional. Best suited for large preschools and daycares.",
    price: "E399",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop",
    type: "Premium",
  },
  {
    id: "theme-kids",
    name: "Playful Preschool",
    description: "Fun, bright, and engaging design intended for daycares.",
    price: "Free",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop",
    type: "Included",
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
  const [activeTab, setActiveTab] = useState("modules");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <SEO title="Marketplace | Preschools Eswatini Admin" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8 rounded-[2rem] shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10">
          <Sparkles className="h-48 w-48 -mt-10 -mr-10" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight">App Marketplace</h1>
          <p className="text-primary-foreground/80 mt-2 text-lg font-medium max-w-xl">
            Extend your platform with powerful add-on modules, premium themes, and professional services designed to grow your institution.
          </p>
        </div>
        <div className="relative z-10 hidden md:block">
           <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 text-center">
             <p className="text-sm font-bold uppercase tracking-wider mb-1">Available Credits</p>
             <p className="text-3xl font-extrabold">E0.00</p>
           </div>
        </div>
      </div>

      <Tabs defaultValue="modules" className="w-full mt-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-[800px] h-auto p-1 mb-8 bg-slate-100 rounded-2xl md:h-14">
          <TabsTrigger value="modules" className="rounded-xl text-sm md:text-base font-bold data-[state=active]:shadow-sm py-2 px-3">Software Add-ons</TabsTrigger>
          <TabsTrigger value="storefronts" className="rounded-xl text-sm md:text-base font-bold data-[state=active]:shadow-sm py-2 px-3">School Storefronts</TabsTrigger>
          <TabsTrigger value="wholesale" className="rounded-xl text-sm md:text-base font-bold data-[state=active]:shadow-sm py-2 px-3">Wholesale & B2B</TabsTrigger>
          <TabsTrigger value="services" className="rounded-xl text-sm md:text-base font-bold data-[state=active]:shadow-sm py-2 px-3">Expert Services</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((module) => (
              <Card key={module.id} className="rounded-[2rem] border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className={`h-14 w-14 rounded-2xl ${module.color} flex items-center justify-center mb-4`}>
                    {module.icon}
                  </div>
                  <CardTitle className="text-xl font-extrabold">{module.name}</CardTitle>
                  <CardDescription className="text-base font-medium h-16">{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2 mb-4">
                     <span className="text-2xl font-extrabold">{module.price}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  {module.status === "active" ? (
                    <Button variant="secondary" className="w-full h-12 text-base font-bold text-green-700 bg-green-50 hover:bg-green-100 border-none pointer-events-none">
                      <CheckCircle2 className="mr-2 h-5 w-5" /> Installed & Active
                    </Button>
                  ) : (
                    <Button className="w-full h-12 text-base font-bold rounded-xl shadow-md">
                      <ShoppingCart className="mr-2 h-5 w-5" /> Add Module
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
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

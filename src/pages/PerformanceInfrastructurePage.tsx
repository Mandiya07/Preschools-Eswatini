import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Server, Globe, Layers, Database, Zap, 
  Image as ImageIcon, Box, Code, ShieldCheck, Sparkles
} from "lucide-react";
import { SEO } from "@/components/SEO";

const FEATURES = [
  { id: "hosting", title: "Multi-region Hosting", icon: <Server className="h-6 w-6" />, color: "bg-blue-50 text-blue-600", description: "Global deployment for low-latency." },
  { id: "cdn", title: "CDN Optimization", icon: <Globe className="h-6 w-6" />, color: "bg-slate-50 text-slate-600", description: "Lightning-fast content delivery." },
  { id: "scaling", title: "Automatic Scaling", icon: <Layers className="h-6 w-6" />, color: "bg-red-50 text-red-600", description: "Seamlessly handle traffic spikes." },
  { id: "queues", title: "Queue Systems", icon: <Database className="h-6 w-6" />, color: "bg-emerald-50 text-emerald-600", description: "Robust task management." },
  { id: "caching", title: "Caching Systems", icon: <Zap className="h-6 w-6" />, color: "bg-amber-50 text-amber-600", description: "Optimized data retrieval." },
  { id: "compression", title: "Image Compression", icon: <ImageIcon className="h-6 w-6" />, color: "bg-yellow-50 text-yellow-600", description: "Faster loads, better visuals." },
  { id: "microservices", title: "Microservices", icon: <Box className="h-6 w-6" />, color: "bg-purple-50 text-purple-600", description: "Scalable modular architecture." },
  { id: "api", title: "API-first", icon: <Code className="h-6 w-6" />, color: "bg-indigo-50 text-indigo-600", description: "Built for seamless integrations." },
  { id: "availability", title: "High Availability", icon: <ShieldCheck className="h-6 w-6" />, color: "bg-rose-50 text-rose-600", description: "Reliable, uptime-focused design." },
];

export function PerformanceInfrastructurePage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <SEO title="Performance & Infrastructure | Sikolo" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Performance & Infrastructure</h1>
          <p className="text-lg text-slate-600 mt-2">Enterprise-grade backbone for your school platform.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
           <Sparkles className="mr-2 h-4 w-4" /> View Technical Specs
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature) => (
          <Card key={feature.id} className="rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${feature.color}`}>
                {feature.icon}
              </div>
              <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

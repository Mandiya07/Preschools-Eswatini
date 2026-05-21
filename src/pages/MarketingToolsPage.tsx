import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, MapPinned, Share2, Mail, Megaphone, 
  LayoutTemplate, UserPlus, Users, Sparkles
} from "lucide-react";
import { SEO } from "@/components/SEO";

const FEATURES = [
  { id: "seo", title: "SEO Automation", icon: <Search className="h-6 w-6" />, color: "bg-blue-50 text-blue-600", description: "Boost your school's visibility." },
  { id: "google", title: "Google Business", icon: <MapPinned className="h-6 w-6" />, color: "bg-slate-50 text-slate-600", description: "Manage local listings effortlessly." },
  { id: "social", title: "Social Auto-posting", icon: <Share2 className="h-6 w-6" />, color: "bg-emerald-50 text-emerald-600", description: "Stay active on social platforms." },
  { id: "email", title: "Email Campaigns", icon: <Mail className="h-6 w-6" />, color: "bg-red-50 text-red-600", description: "Engage parents with newsletters." },
  { id: "ads", title: "AI-generated Ads", icon: <Megaphone className="h-6 w-6" />, color: "bg-amber-50 text-amber-600", description: "Create compelling ad content." },
  { id: "landing", title: "Landing Page Builder", icon: <LayoutTemplate className="h-6 w-6" />, color: "bg-yellow-50 text-yellow-600", description: "Design high-converting pages." },
  { id: "leads", title: "Lead Generation", icon: <UserPlus className="h-6 w-6" />, color: "bg-purple-50 text-purple-600", description: "Attract and convert more parents." },
  { id: "referrals", title: "Parent Referrals", icon: <Users className="h-6 w-6" />, color: "bg-indigo-50 text-indigo-600", description: "Turn parents into brand ambassadors." },
];

export function MarketingToolsPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <SEO title="Marketing Tools | Preschools Eswatini" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Automated Marketing Tools</h1>
          <p className="text-lg text-slate-600 mt-2">Attract the right families with smart, automated marketing.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
           <Sparkles className="mr-2 h-4 w-4" /> Start Campaign
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

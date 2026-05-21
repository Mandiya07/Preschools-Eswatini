import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MapPin, Map, Video, Images, Zap, Clock, 
  MessageCircleHeart, UserSquare, HelpCircle, Award, Sparkles
} from "lucide-react";
import { SEO } from "@/components/SEO";

const FEATURES = [
  { id: "tours", title: "Virtual Tours", icon: <MapPin className="h-6 w-6" />, color: "bg-blue-50 text-blue-600", description: "Immersive virtual tours of your facilities." },
  { id: "maps", title: "Interactive Maps", icon: <Map className="h-6 w-6" />, color: "bg-slate-50 text-slate-600", description: "Engaging maps for school locations." },
  { id: "video", title: "Video Backgrounds", icon: <Video className="h-6 w-6" />, color: "bg-red-50 text-red-600", description: "Dynamic video backgrounds for branding." },
  { id: "galleries", title: "Animated Galleries", icon: <Images className="h-6 w-6" />, color: "bg-emerald-50 text-emerald-600", description: "Beautiful, animated photo showcases." },
  { id: "ai", title: "AI Optimization", icon: <Zap className="h-6 w-6" />, color: "bg-amber-50 text-amber-600", description: "AI-powered image enhancements." },
  { id: "countdowns", title: "Event Countdowns", icon: <Clock className="h-6 w-6" />, color: "bg-yellow-50 text-yellow-600", description: "Exciting countdowns for big events." },
  { id: "testimonials", title: "Testimonials Carousel", icon: <MessageCircleHeart className="h-6 w-6" />, color: "bg-purple-50 text-purple-600", description: "Showcase parent success stories." },
  { id: "spotlight", title: "Staff Spotlight", icon: <UserSquare className="h-6 w-6" />, color: "bg-indigo-50 text-indigo-600", description: "Highlight your amazing team." },
  { id: "faqs", title: "Dynamic FAQs", icon: <HelpCircle className="h-6 w-6" />, color: "bg-rose-50 text-rose-600", description: "Answers to common parent questions." },
  { id: "achievements", title: "Achievements Showcase", icon: <Award className="h-6 w-6" />, color: "bg-cyan-50 text-cyan-600", description: "Celebrate school milestones." },
];

export function AdvancedWebsiteFeaturesPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <SEO title="Advanced Features | Preschools Eswatini" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Advanced Website Features</h1>
          <p className="text-lg text-slate-600 mt-2">Elevate your school's brand with premium digital experiences.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
           <Sparkles className="mr-2 h-4 w-4" /> Get Started
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

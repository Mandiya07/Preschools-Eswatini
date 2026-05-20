import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Gamepad2, Video, BookOpenText, Printer, 
  Users, Presentation, Sparkles, ChevronRight
} from "lucide-react";
import { SEO } from "@/components/SEO";

const FEATURES = [
  { id: "games", title: "Interactive Games", icon: <Gamepad2 className="h-6 w-6" />, color: "bg-blue-50 text-blue-600", description: "Engaging educational games for skill building." },
  { id: "videos", title: "Educational Videos", icon: <Video className="h-6 w-6" />, color: "bg-red-50 text-red-600", description: "Curated video lessons for early learners." },
  { id: "story", title: "Storytelling", icon: <BookOpenText className="h-6 w-6" />, color: "bg-purple-50 text-purple-600", description: "Interactive storytelling modules." },
  { id: "worksheets", title: "Printable Worksheets", icon: <Printer className="h-6 w-6" />, color: "bg-amber-50 text-amber-600", description: "Offline activity sheets." },
  { id: "parents", title: "Parent Activities", icon: <Users className="h-6 w-6" />, color: "bg-emerald-50 text-emerald-600", description: "Guided home activities." },
  { id: "live", title: "Live Virtual Classes", icon: <Presentation className="h-6 w-6" />, color: "bg-indigo-50 text-indigo-600", description: "Schedule and join live sessions." },
];

export function DigitalLearningEcosystemPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <SEO title="Digital Learning Ecosystem | Sikolo" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Digital Early-Learning Ecosystem</h1>
          <p className="text-lg text-slate-600 mt-2">A holistic, interactive learning experience for students, parents, and teachers.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
           <Sparkles className="mr-2 h-4 w-4" /> AI Personalized Plan
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
      
      <Card className="rounded-3xl border border-blue-100 bg-blue-50/50 p-6">
         <CardHeader>
            <CardTitle className="text-blue-900">AI-Assisted Learning Personalization</CardTitle>
            <CardDescription>Get custom learning paths for each child based on their progress and interests.</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="bg-white p-4 rounded-xl shadow-inner border border-blue-100 italic">
               "Based on Thabo's recent interest in space, I recommend the 'Interactive Planets' module and a printable 'Solar System' coloring activity."
            </div>
         </CardContent>
      </Card>
    </div>
  );
}

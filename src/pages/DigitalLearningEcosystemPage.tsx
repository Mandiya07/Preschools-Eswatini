import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Gamepad2, Video, BookOpenText, Printer, 
  Users, Presentation, Sparkles, ChevronRight
} from "lucide-react";
import { SEO } from "@/components/SEO";
import kidsDigitalImg from '@/assets/images/kids_digital_learning_1779268599993.png';

const FEATURES = [
  { 
    id: "games", 
    title: "Interactive Games", 
    icon: <Gamepad2 className="h-6 w-6" />, 
    color: "bg-blue-50 text-blue-600", 
    description: "Engaging, curriculum-aligned educational games that adapt to your child's pace, focusing on early math and literacy skills.",
    count: "45+ Games"
  },
  { 
    id: "videos", 
    title: "Educational Videos", 
    icon: <Video className="h-6 w-6" />, 
    color: "bg-red-50 text-red-600", 
    description: "A library of 500+ curated video lessons narrated by master teachers, covering topics from phonics to simple biology.",
    count: "500+ Videos"
  },
  { 
    id: "story", 
    title: "Storytelling", 
    icon: <BookOpenText className="h-6 w-6" />, 
    color: "bg-purple-50 text-purple-600", 
    description: "Immersive, interactive storytelling modules that promote reading comprehension and empathy in early learners.",
    count: "120+ Stories"
  },
  { 
    id: "worksheets", 
    title: "Printable Worksheets", 
    icon: <Printer className="h-6 w-6" />, 
    color: "bg-amber-50 text-amber-600", 
    description: "Downloadable PDF activity sheets for offline learning, designed to complement our digital lessons.",
    count: "300+ PDFs"
  },
  { 
    id: "parents", 
    title: "Parent Activities", 
    icon: <Users className="h-6 w-6" />, 
    color: "bg-emerald-50 text-emerald-600", 
    description: "Weekly guided home activities and project ideas for parents to reinforce classroom learning through fun, daily routines.",
    count: "52+ Plans"
  },
  { 
    id: "live", 
    title: "Live Virtual Classes", 
    icon: <Presentation className="h-6 w-6" />, 
    color: "bg-indigo-50 text-indigo-600", 
    description: "Weekly live virtual classroom sessions where students connect with peers and expert instructors for collaborative, interactive learning.",
    count: "15+ Sessions/wk"
  },
  { 
    id: "music", 
    title: "Music & Arts", 
    icon: <Gamepad2 className="h-6 w-6" />, 
    color: "bg-pink-50 text-pink-600", 
    description: "Creative arts modules focusing on rhythm, painting, and digital music composition for young artists.",
    count: "30+ Lessons"
  },
];

export function DigitalLearningEcosystemPage() {
  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
      <SEO title="Digital Learning Ecosystem | Preschools Eswatini" />
      
      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center pt-8">
        <div>
          <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-bold text-blue-800 mb-6">
            <Sparkles className="h-4 w-4 mr-2" /> Playful Learning
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Digital Early-Learning <span className="text-blue-600">Ecosystem</span>
          </h1>
          <p className="text-xl text-slate-600 mt-6 font-medium leading-relaxed">
            A holistic, interactive learning experience that makes early childhood education engaging for students, effortless for parents, and insightful for teachers.
          </p>
          <div className="mt-8">
            <Button className="h-14 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-600/20">
              <Sparkles className="mr-2 h-5 w-5" /> Experience AI Personalization
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-blue-200 rounded-[3rem] transform rotate-3 scale-105 opacity-50 z-0"></div>
          <img 
            src={kidsDigitalImg} 
            alt="Child using digital learning app" 
            className="relative z-10 w-full rounded-[2.5rem] shadow-xl object-cover aspect-square border-4 border-white"
          />
        </div>
      </div>

      <div className="pt-8">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Discover Our Modules</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature) => (
          <Card key={feature.id} className="rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${feature.color}`}>
                {feature.icon}
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-lg font-bold">{feature.title}</CardTitle>
                <Badge variant="secondary" className="w-fit mt-1 text-[10px]">{feature.count}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{feature.description}</p>
              <Button variant="ghost" className="mt-4 px-0 text-blue-600 hover:text-blue-700">
                Explore <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>
      
      <Card className="rounded-3xl border border-blue-100 bg-blue-50/50 p-6">
         <CardHeader>
            <CardTitle className="text-blue-900">AI-Assisted Learning Personalization</CardTitle>
            <CardDescription>Get custom learning paths for each child based on their progress and interests.</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="bg-white p-4 rounded-xl shadow-inner border border-blue-100 italic text-slate-700">
               "Based on Thabo's recent interest in space, I recommend the 'Interactive Planets' module and a printable 'Solar System' coloring activity."
            </div>
         </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import {
  MessageSquare,
  LifeBuoy,
  BookOpen,
  Video,
  HelpCircle,
  Search,
  ArrowRight,
  Sparkles,
  PlayCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import { AIChatBot } from "@/components/AIChatBot";

const SUPPORT_CATEGORIES = [
  { id: "getting-started", title: "Getting Started", icon: <Sparkles className="h-6 w-6" />, description: "Quick video tutorials and guides to set up your account." },
  { id: "billing", title: "Billing & Subscriptions", icon: <LifeBuoy className="h-6 w-6" />, description: "Manage invoices and subscription plans." },
  { id: "platform", title: "Platform Features", icon: <BookOpen className="h-6 w-6" />, description: "Detailed manuals on how to use every tool." },
];

export function AdminSupportPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <SEO title="Support Ecosystem | Sikolo" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Support Center</h1>
          <p className="text-slate-500 text-lg">Your centralized hub for assistance, learning, and guidance.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg">
          <MessageSquare className="h-4 w-4 mr-2" /> Live Chat
        </Button>
      </div>

      {/* Main Support Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Knowledge & Tutorials */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Need help? Search our resources</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input placeholder="Search tutorials, articles, or FAQs..." className="pl-12 h-14 rounded-2xl border-slate-200 text-base" />
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {SUPPORT_CATEGORIES.map((cat) => (
              <Card key={cat.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                    <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">{cat.icon}</div>
                    <CardTitle className="text-lg">{cat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">{cat.description}</p>
                  <Button variant="ghost" className="text-blue-600 px-0 hover:bg-transparent hover:underline">
                    View guides <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-none shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Video className="h-6 w-6 text-blue-600" /> Video Onboarding
            </h2>
            <div className="grid grid-cols-2 gap-4">
                {[1, 2].map(i => (
                    <div key={i} className="aspect-video bg-slate-900 rounded-2xl flex items-center justify-center group cursor-pointer relative overflow-hidden">
                        <img src={`https://images.unsplash.com/photo-1544716273-ca5e46631855?w=500&h=300&fit=crop`} alt="Video thumbnail" className="opacity-60 group-hover:opacity-100 transition-opacity" />
                        <PlayCircle className="h-16 w-16 text-white absolute opacity-80 group-hover:scale-110 transition-transform" />
                    </div>
                ))}
            </div>
          </Card>
        </div>

        {/* AI Assistant & Quick Actions */}
        <div className="space-y-6">
            <Card className="border-none shadow-sm p-6 bg-slate-900 text-white rounded-3xl">
                <CardHeader className="p-0 mb-4">
                    <CardTitle>AI Support Agent</CardTitle>
                    <CardDescription className="text-slate-400">Get instant answers to your questions.</CardDescription>
                </CardHeader>
                <AIChatBot schoolName="Sikolo" />
                <Button className="w-full mt-4 bg-white text-slate-900 hover:bg-slate-100 rounded-xl">
                   Start Chat
                </Button>
            </Card>

            <Card className="border-none shadow-sm p-6">
                <h3 className="font-bold mb-4">Quick Support</h3>
                <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start rounded-xl">
                        <HelpCircle className="h-4 w-4 mr-2" /> Submit a Ticket
                    </Button>
                    <Button variant="outline" className="w-full justify-start rounded-xl">
                        <MessageSquare className="h-4 w-4 mr-2" /> Community Forum
                    </Button>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}

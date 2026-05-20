import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, MessageSquare, Calendar, Image as ImageIcon,
  Rss, Star, Megaphone, BookOpen, UserCircle, Sparkles, ShoppingBag, 
  FileText, Download, Search, Upload
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  { id: "parents", title: "Parent Communities", icon: <Users className="h-6 w-6" />, color: "bg-blue-50 text-blue-600", description: "Connect with other parents in your school." },
  { id: "boards", title: "Discussion Boards", icon: <MessageSquare className="h-6 w-6" />, color: "bg-slate-50 text-slate-600", description: "Engage in school-wide discussions." },
  { id: "events", title: "Event RSVPs", icon: <Calendar className="h-6 w-6" />, color: "bg-red-50 text-red-600", description: "Easily manage and track event attendance." },
  { id: "photos", title: "Photo Sharing", icon: <ImageIcon className="h-6 w-6" />, color: "bg-emerald-50 text-emerald-600", description: "Securely share classroom moments." },
  { id: "feed", title: "Classroom Feeds", icon: <Rss className="h-6 w-6" />, color: "bg-amber-50 text-amber-600", description: "Stay updated with class activities." },
  { id: "reviews", title: "Parent Reviews", icon: <Star className="h-6 w-6" />, color: "bg-yellow-50 text-yellow-600", description: "Share your experiences and feedback." },
  { id: "announcements", title: "Announcements", icon: <Megaphone className="h-6 w-6" />, color: "bg-purple-50 text-purple-600", description: "Important school updates." },
  { id: "blogs", title: "School Blogs", icon: <BookOpen className="h-6 w-6" />, color: "bg-indigo-50 text-indigo-600", description: "Read the latest school stories." },
  { id: "profiles", title: "Teacher Profiles", icon: <UserCircle className="h-6 w-6" />, color: "bg-rose-50 text-rose-600", description: "Get to know your teachers." },
];

const SHARED_DOCUMENTS = [
  { id: "doc3", title: "School Presentation", type: "presentation", status: "shared_to_network" },
  { id: "doc4", title: "Creative Arts Lesson Plan", type: "lesson_plan", status: "shared_to_network" },
  { id: "doc5", title: "Phonics Activities", type: "worksheet", status: "shared_to_network" },
];

export function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocs = SHARED_DOCUMENTS.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <SEO title="Community & Social | Sikolo" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Community & Social Hub</h1>
          <p className="text-lg text-slate-600 mt-2">Engage, connect, and grow with your preschool community.</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <Card key={feature.id} className="rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
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
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Community Marketplace</h2>
            <p className="text-slate-600 max-w-2xl">Explore shared educational resources created by preschools in our network or upload your own.</p>
            
            <div className="flex items-center gap-4 w-full max-w-2xl mt-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input 
                  placeholder="Search resources..." 
                  className="pl-10 h-12 rounded-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="rounded-full h-12 px-6">
                <Upload className="mr-2 h-4 w-4" /> Upload
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => (
              <Card key={doc.id} className="rounded-2xl border-slate-200">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                    <CardDescription className="capitalize">{doc.type.replace('_', ' ')}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mt-4">
                    <Badge variant="secondary">Shared</Badge>
                    <button className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
                        <Download className="h-4 w-4" /> Download
                    </button>
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

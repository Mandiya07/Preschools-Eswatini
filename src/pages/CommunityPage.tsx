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

const SHARED_DOCUMENTS: any[] = [];

export function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocs = SHARED_DOCUMENTS.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-16 pb-24">
      <SEO title="Community & Social | Preschools Eswatini" />
      
      {/* Hero Section */}
      <section className="bg-slate-900 pt-20 pb-24 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529156069898-49953eb1b5e4?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
           <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-6 px-3 py-1">Community Hub</Badge>
           <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
             Engage, connect, <br/>and grow together.
           </h1>
           <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
             Join school discussions, RSVP to events, browse secure photo galleries, and download resources shared by trusted teachers across the network.
           </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
        <Tabs defaultValue="overview" className="space-y-12">
          <TabsList className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-2 border border-slate-100 flex items-center h-16 w-full max-w-sm mx-auto">
            <TabsTrigger value="overview" className="flex-1 rounded-xl font-bold h-full">Overview</TabsTrigger>
            <TabsTrigger value="marketplace" className="flex-1 rounded-xl font-bold h-full">Marketplace</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature) => (
                <Card key={feature.id} className="rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 font-medium">{feature.description}</p>
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
      </section>
    </div>
  );
}

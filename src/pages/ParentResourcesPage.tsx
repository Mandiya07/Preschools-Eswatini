import { SEO } from "@/components/SEO";
import { BookOpen, Lightbulb, Newspaper, PlayCircle, BookMarked, Search, ArrowRight, Layout, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ParentResourcesPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-12 pb-20">
      <SEO title="Parent Resources & Articles | Preschools Eswatini Platform" />
      
      {/* Hero Section */}
      <section className="bg-slate-900 pt-20 pb-24 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
           <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-6">Discovery Hub</Badge>
           <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
             Expert preschool insights,<br/>delivered by educators.
           </h1>
           <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
             Explore thousands of parenting articles, school blogs, newsletters, and early-learning resources published directly by verified preschools.
           </p>
           
           <div className="max-w-xl mx-auto relative flex items-center">
             <Search className="absolute left-4 h-5 w-5 text-slate-400" />
             <Input 
               className="h-14 pl-12 pr-32 rounded-full border-0 bg-white/10 text-white placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-500"
               placeholder="Search articles, guides, or activities..."
             />
             <Button className="absolute right-1 h-12 rounded-full bg-blue-600 hover:bg-blue-700 px-6 font-bold shadow-lg">
                Search
             </Button>
           </div>
        </div>
      </section>

      {/* Content Distribution */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border-0 hover:-translate-y-1 transition-transform cursor-pointer">
               <CardContent className="p-6 text-center">
                  <div className="mx-auto h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                     <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-slate-900">School Blogs</h3>
                  <p className="text-xs text-slate-500 mt-1">Classroom stories</p>
               </CardContent>
            </Card>
            <Card className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border-0 hover:-translate-y-1 transition-transform cursor-pointer">
               <CardContent className="p-6 text-center">
                  <div className="mx-auto h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                     <Lightbulb className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-slate-900">Parenting Guides</h3>
                  <p className="text-xs text-slate-500 mt-1">Expert advice</p>
               </CardContent>
            </Card>
            <Card className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border-0 hover:-translate-y-1 transition-transform cursor-pointer">
               <CardContent className="p-6 text-center">
                  <div className="mx-auto h-12 w-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                     <Newspaper className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-slate-900">Newsletters</h3>
                  <p className="text-xs text-slate-500 mt-1">Weekly digests</p>
               </CardContent>
            </Card>
            <Card className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border-0 hover:-translate-y-1 transition-transform cursor-pointer">
               <CardContent className="p-6 text-center">
                  <div className="mx-auto h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                     <Layout className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-slate-900">Magazines</h3>
                  <p className="text-xs text-slate-500 mt-1">Digital publications</p>
               </CardContent>
            </Card>
         </div>
      </section>

      {/* Main Feed */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
         <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-3/4 space-y-8">
               <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h2 className="text-2xl font-bold text-slate-900">Latest from Verified Schools</h2>
                  <Tabs defaultValue="all" className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-4 bg-slate-100 h-10">
                      <TabsTrigger value="all" className="text-xs font-bold">All</TabsTrigger>
                      <TabsTrigger value="articles" className="text-xs font-bold">Articles</TabsTrigger>
                      <TabsTrigger value="news" className="text-xs font-bold">News</TabsTrigger>
                      <TabsTrigger value="videos" className="text-xs font-bold">Media</TabsTrigger>
                    </TabsList>
                  </Tabs>
               </div>

               {/* Feed Items */}
               <div className="space-y-8">
                  {/* Item 1 */}
                  <article className="flex flex-col sm:flex-row gap-6 group">
                     <div className="sm:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shrink-0 relative">
                        <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80" alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-700">Parenting Article</div>
                     </div>
                     <div className="sm:w-2/3 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-3">
                           <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-md"><BookMarked className="h-3 w-3 mr-1" /> Little Stars Academy</span>
                           <span>•</span>
                           <span>Oct 12, 2025</span>
                           <span>•</span>
                           <span>4 min read</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">7 Gentle Ways to Manage Morning Drop-off Separation Anxiety</h3>
                        <p className="text-slate-600 mb-4 line-clamp-2">Teacher Sarah shares her proven classroom techniques for helping toddlers transition smoothly and happily into their school day without the tears.</p>
                        <Button variant="link" className="p-0 h-auto text-blue-600 font-bold self-start group-hover:translate-x-2 transition-transform">Read Full Article <ArrowRight className="ml-1 h-4 w-4" /></Button>
                     </div>
                  </article>

                  {/* Item 2 */}
                  <article className="flex flex-col sm:flex-row gap-6 group">
                     <div className="sm:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shrink-0 relative">
                        <img src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80" alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <PlayCircle className="h-12 w-12 text-white" />
                        </div>
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-purple-700">Video Guide</div>
                     </div>
                     <div className="sm:w-2/3 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-3">
                           <span className="flex items-center text-purple-600 bg-purple-50 px-2 py-1 rounded-md"><BookMarked className="h-3 w-3 mr-1" /> Sunshine Preschool</span>
                           <span>•</span>
                           <span>Oct 08, 2025</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">Sensory Play Setup: creating a messy zone at home</h3>
                        <p className="text-slate-600 mb-4 line-clamp-2">Watch our principal demonstrate how to set up an inexpensive, easy-to-clean sensory station using household items.</p>
                        <Button variant="link" className="p-0 h-auto text-purple-600 font-bold self-start group-hover:translate-x-2 transition-transform">Watch Video <ArrowRight className="ml-1 h-4 w-4" /></Button>
                     </div>
                  </article>
                  
                  {/* Item 3 */}
                  <article className="flex flex-col sm:flex-row gap-6 group">
                     <div className="sm:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden bg-amber-50 shrink-0 relative flex flex-col items-center justify-center p-6 text-center border-2 border-amber-100">
                        <Layout className="h-12 w-12 text-amber-500 mb-4" />
                        <h4 className="font-black text-amber-900 text-lg leading-tight mb-2">Spring Review 2025</h4>
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-amber-700">Digital Magazine</div>
                     </div>
                     <div className="sm:w-2/3 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-3">
                           <span className="flex items-center text-amber-600 bg-amber-50 px-2 py-1 rounded-md"><BookMarked className="h-3 w-3 mr-1" /> Heritage Early Learning</span>
                           <span>•</span>
                           <span>Sep 30, 2025</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">The Heritage Quarterly: Spring Edition</h3>
                        <p className="text-slate-600 mb-4 line-clamp-2">A beautiful digital flip-book showcasing the children's artwork, term highlights, and upcoming holiday schedules.</p>
                        <Button variant="link" className="p-0 h-auto text-amber-600 font-bold self-start group-hover:translate-x-2 transition-transform">Open Viewer <ArrowRight className="ml-1 h-4 w-4" /></Button>
                     </div>
                  </article>
               </div>
               
               <div className="pt-8 border-t border-slate-100 text-center">
                  <Button variant="outline" className="rounded-xl border-slate-200 px-8 py-6 text-slate-600 font-bold hover:bg-slate-50 hover:text-slate-900">
                     Load More Stories...
                  </Button>
               </div>
            </div>

            {/* Sidebar */}
            <div className="md:w-1/4 space-y-8">
               <Card className="bg-blue-50 border-none rounded-3xl overflow-hidden">
                  <CardHeader className="bg-blue-600 text-white p-6">
                     <CardTitle className="text-lg">Weekly Digest</CardTitle>
                     <CardDescription className="text-blue-100">Get the best parenting tips directly to your inbox.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                     <div className="space-y-4">
                        <Input placeholder="Your email address" className="bg-white border-0 py-5 rounded-xl shadow-sm" />
                        <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-5 font-bold shadow-lg">Subscribe Free</Button>
                     </div>
                  </CardContent>
               </Card>

               <div>
                  <h3 className="font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Popular Topics</h3>
                  <div className="flex flex-wrap gap-2">
                     {["Toddler Nutrition", "Potty Training", "Montessori at Home", "Speech Development", "Phonics", "Social Skills", "Outdoor Play"].map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer">{tag}</Badge>
                     ))}
                  </div>
               </div>

               <div>
                  <h3 className="font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Free Downloads</h3>
                  <div className="space-y-4">
                     {[
                        { title: "Printable Chore Chart for 4-5 Yrs", size: "1.2 MB PDF" },
                        { title: "Weekly Healthy Lunchbox Planner", size: "0.8 MB PDF" },
                        { title: "Alphabet Tracing Worksheets", size: "3.4 MB PDF" }
                     ].map((doc, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                           <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                              <Download className="h-5 w-5" />
                           </div>
                           <div className="min-w-0">
                              <p className="font-bold text-sm text-slate-900 truncate">{doc.title}</p>
                              <p className="text-[10px] text-slate-500">{doc.size}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}

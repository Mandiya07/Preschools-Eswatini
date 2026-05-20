import { useState } from "react";
import { 
  FileText, PenTool, Layout, Mail, Edit3, Image as ImageIcon, Send, ArrowRight, BookOpen, Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEO } from "@/components/SEO";

export function AdminContentMediaPage() {
  const [activeTab, setActiveTab] = useState("blogs");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <SEO title="Content Publishing | Sikolo Admin" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Content & Publishing Ecosystem</h1>
          <p className="text-sm text-slate-500 mt-1">Manage school blogs, newsletters, parenting articles, and educational resources.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
           <Edit3 className="mr-2 h-4 w-4" /> Create New Content
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="p-6">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
              <PenTool className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Preschool Blogs</h3>
            <p className="text-xs text-slate-600 mt-2">Publish school updates and classroom stories.</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
          <CardContent className="p-6">
            <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 text-emerald-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Parenting Articles</h3>
            <p className="text-xs text-slate-600 mt-2">Share expert advice and child development tips.</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
          <CardContent className="p-6">
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Newsletters</h3>
            <p className="text-xs text-slate-600 mt-2">Send weekly or monthly email digests to parents.</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
          <CardContent className="p-6">
            <div className="h-10 w-10 bg-amber-100 rounded-lg flex items-center justify-center mb-4 text-amber-600">
              <Layout className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Magazine Layouts</h3>
            <p className="text-xs text-slate-600 mt-2">Design rich, visually appealing digital magazines.</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="blogs" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] h-12 bg-slate-100 rounded-xl p-1">
          <TabsTrigger value="blogs" className="rounded-lg font-bold">Articles & Blogs</TabsTrigger>
          <TabsTrigger value="newsletters" className="rounded-lg font-bold">Newsletters</TabsTrigger>
          <TabsTrigger value="resources" className="rounded-lg font-bold">Learning Hub</TabsTrigger>
          <TabsTrigger value="layouts" className="rounded-lg font-bold">Layout Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="blogs" className="space-y-6">
           <Card className="border-slate-200">
             <CardHeader className="border-b border-slate-100 pb-4">
               <CardTitle>Published Content</CardTitle>
               <CardDescription>Manage your blog posts, announcements, and parenting guides.</CardDescription>
             </CardHeader>
             <div className="divide-y divide-slate-100">
                {[
                  { title: "5 Fun Indoor Activities for Rainy Days", type: "Parenting Guide", date: "Oct 12, 2025", author: "Sarah Jenkins", status: "Published" },
                  { title: "Recap: Annual Spring Science Fair", type: "School Blog", date: "Oct 10, 2025", author: "Admin", status: "Published" },
                  { title: "Understanding Emotional Milestones in Toddlers", type: "Parenting Guide", date: "Oct 05, 2025", author: "Dr. Sibiya", status: "Draft" },
                ].map((post, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                     <div className="flex items-start gap-4">
                        <div className="h-12 w-16 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                           <ImageIcon className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-900">{post.title}</h4>
                           <p className="text-xs text-slate-500 mt-1">{post.author} • {post.date}</p>
                           <Badge variant="outline" className="mt-2 text-[10px]">{post.type}</Badge>
                        </div>
                     </div>
                     <div className="mt-4 sm:mt-0 flex items-center gap-3">
                        <Badge className={post.status === 'Published' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-slate-100 text-slate-700 hover:bg-slate-100'}>
                           {post.status}
                        </Badge>
                        <Button variant="ghost" size="sm">Edit</Button>
                     </div>
                  </div>
                ))}
             </div>
           </Card>
        </TabsContent>

        <TabsContent value="newsletters" className="space-y-6">
           <Card className="border-slate-200 p-8 text-center bg-slate-50 border-dashed rounded-3xl">
              <Mail className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">School Newsletters</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">Create beautiful email campaigns to keep parents engaged. Pull content directly from your blogs and events calender.</p>
              <Button>Create Newsletter</Button>
           </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-6">
           <Card className="border-slate-200">
             <CardHeader className="border-b border-slate-100 pb-4">
               <CardTitle>Educational Resource Hub</CardTitle>
               <CardDescription>Teachers can upload worksheets, curriculum guides, and media for parents.</CardDescription>
             </CardHeader>
             <div className="p-6">
               <div className="grid sm:grid-cols-3 gap-4">
                  {[
                     { title: "Grade R Phonics Pack", sub: "15 PDFs • Teacher Nomsa" },
                     { title: "Sensory Play Guide", sub: "Video Series • Admin" },
                     { title: "Term 3 Curriculum Overview", sub: "Syllabus • Principal" },
                  ].map((res, i) => (
                     <div key={i} className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-colors cursor-pointer group">
                        <Layers className="h-8 w-8 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                        <h4 className="font-bold text-slate-900 text-sm">{res.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{res.sub}</p>
                     </div>
                  ))}
               </div>
             </div>
           </Card>
        </TabsContent>

        <TabsContent value="layouts" className="space-y-6">
           <Card className="border-slate-200 shadow-sm overflow-hidden bg-slate-900 text-white relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center"></div>
              <div className="relative z-10 p-10 flex flex-col items-start max-w-xl">
                 <Badge className="bg-white/20 text-white mb-4">Magazine Builder</Badge>
                 <h3 className="text-2xl font-bold mb-3">Distribute Premium Digital Publications</h3>
                 <p className="text-slate-300 text-sm mb-6">Combine your blogs, photos, and news into a flip-book style digital magazine for term-end reviews and yearbooks.</p>
                 <Button className="bg-white text-slate-900 hover:bg-slate-100">Launch Layout Editor <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
           </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}

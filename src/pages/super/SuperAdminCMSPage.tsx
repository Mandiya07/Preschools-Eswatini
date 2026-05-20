import { useState } from "react";
import { 
  FileText, 
  Settings, 
  Layout, 
  Image as ImageIcon, 
  Save, 
  Eye, 
  Plus, 
  Edit3, 
  Trash2,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SuperAdminCMSPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Platform CMS</h1>
          <p className="text-slate-500 italic text-sm">Manage global landing pages, blogs, and platform-wide resources.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border-slate-200">
              <Eye className="h-4 w-4 mr-2" /> Live Preview
           </Button>
           <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-100">
              <Plus className="h-4 w-4 mr-2" /> New Page
           </Button>
        </div>
      </div>

      <Tabs defaultValue="pages" className="space-y-8">
        <TabsList className="bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full sm:w-auto h-auto grid grid-cols-3 sm:flex">
          <TabsTrigger value="pages" className="rounded-xl font-bold text-xs px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">
             Web Pages
          </TabsTrigger>
          <TabsTrigger value="articles" className="rounded-xl font-bold text-xs px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">
             Articles
          </TabsTrigger>
          <TabsTrigger value="assets" className="rounded-xl font-bold text-xs px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">
             Media Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-6 m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Home Page', url: '/', status: 'Published', lastEdit: '2 days ago', author: 'Sipho Mati' },
              { title: 'About the Platform', url: '/about', status: 'Published', lastEdit: '1 week ago', author: 'Sipho Mati' },
              { title: 'Privacy Policy', url: '/privacy', status: 'Draft', lastEdit: 'Yesterday', author: 'System' },
              { title: 'Terms of Service', url: '/terms', status: 'Published', lastEdit: '3 months ago', author: 'System' },
              { title: 'Pricing & Plans', url: '/pricing', status: 'Published', lastEdit: '10 days ago', author: 'Sipho Mati' },
            ].map((page, i) => (
              <Card key={i} className="border-none shadow-sm group hover:shadow-md transition-all">
                 <CardHeader className="p-5 border-b border-slate-50">
                    <div className="flex items-center justify-between mb-3">
                       <Layout className="h-5 w-5 text-blue-600" />
                       <Badge className={`${
                         page.status === 'Published' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                       } border-none text-[10px] font-black uppercase`}>
                          {page.status}
                       </Badge>
                    </div>
                    <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                       {page.title}
                    </CardTitle>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{page.url}</p>
                 </CardHeader>
                 <CardContent className="p-5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest Ital">
                       <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {page.lastEdit}</span>
                       <span>By {page.author}</span>
                    </div>
                 </CardContent>
                 <CardFooter className="p-3 bg-slate-50/50 flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                       <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                       <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                 </CardFooter>
              </Card>
            ))}
            <button className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 text-slate-400 hover:border-blue-300 hover:text-blue-600 transition-all bg-white/50 hover:bg-blue-50/20 group">
               <div className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Plus className="h-5 w-5" />
               </div>
               <span className="text-xs font-black uppercase tracking-widest">Create Blank Page</span>
            </button>
          </div>
        </TabsContent>

        <TabsContent value="articles" className="m-0">
           <Card className="border-none shadow-sm">
              <CardContent className="py-20 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                 <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 mb-6">
                    <FileText className="h-10 w-10" />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 leading-tight uppercase tracking-tight">No Articles Published</h3>
                 <p className="text-sm text-slate-500 mt-2 italic">Start sharing platform news, early childhood education tips, and school success stories.</p>
                 <Button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-8 font-black uppercase tracking-widest shadow-lg shadow-blue-100">
                    Write First Post
                 </Button>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="assets" className="m-0">
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-slate-100 rounded-2xl relative overflow-hidden group cursor-pointer border-2 border-transparent hover:border-blue-600 transition-all">
                   <img 
                     src={`https://images.unsplash.com/photo-${1500000000000 + (i * 1000000)}?auto=format&fit=crop&q=80&w=400`} 
                     className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                     alt="" 
                   />
                   <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-white font-bold">hero_bg_{i}.jpg</span>
                      <ArrowUpRight className="h-3 w-3 text-white" />
                   </div>
                </div>
              ))}
              <div className="aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer transition-colors">
                 <Settings className="h-6 w-6 mb-2 animate-spin-slow" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Uploader</span>
              </div>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

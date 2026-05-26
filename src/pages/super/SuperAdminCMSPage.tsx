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
  ArrowUpRight,
  Search,
  BookOpen,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface AdminArticle {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  author: string;
  date: string;
  readTime: string;
  summary: string;
  image: string;
  status: "Published" | "Draft";
}

const INITIAL_ARTICLES: AdminArticle[] = [
  {
    slug: "eswatini-preschool-landscapes",
    title: "Eswatini Preschool Landscapes: Fact Sheet Summary",
    category: "parents",
    categoryLabel: "Parents Circle",
    author: "National Mapping Project Secretariat",
    date: "May 25, 2026",
    readTime: "4 min read",
    summary: "To help you make sense of this exhaustive national mapping project, here is a macro-comparison of how early childhood education is divided across the Kingdom of Eswatini.",
    image: "https://images.unsplash.com/photo-1576489922094-27a5bfac0148?auto=format&fit=crop&w=800&q=80",
    status: "Published"
  },
  {
    slug: "how-preschools-register",
    title: "Step-by-Step Guide: How to Register Your Preschool on our Platform",
    category: "schools",
    categoryLabel: "Preschool Admins",
    author: "Platform Admissions Council",
    date: "May 20, 2026",
    readTime: "5 min read",
    summary: "Learn how Eswatini preschool administrators can activate their digital profiles, configure custom school websites under their own name, list facilities, and accept verified online parent applications.",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80",
    status: "Published"
  },
  {
    slug: "how-suppliers-register",
    title: "Connecting with Schools: The Complete Supplier Onboarding Guide",
    category: "suppliers",
    categoryLabel: "Suppliers Hub",
    author: "Procurement Operations Team",
    date: "May 18, 2026",
    readTime: "4 min read",
    summary: "An in-depth guide for stationery, playground safety, uniform, and nutrition suppliers seeking to join the Preschools Eswatini digital ecosystem.",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80",
    status: "Published"
  }
];

export function SuperAdminCMSPage() {
  const [articles, setArticles] = useState<AdminArticle[]>(INITIAL_ARTICLES);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingArticle, setEditingArticle] = useState<AdminArticle | null>(null);
  
  // Form State
  const [editTitle, setEditTitle] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editReadTime, setEditReadTime] = useState("");
  const [editStatus, setEditStatus] = useState<"Published" | "Draft">("Published");

  const [activeTab, setActiveTab] = useState("pages");

  const filteredArticles = articles.filter(art => 
    art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    art.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartEdit = (article: AdminArticle) => {
    setEditingArticle(article);
    setEditTitle(article.title);
    setEditSummary(article.summary);
    setEditCategory(article.category);
    setEditReadTime(article.readTime);
    setEditStatus(article.status);
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) {
      toast.error("Article Title cannot be empty!");
      return;
    }
    if (!editSummary.trim()) {
      toast.error("Article Summary cannot be empty!");
      return;
    }

    setArticles(prev => prev.map(art => {
      if (art.slug === editingArticle?.slug) {
        return {
          ...art,
          title: editTitle,
          summary: editSummary,
          category: editCategory,
          categoryLabel: editCategory === "parents" ? "Parents Circle" : editCategory === "schools" ? "Preschool Admins" : "Suppliers Hub",
          readTime: editReadTime,
          status: editStatus
        };
      }
      return art;
    }));

    toast.success(`Guide article "${editTitle}" updated successfully! This immediately reflects globally across all public Guides pages.`);
    setEditingArticle(null);
  };

  const handleDeleteArticle = (slug: string, title: string) => {
    if (confirm(`Are you sure you want to permanently remove "${title}" from the public knowledge base?`)) {
      setArticles(prev => prev.filter(a => a.slug !== slug));
      toast.success(`Removed guide: "${title}"`);
    }
  };

  const handleCreateNew = () => {
    const newArt: AdminArticle = {
      slug: `custom-guide-${Date.now()}`,
      title: "New Eswatini Educational Standard Initiative",
      category: "schools",
      categoryLabel: "Preschool Admins",
      author: "Super Admin Advisory Panel",
      date: "Today",
      readTime: "3 min read",
      summary: "Drafting recommendations for modern kindergarten curriculum development guidelines.",
      image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=400&q=80",
      status: "Draft"
    };

    setArticles(prev => [newArt, ...prev]);
    handleStartEdit(newArt);
    toast.info("Created a new draft article! Edit your specifications below.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Platform CMS &amp; Knowledge Base</h1>
          <p className="text-slate-500 italic text-sm">Manage global landing pages, editorial blogs, and guides published on the platform.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border-slate-200" asChild>
             <Link to="/blog">
               <Eye className="h-4 w-4 mr-2" /> View Guides Hub
             </Link>
           </Button>
           <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm">
              <Plus className="h-4 w-4 mr-2" /> Create Guide Article
           </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full sm:w-auto h-auto grid grid-cols-3 sm:flex">
          <TabsTrigger value="pages" className="rounded-xl font-bold text-xs px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">
             Web Pages
          </TabsTrigger>
          <TabsTrigger value="articles" className="rounded-xl font-bold text-xs px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">
             Guides &amp; Articles <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100 border-none px-1.5 py-0.5 text-[9px] font-bold">{articles.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="assets" className="rounded-xl font-bold text-xs px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">
             Media Library
          </TabsTrigger>
        </TabsList>

        {/* WEB PAGES TAB */}
        <TabsContent value="pages" className="space-y-6 m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Home Page', url: '/', status: 'Published', lastEdit: '2 days ago', author: 'Sipho Mati' },
              { title: 'About the Platform', url: '/about', status: 'Published', lastEdit: '1 week ago', author: 'Sipho Mati' },
              { title: 'Privacy Policy', url: '/privacy', status: 'Draft', lastEdit: 'Yesterday', author: 'System' },
              { title: 'Terms of Service', url: '/terms', status: 'Published', lastEdit: '3 months ago', author: 'System' },
              { title: 'Pricing & Plans', url: '/pricing', status: 'Published', lastEdit: '15 mins ago', author: 'Sipho Mati' },
              { title: 'Guides & Articles', url: '/blog', status: 'Published', lastEdit: 'Just now', author: 'Sipho Mati' },
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
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600" onClick={() => { setActiveTab("articles"); toast.info(`Web page "${page.title}" links to direct schema edits. Loading articles...`); }}>
                        <Edit3 className="h-3.5 w-3.5" />
                     </Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => toast.warning("System pages cannot be deleted.")}>
                        <Trash2 className="h-3.5 w-3.5" />
                     </Button>
                  </CardFooter>
              </Card>
            ))}
            <button onClick={handleCreateNew} className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 text-slate-400 hover:border-blue-300 hover:text-blue-600 transition-all bg-white/50 hover:bg-blue-50/20 group">
               <div className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Plus className="h-5 w-5" />
               </div>
               <span className="text-xs font-black uppercase tracking-widest">Create Blank Page</span>
            </button>
          </div>
        </TabsContent>

        {/* ARTICLES & GUIDES TAB */}
        <TabsContent value="articles" className="m-0 space-y-6">
          {editingArticle ? (
            /* ACTIVE EDITING INTERFACE */
            <Card className="border border-indigo-100 shadow-sm overflow-hidden">
              <CardHeader className="bg-indigo-50/30 p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-indigo-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-indigo-800 text-xs font-black uppercase tracking-widest">
                    <Sparkles className="h-3.5 w-3.5" /> Guides Editor Workbench
                  </div>
                  <CardTitle className="text-lg font-black text-slate-900">
                    Editing: {editingArticle.title}
                  </CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setEditingArticle(null)}
                  className="text-slate-500 hover:text-slate-800 self-end sm:self-auto rounded-xl"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Dismiss Editor
                </Button>
              </CardHeader>

              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Guide Article Title</label>
                    <Input 
                      value={editTitle} 
                      onChange={(e) => setEditTitle(e.target.value)} 
                      className="rounded-xl border-slate-200 text-slate-900 font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Category Segment</label>
                      <select 
                        value={editCategory}
                        onChange={(e) => setEditCategory((e.target as HTMLSelectElement).value)}
                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="parents">Parents Circle</option>
                        <option value="schools">Preschool Admins</option>
                        <option value="suppliers">Suppliers Hub</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Read Time Indicator</label>
                      <Input 
                        value={editReadTime} 
                        onChange={(e) => setEditReadTime(e.target.value)} 
                        placeholder="e.g. 5 min read"
                        className="rounded-xl border-slate-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Article Abstract / Summary Text</label>
                  <textarea 
                    value={editSummary}
                    onChange={(e) => setEditSummary((e.target as HTMLTextAreaElement).value)}
                    rows={3}
                    className="w-full p-4 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                    placeholder="Short, highly scannable introductory paragraph..."
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Publishing Status</span>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => setEditStatus("Published")}
                        className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase transition-all ${
                          editStatus === "Published" 
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300" 
                            : "bg-slate-50 text-slate-400 border border-slate-200"
                        }`}
                      >
                        Published
                      </button>
                      <button 
                        type="button"
                        onClick={() => setEditStatus("Draft")}
                        className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase transition-all ${
                          editStatus === "Draft" 
                            ? "bg-amber-100 text-amber-800 border border-amber-300" 
                            : "bg-slate-50 text-slate-400 border border-slate-200"
                        }`}
                      >
                        Draft
                      </button>
                    </div>
                  </div>

                  <div className="text-xs italic text-slate-400 ml-auto pt-6">
                    *Drafting or modifying items here updates national indices. Real data persistence is simulated via state hooks.
                  </div>
                </div>
              </CardContent>

              <CardFooter className="bg-slate-50 p-6 flex justify-end gap-3 border-t border-slate-100">
                <Button 
                  variant="outline" 
                  onClick={() => setEditingArticle(null)}
                  className="rounded-xl font-bold border-slate-200 text-slate-700"
                >
                  Discard Changes
                </Button>
                <Button 
                  onClick={handleSaveEdit}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md font-bold px-6 flex items-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save Content Changes
                </Button>
              </CardFooter>
            </Card>
          ) : (
            /* DEFAULT LIST VIEW OF ARTICLES FOR EDITING */
            <div className="space-y-6">
              {/* Search & Statistics Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-450 text-slate-400" />
                  <Input 
                    placeholder="Search Guides articles..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-xl border-slate-250 w-full"
                  />
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-550 shrink-0 text-slate-500">
                  <span>Showing {filteredArticles.length} of {articles.length} Active Guides</span>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl" onClick={handleCreateNew}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Article
                  </Button>
                </div>
              </div>

              {/* Guides Lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((article) => {
                  return (
                    <Card key={article.slug} className="border border-slate-250 hover:border-slate-300 shadow-sm transition-all flex flex-col justify-between">
                      <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                            {article.categoryLabel}
                          </span>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-xl ${
                            article.status === "Published" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {article.status}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-left">
                          <h3 className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                            {article.title}
                          </h3>
                          <p className="text-slate-500 text-xs font-semibold line-clamp-2">
                            {article.summary}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {article.readTime}</span>
                          <span>{article.date}</span>
                        </div>
                      </div>

                      <div className="px-5 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500">By {article.author}</span>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleStartEdit(article)}
                            className="h-8 rounded-xl font-bold border-slate-200 text-slate-700 text-xs px-3 hover:bg-white hover:text-blue-600"
                          >
                            <Edit3 className="h-3 w-3 mr-1" /> Edit Guide
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteArticle(article.slug, article.title)}
                            className="h-8 w-8 text-slate-400 hover:text-red-500 rounded-xl"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>

        {/* MEDIA LIBRARY TAB */}
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

import { useState, FormEvent, ChangeEvent } from "react";
import { SEO } from "@/components/SEO";
import { 
  Share2, 
  Sparkles, 
  Calendar, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Send, 
  Globe, 
  ThumbsUp, 
  Clock, 
  Settings, 
  PenTool, 
  MessageSquare, 
  Loader2, 
  CheckCircle,
  Eye,
  Megaphone,
  AlertCircle,
  BarChart2,
  ExternalLink,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Heart,
  MessageCircle,
  Bookmark,
  Repeat
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "motion/react";
import { AnalyticsCard } from "@/components/AnalyticsCard";

const socialAnalyticsData: any[] = [];

interface SocialPost {
  id: string;
  content: string;
  platforms: ("facebook" | "instagram" | "linkedin" | "twitter")[];
  status: "Published" | "Scheduled" | "Draft";
  publishDate: string;
  scheduledTime?: string;
  image?: string;
  analytics?: {
    impressions: number;
    engagementRate: string;
    clicks: number;
  };
}

const INITIAL_POSTS: SocialPost[] = [];

const TEMPLATES = [
  {
    id: "schools-onboarding",
    label: "Onboard Preschools",
    heading: "Preschool Enrollment Campaign",
    prompt: "Write an exciting, professional social media post inviting preschool directors in Eswatini to register their school. Highlight benefits: instant free website builder, official safety checkmarks, and automated parent inquiry dashboards.",
    tags: "#EswatiniEducation #PreschoolsEswatini #SwatiAdmins"
  },
  {
    id: "suppliers-onboarding",
    label: "Attract Suppliers",
    heading: "Supplier Integration Drive",
    prompt: "Create a conversion-focused post for LinkedIn targeting wholesale stationary, uniform, play equipment, and fresh food suppliers in Eswatini. Emphasize automatic orders, safe payment ledgers, and zero need for traveling sales agents.",
    tags: "#EswatiniBusiness #SwatiSuppliers #Procurement"
  },
  {
    id: "parents-benefit",
    label: "Parent Benefits",
    heading: "Parent Portal Campaign",
    prompt: "Draft a warm, helpful post for parents about finding and applying to the best preschools in Eswatini online. Spotlight ease of submitting files once, checking verification levels, and receiving real-time wellness status updates.",
    tags: "#SwatiParents #EswatiniNursery #ChildSafety"
  },
  {
    id: "teachers-toolkit",
    label: "Teacher Features",
    heading: "Teacher AI Toolkit Support",
    prompt: "Compose a friendly, supportive update for teachers showcasing the free AI Lesson Planner (SiSwati theme-friendly) and unified parent-teacher secure chats that eliminate mid-night spam.",
    tags: "#EducatorsGuild #EswatiniTeachers #SmartClassrooms"
  }
];

const PRESET_IMAGES = [
  { url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80", label: "School Classroom" },
  { url: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80", label: "Office Supplies" },
  { url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80", label: "Happy Children Play" },
  { url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80", label: "Outdoor Safety Playground" }
];

export function SuperAdminSocialPage() {
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);
  const [content, setContent] = useState<string>("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<("facebook" | "instagram" | "linkedin" | "twitter")[]>([
    "facebook",
    "instagram"
  ]);
  const [image, setImage] = useState<string>(PRESET_IMAGES[0].url);
  const [customImage, setCustomImage] = useState<string>("");
  const [postStatus, setPostStatus] = useState<"Published" | "Scheduled" | "Draft">("Published");
  const [scheduleTime, setScheduleTime] = useState<string>("");
  
  // AI assistant states
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [aiTone, setAiTone] = useState<string>("excited");
  const [aiTemplate, setAiTemplate] = useState<string>("schools-onboarding");
  const [aiCustomContext, setAiCustomContext] = useState<string>("");
  const [apiError, setApiError] = useState<string>("");
  const [successToast, setSuccessToast] = useState<string>("");

  // Live Preview layout tab state
  const [previewTab, setPreviewTab] = useState<string>("facebook");

  // Toggle platform selection
  const togglePlatform = (platform: "facebook" | "instagram" | "linkedin" | "twitter") => {
    if (selectedPlatforms.includes(platform)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  // Run AI generation with Gemini through server proxy
  const generatePostWithAI = async () => {
    setIsLoadingAi(true);
    setApiError("");
    setSuccessToast("");

    const templateObj = TEMPLATES.find(t => t.id === aiTemplate);
    const mainPromptMessage = templateObj ? templateObj.prompt : "Write a social media page announcement regarding Preschools Eswatini updates.";
    const hashtags = templateObj ? templateObj.tags : "#EswatiniEducation";

    const finalPrompt = `
      Theme Goal: ${mainPromptMessage}
      Tone Requested: ${aiTone === "excited" ? "Urgent, exciting, growth-oriented with lots of emojis." : aiTone === "warm" ? "Gentle, community-focused, welcoming, family-like and warm." : "Highly professional, bullet-pointed, clear ROI aspects."}
      Specific user rules or details to incorporate: ${aiCustomContext || "None custom provided. Keep it focused on Eswatini communities."}
      Hashtags to append at the end of the text: ${hashtags}
      
      Requirements: Write high-converting social media copy. Include emojis of children, gears, backpacks, or Eswatini elements (like flags/landscapes in words). Output ONLY the final generated post copy without quotation marks.
    `;

    try {
      const resp = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          type: "caption"
        })
      });

      const responseData = await resp.json();

      if (resp.ok && responseData.text) {
        setContent(responseData.text.trim());
        setSuccessToast("Gemini draft generated successfully!");
        setTimeout(() => setSuccessToast(""), 4000);
      } else {
        throw new Error(responseData.error || "Failed to parse API result");
      }
    } catch (err: any) {
      console.warn("Using localized simulation fallback for Gemini:", err);
      // Fallback fallback generator so UX is beautiful even without key
      let mockedText = "";
      if (aiTemplate === "schools-onboarding") {
        mockedText = `🏫 Attention Preschool Leaders in the Kingdom of Eswatini! 🇸🇿\n\nTake your early educational services digital! Unlock your premium verified status symbol, build an elegant interactive school showcase website with absolutely zero code, and enable direct parental online registrations. 🚀📈\n\nLet parents find you with smart geography locator rules. Register today! \n\n${hashtags}`;
      } else if (aiTemplate === "suppliers-onboarding") {
        mockedText = `🚛 Wholesale Stationery, Uniforms & Play Suppliers! 🇸🇿✨\n\nStop dispatching physical agents to high-volume remote centers. Connect directly with preschool purchasing administrators right from your custom dashboard on Preschools Eswatini. Track secure purchase orders instantaneously! 📚🥪\n\nOnboard now at /supplier-register to expand your business reach today.\n\n${hashtags}`;
      } else if (aiTemplate === "parents-benefit") {
        mockedText = `👶 Parents Circle: Early Education Just Got Smarter & Stress-Free! ❤️\n\nNo more driving between nursery campuses filling out dozens of physical files. Locate Ministry-compliant certified preschool options on our map, configure and send online applications with a single tap, and stay coordinated through secure updates. 📝🎒\n\n${hashtags}`;
      } else {
        mockedText = `👩‍🏫 Smart Classrooms are Here! Introducing Preschools Eswatini's interactive Teacher Toolkits! 🇸🇿✍️\n\nGet instant access to a powerful AI Theme Lesson Planner (supporting SiSwati core goals) and enjoy spam-free professional parent chats with neat system logs. Save hours on typing so you can focus on beautiful child development. 👇\n\n${hashtags}`;
      }

      setContent(mockedText);
      setSuccessToast("Draft simulated (Gemini offline fallback applied)");
      setTimeout(() => setSuccessToast(""), 4000);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Submit/Publish post handler
  const handlePublishPost = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      content: content,
      platforms: selectedPlatforms,
      status: postStatus,
      publishDate: postStatus === "Published" 
        ? new Date().toLocaleString() 
        : scheduleTime 
          ? new Date(scheduleTime).toLocaleString() 
          : new Date(Date.now() + 86400000).toLocaleString(),
      scheduledTime: postStatus === "Scheduled" ? scheduleTime : undefined,
      image: customImage || image || undefined,
      analytics: postStatus === "Published" ? {
        impressions: 45,
        engagementRate: "12%",
        clicks: 3
      } : undefined
    };

    setPosts([newPost, ...posts]);
    setContent("");
    setCustomImage("");
    setSuccessToast(postStatus === "Published" ? "🎉 Post broadcasted on your social accounts!" : "🕒 Post scheduled securely!");
    setTimeout(() => setSuccessToast(""), 4000);
  };

  // Delete post handler
  const handleDeletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
    setSuccessToast("Post deleted from database logs.");
    setTimeout(() => setSuccessToast(""), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans" id="social-media-hub-root">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            <Share2 className="h-6 w-6 text-blue-600" /> Super Admin Social Hub
          </h1>
          <p className="text-slate-500 italic text-sm">
            Orchestrate social media outreach campaigns and publish directly to Facebook, Instagram, LinkedIn, and Twitter/X platforms.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Badge className="bg-emerald-100 text-emerald-800 border-none font-bold text-[10px] uppercase. py-1 px-3">
             Mock API Live
          </Badge>
          <Button variant="outline" className="rounded-xl border-slate-200">
             <Settings className="h-4 w-4 mr-1.5" /> API Keys
          </Button>
        </div>
      </div>

      {/* Grid Layout: Composer & Smart Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Composer Form Column (7 Cols) */}
        <section className="lg:col-span-7 space-y-8">
          
          {/* Smart AI Post Assistant card */}
          <Card className="border-none shadow-sm overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <CardHeader className="pb-4 relative">
              <div className="absolute right-6 top-6 h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
              </div>
              <p className="text-blue-400 text-[10px] font-black tracking-widest uppercase">Copilot Assistant</p>
              <CardTitle className="text-lg font-extrabold text-white">Gemini Smart AI Post Developer & Writer</CardTitle>
              <CardDescription className="text-slate-300 text-xs">
                Select your platform marketing campaign purpose to outline rich engaging social updates automatically.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              
              {/* Template Buttons Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Select Platform Focus Theme:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {TEMPLATES.map(tmpl => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setAiTemplate(tmpl.id)}
                      className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between h-20 ${
                        aiTemplate === tmpl.id 
                          ? "bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-500/20" 
                          : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                      id={`ai-temp-btn-${tmpl.id}`}
                    >
                      <span className="text-[10px] uppercase font-black tracking-wider block opacity-75">Theme</span>
                      <span className="text-xs font-bold leading-tight block">{tmpl.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Tone selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Post Energy & Tone:</label>
                  <select
                    value={aiTone}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setAiTone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    id="ai-tone-select"
                  >
                    <option value="excited">🎉 Excited & Growth-Oriented (Emojis, viral)</option>
                    <option value="warm">❤️ Warm & Child-Centric (Empathetic, parent focus)</option>
                    <option value="professional">👔 Professional & Formal (Corporate ROI, high facts)</option>
                  </select>
                </div>

                {/* Optional Custom Context notes */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Custom context or specific text details (Optional):</label>
                  <Input
                    placeholder="E.g. Mention free signup before Friday, or Dr. Nxumalo's review..."
                    className="h-10 text-xs border-slate-700 bg-slate-800 placeholder:text-slate-500 rounded-xl text-white focus-visible:ring-1 focus-visible:ring-blue-500"
                    value={aiCustomContext}
                    onChange={(e) => setAiCustomContext(e.target.value)}
                    id="ai-custom-context-input"
                  />
                </div>
              </div>

            </CardContent>
            <CardFooter className="bg-slate-950/40 p-4 border-t border-slate-700/50 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">Uses Gemini 3 Flash Server Engine</span>
              <Button 
                onClick={generatePostWithAI} 
                disabled={isLoadingAi}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-10 px-5 text-xs font-extrabold shadow-lg shadow-blue-500/10"
                id="ai-generate-post-btn"
              >
                {isLoadingAi ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Cooking Copy...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" /> Write Draft Copy
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Social Post Manual Composer card */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <PenTool className="h-5 w-5 text-blue-600" />
                <div>
                  <CardTitle className="text-base font-extrabold text-slate-900">Configure Update details</CardTitle>
                  <CardDescription>Assemble targeted media, specify distribution platforms, and schedule publishing parameters.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <form onSubmit={handlePublishPost} className="space-y-6" id="social-manual-composer-form">
                
                {/* Text Content */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Written Message Content:</label>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{content.length} characters</span>
                  </div>
                  <textarea
                    rows={5}
                    placeholder="Draft your thoughts here, include emojis, registration links, or let Gemini build it for you above..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[140px]"
                    value={content}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                    required
                    id="social-post-content-textarea"
                  />
                </div>

                {/* Platform select switches */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Broadcast Target Platforms:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: "facebook", label: "Facebook Page", color: "blue", icon: Facebook, subtitle: "@PreschoolsSZ" },
                      { id: "instagram", label: "Instagram Pro", color: "pink", icon: Instagram, subtitle: "@preschools_sz" },
                      { id: "linkedin", label: "LinkedIn Company", color: "blue", icon: Linkedin, subtitle: "Company Page" },
                      { id: "twitter", label: "Twitter/X Handle", color: "slate", icon: Twitter, subtitle: "@PreschoolsSZ" }
                    ].map(platform => {
                      const isSelected = selectedPlatforms.includes(platform.id as any);
                      return (
                        <button
                          key={platform.id}
                          type="button"
                          onClick={() => togglePlatform(platform.id as any)}
                          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all relative overflow-hidden group ${
                            isSelected 
                              ? "bg-white border-blue-600 ring-2 ring-blue-500/20" 
                              : "bg-slate-50/50 border-slate-200 hover:bg-slate-100"
                          }`}
                          id={`platform-switch-${platform.id}`}
                        >
                          <div className="flex items-center justify-between">
                            <platform.icon className={`h-5 w-5 ${isSelected ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                              isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300"
                            }`}>
                              {isSelected && <CheckCircle className="h-3 w-3" />}
                            </div>
                          </div>
                          <div className="mt-3">
                            <span className="text-xs font-extrabold text-slate-800 block">{platform.label}</span>
                            <span className="text-[9px] font-medium text-slate-400 block break-all">{platform.subtitle}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Image Attachments */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Attach Campaign Graphic:</label>
                  
                  {/* Preset Previews */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PRESET_IMAGES.map((img, idx) => (
                      <div 
                        key={idx}
                        onClick={() => { setImage(img.url); setCustomImage(""); }}
                        className={`aspect-video rounded-xl relative overflow-hidden cursor-pointer border-2 transition-all ${
                          image === img.url && !customImage
                            ? "border-blue-600 scale-95 shadow-sm" 
                            : "border-transparent opacity-75 hover:opacity-100"
                        }`}
                        id={`img-selector-${idx}`}
                      >
                        <img src={img.url} className="w-full h-full object-cover" alt={img.label} />
                        <div className="absolute inset-x-0 bottom-0 bg-black/50 p-1.5 text-center">
                          <span className="text-[9px] font-bold text-white block truncate">{img.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Manual Input string of URL */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-semibold block">Or paste custom image URL:</span>
                    <Input
                      placeholder="https://images.unsplash.com/photo-..."
                      className="rounded-xl h-9 text-xs border-slate-200/80 pb-1"
                      value={customImage}
                      onChange={(e) => {
                        setCustomImage(e.target.value);
                      }}
                      id="custom-image-url-input"
                    />
                  </div>
                </div>

                {/* Scheduling Parameters */}
                <div className="bg-slate-50 p-4 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Publishing Delivery Setup:</label>
                    <div className="flex gap-2">
                      {[
                        { id: "Published", label: "Publish Now" },
                        { id: "Scheduled", label: "Schedule Delivery" },
                        { id: "Draft", label: "Save draft" }
                      ].map(st => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setPostStatus(st.id as any)}
                          className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full transition-all ${
                            postStatus === st.id 
                              ? "bg-slate-900 text-white" 
                              : "bg-slate-200/60 text-slate-500 hover:bg-slate-200"
                          }`}
                          id={`post-status-btn-${st.id}`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {postStatus === "Scheduled" && (
                    <div className="grid sm:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold block">Choose Release Date & Time (Mbabane timezone):</span>
                        <Input
                          type="datetime-local"
                          className="h-10 text-xs rounded-xl"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          required={postStatus === "Scheduled"}
                          id="scheduler-datetime-input"
                        />
                      </div>
                      <div className="text-[11px] text-slate-400 italic flex items-center bg-white p-3.5 rounded-xl border border-dotted border-slate-200/80 leading-relaxed">
                        Notice: Posts are dispatched digitally through connected platform API cron queues automatically within 5 minutes of selected time.
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs h-11 px-8 rounded-xl shadow-lg shadow-blue-100"
                    disabled={!content.trim()}
                    id="submit-campaign-post-btn"
                  >
                    <Send className="h-4 w-4 mr-2" /> 
                    {postStatus === "Published" ? "Launch Social Broadcast" : postStatus === "Scheduled" ? "Confirm Scheduled Distribution" : "Save as Hub Draft"}
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>

        </section>

        {/* Live Mock Previews (5 Cols) */}
        <section className="lg:col-span-5 space-y-6">
          <Card className="border-none shadow-sm h-full flex flex-col">
            <CardHeader className="pb-4 border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-blue-600" /> Live Canvas Previews
                  </CardTitle>
                  <CardDescription>Simulated view across active channel accounts.</CardDescription>
                </div>
                <Badge variant="outline" className="text-[9px] font-mono bg-blue-50/50 text-blue-600 border-none font-extrabold uppercase py-1">
                  1:1 Adaptive
                </Badge>
              </div>

              {/* Feed tabs */}
              <div className="flex items-center gap-1.5 pt-4">
                {[
                  { id: "facebook", label: "Facebook" },
                  { id: "instagram", label: "Instagram" },
                  { id: "linkedin", label: "LinkedIn" },
                  { id: "twitter", label: "Twitter/X" }
                ].map(platform => (
                  <button
                    key={platform.id}
                    onClick={() => setPreviewTab(platform.id)}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all ${
                      previewTab === platform.id 
                        ? "bg-white text-blue-600 shadow-xs border border-slate-200" 
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                    id={`preview-tab-btn-${platform.id}`}
                  >
                    {platform.label}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-1 bg-slate-100/60 flex items-center justify-center">

              {previewTab === "facebook" && (
                <div className="w-full bg-white rounded-2xl shadow-md border border-slate-200/80 overflow-hidden font-sans text-stone-900 text-left max-w-sm">
                  {/* FB Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-[10px]">
                        PE
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-extrabold text-sm text-slate-900 leading-tight">Preschools Eswatini</span>
                          <CheckCircle className="h-4 w-4 text-white bg-blue-500 p-0.5 rounded-full shrink-0" />
                        </div>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">Just now • <Globe className="h-3 w-3" /></span>
                      </div>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="px-4 pb-3">
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                      {content || "Your social update message will dynamically display here with all emojis and hashtags..."}
                    </p>
                  </div>

                  {/* FB Graphic area */}
                  {(customImage || image) && (
                    <div className="aspect-video bg-slate-50 overflow-hidden border-y border-slate-100">
                      <img src={customImage || image} className="w-full h-full object-cover" alt="Facebook Feed Attachment" />
                    </div>
                  )}

                  {/* Likes section */}
                  <div className="p-3 text-[11px] text-slate-500 flex items-center justify-between border-b border-slate-100">
                    <span className="flex items-center gap-1">👍 24 others liked this</span>
                    <span>1 comment • 3 shares</span>
                  </div>

                  {/* Action values */}
                  <div className="grid grid-cols-3 p-1.5 text-center text-xs font-bold text-slate-500 bg-slate-50/50">
                    <span className="py-1.5 hover:bg-slate-100 rounded-xl cursor-default transition-all">Like</span>
                    <span className="py-1.5 hover:bg-slate-100 rounded-xl cursor-default transition-all">Comment</span>
                    <span className="py-1.5 hover:bg-slate-100 rounded-xl cursor-default transition-all">Share</span>
                  </div>
                </div>
              )}

              {previewTab === "instagram" && (
                <div className="w-full bg-white rounded-2xl shadow-md border border-slate-200/80 overflow-hidden font-sans text-stone-900 text-left max-w-sm">
                  {/* Insta Header */}
                  <div className="p-3.5 flex items-center justify-between border-b border-slate-50">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-linear-to-tr from-yellow-500 via-pink-500 to-purple-600 p-0.5">
                        <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-slate-800 font-black text-[9px]">
                          PE
                        </div>
                      </div>
                      <div>
                        <span className="font-extrabold text-xs text-slate-900">preschools_eswatini</span>
                        <span className="text-[10px] text-slate-500 block leading-none">Mbabane, Eswatini</span>
                      </div>
                    </div>
                  </div>

                  {/* Photo area */}
                  {(customImage || image) ? (
                    <div className="aspect-square bg-slate-50 overflow-hidden">
                      <img src={customImage || image} className="w-full h-full object-cover" alt="Instagram Main Graphic" />
                    </div>
                  ) : (
                    <div className="aspect-square bg-slate-200 flex items-center justify-center text-slate-400 text-xs italic">
                       No image attached - Recommended for Instagram
                    </div>
                  )}

                  {/* Command Row */}
                  <div className="p-3 flex items-center justify-between text-slate-800">
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 hover:text-red-500 transition-colors cursor-pointer" />
                      <MessageCircle className="h-5 w-5 hover:text-slate-600 cursor-pointer" />
                      <Send className="h-5 w-5 hover:text-slate-600 cursor-pointer" />
                    </div>
                    <Bookmark className="h-5 w-5 hover:text-yellow-500 cursor-pointer" />
                  </div>

                  {/* Cap Content */}
                  <div className="px-3 pb-4 space-y-1.5 text-xs">
                    <span className="font-extrabold text-slate-900">12 likes</span>
                    <p className="text-slate-700 leading-relaxed">
                      <span className="font-extrabold text-slate-900 mr-2">preschools_eswatini</span>
                      <span className="whitespace-pre-wrap">{content || "Draft parameters showcase..."}</span>
                    </p>
                    <span className="text-[9px] text-slate-400 font-medium uppercase font-mono mt-1 block">Just now</span>
                  </div>
                </div>
              )}

              {previewTab === "linkedin" && (
                <div className="w-full bg-white rounded-2xl shadow-md border border-slate-200/80 overflow-hidden font-sans text-stone-900 text-left max-w-sm p-4 space-y-4">
                  {/* Linkedin profile */}
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-lg bg-blue-700 flex items-center justify-center text-white font-black text-xs shrink-0">
                      PE
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-extrabold text-xs text-slate-950 truncate">Preschools Eswatini</span>
                        <CheckCircle className="h-3.5 w-3.5 text-blue-600 bg-white p-0 rounded-full shrink-0" />
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate">Swati Early Childhood Education Network</span>
                      <span className="text-[9px] text-slate-400 flex items-center gap-1 font-semibold leading-none mt-0.5"><Clock className="h-2.5 w-2.5" /> Just now • 🌐</span>
                    </div>
                  </div>

                  {/* Update Content */}
                  <div>
                    <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {content || "Update post block is rendered instantly here..."}
                    </p>
                  </div>

                  {/* Image */}
                  {(customImage || image) && (
                    <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-100">
                      <img src={customImage || image} className="w-full h-full object-cover" alt="LinkedIn Campaign Media" />
                    </div>
                  )}

                  {/* Stats counts */}
                  <div className="text-[10px] text-slate-400 font-semibold border-b border-slate-100 pb-2 flex justify-between">
                     <span>💡 14 reactions</span>
                     <span>2 comments</span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-4 text-center text-[11px] font-extrabold text-slate-500 pt-1">
                    <span className="hover:text-blue-600 transition-colors">Like</span>
                    <span className="hover:text-blue-600 transition-colors">Comment</span>
                    <span className="hover:text-blue-600 transition-colors">Repost</span>
                    <span className="hover:text-blue-600 transition-colors">Send</span>
                  </div>
                </div>
              )}

              {previewTab === "twitter" && (
                <div className="w-full bg-white rounded-2xl shadow-md border border-slate-200/80 overflow-hidden font-sans text-stone-900 text-left max-w-sm p-4 space-y-3">
                  {/* Twitter user block */}
                  <div className="flex items-start gap-2.5">
                    <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-xs shrink-0">
                      PE
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-extrabold text-xs text-slate-900 truncate">Preschools Eswatini</span>
                          <span className="text-xs text-slate-500 truncate">@PreschoolsSZ</span>
                          <span className="text-xs text-slate-500 whitespace-nowrap">• 1s</span>
                        </div>
                      </div>

                      {/* Content text */}
                      <p className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed mt-1">
                        {content || "Your Twitter/X post guidelines display here dynamically..."}
                      </p>

                      {/* Graphic attachment */}
                      {(customImage || image) && (
                        <div className="aspect-video bg-slate-50 rounded-xl overflow-hidden mt-3.5 border border-slate-200">
                          <img src={customImage || image} className="w-full h-full object-cover" alt="Twitter Media Card" />
                        </div>
                      )}

                      {/* Status timeline buttons */}
                      <div className="flex items-center justify-between text-slate-500 max-w-[240px] pt-3.5 text-xs">
                        <span className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"><MessageCircle className="h-4 w-4" /> 1</span>
                        <span className="flex items-center gap-1.5 hover:text-green-500 transition-colors"><Repeat className="h-4 w-4" /> 2</span>
                        <span className="flex items-center gap-1.5 hover:text-red-500 transition-colors"><Heart className="h-4 w-4" /> 5</span>
                        <span className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"><BarChart2 className="h-4 w-4" /> 82</span>
                      </div>

                    </div>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </section>

      </div>

      {/* Campaign Outreach & Performance Analytics Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnalyticsCard
          title="Outreach Campaign Reach & Impressions"
          description="Aggregate impressions and visibility across Facebook, Instagram, LinkedIn, and Twitter/X."
          data={socialAnalyticsData}
          xAxisKey="label"
          dateKey="date"
          metrics={[
            { key: "impressions", label: "Outreach Impressions", color: "#3b82f6", type: "area" },
          ]}
          id="social-impressions-analytics"
          defaultRange="ALL"
        />
        <AnalyticsCard
          title="Engagement & Conversion Clicks"
          description="Click-through conversions and average platform engagement rate progression."
          data={socialAnalyticsData}
          xAxisKey="label"
          dateKey="date"
          metrics={[
            { key: "clicks", label: "Link Clicks", color: "#10b981", type: "bar" },
            { key: "engagementRate", label: "Engagement Rate (%)", color: "#f59e0b", type: "line" }
          ]}
          id="social-interaction-analytics"
          defaultRange="ALL"
        />
      </div>

      {/* Connected Channels & Accounts Section */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4 border-b border-slate-50">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Connected Social Channels</CardTitle>
          <CardDescription>Accounts authorized via OAuth to release guidelines automatically.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Facebook Page", status: "Connected", sync: "Sync complete", color: "emerald", value: "4,200 Fans", icon: Facebook },
              { label: "Instagram Official", status: "Connected", sync: "Sync complete", color: "emerald", value: "2,840 Followers", icon: Instagram },
              { label: "LinkedIn Company", status: "Connected", sync: "Sync complete", color: "emerald", value: "1,450 Connections", icon: Linkedin },
              { label: "Twitter/X Premium", status: "Connected", sync: "Sync complete", color: "emerald", value: "850 Followers", icon: Twitter }
            ].map((acct, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between gap-4 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                    <acct.icon className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-900 leading-tight">{acct.label}</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-bold uppercase tracking-wider">{acct.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-emerald-100 text-emerald-800 border-none font-black text-[9px] uppercase. py-0.5 px-2">
                     Active
                  </Badge>
                  <span className="text-[8px] text-slate-400 font-bold block mt-1 uppercase tracking-wider">{acct.sync}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Broadcasting History & Ledger */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Campaign Schedule & Releases Ledger</CardTitle>
            <CardDescription>Manage past distributions, modify scheduled outputs, or view instant engagement analytics metrics.</CardDescription>
          </div>
          <Badge className="bg-blue-50 text-blue-600 border-none select-none font-black text-[10px] tracking-wider uppercase. p-2 rounded-xl">
             {posts.length} entries registered
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-sans border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="p-4 pl-6">Released Time / Scheduling</th>
                  <th className="p-4">Message Snippet</th>
                  <th className="p-4">Accounts</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Impressions / Reach</th>
                  <th className="p-4">Engagement</th>
                  <th className="p-4 pr-6 text-right">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-slate-50/40 transition-colors" id={`post-row-${post.id}`}>
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-2">
                        {post.status === "Published" ? (
                          <Send className="h-4 w-4 text-emerald-500 shrink-0" />
                        ) : post.status === "Scheduled" ? (
                          <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
                        ) : (
                          <PenTool className="h-4 w-4 text-slate-500 shrink-0" />
                        )}
                        <div>
                          <span className="text-xs font-bold text-slate-900 block leading-tight">{post.publishDate}</span>
                          <span className="text-[9px] text-slate-400 block font-mono font-bold uppercase tracking-wider mt-0.5">
                            {post.status === "Published" ? "Direct Broadcast" : "Automated Queue"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 max-w-sm">
                      <div className="flex items-start gap-2.5">
                        {post.image && (
                          <img src={post.image} className="h-9 w-12 rounded-lg object-cover bg-slate-100 shrink-0 mt-0.5" alt="" />
                        )}
                        <p className="text-xs text-slate-600 leading-normal line-clamp-2 max-w-xs xl:max-w-md font-sans">
                          {post.content}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1.5">
                        {post.platforms.map((platform, i) => (
                          <span 
                            key={i} 
                            title={platform}
                            className={`h-6 w-6 rounded-full flex items-center justify-center border text-[10px] font-bold uppercase shrink-0 ${
                              platform === "facebook" ? "bg-blue-50 text-blue-600 border-blue-100" :
                              platform === "instagram" ? "bg-pink-50 text-pink-600 border-pink-100" :
                              platform === "linkedin" ? "bg-blue-50 text-blue-700 border-blue-200" :
                              "bg-slate-900 text-white border-transparent"
                            }`}
                          >
                            {platform.charAt(0).toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`border text-[9px] font-black rounded-full px-2.5 py-0.5 tracking-wider ${
                        post.status === "Published" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        post.status === "Scheduled" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {post.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-slate-900 font-mono font-bold">
                        {post.analytics?.impressions !== undefined ? post.analytics.impressions.toLocaleString() : "—"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-600 font-mono font-bold">
                          {post.analytics?.engagementRate || "—"}
                        </span>
                        {post.analytics && <span className="text-[10px] text-slate-400 font-normal font-sans">({post.analytics.clicks} clicks)</span>}
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-slate-800"
                          onClick={() => {
                            setContent(post.content);
                            if (post.image) {
                              setCustomImage(post.image);
                            }
                            setSelectedPlatforms(post.platforms);
                            setPostStatus(post.status);
                            setSuccessToast("Post loaded back into manual Composer above.");
                            setTimeout(() => setSuccessToast(""), 4000);
                          }}
                          title="Edit social post"
                        >
                          <PenTool className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-red-600"
                          onClick={() => handleDeletePost(post.id)}
                          title="Remove social post"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Persistent floating notification alerts */}
      <AnimatePresence>
        {successToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 shadow-2xl flex items-center gap-3.5 max-w-sm"
          >
            <div className="h-8 w-8 rounded-full bg-blue-500/15 flex items-center justify-center text-blue-400 shrink-0">
               <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight text-white">{successToast}</p>
              <span className="text-[9px] text-slate-400 font-semibold block mt-1 uppercase tracking-wider">Preschools Eswatini Platform hub</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

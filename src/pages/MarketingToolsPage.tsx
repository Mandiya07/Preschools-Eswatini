import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Search, MapPinned, Share2, Mail, Megaphone, 
  LayoutTemplate, UserPlus, Users, Sparkles, Video, 
  Copy, Check, Clock, Film, Smartphone, Building2, Store, HeartHandshake, Download, Volume2
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";

interface ScriptItem {
  id: string;
  title: string;
  target: 'preschools' | 'suppliers' | 'parents';
  targetLabel: string;
  duration: string;
  hookOverlay: string;
  visualShot: string;
  audioVoiceover: string;
  caption: string;
  hashtags: string[];
}

const INITIAL_SCRIPTS: ScriptItem[] = [
  {
    id: "p1",
    title: "Instant Parent Enquiries in 5s",
    target: "preschools",
    targetLabel: "Preschools & Directors",
    duration: "5 Seconds",
    hookOverlay: "Still getting zero parent calls? 🛑",
    visualShot: "Fast cut: Frustrated school director looking at empty desk, then quick snap to our website showing 15 new enrollment applications rolling in.",
    audioVoiceover: "List your preschool on Eswatini's #1 platform today and fill your classrooms this term!",
    caption: "Stop missing out on local parents searching for quality early education. Claim your preschool listing in 60 seconds! 🎒✨",
    hashtags: ["#EswatiniPreschools", "#SchoolGrowth", "#EarlyLearning", "#PreschoolDirectory"]
  },
  {
    id: "p2",
    title: "Zero-Effort Website & Fees",
    target: "preschools",
    targetLabel: "Preschools & Directors",
    duration: "5 Seconds",
    hookOverlay: "Your preschool needs a pro website. Now. 🚀",
    visualShot: "Side-by-side split screen: Left is messy WhatsApp chats, right is your gorgeous professional school website on our portal.",
    audioVoiceover: "Give parents instant fee schedules and online booking in one click. Link in bio!",
    caption: "Professional admissions, fee calculators, and daily parent updates made effortless. Join today! 📚💼",
    hashtags: ["#PreschoolManagement", "#EswatiniEducation", "#DigitalSchool"]
  },
  {
    id: "s1",
    title: "Supply Every Preschool in Eswatini",
    target: "suppliers",
    targetLabel: "Suppliers & Vendors",
    duration: "5 Seconds",
    hookOverlay: "Sell your toys & books to 50+ schools instantly! 🧸📦",
    visualShot: "Dynamic pan across stacks of educational toys, textbooks, and playground turf, ending on the Supplier Marketplace dashboard.",
    audioVoiceover: "Connect directly with preschool directors buying bulk supplies across Eswatini. Join our B2B marketplace!",
    caption: "Are you a wholesale supplier, toy distributor, or catering vendor? Reach every preschool director in Eswatini directly. 🤝📈",
    hashtags: ["#EswatiniBusiness", "#SchoolSuppliers", "#B2BMarketplace", "#EarlyYearsSupply"]
  },
  {
    id: "s2",
    title: "Bulk Orders & Direct RFQs",
    target: "suppliers",
    targetLabel: "Suppliers & Vendors",
    duration: "5 Seconds",
    hookOverlay: "Tired of chasing school orders? 📞❌",
    visualShot: "Notification popup animation: 'New Bulk RFQ Received: 50 Montessori Tables - Manzini Region'.",
    audioVoiceover: "Get direct purchase requests from verified preschools right to your phone. List your products now!",
    caption: "Streamline your wholesale distribution. Verified preschools ordering learning materials every single week. 🚀",
    hashtags: ["#WholesaleEswatini", "#SchoolVendor", "#EducationSupply"]
  },
  {
    id: "r1",
    title: "Find Top-Rated Nearby Preschools",
    target: "parents",
    targetLabel: "Parents & Guardians",
    duration: "5 Seconds",
    hookOverlay: "Looking for the best preschool near you? 🗺️✨",
    visualShot: "Map zoom animation zooming into Mbabane and Manzini, showing top-rated verified preschool cards with 5-star badges.",
    audioVoiceover: "Compare fees, view classrooms, and book tours instantly on Eswatini's trusted preschool directory!",
    caption: "Give your child the best start in life. Browse verified early learning centers, fees, and safety ratings near you. ❤️🎒",
    hashtags: ["#EswatiniParents", "#MbabaneMommies", "#ManziniKids", "#PreschoolSearch"]
  },
  {
    id: "r2",
    title: "Instant Tour Booking for Parents",
    target: "parents",
    targetLabel: "Parents & Guardians",
    duration: "5 Seconds",
    hookOverlay: "Book a school tour in 3 seconds! 🗓️👇",
    visualShot: "Close-up thumb tapping 'Book Visit' button on phone screen with satisfying haptic checkmark animation.",
    audioVoiceover: "Secure your child's spot before classes fill up. Visit our website to explore and apply today!",
    caption: "No more endless phone calls. Compare tuition, check availability, and schedule your visit in seconds! 🌟",
    hashtags: ["#ParentLifeEswatini", "#EarlyChildhoodEducation", "#SchoolTours"]
  }
];

export function MarketingToolsPage() {
  const [selectedTarget, setSelectedTarget] = useState<'all' | 'preschools' | 'suppliers' | 'parents'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [dynamicScripts, setDynamicScripts] = useState<ScriptItem[]>(INITIAL_SCRIPTS);

  const filteredScripts = selectedTarget === 'all' 
    ? dynamicScripts 
    : dynamicScripts.filter(s => s.target === selectedTarget);

  const handleCopy = (script: ScriptItem) => {
    const textContent = `🎬 [5-SECOND SHOT SCRIPT: ${script.title.toUpperCase()}]\nTarget Audience: ${script.targetLabel}\nDuration: ${script.duration}\n\n🛑 HOOK TEXT OVERLAY (0-2s):\n"${script.hookOverlay}"\n\n🎥 VISUAL SHOT (2-4s):\n${script.visualShot}\n\n🎙️ AUDIO / VOICEOVER (4-5s):\n"${script.audioVoiceover}"\n\n📝 SOCIAL CAPTION:\n${script.caption}\n\nHashtags: ${script.hashtags.join(" ")}`;
    
    navigator.clipboard.writeText(textContent);
    setCopiedId(script.id);
    toast.success("5-second script copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleGenerateAI = () => {
    if (!customPrompt.trim()) {
      toast.error("Please enter a focus area or promotion topic for the AI script.");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      const newScript: ScriptItem = {
        id: `ai-${Date.now()}`,
        title: `AI Promo: ${customPrompt.slice(0, 30)}...`,
        target: customPrompt.toLowerCase().includes("supplier") ? "suppliers" : (customPrompt.toLowerCase().includes("parent") ? "parents" : "preschools"),
        targetLabel: "Custom AI Script",
        duration: "5 Seconds",
        hookOverlay: `✨ ${customPrompt.slice(0, 35)}!`,
        visualShot: `Dynamic energetic montage highlighting ${customPrompt} with upbeat background music and bold subtitles.`,
        audioVoiceover: `Discover how ${customPrompt} is transforming early childhood education across Eswatini today!`,
        caption: `${customPrompt} - Experience the future of Eswatini early learning on our platform! 🚀📚`,
        hashtags: ["#EswatiniEducation", "#PreschoolsEswatini", "#SmartPlatform"]
      };
      setDynamicScripts([newScript, ...dynamicScripts]);
      setIsGenerating(false);
      setCustomPrompt("");
      toast.success("Generated new custom 5-second video script!");
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 px-4 sm:px-6">
      <SEO title="5-Second Viral Reel Scripts | Preschools Eswatini" />
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Film className="h-3.5 w-3.5" /> TikTok, Instagram Reels & WhatsApp Status Ready
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">5-Second Viral Ad Scripts</h1>
          <p className="text-blue-100 text-base leading-relaxed">
            Ultra-short, high-retention video scripts crafted specifically to alert preschool directors, wholesale suppliers, and parents about our platform. Film in 5 seconds, capture attention instantly.
          </p>
        </div>
      </div>

      {/* Target Audience Filter Tabs & AI Generator Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={selectedTarget === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedTarget('all')}
            className={`rounded-xl text-sm font-medium ${selectedTarget === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            All Scripts ({dynamicScripts.length})
          </Button>
          <Button
            variant={selectedTarget === 'preschools' ? 'default' : 'outline'}
            onClick={() => setSelectedTarget('preschools')}
            className={`rounded-xl text-sm font-medium gap-1.5 ${selectedTarget === 'preschools' ? 'bg-blue-600 text-white' : 'text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            <Building2 className="h-4 w-4" /> Preschools
          </Button>
          <Button
            variant={selectedTarget === 'suppliers' ? 'default' : 'outline'}
            onClick={() => setSelectedTarget('suppliers')}
            className={`rounded-xl text-sm font-medium gap-1.5 ${selectedTarget === 'suppliers' ? 'bg-blue-600 text-white' : 'text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            <Store className="h-4 w-4" /> Suppliers
          </Button>
          <Button
            variant={selectedTarget === 'parents' ? 'default' : 'outline'}
            onClick={() => setSelectedTarget('parents')}
            className={`rounded-xl text-sm font-medium gap-1.5 ${selectedTarget === 'parents' ? 'bg-blue-600 text-white' : 'text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            <HeartHandshake className="h-4 w-4" /> Parents
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type custom topic (e.g. Montessori toys, fee discounts)..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateAI()}
            className="flex-1 md:w-64 px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button 
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shrink-0"
          >
            <Sparkles className="h-4 w-4 mr-1.5" />
            {isGenerating ? "Generating..." : "AI Generate"}
          </Button>
        </div>
      </div>

      {/* Script Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScripts.map((script) => (
          <Card key={script.id} className="rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden bg-white">
            <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  script.target === 'preschools' ? 'bg-blue-100 text-blue-700' :
                  script.target === 'suppliers' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {script.target === 'preschools' && <Building2 className="h-3 w-3" />}
                  {script.target === 'suppliers' && <Store className="h-3 w-3" />}
                  {script.target === 'parents' && <HeartHandshake className="h-3 w-3" />}
                  {script.targetLabel}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-200/60 px-2.5 py-0.5 rounded-full">
                  <Clock className="h-3 w-3" /> {script.duration}
                </span>
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">{script.title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 pt-5 pb-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4 text-sm">
                {/* Hook Overlay */}
                <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-3.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1 flex items-center gap-1">
                    <Smartphone className="h-3.5 w-3.5" /> On-Screen Hook (0-2s)
                  </p>
                  <p className="font-semibold text-slate-900 text-base">"{script.hookOverlay}"</p>
                </div>

                {/* Visual Shot */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">🎥 Visual Action (2-4s)</p>
                  <p className="text-slate-700 leading-relaxed">{script.visualShot}</p>
                </div>

                {/* Voiceover */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">🎙️ Voiceover / Audio (4-5s)</p>
                  <p className="text-slate-800 italic">"{script.audioVoiceover}"</p>
                </div>

                {/* Caption & Hashtags */}
                <div className="text-xs text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                  <p className="font-semibold text-slate-700">Caption Preview:</p>
                  <p className="line-clamp-2 text-slate-600">{script.caption}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {script.hashtags.map((tag, idx) => (
                      <span key={idx} className="text-blue-600 font-medium">#{tag.replace('#', '')}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Copy Button */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                <Button 
                  onClick={() => handleCopy(script)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium shadow-sm transition-all"
                >
                  {copiedId === script.id ? (
                    <>
                      <Check className="h-4 w-4 mr-2 text-emerald-400" /> Copied Full Script!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" /> Copy 5-Second Script & Caption
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pro Tips Section */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl mt-12 grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="h-10 w-10 rounded-xl bg-blue-600/30 flex items-center justify-center text-blue-400">
            <Smartphone className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold">1. Vertical 9:16 Format</h3>
          <p className="text-sm text-slate-400">Shoot your videos vertically using your smartphone camera. Keep the text hook in the upper middle area so it isn't blocked by platform captions.</p>
        </div>
        <div className="space-y-2">
          <div className="h-10 w-10 rounded-xl bg-emerald-600/30 flex items-center justify-center text-emerald-400">
            <Volume2 className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold">2. Punchy Audio & Captions</h3>
          <p className="text-sm text-slate-400">Use trending upbeat background audio at low volume, and auto-generate bold animated captions to maximize retention in the first 2 seconds.</p>
        </div>
        <div className="space-y-2">
          <div className="h-10 w-10 rounded-xl bg-purple-600/30 flex items-center justify-center text-purple-400">
            <Share2 className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold">3. Multi-Platform Blast</h3>
          <p className="text-sm text-slate-400">Post these 5-second clips daily on TikTok, Instagram Reels, YouTube Shorts, and WhatsApp Status to drive direct traffic to your website link.</p>
        </div>
      </div>
    </div>
  );
}


import { useState } from "react";
import { 
  Sparkles, 
  Globe, 
  UserCircle, 
  BookOpen, 
  HelpCircle, 
  UserPlus, 
  Search, 
  Image as ImageIcon, 
  ThumbsUp,
  Loader2,
  Copy,
  Check,
  Wand2,
  BrainCircuit,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateAIContent, AIGenerateType } from "@/services/geminiService";

export function AdminAIToolsPage() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState<AIGenerateType>('website');
  const [copied, setCopied] = useState(false);

  const tools: { id: AIGenerateType; name: string; icon: any; description: string; placeholder: string }[] = [
    { 
      id: 'website', 
      name: 'Website Copy', 
      icon: Globe, 
      description: 'Generate catchy headlines and marketing text.',
      placeholder: 'Tell us about your school values or target audience...'
    },
    { 
      id: 'profile', 
      name: 'School Profile', 
      icon: UserCircle, 
      description: 'Create a professional school identity.',
      placeholder: 'List your core offerings, curriculum type, and safety measures...'
    },
    { 
      id: 'blog', 
      name: 'Blog/News', 
      icon: BookOpen, 
      description: 'Engaging content for parent newsletters.',
      placeholder: 'Topic: Why outdoor play matters in preschool...'
    },
    { 
      id: 'faq', 
      name: 'FAQ Assistant', 
      icon: HelpCircle, 
      description: 'Generate common parent questions and answers.',
      placeholder: 'School policies, uniform detail, meal plans...'
    },
    { 
      id: 'admissions', 
      name: 'Admissions helper', 
      icon: UserPlus, 
      description: 'Draft responses to common inquiries.',
      placeholder: 'Briefly describe the parent inquiry you want to respond to...'
    },
    { 
      id: 'seo', 
      name: 'SEO Booster', 
      icon: Search, 
      description: 'Optimize your online visibility.',
      placeholder: 'Describe your school location and main strengths...'
    },
    { 
      id: 'caption', 
      name: 'Smart Captions', 
      icon: ImageIcon, 
      description: 'Social media captions for school photos.',
      placeholder: 'Describe what is happening in the photo...'
    },
    { 
      id: 'recommendation', 
      name: 'Audit Tool', 
      icon: ThumbsUp, 
      description: 'Get suggestions on existing content.',
      placeholder: 'Paste your current description here for improvement suggestions...'
    },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResult("");
    
    const response = await generateAIContent(prompt, activeTool);
    
    if (response.error) {
      setResult(`Error: ${response.error}`);
    } else {
      setResult(response.text);
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BrainCircuit className="h-7 w-7 text-blue-600" />
            AI Empowerment Hub
          </h1>
          <p className="text-slate-500 italic">Advanced generative tools to elevate your school's digital presence</p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 py-1.5 px-3 block text-center">
           <span className="flex items-center gap-2">
             <Sparkles className="h-3 w-3 animate-pulse" />
             Powered by Gemini Pro
           </span>
        </Badge>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="space-y-2">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest Ital mb-4 px-2">Design & Content</p>
           {tools.map(tool => (
             <button
               key={tool.id}
               onClick={() => {
                 setActiveTool(tool.id);
                 setResult("");
                 setPrompt("");
               }}
               className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all group ${
                 activeTool === tool.id 
                   ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                   : 'hover:bg-slate-50 text-slate-600'
               }`}
             >
                <div className={`p-2 rounded-xl transition-colors ${
                  activeTool === tool.id ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-white'
                }`}>
                   <tool.icon className="h-4 w-4" />
                </div>
                <div>
                   <p className="text-xs font-bold">{tool.name}</p>
                   <p className={`text-[9px] line-clamp-1 ${activeTool === tool.id ? 'text-blue-100' : 'text-slate-400'}`}>
                      {tool.description}
                   </p>
                </div>
             </button>
           ))}
        </div>

        {/* Main Interface */}
        <div className="lg:col-span-3 space-y-6">
           <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm">
                       {tools.find(t => t.id === activeTool)?.icon && 
                        (activeTool === 'website' ? <Globe className="h-5 w-5" /> : 
                         activeTool === 'profile' ? <UserCircle className="h-5 w-5" /> :
                         activeTool === 'blog' ? <BookOpen className="h-5 w-5" /> :
                         activeTool === 'faq' ? <HelpCircle className="h-5 w-5" /> :
                         activeTool === 'admissions' ? <UserPlus className="h-5 w-5" /> :
                         activeTool === 'seo' ? <Search className="h-5 w-5" /> :
                         activeTool === 'caption' ? <ImageIcon className="h-5 w-5" /> :
                         <ThumbsUp className="h-5 w-5" />)
                       }
                    </div>
                    <div>
                       <CardTitle className="text-lg">{tools.find(t => t.id === activeTool)?.name}</CardTitle>
                       <CardDescription>{tools.find(t => t.id === activeTool)?.description}</CardDescription>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                 <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Input Context</Label>
                    <Textarea 
                      placeholder={tools.find(t => t.id === activeTool)?.placeholder}
                      className="min-h-[150px] rounded-2xl border-slate-200 bg-slate-50 focus:bg-white resize-none p-4"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                 </div>
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-400 italic">Pro tip: Be specific about your school's unique features for better results.</p>
                    <Button 
                      onClick={handleGenerate} 
                      disabled={loading || !prompt.trim()}
                      className="bg-slate-900 hover:bg-black text-white rounded-xl px-8 h-12 shadow-lg relative overflow-hidden group"
                    >
                       {loading ? (
                         <Loader2 className="h-4 w-4 animate-spin" />
                       ) : (
                         <>
                           <span className="relative z-10 flex items-center gap-2">
                              Magic Generate <Wand2 className="h-4 w-4 transition-transform group-hover:rotate-12" />
                           </span>
                           <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                         </>
                       )}
                    </Button>
                 </div>
              </CardContent>
           </Card>

           {result && (
             <Card className="border-blue-100 bg-blue-50/30 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-blue-50">
                    <div className="flex items-center gap-2 text-blue-600">
                       <Sparkles className="h-4 w-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Generated Output</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 rounded-lg gap-2 text-[10px] uppercase font-bold"
                      onClick={copyToClipboard}
                    >
                       {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                       {copied ? 'Copied' : 'Copy Text'}
                    </Button>
                </CardHeader>
                <CardContent className="p-6">
                   <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {result}
                   </div>
                </CardContent>
             </Card>
           )}

           <div className="grid sm:grid-cols-2 gap-6">
              <Card className="bg-slate-50 border-none">
                 <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                       <MessageCircle className="h-6 w-6" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-slate-900">Website Chatbot</p>
                       <p className="text-[10px] text-slate-500">Deploy an AI assistant to your public site.</p>
                       <Button variant="link" className="p-0 h-auto text-[10px] font-bold text-blue-600 mt-1">Configure Chatbot</Button>
                    </div>
                 </CardContent>
              </Card>
              <Card className="bg-slate-50 border-none">
                 <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                       <BrainCircuit className="h-6 w-6" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-slate-900">Smart Admissions</p>
                       <p className="text-[10px] text-slate-500">AI-driven application scoring (Beta).</p>
                       <Button variant="link" className="p-0 h-auto text-[10px] font-bold text-purple-600 mt-1">Enable Insights</Button>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>
      </div>
    </div>
  );
}

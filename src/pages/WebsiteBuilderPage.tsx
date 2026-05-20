import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Monitor, 
  Smartphone, 
  Save, 
  Eye, 
  Type, 
  Image as ImageIcon, 
  Palette, 
  Layout,
  Settings,
  Upload,
  Trash2,
  Loader2,
  CheckCircle2,
  Globe,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { fetchDocument, updateDocument, createDocument } from "@/lib/firestoreUtils";
import { Sparkles } from "lucide-react";

type UploadedImage = {
  id: string;
  url: string;
  target: string;
  name: string;
  caption?: string;
};

export function WebsiteBuilderPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [suggesting, setSuggesting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("theme");
  const [previewMode, setPreviewMode] = useState("desktop");
  const [images, setImages] = useState<UploadedImage[]>([
    { id: 'img-1', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400', target: 'Hero Background', name: 'hero-banner.jpg', caption: 'Welcome to our school' }
  ]);
  const [headline, setHeadline] = useState("Little Stars Academy");
  const [subheadline, setSubheadline] = useState("A nurturing environment for your child's first steps in learning.");
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [secondaryColor, setSecondaryColor] = useState("#f59e0b");
  const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
  const [selectedTemplate, setSelectedTemplate] = useState("Montessori Premium");
  const [themeName, setThemeName] = useState('Classic');

  const THEMES = {
    'Classic': { primary: '#2563eb', secondary: '#f59e0b', font: 'Inter, sans-serif' },
    'Nature': { primary: '#059669', secondary: '#84cc16', font: "'Playfair Display', serif" },
    'Playful': { primary: '#db2777', secondary: '#fcd34d', font: "'Comic Neue', cursive" },
  };

  useEffect(() => {
    const theme = THEMES[themeName as keyof typeof THEMES];
    if (theme) {
      setPrimaryColor(theme.primary);
      setSecondaryColor(theme.secondary);
      setFontFamily(theme.font);
    }
  }, [themeName]);
  
  // Blog / News State
  const [newsItems, setNewsItems] = useState([
    { id: 1 as any, title: "Summer Program Registration", date: "May 2026" }
  ]);
  const [newNewsTitle, setNewNewsTitle] = useState("");

  // Contact State
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [contactMessage, setContactMessage] = useState("We'd love to hear from you! Please reach out with any questions.");

  // SEO & Domain State
  const [seoTitle, setSeoTitle] = useState("Little Stars Academy | Preschool in Eswatini");
  const [customDomain, setCustomDomain] = useState("");

  useEffect(() => {
    async function loadConfig() {
      if (!user?.schoolId) {
        setLoading(false);
        return;
      }
      const config = await fetchDocument('websites', user.schoolId) as any;
      if (config) {
        setHeadline(config.headline || "");
        setSubheadline(config.subheadline || "");
        setPrimaryColor(config.primaryColor || "#2563eb");
        setSecondaryColor(config.secondaryColor || "#f59e0b");
        setFontFamily(config.fontFamily || "Inter, sans-serif");
        setSelectedTemplate(config.template || "Montessori Premium");
        setImages(config.images || []);
        setNewsItems(config.newsItems || []);
        setSeoTitle(config.seoTitle || "");
        setCustomDomain(config.customDomain || "");
        setContactEmail(config.contactEmail || "");
        setContactPhone(config.contactPhone || "");
        setContactAddress(config.contactAddress || "");
        setOperatingHours(config.operatingHours || "");
        setContactMessage(config.contactMessage || "We'd love to hear from you! Please reach out with any questions.");
        setThemeName(config.theme || 'Classic');
      }
      setLoading(false);
    }
    loadConfig();
  }, [user]);

  const handlePublish = async () => {
    if (!user?.schoolId) return;
    setSaving(true);
    const config = {
      schoolId: user.schoolId,
      headline,
      subheadline,
      primaryColor,
      secondaryColor,
      fontFamily,
      template: selectedTemplate,
      theme: themeName,
      images,
      newsItems,
      seoTitle,
      customDomain,
      contactEmail,
      contactPhone,
      contactAddress,
      operatingHours,
      contactMessage,
      publishedAt: new Date().toISOString()
    };
    
    // Using schoolId as document ID for the website config
    await createDocument('websites', user.schoolId, config);
    setSaving(false);
    alert("Website published successfully!");
  };

  const handleAISuggest = async (field: 'headline' | 'subheadline') => {
    setSuggesting(field);
    try {
      const prompt = field === 'headline' 
        ? "Generate a short, catchy, and warm name or headline for a preschool/daycare in Eswatini. Examples: 'Little Stars Academy', 'Sunrise Montessori', 'Tiny steps Daycare'."
        : `Generate a one-sentence warm subheadline for a preschool called "${headline}". It should emphasize safety, learning, and fun.`;
      
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type: field === 'headline' ? 'hero_headline' : 'hero_subheadline' }),
      });
      
      const data = await response.json();
      if (data.text) {
        if (field === 'headline') setHeadline(data.text.trim());
        else setSubheadline(data.text.trim());
      }
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setSuggesting(null);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroBgInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white rounded-xl border border-slate-200">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFiles = (files: FileList | null, targetArea: string = 'Photo Gallery') => {
    if (files && files.length > 0) {
      const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      
      if (validFiles.length !== files.length) {
        alert("Only image files are allowed.");
      }

      const newImages = validFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9) + '-' + file.name,
        url: URL.createObjectURL(file),
        target: targetArea,
        name: file.name
      }));
      
      if (targetArea === 'Hero Background') {
         setImages(prev => [...prev.filter(img => img.target !== 'Hero Background'), ...newImages]);
      } else {
         setImages((prev) => [...prev, ...newImages]);
      }
    }
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const targetImages = images[index].target;
    // We only reorder within the same target group
    const groupIndices = images.map((img, idx) => img.target === targetImages ? idx : -1).filter(idx => idx !== -1);
    
    const currentPos = groupIndices.indexOf(index);
    const targetPos = direction === 'up' ? currentPos - 1 : currentPos + 1;
    
    if (targetPos >= 0 && targetPos < groupIndices.length) {
      const targetIndex = groupIndices[targetPos];
      [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
      setImages(newImages);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Website Builder</h1>
          <p className="text-sm text-slate-500">Customize your school's public website</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white">
            <Eye className="mr-2 h-4 w-4" /> Live Preview
          </Button>
          <Button onClick={handlePublish} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {saving ? 'Publishing...' : 'Publish Changes'}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Editor Sidebar */}
        <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="flex border-b border-slate-200 bg-white p-2 gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'theme', icon: Palette, label: 'Theme' },
              { id: 'content', icon: Layout, label: 'Content' },
              { id: 'media', icon: ImageIcon, label: 'Media' },
              { id: 'news', icon: Type, label: 'News' },
              { id: 'contact', icon: MessageSquare, label: 'Contact' },
              { id: 'settings', icon: Settings, label: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg min-w-[70px] ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-700 font-medium' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="h-5 w-5 mb-1" />
                <span className="text-[10px] uppercase tracking-wider">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Theme Preset</h3>
                  <select 
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
                    value={themeName}
                    onChange={(e) => setThemeName(e.target.value)}
                  >
                    {Object.keys(THEMES).map(key => <option key={key} value={key}>{key}</option>)}
                  </select>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Active Template</h3>
                  <div className="aspect-video rounded border-2 border-blue-600 bg-slate-100 relative overflow-hidden mb-3">
                    <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-80" alt="template preview" />
                    <div className="absolute inset-x-0 bottom-0 bg-slate-900/80 p-2 text-white text-xs text-center font-medium">
                      {selectedTemplate}
                    </div>
                  </div>
                  <label className="text-xs text-slate-500 block mb-1">Change Template</label>
                  <select 
                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                  >
                    <option value="Montessori Premium">Montessori Premium</option>
                    <option value="Budget Preschool">Budget Preschool</option>
                    <option value="Premium Academy">Premium Academy</option>
                    <option value="Daycare Center">Daycare Center</option>
                    <option value="Christian Preschool">Christian Preschool</option>
                    <option value="Modern Kindergarten">Modern Kindergarten</option>
                  </select>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Brand Colors</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Primary Color</label>
                      <div className="flex gap-2">
                        <input type="color" className="h-8 w-8 rounded cursor-pointer border border-slate-200" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                        <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-8 text-sm uppercase" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Secondary Color</label>
                      <div className="flex gap-2">
                        <input type="color" className="h-8 w-8 rounded cursor-pointer border border-slate-200" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} />
                        <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="h-8 text-sm uppercase" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Fonts</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Heading Font</label>
                      <select 
                        className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600"
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                      >
                        <option value="Inter, sans-serif">Inter (Modern)</option>
                        <option value="'Playfair Display', serif">Playfair Display (Elegant)</option>
                        <option value="'Comic Neue', cursive">Comic Neue (Playful)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Hero Banner</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Background Image</label>
                      <div className="flex items-center gap-3">
                        {images.find(img => img.target === 'Hero Background') ? (
                           <div className="h-16 w-24 rounded border border-slate-200 overflow-hidden relative group">
                             <img src={images.find(img => img.target === 'Hero Background')?.url} className="w-full h-full object-cover" alt="Hero bg" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:text-red-400" onClick={() => setImages(images.filter(img => img.target !== 'Hero Background'))}>
                                 <Trash2 className="h-3 w-3" />
                               </Button>
                             </div>
                           </div>
                        ) : (
                          <div className="h-16 w-24 border-2 border-dashed border-slate-300 rounded flex items-center justify-center bg-slate-50 text-slate-400">
                             <ImageIcon className="h-5 w-5" />
                          </div>
                        )}
                        <Button variant="outline" size="sm" onClick={() => heroBgInputRef.current?.click()} className="text-xs h-8">
                           {images.find(img => img.target === 'Hero Background') ? 'Change Image' : 'Upload Image'}
                        </Button>
                        <input 
                          type="file" 
                          ref={heroBgInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => handleFiles(e.target.files, 'Hero Background')}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs text-slate-500 block">Headline</label>
                        <button 
                          onClick={() => handleAISuggest('headline')}
                          disabled={!!suggesting}
                          className="text-[10px] text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-1.5 py-0.5 rounded cursor-pointer disabled:opacity-50"
                        >
                          {suggesting === 'headline' ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Sparkles className="h-2.5 w-2.5" />}
                          AI Suggest
                        </button>
                      </div>
                      <Input value={headline} onChange={(e) => setHeadline(e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs text-slate-500 block">Subheadline</label>
                        <button 
                          onClick={() => handleAISuggest('subheadline')}
                          disabled={!!suggesting}
                          className="text-[10px] text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-1.5 py-0.5 rounded cursor-pointer disabled:opacity-50"
                        >
                          {suggesting === 'subheadline' ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Sparkles className="h-2.5 w-2.5" />}
                          AI Suggest
                        </button>
                      </div>
                      <textarea className="w-full rounded-md border border-slate-200 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" rows={3} value={subheadline} onChange={(e) => setSubheadline(e.target.value)}></textarea>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'media' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Core Assets</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Logo Upload */}
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">School Logo</label>
                       <div 
                         className="h-24 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors relative group overflow-hidden"
                         onClick={() => logoInputRef.current?.click()}
                       >
                         {images.find(img => img.target === 'School Logo') ? (
                           <>
                             <img src={images.find(img => img.target === 'School Logo')!.url} alt="Logo" className="h-full w-full object-contain p-2" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                               <Upload className="h-5 w-5 text-white" />
                             </div>
                           </>
                         ) : (
                           <ImageIcon className="h-6 w-6 text-slate-300" />
                         )}
                       </div>
                       <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFiles(e.target.files, 'School Logo')} />
                    </div>

                    {/* Hero Upload */}
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hero Banner</label>
                       <div 
                         className="h-24 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors relative group overflow-hidden"
                         onClick={() => heroBgInputRef.current?.click()}
                       >
                         {images.find(img => img.target === 'Hero Background') ? (
                           <>
                             <img src={images.find(img => img.target === 'Hero Background')!.url} alt="Hero" className="h-full w-full object-cover" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                               <Upload className="h-5 w-5 text-white" />
                             </div>
                           </>
                         ) : (
                           <Upload className="h-6 w-6 text-slate-300" />
                         )}
                       </div>
                       <input type="file" ref={heroBgInputRef} className="hidden" accept="image/*" onChange={(e) => handleFiles(e.target.files, 'Hero Background')} />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-slate-900">Photo Gallery</h3>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold uppercase text-blue-600 hover:bg-blue-50" onClick={() => fileInputRef.current?.click()}>
                       <Upload className="h-3 w-3 mr-1" /> Add Images
                    </Button>
                  </div>

                  <div 
                    className={`border-2 border-dashed ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50/50'} rounded-xl p-4 flex flex-col items-center justify-center text-center mb-4 transition-all`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                     <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Drag and drop gallery photos here</p>
                     <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileUpload} />
                  </div>

                  <div className="space-y-3">
                    {images.filter(img => img.target === 'Photo Gallery').map((image, idx, arr) => {
                      const globalIdx = images.findIndex(i => i.id === image.id);
                      return (
                        <div key={image.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm group">
                          <div className="flex gap-3">
                             <div className="h-16 w-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                <img src={image.url} alt={image.name} className="h-full w-full object-cover" />
                             </div>
                             <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                   <p className="text-[10px] font-bold text-slate-400 uppercase truncate">{image.name}</p>
                                   <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400" onClick={() => moveImage(globalIdx, 'up')} disabled={idx === 0}>
                                        <ChevronUp className="h-3 w-3" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400" onClick={() => moveImage(globalIdx, 'down')} disabled={idx === arr.length - 1}>
                                        <ChevronDown className="h-3 w-3" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-500" onClick={() => setImages(prev => prev.filter(i => i.id !== image.id))}>
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                   </div>
                                </div>
                                <Input 
                                  placeholder="Add image caption..." 
                                  className="h-7 text-[11px] px-2 bg-slate-50 border-none shadow-none focus-visible:ring-1" 
                                  value={image.caption || ""}
                                  onChange={(e) => setImages(images.map(img => img.id === image.id ? { ...img, caption: e.target.value } : img))}
                                />
                             </div>
                          </div>
                        </div>
                      );
                    })}
                    {images.filter(img => img.target === 'Photo Gallery').length === 0 && (
                      <div className="text-center py-8">
                         <ImageIcon className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                         <p className="text-xs text-slate-400">Your gallery is empty</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                   <h3 className="text-sm font-semibold text-slate-900 mb-3">Other Site Assets</h3>
                   <div className="space-y-2">
                      {images.filter(img => img.target !== 'Photo Gallery' && img.target !== 'School Logo' && img.target !== 'Hero Background').map(image => (
                         <div key={image.id} className="flex items-center gap-3 p-2 border border-slate-100 rounded-lg">
                            <img src={image.url} className="h-8 w-8 rounded object-cover" alt="asset" />
                            <p className="text-[10px] font-medium text-slate-600 flex-1 truncate">{image.name}</p>
                            <select 
                               className="text-[10px] border-none bg-transparent font-bold text-blue-600"
                               value={image.target}
                               onChange={(e) => setImages(images.map(img => img.id === image.id ? { ...img, target: e.target.value } : img))}
                            >
                               <option value="Photo Gallery">Move to Gallery</option>
                               <option value="Programs Section">Programs Section</option>
                               <option value="Other">Other</option>
                            </select>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-slate-400 hover:text-red-500" 
                              onClick={() => setImages(prev => prev.filter(i => i.id !== image.id))}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                         </div>
                      ))}
                   </div>
                </div>
              </div>
            )}
            
            {activeTab === 'news' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">News & Blog</h3>
                  <div className="flex gap-2 mb-4">
                    <Input 
                      placeholder="Article Title" 
                      className="text-sm flex-1" 
                      value={newNewsTitle}
                      onChange={(e) => setNewNewsTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newNewsTitle) {
                          setNewsItems([...newsItems, { id: Date.now(), title: newNewsTitle, date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) }]);
                          setNewNewsTitle("");
                        }
                      }}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => {
                        if (newNewsTitle) {
                          setNewsItems([...newsItems, { id: Date.now(), title: newNewsTitle, date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) }]);
                          setNewNewsTitle("");
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {newsItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-3 border border-slate-200 rounded-lg bg-white">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.date}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-slate-400 hover:text-red-600"
                          onClick={() => setNewsItems(newsItems.filter(n => n.id !== item.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Public Contact Details</h3>
                  <p className="text-xs text-slate-500 mb-4">These details will be shown on your school's public website contact section.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Contact Email</label>
                      <Input 
                        placeholder="admissions@school.com" 
                        value={contactEmail} 
                        onChange={(e) => setContactEmail(e.target.value)} 
                        className="text-sm" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Contact Phone</label>
                      <Input 
                        placeholder="+268 7600 0000" 
                        value={contactPhone} 
                        onChange={(e) => setContactPhone(e.target.value)} 
                        className="text-sm" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Physical Address</label>
                      <textarea 
                        className="w-full rounded-md border border-slate-200 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" 
                        rows={2} 
                        placeholder="Plot 123, Ezulwini"
                        value={contactAddress}
                        onChange={(e) => setContactAddress(e.target.value)}
                      ></textarea>
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Operating Hours</label>
                      <Input 
                        placeholder="Mon-Fri: 8am - 3pm" 
                        value={operatingHours} 
                        onChange={(e) => setOperatingHours(e.target.value)} 
                        className="text-sm" 
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Welcome message</label>
                      <textarea 
                        className="w-full rounded-md border border-slate-200 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" 
                        rows={3} 
                        placeholder="Welcome message for potential parents..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Domain Connection</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Custom Domain</label>
                      <div className="flex gap-2">
                        <Input placeholder="e.g. www.littlestars.sz" value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} className="text-sm" />
                        <Button size="sm">Connect</Button>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Point your domain's A record to our servers.</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">SEO Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Meta Title</label>
                      <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">Meta Description</label>
                      <textarea className="w-full rounded-md border border-slate-200 p-2 text-sm" rows={3} placeholder="Brief description for search engines..."></textarea>
                    </div>
                    <Button variant="secondary" className="w-full text-xs h-8">
                       ✨ Generate with AI
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="flex-1 flex flex-col bg-slate-200/50 p-6">
          <div className="flex justify-center mb-4 gap-2">
            <Button 
              variant={previewMode === 'desktop' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setPreviewMode('desktop')}
              className={previewMode === 'desktop' ? 'shadow-sm' : 'bg-white'}
            >
              <Monitor className="h-4 w-4 mr-2" /> Desktop
            </Button>
            <Button 
              variant={previewMode === 'mobile' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setPreviewMode('mobile')}
              className={previewMode === 'mobile' ? 'shadow-sm' : 'bg-white'}
            >
              <Smartphone className="h-4 w-4 mr-2" /> Mobile
            </Button>
          </div>

          <div className={`flex-1 mx-auto bg-white border border-slate-200 shadow-xl rounded-t-xl overflow-hidden transition-all duration-300 ease-in-out w-full ${
            previewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-4xl'
          }`}>
            {/* Fake browser header */}
            <div className="h-10 bg-slate-100 flex items-center px-4 gap-2 border-b border-slate-200">
              <div className="h-3 w-3 rounded-full bg-slate-300"></div>
              <div className="h-3 w-3 rounded-full bg-slate-300"></div>
              <div className="h-3 w-3 rounded-full bg-slate-300"></div>
              <div className="mx-4 flex-1 h-6 bg-white rounded-md border border-slate-200 flex items-center px-3">
                <span className="text-[10px] text-slate-400">littlestars.preschoolseswatini.com</span>
              </div>
            </div>
            
            {/* Preview Content */}
            <div className="h-full overflow-y-auto no-scrollbar pointer-events-none" style={{ fontFamily }}>
              <div className="relative min-h-[16rem] bg-slate-900 group flex flex-col justify-center">
                {images.find(i => i.target === 'Hero Background') ? (
                  <img src={images.find(i => i.target === 'Hero Background')?.url} className="absolute inset-0 h-full w-full object-cover opacity-60" alt="hero" />
                ) : (
                  <div className="absolute inset-0 bg-slate-800 opacity-60"></div>
                )}
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-6">
                  {images.find(i => i.target === 'School Logo') ? (
                  <img src={images.find(i => i.target === 'School Logo')?.url} alt="Logo" className="w-16 h-16 rounded mb-4 object-contain bg-white p-1" />
                ) : null}
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ color: primaryColor }}>{headline}</h1>
                  <p className="text-lg text-slate-200 max-w-lg">{subheadline}</p>
                </div>
                {/* Overlay edit dashed lines */}
                <div className="absolute inset-0 border-2 border-dashed border-blue-500/50 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-sm">
                     Edit Hero Section
                   </div>
                </div>
              </div>
                            <div className="p-8 pb-32">
                 <h2 className="text-2xl font-bold text-center mb-6" style={{ color: primaryColor }}>
                   {selectedTemplate.includes("Christian") ? "Our Ministries & Programs" : "Our Programs"}
                 </h2>
                 <div className="grid grid-cols-2 gap-4">
                   <div className={`h-40 ${selectedTemplate === "Budget Preschool" ? "bg-white border-2 border-slate-200" : "bg-slate-100"} rounded-lg border border-slate-200 flex flex-col items-center justify-center font-medium shadow-sm overflow-hidden relative`} style={{ color: secondaryColor }}>
                     {images.filter(i => i.target === 'Programs Section')[0] ? (
                       <img src={images.filter(i => i.target === 'Programs Section')[0].url} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Program" />
                     ) : null}
                     <span className="relative z-10 bg-white/80 px-2 py-1 rounded text-sm">Program 1</span>
                   </div>
                   <div className={`h-40 ${selectedTemplate === "Budget Preschool" ? "bg-white border-2 border-slate-200" : "bg-slate-100"} rounded-lg border border-slate-200 flex flex-col items-center justify-center font-medium shadow-sm overflow-hidden relative`} style={{ color: secondaryColor }}>
                    {images.filter(i => i.target === 'Programs Section')[1] ? (
                       <img src={images.filter(i => i.target === 'Programs Section')[1].url} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Program" />
                     ) : null}
                     <span className="relative z-10 bg-white/80 px-2 py-1 rounded text-sm">Program 2</span>
                   </div>
                 </div>
                 
                 {images.filter(i => i.target === 'Photo Gallery').length > 0 && (
                   <div className="mt-12">
                     <h2 className="text-2xl font-bold text-center mb-6" style={{ color: primaryColor }}>Photo Gallery</h2>
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                       {images.filter(i => i.target === 'Photo Gallery').map(img => (
                         <div key={img.id} className={`aspect-square shadow-sm overflow-hidden border border-slate-200 relative group ${selectedTemplate === "Modern Kindergarten" ? "rounded-3xl" : "rounded"}`}>
                           <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                            {img.caption && (
                              <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-white text-[10px] leading-tight">
                                {img.caption}
                              </div>
                            )}
                         </div>
                       ))}
                     </div>
                   </div>
                 )}

                 {newsItems.length > 0 && (
                   <div className="mt-12 bg-slate-50 -mx-8 px-8 py-8 border-t border-slate-200">
                     <h2 className="text-2xl font-bold text-center mb-6" style={{ color: primaryColor }}>Latest News</h2>
                     <div className="space-y-4 max-w-lg mx-auto">
                        {newsItems.map(item => (
                          <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                             <p className="text-xs text-slate-500 mb-1">{item.date}</p>
                             <h4 className="font-semibold text-slate-900">{item.title}</h4>
                          </div>
                        ))}
                     </div>
                   </div>
                 )}

                  <div className="mt-12 border-t border-slate-200 pt-12 text-center overflow-hidden">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>Contact Us</h2>
                    <p className="text-slate-600 mb-8 max-w-md mx-auto text-sm">{contactMessage}</p>
                    <div className="grid grid-cols-1 gap-4 max-w-xs mx-auto">
                      <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center gap-3 text-left">
                        <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                        <p className="text-[10px] font-medium text-slate-900 truncate">{contactEmail || 'Email Address'}</p>
                      </div>
                      <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center gap-3 text-left">
                        <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                        <p className="text-[10px] font-medium text-slate-900 truncate">{contactPhone || 'Phone Number'}</p>
                      </div>
                      <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center gap-3 text-left">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                        <p className="text-[10px] font-medium text-slate-900 truncate">{contactAddress || 'Physical Address'}</p>
                      </div>
                      <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center gap-3 text-left">
                        <Settings className="h-4 w-4 text-slate-400 shrink-0" />
                        <p className="text-[10px] font-medium text-slate-900 truncate">{operatingHours || 'Operating Hours'}</p>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

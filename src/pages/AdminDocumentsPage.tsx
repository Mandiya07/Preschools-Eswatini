import { useState, useEffect, useRef } from "react";
import { 
  FileText, Folder, Archive, PenTool, ClipboardList, 
  Users, Award, Database, Upload, Download, Search, Plus, Sparkles, Printer, GraduationCap, DollarSign, FileSignature, Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/lib/AuthContext";
import { subscribeToCollection, createDocument } from "@/lib/firestoreUtils";
import { where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { toast } from "sonner";

const TEMPLATES = [
  { id: "t1", title: "Student Certificate", icon: Award, desc: "Auto-generate graduation & achievement certificates." },
  { id: "t2", title: "Report Card", icon: GraduationCap, desc: "Generate end-of-term academic report cards." },
  { id: "t3", title: "Admission Letter", icon: FileText, desc: "Create standardized admission offer letters." },
  { id: "t4", title: "Payment Receipt", icon: DollarSign, desc: "Generate official receipts for tuition and fees." },
  { id: "t5", title: "Staff Contract", icon: FileSignature, desc: "Generate employment contracts for new hires." },
  { id: "t6", title: "Staff Document", icon: Users, desc: "Create standardized performance reviews and letters." }
];

export function AdminDocumentsPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user?.schoolId) return;
    const unsub = subscribeToCollection("school_documents", (data) => {
      setDocuments(data);
      setLoading(false);
    }, where("schoolId", "==", user.schoolId));
    return () => unsub();
  }, [user?.schoolId]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file || !user?.schoolId) return;
    
    try {
      toast.loading("Uploading document...", { id: "doc-upload" });
      const fileRef = ref(storage, `schools/${user.schoolId}/documents/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      
      await createDocument("school_documents", undefined, {
        schoolId: user.schoolId,
        name: file.name,
        url,
        type: file.type.includes('pdf') ? 'pdf' : 'document',
        category: 'General',
        size: file.size,
      });

      toast.success("Document uploaded!", { id: "doc-upload" });
    } catch(err) {
      console.error(err);
      toast.error("Upload failed.", { id: "doc-upload" });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <SEO title="Document Management | Preschools Eswatini" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Document Management</h1>
          <p className="text-slate-500 text-lg">Centralized cloud storage and smart document generation.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100">
             <Sparkles className="mr-2 h-4 w-4" /> AI Document Assistant
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl" onClick={() => fileInputRef.current?.click()}>
             <Upload className="mr-2 h-4 w-4" /> Upload Document
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 border-none shadow-sm p-6 bg-slate-900 text-white rounded-3xl">
           <CardTitle className="mb-4">System Health</CardTitle>
           <div className="space-y-4">
               <div className="flex justify-between text-sm"><span>Storage Used</span> <span className="font-bold">78%</span></div>
               <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden"><div className="h-full w-[78%] bg-blue-500" /></div>
               <Button className="w-full mt-4 bg-white text-slate-900 hover:bg-slate-100 rounded-xl flex items-center gap-2">
                   <Database className="h-4 w-4" /> Run Backup Now
               </Button>
           </div>
        </Card>

        <div className="md:col-span-3">
          <Tabs defaultValue="generator" className="space-y-6">
            <TabsList>
              <TabsTrigger value="generator" className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" /> Smart Generators</TabsTrigger>
              <TabsTrigger value="storage">All Docs</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>

            <TabsContent value="generator">
               <Card className="border-none shadow-sm p-6 rounded-3xl">
                  <div className="mb-6">
                     <h3 className="text-xl font-bold text-slate-900">Smart Document Generation</h3>
                     <p className="text-slate-500">Select a template to automatically generate populated documents from student and staff records.</p>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     {TEMPLATES.map(temp => (
                        <div key={temp.id} className="border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white group">
                           <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <temp.icon className="h-5 w-5" />
                           </div>
                           <h4 className="font-bold text-slate-900 mb-1">{temp.title}</h4>
                           <p className="text-xs text-slate-500 mb-4">{temp.desc}</p>
                           <Button variant="outline" size="sm" className="w-full text-xs font-semibold rounded-lg bg-slate-50 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                             Generate Document
                           </Button>
                        </div>
                     ))}
                  </div>
               </Card>
            </TabsContent>

            <TabsContent value="storage">
              <Card className="border-none shadow-sm p-6 rounded-3xl">
                <div className="flex items-center gap-4 mb-6">
                    <Search className="h-5 w-5 text-slate-400" />
                    <Input placeholder="Search documents..." className="max-w-md rounded-xl" />
                </div>
                <div className="border rounded-2xl overflow-hidden">
                    {loading ? (
                      <div className="flex h-32 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600"/></div>
                    ) : documents.length > 0 ? documents.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-slate-50">
                            <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                                <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-slate-900 truncate">{doc.name}</h4>
                                <p className="text-xs text-slate-500">{doc.category}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600" asChild>
                                    <a href={doc.url} target="_blank" rel="noreferrer"><Download className="h-4 w-4" /></a>
                                </Button>
                            </div>
                        </div>
                    )) : (
                        <div className="p-8 text-center text-slate-500">No documents found. Upload one to get started.</div>
                    )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

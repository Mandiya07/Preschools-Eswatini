import { useState } from "react";
import { 
  FileText, Folder, Archive, PenTool, ClipboardList, 
  Users, Award, Database, Upload, Download, Search, Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEO } from "@/components/SEO";

const DOCUMENTS = [
  { id: "1", name: "Admission_Form_2026.pdf", type: "form", category: "Admission" },
  { id: "2", name: "Staff_Contract_Smith.docx", type: "document", category: "Staff" },
  { id: "3", name: "Student_Report_Card_John.pdf", type: "document", category: "Student" },
  { id: "4", name: "Certificate_Excellence_2025.pdf", type: "certificate", category: "Certificate" },
];

export function AdminDocumentsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <SEO title="Document Management | Sikolo" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Document Management</h1>
          <p className="text-slate-500 text-lg">Centralized cloud storage for school records and assets.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl">
           <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Button>
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
          <Tabs defaultValue="storage" className="space-y-6">
            <TabsList>
              <TabsTrigger value="storage">All Docs</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="forms">Forms & Certificates</TabsTrigger>
            </TabsList>

            <TabsContent value="storage">
              <Card className="border-none shadow-sm p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Search className="h-5 w-5 text-slate-400" />
                    <Input placeholder="Search documents..." className="max-w-md rounded-xl" />
                </div>
                <div className="border rounded-2xl">
                    {DOCUMENTS.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-slate-50">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <div>
                                <h4 className="font-bold">{doc.name}</h4>
                                <p className="text-xs text-slate-500">{doc.category}</p>
                            </div>
                            <div className="ml-auto flex gap-2">
                                <Button variant="ghost" size="sm"><PenTool className="h-4 w-4 mr-2" /> Sign</Button>
                                <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

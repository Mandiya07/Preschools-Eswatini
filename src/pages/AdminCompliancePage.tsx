import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShieldCheck, FileText, CheckCircle2, AlertTriangle, 
  Download, Building, FileSignature, GraduationCap
} from "lucide-react";
import { SEO } from "@/components/SEO";

export function AdminCompliancePage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <SEO title="Ministry Compliance | Sikolo Admin" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Ministry & Compliance</h1>
          <p className="text-sm text-slate-500 mt-1">Manage ECCDE requirements, licensing, inspections, and teacher qualifications.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white">
            <Download className="mr-2 h-4 w-4" /> Export Govt Report
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <FileSignature className="mr-2 h-4 w-4" /> Upload Document
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Ministry Status</p>
              <h3 className="text-xl font-bold text-slate-900">Registered</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">ECCDE Checks</p>
              <h3 className="text-xl font-bold text-slate-900">92% Pass</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Action Needed</p>
              <h3 className="text-xl font-bold text-slate-900">2 Items</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Qualified Staff</p>
              <h3 className="text-xl font-bold text-slate-900">100%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full mt-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] h-12 bg-slate-100 rounded-xl p-1 mb-8">
          <TabsTrigger value="overview" className="rounded-lg font-bold data-[state=active]:shadow-sm">Overview</TabsTrigger>
          <TabsTrigger value="inspections" className="rounded-lg font-bold data-[state=active]:shadow-sm">Inspections</TabsTrigger>
          <TabsTrigger value="staff" className="rounded-lg font-bold data-[state=active]:shadow-sm">Staff Quals.</TabsTrigger>
          <TabsTrigger value="forms" className="rounded-lg font-bold data-[state=active]:shadow-sm">Gov Forms</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
           <Card className="rounded-[2rem] border-slate-200">
              <CardHeader className="border-b border-slate-100 pb-4">
                 <CardTitle>Mandatory Compliance Documents</CardTitle>
                 <CardDescription>Keep your licenses and health/safety certificates up to date.</CardDescription>
              </CardHeader>
              <div className="p-4 overflow-x-auto">
                 <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 rounded-xl">
                       <tr>
                          <th className="px-6 py-4 font-medium rounded-l-xl">Document Name</th>
                          <th className="px-6 py-4 font-medium">Category</th>
                          <th className="px-6 py-4 font-medium">Expiry Date</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                          <th className="px-6 py-4 font-medium rounded-r-xl">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {[
                         { name: "ECCDE Operating License", category: "License", expiry: "2027-01-15", status: "Valid" },
                         { name: "Fire Safety Certificate", category: "Health/Safety", expiry: "2026-06-30", status: "Expiring Soon" },
                         { name: "Public Health Permit", category: "Health/Safety", expiry: "2026-07-22", status: "Valid" },
                         { name: "Building Inspection Report", category: "Inspection", expiry: "2025-12-01", status: "Expired" }
                       ].map((doc, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                             <td className="px-6 py-4 font-medium text-slate-900">{doc.name}</td>
                             <td className="px-6 py-4">{doc.category}</td>
                             <td className="px-6 py-4">{doc.expiry}</td>
                             <td className="px-6 py-4">
                                <Badge variant="outline" className={
                                  doc.status === "Valid" ? "bg-green-50 text-green-700 border-green-200" :
                                  doc.status === "Expiring Soon" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                  "bg-red-50 text-red-700 border-red-200"
                                }>{doc.status}</Badge>
                             </td>
                             <td className="px-6 py-4 text-xs">
                               <Button variant="ghost" size="sm" className="text-blue-600">Update</Button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
           <Card className="rounded-[2rem] border-slate-200 p-8 text-center bg-slate-50 flex flex-col items-center justify-center">
              <GraduationCap className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-2">Teacher Qualifications Database</h3>
              <p className="text-slate-500 max-w-sm mb-6">Ensure all staff meet the Ministry's ECCDE certification requirements. Store digital copies of diplomas, background checks, and first-aid certifications.</p>
              <Button variant="outline" className="bg-white shadow-sm">Manage Staff Records</Button>
           </Card>
        </TabsContent>

        <TabsContent value="forms" className="space-y-6">
           <Card className="rounded-[2rem] border-slate-200 p-8 text-center bg-slate-50 flex flex-col items-center justify-center">
              <FileText className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-2">Standardized ECCDE Forms</h3>
              <p className="text-slate-500 max-w-sm mb-6">Quickly access and generate official Ministry-approved forms for enrollment, health tracking, and incident reporting.</p>
              <Button variant="outline" className="bg-white shadow-sm">View Template Library</Button>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

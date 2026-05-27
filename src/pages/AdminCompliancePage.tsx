import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShieldCheck, FileText, CheckCircle2, AlertTriangle, 
  Download, Building, FileSignature, GraduationCap
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/lib/AuthContext";
import { subscribeToCollection } from "@/lib/firestoreUtils";
import { where } from "firebase/firestore";

export function AdminCompliancePage() {
  const { user, activeSchoolId } = useAuth();
  const effectiveSchoolId = user?.role === 'SuperAdmin' ? activeSchoolId : user?.schoolId;
  const [activeTab, setActiveTab] = useState("overview");
  const [complianceDocs, setComplianceDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!effectiveSchoolId) return;

    const unsubDocs = subscribeToCollection(
      'compliance_documents',
      (data) => {
        setComplianceDocs(data);
        setLoading(false);
      },
      where('schoolId', '==', effectiveSchoolId)
    );

    return () => unsubDocs();
  }, [effectiveSchoolId]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <SEO title="Ministry Compliance | Preschools Eswatini Admin" />
      
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
              <h3 className="text-xl font-bold text-slate-900">{complianceDocs.some((d: any) => d.type === 'Licence' && d.status === 'Active') ? 'Registered' : 'Pending'}</h3>
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
              <h3 className="text-xl font-bold text-slate-900">N/A</h3>
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
              <h3 className="text-xl font-bold text-slate-900">{complianceDocs.filter((d: any) => d.status === 'Expired').length} Items</h3>
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
              <h3 className="text-xl font-bold text-slate-900">Reviewing</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full mt-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 lg:w-[800px] h-12 bg-slate-100 rounded-xl p-1 mb-8">
          <TabsTrigger value="overview" className="rounded-lg font-bold data-[state=active]:shadow-sm">Overview</TabsTrigger>
          <TabsTrigger value="accreditation" className="rounded-lg font-bold data-[state=active]:shadow-sm">Accreditation</TabsTrigger>
          <TabsTrigger value="inspections" className="rounded-lg font-bold data-[state=active]:shadow-sm">Inspections</TabsTrigger>
          <TabsTrigger value="staff" className="rounded-lg font-bold data-[state=active]:shadow-sm">Staff Quals.</TabsTrigger>
          <TabsTrigger value="forms" className="rounded-lg font-bold data-[state=active]:shadow-sm">Gov Forms</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
           {/* Renewal Reminders */}
           <Card className="rounded-[2rem] border-rose-200 bg-rose-50 shadow-sm overflow-hidden mb-6">
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div className="flex items-start gap-4">
                    <div className="p-3 bg-rose-100 rounded-xl text-rose-600 shrink-0">
                       <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                       <h3 className="text-lg font-bold text-rose-900 mb-1">Action Required</h3>
                       <p className="text-rose-700 text-sm">Your Fire Safety Certificate expires in 2 weeks. Please arrange for a renewal inspection and upload the new certificate.</p>
                    </div>
                 </div>
                 <Button className="bg-rose-600 hover:bg-rose-700 w-full md:w-auto shrink-0 shadow-lg shadow-rose-200/50 rounded-xl">
                    Renew Certificate
                 </Button>
              </div>
           </Card>

           <Card className="rounded-[2rem] border-slate-200 shadow-sm overflow-hidden">

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

        <TabsContent value="accreditation" className="space-y-6">
           <Card className="rounded-[2rem] border-slate-200 shadow-sm overflow-hidden">
               <div className="bg-slate-900 border-b border-slate-800 p-8 text-white relative overflow-hidden">
                   <div className="absolute inset-0 bg-blue-600/20 mix-blend-overlay"></div>
                   <div className="relative z-10 flex flex-col items-center text-center">
                       <ShieldCheck className="h-16 w-16 text-blue-400 mb-4" />
                       <h3 className="text-2xl font-bold mb-2">National ECCDE Accreditation Tracker</h3>
                       <p className="text-slate-300 max-w-xl mx-auto mb-6">Manage your school's accreditation status with the Ministry of Education. Track progress towards higher accreditation tiers.</p>
                       <div className="inline-flex items-center rounded-full bg-emerald-500/20 px-4 py-2 font-bold text-emerald-300 border border-emerald-500/30">
                           <CheckCircle2 className="h-5 w-5 mr-2" /> Current Status: Provisional Accreditation
                       </div>
                   </div>
               </div>
               <div className="p-8">
                   <h4 className="text-lg font-bold text-slate-900 mb-6">Accreditation Roadmap - Tier 1 (Full)</h4>
                   <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                       
                       <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-100 text-emerald-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                             <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col">
                             <h4 className="font-bold text-slate-900">Initial Registration</h4>
                             <p className="text-sm text-slate-500 mt-1">Submitted basic details & facility layout.</p>
                             <span className="text-xs font-semibold text-emerald-600 mt-3">Completed Jan 2024</span>
                          </div>
                       </div>

                       <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-100 text-emerald-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                             <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col">
                             <h4 className="font-bold text-slate-900">Health & Safety Clearance</h4>
                             <p className="text-sm text-slate-500 mt-1">Passed municipal fire and sanitation inspections.</p>
                             <span className="text-xs font-semibold text-emerald-600 mt-3">Completed Mar 2024</span>
                          </div>
                       </div>

                       <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-100 text-blue-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                             <div className="h-3 w-3 bg-blue-600 rounded-full animate-pulse" />
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border-2 border-blue-200 bg-blue-50/50 shadow-sm flex flex-col">
                             <h4 className="font-bold text-blue-900 flex items-center justify-between">Curriculum Review <Badge className="bg-blue-600">Current Step</Badge></h4>
                             <p className="text-sm text-blue-700/80 mt-1">Ministry panel is reviewing submitted academic frameworks.</p>
                             <Button size="sm" className="mt-4 bg-blue-600 hover:bg-blue-700 self-start">Submit Missing Files</Button>
                          </div>
                       </div>

                       <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                             <div className="h-2 w-2 bg-slate-400 rounded-full" />
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col opacity-70">
                             <h4 className="font-bold text-slate-700">Final On-Site Inspection</h4>
                             <p className="text-sm text-slate-500 mt-1">Comprehensive facility and instructional assessment.</p>
                          </div>
                       </div>

                   </div>
               </div>
           </Card>
        </TabsContent>

        <TabsContent value="inspections" className="space-y-6">
           <Card className="rounded-[2rem] border-slate-200 shadow-sm overflow-hidden">
               <CardHeader className="border-b border-slate-100 bg-white pb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                     <div>
                        <CardTitle className="text-xl">Inspection Reports & Audits</CardTitle>
                        <CardDescription>Records of past inspections and scheduled upcoming visits.</CardDescription>
                     </div>
                     <Button className="bg-slate-900 hover:bg-slate-800 rounded-xl">Request Voluntary Audit</Button>
                  </div>
               </CardHeader>
               <div className="p-6 grid sm:grid-cols-2 gap-6 bg-slate-50/50">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                     <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                           <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">Passed</Badge>
                     </div>
                     <h4 className="font-bold text-slate-900">Annual Health & Safety</h4>
                     <p className="text-xs text-slate-500 mb-4">Conducted on Oct 12, 2025</p>
                     <div className="space-y-2 text-sm text-slate-600 mb-4">
                        <div className="flex justify-between"><span>Score</span> <span className="font-bold text-slate-900">96/100</span></div>
                        <div className="flex justify-between"><span>Inspector</span> <span>M. Dlamini</span></div>
                     </div>
                     <Button variant="outline" className="w-full text-xs font-semibold rounded-lg">Download Report</Button>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-2 h-full bg-amber-400"></div>
                     <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                           <AlertTriangle className="h-5 w-5" />
                        </div>
                        <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">Upcoming</Badge>
                     </div>
                     <h4 className="font-bold text-slate-900">Curriculum Audit</h4>
                     <p className="text-xs text-slate-500 mb-4">Scheduled for Jun 15, 2026</p>
                     <div className="space-y-2 text-sm text-slate-600 mb-4">
                        <div className="flex justify-between"><span>Type</span> <span>On-site Assessment</span></div>
                        <div className="flex justify-between"><span>Prep Req.</span> <span className="text-amber-600 font-medium">Syllabi Upload</span></div>
                     </div>
                     <Button className="w-full text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-sm">Complete Pre-Audit Form</Button>
                  </div>
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

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Download, 
  Loader2, 
  Mail, 
  Phone, 
  Clock, 
  Calendar,
  MoreVertical,
  Inbox,
  ClipboardList,
  UserPlus,
  AlertCircle,
  Sparkles,
  Wand2
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { subscribeToCollection, updateDocument, createDocument } from "@/lib/firestoreUtils";
import { where } from "firebase/firestore";
import { Inquiry, Application, ApplicationStatus } from "@/types";
import { generateAIContent } from "@/services/geminiService";

export function AdminAdmissionsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"inquiries" | "applications">("applications");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Selection/Detail state
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [aiReview, setAiReview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setAiReview(null);
  }, [selectedAppId]);

  const handleAiReview = async (app: Application) => {
    setIsAnalyzing(true);
    const prompt = `Please analyze this preschool application and provide a brief professional summary and recommendation for the admin.
    Child Name: ${app.childName}
    Parent: ${app.parentName}
    Grade: ${app.gradeApplyingFor}
    Status: ${app.status}
    Any notes mentioned: ${app.notes || "None"}
    Medical info: ${app.medicalInfo || "None"}
    Documents uploaded: ${app.documents?.map(d => d.name).join(", ") || "None"}`;

    const response = await generateAIContent(prompt, 'admissions');
    setAiReview(response.text);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    if (!user?.schoolId) return;

    const unsubInquiries = subscribeToCollection(
      'inquiries',
      (data) => setInquiries(data as Inquiry[]),
      where('schoolId', '==', user.schoolId)
    );

    const unsubApplications = subscribeToCollection(
      'applications',
      (data) => {
        setApplications(data as Application[]);
        setLoading(false);
      },
      where('schoolId', '==', user.schoolId)
    );

    return () => {
      unsubInquiries();
      unsubApplications();
    };
  }, [user]);

  const handleUpdateStatus = async (id: string, status: ApplicationStatus | string, collection: "inquiries" | "applications") => {
    setIsUpdating(true);
    try {
      await updateDocument(collection, id, { 
        status,
        updatedAt: new Date().toISOString()
      });

      // If it's an application status change, notify the parent
      if (collection === "applications") {
        const app = applications.find(a => a.id === id);
        if (app) {
          await createDocument("notifications", null, {
            userId: app.parentId,
            schoolId: user?.schoolId,
            title: "Application Status Updated",
            message: `Your application for ${app.childName} has been updated to: ${status.replace('_', ' ')}.`,
            type: "admission_update",
            read: false,
            createdAt: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleScheduleInterview = async (id: string, date: string) => {
    setIsUpdating(true);
    try {
      await updateDocument("applications", id, { 
        interviewDate: date,
        status: "interview_scheduled",
        updatedAt: new Date().toISOString()
      });

      const app = applications.find(a => a.id === id);
      if (app) {
        await createDocument("notifications", null, {
          userId: app.parentId,
          schoolId: user?.schoolId,
          title: "Interview Scheduled",
          message: `An interview for ${app.childName} has been scheduled for ${new Date(date).toLocaleString()}.`,
          type: "admission_update",
          read: false,
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
       console.error("Schedule error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredInquiries = inquiries.filter(q => 
    q.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.parentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredApps = applications.filter(a => 
    a.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.parentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset";
    switch (status) {
      case "submitted": return `${base} bg-blue-50 text-blue-700 ring-blue-700/10`;
      case "under_review": return `${base} bg-purple-50 text-purple-700 ring-purple-700/10`;
      case "interview_scheduled": return `${base} bg-amber-50 text-amber-700 ring-amber-700/10`;
      case "accepted": return `${base} bg-green-50 text-green-700 ring-green-700/10`;
      case "rejected": return `${base} bg-red-50 text-red-700 ring-red-700/10`;
      case "waitlisted": return `${base} bg-slate-50 text-slate-700 ring-slate-700/10`;
      case "enrolled": return `${base} bg-indigo-50 text-indigo-700 ring-indigo-700/10`;
      case "pending": return `${base} bg-amber-50 text-amber-700 ring-amber-700/10`;
      case "responded": return `${base} bg-green-50 text-green-700 ring-green-700/10`;
      case "closed": return `${base} bg-slate-50 text-slate-700 ring-slate-700/10`;
      default: return `${base} bg-slate-50 text-slate-700 ring-slate-700/10`;
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const selectedApp = applications.find(a => a.id === selectedAppId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admissions Workflow</h1>
          <p className="text-sm text-slate-500 mt-1">Manage the full pipeline from initial inquiry to enrollment.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="bg-white">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
           {/* Tabs and Search */}
           <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center shadow-sm">
              <button 
                onClick={() => setActiveTab("applications")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'applications' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ClipboardList className="h-4 w-4" />
                Applications
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === 'applications' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {applications.length}
                </span>
              </button>
              <button 
                onClick={() => setActiveTab("inquiries")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'inquiries' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Inbox className="h-4 w-4" />
                Leads/Inquiries
                 <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === 'inquiries' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {inquiries.length}
                </span>
              </button>
              <div className="ml-auto pr-2 relative hidden sm:block">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                 <Input 
                   placeholder="Search..." 
                   className="pl-9 h-9 w-48 border-none bg-transparent focus-visible:ring-0" 
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                 />
              </div>
           </div>

           {/* Main List */}
           <Card className="border-slate-200 overflow-hidden">
             <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                     <tr>
                        <th className="px-6 py-3 whitespace-nowrap">Applicant</th>
                        <th className="px-6 py-3 whitespace-nowrap">Contact</th>
                        <th className="px-6 py-3 whitespace-nowrap">Status</th>
                        <th className="px-6 py-3 whitespace-nowrap">Date</th>
                        <th className="px-6 py-3 whitespace-nowrap"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {activeTab === 'applications' ? (
                       filteredApps.map(app => (
                        <tr 
                          key={app.id} 
                          className={`hover:bg-blue-50/30 transition-colors cursor-pointer ${selectedAppId === app.id ? 'bg-blue-50' : ''}`}
                          onClick={() => setSelectedAppId(app.id)}
                        >
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900">{app.childName}</div>
                            <div className="text-[10px] text-slate-500">For {app.gradeApplyingFor}</div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="text-slate-700 font-medium">{app.parentName}</div>
                             <div className="text-[10px] text-slate-400">{app.parentEmail}</div>
                          </td>
                          <td className="px-6 py-4">
                             <span className={getStatusBadge(app.status)}>
                               {app.status.replace('_', ' ')}
                             </span>
                             {app.interviewDate && (
                               <div className="mt-1 flex items-center text-[10px] text-amber-600 font-semibold">
                                 <Calendar className="h-2.5 w-2.5 mr-1" />
                                 Interview: {new Date(app.interviewDate).toLocaleDateString()}
                               </div>
                             )}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                             <MoreVertical className="h-4 w-4 text-slate-400 ml-auto" />
                          </td>
                        </tr>
                       ))
                     ) : (
                        filteredInquiries.map(q => (
                          <tr key={q.id} className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-900">{q.childName}</div>
                              <div className="text-[10px] text-slate-500">Age: {q.childAge}</div>
                            </td>
                            <td className="px-6 py-4">
                               <div className="text-slate-700 font-medium">{q.parentName}</div>
                               <div className="text-[10px] text-slate-400">{q.parentEmail}</div>
                            </td>
                            <td className="px-6 py-4">
                               <span className={getStatusBadge(q.status)}>
                                 {q.status}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500">
                              {new Date(q.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                               <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 text-xs text-blue-600"
                                onClick={() => handleUpdateStatus(q.id, 'responded', 'inquiries')}
                                disabled={isUpdating}
                               >
                                 Mark Responded
                               </Button>
                            </td>
                          </tr>
                        ))
                     )}
                     {(activeTab === 'applications' ? filteredApps : filteredInquiries).length === 0 && (
                       <tr>
                         <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                            No records found.
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
             </CardContent>
           </Card>
        </div>

        {/* Sidebar Detail / Actions */}
        <div className="w-full lg:w-96 space-y-6">
           {selectedApp ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                 <Card className="border-blue-100 shadow-lg shadow-blue-500/5">
                    <CardHeader className="pb-4">
                       <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Application Detail</CardTitle>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedAppId(null)}>
                             <XCircle className="h-4 w-4" />
                          </Button>
                       </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl font-bold text-blue-600">
                             {selectedApp.childName.charAt(0)}
                          </div>
                          <div>
                             <h3 className="font-bold text-slate-900 text-lg leading-tight">{selectedApp.childName}</h3>
                             <p className="text-sm text-slate-500">Applying for {selectedApp.gradeApplyingFor}</p>
                          </div>
                       </div>

                       <div className="space-y-3 pt-4 border-t border-slate-100">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Main Actions</h4>
                          <div className="grid grid-cols-2 gap-2">
                             <Button 
                                disabled={isUpdating || selectedApp.status === 'accepted'} 
                                onClick={() => handleUpdateStatus(selectedApp.id, 'accepted', 'applications')}
                                className="bg-green-600 hover:bg-green-700 text-xs h-9"
                             >
                                <CheckCircle className="mr-2 h-3.5 w-3.5" /> Accept
                             </Button>
                             <Button 
                                variant="outline"
                                disabled={isUpdating || selectedApp.status === 'rejected'} 
                                onClick={() => handleUpdateStatus(selectedApp.id, 'rejected', 'applications')}
                                className="text-xs h-9 border-red-200 text-red-600 hover:bg-red-50"
                             >
                                <XCircle className="mr-2 h-3.5 w-3.5" /> Reject
                             </Button>
                             <Button 
                                variant="outline"
                                disabled={isUpdating || selectedApp.status === 'waitlisted'} 
                                onClick={() => handleUpdateStatus(selectedApp.id, 'waitlisted', 'applications')}
                                className="text-xs h-9"
                             >
                                <AlertCircle className="mr-2 h-3.5 w-3.5" /> Waitlist
                             </Button>
                             <Button 
                                variant="outline"
                                disabled={isUpdating || selectedApp.status === 'enrolled'} 
                                onClick={() => handleUpdateStatus(selectedApp.id, 'enrolled', 'applications')}
                                className="bg-blue-50 border-blue-200 text-blue-700 text-xs h-9"
                             >
                                <UserPlus className="mr-2 h-3.5 w-3.5" /> Enroll
                             </Button>
                          </div>
                       </div>

                       <div className="space-y-3 pt-4 border-t border-slate-100">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Interview Scheduling</h4>
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-slate-500">Select Date & Time</label>
                             <div className="flex gap-2">
                                <Input 
                                  type="datetime-local" 
                                  className="h-9 text-xs" 
                                  onChange={(e) => handleScheduleInterview(selectedApp.id, e.target.value)}
                                  value={selectedApp.interviewDate || ""}
                                />
                             </div>
                             <p className="text-[10px] text-slate-400 italic">This will automatically send an email to the parent.</p>
                          </div>
                       </div>

                       <div className="space-y-3 pt-4 border-t border-slate-100">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Documents</h4>
                          <div className="space-y-2">
                             {selectedApp.documents && selectedApp.documents.length > 0 ? (
                                selectedApp.documents.map((doc, idx) => (
                                   <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                                      <div className="flex items-center gap-2 overflow-hidden">
                                         <FileText className="h-3 w-3 text-blue-500 shrink-0" />
                                         <span className="text-[10px] font-medium truncate">{doc.name}</span>
                                      </div>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                                         <Download className="h-3 w-3" />
                                      </Button>
                                   </div>
                                ))
                             ) : (
                                <p className="text-[10px] text-slate-400 italic">No documents uploaded.</p>
                             )}
                          </div>
                       </div>

                       <div className="space-y-3 pt-4 border-t border-slate-100">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Parent Details</h4>
                          <div className="space-y-2 text-xs">
                             <div className="flex items-center gap-2 text-slate-700">
                                <Mail className="h-3 w-3 text-slate-400" /> {selectedApp.parentEmail}
                             </div>
                             <div className="flex items-center gap-2 text-slate-700">
                                <Phone className="h-3 w-3 text-slate-400" /> {selectedApp.parentPhone}
                             </div>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              </div>
           ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                 <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-4">
                    <ClipboardList className="h-8 w-8 text-slate-200" />
                 </div>
                 <h3 className="font-bold text-slate-900">No applicant selected</h3>
                 <p className="text-xs text-slate-400 mt-2">Select an application from the list to view full details and take action.</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}

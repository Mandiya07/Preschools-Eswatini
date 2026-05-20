import { useState, useEffect } from "react";
import { 
  Users, UserPlus, Filter, Phone, Mail, Clock, 
  MessageSquare, Settings, Share2, Activity,
  MoreVertical, Calendar, ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/AuthContext";
import { subscribeToCollection } from "@/lib/firestoreUtils";
import { where } from "firebase/firestore";
import { Inquiry, Application } from "@/types";

export function AdminCRMPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("pipeline");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  
  useEffect(() => {
    if (!user?.schoolId) return;

    const unsubInquiries = subscribeToCollection(
      'inquiries',
      (data) => setInquiries(data as Inquiry[]),
      where('schoolId', '==', user.schoolId)
    );

    const unsubApplications = subscribeToCollection(
      'applications',
      (data) => setApplications(data as Application[]),
      where('schoolId', '==', user.schoolId)
    );

    return () => {
      unsubInquiries();
      unsubApplications();
    };
  }, [user]);

  // Merge inquiries and apps into a unified pipeline
  const pipeline = [
    {
      id: "leads",
      title: "New Leads / Inquiries",
      items: inquiries.filter(i => i.status === 'pending'),
      color: "bg-blue-100 text-blue-800 border-blue-200"
    },
    {
      id: "tour_booked",
      title: "Tours Booked / Contacted",
      items: inquiries.filter(i => i.status === 'responded'),
      color: "bg-amber-100 text-amber-800 border-amber-200"
    },
    {
      id: "applied",
      title: "Application Received",
      items: applications.filter(a => ['submitted', 'under_review', 'interview_scheduled'].includes(a.status)),
      color: "bg-purple-100 text-purple-800 border-purple-200"
    },
    {
      id: "waitlisted",
      title: "Waitlisted",
      items: applications.filter(a => a.status === 'waitlisted'),
      color: "bg-slate-100 text-slate-800 border-slate-200"
    },
    {
      id: "enrolled",
      title: "Enrolled",
      items: applications.filter(a => a.status === 'enrolled' || a.status === 'accepted'),
      color: "bg-emerald-100 text-emerald-800 border-emerald-200"
    }
  ];

  return (
    <div className="space-y-6 max-w-full mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">CRM & Growth</h1>
          <p className="text-sm text-slate-500 mt-1">Track leads, manage inquiries, and analyze your admissions funnel.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white">
            <Mail className="mr-2 h-4 w-4" /> Email Campaigns
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="mr-2 h-4 w-4" /> Add Lead
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pipeline" className="w-full mt-4" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] h-12 bg-slate-100 rounded-xl p-1 mb-6">
          <TabsTrigger value="pipeline" className="rounded-lg font-bold">Pipeline</TabsTrigger>
          <TabsTrigger value="tasks" className="rounded-lg font-bold">Follow-ups</TabsTrigger>
          <TabsTrigger value="automations" className="rounded-lg font-bold">Automations</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-6">
           <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
             {pipeline.map(column => (
               <div key={column.id} className="flex-none w-80 bg-slate-50 rounded-2xl border border-slate-200 p-4 shrink-0 flex flex-col max-h-[700px]">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="font-bold text-slate-700 text-sm">{column.title}</h3>
                   <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${column.color}`}>
                     {column.items.length}
                   </span>
                 </div>
                 
                 <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                   {column.items.length === 0 ? (
                     <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center">
                       <p className="text-xs text-slate-400">Drag items here or wait for new leads.</p>
                     </div>
                   ) : (
                     column.items.map((item: any) => (
                       <Card key={item.id} className="cursor-pointer hover:border-blue-300 transition-colors shadow-sm">
                         <CardContent className="p-3">
                           <div className="flex justify-between items-start">
                             <div>
                               <p className="text-sm font-bold text-slate-900">{item.childName}</p>
                               <p className="text-[10px] text-slate-500">{item.parentName}</p>
                             </div>
                             <div className="flex bg-slate-100 rounded-md p-1">
                               <Button variant="ghost" size="icon" className="h-5 w-5 rounded-sm h-6 w-6"><Phone className="h-3 w-3 text-slate-500" /></Button>
                               <Button variant="ghost" size="icon" className="h-5 w-5 rounded-sm h-6 w-6"><Mail className="h-3 w-3 text-slate-500" /></Button>
                             </div>
                           </div>
                           
                           <div className="mt-3 flex items-center justify-between text-[10px]">
                              <span className="flex items-center text-slate-400">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                              {item.status === 'pending' && <span className="text-red-500 font-medium bg-red-50 px-1.5 rounded">Action needed</span>}
                           </div>
                         </CardContent>
                       </Card>
                     ))
                   )}
                 </div>
               </div>
             ))}
           </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
           <Card className="rounded-[2rem] border-slate-200">
              <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
                 <div>
                   <CardTitle>Follow-up Reminders</CardTitle>
                   <CardDescription>Stay on top of parent communications and lead nurturing.</CardDescription>
                 </div>
                 <Button variant="outline" size="sm">Sort by: Urgency</Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                   {[
                     { parent: "Sarah Johnson", child: "Liam", action: "Call regarding Tour", due: "Today, 2:00 PM", urgency: "high", phone: "+268 7600 1234" },
                     { parent: "Michael Maseko", child: "Thabo", action: "Send curriculum details", due: "Tomorrow", urgency: "medium", phone: "+268 7600 9876" },
                     { parent: "Alice Dlamini", child: "Sihle", action: "Follow up on Waitlist", due: "In 3 Days", urgency: "low", phone: "+268 7600 4567" },
                   ].map((task, i) => (
                     <div key={i} className="flex p-4 hover:bg-slate-50 transition-colors items-center justify-between">
                        <div className="flex gap-4 items-center">
                           <div className="mt-1">
                              {task.urgency === 'high' ? (
                                <div className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.2)]"></div>
                              ) : task.urgency === 'medium' ? (
                                <div className="h-3 w-3 rounded-full bg-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.2)]"></div>
                              ) : (
                                <div className="h-3 w-3 rounded-full bg-slate-300 shadow-[0_0_0_4px_rgba(203,213,225,0.2)]"></div>
                              )}
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-900">{task.action}</p>
                              <p className="text-xs text-slate-500">Parent: {task.parent} • Child: {task.child}</p>
                              <p className="text-xs text-slate-500 font-mono mt-0.5">{task.phone}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="text-xs font-semibold text-slate-500 bg-slate-100 py-1 px-2 rounded-lg">{task.due}</span>
                           <Button size="sm" variant="outline" className="hidden sm:flex">Log Activity</Button>
                           <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0 sm:w-auto sm:px-3">
                              <span className="hidden sm:inline">Mark Done</span>
                              <ChevronRight className="h-4 w-4 sm:hidden" />
                           </Button>
                        </div>
                     </div>
                   ))}
                </div>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="automations" className="space-y-6">
           <Card className="rounded-[2rem] border-slate-200 p-8 pt-10 text-center bg-slate-50 flex flex-col items-center justify-center">
              <Share2 className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-2">Automated Nurturing Flows</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-6">Set up automated email and WhatsApp sequences when parents inquire, book a tour, or abandon an application.</p>
              
              <div className="grid sm:grid-cols-2 gap-4 w-full max-w-2xl text-left mt-4 mb-6">
                 <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-xs font-bold bg-green-100 text-green-700 py-0.5 px-2 rounded-md">Active</span>
                       <Settings className="h-4 w-4 text-slate-400 cursor-pointer" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">New Inquiry Welcome</p>
                    <p className="text-xs text-slate-500 mt-1">Sends immediate welcome email + prospectus PDF.</p>
                 </div>
                 
                 <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-xs font-bold bg-slate-100 text-slate-700 py-0.5 px-2 rounded-md">Inactive</span>
                       <Settings className="h-4 w-4 text-slate-400 cursor-pointer" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">Waitlist Nurture</p>
                    <p className="text-xs text-slate-500 mt-1">Sends monthly school update to waitlisted parents.</p>
                 </div>
                 
                 <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-xs font-bold bg-amber-100 text-amber-700 py-0.5 px-2 rounded-md">Draft</span>
                       <Settings className="h-4 w-4 text-slate-400 cursor-pointer" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">Tour Follow-up</p>
                    <p className="text-xs text-slate-500 mt-1">Sends feedback form 2 hours after a school tour.</p>
                 </div>
              </div>
              
              <Button variant="outline" className="bg-white shadow-sm mt-4 text-blue-600 border-blue-200 hover:bg-blue-50">Create New Automation</Button>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

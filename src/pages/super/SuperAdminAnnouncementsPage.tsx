import { useState } from "react";
import { 
  Megaphone, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Users, 
  Send,
  Eye,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function SuperAdminAnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const announcements = [
    { id: '1', title: 'System Maintenance - May 25th', target: 'All', priority: 'High', status: 'Active', sentAt: 'Today, 9:00 AM', engagement: '1.2k views' },
    { id: '2', title: 'New Billing Features for Schools', target: 'SchoolAdmins', priority: 'Normal', status: 'Scheduled', sentAt: 'Tomorrow, 8:00 AM', engagement: '-' },
    { id: '3', title: 'Parent Mobile App Beta Testing', target: 'Parents', priority: 'Low', status: 'Completed', sentAt: '3 days ago', engagement: '4.5k views' },
    { id: '4', title: 'Security Advisory: Stronger Passwords', target: 'All', priority: 'Urgent', status: 'Active', sentAt: '1 week ago', engagement: '8.9k views' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Platform Broadcast</h1>
          <p className="text-slate-500 italic text-sm">Send global announcements to school admins and parents across Eswatini.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border-slate-200">View History</Button>
           <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-100">
              <Plus className="h-4 w-4 mr-2" /> New Broadcast
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
               <CardHeader className="bg-white border-b border-slate-50 p-6">
                  <div className="relative max-w-md">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                     <Input 
                       placeholder="Find broadcasts..." 
                       className="pl-10 h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y divide-slate-50">
                     {announcements.map((ann, i) => (
                       <div key={i} className="p-6 hover:bg-slate-50/50 transition-all flex items-start gap-4">
                          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                            ann.priority === 'High' || ann.priority === 'Urgent' ? 'bg-red-50 text-red-600' : 
                            ann.priority === 'Normal' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                          }`}>
                             <Megaphone className="h-6 w-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                             <div className="flex items-center justify-between mb-1">
                                <h3 className="font-bold text-slate-900 truncate uppercase tracking-tight">{ann.title}</h3>
                                <Badge className={`${
                                  ann.status === 'Active' ? 'bg-green-100 text-green-600' : 
                                  ann.status === 'Scheduled' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                                } border-none text-[10px] uppercase font-black`}>
                                   {ann.status}
                                </Badge>
                             </div>
                             <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 Ital">
                                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {ann.target}</span>
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {ann.sentAt}</span>
                                <span className="flex items-center gap-1 text-blue-600"><Eye className="h-3 w-3" /> {ann.engagement}</span>
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                                <MoreHorizontal className="h-4 w-4" />
                             </Button>
                          </div>
                       </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>

         <div className="space-y-6">
            <Card className="border-none shadow-sm bg-slate-900 text-white">
               <CardHeader>
                  <CardTitle className="text-sm font-black uppercase tracking-widest">Platform Stats</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Email Delivery</p>
                     <p className="text-sm font-black text-white">99.8%</p>
                  </div>
                  <div className="flex items-center justify-between">
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Push Open Rate</p>
                     <p className="text-sm font-black text-white">24.5%</p>
                  </div>
                  <div className="flex items-center justify-between">
                     <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Unsubscribes</p>
                     <p className="text-sm font-black text-white">0.4%</p>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                     <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 font-black uppercase tracking-tighter shadow-lg shadow-blue-900/40">
                        Detailed Analytics
                     </Button>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-none shadow-sm h-fit">
               <CardHeader className="border-b border-slate-50">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Broadcast Guidelines</CardTitle>
               </CardHeader>
               <CardContent className="p-6">
                  <ul className="space-y-4">
                     {[
                       "Announcements are sent immediately unless scheduled.",
                       "Use 'Urgent' priority only for system-wide outages.",
                       "Attach images/PDFs to increase engagement.",
                       "Target specific roles to reduce notification fatigue."
                     ].map((item, i) => (
                       <li key={i} className="flex gap-3">
                          <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                          <p className="text-xs text-slate-600 font-medium leading-relaxed">{item}</p>
                       </li>
                     ))}
                  </ul>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}

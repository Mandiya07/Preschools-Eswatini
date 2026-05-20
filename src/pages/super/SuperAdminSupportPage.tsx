import { useState } from "react";
import { 
  HelpCircle, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MessageSquare,
  User,
  ArrowRight,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function SuperAdminSupportPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const tickets = [
    { id: 'TKT-1024', subject: 'Billing Discrepancy on May Invoice', user: 'Sarah Zulu', email: 'sarah@starprep.sz', school: 'Star Montessori', priority: 'High', status: 'Open', createdAt: '45m ago' },
    { id: 'TKT-1023', subject: 'Unable to upload school logo', user: 'Bheki Dlamini', email: 'bheki@littlestars.sz', school: 'Little Stars Academy', priority: 'Medium', status: 'In Progress', createdAt: '3h ago' },
    { id: 'TKT-1022', subject: 'Feature Request: Attendance Export', user: 'Lindiwe Phiri', email: 'lindiwe@valley.sz', school: 'Valley Daycare', priority: 'Low', status: 'Resolved', createdAt: 'Yesterday' },
    { id: 'TKT-1021', subject: 'Account Access Recovery', user: 'Musa Gamedze', email: 'musa@childhub.sz', school: 'Child Hub', priority: 'High', status: 'Closed', createdAt: '2 days ago' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Platform Support</h1>
          <p className="text-slate-500 italic text-sm">Centralized help desk for school administrators and parents.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border-slate-200">Knowledge Base</Button>
           <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-100">
              <Plus className="h-4 w-4 mr-2" /> Manual Ticket
           </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
         {/* Inbox Sidebar */}
         <div className="space-y-6">
            <Card className="border-none shadow-sm h-fit">
               <CardHeader className="border-b border-slate-50 pb-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 Ital">Folder Inbox</h3>
               </CardHeader>
               <CardContent className="p-2">
                  <div className="space-y-1">
                     {[
                       { name: 'All Tickets', count: '42', icon: MessageSquare, active: true },
                       { name: 'Priority (High)', count: '5', icon: AlertCircle, active: false },
                       { name: 'Unassigned', count: '12', icon: User, active: false },
                       { name: 'Waiting Reply', count: '8', icon: Clock, active: false },
                       { name: 'Resolved', count: '148', icon: CheckCircle2, active: false },
                     ].map((folder, i) => (
                       <button 
                         key={i} 
                         className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold transition-all ${
                           folder.active ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                         }`}
                       >
                          <div className="flex items-center gap-3">
                             <folder.icon className="h-4 w-4" />
                             <span>{folder.name}</span>
                          </div>
                          <span className={`text-[10px] font-black uppercase ${folder.active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'} px-1.5 rounded-md`}>
                            {folder.count}
                          </span>
                       </button>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Ticket List */}
         <div className="lg:col-span-3 space-y-6">
            <Card className="border-none shadow-sm">
               <CardHeader className="bg-white border-b border-slate-50 p-6 flex flex-row items-center justify-between">
                  <div className="relative max-w-sm w-full">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                     <Input 
                       placeholder="Find tickets by ID, school or user..." 
                       className="pl-10 h-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-sm"
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
                  <div className="flex items-center gap-2">
                     <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500">
                       <Filter className="h-3 w-3 mr-2" /> Sort
                     </Button>
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y divide-slate-50">
                     {tickets.map((t, i) => (
                       <div key={i} className="p-6 hover:bg-slate-50/50 transition-all flex items-start gap-6 group cursor-pointer">
                          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                            t.status === 'Open' ? 'bg-orange-50 text-orange-600' :
                            t.status === 'Resolved' ? 'bg-green-50 text-green-600' :
                            'bg-blue-50 text-blue-600'
                          }`}>
                             <HelpCircle className="h-6 w-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                             <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{t.id}</span>
                                   <h3 className="font-bold text-slate-900 truncate uppercase tracking-tight group-hover:text-blue-600 transition-colors">{t.subject}</h3>
                                </div>
                                <Badge variant="outline" className={`border-none text-[10px] font-black uppercase tracking-widest ${
                                  t.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-400'
                                }`}>
                                   {t.priority} Priority
                                </Badge>
                             </div>
                             <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 Ital">
                                <span className="flex items-center gap-1"><User className="h-3 w-3" /> {t.user} ({t.school})</span>
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {t.createdAt}</span>
                                <span className={`flex items-center gap-1 ${
                                  t.status === 'Open' ? 'text-orange-500' : 
                                  t.status === 'Resolved' ? 'text-green-500' : 'text-blue-500'
                                }`}>
                                   <CheckCircle2 className="h-3 w-3" /> {t.status}
                                </span>
                             </div>
                          </div>
                          <div className="flex items-center">
                             <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 group-hover:text-blue-600 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                <ArrowRight className="h-5 w-5" />
                             </Button>
                          </div>
                       </div>
                     ))}
                  </div>
               </CardContent>
               <div className="p-4 border-t border-slate-50 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Viewing 4 of 42 tickets • Showing all categories</p>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}

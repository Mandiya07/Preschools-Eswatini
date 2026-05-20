import { useState } from "react";
import { 
  ShieldAlert, 
  Flag, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  MessageSquare,
  AlertTriangle,
  Eye,
  Building2,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function SuperAdminModerationPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const reports = [
    { id: '1', target: 'Mbabane ECCDE Center', type: 'School Content', reporter: 'Admin Review', reason: 'Missing regulatory documents', severity: 'Medium', status: 'Pending', createdAt: '2h ago' },
    { id: '2', target: 'John Doe (User ID 294)', type: 'Comment/Message', reporter: 'User Flag', reason: 'Inappropriate language', severity: 'High', status: 'Under Review', createdAt: '5h ago' },
    { id: '3', target: 'Village Daycare', type: 'School Content', reporter: 'Parent Report', reason: 'Misleading fee structure', severity: 'Low', status: 'Resolved', createdAt: '1 day ago' },
    { id: '4', target: 'Admin Support Chat', type: 'User Interaction', reporter: 'System Guard', reason: 'Potential PII sharing', severity: 'Critical', status: 'Urgent', createdAt: '30m ago' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Content Moderation</h1>
          <p className="text-slate-500 italic text-sm">Review flagged content, reports, and suspicious platform activity.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border-slate-200">
              Moderation Rules
           </Button>
           <Button className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-100">
              Review Critical Files
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "New Reports", value: "24", icon: Flag, color: "blue" },
          { label: "Pending Review", value: "12", icon: Eye, color: "orange" },
          { label: "Critical Flags", value: "3", icon: AlertTriangle, color: "red" },
          { label: "Resolved (30d)", value: "148", icon: CheckCircle2, color: "green" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
             <CardContent className="p-6 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
                   <stat.icon className="h-6 w-6" />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-slate-900 leading-tight">{stat.value}</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="bg-white border-b border-slate-50 p-6 flex flex-row items-center justify-between">
           <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search reports or entities..." 
                className="pl-10 h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500">
                <Filter className="h-3 w-3 mr-2" /> Severity
              </Button>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-[10px] text-slate-400 uppercase bg-slate-50 border-y border-slate-100 font-black tracking-widest Ital">
                <tr>
                  <th className="px-6 py-4">Reported Entity</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Severity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                            report.type === 'School Content' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                             {report.type === 'School Content' ? <Building2 className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                          </div>
                          <div>
                             <p className="font-bold text-slate-900 uppercase tracking-tight">{report.target}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Reporter: {report.reporter}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-xs font-medium text-slate-600">{report.type}</span>
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-xs text-slate-500 italic max-w-[200px] truncate">{report.reason}</p>
                    </td>
                    <td className="px-6 py-4">
                       <Badge variant="outline" className={`bg-white border-transparent text-[10px] font-black uppercase tracking-widest ${
                         report.severity === 'Critical' ? 'text-red-600 bg-red-50' :
                         report.severity === 'High' ? 'text-orange-600 bg-orange-50' :
                         'text-slate-600 bg-slate-50'
                       }`}>
                         {report.severity}
                       </Badge>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-widest text-slate-400">
                          <span className={`h-2 w-2 rounded-full ${
                             report.status === 'Resolved' ? 'bg-green-500' :
                             report.status === 'Urgent' ? 'bg-red-500 animate-pulse' :
                             'bg-slate-300'
                          }`}></span>
                          {report.status}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                             <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                             <Trash2 className="h-4 w-4" />
                          </Button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

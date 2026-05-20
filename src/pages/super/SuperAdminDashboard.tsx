import { useState } from "react";
import { 
  BarChart3, 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Megaphone
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Jan', revenue: 45000, users: 400, schools: 12 },
  { name: 'Feb', revenue: 52000, users: 600, schools: 15 },
  { name: 'Mar', revenue: 48000, users: 800, schools: 18 },
  { name: 'Apr', revenue: 61000, users: 1100, schools: 22 },
  { name: 'May', revenue: 75000, users: 1400, schools: 25 },
  { name: 'Jun', revenue: 89000, users: 1800, schools: 28 },
];

export function SuperAdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Platform Overview</h1>
          <p className="text-slate-500 italic text-sm">Vital metrics and real-time activity for the Preschools Eswatini ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border-slate-200">Export Report</Button>
           <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-100">Live View</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Schools", value: "142", icon: Building2, trend: "+12%", color: "blue" },
          { label: "Monthly Revenue", value: "E89,420", icon: CreditCard, trend: "+24%", color: "green" },
          { label: "Total Users", value: "3,842", icon: Users, trend: "+8%", color: "purple" },
          { label: "Pending Verification", value: "14", icon: ShieldCheck, trend: "-2", color: "orange" },
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <CardContent className="p-6 relative">
               <div className="flex items-center justify-between">
                  <div className={`h-12 w-12 rounded-2xl bg-${kpi.color}-50 flex items-center justify-center text-${kpi.color}-600 group-hover:scale-110 transition-transform`}>
                     <kpi.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className={`bg-${kpi.trend.startsWith('+') ? 'green' : 'red'}-50 text-${kpi.trend.startsWith('+') ? 'green' : 'red'}-600 border-none`}>
                     {kpi.trend.startsWith('+') ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                     {kpi.trend}
                  </Badge>
               </div>
               <div className="mt-4">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{kpi.value}</h3>
               </div>
               <div className={`absolute -bottom-1 -right-1 h-12 w-12 bg-${kpi.color}-100/30 rounded-full blur-2xl group-hover:scale-150 transition-transform`}></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Revenue Growth */}
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
           <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-50">
              <div>
                 <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Revenue Growth</CardTitle>
                 <CardDescription>Performance trends across all subscription tiers.</CardDescription>
              </div>
              <Activity className="h-5 w-5 text-blue-600" />
           </CardHeader>
           <CardContent className="pt-8">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </CardContent>
        </Card>

        {/* Real-time Logs */}
        <Card className="border-none shadow-sm flex flex-col">
           <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Live Activity</CardTitle>
              <CardDescription>Real-time platform events.</CardDescription>
           </CardHeader>
           <CardContent className="p-0 flex-1 overflow-y-auto">
              <div className="divide-y divide-slate-50">
                 {[
                   { type: 'subscription', title: 'New Subscription', school: 'Little Stars Academy', plan: 'Professional', time: '2m ago' },
                   { type: 'verification', title: 'Verification Request', school: 'Sunshine Preschool', plan: 'Basic', time: '14m ago' },
                   { type: 'support', title: 'Critical Ticket', school: 'System', plan: 'Urgent', time: '22m ago' },
                   { type: 'user', title: 'New Admin Registered', school: 'Happy Kids Daycare', plan: 'Trial', time: '1h ago' },
                   { type: 'payment', title: 'Payment Success', school: 'Mbabane ECCDE', plan: 'Enterprise', time: '3h ago' },
                 ].map((log, i) => (
                   <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                        log.type === 'subscription' ? 'bg-green-100 text-green-600' :
                        log.type === 'verification' ? 'bg-blue-100 text-blue-600' :
                        log.type === 'support' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                         {log.type === 'subscription' ? <ArrowUpRight className="h-4 w-4" /> : 
                          log.type === 'verification' ? <ShieldCheck className="h-4 w-4" /> : 
                          log.type === 'support' ? <AlertCircle className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                         <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-bold text-slate-900 truncate">{log.title}</p>
                            <span className="text-[9px] text-slate-400 font-bold whitespace-nowrap uppercase">{log.time}</span>
                         </div>
                         <p className="text-[10px] text-slate-500 truncate mt-0.5">{log.school} • {log.plan}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </CardContent>
           <div className="p-4 border-t border-slate-50">
              <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-widest text-blue-600">View Full Logs</Button>
           </div>
        </Card>
      </div>

      {/* Quick Actions Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <Card className="bg-slate-900 text-white border-none shadow-xl">
            <CardContent className="p-6 flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Megaphone className="h-6 w-6" />
               </div>
               <div>
                  <h4 className="text-sm font-black uppercase tracking-widest">Global Broadcast</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Announce platform updates to all admins.</p>
               </div>
            </CardContent>
         </Card>
         <Card className="bg-blue-600 text-white border-none shadow-xl shadow-blue-100">
            <CardContent className="p-6 flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Activity className="h-6 w-6" />
               </div>
               <div>
                  <h4 className="text-sm font-black uppercase tracking-widest">System Health</h4>
                  <p className="text-[10px] text-blue-100 mt-1">Real-time infrastructure monitoring.</p>
               </div>
            </CardContent>
         </Card>
         <Card className="bg-white border-slate-200 shadow-sm border-2">
            <CardContent className="p-6 flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6" />
               </div>
               <div>
                  <h4 className="text-sm font-black uppercase tracking-widest">Security Audit</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Review recent access and permissions.</p>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

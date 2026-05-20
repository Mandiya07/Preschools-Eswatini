import { useState } from "react";
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 45000, subscriptions: 12 },
  { month: 'Feb', revenue: 52000, subscriptions: 15 },
  { month: 'Mar', revenue: 48000, subscriptions: 18 },
  { month: 'Apr', revenue: 61000, subscriptions: 22 },
  { month: 'May', revenue: 75000, subscriptions: 25 },
  { month: 'Jun', revenue: 89000, subscriptions: 28 },
];

export function SuperAdminRevenuePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Revenue & Subscriptions</h1>
          <p className="text-slate-500 italic text-sm">Monitor platform income and manage service level agreements.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border-slate-200">
              <Download className="h-4 w-4 mr-2" /> Financials
           </Button>
           <Button className="bg-slate-900 hover:bg-black text-white rounded-xl shadow-lg shadow-slate-200">
              Billing Settings
           </Button>
        </div>
      </div>

      {/* Financial summary blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <Card className="bg-white border-2 border-slate-100 shadow-sm relative overflow-hidden">
            <CardContent className="p-6">
               <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                     <TrendingUp className="h-5 w-5" />
                  </div>
                  <Badge className="bg-green-100 text-green-600 border-none">+18%</Badge>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Platform ARR</p>
               <h3 className="text-2xl font-black text-slate-900 mt-1">E1,240,500</h3>
            </CardContent>
         </Card>
         <Card className="bg-white border-2 border-slate-100 shadow-sm relative overflow-hidden">
            <CardContent className="p-6">
               <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                     <CreditCard className="h-5 w-5" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-600 border-none">Active</Badge>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Subscriptions</p>
               <h3 className="text-2xl font-black text-slate-900 mt-1">284</h3>
            </CardContent>
         </Card>
         <Card className="bg-white border-2 border-slate-100 shadow-sm relative overflow-hidden">
            <CardContent className="p-6">
               <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                     <TrendingDown className="h-5 w-5" />
                  </div>
                  <Badge className="bg-red-100 text-red-600 border-none">+2.4%</Badge>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Churn Rate (30d)</p>
               <h3 className="text-2xl font-black text-slate-900 mt-1">1.2%</h3>
            </CardContent>
         </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Monthly Revenue Chart */}
         <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
               <div>
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Revenue Performance</CardTitle>
                  <CardDescription>Income breakdown over the last 6 months.</CardDescription>
               </div>
               <Calendar className="h-5 w-5 text-slate-400" />
            </CardHeader>
            <CardContent className="pt-8">
               <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                           dataKey="month" 
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
                           cursor={{fill: '#f8fafc'}}
                           contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
         </Card>

         {/* Plan Distribution */}
         <Card className="border-none shadow-sm">
            <CardHeader className="border-b border-slate-50">
               <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Tier Distribution</CardTitle>
               <CardDescription>Popularity of service plans.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
               <div className="space-y-6">
                  {[
                    { name: 'Enterprise', percentage: 15, count: 42, color: 'bg-purple-600' },
                    { name: 'Professional', percentage: 45, count: 128, color: 'bg-blue-600' },
                    { name: 'Basic', percentage: 30, count: 85, color: 'bg-green-600' },
                    { name: 'Trial/Free', percentage: 10, count: 29, color: 'bg-slate-400' },
                  ].map((plan, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900">{plan.name}</p>
                          <span className="text-[10px] font-black text-slate-400 uppercase">{plan.percentage}% • {plan.count}</span>
                       </div>
                       <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${plan.color}`} style={{ width: `${plan.percentage}%` }}></div>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="mt-8 p-4 bg-slate-50 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Avg. Expansion Revenue: +12% MoM</p>
               </div>
            </CardContent>
         </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-none shadow-sm">
         <CardHeader className="border-b border-slate-50 flex flex-row items-center justify-between">
            <div>
               <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Transaction History</CardTitle>
               <CardDescription>Real-time billing activity from all schools.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="outline" size="sm" className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest border-slate-200">
                  <Filter className="h-3 w-3 mr-1" /> Filter
               </Button>
            </div>
         </CardHeader>
         <CardContent className="p-0">
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left text-slate-600">
                  <thead className="text-[9px] text-slate-400 uppercase bg-slate-50 border-y border-slate-100 font-black tracking-widest Ital">
                     <tr>
                        <th className="px-6 py-4">Transaction Details</th>
                        <th className="px-6 py-4">School</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4 text-right">Invoice</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {[
                       { id: 'TX-9482', school: 'Little Stars Academy', plan: 'Professional Monthly', status: 'Success', amount: 'E950.00', date: 'Today, 2:42 PM' },
                       { id: 'TX-9481', school: 'Sunshine Early Learning', plan: 'Basic Annual', status: 'Success', amount: 'E4,500.00', date: 'Today, 11:15 AM' },
                       { id: 'TX-9480', school: 'Happy Kids Daycare', plan: 'Basic Monthly', status: 'Failed', amount: 'E450.00', date: 'Yesterday' },
                       { id: 'TX-9479', school: 'Mbabane ECCDE Central', plan: 'Enterprise Custom', status: 'Pending', amount: 'E12,500.00', date: 'Yesterday' },
                       { id: 'TX-9478', school: 'Village Montessori', plan: 'Professional Monthly', status: 'Success', amount: 'E950.00', date: '2 days ago' },
                     ].map((tx, i) => (
                       <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                             <div>
                                <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{tx.plan}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{tx.id} • {tx.date}</p>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <p className="text-xs font-medium text-slate-600">{tx.school}</p>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-1.5">
                                {tx.status === 'Success' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : 
                                 tx.status === 'Failed' ? <XCircle className="h-4 w-4 text-red-500" /> : 
                                 <Clock className="h-4 w-4 text-orange-400" />}
                                <span className={`text-xs font-bold ${
                                  tx.status === 'Success' ? 'text-green-600' : 
                                  tx.status === 'Failed' ? 'text-red-600' : 'text-orange-500'
                                }`}>{tx.status}</span>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className="font-black text-slate-900">{tx.amount}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400">
                                <Download className="h-4 w-4" />
                             </Button>
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

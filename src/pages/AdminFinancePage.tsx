import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, Search, Download, ArrowUpRight, ArrowDownRight, 
  Wallet, DollarSign, FileText, CheckCircle2, ChevronRight, History, 
  Settings, Users, Briefcase, Percent, Bell, Smartphone, CalendarClock, Repeat, Globe, BarChart3, AlertTriangle
} from "lucide-react";
import { SEO } from "@/components/SEO";

export function AdminFinancePage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <SEO title="Finance & Fees | Sikolo Admin" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Finance & Student Fees</h1>
          <p className="text-sm text-slate-500 mt-1">Manage online fee payments, send payment links, and track revenue.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
          <Button>
            <DollarSign className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Collected this Term</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">E124,500</h3>
              </div>
              <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-slate-500 ml-2">from last term</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Outstanding Fees</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">E42,300</h3>
              </div>
              <div className="h-10 w-10 bg-red-50 rounded-lg flex items-center justify-center">
                <ArrowDownRight className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-slate-500">Across 34 students</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
             <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Online Payments</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">89%</h3>
              </div>
              <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-blue-600 font-medium">Via Parent Portal</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
             <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Available Payout</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">E12,450</h3>
              </div>
              <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Wallet className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-indigo-600 font-medium hover:underline cursor-pointer">Withdraw to Bank</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ecosystem" className="w-full mt-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 lg:w-[900px] h-12 bg-slate-100 rounded-xl p-1 mb-6">
          <TabsTrigger value="overview" className="rounded-lg font-bold data-[state=active]:shadow-sm text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="ecosystem" className="rounded-lg font-bold data-[state=active]:shadow-sm text-xs sm:text-sm">Payment Ecosystem</TabsTrigger>
          <TabsTrigger value="transactions" className="rounded-lg font-bold data-[state=active]:shadow-sm text-xs sm:text-sm">Transactions</TabsTrigger>
          <TabsTrigger value="invoices" className="rounded-lg font-bold data-[state=active]:shadow-sm text-xs sm:text-sm">Invoices</TabsTrigger>
          <TabsTrigger value="management" className="rounded-lg font-bold data-[state=active]:shadow-sm text-xs sm:text-sm">Management</TabsTrigger>
          <TabsTrigger value="operations" className="rounded-lg font-bold data-[state=active]:shadow-sm text-xs sm:text-sm">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="ecosystem" className="space-y-6">
           <Card className="rounded-[2rem] border-blue-100 shadow-sm overflow-hidden bg-gradient-to-br from-slate-900 to-blue-900 text-white">
              <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center justify-between relative">
                <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>
                <div className="relative z-10 max-w-2xl">
                  <Badge className="bg-blue-500/20 text-blue-200 border border-blue-500/30 mb-4 px-3 py-1">Advanced Payment Ecosystem</Badge>
                  <h3 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">Modernize your school fee collections</h3>
                  <p className="text-blue-100 text-lg mb-6">Built specifically for African markets. Offer parents flexible payment options, reduce outstanding debt, and gain crystal-clear financial oversight.</p>
                  <Button className="bg-white text-blue-900 hover:bg-blue-50 rounded-xl font-bold shadow-xl shadow-blue-900/50">
                    Enable Digital Payments <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="relative z-10 shrink-0 hidden md:block">
                   <div className="h-40 w-40 bg-blue-500/20 rounded-full flex items-center justify-center border-4 border-white/10 shadow-[0_0_50px_rgba(37,99,235,0.3)]">
                      <Wallet className="h-16 w-16 text-blue-300" />
                   </div>
                </div>
              </div>
           </Card>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors bg-white">
                 <div className="p-6">
                    <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                       <Smartphone className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Mobile Money Integration</h4>
                    <p className="text-sm text-slate-500 mb-4">Accept payments instantly via MTN Mobile Money, Airtel Money, and local telco wallets. Funds settle directly into your school account.</p>
                    <div className="flex gap-2">
                       <Badge variant="secondary" className="bg-slate-100 text-slate-600">MTN MoMo</Badge>
                       <Badge variant="secondary" className="bg-slate-100 text-slate-600">eMali</Badge>
                    </div>
                 </div>
              </Card>

              <Card className="rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors bg-white">
                 <div className="p-6">
                    <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                       <CalendarClock className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Installment Plans</h4>
                    <p className="text-sm text-slate-500 mb-4">Allow parents to split large tuition fees over 3, 6, or 9 months. The system automatically tracks portions and sends receipts.</p>
                    <Badge variant="outline" className="text-purple-600 border-purple-200 bg-purple-50">High conversion</Badge>
                 </div>
              </Card>

              <Card className="rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors bg-white">
                 <div className="p-6">
                    <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                       <Repeat className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Recurring Billing</h4>
                    <p className="text-sm text-slate-500 mb-4">Auto-charge parent bank cards or mobile wallets for monthly transport fees, meal plans, or regular tuition.</p>
                    <div className="flex items-center text-xs font-semibold text-emerald-600">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Reduces defaults by 40%
                    </div>
                 </div>
              </Card>

              <Card className="rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors bg-white">
                 <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                       <div className="h-12 w-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                          <Bell className="h-6 w-6" />
                       </div>
                       <Badge className="bg-slate-900">SMS & WhatsApp</Badge>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Automated Smart Reminders</h4>
                    <p className="text-sm text-slate-500 mb-4">Set up triggered notifications for upcoming fees and overdue balances with 1-click secure payment links embedded.</p>
                 </div>
              </Card>

              <Card className="rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors bg-white">
                 <div className="p-6">
                    <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                       <BarChart3 className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Advanced Financial Analytics</h4>
                    <p className="text-sm text-slate-500">Visualize cash flow trends, predict seasonal revenue drops, and easily identify highest defaulting age groups or classes.</p>
                 </div>
              </Card>

              <Card className="rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors bg-white">
                 <div className="p-6">
                    <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                       <Globe className="h-6 w-6" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Multi-Currency & Cross-border</h4>
                    <p className="text-sm text-slate-500">Easily support parents working abroad (e.g. South Africa). Process payments in ZAR and auto-settle in SZL without hidden fees.</p>
                 </div>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Live feed of online and offline fee payments.</CardDescription>
              </div>
              <div className="flex gap-3">
                <div className="relative w-72">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input placeholder="Search student or reference..." className="pl-9 bg-slate-50" />
                </div>
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-y border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Reference</th>
                    <th className="px-6 py-4 font-medium">Student</th>
                    <th className="px-6 py-4 font-medium">Date & Time</th>
                    <th className="px-6 py-4 font-medium">Method</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { id: "TXN-00124", student: "Sipho Dlamini", date: "Today, 10:45 AM", method: "Mobile Money", amount: "E4,500.00", status: "Successful" },
                    { id: "TXN-00123", student: "Zanele Maseko", date: "Today, 09:12 AM", method: "Card (Stripe)", amount: "E9,000.00", status: "Successful" },
                    { id: "TXN-00122", student: "Banele Nxumalo", date: "Yesterday, 14:30 PM", method: "Bank Transfer", amount: "E4,500.00", status: "Pending" },
                  ].map((txn, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{txn.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{txn.student}</td>
                      <td className="px-6 py-4">{txn.date}</td>
                      <td className="px-6 py-4">{txn.method}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{txn.amount}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${txn.status === 'Successful' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'}`}>
                             {txn.status}
                           </span>
                           <Button variant="ghost" size="sm" className="h-8">
                             <Bell className="h-4 w-4 text-slate-400" />
                           </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-center">
              <Button variant="ghost" className="text-blue-600 text-sm">View All Transactions <ChevronRight className="h-4 w-4 ml-1" /></Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6 mt-6">
           <Card className="p-6">
             <CardTitle className="mb-4">Invoice Management</CardTitle>
             <p className="text-slate-500 text-sm mb-6">Track generated invoices and manage payment reminders for overdue fees.</p>
             <Button className="flex gap-2">
                <FileText className="h-4 w-4" /> Generate New Invoices
             </Button>
           </Card>
        </TabsContent>

        <TabsContent value="management" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <CardTitle className="flex items-center gap-2"><Percent className="h-5 w-5 text-blue-600"/> Fee Structures</CardTitle>
              <CardDescription className="mt-2">Customize fee categories and amounts.</CardDescription>
            </Card>
            <Card className="p-6">
              <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-purple-600"/> Installment Plans</CardTitle>
              <CardDescription className="mt-2">Enable flexible payment schedules for parents.</CardDescription>
            </Card>
            <Card className="p-6">
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-emerald-600"/> Scholarships</CardTitle>
              <CardDescription className="mt-2">Manage student fee reductions and grants.</CardDescription>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <CardTitle className="flex items-center gap-2"><Wallet className="h-5 w-5 text-amber-600"/> Expense Tracking</CardTitle>
              <CardDescription className="mt-2">Record school operational costs and vendor payments.</CardDescription>
            </Card>
            <Card className="p-6">
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-rose-600"/> Payroll Support</CardTitle>
              <CardDescription className="mt-2">Process staff salaries and tax deductions.</CardDescription>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

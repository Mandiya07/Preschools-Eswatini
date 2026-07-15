import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { 
  CheckCircle2, CreditCard, AlertCircle, TrendingUp, Users, HardDrive, 
  Download, Calendar, Gift, Search, Smartphone, ShieldCheck, Zap,
  Mail, Phone
} from "lucide-react";

import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";

import { PricingTier, PRICING_TIERS } from "@/components/PricingTier";

export function SubscriptionPage() {
  const { user, activeSchoolId } = useAuth();
  const effectiveSchoolId = user?.role === 'SuperAdmin' ? activeSchoolId : user?.schoolId;
  const [currentPlanId, setCurrentPlanId] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "termly" | "annual">("monthly");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<any>(null);
  
  const currentPlan = PRICING_TIERS.find(p => p.id === currentPlanId) || PRICING_TIERS[0];
  
  const studentsUsed = 0;
  const storageUsed = 0; // GB
  
  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "free30") {
      setCouponApplied(true);
    }
  };

  const handlePlanChange = (planId: string) => {
    const plan = PRICING_TIERS.find(p => p.id === planId);
    if (!plan) return;
    
    setSelectedPlanDetails(plan);
    setShowPaymentModal(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Billing & Subscription</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your plan, payment methods, and billing history.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
             7 Days Left in Free Trial
          </Badge>
          <Button>View Setup Guide</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Manage Plan</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>Your plan automatically renews on June 1, 2026.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-blue-200 rounded-lg bg-blue-50/50">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                      <Zap className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                         <h3 className="font-bold text-slate-900 text-lg">{currentPlan.name} Plan</h3>
                         <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Active</Badge>
                      </div>
                      <p className="text-sm text-slate-600">
                        {billingCycle === "monthly" 
                          ? `E${currentPlan.price.monthly} / month` 
                          : `E${currentPlan.price.annual} / year`}
                      </p>
                    </div>
                  </div>
                  <TabsList className="h-9">
                    <TabsTrigger value="overview" onClick={() => document.querySelector<HTMLButtonElement>('[data-value="plans"]')?.click()}>
                      Change Plan
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium text-slate-700">
                         <Users className="h-4 w-4 text-slate-400" /> Student Limit
                      </span>
                      <span className="text-slate-500">
                         {studentsUsed} / {currentPlan.limits.students > 1000 ? 'Unlimited' : currentPlan.limits.students}
                      </span>
                    </div>
                    <Progress value={(studentsUsed / currentPlan.limits.students) * 100} className="h-2" />
                    <p className="text-xs text-slate-500">You are using {Math.round((studentsUsed / currentPlan.limits.students) * 100)}% of your student limit.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium text-slate-700">
                         <HardDrive className="h-4 w-4 text-slate-400" /> Storage Limit
                      </span>
                      <span className="text-slate-500">
                         {storageUsed} GB / {currentPlan.limits.storage} GB
                      </span>
                    </div>
                    <Progress value={(storageUsed / currentPlan.limits.storage) * 100} className="h-2" />
                    <p className="text-xs text-slate-500">You are using {Math.round((storageUsed / currentPlan.limits.storage) * 100)}% of your storage limit.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Subscription Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                     <span className="text-sm font-medium text-slate-600">Total Spent (YTD)</span>
                     <span className="font-bold text-slate-900">E3,595.00</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                     <span className="text-sm font-medium text-slate-600">Est. Upcoming Bill</span>
                     <span className="font-bold text-slate-900">E{billingCycle === 'monthly' ? currentPlan.price.monthly : billingCycle === 'annual' ? currentPlan.price.annual : currentPlan.price.termly?.t1}.00</span>
                  </div>
                  <Button variant="outline" className="w-full text-xs h-8">View Full Report <TrendingUp className="h-3 w-3 ml-2" /></Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Need more capacity?</CardTitle>
                </CardHeader>
                <CardContent>
                   <p className="text-sm text-slate-600 mb-4">Easily upgrade your plan to unlock more students, storage, and premium features.</p>
                   <Button className="w-full" onClick={() => document.querySelector<HTMLButtonElement>('[data-value="plans"]')?.click()}>
                     Explore Plans
                   </Button>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50/40">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-1.5 text-amber-800 font-extrabold text-xs uppercase tracking-wide">
                    🎁 Platform-Free Care
                  </div>
                  <CardTitle className="text-base font-extrabold text-slate-900 mt-1">Nannies &amp; Flatlets Option</CardTitle>
                </CardHeader>
                <CardContent>
                   <p className="text-xs text-slate-600 mb-4 leading-relaxed font-semibold">
                     Home-based au pairs, travel nannies, and informal backyard daycares require E0.00 subscriptions or commission fees.
                   </p>
                   <Button variant="outline" className="w-full text-xs font-bold border-amber-300 text-amber-900 hover:bg-amber-100" asChild>
                     <a href="/flatlets">Discover Registries</a>
                   </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* PLANS TAB */}
        <TabsContent value="plans" className="mt-6">
          {/* Zero-Subscription and Free Home Care Notification */}
          <div className="mb-10 bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between text-left">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-black text-amber-800 uppercase tracking-wide">
                🎁 Free Grassroots Programs Guarantee
              </span>
              <h3 className="text-lg font-extrabold text-slate-950">Are you a Backyard Flatlet Daycare or Parent looking for Home Nannies?</h3>
              <p className="text-slate-700 text-sm leading-relaxed font-semibold">
                You do NOT need a formal platform subscription. Registration for informal micro-nurseries, digital child-minding guides, and regional matchmaking with professional nanny placement networks is <strong>100% platform-free (E0.00 search &amp; listing fees)</strong>.
              </p>
            </div>
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold rounded-xl shrink-0 border-none" asChild>
              <a href="/flatlets">Discover Free Registries</a>
            </Button>
          </div>

          <div className="mb-8 flex flex-col items-center justify-center space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Choose the perfect plan for your school</h2>
          </div>

          <PricingTier 
            selectedPlan={currentPlanId}
            onSelectPlan={(plan) => handlePlanChange(plan)}
            billingCycle={billingCycle}
            onBillingCycleChange={setBillingCycle}
          />

          {/* Coupon Section */}
          <div className="mt-12 bg-slate-50 border border-slate-200 rounded-xl p-6 max-w-xl mx-auto">
             <div className="flex gap-4 items-center">
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
                  <Gift className="h-5 w-5 text-indigo-500" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 text-sm">Have a promo code?</h4>
                  <div className="flex gap-2 mt-2">
                    <Input 
                      placeholder="Enter coupon code" 
                      value={couponCode} 
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={couponApplied}
                    />
                    <Button 
                      variant={couponApplied ? "secondary" : "default"} 
                      onClick={handleApplyCoupon}
                      disabled={couponApplied || !couponCode}
                    >
                      {couponApplied ? "Applied!" : "Apply"}
                    </Button>
                  </div>
                  {couponApplied && (
                    <p className="text-xs text-green-600 font-medium mt-2">"FREE30" applied: 30% off your next 3 months.</p>
                  )}
                </div>
             </div>
          </div>
        </TabsContent>

        {/* PAYMENT METHODS TAB */}
        <TabsContent value="payment" className="space-y-6 mt-6">
           <Card>
             <CardHeader>
               <CardTitle>Payment Methods</CardTitle>
               <CardDescription>We currently process all platform subscription payments manually via EFT or Mobile Money to minimize processing fees for schools.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
                <div>
                   <h3 className="text-sm font-medium text-slate-900 mb-3">Accepted Payment Options</h3>
                   <div className="grid sm:grid-cols-2 gap-4">
                     {/* Mobile Money */}
                     <div className="border border-blue-200 bg-blue-50/50 rounded-lg p-5 flex flex-col gap-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">PREFERRED</div>
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-6 w-6 text-blue-600" />
                          <div>
                            <p className="font-bold text-slate-900">Mobile Money</p>
                            <p className="text-xs text-slate-500">MTN MoMo</p>
                          </div>
                        </div>
                        <div className="text-sm space-y-1.5 mt-2 bg-white p-3 rounded-md border border-blue-100">
                          <div className="flex justify-between"><span className="text-slate-500">Number</span><span className="font-bold">7600 0000</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="font-medium">Preschools Eswatini</span></div>
                        </div>
                     </div>
                     
                     {/* EFT */}
                     <div className="border border-slate-200 rounded-lg p-5 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <HardDrive className="h-6 w-6 text-slate-600" />
                          <div>
                            <p className="font-bold text-slate-900">Bank Transfer (EFT)</p>
                            <p className="text-xs text-slate-500">Standard Bank or FNB</p>
                          </div>
                        </div>
                        <div className="text-sm space-y-1.5 mt-2 bg-slate-50 p-3 rounded-md border border-slate-100">
                          <div className="flex justify-between"><span className="text-slate-500">Bank</span><span className="font-medium">FNB Eswatini</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Account</span><span className="font-mono font-bold">62000000000</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Branch</span><span className="font-mono">280164</span></div>
                        </div>
                     </div>
                   </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold mb-1">How to link a payment to your account?</p>
                    <p className="opacity-90 leading-relaxed mb-3">After making your payment via MoMo or EFT, send your Proof of Payment (POP) via WhatsApp or Email including your school's unique Reference ID (<strong className="font-mono text-amber-900">{user?.schoolId?.substring(0,6).toUpperCase() || 'SUB2026'}</strong>).</p>
                    <p className="font-medium flex items-center gap-4">
                      <span><Phone className="h-3 w-3 inline mr-1" /> 7600 0000</span>
                      <span><Mail className="h-3 w-3 inline mr-1" /> billing@preschools.sz</span>
                    </p>
                  </div>
                </div>
             </CardContent>
           </Card>
        </TabsContent>

        {/* BILLING HISTORY TAB */}
        <TabsContent value="history" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>View and download your past invoices.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input placeholder="Search invoices..." className="pl-9 bg-slate-50" />
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-y border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Invoice Number</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Plan</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { id: "INV-2026-05", date: "May 1, 2026", desc: "Professional Plan", amount: "E599.00", status: "Paid" },
                    { id: "INV-2026-04", date: "Apr 1, 2026", desc: "Professional Plan", amount: "E599.00", status: "Paid" },
                    { id: "INV-2026-03", date: "Mar 1, 2026", desc: "Professional Plan", amount: "E599.00", status: "Paid" },
                    { id: "INV-2026-02", date: "Feb 1, 2026", desc: "Starter Plan", amount: "E299.00", status: "Paid" },
                    { id: "INV-2026-01", date: "Jan 1, 2026", desc: "Starter Plan", amount: "E299.00", status: "Paid" }
                  ].map((invoice, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{invoice.id}</td>
                      <td className="px-6 py-4 flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" /> {invoice.date}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{invoice.desc}</td>
                      <td className="px-6 py-4">{invoice.amount}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          <CheckCircle2 className="h-3 w-3" /> {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Download className="h-3 w-3" /> PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden border-0 shadow-2xl">
          <div className="bg-slate-900 p-6 text-white">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-400" />
                Complete Your Subscription
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                Automated card payments are currently unavailable. Please use one of our manual payment options below to activate the <strong className="text-white">{selectedPlanDetails?.name}</strong> plan.
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[65vh] space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-500">Selected Plan</p>
                <p className="font-bold text-slate-900 text-lg">{selectedPlanDetails?.name} ({billingCycle === 'monthly' ? 'Monthly' : billingCycle === 'annual' ? 'Annual' : 'Termly'})</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-500">Amount Due (First Payment)</p>
                <p className="font-black text-slate-900 text-2xl text-blue-600">
                  E{billingCycle === 'termly' ? selectedPlanDetails?.price.termly?.t1 : selectedPlanDetails?.price[billingCycle]}.00
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-blue-200 rounded-xl p-5 bg-blue-50/30 relative">
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-lg rounded-tr-xl">
                  Fastest
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-yellow-900 shrink-0">
                    Mo
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">MTN Mobile Money</h3>
                    <p className="text-xs text-slate-500">Pay via MoMo</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Number</span>
                    <span className="font-mono font-bold text-slate-900 text-base">7600 0000</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Name</span>
                    <span className="font-medium text-slate-900">Preschools Eswatini</span>
                  </div>
                  <div className="flex flex-col gap-1 pt-1">
                    <span className="text-slate-500">Reference:</span>
                    <span className="font-mono font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded w-fit">
                      {user?.schoolId?.substring(0,6).toUpperCase() || 'SUB2026'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-5 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-600 shrink-0">
                    <HardDrive className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Bank Transfer (EFT)</h3>
                    <p className="text-xs text-slate-500">Standard Bank or FNB</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Bank</span>
                    <span className="font-medium text-slate-900">FNB Eswatini</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Account</span>
                    <span className="font-mono font-bold text-slate-900">62000000000</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Branch Code</span>
                    <span className="font-mono font-bold text-slate-900">280164</span>
                  </div>
                  <div className="flex flex-col gap-1 pt-1">
                    <span className="text-slate-500">Reference:</span>
                    <span className="font-mono font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded w-fit">
                      {user?.schoolId?.substring(0,6).toUpperCase() || 'SUB2026'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold mb-1">Activation Process</p>
                <p className="opacity-90 leading-relaxed mb-3">After making your payment, please send your Proof of Payment (POP) along with your school name or reference code to our support team.</p>
                <div className="flex flex-wrap gap-4 font-medium">
                  <a href="https://wa.me/26876000000" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-amber-900 transition-colors">
                    <Phone className="h-4 w-4" /> WhatsApp: 7600 0000
                  </a>
                  <a href="mailto:billing@preschools.sz" className="flex items-center gap-1.5 hover:text-amber-900 transition-colors">
                    <Mail className="h-4 w-4" /> billing@preschools.sz
                  </a>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="bg-slate-50 p-4 border-t border-slate-100 sm:justify-between">
            <Button variant="ghost" className="text-slate-500" onClick={() => setShowPaymentModal(false)}>Close</Button>
            <Button onClick={() => setShowPaymentModal(false)}>I have understood</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


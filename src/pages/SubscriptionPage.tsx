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
  Download, Calendar, Gift, Search, Smartphone, ShieldCheck, Zap
} from "lucide-react";

import { PricingTier, PRICING_TIERS } from "@/components/PricingTier";

export function SubscriptionPage() {
  const { user, activeSchoolId } = useAuth();
  const effectiveSchoolId = user?.role === 'SuperAdmin' ? activeSchoolId : user?.schoolId;
  const [currentPlanId, setCurrentPlanId] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  
  const currentPlan = PRICING_TIERS.find(p => p.id === currentPlanId) || PRICING_TIERS[0];
  
  const studentsUsed = 0;
  const storageUsed = 0; // GB
  
  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "free30") {
      setCouponApplied(true);
    }
  };

  const handlePlanChange = async (planId: string) => {
    setIsChangingPlan(true);
    
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          billingCycle,
          schoolId: effectiveSchoolId,
          email: user?.email 
        }),
      });

      const session = await response.json();
      
      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error(session.error || "Failed to create checkout session");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error(err.message || "An error occurred while initiating payment.");
      setIsChangingPlan(false);
    }
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
                     <span className="font-bold text-slate-900">E{billingCycle === 'monthly' ? currentPlan.price.monthly : currentPlan.price.annual}.00</span>
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
               <CardDescription>Manage how you pay for your subscription and premium add-ons.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
                {/* Default Method */}
                <div>
                   <h3 className="text-sm font-medium text-slate-900 mb-3">Default Payment Method</h3>
                   <div className="flex items-center justify-between p-4 border border-blue-200 bg-blue-50/30 rounded-lg">
                     <div className="flex items-center gap-4">
                       <div className="h-10 w-16 bg-white border border-slate-200 rounded flex items-center justify-center p-1 shadow-sm">
                         <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png" alt="Visa" className="h-full object-contain" />
                       </div>
                       <div>
                         <p className="font-semibold text-slate-900">Visa ending in <span className="font-mono">4242</span></p>
                         <p className="text-sm text-slate-500">Expires 12/2026</p>
                       </div>
                     </div>
                     <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Default</Badge>
                   </div>
                </div>

                {/* Add New Methods */}
                <div>
                  <h3 className="text-sm font-medium text-slate-900 mb-3">Add Payment Method</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                     {/* Stripe/Card */}
                     <div className="border border-slate-200 rounded-lg p-4 cursor-pointer hover:border-blue-400 hover:bg-slate-50 transition-colors flex flex-col items-center text-center gap-3">
                        <CreditCard className="h-8 w-8 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900 text-sm">Credit / Debit Card</p>
                          <p className="text-xs text-slate-500 mt-1">Powered by Stripe</p>
                        </div>
                     </div>
                     {/* PayPal */}
                     <div className="border border-slate-200 rounded-lg p-4 cursor-pointer hover:border-blue-400 hover:bg-slate-50 transition-colors flex flex-col items-center text-center gap-3">
                        <svg className="h-8 w-8 text-[#00457C]" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/></svg>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">PayPal</p>
                          <p className="text-xs text-slate-500 mt-1">Connect account</p>
                        </div>
                     </div>
                     {/* Mobile Money */}
                     <div className="border border-blue-200 bg-blue-50/50 rounded-lg p-4 cursor-pointer hover:border-blue-400 transition-colors flex flex-col items-center text-center gap-3 relative overflow-hidden">
                        <div className="absolute -right-6 top-3 bg-blue-600 text-white text-[10px] font-bold px-8 py-0.5 rotate-45">NEW</div>
                        <Smartphone className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="font-medium text-slate-900 text-sm">Mobile Money</p>
                          <p className="text-xs text-slate-500 mt-1">MTN / Eswatini Mobile</p>
                        </div>
                     </div>
                  </div>
                </div>
             </CardContent>
             <CardFooter className="bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-500 py-4">
               <ShieldCheck className="h-4 w-4 text-green-600" /> Payments are secure and encrypted. We do not store your full card details.
             </CardFooter>
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
    </div>
  );
}


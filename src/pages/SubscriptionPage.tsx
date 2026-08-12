import { useState, useEffect } from "react";
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
  Mail, Phone, Clock, FileText, Check, Copy, ExternalLink, RefreshCw, Eye
} from "lucide-react";

import { PricingTier, PRICING_TIERS } from "@/components/PricingTier";
import { LocalPaymentModal } from "@/components/LocalPaymentModal";
import { InvoiceReceiptModal } from "@/components/InvoiceReceiptModal";
import { ReferralProgramCard } from "@/components/ReferralProgramCard";
import { AddonMarketplaceCatalog } from "@/components/AddonMarketplaceCatalog";
import { 
  PaymentVerificationRecord, 
  SubscriptionInvoiceRecord,
  DEFAULT_PLATFORM_PAYMENT_CONFIG,
  PlatformPaymentConfig
} from "@/lib/paymentUtils";
import { subscribeToCollection, fetchDocument } from "@/lib/firestoreUtils";

export function SubscriptionPage() {
  const { user, activeSchoolId } = useAuth();
  const effectiveSchoolId = user?.role === 'SuperAdmin' ? activeSchoolId : user?.schoolId;
  
  const [currentPlanId, setCurrentPlanId] = useState("starter");
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("trial");
  const [subscriptionExpiresAt, setSubscriptionExpiresAt] = useState<string>("");
  const [schoolName, setSchoolName] = useState<string>("My Preschool");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "termly" | "annual">("monthly");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  
  // Payment Modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<any>(null);

  // Invoice Receipt Modal state
  const [selectedInvoice, setSelectedInvoice] = useState<SubscriptionInvoiceRecord | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Live verifications & invoices from Firestore
  const [verifications, setVerifications] = useState<PaymentVerificationRecord[]>([]);
  const [invoices, setInvoices] = useState<SubscriptionInvoiceRecord[]>([]);
  const [paymentConfig, setPaymentConfig] = useState<PlatformPaymentConfig>(DEFAULT_PLATFORM_PAYMENT_CONFIG);

  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");

  // Load school data and subscribe to invoices and verifications
  useEffect(() => {
    if (effectiveSchoolId) {
      fetchDocument("schools", effectiveSchoolId).then((data: any) => {
        if (data) {
          if (data.name) setSchoolName(data.name);
          if (data.subscriptionPlan) setCurrentPlanId(data.subscriptionPlan);
          if (data.subscriptionStatus) setSubscriptionStatus(data.subscriptionStatus);
          if (data.subscriptionCycle) setBillingCycle(data.subscriptionCycle);
          if (data.subscriptionExpiresAt) setSubscriptionExpiresAt(data.subscriptionExpiresAt);
        }
      });
    }

    // Subscribe to verifications
    const unsubVerif = subscribeToCollection<PaymentVerificationRecord>(
      "payment_verifications",
      (records) => {
        // Filter for current school or show all for super admin
        const relevant = records.filter(r => 
          !effectiveSchoolId || r.schoolId === effectiveSchoolId || r.submitterEmail === user?.email
        ).sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
        setVerifications(relevant);
      }
    );

    // Subscribe to invoices
    const unsubInv = subscribeToCollection<SubscriptionInvoiceRecord>(
      "invoices",
      (records) => {
        const relevant = records.filter(r => 
          !effectiveSchoolId || r.schoolId === effectiveSchoolId
        ).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        setInvoices(relevant);
      }
    );

    // Fetch system payment settings
    fetchDocument("system_settings", "payment_info").then((info) => {
      if (info) {
        setPaymentConfig({
          ...DEFAULT_PLATFORM_PAYMENT_CONFIG,
          ...info
        });
      }
    });

    return () => {
      if (unsubVerif) unsubVerif();
      if (unsubInv) unsubInv();
    };
  }, [effectiveSchoolId, user]);

  const currentPlan = PRICING_TIERS.find(p => p.id === currentPlanId) || PRICING_TIERS[0];
  const pendingVerification = verifications.find(v => v.status === 'pending_verification');
  
  const studentsUsed = 24;
  const storageUsed = 1.2; // GB
  
  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "free30") {
      setCouponApplied(true);
      toast.success("Coupon FREE30 applied: 30% discount applied!");
    } else {
      toast.error("Invalid coupon code. Try FREE30");
    }
  };

  const handlePlanChange = (planId: string) => {
    const plan = PRICING_TIERS.find(p => p.id === planId);
    if (!plan) return;
    
    setSelectedPlanDetails(plan);
    setShowPaymentModal(true);
  };

  const handleOpenReceipt = (invoice: SubscriptionInvoiceRecord) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const filteredInvoices = invoices.filter(inv => 
    !invoiceSearchQuery || 
    inv.invoiceNumber?.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
    inv.referenceNumber?.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
    inv.planName?.toLowerCase().includes(invoiceSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Billing &amp; Subscription</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your school's plan, Eswatini local payments (MoMo / EFT / Card), and official tax invoices.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {subscriptionStatus === 'active' ? (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 font-bold px-3 py-1 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active Subscription ({currentPlan.name})
            </Badge>
          ) : pendingVerification ? (
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 font-bold px-3 py-1 text-xs animate-pulse">
              <Clock className="w-3.5 h-3.5 mr-1" /> Payment Verification Pending
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-bold px-3 py-1 text-xs">
              14-Day Free Trial
            </Badge>
          )}

          <Button 
            onClick={() => {
              setSelectedPlanDetails(currentPlan);
              setShowPaymentModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 font-bold text-xs shadow-sm"
          >
            Pay / Renew Subscription
          </Button>
        </div>
      </div>

      {/* Prominent Verification Alert Banner if payment was uploaded and pending review */}
      {pendingVerification && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl p-5 shadow-lg border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded text-white">
                  Payment Verification Required
                </span>
                <span className="font-mono text-xs font-black text-amber-200">
                  #{pendingVerification.referenceNumber}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black mt-0.5">
                Proof of Payment Submitted — Awaiting Administrator Approval
              </h3>
              <p className="text-xs text-amber-100 mt-0.5 leading-relaxed">
                Submitted on {new Date(pendingVerification.submittedAt).toLocaleDateString()} for <strong className="text-white">{pendingVerification.planName} (E{pendingVerification.amount})</strong> via {pendingVerification.paymentMethodLabel}. Your subscription will activate automatically once verified against our local statements.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              size="sm"
              asChild
              className="bg-white text-slate-900 hover:bg-amber-50 font-bold text-xs px-4"
            >
              <a 
                href={`https://wa.me/${paymentConfig.supportWhatsApp.replace(/[^0-9]/g, '')}?text=Hi%20Preschools%20Eswatini,%20checking%20on%20my%20payment%20verification%20for%20reference:%20${pendingVerification.referenceNumber}`}
                target="_blank" 
                rel="noreferrer"
              >
                Check Status on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 lg:w-[900px] h-auto p-1 bg-slate-100 rounded-2xl">
          <TabsTrigger value="overview" className="rounded-xl font-bold py-2 text-xs md:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="plans" className="rounded-xl font-bold py-2 text-xs md:text-sm">Plans</TabsTrigger>
          <TabsTrigger value="referrals" className="rounded-xl font-bold py-2 text-xs md:text-sm text-emerald-700 bg-emerald-50/50">Earn E100 Credit</TabsTrigger>
          <TabsTrigger value="addons" className="rounded-xl font-bold py-2 text-xs md:text-sm">Add-ons</TabsTrigger>
          <TabsTrigger value="payment" className="rounded-xl font-bold py-2 text-xs md:text-sm">Payments</TabsTrigger>
          <TabsTrigger value="history" className="rounded-xl font-bold py-2 text-xs md:text-sm">Invoices</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle>Current Subscription</CardTitle>
                <CardDescription>
                  {subscriptionExpiresAt 
                    ? `Your subscription is active until ${new Date(subscriptionExpiresAt).toLocaleDateString()}.`
                    : "Your school is currently enjoying full platform access."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-blue-200 rounded-2xl bg-blue-50/50">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                      <Zap className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-lg">{currentPlan.name} Plan</h3>
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none">
                          {subscriptionStatus === 'active' ? 'Active Paid' : 'Trial Period'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">
                        {billingCycle === "monthly" 
                          ? `E${currentPlan.price.monthly} / month` 
                          : billingCycle === "annual"
                          ? `E${currentPlan.price.annual} / year (2 months free)`
                          : `E${currentPlan.price.termly?.t1} / term`}
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => {
                      setSelectedPlanDetails(currentPlan);
                      setShowPaymentModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                  >
                    Renew / Upgrade
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium text-slate-700">
                        <Users className="h-4 w-4 text-slate-400" /> Student Capacity
                      </span>
                      <span className="text-slate-700 font-bold">
                        {studentsUsed} / {currentPlan.limits.students > 1000 ? 'Unlimited' : currentPlan.limits.students}
                      </span>
                    </div>
                    <Progress value={(studentsUsed / currentPlan.limits.students) * 100} className="h-2" />
                    <p className="text-xs text-slate-500">
                      {Math.round((studentsUsed / currentPlan.limits.students) * 100)}% of your student quota utilized.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium text-slate-700">
                        <HardDrive className="h-4 w-4 text-slate-400" /> Cloud Storage
                      </span>
                      <span className="text-slate-700 font-bold">
                        {storageUsed} GB / {currentPlan.limits.storage} GB
                      </span>
                    </div>
                    <Progress value={(storageUsed / currentPlan.limits.storage) * 100} className="h-2" />
                    <p className="text-xs text-slate-500">
                      {Math.round((storageUsed / currentPlan.limits.storage) * 100)}% of your cloud storage space used.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {/* Payment Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Local Payment Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-amber-500" /> MTN MoMo
                    </span>
                    <span className="font-mono font-bold text-xs text-slate-900">{paymentConfig.momoNumber}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-red-500" /> e-Mali
                    </span>
                    <span className="font-mono font-bold text-xs text-slate-900">{paymentConfig.emaliNumber}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-purple-600" /> Card Gateway
                    </span>
                    <span className="font-bold text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Enabled</span>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full text-xs font-bold mt-1"
                    onClick={() => {
                      setSelectedPlanDetails(currentPlan);
                      setShowPaymentModal(true);
                    }}
                  >
                    Open Payment Drawer <TrendingUp className="h-3 w-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Free Grassroots Daycare Notice */}
              <Card className="border-amber-200 bg-amber-50/40">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-1.5 text-amber-800 font-extrabold text-[11px] uppercase tracking-wide">
                    🎁 Community Nursery Support
                  </div>
                  <CardTitle className="text-sm font-extrabold text-slate-900 mt-1">Informal Care &amp; Flatlet Daycares</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    Informal backyard daycares, community crèches, and home au pairs can list and find placements at E0.00 platform fees.
                  </p>
                  <Button variant="outline" className="w-full text-xs font-bold border-amber-300 text-amber-900 hover:bg-amber-100" asChild>
                    <a href="/flatlets">Discover Free Registries</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* PLANS TAB */}
        <TabsContent value="plans" className="mt-6">
          <div className="mb-8 flex flex-col items-center justify-center space-y-2 text-center">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Eswatini Preschool Platform Pricing
            </h2>
            <p className="text-slate-500 text-sm max-w-lg">
              Designed specifically for preschools in Eswatini with flexible MTN MoMo, e-Mali, and Bank EFT payments.
            </p>
          </div>

          <PricingTier 
            selectedPlan={currentPlanId}
            onSelectPlan={(plan) => handlePlanChange(plan)}
            billingCycle={billingCycle}
            onBillingCycleChange={setBillingCycle}
          />

          {/* Coupon Section */}
          <div className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-xl mx-auto">
            <div className="flex gap-4 items-center">
              <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shrink-0 border border-slate-200 shadow-xs">
                <Gift className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 text-sm">Have a promotional discount code?</h4>
                <div className="flex gap-2 mt-2">
                  <Input 
                    placeholder="Enter coupon code (e.g. FREE30)" 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                    className="bg-white"
                  />
                  <Button 
                    variant={couponApplied ? "secondary" : "default"} 
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !couponCode}
                    className="font-bold text-xs"
                  >
                    {couponApplied ? "Applied!" : "Apply"}
                  </Button>
                </div>
                {couponApplied && (
                  <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Coupon "FREE30" applied: 30% discount on subscription.
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* PAYMENT METHODS TAB */}
        <TabsContent value="payment" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Eswatini Payment Methods</CardTitle>
              <CardDescription>
                We provide complete support for Mobile Money (MTN MoMo, e-Mali, Airtel Money) and Bank Electronic Transfers (FNB, Standard Bank, Nedbank, Eswatini Bank).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* MTN MoMo */}
                <div className="border border-amber-200 bg-amber-50/50 rounded-2xl p-5 relative overflow-hidden shadow-xs">
                  <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl">
                    Option 1 • MoMo
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-amber-400 text-slate-950 rounded-xl flex items-center justify-center font-black">
                      Mo
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">MTN Mobile Money</h4>
                      <p className="text-xs text-slate-500">Dial {paymentConfig.momoDialCode} or MoMo App</p>
                    </div>
                  </div>
                  <div className="text-xs space-y-2 bg-white p-3 rounded-xl border border-amber-100">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Number:</span>
                      <span className="font-mono font-black text-slate-900">{paymentConfig.momoNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Recipient Name:</span>
                      <span className="font-bold text-slate-900">{paymentConfig.momoName}</span>
                    </div>
                  </div>
                </div>

                {/* e-Mali */}
                <div className="border border-red-200 bg-red-50/50 rounded-2xl p-5 relative overflow-hidden shadow-xs">
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl">
                    Eswatini Mobile
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center font-black">
                      eM
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">e-Mali Payment</h4>
                      <p className="text-xs text-slate-500">Dial {paymentConfig.emaliDialCode} or e-Mali</p>
                    </div>
                  </div>
                  <div className="text-xs space-y-2 bg-white p-3 rounded-xl border border-red-100">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Number:</span>
                      <span className="font-mono font-black text-slate-900">{paymentConfig.emaliNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Recipient Name:</span>
                      <span className="font-bold text-slate-900">{paymentConfig.emaliName}</span>
                    </div>
                  </div>
                </div>

                {/* Bank Transfer */}
                <div className="border border-blue-200 bg-blue-50/50 rounded-2xl p-5 relative overflow-hidden shadow-xs">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl">
                    Option 2 • Bank EFT
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black">
                      <HardDrive className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">Bank Transfers</h4>
                      <p className="text-xs text-slate-500">FNB, Standard, Nedbank</p>
                    </div>
                  </div>
                  <div className="text-xs space-y-2 bg-white p-3 rounded-xl border border-blue-100">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">FNB Account:</span>
                      <span className="font-mono font-black text-slate-900">{paymentConfig.banks.fnb.accountNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Branch:</span>
                      <span className="font-mono font-bold text-slate-900">{paymentConfig.banks.fnb.branchCode}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Guidance Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h4 className="font-black text-slate-900 text-base mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  Manual Payment &amp; Instant Verification Flow
                </h4>
                <div className="grid sm:grid-cols-4 gap-4 text-xs">
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center mb-2">1</div>
                    <span className="font-bold text-slate-900 block mb-1">Select Plan &amp; Reference</span>
                    <p className="text-slate-500">Click Pay Now to generate your unique reference (e.g. <code>PES-2026-00841</code>).</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center mb-2">2</div>
                    <span className="font-bold text-slate-900 block mb-1">Make Transfer</span>
                    <p className="text-slate-500">Send money via MTN MoMo (*007#), e-Mali (*700#), or your bank with the reference.</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center mb-2">3</div>
                    <span className="font-bold text-slate-900 block mb-1">Upload Proof of Payment</span>
                    <p className="text-slate-500">Attach your screenshot or bank slip directly in the payment dialog.</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-black flex items-center justify-center mb-2">4</div>
                    <span className="font-bold text-slate-900 block mb-1">Automatic Activation</span>
                    <p className="text-slate-500">Admin verifies your payment and your subscription activates automatically.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BILLING HISTORY & INVOICES TAB */}
        <TabsContent value="history" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4">
              <div>
                <CardTitle className="text-xl font-bold">Invoices &amp; Receipts</CardTitle>
                <CardDescription>
                  Official tax invoices and printable receipts for your preschool accounting records.
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search invoice number..." 
                  value={invoiceSearchQuery}
                  onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                  className="pl-9 bg-slate-50 text-xs" 
                />
              </div>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-y border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold">Invoice Number</th>
                    <th className="px-6 py-4 font-bold">Reference</th>
                    <th className="px-6 py-4 font-bold">Date</th>
                    <th className="px-6 py-4 font-bold">Plan &amp; Cycle</th>
                    <th className="px-6 py-4 font-bold">Amount (SZL)</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Official Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                        <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                        <p className="font-semibold text-slate-600">No invoices on record yet.</p>
                        <p className="text-xs text-slate-400 mt-1">Invoices will appear here once you initiate or renew a subscription.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((invoice, i) => (
                      <tr key={invoice.id || i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-900">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-blue-700 font-bold">
                          {invoice.referenceNumber}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {new Date(invoice.createdAt || Date.now()).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900 text-xs">
                          {invoice.planName} ({invoice.billingCycle})
                        </td>
                        <td className="px-6 py-4 font-black text-slate-900">
                          E{invoice.amount?.toLocaleString()}.00
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
                            invoice.status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                              : invoice.status === 'Pending Verification'
                              ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 animate-pulse'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {invoice.status === 'Paid' ? (
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Clock className="h-3 w-3 text-amber-600" />
                            )}
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleOpenReceipt(invoice)}
                            className="h-8 gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold text-xs"
                          >
                            <Eye className="h-3.5 w-3.5" /> View / Print
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* REFERRALS TAB */}
        <TabsContent value="referrals" className="space-y-6 mt-6">
          <ReferralProgramCard 
            schoolId={effectiveSchoolId || "demo_school"}
            schoolName={schoolName}
            userEmail={user?.email || ""}
            userName={user?.name || ""}
          />
        </TabsContent>

        {/* ADDONS TAB */}
        <TabsContent value="addons" className="space-y-6 mt-6">
          <AddonMarketplaceCatalog 
            schoolId={effectiveSchoolId || "demo_school"}
            schoolName={schoolName}
            userEmail={user?.email || ""}
            userName={user?.name || ""}
          />
        </TabsContent>
      </Tabs>

      {/* Local Payment Drawer / Modal */}
      <LocalPaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        planId={selectedPlanDetails?.id || currentPlanId}
        planName={selectedPlanDetails?.name || currentPlan.name}
        billingCycle={billingCycle}
        schoolId={effectiveSchoolId}
        schoolName={schoolName}
        userEmail={user?.email || ""}
        userName={user?.name || ""}
        onSuccess={(ref) => {
          toast.success(`Proof of payment submitted! Ref: ${ref}`);
        }}
      />

      {/* Official Tax Invoice & Receipt Modal */}
      <InvoiceReceiptModal 
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        invoice={selectedInvoice}
      />
    </div>
  );
}

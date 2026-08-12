import { useState, useEffect } from "react";
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Settings,
  Save,
  Loader2,
  Smartphone,
  Building2,
  Mail,
  ShieldCheck,
  FileText,
  DollarSign,
  Layers,
  HelpCircle,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import { SuperAdminPaymentVerificationQueue } from "@/components/super/SuperAdminPaymentVerificationQueue";
import { 
  subscribeToCollection, 
  fetchDocument, 
  updateDocument, 
  createDocument 
} from "@/lib/firestoreUtils";
import { 
  DEFAULT_PLATFORM_PAYMENT_CONFIG, 
  PlatformPaymentConfig, 
  PaymentVerificationRecord, 
  SubscriptionInvoiceRecord 
} from "@/lib/paymentUtils";
import { toast } from "sonner";

const getMonthlyPlanPrice = (plan: string) => {
  switch (plan?.toLowerCase()) {
    case 'enterprise': return 1499;
    case 'professional': return 699;
    case 'standard': return 399;
    case 'basic':
    case 'starter': return 199;
    default: return 0;
  }
};

export function SuperAdminRevenuePage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("verifications");
  const [isSaving, setIsSaving] = useState(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [invoices, setInvoices] = useState<SubscriptionInvoiceRecord[]>([]);

  // Platform Payment Config
  const [paymentConfig, setPaymentConfig] = useState<PlatformPaymentConfig>(DEFAULT_PLATFORM_PAYMENT_CONFIG);

  useEffect(() => {
    // 1. Subscribe to schools
    const unsubSchools = subscribeToCollection("schools", (data) => {
      const dbSchools = (data as any[]) || [];
      const mergedSchoolsMap = new Map<string, any>();
      import("@/data/preloadedSchools").then(({ PRELOADED_SCHOOLS }) => {
        PRELOADED_SCHOOLS.forEach((s: any) => mergedSchoolsMap.set(s.id, s));
        dbSchools.forEach(s => mergedSchoolsMap.set(s.id, s));
        setSchools(Array.from(mergedSchoolsMap.values()));
        setLoading(false);
      });
    });

    // 2. Subscribe to payment verifications to keep pending badge up to date
    const unsubVerifications = subscribeToCollection<PaymentVerificationRecord>(
      "payment_verifications",
      (records) => {
        const pending = records.filter(r => r.status === 'pending_verification').length;
        setPendingCount(pending);
      }
    );

    // 3. Subscribe to invoices
    const unsubInvoices = subscribeToCollection<SubscriptionInvoiceRecord>(
      "invoices",
      (records) => {
        setInvoices(records.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()));
      }
    );

    loadPaymentConfig();

    return () => {
      if (unsubSchools) unsubSchools();
      if (unsubVerifications) unsubVerifications();
      if (unsubInvoices) unsubInvoices();
    };
  }, []);

  const loadPaymentConfig = async () => {
    try {
      const config = await fetchDocument("system_settings", "payment_info") as any;
      if (config) {
        setPaymentConfig({
          ...DEFAULT_PLATFORM_PAYMENT_CONFIG,
          ...config
        });
      }
    } catch (error) {
      console.error("Error loading payment config:", error);
    }
  };

  const handleSavePaymentConfig = async () => {
    setIsSaving(true);
    try {
      await updateDocument("system_settings", "payment_info", {
        ...paymentConfig,
        lastUpdated: new Date().toISOString(),
        updatedBy: "super_admin"
      });
      toast.success("Eswatini payment & banking settings updated!");
    } catch (error) {
      try {
        await createDocument("system_settings", "payment_info", {
          ...paymentConfig,
          lastUpdated: new Date().toISOString(),
          updatedBy: "super_admin"
        });
        toast.success("Eswatini payment settings initialized!");
      } catch (err) {
        console.error("Error saving payment config:", err);
        toast.error("Failed to save settings.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const schoolsList = schools;
  const totalSchoolsCount = schoolsList.length;

  // Active Subscriptions
  const activePaidSchools = schoolsList.filter(s => 
    s.subscriptionStatus === 'active' && 
    s.ownerId && 
    s.ownerId !== 'super_admin_seed' &&
    s.subscriptionPlan && 
    s.subscriptionPlan !== 'Free' && 
    s.subscriptionPlan !== 'Trial/Free' &&
    s.subscriptionPlan !== 'Trial'
  );
  
  const activeSubscriptionsCount = activePaidSchools.length;

  // Total Platform ARR
  const monthlyRevenue = activePaidSchools.reduce((sum, s) => sum + getMonthlyPlanPrice(s.subscriptionPlan), 0);
  const totalARR = monthlyRevenue * 12;

  // Churn Rate (30d) based on suspended count
  const suspendedCount = schoolsList.filter(s => s.subscriptionStatus === 'suspended' || s.subscriptionStatus === 'expired').length;
  const churnRate = totalSchoolsCount > 0 ? (suspendedCount / totalSchoolsCount) * 100 : 0.0;
  const displayChurn = `${churnRate.toFixed(1)}%`;

  // Tier distribution statistics computed dynamically
  const claimedSchools = schoolsList.filter(s => s.ownerId && s.ownerId !== 'super_admin_seed');
  const enterpriseCount = claimedSchools.filter(s => s.subscriptionPlan?.toLowerCase() === 'enterprise').length;
  const professionalCount = claimedSchools.filter(s => s.subscriptionPlan?.toLowerCase() === 'professional').length;
  const standardCount = claimedSchools.filter(s => s.subscriptionPlan?.toLowerCase() === 'standard').length;
  const starterCount = claimedSchools.filter(s => s.subscriptionPlan?.toLowerCase() === 'starter' || s.subscriptionPlan?.toLowerCase() === 'basic').length;
  const freeCount = claimedSchools.filter(s => !s.subscriptionPlan || s.subscriptionPlan?.toLowerCase().includes('trial') || s.subscriptionPlan?.toLowerCase().includes('free')).length;

  const tierTotals = claimedSchools.length || 1;
  const tiers = [
    { name: 'Enterprise (E1,499/mo)', percentage: Math.round((enterpriseCount / tierTotals) * 100), count: enterpriseCount, color: 'bg-purple-600' },
    { name: 'Professional (E699/mo)', percentage: Math.round((professionalCount / tierTotals) * 100), count: professionalCount, color: 'bg-blue-600' },
    { name: 'Standard (E399/mo)', percentage: Math.round((standardCount / tierTotals) * 100), count: standardCount, color: 'bg-indigo-600' },
    { name: 'Starter (E199/mo)', percentage: Math.round((starterCount / tierTotals) * 100), count: starterCount, color: 'bg-emerald-600' },
    { name: 'Trial / Free', percentage: Math.round((freeCount / tierTotals) * 100), count: freeCount, color: 'bg-slate-400' },
  ];

  // Dynamic Chart historical revenue projection
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const revenueData = months.map((monthName, index) => {
    const monthNum = index + 1;
    const schoolsUpToMonth = schoolsList.filter(s => {
      if (!s.ownerId || s.ownerId === 'super_admin_seed') return false;
      if (!s.createdAt) return true;
      const createdMonth = new Date(s.createdAt).getMonth() + 1;
      const createdYear = new Date(s.createdAt).getFullYear();
      if (createdYear < 2026) return true;
      return createdMonth <= monthNum;
    });

    const monthlyRev = schoolsUpToMonth
      .filter(s => s.subscriptionStatus === 'active')
      .reduce((sum, s) => sum + getMonthlyPlanPrice(s.subscriptionPlan || 'Free'), 0);

    const activeSubsCount = schoolsUpToMonth.filter(s => 
      s.subscriptionStatus === 'active' && 
      s.subscriptionPlan && 
      s.subscriptionPlan !== 'Free' && 
      s.subscriptionPlan !== 'Trial/Free' &&
      s.subscriptionPlan !== 'Trial'
    ).length;

    return {
      date: `2026-0${monthNum}-15`,
      month: monthName,
      revenue: monthlyRev,
      subscriptions: activeSubsCount
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Revenue, Billing &amp; Payment Verifications
          </h1>
          <p className="text-slate-500 text-sm">
            Eswatini MoMo / e-Mali / EFT approval queue, subscriptions, and platform financial metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <Badge className="bg-amber-500 text-white font-black px-3 py-1 text-xs animate-bounce">
              {pendingCount} Pending Approval{pendingCount > 1 ? 's' : ''}
            </Badge>
          )}
          <Button 
            onClick={() => setActiveTab("verifications")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Review Payments
          </Button>
        </div>
      </div>

      {/* Financial summary blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <TrendingUp className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Annual Run-Rate
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Platform ARR</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">E{totalARR.toLocaleString()}</h3>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <CreditCard className="h-4 w-4" />
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-none font-bold text-[10px]">Active</Badge>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Paid Schools</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{activeSubscriptionsCount}</h3>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock className="h-4 w-4" />
              </div>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                pendingCount > 0 ? 'bg-amber-100 text-amber-900 animate-pulse' : 'bg-slate-100 text-slate-500'
              }`}>
                Queue
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Verifications</p>
            <h3 className={`text-2xl font-black mt-0.5 ${pendingCount > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
              {pendingCount}
            </h3>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <DollarSign className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Monthly MRR
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Monthly Recurring</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">E{monthlyRevenue.toLocaleString()}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area with Tabs */}
      <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-[680px] bg-slate-100 rounded-xl p-1 mb-8">
          <TabsTrigger value="verifications" className="rounded-lg font-bold text-xs relative">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Verification Queue
            {pendingCount > 0 && (
              <span className="ml-1.5 bg-amber-500 text-white font-mono text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {pendingCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-lg font-bold text-xs">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            Revenue Analytics
          </TabsTrigger>
          <TabsTrigger value="invoices" className="rounded-lg font-bold text-xs">
            <FileText className="w-3.5 h-3.5 mr-1" />
            Tax Invoices Log
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-lg font-bold text-xs">
            <Settings className="w-3.5 h-3.5 mr-1" />
            Payment Gateway Config
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: VERIFICATIONS QUEUE */}
        <TabsContent value="verifications" className="space-y-6">
          <SuperAdminPaymentVerificationQueue />
        </TabsContent>

        {/* TAB 2: REVENUE ANALYTICS */}
        <TabsContent value="analytics" className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Monthly Revenue Chart */}
            <div className="lg:col-span-2">
              <AnalyticsCard
                title="Revenue Performance & Growth"
                description="Income indicators combined with active paid school accounts progression."
                data={revenueData}
                xAxisKey="month"
                dateKey="date"
                metrics={[
                  { key: "revenue", label: "Monthly Revenue (E)", color: "#3b82f6", type: "area" },
                  { key: "subscriptions", label: "Paid Subscriptions", color: "#8b5cf6", type: "line" }
                ]}
                prefix="E"
                id="revenue-analytics"
                defaultRange="ALL"
              />
            </div>

            {/* Plan Distribution */}
            <Card className="border border-slate-200 shadow-xs">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-sm font-black uppercase tracking-wider text-slate-900">
                  Tier Distribution
                </CardTitle>
                <CardDescription>Popularity of preschool subscription plans in Eswatini.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {tiers.map((plan, i) => (
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
                <div className="mt-8 p-4 bg-slate-50 rounded-xl text-center">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">
                    Starter plan (E199) and Standard (E399) lead early-stage nursery adoptions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: INVOICES LOG */}
        <TabsContent value="invoices" className="space-y-6">
          <Card className="border border-slate-200 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">All Platform Tax Invoices</CardTitle>
                <CardDescription>Complete audit trail of billing references issued to preschools.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-600">
                  <thead className="text-[10px] text-slate-400 uppercase bg-slate-50 border-y border-slate-100 font-bold">
                    <tr>
                      <th className="px-6 py-3">Invoice Number</th>
                      <th className="px-6 py-3">Reference</th>
                      <th className="px-6 py-3">School Name</th>
                      <th className="px-6 py-3">Plan &amp; Cycle</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                          No invoices recorded yet.
                        </td>
                      </tr>
                    ) : (
                      invoices.map((inv, idx) => (
                        <tr key={inv.id || idx} className="hover:bg-slate-50">
                          <td className="px-6 py-3 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                          <td className="px-6 py-3 font-mono text-blue-700 font-bold">{inv.referenceNumber}</td>
                          <td className="px-6 py-3 font-medium text-slate-900">{inv.schoolName}</td>
                          <td className="px-6 py-3">{inv.planName} ({inv.billingCycle})</td>
                          <td className="px-6 py-3 font-bold text-slate-900">E{inv.amount}</td>
                          <td className="px-6 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              inv.status === 'Paid' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-slate-400">
                            {new Date(inv.createdAt || Date.now()).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: PAYMENT CONFIGURATION */}
        <TabsContent value="settings" className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Platform Billing &amp; Banking Credentials</h3>
              <p className="text-sm text-slate-500">
                These credentials are dynamically presented to preschool directors in Eswatini on the payment modal.
              </p>
            </div>
            <Button 
              onClick={handleSavePaymentConfig} 
              className="bg-blue-600 hover:bg-blue-700 font-bold shadow-xs text-xs"
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Save className="h-4 w-4 mr-1.5" />}
              Save Billing Details
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* MTN MoMo Settings */}
            <Card className="border border-amber-200 bg-amber-50/20">
              <CardHeader className="border-b border-amber-100 flex flex-row items-center gap-3">
                <div className="h-9 w-9 bg-amber-400 rounded-xl flex items-center justify-center text-slate-950 font-black text-xs">
                  Mo
                </div>
                <div>
                  <CardTitle className="text-base font-bold">MTN Mobile Money (MoMo)</CardTitle>
                  <CardDescription>Primary Eswatini mobile money collection details.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="momoNumber" className="text-xs">MoMo Number</Label>
                  <Input 
                    id="momoNumber" 
                    value={paymentConfig.momoNumber} 
                    onChange={(e) => setPaymentConfig({...paymentConfig, momoNumber: e.target.value})}
                    placeholder="7600 0000"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="momoName" className="text-xs">MoMo Registered Merchant Name</Label>
                  <Input 
                    id="momoName" 
                    value={paymentConfig.momoName} 
                    onChange={(e) => setPaymentConfig({...paymentConfig, momoName: e.target.value})}
                    placeholder="Preschools Eswatini Ltd"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="momoDialCode" className="text-xs">MoMo USSD Shortcode</Label>
                  <Input 
                    id="momoDialCode" 
                    value={paymentConfig.momoDialCode} 
                    onChange={(e) => setPaymentConfig({...paymentConfig, momoDialCode: e.target.value})}
                    placeholder="*007#"
                    className="bg-white font-mono"
                  />
                </div>
              </CardContent>
            </Card>

            {/* e-Mali Settings */}
            <Card className="border border-red-200 bg-red-50/20">
              <CardHeader className="border-b border-red-100 flex flex-row items-center gap-3">
                <div className="h-9 w-9 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-xs">
                  eM
                </div>
                <div>
                  <CardTitle className="text-base font-bold">e-Mali (Eswatini Mobile)</CardTitle>
                  <CardDescription>Secondary Eswatini mobile collection details.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                <div className="space-y-1.5">
                  <Label htmlFor="emaliNumber" className="text-xs">e-Mali Number</Label>
                  <Input 
                    id="emaliNumber" 
                    value={paymentConfig.emaliNumber} 
                    onChange={(e) => setPaymentConfig({...paymentConfig, emaliNumber: e.target.value})}
                    placeholder="7900 0000"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="emaliName" className="text-xs">e-Mali Account Name</Label>
                  <Input 
                    id="emaliName" 
                    value={paymentConfig.emaliName} 
                    onChange={(e) => setPaymentConfig({...paymentConfig, emaliName: e.target.value})}
                    placeholder="Preschools Eswatini Ltd"
                    className="bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="emaliDialCode" className="text-xs">e-Mali USSD Shortcode</Label>
                  <Input 
                    id="emaliDialCode" 
                    value={paymentConfig.emaliDialCode} 
                    onChange={(e) => setPaymentConfig({...paymentConfig, emaliDialCode: e.target.value})}
                    placeholder="*700#"
                    className="bg-white font-mono"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bank Settings */}
            <Card className="border border-blue-200 bg-blue-50/20 md:col-span-2">
              <CardHeader className="border-b border-blue-100 flex flex-row items-center gap-3">
                <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Bank Transfer (EFT) Accounts</CardTitle>
                  <CardDescription>Official Eswatini bank accounts for wire transfers.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4 text-xs">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fnbAccount">FNB Eswatini Account</Label>
                    <Input 
                      id="fnbAccount" 
                      value={paymentConfig.banks.fnb.accountNumber} 
                      onChange={(e) => setPaymentConfig({
                        ...paymentConfig, 
                        banks: { ...paymentConfig.banks, fnb: { ...paymentConfig.banks.fnb, accountNumber: e.target.value } }
                      })}
                      className="bg-white font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="fnbBranch">FNB Branch Code</Label>
                    <Input 
                      id="fnbBranch" 
                      value={paymentConfig.banks.fnb.branchCode} 
                      onChange={(e) => setPaymentConfig({
                        ...paymentConfig, 
                        banks: { ...paymentConfig.banks, fnb: { ...paymentConfig.banks.fnb, branchCode: e.target.value } }
                      })}
                      className="bg-white font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="stdAccount">Standard Bank Eswatini Account</Label>
                    <Input 
                      id="stdAccount" 
                      value={paymentConfig.banks.standard.accountNumber} 
                      onChange={(e) => setPaymentConfig({
                        ...paymentConfig, 
                        banks: { ...paymentConfig.banks, standard: { ...paymentConfig.banks.standard, accountNumber: e.target.value } }
                      })}
                      className="bg-white font-mono"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tax & Support */}
            <Card className="border border-slate-200 md:col-span-2">
              <CardHeader className="border-b border-slate-100 flex flex-row items-center gap-3">
                <div className="h-9 w-9 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Tax Metadata &amp; Billing Support</CardTitle>
                  <CardDescription>Included on downloadable and printable tax invoices.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-5 text-xs">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="taxPin">Eswatini TIN / Tax PIN</Label>
                    <Input 
                      id="taxPin" 
                      value={paymentConfig.taxPin} 
                      onChange={(e) => setPaymentConfig({...paymentConfig, taxPin: e.target.value})}
                      placeholder="100-249-832"
                      className="bg-white font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="supportEmail">Billing Email</Label>
                    <Input 
                      id="supportEmail" 
                      value={paymentConfig.supportEmail} 
                      onChange={(e) => setPaymentConfig({...paymentConfig, supportEmail: e.target.value})}
                      placeholder="accounts@preschools.sz"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="supportWhatsApp">Support WhatsApp</Label>
                    <Input 
                      id="supportWhatsApp" 
                      value={paymentConfig.supportWhatsApp} 
                      onChange={(e) => setPaymentConfig({...paymentConfig, supportWhatsApp: e.target.value})}
                      placeholder="+268 7600 0000"
                      className="bg-white font-mono"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

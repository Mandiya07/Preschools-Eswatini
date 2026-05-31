import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, Search, Download, ArrowUpRight, ArrowDownRight, 
  Wallet, DollarSign, FileText, CheckCircle2, ChevronRight, History, 
  Settings, Users, Briefcase, Percent, Bell, Smartphone, CalendarClock, Repeat, Globe, BarChart3, AlertTriangle,
  Info, ListChecks, ArrowRight, MessageSquare, ShieldCheck, Key, Save, Loader2
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { SEO } from "@/components/SEO";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";
import { fetchDocument, updateDocument, createDocument } from "@/lib/firestoreUtils";

export function AdminFinancePage() {
  const { user, activeSchoolId } = useAuth();
  const effectiveSchoolId = user?.role === 'SuperAdmin' ? activeSchoolId : user?.schoolId;
  const [activeTab, setActiveTab] = useState("overview");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [momoConfig, setMomoConfig] = useState({
    merchantId: "",
    contactNumber: "",
    isActive: false
  });

  const [bankConfig, setBankConfig] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    branchCode: "",
    isActive: false
  });

  useEffect(() => {
    if (effectiveSchoolId) {
      loadConfig();
    } else {
      setLoading(false);
    }
  }, [effectiveSchoolId]);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const config = await fetchDocument("payment_configs", effectiveSchoolId!) as any;
      if (config) {
        if (config.momo) setMomoConfig(config.momo);
        if (config.bank) setBankConfig(config.bank);
      }
    } catch (error) {
      console.error("Error loading payment config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!effectiveSchoolId) return;
    setIsSaving(true);
    try {
      await updateDocument("payment_configs", effectiveSchoolId, {
        momo: momoConfig,
        bank: bankConfig,
        lastUpdated: new Date().toISOString(),
        schoolId: effectiveSchoolId
      });
      toast.success("Payment credentials updated successfully!");
    } catch (error) {
      // If doc doesn't exist, create it
      try {
        await createDocument("payment_configs", effectiveSchoolId, {
          momo: momoConfig,
          bank: bankConfig,
          lastUpdated: new Date().toISOString(),
          schoolId: effectiveSchoolId
        });
        toast.success("Payment credentials saved successfully!");
      } catch (err) {
        console.error("Error saving payment config:", err);
        toast.error("Failed to save credentials.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <SEO title="Finance & Fees | Preschools Eswatini Admin" />
      
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
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto lg:h-12 bg-slate-100 rounded-xl p-1 mb-12 gap-1">
          <TabsTrigger value="overview" className="rounded-lg font-bold data-[state=active]:shadow-sm text-xs sm:text-sm py-2">Overview</TabsTrigger>
          <TabsTrigger value="credentials" className="rounded-lg font-bold data-[state=active]:shadow-sm text-xs sm:text-sm py-2">Integration</TabsTrigger>
          <TabsTrigger value="setup-guide" className="rounded-lg font-bold data-[state=active]:shadow-sm text-xs sm:text-sm py-2">Setup Guide</TabsTrigger>
          <TabsTrigger value="ecosystem" className="rounded-lg font-bold data-[state=active]:shadow-sm text-xs sm:text-sm py-2">Ecosystem</TabsTrigger>
          <TabsTrigger value="transactions" className="rounded-lg font-bold data-[state=active]:shadow-sm text-xs sm:text-sm py-2">Transactions</TabsTrigger>
          <TabsTrigger value="invoices" className="rounded-lg font-bold data-[state=active]:shadow-sm text-xs sm:text-sm py-2">Invoices</TabsTrigger>
          <TabsTrigger value="management" className="rounded-lg font-bold data-[state=active]:shadow-sm text-xs sm:text-sm py-2">Management</TabsTrigger>
          <TabsTrigger value="operations" className="rounded-lg font-bold data-[state=active]:shadow-sm text-xs sm:text-sm py-2">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="credentials" className="space-y-6">
           <div className="flex flex-col md:flex-row gap-6 mb-2 justify-between items-start">
             <div>
                <h3 className="text-xl font-bold text-slate-900">Integration Configuration</h3>
                <p className="text-sm text-slate-500">Configure your school's direct payment reception endpoints.</p>
             </div>
             <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
             </Button>
           </div>

           <div className="grid lg:grid-cols-2 gap-8">
              {/* MoMo Config */}
              <Card className="border-amber-100 shadow-sm">
                 <CardHeader className="bg-amber-50/50 border-b border-amber-100">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center">
                             <Smartphone className="h-5 w-5" />
                          </div>
                          <div>
                             <CardTitle className="text-lg">MTN Mobile Money</CardTitle>
                             <CardDescription className="text-amber-700/70">Merchant Integration</CardDescription>
                          </div>
                       </div>
                       <Badge className={momoConfig.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}>
                          {momoConfig.isActive ? "Live" : "Inactive"}
                       </Badge>
                    </div>
                 </CardHeader>
                 <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                       <Label htmlFor="merchantId">Merchant/MoMo Pay ID</Label>
                       <Input 
                          id="merchantId" 
                          placeholder="e.g. 123456" 
                          value={momoConfig.merchantId}
                          onChange={(e) => setMomoConfig({...momoConfig, merchantId: e.target.value})}
                       />
                       <p className="text-[10px] text-slate-400 font-medium">Your unique ID assigned by MTN Eswatini after MoMo Pay approval.</p>
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor="momoNumber">Receive Notification Number</Label>
                       <Input 
                          id="momoNumber" 
                          placeholder="7600 0000" 
                          value={momoConfig.contactNumber}
                          onChange={(e) => setMomoConfig({...momoConfig, contactNumber: e.target.value})}
                       />
                       <p className="text-[10px] text-slate-400 font-medium">The mobile number where payment confirmation SMSs are received.</p>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                       <input 
                         type="checkbox" 
                         id="momoActive" 
                         checked={momoConfig.isActive}
                         onChange={(e) => setMomoConfig({...momoConfig, isActive: (e.target as HTMLInputElement).checked})}
                         className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                       />
                       <Label htmlFor="momoActive" className="text-xs font-bold text-slate-700 cursor-pointer">Enable MTN MoMo payments on Parent Portal</Label>
                    </div>
                 </CardContent>
              </Card>

              {/* Bank Config */}
              <Card className="border-blue-100 shadow-sm">
                 <CardHeader className="bg-blue-50/50 border-b border-blue-100">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">
                             <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                             <CardTitle className="text-lg">Bank Transfer Settings</CardTitle>
                             <CardDescription className="text-blue-700/70">EFT & Direct Deposits</CardDescription>
                          </div>
                       </div>
                       <Badge className={bankConfig.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}>
                          {bankConfig.isActive ? "Live" : "Inactive"}
                       </Badge>
                    </div>
                 </CardHeader>
                 <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2 col-span-2">
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input 
                             id="bankName" 
                             placeholder="FNB, Standard Bank, etc." 
                             value={bankConfig.bankName}
                             onChange={(e) => setBankConfig({...bankConfig, bankName: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2 col-span-2">
                          <Label htmlFor="accName">Account Holder Name</Label>
                          <Input 
                             id="accName" 
                             placeholder="Official School Account Name" 
                             value={bankConfig.accountName}
                             onChange={(e) => setBankConfig({...bankConfig, accountName: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <Label htmlFor="accNumber">Account Number</Label>
                          <Input 
                             id="accNumber" 
                             placeholder="0000000000" 
                             value={bankConfig.accountNumber}
                             onChange={(e) => setBankConfig({...bankConfig, accountNumber: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <Label htmlFor="branchCode">Branch Code</Label>
                          <Input 
                             id="branchCode" 
                             placeholder="280164" 
                             value={bankConfig.branchCode}
                             onChange={(e) => setBankConfig({...bankConfig, branchCode: e.target.value})}
                          />
                       </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                       <input 
                         type="checkbox" 
                         id="bankActive" 
                         checked={bankConfig.isActive}
                         onChange={(e) => setBankConfig({...bankConfig, isActive: (e.target as HTMLInputElement).checked})}
                         className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                       />
                       <Label htmlFor="bankActive" className="text-xs font-bold text-slate-700 cursor-pointer">Enable Bank Transfers on Parent Portal</Label>
                    </div>
                 </CardContent>
              </Card>
           </div>

           <Card className="bg-slate-900 border-none text-white overflow-hidden">
              <div className="p-8 flex items-center justify-between relative">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                 <div className="relative z-10 flex gap-6 items-start">
                    <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                       <ShieldCheck className="h-8 w-8 text-blue-300" />
                    </div>
                    <div>
                       <h4 className="text-xl font-bold mb-2">Security & Verification</h4>
                       <p className="text-slate-400 text-sm max-w-xl">
                          All sensitive financial data is encrypted and saved securely in your private school partition. 
                          Changes to bank details may require verification via email for added security.
                       </p>
                    </div>
                 </div>
                 <Button variant="outline" className="relative z-10 border-white/20 text-white hover:bg-white/10 font-bold">
                    View Activity Log
                 </Button>
              </div>
           </Card>
        </TabsContent>

        <TabsContent value="overview">
           <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                 <CardTitle className="mb-2">Financial Status</CardTitle>
                 <CardDescription>Consolidated view of your school's liquidity and receivables.</CardDescription>
                 <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                       <span className="text-sm text-slate-500">Term 1 Targeted</span>
                       <span className="font-bold">E250,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                       <span className="text-sm text-emerald-700">Term 1 Realized</span>
                       <span className="font-bold text-emerald-700">E185,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                       <span className="text-sm text-amber-700">Pending Collection</span>
                       <span className="font-bold text-amber-700">E65,000</span>
                    </div>
                 </div>
              </Card>
              <Card className="p-6">
                 <CardTitle className="mb-2">Payment Methods Split</CardTitle>
                 <CardDescription>How parents are paying their fees this term.</CardDescription>
                 <div className="mt-6 space-y-4">
                    <div className="space-y-1.5">
                       <div className="flex justify-between text-xs font-bold">
                          <span>MTN Mobile Money</span>
                          <span>65%</span>
                       </div>
                       <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 w-[65%]" />
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <div className="flex justify-between text-xs font-bold">
                          <span>Bank & EFT</span>
                          <span>25%</span>
                       </div>
                       <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-[25%]" />
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <div className="flex justify-between text-xs font-bold">
                          <span>Cash/Hand</span>
                          <span>10%</span>
                       </div>
                       <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-400 w-[10%]" />
                       </div>
                    </div>
                 </div>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="setup-guide" className="space-y-6">
           <Card className="border-blue-100 shadow-md overflow-hidden outline outline-4 outline-blue-50/50">
              <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                       <ListChecks className="h-6 w-6" />
                    </div>
                    <div>
                       <CardTitle className="text-2xl font-bold">Payment Setup Guide</CardTitle>
                       <CardDescription className="text-slate-500">Configure your accounts to start receiving fee payments digitally.</CardDescription>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="p-8">
                 <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <div>
                          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                             <div className="h-6 w-6 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center text-xs font-bold">1</div>
                             MTN Mobile Money Setup
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed mb-6">
                             Enable parents to pay fees via MTN MoMo directly from the portal. You'll need an active Merchant ID from MTN Eswatini.
                          </p>
                          <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                             <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                <span className="text-xs text-slate-700">Registered Business Name (School Certificate)</span>
                             </div>
                             <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                <span className="text-xs text-slate-700">Director's ID Copy & Proof of Residence</span>
                             </div>
                             <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                <span className="text-xs text-slate-700">Recent Bank Statement (for payouts)</span>
                             </div>
                          </div>
                       </div>

                       <Dialog>
                          <DialogTrigger>
                             <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 shadow-md">
                                Launch Detailed Step-by-Step <ArrowRight className="ml-2 h-4 w-4" />
                             </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl sm:rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                             <div className="bg-blue-600 p-8 text-white">
                                <DialogHeader>
                                   <DialogTitle className="text-3xl font-black mb-2">Step-by-Step Payment Integration</DialogTitle>
                                   <DialogDescription className="text-blue-100 text-lg">
                                      Follow these precise steps to get your school fully operational for online fees.
                                   </DialogDescription>
                                </DialogHeader>
                             </div>
                             <div className="p-8 overflow-y-auto max-h-[70vh]">
                                <div className="space-y-10">
                                   <section className="space-y-4">
                                      <h3 className="text-xl font-bold text-slate-900 border-b pb-2 flex items-center gap-3">
                                         <span className="bg-amber-400 text-amber-900 h-8 w-8 rounded-full flex items-center justify-center font-black">1</span>
                                         MTN MoMo Integration
                                      </h3>
                                      <div className="space-y-4 text-sm text-slate-600">
                                         <div className="flex gap-4">
                                            <div className="font-bold text-blue-600 shrink-0">Step A:</div>
                                            <p>Visit any MTN Service Center in Mbabane, Manzini, or Nhlangano. Request for a **MoMo Merchant/MoMo Pay Application Form**.</p>
                                         </div>
                                         <div className="flex gap-4">
                                            <div className="font-bold text-blue-600 shrink-0">Step B:</div>
                                            <p>Submit your School Registration and ID documents. Ensure you specify you intend to use it for **Educational/Fee Collections**.</p>
                                         </div>
                                         <div className="flex gap-4">
                                            <div className="font-bold text-blue-600 shrink-0">Step C:</div>
                                            <p>Once approved, you will receive a **Merchant ID**. Enter this ID in the platform's *Finance Settings* panel to link your account.</p>
                                         </div>
                                         <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-blue-700 font-medium">
                                            <Info className="h-5 w-5 shrink-0" />
                                            <p>Need tech help? MTN Fintech developers can be reached at fintech@mtn.sz for API questions.</p>
                                         </div>
                                      </div>
                                   </section>

                                   <section className="space-y-4">
                                      <h3 className="text-xl font-bold text-slate-900 border-b pb-2 flex items-center gap-3">
                                         <span className="bg-blue-600 text-white h-8 w-8 rounded-full flex items-center justify-center font-black">2</span>
                                         Bank Details Configuration
                                      </h3>
                                      <div className="space-y-4 text-sm text-slate-600">
                                         <div className="flex gap-4">
                                            <div className="font-bold text-blue-600 shrink-0">Step A:</div>
                                            <p>Go to your school's **Admin Settings &gt; Banking** section.</p>
                                         </div>
                                         <div className="flex gap-4">
                                            <div className="font-bold text-blue-600 shrink-0">Step B:</div>
                                            <p>Input your official bank account details (Standard Bank, FNB, Nedbank, Swazi Bank). **Double check account number & branch code**.</p>
                                         </div>
                                         <div className="flex gap-4">
                                            <div className="font-bold text-blue-600 shrink-0">Step C:</div>
                                            <p>Upload a **scanned voided check or bank confirmation letter** to verify the account for the system automated proof-of-payment checks.</p>
                                         </div>
                                      </div>
                                   </section>

                                   <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-center justify-between">
                                      <div>
                                         <p className="font-bold text-lg">Facing difficulties?</p>
                                         <p className="text-slate-400 text-sm">Our finance specialists can help you set this up in 10 mins.</p>
                                      </div>
                                      <Button className="bg-blue-600 hover:bg-blue-700 gap-2 font-bold">
                                         <MessageSquare className="h-4 w-4" /> Chat Support
                                      </Button>
                                   </div>
                                </div>
                             </div>
                             <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                                <Button onClick={() => {}} className="bg-slate-900 hover:bg-slate-800 text-white px-8 font-bold rounded-xl">Got it, thanks!</Button>
                             </div>
                          </DialogContent>
                       </Dialog>
                    </div>

                    <div className="space-y-6">
                       <div>
                          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                             <div className="h-6 w-6 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center text-xs font-bold">2</div>
                             Bank Transfer Configuration
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed mb-6">
                             Configure your school's bank credentials for parents who prefer EFT or direct branch deposits.
                          </p>
                          
                          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                             <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Active Verification Status</span>
                                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 shadow-none">Active</Badge>
                             </div>
                             <div className="p-5 space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                   <span className="text-slate-500">Manual POP Verification</span>
                                   <span className="font-bold text-emerald-600 flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Enabled</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                   <span className="text-slate-500">Auto-Reconciliation</span>
                                   <span className="font-bold text-rose-500 flex items-center gap-1.5"><AlertTriangle className="h-4 w-4" /> Action Required</span>
                                </div>
                                <Button variant="outline" className="w-full text-xs font-bold border-slate-200 hover:bg-slate-50 h-10">
                                   Manage Banking Information
                                </Button>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="mt-12 pt-12 border-t border-slate-100">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-blue-50/50 p-6 rounded-[2rem]">
                       <div className="flex items-center gap-4">
                          <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-md">
                             <CreditCard className="h-7 w-7 text-blue-600" />
                          </div>
                          <div>
                             <h4 className="font-extrabold text-slate-900">Need immediate cash access?</h4>
                             <p className="text-sm text-slate-500">Request account verification for next-day payouts.</p>
                          </div>
                       </div>
                       <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-10 font-bold h-14">
                          Request Verification
                       </Button>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

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


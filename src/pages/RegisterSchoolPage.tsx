import React, { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CreditCard, Smartphone, Building2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { createDocument, fetchDocument } from "@/lib/firestoreUtils";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { PricingTier, PRICING_TIERS } from "@/components/PricingTier";

export function RegisterSchoolPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();
  
  const requestedPlan = searchParams.get("plan");
  const initialPlanId = PRICING_TIERS.some(p => p.id === requestedPlan) ? (requestedPlan as string) : "standard";

  const [step, setStep] = useState<"details" | "plan">("plan");
  const [paymentMethod, setPaymentMethod] = useState<"momo" | "bank" | "card">("momo");
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    PRICING_TIERS.find(p => p.id === initialPlanId)?.features || []
  );
  const [billingCycle, setBillingCycle] = useState<"monthly" | "termly" | "annual">("monthly");

  const [platformPayment, setPlatformPayment] = useState({
    momoNumber: import.meta.env.VITE_MOMO_NUMBER || "7600 0000",
    momoName: import.meta.env.VITE_MOMO_NAME || "Preschools Eswatini Ltd",
    bankName: import.meta.env.VITE_BANK_NAME || "FNB Eswatini",
    accountName: import.meta.env.VITE_BANK_ACCOUNT_NAME || "Preschools Eswatini",
    accountNumber: import.meta.env.VITE_BANK_ACCOUNT_NUMBER || "62000000000",
    branchCode: import.meta.env.VITE_BANK_BRANCH_CODE || "280164 (Mbabane)",
    supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || "accounts@preschools.sz",
    whatsappNumber: "7600 0000"
  });

  useEffect(() => {
    loadPlatformConfig();
  }, []);

  const loadPlatformConfig = async () => {
    try {
      const config = await fetchDocument("system_settings", "payment_info") as any;
      if (config) {
        setPlatformPayment(prev => ({
          ...prev,
          momoNumber: config.momoNumber || prev.momoNumber,
          momoName: config.momoName || prev.momoName,
          bankName: config.bankName || prev.bankName,
          accountName: config.accountName || prev.accountName,
          accountNumber: config.accountNumber || prev.accountNumber,
          branchCode: config.branchCode || prev.branchCode,
          supportEmail: config.supportEmail || prev.supportEmail
        }));
      }
    } catch (error) {
      console.error("Error loading config:", error);
    }
  };
  
  const [formData, setFormData] = useState({
    schoolName: "",
    principalName: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "plan") {
      setStep("details");
      return;
    }

    setLoading(true);
    try {
      // 1. Create registration record in Firestore
      await createDocument("school_registrations", null, {
        ...formData,
        userId: user?.uid || null,
        planId: selectedPlanId,
        features: selectedFeatures,
        billingCycle,
        paymentMethod,
        status: paymentMethod === 'card' ? "pending_card_session" : "pending_manual_verification",
        createdAt: new Date().toISOString()
      });

      // 2. Handle Payment Path
      if (paymentMethod === 'card') {
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId: selectedPlanId,
            billingCycle,
            schoolName: formData.schoolName,
            email: formData.email
          }),
        });

        const session = await response.json();
        if (session.url) {
          window.location.href = session.url;
          return;
        } else {
          // If card checkout fails or Stripe isn't configured in Eswatini, fall back to manual instructions
          setSubmitted(true);
          toast.info("Card checkout session unavailable. Please complete your registration via MTN MoMo or Bank EFT.");
        }
      } else {
        // Primary local payment path (MTN MoMo or Bank Transfer)
        setSubmitted(true);
        toast.success("Application submitted! Please complete the local payment via MoMo or EFT to activate your profile.");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(err.message || "Failed to initiate registration and payment.");
    } finally {
      setLoading(false);
    }
  };

  const selectedPlan = PRICING_TIERS.find(p => p.id === selectedPlanId) || PRICING_TIERS[0];
  const priceToPay = billingCycle === 'termly' 
    ? selectedPlan.price.termly?.t1 
    : billingCycle === 'annual' 
    ? selectedPlan.price.annual 
    : selectedPlan.price.monthly;

  return (
    <div className={`mx-auto py-12 px-4 ${step === 'plan' && !submitted ? 'max-w-7xl' : 'max-w-2xl'}`}>
      <SEO title="Register School | Preschools Eswatini Platform" />
      
      {submitted ? (
        <div className="mx-auto max-w-2xl text-center flex flex-col items-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Application Received!</h1>
          <p className="text-slate-600 mt-4 text-lg">
            Your registration for <strong>{formData.schoolName || 'your school'}</strong> ({selectedPlan.name} Plan) has been submitted. Follow the local payment instructions below to verify your account.
          </p>
          
          <div className="mt-8 bg-slate-50 border border-slate-200 rounded-3xl p-8 text-left w-full shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Selected Plan</p>
                <p className="text-xl font-black text-slate-900">{selectedPlan.name} ({billingCycle === 'monthly' ? 'Monthly' : billingCycle === 'annual' ? 'Annual' : 'Termly'})</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">First Payment Amount</p>
                <p className="text-2xl font-black text-blue-600">E{priceToPay?.toLocaleString()}.00</p>
              </div>
            </div>
            
            {paymentMethod === 'momo' ? (
              <div className="space-y-4">
                <div className="bg-yellow-50/80 border border-yellow-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="h-6 w-6 rounded-full bg-yellow-400 text-yellow-950 font-black text-xs flex items-center justify-center">Mo</span>
                    <p className="text-xs font-black uppercase text-yellow-900 tracking-wider">Primary Payment: MTN Mobile Money</p>
                  </div>
                  <p className="text-2xl font-black text-slate-900">Send to: {platformPayment.momoNumber}</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">Account Name: {platformPayment.momoName}</p>
                  <div className="mt-3 bg-white p-3 rounded-xl border border-yellow-100 text-xs text-slate-600 space-y-1">
                    <p><strong>Reference:</strong> Use <span className="font-mono font-bold text-blue-600">{formData.schoolName || 'School Name'}</span> as the payment reference.</p>
                    <p><strong>Tariff Note:</strong> Standard published MTN Eswatini MoMo tariffs apply.</p>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Next Step: Send Proof of Payment (POP)</p>
                    <p className="mt-1">
                      WhatsApp your confirmation SMS or receipt to <strong>{platformPayment.whatsappNumber}</strong> or email <strong>{platformPayment.supportEmail}</strong>. Your school site and dashboard will be activated within 2-4 hours.
                    </p>
                  </div>
                </div>
              </div>
            ) : paymentMethod === 'bank' ? (
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                  <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Electronic Funds Transfer (EFT)</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <span className="text-slate-500">Bank:</span> <span className="font-bold text-slate-900">{platformPayment.bankName}</span>
                    <span className="text-slate-500">Account Name:</span> <span className="font-bold text-slate-900">{platformPayment.accountName}</span>
                    <span className="text-slate-500">Account Number:</span> <span className="font-mono font-bold text-slate-900">{platformPayment.accountNumber}</span>
                    <span className="text-slate-500">Branch Code:</span> <span className="font-mono font-bold text-slate-900">{platformPayment.branchCode}</span>
                    <span className="text-slate-500">Reference:</span> <span className="font-bold text-blue-600">{formData.schoolName || 'School Name'}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic">
                  * Email your bank Proof of Payment (POP) to <strong>{platformPayment.supportEmail}</strong> or WhatsApp to <strong>{platformPayment.whatsappNumber}</strong> for rapid activation.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-slate-600 bg-white p-5 rounded-2xl border border-slate-200">
                <p className="font-bold text-slate-900">Card / Online Payment Details</p>
                <p>Card checkout is ready for international Visa &amp; Mastercard transactions. If you encountered an issue with your card, you may also complete payment via MTN Mobile Money ({platformPayment.momoNumber}).</p>
              </div>
            )}
          </div>

          <div className="mt-10 flex gap-4">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 rounded-xl">
              <Link to="/directory">Browse School Directory</Link>
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={() => setSubmitted(false)}>
              Back to Registration
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-2">
              🇸🇿 Preschools Eswatini Onboarding
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              {step === "plan" ? "Choose Your Preschool Plan" : "Complete School Details"}
            </h1>
            <p className="text-slate-600 mt-1">
              {step === "plan" 
                ? "Select a plan that best fits your school. All plans include 14 to 30 days free trial with zero upfront development fees."
                : "Enter your preschool's contact information to create your school portal and web presence."
              }
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {step === "details" ? (
              <div className="space-y-5">
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase text-slate-400">Selected Package</span>
                    <h4 className="font-extrabold text-slate-900 text-lg">{selectedPlan.name} Plan (E{priceToPay}/cycle)</h4>
                  </div>
                  <Button variant="outline" size="sm" type="button" onClick={() => setStep("plan")} className="rounded-xl text-xs font-bold">
                    Change Plan
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">Preschool / Centre Name *</Label>
                    <Input id="schoolName" required value={formData.schoolName} onChange={handleChange} placeholder="e.g. Little Explorers Preschool" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="principalName">Principal / Administrator Name *</Label>
                    <Input id="principalName" required value={formData.principalName} onChange={handleChange} placeholder="e.g. Sarah Dlamini" className="rounded-xl" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Official Email Address *</Label>
                    <Input id="email" type="email" required value={formData.email} onChange={handleChange} placeholder="principal@school.sz" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Official Phone / WhatsApp Number *</Label>
                    <Input id="phone" type="tel" required value={formData.phone} onChange={handleChange} placeholder="+268 7600 0000" className="rounded-xl" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Special Requirements or Notes (Optional)</Label>
                  <Textarea id="message" value={formData.message} onChange={handleChange} placeholder="Tell us about your campus location, grades taught, or domain preferences..." className="rounded-xl" />
                </div>

                <div className="pt-4 flex gap-3">
                  <Button variant="ghost" type="button" className="text-slate-500 rounded-xl h-12" onClick={() => setStep("plan")}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Packages
                  </Button>
                  <Button type="submit" className="flex-1 h-12 text-base font-extrabold rounded-xl bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Complete Registration & Get Started"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <PricingTier 
                  selectedPlan={selectedPlanId}
                  onSelectPlan={(plan, features) => {
                    setSelectedPlanId(plan);
                    setSelectedFeatures(features);
                  }}
                  billingCycle={billingCycle}
                  onBillingCycleChange={setBillingCycle}
                />

                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-black uppercase text-slate-500 tracking-widest">
                      Preferred Eswatini Payment Method
                    </Label>
                    <span className="text-[11px] font-bold text-blue-600">Local Mobile Money &amp; EFT Aligned</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { 
                        id: 'momo', 
                        label: 'MTN Mobile Money', 
                        sub: 'Primary Eswatini Method (Local Tariffs)', 
                        badge: 'Recommended',
                        icon: <Smartphone className="h-5 w-5 text-yellow-500" /> 
                      },
                      { 
                        id: 'bank', 
                        label: 'Bank Transfer (EFT)', 
                        sub: 'FNB, Standard Bank, Nedbank Eswatini', 
                        badge: 'Direct',
                        icon: <Building2 className="h-5 w-5 text-blue-600" /> 
                      },
                      { 
                        id: 'card', 
                        label: 'International Card', 
                        sub: 'Visa / Mastercard (Stripe Ready)', 
                        badge: 'Online',
                        icon: <CreditCard className="h-5 w-5 text-slate-500" /> 
                      },
                    ].map((method) => (
                      <div 
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all gap-1.5 relative ${
                          paymentMethod === method.id 
                            ? 'border-blue-600 bg-blue-50/40 text-blue-900 shadow-sm' 
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          {method.icon}
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            paymentMethod === method.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {method.badge}
                          </span>
                        </div>
                        <span className="text-sm font-extrabold text-slate-900 mt-1">{method.label}</span>
                        <span className="text-[11px] text-slate-500 leading-tight">{method.sub}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full h-14 text-lg font-extrabold rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20" disabled={loading}>
                  Continue with {selectedPlan.name} Plan (14-Day Free Trial)
                </Button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

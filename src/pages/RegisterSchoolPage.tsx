import React, { useState, useEffect } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CreditCard, Smartphone, Building2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createDocument, fetchDocument } from "@/lib/firestoreUtils";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { PricingTier, PRICING_TIERS } from "@/components/PricingTier";

export function RegisterSchoolPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();
  
  const [step, setStep] = useState<"details" | "plan">("plan");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "momo" | "bank">("card");
  const [selectedPlanId, setSelectedPlanId] = useState("basic");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['attendance', 'admissions', 'finance', 'communication']);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const [platformPayment, setPlatformPayment] = useState({
    momoNumber: import.meta.env.VITE_MOMO_NUMBER || "7600 0000",
    momoName: import.meta.env.VITE_MOMO_NAME || "Preschools Eswatini Ltd",
    bankName: import.meta.env.VITE_BANK_NAME || "FNB Swaziland",
    accountName: import.meta.env.VITE_BANK_ACCOUNT_NAME || "Preschools Eswatini",
    accountNumber: import.meta.env.VITE_BANK_ACCOUNT_NUMBER || "6200000000",
    branchCode: import.meta.env.VITE_BANK_BRANCH_CODE || "280164 (Mbabane)",
    supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || "accounts@preschools.sz"
  });

  useEffect(() => {
    loadPlatformConfig();
  }, []);

  const loadPlatformConfig = async () => {
    try {
      const config = await fetchDocument("system_settings", "payment_info") as any;
      if (config) {
        setPlatformPayment({
          momoNumber: config.momoNumber || platformPayment.momoNumber,
          momoName: config.momoName || platformPayment.momoName,
          bankName: config.bankName || platformPayment.bankName,
          accountName: config.accountName || platformPayment.accountName,
          accountNumber: config.accountNumber || platformPayment.accountNumber,
          branchCode: config.branchCode || platformPayment.branchCode,
          supportEmail: config.supportEmail || platformPayment.supportEmail
        });
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
      // 1. Create registration record
      await createDocument("school_registrations", null, {
        ...formData,
        userId: user?.uid || null,
        planId: selectedPlanId,
        features: selectedFeatures,
        billingCycle,
        paymentMethod,
        status: paymentMethod === 'card' ? "pending_payment" : "pending_manual_verification",
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
          throw new Error(session.error || "Failed to create checkout session");
        }
      } else {
        // Manual payment path
        setSubmitted(true);
        toast.success("Application submitted! Please complete the payment to activate your profile.");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(err.message || "Failed to initiate registration and payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <SEO title="Register School | Preschools Eswatini Platform" />
      
      {submitted ? (
        <div className="mx-auto max-w-2xl text-center flex flex-col items-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Application Received!</h1>
          <p className="text-slate-600 mt-4 text-lg">
            {paymentMethod === 'card' 
              ? "Thank you for your registration. Once your card payment is confirmed, your profile will be activated."
              : "Your registration is pending payment verification. Please use the instructions below to complete your transaction."
            }
          </p>
          
          {paymentMethod !== 'card' && (
            <div className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl p-8 text-left w-full">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                How to pay E{PRICING_TIERS.find(p => p.id === selectedPlanId)?.price[billingCycle]}:
              </h3>
              
              {paymentMethod === 'momo' ? (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">MTN Mobile Money</p>
                    <p className="text-lg font-bold text-slate-900">Send to: {platformPayment.momoNumber}</p>
                    <p className="text-xs text-slate-500">Name: {platformPayment.momoName}</p>
                  </div>
                  <p className="text-sm text-slate-600 italic leading-relaxed">
                    * Please use your school name as the reference in the MoMo description. 
                    Your account will be activated within 24 hours of verification.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-2">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Bank Details ({platformPayment.bankName})</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <span className="text-slate-500">Bank:</span> <span className="font-bold">{platformPayment.bankName}</span>
                      <span className="text-slate-500">Acc Name:</span> <span className="font-bold">{platformPayment.accountName}</span>
                      <span className="text-slate-500">Acc Number:</span> <span className="font-bold">{platformPayment.accountNumber}</span>
                      <span className="text-slate-500">Branch:</span> <span className="font-bold">{platformPayment.branchCode}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 italic">
                    * Email proof of payment (POP) to <strong>{platformPayment.supportEmail}</strong> for faster approval.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-10 flex gap-4">
            <Button asChild>
              <Link to="/directory">Browse Schools</Link>
            </Button>
            <Button variant="outline" onClick={() => setSubmitted(false)}>
              Back to Form
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {step === "plan" ? "Select Your Package" : "Register Your School"}
            </h1>
            <p className="text-slate-600 mt-2">
              {step === "plan" 
                ? "Choose a plan that fits your school's size and needs."
                : "Join the Preschools Eswatini platform and start digitizing your preschool's operations."
              }
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === "details" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input id="schoolName" required value={formData.schoolName} onChange={handleChange} placeholder="Enter school name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="principalName">Principal Name</Label>
                    <Input id="principalName" required value={formData.principalName} onChange={handleChange} placeholder="Enter principal name" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" required value={formData.email} onChange={handleChange} placeholder="school@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" required value={formData.phone} onChange={handleChange} placeholder="+268 ..." />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Additional Information</Label>
                  <Textarea id="message" value={formData.message} onChange={handleChange} placeholder="Tell us more about your school..." />
                </div>
                <Button variant="ghost" type="button" className="w-full text-slate-500 h-10" onClick={() => setStep("plan")}>
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Packages
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <PricingTier 
                  selectedPlan={selectedPlanId}
                  onSelectPlan={(plan, features) => {
                    setSelectedPlanId(plan);
                    setSelectedFeatures(features);
                  }}
                  billingCycle={billingCycle}
                  onBillingCycleChange={setBillingCycle}
                />

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Select Payment Method</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'card', label: 'Credit/Debit', icon: <CreditCard className="h-4 w-4" /> },
                      { id: 'momo', label: 'MTN MoMo', icon: <Smartphone className="h-4 w-4" /> },
                      { id: 'bank', label: 'Bank Transfer', icon: <Building2 className="h-4 w-4" /> },
                    ].map((method) => (
                      <div 
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all gap-2 ${paymentMethod === method.id ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                      >
                        {method.icon}
                        <span className="text-[10px] font-black uppercase">{method.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={loading}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : step === "plan" ? "Select Package & Continue" : "Pay & Complete Registration"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import { 
  X, 
  CheckCircle2, 
  Copy, 
  UploadCloud, 
  Smartphone, 
  Building, 
  CreditCard, 
  RefreshCw, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  FileText, 
  Download, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  Info,
  Check,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DEFAULT_PLATFORM_PAYMENT_CONFIG, 
  generateInvoiceReference, 
  generateInvoiceNumber,
  calculatePlanAmount,
  submitPaymentVerification,
  PaymentMethodId,
  PlatformPaymentConfig
} from "@/lib/paymentUtils";
import { fetchDocument } from "@/lib/firestoreUtils";

interface LocalPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId?: string;
  planName?: string;
  billingCycle?: 'monthly' | 'termly' | 'annual';
  customAmount?: number;
  invoiceNumber?: string;
  schoolId?: string;
  schoolName?: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  onSuccess?: (referenceNumber: string) => void;
}

export function LocalPaymentModal({
  isOpen,
  onClose,
  planId = "starter",
  planName = "Starter Plan",
  billingCycle = "monthly",
  customAmount,
  invoiceNumber,
  schoolId,
  schoolName = "My Preschool",
  userEmail = "",
  userName = "",
  userPhone = "",
  onSuccess
}: LocalPaymentModalProps) {
  const [activeTab, setActiveTab] = useState<'momo' | 'bank' | 'card' | 'recurring'>('momo');
  const [selectedMomo, setSelectedMomo] = useState<'mtn' | 'emali' | 'airtel'>('mtn');
  const [selectedBank, setSelectedBank] = useState<'fnb' | 'standard' | 'nedbank' | 'eswatiniBank'>('fnb');
  
  // Custom reference number for this session: e.g. PES-2026-00841
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [config, setConfig] = useState<PlatformPaymentConfig>(DEFAULT_PLATFORM_PAYMENT_CONFIG);

  // Form submission state
  const [senderIdentifier, setSenderIdentifier] = useState<string>("");
  const [customerNotes, setCustomerNotes] = useState<string>("");
  const [proofFile, setProofFile] = useState<{ name: string; type: string; dataUrl: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Card checkout simulator state
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCvc, setCardCvc] = useState<string>("");
  const [cardProcessing, setCardProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize reference number whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setReferenceNumber(generateInvoiceReference());
      setSubmitSuccess(false);
      setErrorMessage("");
      setProofFile(null);
      setSenderIdentifier(userPhone || "");
      
      // Load any customized platform payment info from Firestore
      fetchDocument("system_settings", "payment_info").then((data) => {
        if (data) {
          setConfig({
            ...DEFAULT_PLATFORM_PAYMENT_CONFIG,
            ...data
          });
        }
      }).catch(() => {
        // Fallback to defaults
      });
    }
  }, [isOpen, userPhone]);

  if (!isOpen) return null;

  const totalAmount = customAmount !== undefined ? customAmount : calculatePlanAmount(planId, billingCycle);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage("File size exceeds 8MB. Please select a smaller screenshot or PDF.");
      return;
    }

    setErrorMessage("");
    const reader = new FileReader();
    reader.onload = () => {
      setProofFile({
        name: file.name,
        type: file.type,
        dataUrl: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage("File size exceeds 8MB. Please select a smaller screenshot or PDF.");
      return;
    }

    setErrorMessage("");
    const reader = new FileReader();
    reader.onload = () => {
      setProofFile({
        name: file.name,
        type: file.type,
        dataUrl: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofFile && activeTab !== 'card') {
      setErrorMessage("Please upload your Proof of Payment (Screenshot, Receipt SMS, or Bank Slip).");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      let paymentMethodKey: PaymentMethodId = 'momo_mtn';
      let methodLabel = "MTN MoMo";

      if (activeTab === 'momo') {
        if (selectedMomo === 'mtn') {
          paymentMethodKey = 'momo_mtn';
          methodLabel = `MTN MoMo (${config.momoNumber})`;
        } else if (selectedMomo === 'emali') {
          paymentMethodKey = 'emali';
          methodLabel = `e-Mali Eswatini Mobile (${config.emaliNumber})`;
        } else {
          paymentMethodKey = 'airtel';
          methodLabel = `Airtel Money (${config.airtelNumber})`;
        }
      } else if (activeTab === 'bank') {
        if (selectedBank === 'fnb') {
          paymentMethodKey = 'bank_fnb';
          methodLabel = `FNB Eswatini (Acc ${config.banks.fnb.accountNumber})`;
        } else if (selectedBank === 'standard') {
          paymentMethodKey = 'bank_standard';
          methodLabel = `Standard Bank (Acc ${config.banks.standard.accountNumber})`;
        } else if (selectedBank === 'nedbank') {
          paymentMethodKey = 'bank_nedbank';
          methodLabel = `Nedbank Eswatini (Acc ${config.banks.nedbank.accountNumber})`;
        } else {
          paymentMethodKey = 'bank_eswatini';
          methodLabel = `Eswatini Bank (Acc ${config.banks.eswatiniBank.accountNumber})`;
        }
      } else if (activeTab === 'card') {
        paymentMethodKey = 'card';
        methodLabel = `Card Online Payment (Ref: ${referenceNumber})`;
      }

      await submitPaymentVerification({
        referenceNumber,
        invoiceNumber: generateInvoiceNumber(referenceNumber),
        schoolId,
        schoolName,
        submitterName: userName || schoolName,
        submitterEmail: userEmail,
        submitterPhone: userPhone || senderIdentifier,
        planId,
        planName,
        billingCycle,
        amount: totalAmount,
        currency: "SZL",
        paymentMethod: paymentMethodKey,
        paymentMethodLabel: methodLabel,
        senderAccountOrNumber: senderIdentifier,
        proofOfPaymentUrl: proofFile?.dataUrl || "",
        proofOfPaymentFileName: proofFile?.name || (activeTab === 'card' ? 'Online Card Authorization' : 'POP.png'),
        proofOfPaymentFileType: proofFile?.type || 'image/png',
        notes: customerNotes
      });

      setSubmitSuccess(true);
      if (onSuccess) {
        onSuccess(referenceNumber);
      }
    } catch (err: any) {
      console.error("Payment proof submission error:", err);
      setErrorMessage(err.message || "Failed to submit verification request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || cardNumber.length < 15) {
      setErrorMessage("Please enter a valid card number.");
      return;
    }
    setCardProcessing(true);
    setErrorMessage("");

    setTimeout(async () => {
      setCardProcessing(false);
      // Auto submit proof record as authorized card checkout
      try {
        await submitPaymentVerification({
          referenceNumber,
          invoiceNumber: generateInvoiceNumber(referenceNumber),
          schoolId,
          schoolName,
          submitterName: userName || schoolName,
          submitterEmail: userEmail,
          submitterPhone: userPhone || senderIdentifier,
          planId,
          planName,
          billingCycle,
          amount: totalAmount,
          currency: "SZL",
          paymentMethod: 'card',
          paymentMethodLabel: `Card •••• ${cardNumber.slice(-4)} (Eswatini Merchant Gateway)`,
          senderAccountOrNumber: `Card ending ${cardNumber.slice(-4)}`,
          notes: `Authorized via Eswatini Local Card Switch. Expiry: ${cardExpiry}`,
          proofOfPaymentFileName: `Card_Auth_${referenceNumber}.pdf`
        });
        setSubmitSuccess(true);
        if (onSuccess) onSuccess(referenceNumber);
      } catch (err: any) {
        setErrorMessage("Card verification failed. Please try MoMo or Bank Transfer.");
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white relative">
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                  Eswatini Local Payment Gateway
                </span>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {billingCycle.toUpperCase()}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Pay by Bank / Mobile Money
              </h2>
              <p className="text-slate-300 text-sm mt-1">
                For {schoolName} • {planName}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-right min-w-[160px]">
              <span className="text-xs text-slate-300 font-medium block">Total Due:</span>
              <span className="text-3xl font-black text-white">E{totalAmount.toLocaleString()}</span>
              <span className="text-[11px] text-emerald-300 block font-semibold">
                {billingCycle === 'annual' ? 'Includes 2 Months Free' : `Billed per ${billingCycle}`}
              </span>
            </div>
          </div>

          {/* Reference Banner */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/30 flex items-center justify-center border border-blue-400/30 shrink-0">
                <FileText className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold block">
                  Your Required Payment Reference
                </span>
                <span className="text-lg sm:text-xl font-mono font-black text-amber-300 tracking-wider">
                  {referenceNumber}
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(referenceNumber)}
              className="bg-white/15 border-white/30 text-white hover:bg-white/25 hover:text-white shrink-0 text-xs font-bold gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied Reference!" : "Copy Reference"}
            </Button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {submitSuccess ? (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-amber-100 text-amber-700 border-2 border-amber-300 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                <Clock className="w-10 h-10 animate-pulse text-amber-600" />
              </div>

              <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black uppercase px-3 py-1 rounded-full mb-3 tracking-wider">
                Payment Verification Required
              </span>

              <h3 className="text-2xl font-black text-slate-900 mb-2">
                Proof of Payment Submitted Successfully!
              </h3>
              
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-lg mx-auto text-left mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Invoice Reference:</span>
                  <span className="font-mono font-bold text-slate-900">{referenceNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">School:</span>
                  <span className="font-bold text-slate-900">{schoolName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Plan & Amount:</span>
                  <span className="font-bold text-slate-900">{planName} (E{totalAmount.toLocaleString()})</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Verification Status:</span>
                  <span className="font-bold text-amber-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Pending SuperAdmin Approval
                  </span>
                </div>
              </div>

              <p className="text-slate-600 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Our billing team has received your verification request. An administrator will verify your payment and activate your subscription automatically.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={onClose}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl w-full sm:w-auto"
                >
                  Done / Return to Dashboard
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="border-emerald-500 text-emerald-700 hover:bg-emerald-50 font-bold px-6 py-2.5 rounded-xl w-full sm:w-auto gap-2"
                >
                  <a 
                    href={`https://wa.me/${config.supportWhatsApp.replace(/[^0-9]/g, '')}?text=Hi%20Preschools%20Eswatini,%20I%20have%20submitted%20proof%20of%20payment%20for%20reference:%20${referenceNumber}%20for%20${encodeURIComponent(schoolName)}`}
                    target="_blank" 
                    rel="noreferrer"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    WhatsApp POP to Support
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {/* Payment Channel Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => { setActiveTab('momo'); setErrorMessage(""); }}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-black transition-all ${
                    activeTab === 'momo'
                      ? 'bg-white text-blue-900 shadow-md border border-slate-200/80 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-amber-500" />
                  <span>Option 1: Mobile Money</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('bank'); setErrorMessage(""); }}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-black transition-all ${
                    activeTab === 'bank'
                      ? 'bg-white text-blue-900 shadow-md border border-slate-200/80 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Building className="w-4 h-4 text-blue-600" />
                  <span>Option 2: Bank Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('card'); setErrorMessage(""); }}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-black transition-all ${
                    activeTab === 'card'
                      ? 'bg-white text-blue-900 shadow-md border border-slate-200/80 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  <span>Option 3: Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('recurring'); setErrorMessage(""); }}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-black transition-all ${
                    activeTab === 'recurring'
                      ? 'bg-white text-blue-900 shadow-md border border-slate-200/80 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <RefreshCw className="w-4 h-4 text-emerald-600" />
                  <span>Option 4: Recurring</span>
                </button>
              </div>

              {/* Tab 1: Mobile Money Instructions */}
              {activeTab === 'momo' && (
                <div className="space-y-6">
                  {/* MoMo Provider Selector */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedMomo('mtn')}
                      className={`flex-1 p-3.5 rounded-2xl border text-left transition-all ${
                        selectedMomo === 'mtn'
                          ? 'border-amber-400 bg-amber-50/50 shadow-sm ring-2 ring-amber-400/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-slate-900 text-sm">MTN MoMo</span>
                        <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">Most Popular</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">Dial {config.momoDialCode} or MoMo App</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMomo('emali')}
                      className={`flex-1 p-3.5 rounded-2xl border text-left transition-all ${
                        selectedMomo === 'emali'
                          ? 'border-red-400 bg-red-50/50 shadow-sm ring-2 ring-red-400/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-slate-900 text-sm">e-Mali</span>
                        <span className="text-[10px] bg-red-500 text-white font-bold px-2 py-0.5 rounded-full">Eswatini Mobile</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">Dial {config.emaliDialCode} or e-Mali</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMomo('airtel')}
                      className={`flex-1 p-3.5 rounded-2xl border text-left transition-all ${
                        selectedMomo === 'airtel'
                          ? 'border-indigo-400 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-400/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-slate-900 text-sm">Airtel Money</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full">Regional</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">Cross-border transfers</p>
                    </button>
                  </div>

                  {/* MoMo Instructions Card */}
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5">
                    <h4 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-amber-600" />
                      Step-by-Step {selectedMomo === 'mtn' ? 'MTN MoMo' : selectedMomo === 'emali' ? 'e-Mali' : 'Airtel Money'} Instructions:
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
                      <div className="bg-white p-3.5 rounded-xl border border-amber-100 shadow-xs">
                        <span className="text-xs font-semibold text-slate-500 block">Recipient / MoMo Number</span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-base font-black text-slate-900">
                            {selectedMomo === 'mtn' ? config.momoNumber : selectedMomo === 'emali' ? config.emaliNumber : config.airtelNumber}
                          </span>
                          <button 
                            type="button"
                            onClick={() => copyToClipboard(selectedMomo === 'mtn' ? config.momoNumber : selectedMomo === 'emali' ? config.emaliNumber : config.airtelNumber)}
                            className="text-amber-700 hover:text-amber-900 text-xs font-bold flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" /> Copy
                          </button>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          Registered: {selectedMomo === 'mtn' ? config.momoName : config.emaliName}
                        </span>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-amber-100 shadow-xs">
                        <span className="text-xs font-semibold text-slate-500 block">Exact Amount to Send</span>
                        <span className="text-base font-black text-emerald-700 block mt-1">
                          E{totalAmount.toLocaleString()}.00
                        </span>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          SZL (Lilangeni / ZAR parity)
                        </span>
                      </div>
                    </div>

                    <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700 font-medium">
                      <li>
                        On your phone, dial <strong className="text-slate-900">{selectedMomo === 'mtn' ? config.momoDialCode : config.emaliDialCode}</strong> or open your mobile money app.
                      </li>
                      <li>
                        Select <strong>Send Money / Pay</strong> and enter the number <strong className="text-slate-900">{selectedMomo === 'mtn' ? config.momoNumber : config.emaliNumber}</strong>.
                      </li>
                      <li>
                        Enter exact amount <strong className="text-slate-900">E{totalAmount}</strong>.
                      </li>
                      <li>
                        In the reference / note field, enter your invoice reference: <strong className="text-amber-800 bg-amber-200/60 px-1.5 py-0.5 rounded font-mono">{referenceNumber}</strong>.
                      </li>
                      <li>
                        Confirm transfer with your MoMo PIN, take a screenshot of the confirmation SMS or receipt, and upload it below.
                      </li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Tab 2: Bank Transfer (EFT) Instructions */}
              {activeTab === 'bank' && (
                <div className="space-y-6">
                  {/* Bank Selector */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedBank('fnb')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        selectedBank === 'fnb'
                          ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-600/20 font-black text-blue-950'
                          : 'border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50'
                      } text-xs`}
                    >
                      FNB Eswatini
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedBank('standard')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        selectedBank === 'standard'
                          ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-600/20 font-black text-blue-950'
                          : 'border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50'
                      } text-xs`}
                    >
                      Standard Bank
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedBank('nedbank')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        selectedBank === 'nedbank'
                          ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-600/20 font-black text-blue-950'
                          : 'border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50'
                      } text-xs`}
                    >
                      Nedbank Eswatini
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedBank('eswatiniBank')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        selectedBank === 'eswatiniBank'
                          ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-600/20 font-black text-blue-950'
                          : 'border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50'
                      } text-xs`}
                    >
                      Eswatini Bank
                    </button>
                  </div>

                  {/* Selected Bank Details Card */}
                  {(() => {
                    const bank = config.banks[selectedBank];
                    return (
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                          <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                            <Building className="w-4 h-4 text-blue-600" />
                            {bank.bankName}
                          </h4>
                          <span className="text-[11px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-md">
                            {bank.accountType || "EFT / Cash Deposit"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
                          <div className="bg-white p-3 rounded-xl border border-slate-200">
                            <span className="text-slate-500 font-medium block">Account Name:</span>
                            <span className="font-bold text-slate-900 text-sm block mt-0.5">{bank.accountName}</span>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-slate-200">
                            <span className="text-slate-500 font-medium block">Account Number:</span>
                            <div className="flex items-center justify-between mt-0.5">
                              <span className="font-mono font-black text-slate-900 text-base">{bank.accountNumber}</span>
                              <button 
                                type="button"
                                onClick={() => copyToClipboard(bank.accountNumber)}
                                className="text-blue-600 hover:text-blue-800 text-[11px] font-bold flex items-center gap-1"
                              >
                                <Copy className="w-3 h-3" /> Copy
                              </button>
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-slate-200">
                            <span className="text-slate-500 font-medium block">Branch Code:</span>
                            <span className="font-mono font-bold text-slate-900 text-sm block mt-0.5">{bank.branchCode} ({bank.branchName || "Main"})</span>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-slate-200">
                            <span className="text-slate-500 font-medium block">Required Reference on Deposit:</span>
                            <div className="flex items-center justify-between mt-0.5">
                              <span className="font-mono font-black text-amber-700 text-sm">{referenceNumber}</span>
                              <button 
                                type="button"
                                onClick={() => copyToClipboard(referenceNumber)}
                                className="text-blue-600 hover:text-blue-800 text-[11px] font-bold flex items-center gap-1"
                              >
                                <Copy className="w-3 h-3" /> Copy
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium flex items-start gap-2">
                          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                          <span>
                            <strong>Important:</strong> Always use your unique reference <strong>{referenceNumber}</strong> when making the bank transfer or cash deposit. Upload the bank confirmation PDF or stamped deposit slip below.
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Tab 3: Card Gateway */}
              {activeTab === 'card' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-purple-600" />
                        Debit / Credit Card Payment Gateway
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] bg-white border border-slate-200 font-bold px-2 py-0.5 rounded text-slate-700">Visa</span>
                        <span className="text-[10px] bg-white border border-slate-200 font-bold px-2 py-0.5 rounded text-slate-700">Mastercard</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">3D Secure</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 mb-4">
                      Pay securely with any Visa or Mastercard debit/credit card issued in Eswatini or internationally.
                    </p>

                    <form onSubmit={handleCardSimulation} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                        <input
                          type="text"
                          placeholder="4000 1234 5678 9010"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          maxLength={19}
                          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            placeholder="12/28"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            maxLength={5}
                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">CVC / CVV</label>
                          <input
                            type="password"
                            placeholder="•••"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            maxLength={4}
                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white font-mono"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={cardProcessing}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl mt-2 flex items-center justify-center gap-2"
                      >
                        {cardProcessing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Authorizing E{totalAmount.toLocaleString()}...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            Pay E{totalAmount.toLocaleString()} via Card
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                </div>
              )}

              {/* Tab 4: Recurring Auto-Debit Roadmap */}
              {activeTab === 'recurring' && (
                <div className="space-y-4">
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 text-center">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                      <RefreshCw className="w-7 h-7 text-emerald-600" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mb-1">
                      Automatic Recurring Billing (Coming Soon)
                    </h4>
                    <p className="text-slate-600 text-xs max-w-md mx-auto mb-4 leading-relaxed">
                      We are partnering with the Eswatini National Payments Switch & local bank direct debit APIs to bring seamless monthly recurring billing straight to your account.
                    </p>
                    <div className="bg-white p-4 rounded-xl border border-emerald-100 max-w-md mx-auto text-left space-y-2 text-xs text-slate-700 mb-4">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> In the meantime:
                      </div>
                      <p>
                        You can pay <strong>termly (every 4 months)</strong> or <strong>annually (save 20% with 2 free months)</strong> via MTN MoMo, e-Mali, or Bank EFT to eliminate monthly admin overhead.
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={() => setActiveTab('momo')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-xl text-xs"
                    >
                      Pay Now with MTN MoMo / Bank Transfer
                    </Button>
                  </div>
                </div>
              )}

              {/* Proof of Payment Upload Form (Shared for MoMo and Bank) */}
              {activeTab !== 'card' && activeTab !== 'recurring' && (
                <form onSubmit={handleSubmitProof} className="mt-8 pt-6 border-t border-slate-200 space-y-5">
                  <div>
                    <h4 className="text-base font-black text-slate-900 flex items-center gap-2 mb-1">
                      <UploadCloud className="w-5 h-5 text-blue-600" />
                      Step 2: Upload Proof of Payment (POP)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Upload your confirmation screenshot from MoMo / e-Mali, electronic bank transfer PDF, or photo of bank deposit slip.
                    </p>
                  </div>

                  {/* Dropzone */}
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      proofFile
                        ? 'border-emerald-500 bg-emerald-50/30'
                        : 'border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/30'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {proofFile ? (
                      <div className="flex items-center justify-between max-w-md mx-auto bg-white p-3 rounded-xl border border-emerald-200 shadow-xs">
                        <div className="flex items-center gap-3 overflow-hidden">
                          {proofFile.type.startsWith('image/') ? (
                            <img 
                              src={proofFile.dataUrl} 
                              alt="Proof preview" 
                              className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0" 
                            />
                          ) : (
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center shrink-0">
                              <FileText className="w-6 h-6" />
                            </div>
                          )}
                          <div className="text-left truncate">
                            <span className="text-xs font-bold text-slate-900 block truncate">{proofFile.name}</span>
                            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Ready to submit
                            </span>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProofFile(null);
                          }}
                          className="text-slate-400 hover:text-red-600 text-xs font-bold"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          Click to browse or drag & drop proof file here
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Supports JPG, PNG, WebP screenshots or PDF (Max 8MB)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Sender Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Sender Phone Number / Account (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 7612 3456 or School Account"
                        value={senderIdentifier}
                        onChange={(e) => setSenderIdentifier(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Transaction ID / Reference Note (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. MoMo Ref #928192"
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Admin verifies and activates subscription automatically within 15–60 mins.</span>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !proofFile}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl text-sm shadow-md transition-all w-full sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                          Submitting Proof...
                        </>
                      ) : (
                        "Submit Proof of Payment for Verification"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

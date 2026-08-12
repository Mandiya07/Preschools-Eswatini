import React, { useState, useEffect } from "react";
import { 
  Globe, 
  Mail, 
  Smartphone, 
  MessageCircle, 
  HardDrive, 
  Sparkles, 
  Camera, 
  Video, 
  Palette, 
  Layers, 
  Database, 
  Building2, 
  Code2,
  CheckCircle2, 
  ShoppingCart, 
  Coins, 
  Info, 
  Clock, 
  ChevronRight, 
  ShieldCheck, 
  Tag, 
  Zap,
  HelpCircle,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  ADDON_MARKETPLACE_CATALOG, 
  AddonItem, 
  submitAddonOrder, 
  AddonCategory 
} from "@/lib/addonUtils";
import { 
  getOrCreateSchoolCreditAccount, 
  redeemSchoolCredit, 
  SchoolCreditAccount 
} from "@/lib/referralUtils";
import { LocalPaymentModal } from "@/components/LocalPaymentModal";

interface AddonMarketplaceCatalogProps {
  schoolId: string;
  schoolName: string;
  userEmail?: string;
  userName?: string;
  onOrderSuccess?: () => void;
}

const CATEGORY_TABS: { key: AddonCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All Add-ons' },
  { key: 'usage_communications', label: 'SMS, AI & Messaging' },
  { key: 'infrastructure_domains', label: 'Domains & Emails' },
  { key: 'storage_cloud', label: 'Storage & Backup' },
  { key: 'creative_media', label: 'Photography & Branding' },
  { key: 'bespoke_services', label: 'Data & Custom Dev' },
];

export function AddonMarketplaceCatalog({
  schoolId,
  schoolName,
  userEmail = "",
  userName = "",
  onOrderSuccess
}: AddonMarketplaceCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<AddonCategory | 'all'>('all');
  const [selectedAddon, setSelectedAddon] = useState<AddonItem | null>(null);
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(0);
  
  // Credit state
  const [creditAccount, setCreditAccount] = useState<SchoolCreditAccount | null>(null);
  const [useCredit, setUseCredit] = useState<boolean>(true);
  
  // Custom input state for specific addons
  const [customDetails, setCustomDetails] = useState({
    domainName: "",
    emailUsernames: "",
    preferredDate: "",
    notes: ""
  });

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [pendingOrderDetails, setPendingOrderDetails] = useState<{
    orderNumber: string;
    amount: number;
    addonTitle: string;
  } | null>(null);

  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (schoolId) {
      getOrCreateSchoolCreditAccount(schoolId, schoolName).then(setCreditAccount);
    }
  }, [schoolId, schoolName]);

  const filteredAddons = ADDON_MARKETPLACE_CATALOG.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const getIcon = (name: string) => {
    switch (name) {
      case 'Globe': return <Globe className="h-6 w-6 text-blue-600" />;
      case 'Mail': return <Mail className="h-6 w-6 text-indigo-600" />;
      case 'Smartphone': return <Smartphone className="h-6 w-6 text-emerald-600" />;
      case 'MessageCircle': return <MessageCircle className="h-6 w-6 text-teal-600" />;
      case 'HardDrive': return <HardDrive className="h-6 w-6 text-purple-600" />;
      case 'Sparkles': return <Sparkles className="h-6 w-6 text-amber-500" />;
      case 'Camera': return <Camera className="h-6 w-6 text-rose-600" />;
      case 'Video': return <Video className="h-6 w-6 text-violet-600" />;
      case 'Palette': return <Palette className="h-6 w-6 text-pink-600" />;
      case 'Layers': return <Layers className="h-6 w-6 text-cyan-600" />;
      case 'Database': return <Database className="h-6 w-6 text-orange-600" />;
      case 'Building2': return <Building2 className="h-6 w-6 text-blue-700" />;
      case 'Code2': return <Code2 className="h-6 w-6 text-slate-700" />;
      default: return <Zap className="h-6 w-6 text-emerald-600" />;
    }
  };

  const handleOpenAddonModal = (addon: AddonItem) => {
    setSelectedAddon(addon);
    setSelectedTierIndex(0);
    setCustomDetails({ domainName: "", emailUsernames: "", preferredDate: "", notes: "" });
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddon) return;

    const availableCredit = creditAccount?.availableCredit || 0;
    const tier = selectedAddon.tiers ? selectedAddon.tiers[selectedTierIndex] : null;
    const price = tier ? tier.price : selectedAddon.basePrice;

    const creditToApply = useCredit ? Math.min(availableCredit, price) : 0;
    const netAmount = price - creditToApply;

    setSubmitting(true);
    try {
      // 1. Submit order
      const res = await submitAddonOrder({
        schoolId,
        schoolName,
        submitterEmail: userEmail,
        submitterPhone: "",
        addonId: selectedAddon.id,
        selectedTierName: tier?.name,
        price,
        creditApplied: creditToApply,
        paymentMethod: netAmount === 0 ? "account_credit" : "pending_local_payment",
        customDetails,
        notes: customDetails.notes
      });

      // 2. Redeem credit if used
      if (creditToApply > 0) {
        await redeemSchoolCredit(
          schoolId,
          creditToApply,
          `Credit applied for ${selectedAddon.title} (${tier?.name || 'Base'})`,
          res.orderId
        );
      }

      toast.success(`Order created! Reference: ${res.orderNumber}`);

      // 3. If remaining balance > 0, launch MTN MoMo / EFT Payment Modal
      if (netAmount > 0) {
        setPendingOrderDetails({
          orderNumber: res.orderNumber,
          amount: netAmount,
          addonTitle: selectedAddon.title
        });
        setSelectedAddon(null);
        setShowPaymentModal(true);
      } else {
        toast.success(`Order fully covered by your E${creditToApply} referral credit! Service activated.`);
        setSelectedAddon(null);
        if (onOrderSuccess) onOrderSuccess();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to process add-on order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="addon-marketplace-catalog" className="space-y-8">
      {/* Strategic Explanation Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ShoppingCart className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-3">
            <Coins className="h-3.5 w-3.5" /> Fair Usage Add-On Marketplace
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Pay Only for What Your School Needs
          </h2>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            We keep our core subscription plans affordable (E199–E699/month) by separating heavy variable costs — like SMS telco bundles, custom .sz domain registrations, drone video production, and high-volume AI lesson generation — into transparent, optional add-ons.
          </p>

          {creditAccount && creditAccount.availableCredit > 0 && (
            <div className="mt-5 inline-flex items-center gap-3 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl px-4 py-2.5">
              <Coins className="h-5 w-5 text-yellow-300 animate-bounce" />
              <div className="text-xs">
                <span className="text-emerald-200 font-medium">Referral Credit Balance: </span>
                <strong className="text-white text-sm font-black">E{creditAccount.availableCredit.toLocaleString()}</strong>
                <span className="text-emerald-200 ml-1.5">(Can be applied directly at checkout)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORY_TABS.map((tab) => (
          <Button
            key={tab.key}
            variant={selectedCategory === tab.key ? "default" : "outline"}
            onClick={() => setSelectedCategory(tab.key)}
            className={`rounded-2xl text-xs font-bold whitespace-nowrap h-10 px-4 ${
              selectedCategory === tab.key 
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" 
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAddons.map((addon) => {
          return (
            <div 
              key={addon.id} 
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {getIcon(addon.iconName)}
                  </div>
                  <div className="flex flex-col items-end">
                    {addon.badge && (
                      <Badge className="bg-emerald-100 text-emerald-800 border-none text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full mb-1">
                        {addon.badge}
                      </Badge>
                    )}
                    <span className="text-xs font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-full">
                      {addon.priceDisplay}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                  {addon.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                  {addon.subtitle}
                </p>

                {/* Features preview */}
                <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
                  {addon.features.slice(0, 3).map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 pt-0 space-y-3">
                {/* Transparency Note */}
                <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
                  <Info className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{addon.whyNotBasePlan}</span>
                </div>

                <Button 
                  onClick={() => handleOpenAddonModal(addon)}
                  className="w-full bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl font-bold h-11 text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Select & Order</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail & Tier Selection Modal */}
      {selectedAddon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                  {getIcon(selectedAddon.iconName)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedAddon.title}</h3>
                  <p className="text-xs text-slate-500">{selectedAddon.categoryLabel} • {selectedAddon.deliveryTime}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedAddon(null)}
                className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-6 space-y-6">
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedAddon.description}
              </p>

              {/* Tiers Selection */}
              {selectedAddon.tiers && selectedAddon.tiers.length > 0 && (
                <div>
                  <Label className="text-xs font-bold text-slate-700 mb-2 block">
                    Choose Package Tier:
                  </Label>
                  <div className="space-y-2">
                    {selectedAddon.tiers.map((tier, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedTierIndex(idx)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedTierIndex === idx 
                            ? "bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20" 
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900">{tier.name}</p>
                          <p className="text-[11px] text-slate-500">{tier.details}</p>
                        </div>
                        <span className="font-black text-sm text-emerald-700">E{tier.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Input Fields for specific Addons */}
              {selectedAddon.id === 'custom_domain' && (
                <div>
                  <Label htmlFor="domainName" className="text-xs font-bold text-slate-700">
                    Desired Domain Name (.sz, .co.sz, or .com)
                  </Label>
                  <Input 
                    id="domainName"
                    placeholder="e.g. www.littlestars.sz"
                    value={customDetails.domainName}
                    onChange={(e) => setCustomDetails(prev => ({ ...prev, domainName: e.target.value }))}
                    className="mt-1 rounded-xl text-sm"
                  />
                </div>
              )}

              {selectedAddon.id === 'pro_email' && (
                <div>
                  <Label htmlFor="emailUsernames" className="text-xs font-bold text-slate-700">
                    Requested Mailboxes
                  </Label>
                  <Input 
                    id="emailUsernames"
                    placeholder="e.g. principal@, admissions@, finance@"
                    value={customDetails.emailUsernames}
                    onChange={(e) => setCustomDetails(prev => ({ ...prev, emailUsernames: e.target.value }))}
                    className="mt-1 rounded-xl text-sm"
                  />
                </div>
              )}

              {selectedAddon.id === 'pro_photography' || selectedAddon.id === 'promo_video' ? (
                <div>
                  <Label htmlFor="preferredDate" className="text-xs font-bold text-slate-700">
                    Preferred Campus Shooting Date
                  </Label>
                  <Input 
                    id="preferredDate"
                    type="date"
                    value={customDetails.preferredDate}
                    onChange={(e) => setCustomDetails(prev => ({ ...prev, preferredDate: e.target.value }))}
                    className="mt-1 rounded-xl text-sm"
                  />
                </div>
              ) : null}

              <div>
                <Label htmlFor="addonNotes" className="text-xs font-bold text-slate-700">
                  Additional Instructions / Notes for Team
                </Label>
                <Textarea 
                  id="addonNotes"
                  placeholder="Any specific requests or requirements..."
                  value={customDetails.notes}
                  onChange={(e) => setCustomDetails(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="mt-1 rounded-xl text-xs"
                />
              </div>

              {/* Account Credit Redemption Box */}
              {creditAccount && creditAccount.availableCredit > 0 && (
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Coins className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-900">Apply Referral Account Credit</p>
                      <p className="text-[11px] text-emerald-700">You have E{creditAccount.availableCredit} credit available.</p>
                    </div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={useCredit}
                    onChange={(e) => setUseCredit(e.target.checked)}
                    className="h-5 w-5 accent-emerald-600 rounded-md cursor-pointer"
                  />
                </div>
              )}

              {/* Order Summary Box */}
              {(() => {
                const tier = selectedAddon.tiers ? selectedAddon.tiers[selectedTierIndex] : null;
                const price = tier ? tier.price : selectedAddon.basePrice;
                const availableCredit = creditAccount?.availableCredit || 0;
                const creditToApply = useCredit ? Math.min(availableCredit, price) : 0;
                const netAmount = price - creditToApply;

                return (
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Item Subtotal:</span>
                      <span className="font-bold">E{price.toFixed(2)}</span>
                    </div>
                    {creditToApply > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Referral Credit Discount:</span>
                        <span>-E{creditToApply.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                      <span>Net Total Payable:</span>
                      <span className="text-emerald-700">E{netAmount.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })()}

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setSelectedAddon(null)}
                  className="rounded-xl text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmOrder}
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold h-11 px-6 shadow-md"
                >
                  {submitting ? "Creating Order..." : "Proceed to Payment"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Local Payment Modal for Add-On Order */}
      {showPaymentModal && pendingOrderDetails && (
        <LocalPaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setPendingOrderDetails(null);
            if (onOrderSuccess) onOrderSuccess();
          }}
          planName={pendingOrderDetails.addonTitle}
          customAmount={pendingOrderDetails.amount}
          schoolId={schoolId}
          schoolName={schoolName}
          invoiceNumber={pendingOrderDetails.orderNumber}
        />
      )}
    </div>
  );
}

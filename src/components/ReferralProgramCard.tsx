import React, { useState, useEffect } from "react";
import { 
  Gift, 
  Copy, 
  Check, 
  Share2, 
  Send, 
  Users, 
  TrendingUp, 
  Coins, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Mail, 
  Phone, 
  Building2, 
  HelpCircle,
  ExternalLink,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  ReferralRecord, 
  SchoolCreditAccount, 
  getSchoolReferralCode, 
  getOrCreateSchoolCreditAccount, 
  recordReferralInvite,
  REFERRAL_REWARD_AMOUNT 
} from "@/lib/referralUtils";
import { subscribeToCollection } from "@/lib/firestoreUtils";

interface ReferralProgramCardProps {
  schoolId: string;
  schoolName: string;
  userEmail?: string;
  userName?: string;
  onApplyCreditToBilling?: () => void;
}

export function ReferralProgramCard({
  schoolId,
  schoolName,
  userEmail = "",
  userName = "",
  onApplyCreditToBilling
}: ReferralProgramCardProps) {
  const referralCode = getSchoolReferralCode(schoolId, schoolName);
  const shareableUrl = `${window.location.origin}/register?ref=${encodeURIComponent(referralCode)}`;

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  // Real-time state from Firestore
  const [creditAccount, setCreditAccount] = useState<SchoolCreditAccount>({
    schoolId,
    schoolName,
    availableCredit: 0,
    totalEarned: 0,
    totalRedeemed: 0,
    referralCount: 0,
    history: [],
    updatedAt: new Date().toISOString()
  });

  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // New Invite form
  const [inviteForm, setInviteForm] = useState({
    referredSchoolName: "",
    referredPrincipalName: "",
    referredPhone: "",
    referredEmail: "",
    notes: ""
  });
  const [submittingInvite, setSubmittingInvite] = useState(false);

  useEffect(() => {
    if (!schoolId) return;

    // 1. Fetch initial credit account
    getOrCreateSchoolCreditAccount(schoolId, schoolName).then((acc) => {
      setCreditAccount(acc);
      setLoading(false);
    });

    // 2. Subscribe to credit changes
    const unsubCredit = subscribeToCollection<SchoolCreditAccount>(
      "school_credits",
      (allCredits) => {
        const found = allCredits.find(c => c.schoolId === schoolId);
        if (found) {
          setCreditAccount(found);
        }
      }
    );

    // 3. Subscribe to referrals
    const unsubRefs = subscribeToCollection<ReferralRecord>(
      "referrals",
      (allRefs) => {
        const filtered = allRefs.filter(r => 
          r.referrerSchoolId === schoolId || 
          (r.referralCode && r.referralCode.toLowerCase() === referralCode.toLowerCase())
        ).sort((a, b) => new Date(b.invitedAt || 0).getTime() - new Date(a.invitedAt || 0).getTime());
        setReferrals(filtered);
      }
    );

    return () => {
      if (unsubCredit) unsubCredit();
      if (unsubRefs) unsubRefs();
    };
  }, [schoolId, schoolName, referralCode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    toast.success("Referral code copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    toast.success("Sharable referral link copied!");
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const message = `Hello! We manage ${schoolName} using the Preschools Eswatini digital platform. Join using our school referral code *${referralCode}* to get 14 days free trial, instant mobile website, parent portal & admissions system: ${shareableUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleEmailShare = () => {
    const subject = `Invitation: Set up your preschool website & digital management system`;
    const body = `Dear Principal,\n\nWe recommend Preschools Eswatini to manage student records, admissions, parent messaging, and digital billing.\n\nUse our referral code: ${referralCode}\nOr click our direct link to register: ${shareableUrl}\n\nWarm regards,\n${userName || schoolName}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmitInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.referredSchoolName.trim()) {
      toast.error("Please enter the name of the preschool you are referring.");
      return;
    }

    setSubmittingInvite(true);
    try {
      await recordReferralInvite({
        referrerSchoolId: schoolId,
        referrerSchoolName: schoolName,
        referrerUserId: userName,
        referrerEmail: userEmail,
        ...inviteForm
      });

      toast.success(`Invite recorded for ${inviteForm.referredSchoolName}!`);
      
      // Auto-open WhatsApp if phone is provided
      if (inviteForm.referredPhone) {
        const cleanPhone = inviteForm.referredPhone.replace(/[^0-9]/g, '');
        const targetNumber = cleanPhone.startsWith("268") ? cleanPhone : `268${cleanPhone}`;
        const msg = `Hi ${inviteForm.referredPrincipalName || 'Principal'}, this is ${userName || schoolName}. We use Preschools Eswatini to manage our school. Use our referral code *${referralCode}* for 14 days free + priority onboarding: ${shareableUrl}`;
        window.open(`https://api.whatsapp.com/send?phone=${targetNumber}&text=${encodeURIComponent(msg)}`, '_blank');
      }

      setInviteForm({
        referredSchoolName: "",
        referredPrincipalName: "",
        referredPhone: "",
        referredEmail: "",
        notes: ""
      });
      setShowInviteModal(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to record referral.");
    } finally {
      setSubmittingInvite(false);
    }
  };

  const convertedCount = referrals.filter(r => r.status === 'subscribed' || r.status === 'rewarded').length;

  return (
    <div id="referral-program-container" className="space-y-8">
      {/* Hero Banner with Value Proposition */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 p-8 sm:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Gift className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            Preschool Growth Referral Program
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Refer Fellow Preschools. <br />
            <span className="text-emerald-300">Earn E100 Credit</span> for Every School.
          </h2>

          <p className="mt-3 text-emerald-100 text-base sm:text-lg leading-relaxed max-w-2xl">
            Help other early childhood educators in Eswatini modernize their schools. 
            When <strong>Preschool B</strong> subscribes with your referral code, <strong>{schoolName}</strong> instantly receives <strong>E100 account credit</strong> towards your monthly plans or add-on marketplace items.
          </p>

          {/* Value formula card */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
            <div className="p-2">
              <p className="text-xs text-emerald-200 font-medium">1 School Subscribes</p>
              <p className="text-2xl font-black text-white mt-1">E100 Credit</p>
            </div>
            <div className="p-2 border-y sm:border-y-0 sm:border-x border-white/20">
              <p className="text-xs text-emerald-200 font-medium">5 Schools Subscribe</p>
              <p className="text-2xl font-black text-yellow-300 mt-1">E500 Credit</p>
            </div>
            <div className="p-2">
              <p className="text-xs text-emerald-200 font-medium">10 Schools Subscribe</p>
              <p className="text-2xl font-black text-emerald-300 mt-1">E1,000 Credit</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats and Share Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Credit Summary */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Account Credit</span>
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Coins className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900">E{creditAccount.availableCredit?.toLocaleString() || 0}</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Ready to Use</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Apply this balance directly to lower your subscription renewal or purchase SMS bundles & domains.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Total Lifetime Earned:</span>
            <span className="font-bold text-slate-900">E{creditAccount.totalEarned?.toLocaleString() || 0}</span>
          </div>
        </div>

        {/* Unique Referral Code & Quick Copy */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Your School Referral Code</span>
              <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Gift className="h-5 w-5" />
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-2">
              <span className="font-mono text-lg font-black text-blue-700 tracking-wider">
                {referralCode}
              </span>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCopyCode}
                className="h-8 px-3 rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                {copiedCode ? <Check className="h-4 w-4 mr-1 text-emerald-600" /> : <Copy className="h-4 w-4 mr-1" />}
                {copiedCode ? "Copied" : "Copy"}
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Share this code with fellow principals when they register on Preschools Eswatini.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Converted Schools:</span>
            <span className="font-bold text-emerald-600">{convertedCount} Subscribed</span>
          </div>
        </div>

        {/* Fast Action Buttons */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Direct Sharing</span>
            <h3 className="text-xl font-bold text-white mt-1">Invite a Principal</h3>
            <p className="text-xs text-slate-300 mt-2">
              Send a personalized invitation with your direct referral code pre-filled.
            </p>
          </div>

          <div className="space-y-2.5 mt-6">
            <Button 
              onClick={handleWhatsAppShare}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-10 gap-2 text-xs"
            >
              <MessageSquare className="h-4 w-4" /> Share via WhatsApp
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                onClick={handleCopyLink}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl h-9 text-xs"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                {copiedLink ? "Link Copied" : "Copy Link"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowInviteModal(true)}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl h-9 text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Log Invite
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Lifecycle Steps */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8">
        <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          How the Referral Reward Cycle Works
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative">
            <span className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center mb-3">
              1
            </span>
            <h4 className="font-bold text-slate-900 text-sm">You Invite a School</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Share your unique code <strong>{referralCode}</strong> or direct link with a fellow preschool owner or teacher.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative">
            <span className="h-7 w-7 rounded-full bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center mb-3">
              2
            </span>
            <h4 className="font-bold text-slate-900 text-sm">They Sign Up & Subscribe</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              The referred school registers, enjoys their 14-day trial, and activates their plan via MTN MoMo or Bank EFT.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs relative">
            <span className="h-7 w-7 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center mb-3">
              3
            </span>
            <h4 className="font-bold text-slate-900 text-sm">You Get E100 Credit</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Upon admin payment approval, <strong>E100 account credit</strong> is automatically credited into your balance ledger.
            </p>
          </div>
        </div>
      </div>

      {/* Referrals Tracking Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Your Referred Preschools</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status tracking of every school you have invited to the network.
            </p>
          </div>
          <Button 
            onClick={() => setShowInviteModal(true)} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Invite Another School
          </Button>
        </div>

        {referrals.length === 0 ? (
          <div className="py-14 px-6 text-center">
            <div className="h-16 w-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">No Referrals Recorded Yet</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
              You haven't logged any invites yet. Send your referral code to fellow school directors in your cluster to start earning E100 credits.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={handleWhatsAppShare} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-xl font-bold">
                <MessageSquare className="h-4 w-4 mr-1.5" /> Share on WhatsApp
              </Button>
              <Button variant="outline" onClick={() => setShowInviteModal(true)} className="text-xs rounded-xl font-bold">
                <Plus className="h-4 w-4 mr-1.5" /> Log Invited School
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Referred Preschool</th>
                  <th className="py-3.5 px-6">Contact / Phone</th>
                  <th className="py-3.5 px-6">Invite Date</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Credit Reward</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {referrals.map((ref, idx) => {
                  const isRewarded = ref.status === 'rewarded' || ref.status === 'subscribed';
                  const isRegistered = ref.status === 'registered';

                  return (
                    <tr key={ref.id || idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-slate-400" />
                          <span>{ref.referredSchoolName}</span>
                        </div>
                        {ref.referredPrincipalName && (
                          <span className="text-[11px] text-slate-500 block ml-6 font-normal">
                            Principal: {ref.referredPrincipalName}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-mono">
                        {ref.referredPhone || ref.referredEmail || "Link Shared"}
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {ref.invitedAt ? new Date(ref.invitedAt).toLocaleDateString() : "Recent"}
                      </td>
                      <td className="py-4 px-6">
                        {isRewarded ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-none hover:bg-emerald-100 flex items-center gap-1 w-fit font-bold">
                            <CheckCircle2 className="h-3 w-3" /> Subscribed & Credited
                          </Badge>
                        ) : isRegistered ? (
                          <Badge className="bg-blue-100 text-blue-800 border-none hover:bg-blue-100 flex items-center gap-1 w-fit font-bold">
                            <Clock className="h-3 w-3" /> Registered (In Trial)
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800 border-none hover:bg-amber-100 flex items-center gap-1 w-fit font-bold">
                            <Send className="h-3 w-3" /> Invite Sent
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right font-black">
                        {isRewarded ? (
                          <span className="text-emerald-600 font-bold">+E100.00</span>
                        ) : (
                          <span className="text-slate-400 font-normal">Pending</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Credit Account Ledger History */}
      {creditAccount.history && creditAccount.history.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-900 mb-4">Account Credit Transaction Ledger</h3>
          <div className="space-y-3">
            {creditAccount.history.map((tx, idx) => (
              <div key={tx.id || idx} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl text-xs">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold ${
                    tx.amount > 0 ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {tx.amount > 0 ? "+" : "-"}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{tx.description}</p>
                    <p className="text-slate-400 text-[11px]">{new Date(tx.date).toLocaleString()}</p>
                  </div>
                </div>
                <span className={`font-black text-sm ${tx.amount > 0 ? "text-emerald-600" : "text-blue-600"}`}>
                  {tx.amount > 0 ? `+E${tx.amount}` : `-E${Math.abs(tx.amount)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal to Log a New Referral Invite */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Invite a Preschool Principal</h3>
                <p className="text-xs text-slate-500">Record an invite to track your E100 reward.</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowInviteModal(false)}
                className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-slate-600"
              >
                ✕
              </Button>
            </div>

            <form onSubmit={handleSubmitInvite} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="referredSchoolName" className="text-xs font-bold text-slate-700">
                  Preschool Name *
                </Label>
                <Input 
                  id="referredSchoolName"
                  placeholder="e.g. Bright Beginnings Preschool, Mbabane"
                  value={inviteForm.referredSchoolName}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, referredSchoolName: e.target.value }))}
                  required
                  className="mt-1 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="referredPrincipalName" className="text-xs font-bold text-slate-700">
                    Principal / Contact Name
                  </Label>
                  <Input 
                    id="referredPrincipalName"
                    placeholder="e.g. Mrs. Dlamini"
                    value={inviteForm.referredPrincipalName}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, referredPrincipalName: e.target.value }))}
                    className="mt-1 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="referredPhone" className="text-xs font-bold text-slate-700">
                    WhatsApp / Phone
                  </Label>
                  <Input 
                    id="referredPhone"
                    placeholder="e.g. 7612 3456"
                    value={inviteForm.referredPhone}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, referredPhone: e.target.value }))}
                    className="mt-1 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="referredEmail" className="text-xs font-bold text-slate-700">
                  Email Address (Optional)
                </Label>
                <Input 
                  id="referredEmail"
                  type="email"
                  placeholder="principal@school.sz"
                  value={inviteForm.referredEmail}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, referredEmail: e.target.value }))}
                  className="mt-1 rounded-xl text-sm"
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-xs font-bold text-slate-700">
                  Notes
                </Label>
                <Textarea 
                  id="notes"
                  placeholder="e.g. Met at ECCDE Regional Cluster meeting in Manzini"
                  value={inviteForm.notes}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="mt-1 rounded-xl text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-xl text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={submittingInvite}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  {submittingInvite ? "Saving..." : "Save & Open WhatsApp"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

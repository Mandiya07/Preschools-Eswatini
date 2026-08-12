import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  Download, 
  Search, 
  Filter, 
  Smartphone, 
  Building, 
  CreditCard, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink,
  MessageSquare,
  FileText,
  User,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PaymentVerificationRecord, 
  approvePaymentVerification, 
  rejectPaymentVerification 
} from "@/lib/paymentUtils";
import { subscribeToCollection, fetchCollection } from "@/lib/firestoreUtils";
import { useAuth } from "@/lib/AuthContext";

export function SuperAdminPaymentVerificationQueue() {
  const { user } = useAuth();
  const [verifications, setVerifications] = useState<PaymentVerificationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_verification' | 'approved' | 'rejected'>('pending_verification');
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Selected proof for image preview modal
  const [selectedProof, setSelectedProof] = useState<PaymentVerificationRecord | null>(null);
  
  // Action in progress state
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string>("");
  const [actionErrorMessage, setActionErrorMessage] = useState<string>("");
  
  // Rejection dialog state
  const [rejectingRecord, setRejectingRecord] = useState<PaymentVerificationRecord | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCollection<PaymentVerificationRecord>(
      "payment_verifications",
      (data) => {
        // Sort with newest submissions first
        const sorted = [...data].sort((a, b) => 
          new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime()
        );
        setVerifications(sorted);
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const pendingCount = verifications.filter(v => v.status === 'pending_verification').length;
  const approvedCount = verifications.filter(v => v.status === 'approved').length;
  const rejectedCount = verifications.filter(v => v.status === 'rejected').length;

  const filteredVerifications = verifications.filter((item) => {
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSearch = !searchQuery || 
      item.referenceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.schoolName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.submitterEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.submitterName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.paymentMethodLabel?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleApprove = async (record: PaymentVerificationRecord) => {
    if (!record.id) return;
    const confirmApprove = window.confirm(
      `Approve payment for ${record.schoolName}?\n\nReference: ${record.referenceNumber}\nAmount: E${record.amount}\nPlan: ${record.planName} (${record.billingCycle})\n\nThis will automatically ACTIVATE the school subscription.`
    );
    if (!confirmApprove) return;

    setProcessingId(record.id);
    setActionErrorMessage("");
    setActionSuccessMessage("");

    try {
      await approvePaymentVerification(
        record.id, 
        record, 
        user?.email || "super_admin@preschools.sz"
      );
      setActionSuccessMessage(`Payment approved! ${record.schoolName}'s subscription has been activated.`);
      if (selectedProof?.id === record.id) {
        setSelectedProof(null);
      }
      setTimeout(() => setActionSuccessMessage(""), 5000);
    } catch (err: any) {
      console.error("Error approving payment:", err);
      setActionErrorMessage(err.message || "Failed to approve payment.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenReject = (record: PaymentVerificationRecord) => {
    setRejectingRecord(record);
    setRejectionReason("");
  };

  const handleConfirmReject = async () => {
    if (!rejectingRecord || !rejectingRecord.id) return;
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejecting the payment proof.");
      return;
    }

    setProcessingId(rejectingRecord.id);
    setActionErrorMessage("");
    setActionSuccessMessage("");

    try {
      await rejectPaymentVerification(
        rejectingRecord.id,
        rejectingRecord,
        rejectionReason,
        user?.email || "super_admin@preschools.sz"
      );
      setActionSuccessMessage(`Payment reference ${rejectingRecord.referenceNumber} marked as rejected.`);
      setRejectingRecord(null);
      if (selectedProof?.id === rejectingRecord.id) {
        setSelectedProof(null);
      }
      setTimeout(() => setActionSuccessMessage(""), 5000);
    } catch (err: any) {
      console.error("Error rejecting payment:", err);
      setActionErrorMessage(err.message || "Failed to reject payment.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Alert if pending payments exist */}
      {pendingCount > 0 && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-4 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                {pendingCount} Payment Verification{pendingCount > 1 ? 's' : ''} Required
              </h3>
              <p className="text-amber-100 text-xs">
                Schools have uploaded proof of payment via MTN MoMo, e-Mali, or Bank EFT awaiting activation.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setStatusFilter('pending_verification')}
            className="bg-white text-slate-900 hover:bg-amber-50 font-bold px-4 text-xs shrink-0"
          >
            Review Pending ({pendingCount})
          </Button>
        </div>
      )}

      {/* Success / Error Banners */}
      {actionSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {actionErrorMessage && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-2xl text-xs font-bold text-red-800 flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{actionErrorMessage}</span>
        </div>
      )}

      {/* Controls and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setStatusFilter('pending_verification')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'pending_verification'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Pending ({pendingCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'approved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved ({approvedCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              statusFilter === 'rejected'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            Rejected ({rejectedCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            All Submissions ({verifications.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reference, school, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
        </div>
      </div>

      {/* Verifications List */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-600">Loading payment verifications from Firestore...</p>
        </div>
      ) : filteredVerifications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800">No payment verification requests found</h4>
          <p className="text-xs text-slate-500 mt-1">
            {statusFilter === 'pending_verification' 
              ? "All submitted proof of payments have been verified and processed!" 
              : "No submissions matched your selected filters."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredVerifications.map((item) => {
            const isPending = item.status === 'pending_verification';
            const isApproved = item.status === 'approved';
            const isRejected = item.status === 'rejected';

            return (
              <div 
                key={item.id || item.referenceNumber}
                className={`bg-white rounded-2xl p-5 border transition-all ${
                  isPending 
                    ? 'border-amber-300 ring-2 ring-amber-400/20 shadow-md bg-amber-50/10' 
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Left Column: School and Reference */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-black text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                        {item.referenceNumber}
                      </span>

                      <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                        isApproved
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isPending
                          ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                          : 'bg-red-100 text-red-800 border-red-300'
                      }`}>
                        {isApproved ? 'Approved & Active' : isPending ? 'Verification Required' : 'Rejected'}
                      </span>

                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(item.submittedAt || Date.now()).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-extrabold text-slate-900">{item.schoolName}</h4>
                      <span className="text-xs text-slate-500 font-medium">• {item.submitterEmail || item.submitterName}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-semibold">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        Plan: <strong className="text-slate-900">{item.planName}</strong> ({item.billingCycle})
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                        Method: <strong className="text-slate-900">{item.paymentMethodLabel}</strong>
                      </span>
                      {item.senderAccountOrNumber && (
                        <>
                          <span>•</span>
                          <span>Sender: <strong className="text-slate-900">{item.senderAccountOrNumber}</strong></span>
                        </>
                      )}
                    </div>

                    {item.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                        Note: "{item.notes}"
                      </p>
                    )}

                    {item.rejectionReason && (
                      <p className="text-xs text-red-700 bg-red-50 p-2 rounded-lg border border-red-200 font-medium">
                        Rejection reason: {item.rejectionReason}
                      </p>
                    )}
                  </div>

                  {/* Right Column: Amount & Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                        Amount Paid
                      </span>
                      <span className="text-2xl font-black text-slate-900">
                        E{item.amount?.toLocaleString()}.00
                      </span>
                    </div>

                    {/* Proof Preview Button */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {item.proofOfPaymentUrl ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProof(item)}
                          className="border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          View POP
                        </Button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No file attached</span>
                      )}

                      {/* Approval / Rejection Controls */}
                      {isPending && (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            disabled={processingId === item.id}
                            onClick={() => handleApprove(item)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Approve Payment
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={processingId === item.id}
                            onClick={() => handleOpenReject(item)}
                            className="border-red-300 text-red-700 hover:bg-red-50 font-bold text-xs"
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {isApproved && (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs py-1 px-3">
                          Verified by {item.verifiedBy || "SuperAdmin"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox / Proof of Payment Viewer Modal */}
      {selectedProof && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setSelectedProof(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Proof of Payment: {selectedProof.referenceNumber}
                </h3>
                <span className="text-xs text-slate-300">
                  {selectedProof.schoolName} • E{selectedProof.amount} via {selectedProof.paymentMethodLabel}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {selectedProof.proofOfPaymentUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="bg-white/10 text-white hover:bg-white/20 border-white/20 text-xs"
                  >
                    <a href={selectedProof.proofOfPaymentUrl} download={selectedProof.proofOfPaymentFileName || "ProofOfPayment.png"} target="_blank" rel="noreferrer">
                      <Download className="w-3.5 h-3.5 mr-1" /> Download
                    </a>
                  </Button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedProof(null)}
                  className="p-1.5 rounded-full hover:bg-white/20 text-slate-300 hover:text-white"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Proof Container */}
            <div className="p-6 max-h-[70vh] overflow-y-auto flex items-center justify-center bg-slate-100">
              {selectedProof.proofOfPaymentUrl ? (
                selectedProof.proofOfPaymentFileType?.includes('pdf') ? (
                  <div className="text-center p-8">
                    <FileText className="w-16 h-16 text-red-500 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-900">{selectedProof.proofOfPaymentFileName || "PDF Statement"}</p>
                    <Button asChild className="mt-4 bg-blue-600 text-white">
                      <a href={selectedProof.proofOfPaymentUrl} target="_blank" rel="noreferrer">
                        Open Full PDF in New Tab
                      </a>
                    </Button>
                  </div>
                ) : (
                  <img 
                    src={selectedProof.proofOfPaymentUrl} 
                    alt="Proof of payment slip" 
                    className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-md border border-slate-300"
                  />
                )
              ) : (
                <div className="p-8 text-center text-slate-400">No document attached</div>
              )}
            </div>

            {/* Action Bar inside viewer */}
            {selectedProof.status === 'pending_verification' && (
              <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Verify the transaction on your MTN MoMo / Bank portal before approving.
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenReject(selectedProof)}
                    className="border-red-300 text-red-700 hover:bg-red-50 font-bold text-xs"
                  >
                    Reject
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleApprove(selectedProof)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve & Activate Subscription
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Reason Prompt Dialog */}
      {rejectingRecord && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setRejectingRecord(null)}
        >
          <div 
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Reject Payment Proof</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Please enter the reason for rejecting reference <strong>{rejectingRecord.referenceNumber}</strong>. The school will be notified to correct or re-submit their proof.
            </p>

            <textarea
              rows={3}
              placeholder="e.g. Reference missing from deposit slip, amount short (received E199 instead of E399), or image unreadable."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
            />

            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRejectingRecord(null)}
                className="text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleConfirmReject}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

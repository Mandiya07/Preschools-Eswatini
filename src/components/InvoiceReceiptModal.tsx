import React, { useRef } from "react";
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  Clock, 
  Building2, 
  FileText, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubscriptionInvoiceRecord, DEFAULT_PLATFORM_PAYMENT_CONFIG } from "@/lib/paymentUtils";

interface InvoiceReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: SubscriptionInvoiceRecord | null;
}

export function InvoiceReceiptModal({
  isOpen,
  onClose,
  invoice
}: InvoiceReceiptModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPaid = invoice.status === "Paid";
  const isPending = invoice.status === "Pending Verification";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 print:shadow-none print:border-none print:m-0 print:max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-slate-800">
              Tax Invoice & Payment Receipt
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="font-bold text-xs gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div ref={printRef} className="p-8 sm:p-10 bg-white text-slate-900 font-sans">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                  PE
                </div>
                <h1 className="text-xl font-black tracking-tight text-slate-950">
                  {DEFAULT_PLATFORM_PAYMENT_CONFIG.companyName}
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {DEFAULT_PLATFORM_PAYMENT_CONFIG.address}
              </p>
              <p className="text-xs text-slate-500">
                Tax PIN / TIN: <strong className="text-slate-800">{DEFAULT_PLATFORM_PAYMENT_CONFIG.taxPin}</strong>
              </p>
              <p className="text-xs text-slate-500">
                Billing Support: {DEFAULT_PLATFORM_PAYMENT_CONFIG.supportEmail} • {DEFAULT_PLATFORM_PAYMENT_CONFIG.supportPhone}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="inline-block">
                <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                  isPaid 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300" 
                    : isPending
                    ? "bg-amber-50 text-amber-700 border-amber-300"
                    : "bg-slate-100 text-slate-700 border-slate-300"
                }`}>
                  {invoice.status.toUpperCase()}
                </span>
              </div>
              <div className="mt-3">
                <span className="text-xs text-slate-400 font-medium block">Invoice Number</span>
                <span className="text-base font-mono font-black text-slate-900">{invoice.invoiceNumber}</span>
              </div>
              <div className="mt-1">
                <span className="text-xs text-slate-400 font-medium block">Payment Reference</span>
                <span className="text-sm font-mono font-extrabold text-blue-700">{invoice.referenceNumber}</span>
              </div>
            </div>
          </div>

          {/* Invoice To Details */}
          <div className="grid grid-cols-2 gap-6 mb-8 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Billed To:</span>
              <h3 className="text-sm font-extrabold text-slate-900">{invoice.schoolName || "Preschool Account"}</h3>
              <p className="text-slate-600 mt-0.5">Kingdom of Eswatini</p>
              <p className="text-slate-500 mt-1 font-mono text-[11px]">School ID: {invoice.schoolId || "N/A"}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">Invoice Details:</span>
              <p className="text-slate-700"><strong>Date Issued:</strong> {new Date(invoice.createdAt || Date.now()).toLocaleDateString()}</p>
              <p className="text-slate-700 mt-0.5"><strong>Due Date:</strong> {invoice.dueDate || "Upon receipt"}</p>
              {invoice.paymentMethod && (
                <p className="text-slate-700 mt-0.5"><strong>Payment Channel:</strong> {invoice.paymentMethod}</p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-4 text-center">Billing Cycle</th>
                  <th className="py-3 px-4 text-right">Amount (SZL)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-4 px-4 font-medium text-slate-900">
                    <div>
                      <span className="font-bold block text-sm">{invoice.planName} Platform Subscription</span>
                      <span className="text-slate-500 text-[11px]">
                        Access to School Website, Admissions Portal, Messaging, Compliance & Analytics
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center capitalize font-semibold text-slate-700">
                    {invoice.billingCycle}
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-slate-900 text-sm">
                    E{invoice.amount?.toLocaleString()}.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex justify-end mb-8">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900">E{invoice.amount?.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax / VAT (15% Included):</span>
                <span>E{Math.round((invoice.amount || 0) * 0.15).toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-200">
                <span>Total Due:</span>
                <span className="text-blue-700 font-mono text-base">E{invoice.amount?.toLocaleString()}.00</span>
              </div>
            </div>
          </div>

          {/* Official Verification Stamp / Info */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-[11px] text-slate-500 space-y-1 text-center sm:text-left">
                <p className="font-semibold text-slate-700">Official Eswatini Preschool Platform Receipt</p>
                <p>Generated by Preschools Eswatini Automated Billing Service.</p>
                <p>MTN MoMo: {DEFAULT_PLATFORM_PAYMENT_CONFIG.momoNumber} • e-Mali: {DEFAULT_PLATFORM_PAYMENT_CONFIG.emaliNumber}</p>
              </div>

              {isPaid ? (
                <div className="border-2 border-emerald-600 text-emerald-700 px-4 py-2 rounded-xl text-center rotate-[-2deg] font-black uppercase text-xs tracking-widest shadow-xs">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>PAID & VERIFIED</span>
                  </div>
                  <span className="text-[9px] font-mono block mt-0.5">{invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString() : 'ACTIVE'}</span>
                </div>
              ) : isPending ? (
                <div className="border-2 border-amber-500 text-amber-700 px-4 py-2 rounded-xl text-center rotate-[-2deg] font-black uppercase text-xs tracking-widest shadow-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>VERIFICATION PENDING</span>
                  </div>
                  <span className="text-[9px] font-mono block mt-0.5">{invoice.referenceNumber}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

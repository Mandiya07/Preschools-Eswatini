import { createDocument, updateDocument, fetchCollection, fetchDocument } from "./firestoreUtils";
import { awardReferralCreditOnSubscription } from "./referralUtils";

export type PaymentMethodId = 
  | 'momo_mtn' 
  | 'emali' 
  | 'airtel' 
  | 'bank_fnb' 
  | 'bank_standard' 
  | 'bank_nedbank' 
  | 'bank_eswatini' 
  | 'card';

export interface PaymentVerificationRecord {
  id?: string;
  referenceNumber: string; // e.g. PES-2026-00841
  invoiceNumber: string;   // e.g. INV-PES-2026-00841
  schoolId?: string;
  schoolName: string;
  submitterId?: string;
  submitterName?: string;
  submitterEmail?: string;
  submitterPhone?: string;
  planId: string;
  planName: string;
  billingCycle: 'monthly' | 'termly' | 'annual';
  amount: number;
  currency: string;
  paymentMethod: PaymentMethodId | string;
  paymentMethodLabel: string;
  senderAccountOrNumber?: string;
  proofOfPaymentUrl?: string; // base64 or file URL
  proofOfPaymentFileName?: string;
  proofOfPaymentFileType?: string;
  notes?: string;
  status: 'pending_verification' | 'approved' | 'rejected';
  rejectionReason?: string;
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  subscriptionStartDate?: string;
  subscriptionExpiresAt?: string;
}

export interface SubscriptionInvoiceRecord {
  id?: string;
  invoiceNumber: string;
  referenceNumber: string;
  schoolId?: string;
  schoolName: string;
  planName: string;
  billingCycle: string;
  amount: number;
  currency: string;
  status: 'Pending Verification' | 'Paid' | 'Overdue' | 'Cancelled';
  paymentMethod?: string;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
  verificationId?: string;
}

export interface BankAccountDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchCode: string;
  branchName?: string;
  swiftCode?: string;
  accountType?: string;
}

export interface PlatformPaymentConfig {
  momoNumber: string;
  momoName: string;
  momoDialCode: string;
  emaliNumber: string;
  emaliName: string;
  emaliDialCode: string;
  airtelNumber: string;
  airtelName: string;
  banks: {
    fnb: BankAccountDetails;
    standard: BankAccountDetails;
    nedbank: BankAccountDetails;
    eswatiniBank: BankAccountDetails;
  };
  supportPhone: string;
  supportWhatsApp: string;
  supportEmail: string;
  companyName: string;
  taxPin: string;
  address: string;
}

export const DEFAULT_PLATFORM_PAYMENT_CONFIG: PlatformPaymentConfig = {
  momoNumber: "7600 0000",
  momoName: "Preschools Eswatini (Pty) Ltd",
  momoDialCode: "*007#",
  emaliNumber: "7900 0000",
  emaliName: "Preschools Eswatini",
  emaliDialCode: "*700#",
  airtelNumber: "+268 7600 0000",
  airtelName: "Preschools Eswatini",
  banks: {
    fnb: {
      bankName: "FNB Eswatini (First National Bank)",
      accountName: "Preschools Eswatini (Pty) Ltd",
      accountNumber: "62000000000",
      branchCode: "280164",
      branchName: "Mbabane Corporate Branch",
      swiftCode: "FIRNSZMX",
      accountType: "Business Cheque Account"
    },
    standard: {
      bankName: "Standard Bank Eswatini",
      accountName: "Preschools Eswatini Ltd",
      accountNumber: "91100000000",
      branchCode: "660564",
      branchName: "Mbabane Commercial",
      swiftCode: "SBICSZMX",
      accountType: "Corporate Current Account"
    },
    nedbank: {
      bankName: "Nedbank Eswatini",
      accountName: "Preschools Eswatini",
      accountNumber: "11990000000",
      branchCode: "360164",
      branchName: "Manzini Branch",
      swiftCode: "NEDSSZMX",
      accountType: "Commercial Account"
    },
    eswatiniBank: {
      bankName: "Eswatini Development & Savings Bank",
      accountName: "Preschools Eswatini Ltd",
      accountNumber: "77000000000",
      branchCode: "180164",
      branchName: "Mbabane Branch",
      accountType: "Institutional Account"
    }
  },
  supportPhone: "+268 2404 0000",
  supportWhatsApp: "+268 7600 0000",
  supportEmail: "billing@preschools.sz",
  companyName: "Preschools Eswatini Digital Network Ltd",
  taxPin: "TIN-904810294",
  address: "Plot 104, Somhlolo Road, Mbabane, Hhohho, Eswatini"
};

/**
 * Generates an official unique reference number matching the requested format:
 * Example: PES-2026-00841
 */
export function generateInvoiceReference(customSeed?: number): string {
  const currentYear = new Date().getFullYear();
  const randomNum = customSeed !== undefined 
    ? customSeed 
    : Math.floor(100 + Math.random() * 99899);
  const formattedNum = String(randomNum).padStart(5, '0');
  return `PES-${currentYear}-${formattedNum}`;
}

export function generateInvoiceNumber(referenceNumber: string): string {
  return `INV-${referenceNumber}`;
}

/**
 * Calculates plan price based on plan ID and billing cycle
 */
export function calculatePlanAmount(
  planId: string, 
  cycle: 'monthly' | 'termly' | 'annual', 
  couponApplied: boolean = false
): number {
  let basePrice = 0;
  switch (planId.toLowerCase()) {
    case 'enterprise':
      basePrice = cycle === 'annual' ? 14990 : cycle === 'termly' ? 6000 : 1499;
      break;
    case 'professional':
      basePrice = cycle === 'annual' ? 6990 : cycle === 'termly' ? 2800 : 699;
      break;
    case 'standard':
      basePrice = cycle === 'annual' ? 3990 : cycle === 'termly' ? 1600 : 399;
      break;
    case 'starter':
    case 'basic':
    default:
      basePrice = cycle === 'annual' ? 1990 : cycle === 'termly' ? 800 : 199;
      break;
  }

  if (couponApplied) {
    basePrice = Math.round(basePrice * 0.7); // 30% discount
  }

  return basePrice;
}

/**
 * Calculates subscription expiry date based on cycle
 */
export function calculateSubscriptionExpiry(cycle: 'monthly' | 'termly' | 'annual'): string {
  const now = new Date();
  if (cycle === 'annual') {
    now.setFullYear(now.getFullYear() + 1);
  } else if (cycle === 'termly') {
    now.setMonth(now.getMonth() + 4); // 4 months for an Eswatini school term
  } else {
    now.setMonth(now.getMonth() + 1); // 1 month
  }
  return now.toISOString();
}

/**
 * Submits a new proof of payment record for admin verification
 */
export async function submitPaymentVerification(
  record: Omit<PaymentVerificationRecord, 'status' | 'submittedAt'>
): Promise<{ verificationId: string; invoiceId: string; referenceNumber: string }> {
  const referenceNumber = record.referenceNumber || generateInvoiceReference();
  const invoiceNumber = record.invoiceNumber || generateInvoiceNumber(referenceNumber);
  const submittedAt = new Date().toISOString();

  const verificationPayload: PaymentVerificationRecord = {
    ...record,
    referenceNumber,
    invoiceNumber,
    status: 'pending_verification',
    submittedAt
  };

  // Create verification document in Firestore
  const verificationId = await createDocument(
    "payment_verifications", 
    `verif_${referenceNumber.replace(/[^a-zA-Z0-9]/g, '_')}`, 
    verificationPayload
  );

  // Create or update corresponding invoice
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  const invoicePayload: SubscriptionInvoiceRecord = {
    invoiceNumber,
    referenceNumber,
    schoolId: record.schoolId,
    schoolName: record.schoolName,
    planName: record.planName,
    billingCycle: record.billingCycle,
    amount: record.amount,
    currency: record.currency || 'SZL',
    status: 'Pending Verification',
    paymentMethod: record.paymentMethodLabel,
    dueDate: dueDate.toISOString().split('T')[0],
    createdAt: submittedAt,
    verificationId: String(verificationId)
  };

  const invoiceId = await createDocument(
    "invoices",
    `inv_${referenceNumber.replace(/[^a-zA-Z0-9]/g, '_')}`,
    invoicePayload
  );

  return {
    verificationId: String(verificationId),
    invoiceId: String(invoiceId),
    referenceNumber
  };
}

/**
 * SuperAdmin verifies and approves a payment, automatically activating the school subscription
 */
export async function approvePaymentVerification(
  verificationId: string,
  verificationData: PaymentVerificationRecord,
  adminIdentifier: string = "super_admin"
): Promise<boolean> {
  const verifiedAt = new Date().toISOString();
  const expiresAt = calculateSubscriptionExpiry(verificationData.billingCycle || 'monthly');

  // 1. Update verification record
  await updateDocument("payment_verifications", verificationId, {
    status: 'approved',
    verifiedAt,
    verifiedBy: adminIdentifier,
    subscriptionStartDate: verifiedAt,
    subscriptionExpiresAt: expiresAt
  });

  // 2. Activate school subscription if schoolId exists
  if (verificationData.schoolId) {
    try {
      await updateDocument("schools", verificationData.schoolId, {
        subscriptionPlan: verificationData.planId,
        subscriptionPlanName: verificationData.planName,
        subscriptionStatus: 'active',
        subscriptionCycle: verificationData.billingCycle,
        subscriptionExpiresAt: expiresAt,
        subscriptionActivatedAt: verifiedAt,
        lastPaymentRef: verificationData.referenceNumber,
        lastPaymentAmount: verificationData.amount,
        lastPaymentDate: verifiedAt,
        updatedAt: verifiedAt
      });
    } catch (err) {
      console.warn("Could not update school document directly:", err);
    }
  }

  // 3. Update Invoice status to Paid
  const invoiceDocId = `inv_${verificationData.referenceNumber.replace(/[^a-zA-Z0-9]/g, '_')}`;
  try {
    await updateDocument("invoices", invoiceDocId, {
      status: 'Paid',
      paidAt: verifiedAt,
      verifiedBy: adminIdentifier
    });
  } catch (err) {
    console.warn("Could not update invoice document directly:", err);
  }

  // 4. Automatically check and award E100 referral credit to the referring preschool
  try {
    await awardReferralCreditOnSubscription(
      verificationData.schoolId || "",
      verificationData.schoolName || ""
    );
  } catch (refErr) {
    console.warn("Could not process referral reward on approval:", refErr);
  }

  return true;
}

/**
 * SuperAdmin rejects a payment with reasons
 */
export async function rejectPaymentVerification(
  verificationId: string,
  verificationData: PaymentVerificationRecord,
  reason: string,
  adminIdentifier: string = "super_admin"
): Promise<boolean> {
  const verifiedAt = new Date().toISOString();

  await updateDocument("payment_verifications", verificationId, {
    status: 'rejected',
    rejectionReason: reason,
    verifiedAt,
    verifiedBy: adminIdentifier
  });

  const invoiceDocId = `inv_${verificationData.referenceNumber.replace(/[^a-zA-Z0-9]/g, '_')}`;
  try {
    await updateDocument("invoices", invoiceDocId, {
      status: 'Overdue',
      notes: `Rejected verification: ${reason}`
    });
  } catch (err) {
    console.warn("Could not update invoice status on rejection:", err);
  }

  return true;
}

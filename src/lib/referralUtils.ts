import { 
  createDocument, 
  updateDocument, 
  fetchCollection, 
  fetchDocument 
} from "./firestoreUtils";

export interface ReferralRecord {
  id?: string;
  referralCode: string;
  referrerSchoolId: string;
  referrerSchoolName: string;
  referrerUserId?: string;
  referrerEmail?: string;
  referredSchoolName: string;
  referredPrincipalName?: string;
  referredPhone?: string;
  referredEmail?: string;
  referredSchoolId?: string;
  status: 'invited' | 'registered' | 'subscribed' | 'rewarded';
  creditAwarded: number; // E100 per subscribed preschool
  notes?: string;
  invitedAt: string;
  registeredAt?: string;
  subscribedAt?: string;
  rewardedAt?: string;
}

export interface SchoolCreditHistoryItem {
  id: string;
  date: string;
  type: 'referral_bonus' | 'redemption' | 'manual_adjustment';
  amount: number; // Positive for earnings, negative for redemptions
  description: string;
  referenceDocId?: string;
  performedBy?: string;
}

export interface SchoolCreditAccount {
  id?: string;
  schoolId: string;
  schoolName: string;
  availableCredit: number;
  totalEarned: number;
  totalRedeemed: number;
  referralCount: number;
  history: SchoolCreditHistoryItem[];
  updatedAt: string;
}

export const REFERRAL_REWARD_AMOUNT = 100; // E100 per subscribed preschool

/**
 * Derives or formats a clean, memorable referral code for a school
 */
export function getSchoolReferralCode(schoolId: string, schoolName?: string): string {
  if (!schoolId) return "PES-REF-100";
  
  // Create a 4-6 char prefix from school name or school ID
  const cleanName = (schoolName || "")
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 4);
    
  const idSuffix = schoolId.replace(/[^a-zA-Z0-9]/g, '').slice(-3).toUpperCase();
  const prefix = cleanName.length >= 3 ? cleanName : "SCH";
  return `REF-${prefix}-${idSuffix}`;
}

/**
 * Fetches or initializes a preschool's account credit ledger
 */
export async function getOrCreateSchoolCreditAccount(
  schoolId: string, 
  schoolName: string = "Preschool"
): Promise<SchoolCreditAccount> {
  const docId = `credit_${schoolId.replace(/[^a-zA-Z0-9]/g, '_')}`;
  try {
    const existing = await fetchDocument("school_credits", docId) as SchoolCreditAccount | null;
    if (existing) {
      return existing;
    }
  } catch (err) {
    console.warn("Could not fetch credit account:", err);
  }

  // Initialize new credit account
  const newAccount: SchoolCreditAccount = {
    id: docId,
    schoolId,
    schoolName,
    availableCredit: 0,
    totalEarned: 0,
    totalRedeemed: 0,
    referralCount: 0,
    history: [],
    updatedAt: new Date().toISOString()
  };

  try {
    await createDocument("school_credits", docId, newAccount);
  } catch (err) {
    console.warn("Could not create initial credit account document:", err);
  }

  return newAccount;
}

/**
 * Logs a referral invite sent from a school to another preschool director
 */
export async function recordReferralInvite(params: {
  referrerSchoolId: string;
  referrerSchoolName: string;
  referrerUserId?: string;
  referrerEmail?: string;
  referredSchoolName: string;
  referredPrincipalName?: string;
  referredPhone?: string;
  referredEmail?: string;
  notes?: string;
}): Promise<string> {
  const referralCode = getSchoolReferralCode(params.referrerSchoolId, params.referrerSchoolName);
  const now = new Date().toISOString();

  const payload: ReferralRecord = {
    referralCode,
    referrerSchoolId: params.referrerSchoolId,
    referrerSchoolName: params.referrerSchoolName,
    referrerUserId: params.referrerUserId,
    referrerEmail: params.referrerEmail,
    referredSchoolName: params.referredSchoolName,
    referredPrincipalName: params.referredPrincipalName,
    referredPhone: params.referredPhone,
    referredEmail: params.referredEmail,
    status: 'invited',
    creditAwarded: REFERRAL_REWARD_AMOUNT,
    notes: params.notes,
    invitedAt: now
  };

  const docId = `ref_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  await createDocument("referrals", docId, payload);
  return docId;
}

/**
 * Awards E100 credit to the referring preschool when a referred school's subscription is approved
 */
export async function awardReferralCreditOnSubscription(
  referredSchoolId: string,
  referredSchoolName: string,
  referralCode?: string
): Promise<{ success: boolean; creditAwarded?: number; referrerSchoolName?: string }> {
  try {
    // 1. Find the referral record either by code or referredSchoolName
    const allReferrals = await fetchCollection<ReferralRecord>("referrals");
    
    let match = allReferrals.find(r => 
      (referralCode && r.referralCode?.toLowerCase() === referralCode.toLowerCase()) ||
      (r.referredSchoolId && r.referredSchoolId === referredSchoolId) ||
      (r.referredSchoolName && referredSchoolName && r.referredSchoolName.toLowerCase().trim() === referredSchoolName.toLowerCase().trim())
    );

    if (!match && referralCode) {
      // If code was entered at signup without pre-invite, find the school that owns the referral code
      const allSchools = await fetchCollection<any>("schools");
      const matchedSchool = allSchools.find(s => 
        getSchoolReferralCode(s.id, s.name).toLowerCase() === referralCode.toLowerCase()
      );
      if (matchedSchool) {
        match = {
          referralCode,
          referrerSchoolId: matchedSchool.id,
          referrerSchoolName: matchedSchool.name,
          referredSchoolName,
          referredSchoolId,
          status: 'registered',
          creditAwarded: REFERRAL_REWARD_AMOUNT,
          invitedAt: new Date().toISOString()
        };
      }
    }

    if (!match || match.status === 'rewarded') {
      return { success: false };
    }

    const now = new Date().toISOString();
    const referrerSchoolId = match.referrerSchoolId;
    const creditDocId = `credit_${referrerSchoolId.replace(/[^a-zA-Z0-9]/g, '_')}`;

    // 2. Fetch or create credit account for referrer
    const creditAccount = await getOrCreateSchoolCreditAccount(referrerSchoolId, match.referrerSchoolName);
    
    const newHistoryItem: SchoolCreditHistoryItem = {
      id: `txn_${Date.now()}`,
      date: now,
      type: 'referral_bonus',
      amount: REFERRAL_REWARD_AMOUNT,
      description: `Referral Reward: ${referredSchoolName} subscribed to Preschools Eswatini`,
      referenceDocId: match.id
    };

    const updatedAvailable = (creditAccount.availableCredit || 0) + REFERRAL_REWARD_AMOUNT;
    const updatedEarned = (creditAccount.totalEarned || 0) + REFERRAL_REWARD_AMOUNT;
    const updatedReferralsCount = (creditAccount.referralCount || 0) + 1;
    const updatedHistory = [newHistoryItem, ...(creditAccount.history || [])];

    // 3. Update credit ledger
    await updateDocument("school_credits", creditDocId, {
      availableCredit: updatedAvailable,
      totalEarned: updatedEarned,
      referralCount: updatedReferralsCount,
      history: updatedHistory,
      updatedAt: now
    });

    // 4. Update referral document status
    if (match.id) {
      await updateDocument("referrals", match.id, {
        status: 'rewarded',
        subscribedAt: now,
        rewardedAt: now,
        referredSchoolId
      });
    } else {
      const newRefId = `ref_${Date.now()}`;
      await createDocument("referrals", newRefId, {
        ...match,
        status: 'rewarded',
        subscribedAt: now,
        rewardedAt: now,
        referredSchoolId
      });
    }

    return { 
      success: true, 
      creditAwarded: REFERRAL_REWARD_AMOUNT, 
      referrerSchoolName: match.referrerSchoolName 
    };
  } catch (err) {
    console.error("Error awarding referral credit:", err);
    return { success: false };
  }
}

/**
 * Deducts credit when a school uses it towards an invoice or add-on purchase
 */
export async function redeemSchoolCredit(
  schoolId: string,
  amountToRedeem: number,
  description: string,
  referenceDocId?: string
): Promise<{ success: boolean; remainingCredit: number }> {
  try {
    const creditDocId = `credit_${schoolId.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const account = await getOrCreateSchoolCreditAccount(schoolId);

    if (account.availableCredit < amountToRedeem) {
      return { success: false, remainingCredit: account.availableCredit };
    }

    const now = new Date().toISOString();
    const newAvailable = account.availableCredit - amountToRedeem;
    const newTotalRedeemed = (account.totalRedeemed || 0) + amountToRedeem;

    const newHistoryItem: SchoolCreditHistoryItem = {
      id: `txn_${Date.now()}`,
      date: now,
      type: 'redemption',
      amount: -amountToRedeem,
      description,
      referenceDocId
    };

    await updateDocument("school_credits", creditDocId, {
      availableCredit: newAvailable,
      totalRedeemed: newTotalRedeemed,
      history: [newHistoryItem, ...(account.history || [])],
      updatedAt: now
    });

    return { success: true, remainingCredit: newAvailable };
  } catch (err) {
    console.error("Error redeeming school credit:", err);
    return { success: false, remainingCredit: 0 };
  }
}

/**
 * Super Admin manual credit adjustment
 */
export async function manualAdjustSchoolCredit(
  schoolId: string,
  schoolName: string,
  amount: number, // Positive to grant, negative to debit
  reason: string,
  adminIdentifier: string = "SuperAdmin"
): Promise<boolean> {
  try {
    const creditDocId = `credit_${schoolId.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const account = await getOrCreateSchoolCreditAccount(schoolId, schoolName);

    const now = new Date().toISOString();
    const newAvailable = Math.max(0, (account.availableCredit || 0) + amount);
    const newEarned = amount > 0 ? (account.totalEarned || 0) + amount : account.totalEarned;
    const newRedeemed = amount < 0 ? (account.totalRedeemed || 0) + Math.abs(amount) : account.totalRedeemed;

    const newHistoryItem: SchoolCreditHistoryItem = {
      id: `txn_${Date.now()}`,
      date: now,
      type: 'manual_adjustment',
      amount,
      description: `Admin adjustment: ${reason}`,
      performedBy: adminIdentifier
    };

    await updateDocument("school_credits", creditDocId, {
      availableCredit: newAvailable,
      totalEarned: newEarned,
      totalRedeemed: newRedeemed,
      history: [newHistoryItem, ...(account.history || [])],
      updatedAt: now
    });

    return true;
  } catch (err) {
    console.error("Error in manual credit adjustment:", err);
    return false;
  }
}

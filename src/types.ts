export type Role = "SuperAdmin" | "SchoolAdmin" | "Parent" | "User" | "Supplier" | "Advertiser";
export type DocumentStatus = "private" | "pending_approval" | "shared_to_network" | "rejected";


export interface LearningDocument {
  id: string;
  schoolId: string;
  title: string;
  type: 'worksheet' | 'lesson_plan' | 'presentation' | 'other';
  url: string;
  status: DocumentStatus;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  name: string;
  age: string;
  desc: string;
}

export interface Staff {
  name: string;
  role: string;
  image?: string;
}

export interface School {
  id: string;
  name: string;
  ownerId?: string;
  institutionType?: string;
  country?: string;
  region: string;
  town: string;
  address: string;
  type: string;
  curriculum: string;
  boarding: 'Day' | 'Boarding' | 'Both';
  feePerTerm: number;
  ageGroups: string[];
  heroImage: string;
  rating: number;
  reviews: number;
  description: string;
  mission: string;
  phone: string;
  email: string;
  hours: string;
  programs: Program[];
  facilities: string[];
  staff: Staff[];
  gallery: string[];
  videoUrl?: string;
  admissionsDetails: string[];
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  featured: boolean;
  verified: boolean;
  tags: string[];
  totalCapacity?: number;
  coordinates?: { lat: number; lng: number };
  subscriptionPlan: "Free" | "Basic" | "Professional" | "Enterprise";
  subscriptionStatus: "active" | "past_due" | "canceled" | "trialing";
  createdAt: string;
  claimed?: boolean;
}

export interface TransportRoute {
  id: string;
  schoolId: string;
  routeName: string;
  driverName: string;
  vehiclePlate: string;
  currentLocation?: { lat: number; lng: number };
  students: string[];
  status: "Active" | "Completed" | "Delayed" | "Scheduled";
}

export interface ReportCard {
  id: string;
  schoolId: string;
  studentId: string;
  term: string;
  academicYear: string;
  subjects: { name: string; grade: string; remarks: string }[];
  teacherRemarks?: string;
  principalRemarks?: string;
  published: boolean;
  issuedAt: string;
}

export interface PaymentTransaction {
  id: string;
  schoolId: string;
  studentId?: string;
  parentId: string;
  amount: number;
  currency: string;
  paymentMethod: "Card" | "MobileMoney" | "BankTransfer" | "Cash";
  status: "Pending" | "Successful" | "Failed" | "Refunded";
  reference: string;
  timestamp: string;
}

export interface Course {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  instructorId: string;
  modules: { title: string; contentUrl?: string; duration?: number }[];
  gradeLevel?: string;
  published: boolean;
  createdAt: string;
}

export interface AIAssistantSession {
  id: string;
  userId: string;
  schoolId: string;
  subject: string;
  messages: { role: 'user' | 'assistant'; content: string; timestamp: string }[];
  createdAt: string;
}

export interface PlatformSubscription {
  id: string;
  schoolId: string;
  planId: string;
  status: "Active" | "Canceled" | "PastDue" | "Trailing";
  currentPeriodEnd: string;
  amount: number;
}

export interface MarketplaceTheme {
  id: string;
  name: string;
  description: string;
  price: number;
  previewUrl: string;
  isPremium: boolean;
}

export interface MarketplaceItem {
  id: string;
  supplierId: string;
  name: string;
  description: string;
  category: "Uniforms" | "Educational Toys" | "Books & Resources" | "Supplies" | "Preschool Supplies" | "Teacher Resources" | "Preschool Furniture" | "Learning Materials";
  price: number;
  imageUrl: string;
  stockQuantity: number;
}

export interface PlatformModule {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
}

export interface FeaturedListing {
  id: string;
  schoolId: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Expired" | "Pending";
  amountPaid: number;
}

export interface Advertisement {
  id: string;
  advertiserName: string;
  imageUrl: string;
  targetUrl: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Expired" | "Pending";
  amountPaid: number;
}

export interface VerificationRequest {
  id: string;
  schoolId: string;
  status: "Pending" | "InReview" | "Verified" | "Rejected";
  feePaid: boolean;
  submittedAt: string;
}

export interface ServiceRequest {
  id: string;
  schoolId: string;
  serviceType: "Digital Marketing" | "Photography" | "Video Production" | "SEO Audit";
  status: "Requested" | "QuoteProvided" | "InProgress" | "Completed";
  requestedAt: string;
}

export interface HealthRecord {
  id: string;
  schoolId: string;
  studentId: string;
  allergies: string[];
  medicalConditions: string[];
  immunizations: { name: string; date: string; status: string }[];
  bloodGroup?: string;
  emergencyContacts: { name: string; relation: string; phone: string }[];
}

export interface DailyLog {
  id: string;
  schoolId: string;
  studentId: string;
  date: string;
  logType: "Meal" | "Nap" | "Activity" | "Incident" | "Behavior" | "Pickup" | "Assessment";
  details: Record<string, any>;
  loggedBy: string;
  createdAt: string;
}

export type MealIntakeLevel = "All" | "Most" | "Some" | "None" | "Refused";
export type MealType = "Breakfast" | "Morning Snack" | "Lunch" | "Afternoon Snack" | "Late Snack";

export interface MealLogDetails {
  mealType: MealType;
  foodItems: string[];
  intakeLevel: MealIntakeLevel;
  liquidIntake?: string;
  notes?: string;
  nutritionalNotes?: string;
}

export interface WeeklyDietaryReport {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  startDate: string;
  endDate: string;
  summary: string;
  recommendations?: string;
  generatedBy: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  schoolId: string;
  itemName: string;
  category: "Asset" | "Consumable" | "ProcurementRequest";
  quantity: number;
  status: string;
  location?: string;
  assignedTo?: string;
}

export interface StaffHR {
  id: string;
  schoolId: string;
  staffId: string;
  payrollIntegrationId?: string;
  leaveBalance: number;
  department: string;
  status: string;
}

export interface ComplianceRecord {
  id: string;
  schoolId: string;
  type: "Inspection" | "License" | "Checklist" | "HealthSafety" | "TeacherQualification" | "ReportExport";
  title: string;
  status: "Pending" | "Valid" | "Expired" | "Failed" | "Passed";
  issuedDate?: string;
  expiryDate?: string;
  documentUrl?: string;
  notes?: string;
}

export interface UserProfile {
  uid: string;
  name: string | null;
  email: string | null;
  role: Role;
  schoolId?: string;
  childIds?: string[];
}

export type InquiryStatus = "pending" | "responded" | "closed";

export type ApplicationStatus = "submitted" | "under_review" | "interview_scheduled" | "waitlisted" | "accepted" | "rejected" | "enrolled";

export interface Application {
  id: string;
  schoolId: string;
  parentId: string;
  childName: string;
  childDateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  proposedStartDate: string;
  gradeApplyingFor: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
  documents: {
    type: "birth_certificate" | "immunization_record" | "other";
    url: string;
    name: string;
  }[];
  medicalInfo: string;
  status: ApplicationStatus;
  interviewDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  schoolId: string;
  title: string;
  message: string;
  type: "admission_update" | "event_reminder" | "general";
  read: boolean;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  schoolId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childName: string;
  childAge: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface Student {
  id: string;
  schoolId: string;
  parentId?: string; // Link to Parent User
  name: string;
  age: number | string;
  class: string;
  parentName: string;
  parentContact: string;
  parentEmail?: string;
  medicalInfo: string;
  photoUrl?: string;
  status: "Active" | "Inactive" | "Graduated";
  createdAt: string;
  updatedAt: string;
}

export interface StudentProgress {
  id: string;
  studentId: string;
  schoolId: string;
  title: string;
  content: string;
  category: "Academic" | "Social" | "Physical" | "Medical";
  date: string;
  teacherId: string;
}

export interface FeeStatement {
  id: string;
  studentId: string;
  parentId: string;
  schoolId: string;
  amount: number;
  status: "Paid" | "Unpaid" | "Partial";
  dueDate: string;
  description: string;
  transactions: {
    amount: number;
    date: string;
    method: string;
  }[];
}

export interface Message {
  id: string;
  schoolId: string;
  senderId: string;
  receiverId: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface Announcement {
  id: string;
  schoolId: string;
  title: string;
  content: string;
  authorId: string;
  date: string;
  priority: "Low" | "Normal" | "High" | "Urgent";
  targetAudience: "All" | "Parents" | "Staff";
  imageUrl?: string;
}

export interface AttendanceRecord {
  id: string;
  schoolId: string;
  studentId: string;
  date: string;
  status: "Present" | "Absent" | "Late" | "Excused";
  remarks?: string;
  recordedBy?: string;
}

export interface Newsletter {
  id: string;
  schoolId: string;
  title: string;
  content: string; // HTML or Markdown
  authorId: string;
  publishedAt: string;
  thumbnailUrl?: string;
  status: "Draft" | "Published";
}

export interface CommunicationLog {
  id: string;
  schoolId: string;
  senderId: string;
  type: "Email" | "SMS" | "WhatsApp" | "Push";
  target: "All" | "Class" | "Individual";
  recipientIds: string[];
  subject?: string;
  content: string;
  status: "Pending" | "Sent" | "Failed";
  createdAt: string;
}

// Super Admin Entities
export interface PlatformStatistic {
  totalSchools: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  totalUsers: number;
  pendingVerifications: number;
  supportTicketsCount: number;
}

export interface PlatformAnnouncement {
  id: string;
  title: string;
  content: string;
  target: "All" | "SchoolAdmins" | "Parents";
  priority: "Low" | "Normal" | "High" | "Urgent";
  createdAt: string;
  expiresAt?: string;
}

export interface SupportTicket {
  id: string;
  schoolId?: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  category: "Billing" | "Technical" | "Feature Request" | "Account" | "Other";
  createdAt: string;
  updatedAt: string;
}

export interface RevenueData {
  id: string;
  amount: number;
  currency: string;
  schoolId: string;
  schoolName: string;
  plan: string;
  status: "succeeded" | "pending" | "failed";
  timestamp: string;
}

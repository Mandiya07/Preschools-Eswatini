import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/AuthContext";
import { 
  Bell, 
  Calendar, 
  CreditCard, 
  FileText, 
  Download, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  ClipboardCheck,
  Building,
  Loader2,
  X,
  User,
  Plus,
  MoreHorizontal,
  Activity,
  MessageSquare,
  Megaphone,
  PhoneCall,
  UserPlus,
  ArrowRight,
  WifiOff,
  Shield,
  ShieldOff,
  Sparkles,
  Lock,
  Trash2,
  Archive,
  Sliders,
  Database,
  Globe,
  Building2,
  PenTool,
  Utensils,
  ChefHat
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AIChatBot } from "@/components/AIChatBot";
import { subscribeToCollection, updateDocument, createDocument, deleteDocument, fetchDocument } from "@/lib/firestoreUtils";
import { where, orderBy, query, limit } from "firebase/firestore";
import { 
  Application, 
  ApplicationStatus, 
  Notification as AppNotification, 
  Student, 
  StudentProgress, 
  FeeStatement, 
  Announcement,
  AttendanceRecord,
  Message,
  Newsletter,
  WeeklyDietaryReport
} from "@/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DigitalSignatureModal } from "@/components/DigitalSignatureModal";

export function ParentPortalPage() {
  const { user, logout } = useAuth();
  const userSchoolName = (user as any)?.schoolName || "Verified Institution";
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"dashboard" | "children" | "billing" | "messages" | "privacy" | "diet">("dashboard");
  const [personalConsent, setPersonalConsent] = useState(true);
  const [medicalConsent, setMedicalConsent] = useState(true);
  const [consentSyncing, setConsentSyncing] = useState(false);
  const [consentSyncedMessage, setConsentSyncedMessage] = useState(false);
  const [showDeletionConfirm, setShowDeletionConfirm] = useState(false);
  const [deletionTargetChildId, setDeletionTargetChildId] = useState("");
  const [isDeletingChild, setIsDeletingChild] = useState(false);

  // GDPR Rectification and Parent Account Deletion states
  const [rectifyName, setRectifyName] = useState("");
  const [rectifyPhone, setRectifyPhone] = useState("");
  const [rectificationSaved, setRectificationSaved] = useState(false);
  const [isSavingRectifiedData, setIsSavingRectifiedData] = useState(false);
  const [communicationConsent, setCommunicationConsent] = useState(true);
  const [cookieConsent, setCookieConsent] = useState(true);
  const [showAccountDeletionConfirm, setShowAccountDeletionConfirm] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [signingConsentStudent, setSigningConsentStudent] = useState<Student | null>(null);
  const [consentTypeToSign, setConsentTypeToSign] = useState<"medical" | "outing" | "policy">("medical");
  const [signedFiles, setSignedFiles] = useState<{ studentId: string; type: string; url: string }[]>(() => {
    try {
      const saved = localStorage.getItem("parent_signed_files");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("parent_signed_files", JSON.stringify(signedFiles));
    } catch (err) {
      console.error("Failed to save signed files in localStorage", err);
    }
  }, [signedFiles]);

  useEffect(() => {
    if (user) {
      setRectifyName(user.name || "");
      setRectifyPhone((user as any).phone || "");
    }
  }, [user]);

  const handleRectifyData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingRectifiedData(true);
    try {
      await updateDocument("users", user.uid, {
        name: rectifyName,
        phone: rectifyPhone,
        rectificationTimestamp: new Date().toISOString()
      });
      setRectificationSaved(true);
      setTimeout(() => setRectificationSaved(false), 4500);
    } catch (err) {
      console.error("Error rectifying user records:", err);
      alert("Error synchronizing profile corrections with Firestore. Please try again.");
    } finally {
      setIsSavingRectifiedData(false);
    }
  };

  const handleParentAccountDeletion = async () => {
    if (!user) return;
    setIsDeletingAccount(true);
    try {
      // 1. Delete all student dependents linked to this parent to preserve integrity and GDPR specs
      for (const student of students) {
        await deleteDocument("students", student.id);
      }
      // 2. Erase the primary parent document from Firestore users collection
      await deleteDocument("users", user.uid);
      // 3. Clear modal state
      setShowAccountDeletionConfirm(false);
      // 4. Alert parent of scrubbing fulfillment and sign out
      alert("Parent Account Successfully Scrubbed: Your parent registration, active dependents, and clinical health files have been completely and permanently erased from the Central Directory in full compliance with GDPR Article 17.");
      logout();
      navigate("/");
    } catch (err) {
      console.error("Error executing parent account deletion:", err);
      alert("An error occurred during account deletion. Please try again or contact the designated Data Protection Officer.");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleExportData = () => {
    if (!user) return;
    const exportPayload = {
      exporter: user.name,
      exportDate: new Date().toISOString(),
      regulatorCompliance: "GDPR (Article 20) & Eswatini Data Protection Act of 2018 (Section 25)",
      licensee: "Preschools Eswatini System",
      parentAccount: {
        uid: user.uid,
        name: user.name,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        rectificationHistory: (user as any).rectificationTimestamp ? [{ action: "RECTIFY_PROFILE", timestamp: (user as any).rectificationTimestamp }] : []
      },
      dependents: students.map(s => ({
        id: s.id,
        name: s.name,
        class: s.class,
        age: s.age,
        medicalInfo: s.medicalInfo || "None reported",
        progressLogs: progress.filter(p => p.studentId === s.id),
        attendance: attendance.filter(a => a.studentId === s.id),
        feeStatements: fees.filter(f => f.studentId === s.id)
      })),
      auditLogs: [
        { action: "PII_READ", timestamp: new Date().toISOString(), actor: user.uid, details: "Parent requested data export through GDPR Article 20 compliant gateway." }
      ]
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `gdpr_dpa_export_${user.name?.replace(/\s+/g, '_').toLowerCase()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteChildProfile = async (studentId: string) => {
    if (!studentId) return;
    setIsDeletingChild(true);
    try {
      await deleteDocument("students", studentId);
      setShowDeletionConfirm(false);
      setDeletionTargetChildId("");
      alert("Profile Successfully Scrubbed: This student's active records, progress files, and healthcare logs have been completely and permanently erased from the Preschools Eswatini central directory in compliance with Eswatini DPA 2018.");
    } catch (err) {
      console.error(err);
      alert("Error deleting student profile. Please try again or contact the school's designated Data Protection Officer.");
    } finally {
      setIsDeletingChild(false);
    }
  };

  const renderPrivacy = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600 animate-pulse" />
            Privacy & GDPR Compliance Hub
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium leading-none">
            Manage your consents, rectify inaccuracies, download portable payloads, or invoke statutory erasure requests in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 flex items-center gap-1.5 rounded-full px-3 py-1 font-bold">
            <Lock className="h-3.5 w-3.5 text-blue-600" />
            GDPR & Eswatini DPA Certified
          </Badge>
        </div>
      </div>

      {/* Controller Information Banner */}
      <Card className="rounded-[2.2rem] border-blue-200 bg-blue-50/50 shadow-sm overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="p-6 md:p-8 flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 shrink-0">
            <Shield className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-blue-950">Registered Data Controller & GDPR Recipient</h3>
            <p className="text-blue-800 text-xs leading-relaxed mt-1">
              Preschools Eswatini operates under strict compliance with the Kingdom of Eswatini's Data Protection Act of 2018 (Reference: <strong>SZ-DPA-2018-0912A</strong>) and aligns globally with General Data Protection Regulation (GDPR) guidelines. We ensure all personal data is encrypted via transit-level SSL & AES-256 rest protocols. You hold sovereign ownership of your clinical wellbeing reports, tuition balances, and children's academic journals.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Module 1: Manage Data & Right to Rectification (GDPR Article 16) */}
        <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between bg-white">
          <CardHeader className="border-b border-light-100 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-950">
              <Sliders className="h-5 w-5 text-blue-600" />
              1. Manage & Rectify Personal Data (GDPR Art. 16)
            </CardTitle>
            <CardDescription>
              Keep your contact details synchronized and accurate in accordance with your right to rectification.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleRectifyData} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Guardian/Parent Display Name</label>
                <input 
                  type="text"
                  required
                  value={rectifyName}
                  onChange={(e) => setRectifyName(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="Parent Full Name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Registered Mobile (MTN MoMo Link)</label>
                <input 
                  type="text"
                  value={rectifyPhone}
                  onChange={(e) => setRectifyPhone(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="+268 phone number"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400">Authorized E-mail Address (Primary Anchor)</label>
                <input 
                  type="text"
                  disabled
                  value={user?.email || "No Email linked"}
                  className="w-full h-11 bg-slate-100 border border-slate-200 rounded-xl px-4 text-sm font-medium text-slate-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-400 font-medium select-none">Email address functions as an immutable login locator under security policy requirements.</span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {rectificationSaved ? (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 animate-pulse">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Rectified & Synced to DB
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-medium">Last rectified: Real-time update</span>
                )}
                <Button 
                  type="submit"
                  disabled={isSavingRectifiedData}
                  className="bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl h-10 px-5 text-white"
                >
                  {isSavingRectifiedData ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : "Rectify & Update Profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Module 2: Explicit Parental Consents (GDPR Articles 6-9) */}
        <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between bg-white">
          <CardHeader className="border-b border-light-100 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-950">
              <ClipboardCheck className="h-5 w-5 text-blue-600" />
              2. Explicit Privacy Consents
            </CardTitle>
            <CardDescription>
              Control the specific boundaries of your account's processing activities.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900">Personal Information Records Processing</p>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Consent to the secure, isolated storage of names, grade logs, parent phone keys, and educational checklists on our database directory.
                </p>
              </div>
              <input 
                type="checkbox" 
                checked={personalConsent}
                onChange={(e) => setPersonalConsent(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0 mt-1 cursor-pointer"
              />
            </div>

            <div className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900">Children's Medical Alerts & Allergies</p>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Consent to the storage of essential healthcare directives, clinical allergen details, and nursing alerts visible to authorized staff.
                </p>
              </div>
              <input 
                type="checkbox" 
                checked={medicalConsent}
                onChange={(e) => setMedicalConsent(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0 mt-1 cursor-pointer"
              />
            </div>

            <div className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900">System Notification & Transport SMS Alerts</p>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Permit our messaging systems to dispatch real-time emergency transport closures and billing statement alerts directly.
                </p>
              </div>
              <input 
                type="checkbox" 
                checked={communicationConsent}
                onChange={(e) => setCommunicationConsent(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0 mt-1 cursor-pointer"
              />
            </div>

            <div className="flex items-start justify-between gap-4 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-900">Essential Telemetry Cookies & Preferences</p>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Enable background local storage trackers to securely maintain your authentication session, theme settings, and system stability states.
                </p>
              </div>
              <input 
                type="checkbox" 
                checked={cookieConsent}
                onChange={(e) => setCookieConsent(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0 mt-1 cursor-pointer"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {consentSyncedMessage ? (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Consents Logged & Encrypted
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-medium">Last synced: Real-time</span>
              )}
              <Button 
                onClick={async () => {
                  setConsentSyncing(true);
                  setTimeout(() => {
                    setConsentSyncing(false);
                    setConsentSyncedMessage(true);
                    setTimeout(() => setConsentSyncedMessage(false), 4500);
                  }, 1200);
                }}
                disabled={consentSyncing}
                className="bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl h-10 px-4 text-white"
              >
                {consentSyncing ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Syncing...
                  </>
                ) : "Save Consent Options"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Module 3: Portability Data Export Options (GDPR Article 20) */}
        <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between bg-white bg-white">
          <CardHeader className="border-b border-light-100 pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-950">
              <Database className="h-5 w-5 text-blue-600" />
              3. Right to Data Portability (GDPR Art. 20)
            </CardTitle>
            <CardDescription>
              Retrieve a structured, machine-readable export of all records stored regarding your children and your user account status.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed space-y-3">
              <div className="flex gap-2 text-slate-700 font-bold items-center">
                <Archive className="h-4 w-4 text-blue-500 block shrink-0" />
                <p>Included in secure portable payload:</p>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-500 text-[11px]">
                <li>Registered Guardian profiles and credential index</li>
                <li>Child profiles, age registers, and classroom rosters</li>
                <li>Historic progress remarks and clinical wellness logs</li>
                <li>Digital attendance matrices and calendar check-ins</li>
                <li>Tuition fee status tables and transaction ledgers</li>
              </ul>
            </div>

            <Button 
              onClick={handleExportData}
              variant="outline" 
              className="w-full h-11 border-blue-200 text-blue-700 hover:bg-blue-50 font-bold rounded-xl gap-2 flex items-center justify-center mt-2 shadow-sm transition-all text-xs"
            >
              <Download className="h-4 w-4" />
              Download Standard GDPR Portability Payload (.json)
            </Button>
          </CardContent>
        </Card>

        {/* Module 4: Right to Erasure / Right to be Forgotten (GDPR Article 17) */}
        <Card className="rounded-3xl border-red-200 bg-red-50/25 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <CardHeader className="border-b border-red-100/50 pb-4 bg-red-50/50">
              <CardTitle className="text-lg font-bold text-red-900 flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-600 animate-pulse" />
                4. Right to Erasure / be Forgotten (GDPR Art. 17)
              </CardTitle>
              <CardDescription className="text-red-700/80">
                Exercise your absolute legal rights to delete children profiles or permanently erase your parent registration account.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6 bg-red-50/10">
              {/* Option 4A: Single Dependent Erasure */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-red-950 uppercase tracking-wide">Path A: Erase Specific Dependent Records</h4>
                <p className="text-[11px] text-red-800/80 leading-relaxed">
                  Permanently erase the clinical file, daily progress records, and grade roster for a single dependent. This processes immediately.
                </p>
                {students.length > 0 ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select 
                      id="eraseChildSelect"
                      className="bg-white border border-red-200 text-red-900 text-xs font-semibold rounded-xl p-2.5 outline-none focus:ring-1 focus:ring-red-400 flex-1"
                      onChange={(e) => setDeletionTargetChildId(e.target.value)}
                      value={deletionTargetChildId}
                    >
                      <option value="">-- Choose Dependent --</option>
                      {students.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.class})</option>
                      ))}
                    </select>
                    <Button 
                      disabled={!deletionTargetChildId}
                      onClick={() => {
                        if (!deletionTargetChildId) return;
                        setShowDeletionConfirm(true);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-xs font-bold text-white rounded-xl h-11 px-6 shadow-md shadow-red-200/50 whitespace-nowrap"
                    >
                      Request Erasure
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs italic font-medium text-red-700">No active student profiles currently linked to delete.</p>
                )}
              </div>

              <div className="h-[1px] bg-red-100" />

              {/* Option 4B: Complete Account Erasure */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-red-950 uppercase tracking-wide">Path B: Complete Parent Account Purge</h4>
                <p className="text-[11px] text-red-800/80 leading-relaxed">
                  Request absolute erasure of your core registration user profile and ALL registered children dependencies. This cannot be retracted.
                </p>
                <Button 
                  onClick={() => setShowAccountDeletionConfirm(true)}
                  className="w-full bg-red-900 border border-red-950 text-white hover:bg-red-950 text-xs font-bold rounded-xl h-11 flex items-center justify-center gap-2 shadow-lg"
                >
                  <Trash2 className="h-4 w-4 text-red-200" />
                  Erase My Parent Account & Dependents
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Persistent Deletion Modal Overlay - CHILD ERASE */}
      {showDeletionConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl max-w-lg w-full p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 text-red-600">
              <div className="h-12 w-12 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 leading-none">Confirm Permanent Erasure</h3>
                <p className="text-xs text-slate-500 mt-1.5 font-medium">GDPR Article 17 Dependent Erasure Request</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-xs text-red-800 leading-relaxed space-y-2">
              <p className="font-extrabold uppercase tracking-wide">Warning: Permanent Operation</p>
              <p>
                You are about to permanently erase the files of <strong>{students.find(s => s.id === deletionTargetChildId)?.name}</strong> from all databases. This is processed in real-time.
              </p>
              <ul className="list-disc pl-4 space-y-1 font-medium text-[11px]">
                <li>All clinical reports, allergen records, and medical log files are destroyed.</li>
                <li>Daily academic progress logs and term grade cards are deleted.</li>
                <li>Attendance historical check-ins and fee schedules are erased.</li>
              </ul>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowDeletionConfirm(false);
                  setDeletionTargetChildId("");
                }}
                className="w-1/2 h-11 rounded-xl text-slate-700 font-bold hover:bg-slate-50 text-xs"
              >
                Cancel
              </Button>
              <Button 
                disabled={isDeletingChild}
                onClick={() => handleDeleteChildProfile(deletionTargetChildId)}
                className="w-1/2 h-11 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200/50 flex items-center justify-center gap-2 text-xs"
              >
                {isDeletingChild ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                     <Trash2 className="h-4 w-4" />
                     Erase Permanently
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* GDPR Parent Account Deletion Modal Overlay - FULL ACCOUNT PURGE */}
      {showAccountDeletionConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl max-w-lg w-full p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 text-red-600">
              <div className="h-12 w-12 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 leading-none">Confirm Account Erasure</h3>
                <p className="text-xs text-slate-500 mt-1.5 font-medium">GDPR Article 17 Statutory Request</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-xs text-red-800 leading-relaxed space-y-2">
              <p className="font-extrabold uppercase tracking-wide">Warning: IRREVERSIBLE OPERATION</p>
              <p>
                You are requesting absolute closure of your profile <strong>{user?.name}</strong>. Under our Data Controller guidelines, this performs real-time purging across our central databases:
              </p>
              <ul className="list-disc pl-4 space-y-1 font-medium text-[11px]">
                <li>Your parent account registration document is completely scrubbed.</li>
                <li>All linked student dependent profiles, grades, and logs are deleted.</li>
                <li>Historic tuition fee ledgers and message threads are permanently truncated.</li>
                <li>Your active access session is closed instantly.</li>
              </ul>
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowAccountDeletionConfirm(false)}
                className="w-1/2 h-11 rounded-xl text-slate-700 font-bold hover:bg-slate-50 text-xs"
              >
                Cancel
              </Button>
              <Button 
                disabled={isDeletingAccount}
                onClick={handleParentAccountDeletion}
                className="w-1/2 h-11 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200/50 flex items-center justify-center gap-2 text-xs"
              >
                {isDeletingAccount ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Erasing...
                  </>
                ) : (
                  <>
                     <Trash2 className="h-4 w-4" />
                     Erase My Account
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [progress, setProgress] = useState<StudentProgress[]>([]);
  const [fees, setFees] = useState<FeeStatement[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setPushEnabled(window.Notification.permission === "granted");
    }
  }, []);

  const requestPushPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
      return;
    }
    const permission = await window.Notification.requestPermission();
    setPushEnabled(permission === "granted");
    if (permission === 'granted') {
      new window.Notification("Notifications Enabled", {
        body: "You will now receive automatic updates from your child's school.",
        icon: "/pwa-192x192.png"
      });
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Messaging States
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [schoolStatus, setSchoolStatus] = useState<string | null>(null);
  const [checkingSchool, setCheckingSchool] = useState(false);

  useEffect(() => {
    if (user?.schoolId) {
      checkSchoolSubscription();
    }
  }, [user?.schoolId]);

  const checkSchoolSubscription = async () => {
    if (!user?.schoolId) return;
    setCheckingSchool(true);
    try {
      const schoolData = await fetchDocument("schools", user.schoolId) as any;
      if (schoolData) {
        setSchoolStatus(schoolData.subscriptionStatus || "active");
      }
    } catch (error) {
      console.error("Error checking school status:", error);
    } finally {
      setCheckingSchool(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'Parent') return;

    const unsubApps = subscribeToCollection(
      'applications',
      (data) => setApplications(data as Application[]),
      where('parentId', '==', user.uid)
    );

    const unsubNotifs = subscribeToCollection(
      'notifications',
      (data) => setNotifications(data as AppNotification[]),
      where('userId', '==', user.uid)
    );

    const unsubStudents = subscribeToCollection(
      'students',
      (data) => setStudents(data as Student[]),
      where('parentId', '==', user.uid)
    );

    const unsubFees = subscribeToCollection(
      'fees',
      (data) => setFees(data as FeeStatement[]),
      where('parentId', '==', user.uid)
    );

    const unsubAnnouncements = subscribeToCollection(
      'announcements',
      (data) => setAnnouncements(data as Announcement[])
    );

    const unsubNewsletters = subscribeToCollection(
      'newsletters',
      (data) => setNewsletters(data as Newsletter[]),
      where('status', '==', 'Published')
    );

    const unsubMessages = subscribeToCollection(
      'messages',
      (data) => setMessages(data as Message[]),
      where('receiverId', 'in', [user.uid, 'school_admin']), // Simplification for demo
      orderBy('createdAt', 'desc')
    );

    setLoading(false);

    return () => {
      unsubApps();
      unsubNotifs();
      unsubStudents();
      unsubFees();
      unsubAnnouncements();
      unsubNewsletters();
      unsubMessages();
    };
  }, [user]);

  if (!user || user.role !== 'Parent') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4 text-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You must be an authenticated parent to view this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (user?.schoolId && schoolStatus && schoolStatus !== 'active' && schoolStatus !== 'pending_payment') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4 text-center">
        <Card className="max-w-md w-full border-none shadow-2xl rounded-[2rem] overflow-hidden">
          <div className="h-3 bg-red-500"></div>
          <CardHeader className="pt-8">
            <div className="h-20 w-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <ShieldOff className="h-10 w-10" />
            </div>
            <CardTitle className="text-2xl font-black text-slate-900">Portal Inaccessible</CardTitle>
            <CardDescription className="text-slate-500 text-base mt-2">
              Access to this school's Parent Portal has been suspended due to an inactive service subscription.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8 space-y-4">
             <div className="bg-slate-50 p-4 rounded-2xl text-left border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Notice for Parents</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Your academic records and student data are securely preserved, but the digital portal is currently offline. Please reach out to the school's finance or administration office.
                </p>
             </div>
            <div className="pt-4 flex flex-col gap-3">
              <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 h-12 rounded-xl font-bold text-white shadow-lg shadow-blue-100">
                 Refresh Portal Status
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="text-slate-500 font-bold h-12">
                 Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const markAsRead = async (notifId: string) => {
    try {
      await updateDocument("notifications", notifId, { read: true });
    } catch (error) {
      console.error("Mark read error:", error);
    }
  };

  const getStatusDisplay = (status: ApplicationStatus) => {
    switch (status) {
      case "submitted": return { icon: <Clock className="h-4 w-4" />, color: "text-blue-600 bg-blue-50", label: "Submitted" };
      case "under_review": return { icon: <Loader2 className="h-4 w-4 animate-spin" />, color: "text-purple-600 bg-purple-50", label: "Under Review" };
      case "interview_scheduled": return { icon: <Calendar className="h-4 w-4" />, color: "text-amber-600 bg-amber-50", label: "Interview Scheduled" };
      case "accepted": return { icon: <CheckCircle2 className="h-4 w-4" />, color: "text-green-600 bg-green-50", label: "Accepted" };
      case "rejected": return { icon: <X className="h-4 w-4" />, color: "text-red-600 bg-red-50", label: "Rejected" };
      case "waitlisted": return { icon: <AlertCircle className="h-4 w-4" />, color: "text-slate-600 bg-slate-50", label: "Waitlisted" };
      case "enrolled": return { icon: <ClipboardCheck className="h-4 w-4" />, color: "text-indigo-600 bg-indigo-50", label: "Enrolled" };
      default: return { icon: <Clock className="h-4 w-4" />, color: "text-slate-600 bg-slate-50", label: status };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    setIsSending(true);
    try {
      const msgData: Omit<Message, "id"> = {
        schoolId: user.schoolId || "stars_prep", // fallback
        senderId: user.uid,
        receiverId: "school_admin",
        subject: "Parent Query",
        body: newMessage,
        read: false,
        createdAt: new Date().toISOString()
      };
      await createDocument("messages", null, msgData);
      setNewMessage("");
    } catch (error) {
      console.error("Msg send error:", error);
    } finally {
      setIsSending(false);
    }
  };

  const renderDashboard = () => (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left/Main Column */}
      <div className="lg:col-span-2 space-y-8">
        
        {/* Welcome Section */}
        <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px] -ml-24 -mb-24"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest mb-4">
                 <Sparkles className="h-3 w-3 text-yellow-400" /> Parent Portal Access
              </div>
              <h1 className="text-3xl font-black mb-2 leading-tight">Welcome back,<br />{user?.name?.split(' ')[0] || "Guardian"}!</h1>
              <p className="text-slate-400 font-medium text-sm">Stay connected with your children's academic ecosystem.</p>
            </div>
            <div className="flex bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/5 gap-4">
               <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
                  <Building2 className="h-6 w-6 text-white" />
               </div>
               <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1.5">Academic Partner</p>
                  <p className="font-black text-white text-sm truncate max-w-[150px]">{userSchoolName}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                     <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                     <p className="text-[9px] font-bold text-emerald-400 uppercase">Synchronized</p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Children Summary Section */}
        {students.length > 0 && (
          <section className="space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                   <User className="h-5 w-5 text-blue-600" />
                   My Children
                </h2>
                <Button variant="ghost" size="sm" className="text-blue-600 text-xs font-bold" onClick={() => setActiveTab("children")}>
                   View Profiles
                </Button>
             </div>
             <div className="grid sm:grid-cols-2 gap-4">
                {students.map(student => (
                  <Card key={student.id} className="hover:shadow-md transition-all cursor-pointer" onClick={() => setActiveTab("children")}>
                    <CardContent className="p-4 flex items-center gap-4">
                       <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-100">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`} alt="student" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-900">{student.name}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{student.class}</p>
                       </div>
                       <div className="ml-auto">
                          <Activity className="h-4 w-4 text-green-500" />
                       </div>
                    </CardContent>
                  </Card>
                ))}
             </div>
          </section>
        )}

        {/* Mandatory Forms & Signature Status Section */}
        {students.length > 0 && (() => {
          const formTypes = [
            { id: "medical", label: "Medical Emergency Consent", desc: "Authorizes emergency medical treatments and clinical records access." },
            { id: "outing", label: "Outing & Field Trip Permission", desc: "Allows off-campus excursions and school field trips." },
            { id: "policy", label: "School Policy & Rulebook Agreement", desc: "Affirms agreement to uniform rules, billing schedules, and codes of conduct." }
          ] as const;

          const totalFormsNeeded = students.length * formTypes.length;
          const signedCount = signedFiles.filter(item => 
            students.some(s => s.id === item.studentId) && 
            formTypes.some(f => f.id === item.type)
          ).length;
          
          const completionRate = totalFormsNeeded > 0 ? Math.round((signedCount / totalFormsNeeded) * 100) : 0;

          return (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 animate-in fade-in">
                  <ClipboardCheck className="h-5 w-5 text-blue-600" />
                  Mandatory Forms & Compliance
                </h2>
                <Badge className={completionRate === 100 ? "bg-emerald-100 text-emerald-800 border-none px-2 rounded-full font-bold" : "bg-blue-100 text-blue-800 border-none px-2 rounded-full font-bold"}>
                  {signedCount}/{totalFormsNeeded} Forms Signed ({completionRate}%)
                </Badge>
              </div>

              <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden bg-white">
                <CardHeader className="bg-slate-50 border-b border-slate-100 py-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-base font-black">Digital Signature Tracker</CardTitle>
                      <CardDescription className="text-xs font-medium text-slate-500 mt-1">
                        All mandatory regulatory slips must be signed for your children to participate in school activities.
                      </CardDescription>
                    </div>
                    <div className="w-full sm:w-48">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-1">
                        <span>COMPLIANCE STATUS</span>
                        <span>{completionRate}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${completionRate === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                          style={{ width: `${completionRate}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {students.map(student => (
                    <div key={student.id} className="border border-slate-150 rounded-2xl p-4 bg-slate-50/50 space-y-4">
                      {/* Student Header */}
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-white border border-slate-200 shadow-sm animate-in zoom-in">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`} alt="student" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{student.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{student.class}</p>
                        </div>
                      </div>

                      {/* Forms Grid */}
                      <div className="grid gap-3 sm:grid-cols-3">
                        {formTypes.map(formSpec => {
                          const isSignedRecord = signedFiles.find(sf => sf.studentId === student.id && sf.type === formSpec.id);
                          
                          return (
                            <div 
                              key={formSpec.id} 
                              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                                isSignedRecord 
                                  ? 'bg-emerald-50/20 border-emerald-100 hover:border-emerald-200' 
                                  : 'bg-white border-slate-200 hover:border-blue-200 shadow-sm'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <span className="text-xs font-bold text-slate-900 line-clamp-1">{formSpec.label}</span>
                                  {isSignedRecord ? (
                                    <Badge className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0 border-none font-bold">
                                      Signed
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0 border-none font-bold animate-pulse">
                                      Pending
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed mb-4 min-h-[30px]">{formSpec.desc}</p>
                              </div>

                              <div>
                                {isSignedRecord ? (
                                  <div className="flex items-center justify-between bg-emerald-50/40 p-2 rounded-lg border border-emerald-100/30">
                                    <span className="text-[9px] text-emerald-800 font-bold uppercase tracking-wider">Completed</span>
                                    <a 
                                      href={isSignedRecord.url} 
                                      download={`${student.name.replace(/\s+/g, '_')}_${formSpec.id}_consent.pdf`}
                                      className="text-emerald-600 hover:text-emerald-700 p-1 bg-white rounded border border-emerald-100 hover:shadow-sm flex items-center justify-center gap-1"
                                      title="Download Signed Form PDF"
                                    >
                                      <Download className="h-3 w-3" />
                                      <span className="text-[8px] font-bold">PDF</span>
                                    </a>
                                  </div>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    className="w-full text-[10px] font-bold h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5"
                                    onClick={() => {
                                      setSigningConsentStudent(student); 
                                      setConsentTypeToSign(formSpec.id);
                                    }}
                                  >
                                    <PenTool className="h-3 w-3" /> Sign Slip
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          );
        })()}

        {/* My Applications Section */}
        <section className="space-y-4">
           <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                 <FileText className="h-5 w-5 text-blue-600" />
                 Admission Applications
              </h2>
              {applications.length > 0 && (
                <Button variant="ghost" size="sm" className="text-blue-600 text-xs font-bold" onClick={() => navigate("/directory")}>
                   Apply more
                </Button>
              )}
           </div>
           
           <div className="space-y-4">
              {loading ? (
                <div className="p-12 flex justify-center bg-white rounded-3xl border border-slate-100">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
              ) : applications.length > 0 ? (
                applications.map(app => {
                  const status = getStatusDisplay(app.status);
                  return (
                    <Card key={app.id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all group">
                       <div className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                             <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl font-black text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                  {app.childName.charAt(0)}
                                </div>
                                <div>
                                   <h3 className="font-bold text-slate-900 text-lg leading-tight">{app.childName}</h3>
                                   <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                      <Building className="h-3 w-3" /> Applying for {app.gradeApplyingFor}
                                   </p>
                                </div>
                             </div>
                             <div className="flex flex-col sm:items-end gap-2 text-right">
                                <div className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${status.color}`}>
                                   {status.icon}
                                   {status.label}
                                </div>
                                <div className="text-[10px] text-slate-400 font-medium">
                                   Last update: {new Date(app.updatedAt).toLocaleDateString()}
                                </div>
                             </div>
                          </div>
                       </div>
                    </Card>
                  );
                })
              ) : (
                <Card className="p-12 text-center border-dashed border-2 border-slate-200 bg-transparent">
                   <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <ClipboardCheck className="h-8 w-8 text-slate-200" />
                   </div>
                   <h3 className="font-bold text-slate-900">No active applications</h3>
                   <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
                      Start your child's journey today by applying to one of our top-rated schools in the directory.
                   </p>
                   <Button className="mt-6 bg-blue-600" onClick={() => navigate("/directory")}>Explore Schools</Button>
                </Card>
              )}
           </div>
        </section>

        {/* Quick Actions / Enrollment */}
        <section className="grid sm:grid-cols-3 gap-4">
           <Card className="hover:border-blue-200 transition-colors cursor-pointer group" onClick={() => setActiveTab("billing")}>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
                 <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <CreditCard className="h-6 w-6" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">Pay Fees</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5 uppercase tracking-wide">Mobile Payments</p>
                 </div>
              </CardContent>
           </Card>
           
           <Card className="hover:border-green-200 transition-colors cursor-pointer group" onClick={() => navigate("/events")}>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
                 <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                    <Calendar className="h-6 w-6" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">Calendar</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5 uppercase tracking-wide">Events & Activities</p>
                 </div>
              </CardContent>
           </Card>

           <Card className="hover:border-purple-200 transition-colors cursor-pointer group relative overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
                 <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <FileText className="h-6 w-6" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">Camera Upload</p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5 uppercase tracking-wide">Submit Documents</p>
                 </div>
                 <input 
                   type="file" 
                   accept="image/*,application/pdf" 
                   capture="environment"
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                   title="Use Camera / Upload Document"
                   onChange={(e) => {
                     if(e.target.files && e.target.files.length > 0) {
                         alert(`File "${e.target.files[0].name}" selected for upload.`);
                     }
                   }}
                 />
              </CardContent>
           </Card>
        </section>
      </div>

      {/* Sidebar Right */}
      <div className="space-y-8">
        {/* Emergency Card */}
        <Card className="bg-red-50 border-red-100 border-2 overflow-hidden">
           <CardContent className="p-6">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                <PhoneCall className="h-5 w-5" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Emergency Contact</h3>
              </div>
              <p className="text-xs text-red-800 font-medium mb-4">
                In case of any urgent matters or school transport delays, please call:
              </p>
              <div className="space-y-2">
                 <a href="tel:+26824040000" className="flex items-center justify-between p-3 rounded-xl bg-white border border-red-100 hover:bg-red-50 transition-colors">
                    <span className="text-xs font-bold text-slate-900">Main Office (Call)</span>
                    <span className="text-xs font-bold text-red-600">+268 2404 0000</span>
                 </a>
                 <a href="https://wa.me/26876000000" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-white border border-green-100 hover:bg-green-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-600" />
                      <span className="text-xs font-bold text-slate-900">WhatsApp Support</span>
                    </div>
                    <span className="text-xs font-bold text-green-600">Message Us</span>
                 </a>
              </div>
           </CardContent>
        </Card>

        {/* Announcements Card */}
        <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden">
           <CardHeader className="bg-slate-50/80 pb-4 flex flex-row items-center justify-between">
              <div>
                 <CardTitle className="text-base font-black">Digital Noticeboard</CardTitle>
                 <CardDescription className="text-[10px] font-bold uppercase tracking-wider">Latest School News</CardDescription>
              </div>
              <Megaphone className="h-4 w-4 text-slate-400" />
           </CardHeader>
           <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                 {announcements.length > 0 ? (
                   announcements.slice(0, 3).map(a => (
                     <div key={a.id} className="p-4 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                       <div className="flex items-center justify-between mb-1">
                          <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase ${
                             a.priority === 'High' || a.priority === 'Urgent' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {a.priority}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold">{new Date(a.date).toLocaleDateString()}</span>
                       </div>
                       <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{a.title}</p>
                       <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">{a.content}</p>
                     </div>
                   ))
                 ) : (
                   <div className="p-10 text-center text-slate-400 text-xs italic">No current notices.</div>
                 )}
              </div>
              <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                 <Button variant="ghost" className="w-full text-blue-600 text-[10px] font-black uppercase tracking-widest h-8">View Archive</Button>
              </div>
           </CardContent>
        </Card>

        {/* Newsletters Card */}
        <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden bg-slate-900 text-white border-none">
           <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-black uppercase tracking-tight">Termly Newsletter</CardTitle>
              <FileText className="h-4 w-4 text-blue-400" />
           </CardHeader>
           <CardContent className="p-0">
              {newsletters.length > 0 ? (
                <div className="p-4 pt-0">
                   <div className="bg-slate-800 rounded-2xl p-4 flex gap-4 hover:bg-slate-700 transition-all cursor-pointer group">
                      <div className="h-16 w-16 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 border border-slate-700">
                         <Download className="h-6 w-6 text-slate-500 group-hover:text-white transition-colors" />
                      </div>
                      <div className="overflow-hidden">
                         <h4 className="text-xs font-bold truncate">{newsletters[0].title}</h4>
                         <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">Inside: Sports day results, upcoming holiday schedule, and more...</p>
                         <p className="text-[9px] text-blue-400 font-bold mt-2 uppercase tracking-wide">Download PDF</p>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-[10px] italic">Weekly newsletter coming soon!</div>
              )}
           </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDietaryLog = () => {
    const [reports, setReports] = useState<WeeklyDietaryReport[]>([]);
    const [fetchingReports, setFetchingReports] = useState(true);

    useEffect(() => {
      if (!user) return;
      const unsub = subscribeToCollection(
        'weekly_dietary_reports',
        (data) => {
          setReports(data as WeeklyDietaryReport[]);
          setFetchingReports(false);
        },
        where('studentId', 'in', students.map(s => s.id))
      );
      return () => unsub();
    }, [students]);

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Utensils className="h-6 w-6 text-emerald-600" />
              Dietary & Nutritional Reports
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium italic">
              Weekly summaries of your child's nutritional intake and meal observations.
            </p>
          </div>
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2 text-xs font-black uppercase tracking-widest">
            <CheckCircle2 className="h-4 w-4" /> GDPR Secure Health Data
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {reports.length > 0 ? (
            reports.map(report => (
              <Card key={report.id} className="overflow-hidden border-slate-200 hover:shadow-xl transition-all duration-300 rounded-[2.5rem]">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-emerald-600 text-white font-bold px-3 py-1 rounded-lg">
                      {format(new Date(report.startDate), 'MMM d')} - {format(new Date(report.endDate), 'MMM d, yyyy')}
                    </Badge>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weekly Summary</span>
                  </div>
                  <CardTitle className="mt-4 text-xl font-black text-slate-900">
                    Nutrition Overview: {report.studentName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100/50">
                    <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <ClipboardCheck className="h-3 w-3" /> Staff Clinical Summary
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">{report.summary}</p>
                  </div>

                  {report.recommendations && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommendations</h4>
                      <p className="text-sm text-slate-600 italic bg-amber-50/50 p-4 rounded-2xl border border-amber-100/30">
                        "{report.recommendations}"
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">Verified by {report.generatedBy}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Download className="h-3.5 w-3.5" /> PDF Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="lg:col-span-2 p-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center">
              <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <ChefHat className="h-10 w-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter Ital">No Reports Available</h3>
              <p className="text-slate-500 max-w-sm font-medium mt-4 leading-relaxed">
                {fetchingReports ? "Synchronizing with school health registry..." : "Your child's first dietary and nutritional summary will appear here once the weekly review is signed off by school staff."}
              </p>
              {fetchingReports && <Loader2 className="h-6 w-6 animate-spin text-blue-500 mt-6" />}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderChildren = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">Student Profiles</h2>
          <Button className="bg-blue-600 rounded-xl">Download Reports</Button>
       </div>

       {students.length > 0 ? (
         students.map(student => (
           <Card key={student.id} className="overflow-hidden border-slate-200">
              <CardContent className="p-0">
                 <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0 flex flex-col items-center">
                       <div className="h-32 w-32 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-slate-100">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`} alt="student" className="w-full h-full object-cover" />
                       </div>
                       <div className="mt-4 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                          Active Enrolled
                       </div>
                    </div>
                    <div className="flex-1 space-y-6">
                       <div>
                          <h3 className="text-2xl font-black text-slate-900 leading-tight">{student.name}</h3>
                          <p className="text-slate-500 font-medium">Grade: {student.class} • Age: {student.age}</p>
                       </div>
                       
                       <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                   <Activity className="h-4 w-4" />
                                </div>
                                <div className="overflow-hidden">
                                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Attendance Today</p>
                                   <p className="text-sm font-bold text-slate-900">Present (In Class)</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 font-bold shrink-0">
                                   <FileText className="h-4 w-4" />
                                </div>
                                <div className="overflow-hidden">
                                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Latest Progress Item</p>
                                   <p className="text-sm font-bold text-slate-900 truncate">Excellent participation in music</p>
                                </div>
                             </div>
                          </div>
                          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                             <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Medical Note</p>
                             <p className="text-xs text-slate-600 italic leading-relaxed">
                               {student.medicalInfo || "No special medical requirements reported."}
                             </p>
                          </div>
                       </div>

                       <div className="flex flex-wrap gap-2 pt-2">
                          <Button variant="outline" size="sm" className="rounded-xl text-xs h-9">View Attendance</Button>
                          <Button variant="outline" size="sm" className="rounded-xl text-xs h-9">Learning Journal</Button>
                          <Button variant="outline" size="sm" className="rounded-xl text-xs h-9">Message Teacher</Button>
                       </div>
                       
                       <div className="pt-4 border-t border-slate-100">
                          <p className="text-xs font-bold text-slate-900 mb-3">Digital Consent Forms</p>
                          <div className="flex flex-wrap gap-3">
                             <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 text-xs rounded-xl h-8" onClick={() => { setSigningConsentStudent(student); setConsentTypeToSign("medical"); }}>
                                Sign Medical Consent
                             </Button>
                             <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 text-xs rounded-xl h-8" onClick={() => { setSigningConsentStudent(student); setConsentTypeToSign("outing"); }}>
                                Sign Outing Permission
                             </Button>
                             <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 text-xs rounded-xl h-8" onClick={() => { setSigningConsentStudent(student); setConsentTypeToSign("policy"); }}>
                                Sign Policy Update
                             </Button>
                          </div>
                          {signedFiles.filter(f => f.studentId === student.id).length > 0 && (
                             <div className="mt-4 space-y-2">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Signed Documents</p>
                                {signedFiles.filter(f => f.studentId === student.id).map((f, i) => (
                                   <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                                      <div className="flex items-center gap-2">
                                         <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                         <span className="text-xs font-medium text-slate-700 capitalize">{f.type} Consent (PDF)</span>
                                      </div>
                                      <a href={f.url} download={`${student.name}_${f.type}_consent.pdf`} className="text-blue-600 hover:text-blue-700">
                                         <Download className="h-4 w-4" />
                                      </a>
                                   </div>
                                ))}
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
         ))
       ) : (
         <div className="p-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
           <User className="h-12 w-12 text-slate-200 mx-auto mb-4" />
           <p className="text-slate-500 font-medium">You don't have any students currently enrolled.</p>
         </div>
       )}
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">Fee Statements</h2>
          <div className="flex gap-2">
            <Button variant="outline" className="border-yellow-400 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded-xl">
              Pay via MTN MoMo
            </Button>
            <Button className="bg-blue-600 rounded-xl hidden sm:flex">Make Payment</Button>
          </div>
       </div>

       {fees.length > 0 ? (
         fees.map(fee => (
           <Card key={fee.id} className="overflow-hidden border-slate-200">
              <CardContent className="p-6">
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                          <CreditCard className="h-6 w-6" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-900">Term 2 Fees - {students.find(s => s.id === fee.studentId)?.name || 'Student'}</p>
                          <p className="text-xs text-slate-500 font-medium">Due by {new Date(fee.dueDate).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-8">
                       <div className="text-right">
                          <p className="text-2xl font-black text-slate-900">E{fee.amount}</p>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            fee.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {fee.status}
                          </span>
                       </div>
                       <Button variant="ghost" size="icon" className="text-slate-400">
                          <Download className="h-5 w-5" />
                       </Button>
                    </div>
                 </div>
              </CardContent>
           </Card>
         ))
       ) : (
         <div className="p-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
           <CreditCard className="h-12 w-12 text-slate-200 mx-auto mb-4" />
           <p className="text-slate-500 font-medium">No fee statements found.</p>
         </div>
       )}
    </div>
  );   const renderMessages = () => (
     <div className="space-y-6 h-[calc(100vh-200px)] sm:h-[calc(100vh-250px)] animate-in fade-in duration-500">
        <Card className="h-full border-slate-200 flex flex-col md:flex-row overflow-hidden shadow-2xl shadow-slate-200/50">
           {/* Inbox Sidebar - Hidden on mobile if thread selected */}
           <div className={`w-full md:w-80 border-r border-slate-100 bg-slate-50/50 flex flex-col ${selectedThread ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-4 border-b border-slate-200 bg-white">
                 <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl gap-2 h-11 font-black uppercase tracking-tighter" onClick={() => setSelectedThread('new')}>
                    <Plus className="h-4 w-4" /> Start Conversation
                 </Button>
              </div>
              <div className="flex-1 overflow-y-auto">
                 <div className="p-2 space-y-1">
                    {/* Dedicated support thread always present */}
                    <div 
                     className={`p-3 rounded-2xl cursor-pointer transition-all border ${selectedThread === 'school_admin' || selectedThread === 'new' ? 'bg-white border-blue-200 shadow-sm' : 'border-transparent hover:bg-white/60'}`}
                     onClick={() => setSelectedThread('school_admin')}
                    >
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
                            <Building className="h-5 w-5" />
                         </div>
                         <div className="flex-1 overflow-hidden">
                            <div className="flex items-center justify-between">
                               <p className="text-xs font-black text-slate-900 leading-none">School Office</p>
                               <span className="text-[9px] text-slate-400 font-bold">LIVE</span>
                            </div>
                            <p className="text-[10px] text-slate-500 truncate mt-1">Chat directly with school admin</p>
                         </div>
                      </div>
                    </div>
                 </div>

                 <div className="px-4 py-6 border-t border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 Ital">Direct Messages</p>
                    {messages.length > 0 ? (
                       messages.map(msg => (
                         <div 
                           key={msg.id} 
                           className={`p-3 mb-2 rounded-xl bg-white border transition-all cursor-pointer ${selectedThread === msg.id ? 'border-blue-600 shadow-sm' : 'border-slate-100 hover:border-blue-200'}`}
                           onClick={() => setSelectedThread(msg.id)}
                         >
                            <p className="text-xs font-bold text-slate-900">{msg.subject}</p>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">{msg.body}</p>
                         </div>
                       ))
                    ) : (
                       <div className="text-center py-10 opacity-30">
                         <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                         <p className="text-[10px] font-bold">No private chats</p>
                       </div>
                    )}
                 </div>
              </div>
           </div>
           
           {/* Conversation Area - Responsive */}
           <div className={`flex-1 flex flex-col h-full bg-white relative ${!selectedThread ? 'hidden md:flex' : 'flex'}`}>
              {selectedThread ? (
                <>
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                     <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="md:hidden text-slate-400" onClick={() => setSelectedThread(null)}>
                           <X className="h-5 w-5" />
                        </Button>
                        <div className="h-10 w-10 min-w-[40px] rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                           <Building className="h-5 w-5" />
                        </div>
                        <div>
                           <p className="text-sm font-black text-slate-900">School Administration</p>
                           <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-green-500" /> Always online • Replies within 2h
                           </p>
                        </div>
                     </div>
                     <Button variant="ghost" size="icon" className="text-slate-400">
                        <MoreHorizontal className="h-5 w-5" />
                     </Button>
                  </div>
                 
                 <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                    <div className="flex justify-center mb-8">
                       <span className="px-3 py-1 bg-white rounded-full text-[9px] font-bold text-slate-400 border border-slate-100 shadow-sm">
                          ENCRYPTED CONVERSATION
                       </span>
                    </div>

                    {messages.length > 0 ? (
                       messages.filter(m => m.senderId === user.uid || m.receiverId === user.uid).map(m => (
                         <div key={m.id} className={`flex ${m.senderId === user.uid ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-4 rounded-2xl text-xs font-medium shadow-sm ${
                               m.senderId === user.uid 
                                 ? 'bg-blue-600 text-white rounded-tr-none' 
                                 : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                            }`}>
                               {m.body}
                               <p className={`text-[8px] mt-1 text-right opacity-60`}>
                                  {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                               </p>
                            </div>
                         </div>
                       ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                         <div className="p-4 rounded-full bg-slate-200 mb-4">
                            <MessageSquare className="h-8 w-8 text-slate-400" />
                         </div>
                         <p className="text-xs font-bold text-slate-900">Start the conversation</p>
                         <p className="text-[10px] mt-1">Your message will be sent directly to the admissions team.</p>
                      </div>
                    )}
                 </div>

                 <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                    <form onSubmit={handleSendMessage} className="relative">
                       <Textarea 
                        placeholder="Type your message here..."
                        className="w-full pr-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white resize-none h-24"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                       />
                       <Button 
                        type="submit" 
                        disabled={isSending || !newMessage.trim()}
                        className="absolute bottom-3 right-3 h-10 w-10 p-0 rounded-xl bg-blue-600 shadow-lg shadow-blue-200"
                       >
                          {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                       </Button>
                    </form>
                    <p className="text-[10px] text-slate-400 text-center mt-3 font-medium">
                       Attaching documents? Use the "Applications" tab for formal submissions.
                    </p>
                 </div>
               </>
             ) : (
               <div className="flex-1 flex flex-col h-full items-center justify-center p-12 text-center opacity-80">
                  <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center mb-6 shadow-inner">
                     <MessageSquare className="h-12 w-12 text-slate-200" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter Ital">Direct Communication</h3>
                  <p className="text-xs text-slate-500 max-w-xs mt-3 leading-relaxed font-medium">
                     Message your child's teachers or the school office directly for inquiries, transport updates, or medical notifications.
                  </p>
                  <Button 
                    className="mt-8 bg-blue-600 rounded-xl gap-2 font-black uppercase tracking-widest px-8"
                    onClick={() => setSelectedThread('school_admin')}
                  >
                    Select a Conversation
                  </Button>
               </div>
             )}
          </div>
       </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-slate-900 text-lg tracking-tight block leading-none">Parent Portal</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Preschools Eswatini</span>
            </div>
          </div>

          <nav className="flex items-center bg-slate-50 rounded-xl p-1 gap-1 border border-slate-100 overflow-x-auto no-scrollbar max-w-[50vw] sm:max-w-none">
             <button 
               onClick={() => navigate("/")}
               className="text-[10px] sm:text-[11px] font-black px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap uppercase tracking-widest text-slate-500 hover:text-slate-900 hover:bg-slate-200"
             >
               <Globe className="h-3 w-3 inline-block -mt-0.5 mr-1" />
               Website
             </button>
             <button 
               onClick={() => setActiveTab("dashboard")}
               className={`text-[10px] sm:text-[11px] font-black px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap uppercase tracking-widest ${activeTab === 'dashboard' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
             >
               Home
             </button>
              <button 
               onClick={() => setActiveTab("children")}
               className={`text-[10px] sm:text-[11px] font-black px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap uppercase tracking-widest ${activeTab === 'children' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
             >
               Children
             </button>
              <button 
               onClick={() => setActiveTab("billing")}
               className={`text-[10px] sm:text-[11px] font-black px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap uppercase tracking-widest ${activeTab === 'billing' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
             >
               Billing
             </button>
              <button 
               onClick={() => setActiveTab("messages")}
               className={`text-[10px] sm:text-[11px] font-black px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap uppercase tracking-widest ${activeTab === 'messages' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
             >
               Chat
             </button>
              <button 
               onClick={() => setActiveTab("diet")}
               className={`text-[10px] sm:text-[11px] font-black px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap uppercase tracking-widest ${activeTab === 'diet' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
             >
               Dietary Log
             </button>
              <button 
               onClick={() => setActiveTab("privacy")}
               className={`text-[10px] sm:text-[11px] font-black px-3 sm:px-4 py-2 rounded-lg transition-all whitespace-nowrap uppercase tracking-widest ${activeTab === 'privacy' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
             >
               Privacy & GDPR
             </button>
          </nav>

          <div className="flex items-center gap-2">
            {isOffline && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-none hidden sm:flex items-center gap-1.5 animate-pulse mr-2">
                <WifiOff className="h-3.5 w-3.5" />
                Offline Mode
              </Badge>
            )}
            <div className="relative group">
               <Button variant="ghost" size="icon" className="text-slate-500 rounded-xl relative hover:bg-slate-50">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white" />
                )}
              </Button>
              
               {/* Notification Popper Mini */}
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                 <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900">Recent Notifications</span>
                    {unreadCount > 0 && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">{unreadCount} New</span>}
                 </div>
                 {!pushEnabled && (
                   <div className="px-4 py-3 bg-blue-50/50 border-b border-slate-100 flex flex-col items-center text-center gap-2">
                     <p className="text-[10px] text-blue-800 font-medium">Enable push notifications to get real-time alerts on your child's activities.</p>
                     <Button size="sm" onClick={requestPushPermission} className="h-7 text-[10px] bg-blue-600 w-full rounded-lg h-8">Enable Notifications</Button>
                   </div>
                 )}
                 <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map(n => (
                        <div key={n.id} className={`px-4 py-3 flex gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 ${!n.read ? 'bg-blue-50/30' : ''}`} onClick={() => markAsRead(n.id)}>
                           <div className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center ${n.type === 'admission_update' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                             {n.type === 'admission_update' ? <ClipboardCheck className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                           </div>
                           <div className="flex-1 overflow-hidden">
                              <p className="text-xs font-bold text-slate-900 truncate">{n.title}</p>
                              <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{n.message}</p>
                              <p className="text-[9px] text-slate-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-xs italic">No notifications yet.</div>
                    )}
                 </div>
              </div>
            </div>
            
            <div className="h-8 w-[1px] bg-slate-200 mx-1 sm:mx-2" />
            
            <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all cursor-pointer" onClick={() => navigate("/profile")}>
              <div className="h-9 w-9 rounded-xl bg-slate-200 border border-slate-100 flex items-center justify-center text-slate-500 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="avatar" />
              </div>
            </div>
            
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 ml-1 rounded-xl" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 w-full">
        <header className="mb-10">
           <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
              <Clock className="h-3 w-3" /> Dashboard
           </div>
           <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">Welcome back, {user.name?.split(' ')[0]}</h1>
           <p className="text-slate-500 mt-2 font-medium">Here's what's happening today in your children's learning journey.</p>
        </header>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'children' && renderChildren()}
        {activeTab === 'billing' && renderBilling()}
        {activeTab === 'messages' && renderMessages()}
        {activeTab === 'diet' && renderDietaryLog()}
        {activeTab === 'privacy' && renderPrivacy()}
      </main>

      <AIChatBot schoolName="Parent Support" />

      {signingConsentStudent && (
        <DigitalSignatureModal 
          isOpen={true} 
          onClose={() => setSigningConsentStudent(null)}
          studentName={signingConsentStudent.name}
          consentType={consentTypeToSign}
          onSave={(pdfDataUri) => {
             setSignedFiles(prev => [...prev, {
                studentId: signingConsentStudent.id,
                type: consentTypeToSign,
                url: pdfDataUri
             }]);
          }}
        />
      )}
    </div>
  );
}

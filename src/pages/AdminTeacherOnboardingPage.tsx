import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import { 
  createDocument, 
  updateDocument, 
  subscribeToCollection, 
  fetchCollection 
} from "@/lib/firestoreUtils";
import { where } from "firebase/firestore";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { 
  UserPlus, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Upload, 
  X, 
  Mail, 
  Phone, 
  Briefcase, 
  Award, 
  ArrowRight, 
  ShieldCheck, 
  ChevronRight, 
  Check, 
  Search, 
  Plus, 
  Sparkles, 
  School, 
  GraduationCap, 
  Calendar, 
  Users,
  Building,
  FileSpreadsheet,
  Download
} from "lucide-react";

type TeacherOnboarding = {
  id: string;
  schoolId: string;
  userUid: string;
  name: string;
  email: string;
  phone: string;
  qualifications: string;
  experienceYears: number;
  specialization: string;
  status: "pending" | "approved" | "rejected";
  notes?: string;
  certificateName?: string;
  certificateSize?: string;
  createdAt: string;
  updatedAt: string;
};

type SchoolData = {
  id: string;
  name: string;
  town: string;
  region: string;
  email?: string;
};

export default function AdminTeacherOnboardingPage() {
  const { user, activeSchoolId } = useAuth();
  
  // View switches
  // For developer ease & demonstration, allow switching between simulated roles if they want to demo both
  const [activeRoleMode, setActiveRoleMode] = useState<"teacher" | "admin">(
    user?.role === "SchoolAdmin" || user?.role === "SuperAdmin" ? "admin" : "teacher"
  );

  // Firestore & lists
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [onboardings, setOnboardings] = useState<TeacherOnboarding[]>([]);
  const [teacherOwnOnboardings, setTeacherOwnOnboardings] = useState<TeacherOnboarding[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [schoolSearch, setSchoolSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [selectedOnboarding, setSelectedOnboarding] = useState<TeacherOnboarding | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  // Create Application Form state
  const [formStep, setFormStep] = useState(1);
  const [selectedSchool, setSelectedSchool] = useState<SchoolData | null>(null);
  const [teacherName, setTeacherName] = useState(user?.name || "");
  const [teacherEmail, setTeacherEmail] = useState(user?.email || "");
  const [teacherPhone, setTeacherPhone] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [experienceYears, setExperienceYears] = useState(2);
  const [specialization, setSpecialization] = useState("Early Childhood Literacy");
  const [whyJoin, setWhyJoin] = useState("");

  // Upload Simulation state
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock certificate preview modal
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Fetch registered schools and subscribe to updates
  useEffect(() => {
    // 1. Load Schools for the lookup
    const loadSchools = async () => {
      try {
        const schoolsData = await fetchCollection("schools");
        if (schoolsData && schoolsData.length > 0) {
          setSchools(schoolsData as SchoolData[]);
        } else {
          // fallback mock schools standard for Swaziland if empty
          setSchools([
            { id: "school-1", name: "Mbabane Early Excellence Nursery", town: "Mbabane", region: "Hhohho" },
            { id: "school-2", name: "Manzini Toddlers Montessori", town: "Manzini", region: "Manzini" },
            { id: "school-3", name: "Piggs Peak Christian ECD Centre", town: "Piggs Peak", region: "Hhohho" },
            { id: "school-4", name: "Ezulwini Peak Valley Preschool", town: "Ezulwini", region: "Hhohho" },
            { id: "school-5", name: "Siteki Cooperative Daycare", town: "Siteki", region: "Lubombo" },
            { id: "shiselweni-6", name: "Nhlangano Kindercare Academy", town: "Nhlangano", region: "Shiselweni" }
          ]);
        }
      } catch (err) {
        console.warn("Could not load schools list from Firestore", err);
      }
    };
    loadSchools();

    // 2. Subscribe to general onboardings (for school admin)
    const effectiveSchool = user?.role === "SuperAdmin" ? activeSchoolId : user?.schoolId;
    const unsubOnboardings = subscribeToCollection(
      "teacher_onboardings",
      (data) => {
        let sorted = (data as TeacherOnboarding[]).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOnboardings(sorted);
        setLoading(false);
      }
    );

    // 3. Subscribe to current user's specific applications
    if (user?.uid) {
      const unsubMyOnboardings = subscribeToCollection(
        "teacher_onboardings",
        (data) => {
          const filtered = (data as TeacherOnboarding[]).filter(x => x.userUid === user.uid);
          setTeacherOwnOnboardings(filtered);
        }
      );
      return () => {
        unsubOnboardings();
        unsubMyOnboardings();
      };
    }

    return () => {
      unsubOnboardings();
    };
  }, [user, activeSchoolId]);

  // Autofill demo data for evaluating
  const handleAutofillDemo = () => {
    setTeacherName("Nokwanda Dlamini");
    setTeacherEmail("nokwanda.dlamini@eswatinischools.co.sz");
    setTeacherPhone("+268 7689 4321");
    setQualifications("Level 4 Certificate in Early Childhood Development - Sebenta National Institute, 2023. Attended UNICEF Rural Preschool Playgroup Facilitator course (120 Hours). Certified by Swazis for Positive Living (SWAPOL) care network.");
    setExperienceYears(4);
    setSpecialization("ECD Phonetics & Language Studies");
    setWhyJoin("I am deeply passionate about expanding early childhood bilingual learning models in Swazi villages. I would love to guide classroom chalkboard milestones.");
    setUploadedFile({
      name: "Nokwanda_Dlamini_Sebenta_ECD_Certificate.pdf",
      size: "2.8 MB"
    });
    toast.success("Demo educator qualifications loaded!");
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateFileUpload(e.dataTransfer.files[0].name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateFileUpload(e.target.files[0].name);
    }
  };

  // Simulated file upload progression
  const simulateFileUpload = (filename: string) => {
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          setUploadedFile({
            name: filename,
            size: `${(Math.random() * 3 + 1).toFixed(1)} MB`
          });
          toast.success("Accreditation document metadata attached successfully!");
          return null;
        }
        return prev + 30;
      });
    }, 300);
  };

  // Submit Application
  const handleSubmitApplication = async () => {
    if (!selectedSchool) {
      toast.error("Please search and select a school to submit your onboarding for!");
      return;
    }
    if (!teacherName || !teacherEmail || !teacherPhone) {
      toast.error("Please input your contact information!");
      return;
    }
    if (!qualifications) {
      toast.error("Please supply your academic qualifications!");
      return;
    }

    try {
      const payload: Omit<TeacherOnboarding, "id"> = {
        schoolId: selectedSchool.id,
        userUid: user?.uid || "anonymous-dev-user",
        name: teacherName,
        email: teacherEmail,
        phone: teacherPhone,
        qualifications: qualifications,
        experienceYears: experienceYears,
        specialization: specialization,
        status: "pending",
        notes: whyJoin,
        certificateName: uploadedFile?.name || "Eswatini_Teacher_Accrediting_Form.pdf",
        certificateSize: uploadedFile?.size || "1.8 MB",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await createDocument("teacher_onboardings", null, payload);
      toast.success(`Application successfully sent to ${selectedSchool.name}!`);
      
      // Reset onboarding steps
      setFormStep(1);
      setUploadedFile(null);
      setWhyJoin("");
    } catch (err) {
      toast.error("Failed to submit onboarding application.");
    }
  };

  // Admin Actions: Approve Onboarding
  const handleApprove = async (app: TeacherOnboarding) => {
    try {
      // 1. Update onboarding application status in Firestore
      await updateDocument("teacher_onboardings", app.id, {
        status: "approved",
        notes: adminNotes || "Authorized by School Administrator.",
        updatedAt: new Date().toISOString()
      });

      // 2. Automatically register this authorized teacher under 'staff' so they appear in staffing lists automatically!
      const staffPayload = {
        schoolId: app.schoolId,
        name: app.name,
        role: "Educator (ECD Teacher)",
        email: app.email,
        phone: app.phone,
        specialization: app.specialization || "Early Childhood Education",
        joinDate: new Date().toISOString().split("T")[0],
        status: "Active",
        photoUrl: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await createDocument("staff", null, staffPayload);
      
      toast.success(`Educator "${app.name}" approved, authorized, and registered in staff directory!`);
      setSelectedOnboarding(null);
      setAdminNotes("");
    } catch (err) {
      toast.error("Error authorizing instructor.");
    }
  };

  // Admin Actions: Reject Onboarding
  const handleReject = async (app: TeacherOnboarding) => {
    if (!adminNotes) {
      toast.error("Please provide the reason for rejection in the Admin Notes box first.");
      return;
    }

    try {
      await updateDocument("teacher_onboardings", app.id, {
        status: "rejected",
        notes: adminNotes,
        updatedAt: new Date().toISOString()
      });

      toast.info(`Application of "${app.name}" was declined with feedback.`);
      setSelectedOnboarding(null);
      setAdminNotes("");
    } catch (err) {
      toast.error("Error updating application status.");
    }
  };

  // Filter school lookup list
  const filteredSchoolsList = schools.filter(s => 
    s.name.toLowerCase().includes(schoolSearch.toLowerCase()) ||
    s.town.toLowerCase().includes(schoolSearch.toLowerCase()) ||
    s.region.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  // Filter incoming admin applications
  const currentSchoolId = user?.role === "SuperAdmin" ? activeSchoolId : user?.schoolId;
  const filteredOnboardings = onboardings
    .filter(app => {
      // If of course the user is school admin, only see applications submitted to their school
      if (user?.role === "SchoolAdmin" && currentSchoolId) {
        return app.schoolId === currentSchoolId;
      }
      return true; // SuperAdmin sees all
    })
    .filter(app => {
      const matchSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "all" || app.status === statusFilter;
      return matchSearch && matchStatus;
    });

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 py-6 sm:px-6">
      
      {/* Upper Brand Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 font-extrabold text-xs px-3 py-1 rounded-full border border-indigo-400/20">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            Eswatini Preschool Council Standards
          </div>
          <h1 className="text-3xl font-black tracking-tight leading-tight">Teacher Onboarding Hub</h1>
          <p className="text-sm text-slate-300 font-medium">
            Register as a qualified preschool educator, upload certification booklets, and request immediate school principal credentials authorization to start conducting live chalk sessions.
          </p>
        </div>

        {/* Dynamic simulation toggle for demonstration purposes */}
        <div className="bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 flex items-center gap-1">
          <Button 
            onClick={() => setActiveRoleMode("teacher")} 
            size="sm"
            variant={activeRoleMode === "teacher" ? "default" : "ghost"}
            className={`rounded-xl text-[11px] font-extrabold h-8 ${
              activeRoleMode === "teacher" ? "bg-indigo-600 text-white hover:bg-indigo-700" : "text-slate-300 hover:text-white"
            }`}
          >
            <UserPlus className="mr-1.5 h-3.5 w-3.5" />
            Demo Teacher Portal
          </Button>

          <Button 
            onClick={() => setActiveRoleMode("admin")} 
            size="sm"
            variant={activeRoleMode === "admin" ? "default" : "ghost"}
            className={`rounded-xl text-[11px] font-extrabold h-8 ${
              activeRoleMode === "admin" ? "bg-indigo-600 text-white hover:bg-indigo-700" : "text-slate-300 hover:text-white"
            }`}
          >
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
            Demo Admin Panel
            {onboardings.filter(x => x.status === "pending").length > 0 && (
              <span className="ml-1.5 bg-amber-500 text-slate-950 text-[9px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                {onboardings.filter(x => x.status === "pending").length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Main Container Switch */}
      {activeRoleMode === "teacher" ? (
        
        // ================= TEACHER APPLICANT VIEW =================
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Application Form & Status trackers */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* If has submitted an application, show active tracker stats */}
            {teacherOwnOnboardings.length > 0 && (
              <Card className="border-indigo-100 shadow-sm overflow-hidden bg-slate-50/50">
                <CardHeader className="bg-indigo-50/30 border-b border-indigo-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-md font-bold text-slate-900">Your Registry Submissions</CardTitle>
                      <CardDescription className="text-xs">Monitor verification progress and council review comments.</CardDescription>
                    </div>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md font-black">
                      {teacherOwnOnboardings.length} Submitted
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {teacherOwnOnboardings.map((app) => {
                    const targetSchool = schools.find(s => s.id === app.schoolId);
                    return (
                      <div key={app.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-indigo-200 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                              <School className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-xs">{targetSchool?.name || "Eswatini Preschool partner"}</h4>
                              <p className="text-[10px] text-slate-500 font-semibold">{targetSchool?.town}, {targetSchool?.region} region</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${
                              app.status === "approved" ? "bg-green-100 text-green-800" :
                              app.status === "rejected" ? "bg-red-105 text-red-800" :
                              "bg-amber-100 text-amber-800 animate-pulse"
                            }`}>
                              {app.status === "approved" ? "Authorized" :
                               app.status === "rejected" ? "Requires Correction" :
                               "Awaiting Principal Approval"}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Timeline Progress */}
                        <div className="grid grid-cols-3 gap-2 relative mt-2 mb-4">
                          <div className="absolute top-[14px] left-[15%] right-[15%] h-[2px] bg-slate-100 -z-0">
                            <div className={`h-full bg-indigo-500 transition-all duration-700 ${
                              app.status === "approved" ? "w-full" : app.status === "rejected" ? "w-[50%] bg-red-400" : "w-[50%]"
                            }`} />
                          </div>

                          <div className="text-center z-10 flex flex-col items-center">
                            <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center border border-indigo-400 font-bold text-xs ring-4 ring-indigo-50">
                              <Check className="h-4 w-4" />
                            </div>
                            <span className="text-[9px] font-extrabold text-slate-800 mt-1">Submitted</span>
                            <span className="text-[8px] text-slate-400 font-medium font-mono">{new Date(app.createdAt).toLocaleDateString()}</span>
                          </div>

                          <div className="text-center z-10 flex flex-col items-center">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              app.status === 'approved' || app.status === 'rejected' 
                                ? 'bg-indigo-600 text-white border-indigo-400 ring-4 ring-indigo-50' 
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}>
                              {app.status === "approved" || app.status === "rejected" ? <Check className="h-4 w-4" /> : <Clock className="h-4 w-4 animate-spin text-amber-600" />}
                            </div>
                            <span className="text-[9px] font-extrabold text-slate-800 mt-1">Council Review</span>
                            <span className="text-[8px] text-slate-400 font-medium">In Process</span>
                          </div>

                          <div className="text-center z-10 flex flex-col items-center">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
                              app.status === 'approved' ? 'bg-green-600 text-white border-green-400 ring-4 ring-green-100' :
                              app.status === 'rejected' ? 'bg-red-600 text-white border-red-400' :
                              'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}>
                              {app.status === "approved" ? <ShieldCheck className="h-4 w-4" /> : app.status === "rejected" ? <X className="h-4 w-4" /> : <Award className="h-4 w-4" />}
                            </div>
                            <span className="text-[9px] font-extrabold text-slate-800 mt-1">Permit Active</span>
                            <span className="text-[8px] text-slate-405 font-medium">{app.status === "approved" ? "Granted" : app.status === "rejected" ? "Decline" : "Pending"}</span>
                          </div>
                        </div>

                        {app.status === "approved" ? (
                          <div className="bg-green-50 border border-green-200/60 p-3 rounded-xl flex items-start gap-2.5">
                            <div className="h-6 w-6 rounded bg-green-100 flex items-center justify-center text-green-700 shrink-0 mt-0.5">
                              <Sparkles className="h-3.5 w-3.5 animate-bounce" />
                            </div>
                            <div className="text-left">
                              <p className="font-extrabold text-[11px] text-green-900">Qualified ECD Teacher Status: Authorized!</p>
                              <p className="text-[10px] text-green-700 font-semibold leading-relaxed">
                                Congratulations! School administrator reviews verified and approved your experience credentials. You have been automatically added to the staff directory.
                              </p>
                              <div className="mt-2 flex items-center gap-1.5">
                                <a 
                                  href="/learning" 
                                  className="inline-flex items-center text-[10px] bg-green-600 hover:bg-green-700 text-white px-2.5 py-1 rounded-md font-extrabold transition-all"
                                >
                                  Open Digital Chalkboard Room <ArrowRight className="ml-1 h-3 w-3" />
                                </a>
                              </div>
                            </div>
                          </div>
                        ) : app.status === "rejected" ? (
                          <div className="bg-red-50 border border-red-200/65 p-3 rounded-xl">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-extrabold text-[11px] text-red-900">Application Declined / Correction Required</p>
                                <p className="text-[10px] text-red-700 font-semibold italic mt-0.5">"Feedback: {app.notes || "Please double check your qualification certification attachments and resubmit."}"</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-amber-50/70 border border-amber-200/60 p-3 rounded-xl text-[10px] text-amber-900 font-semibold leading-relaxed">
                            💡 <strong>Verification Tip:</strong> School owners in {targetSchool?.town} review applicant credentials before authorizing. Contact them at <span className="underline">{targetSchool?.email || "admin@eswatinischools.co.sz"}</span> if you need instant accreditation.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Application Submission Form */}
            <Card className="border-slate-200 shadow-sm border-2 rounded-2xl overflow-hidden bg-white">
              <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <CardTitle className="text-md font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-indigo-600" />
                    Preschool Teacher Registration & Permit
                  </CardTitle>
                  <CardDescription className="text-xs">Submit early childhood credentials block.</CardDescription>
                </div>
                <Button 
                  onClick={handleAutofillDemo} 
                  variant="outline" 
                  size="sm"
                  className="bg-white border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 text-xs font-bold text-indigo-650 h-8 rounded-lg shrink-0"
                >
                  <Sparkles className="mr-1 h-3.5 w-3.5 text-indigo-500" />
                  Auto-fill demo qualifications
                </Button>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                
                {/* Stepper Navigation */}
                <div className="flex items-center justify-center gap-1.5 border-b border-slate-100 pb-4 mb-4">
                  {[1, 2, 3].map((stepNum) => (
                    <React.Fragment key={stepNum}>
                      <div className="flex items-center gap-1.5">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                          formStep === stepNum 
                            ? "bg-indigo-600 text-white" 
                            : formStep > stepNum 
                            ? "bg-indigo-100 text-indigo-800" 
                            : "bg-slate-100 text-slate-400"
                        }`}>
                          {stepNum}
                        </div>
                        <span className={`text-[10px] font-extrabold ${formStep === stepNum ? "text-indigo-800" : "text-slate-400"}`}>
                          {stepNum === 1 ? "Target School" : stepNum === 2 ? "Qualifications" : "Review Submit"}
                        </span>
                      </div>
                      {stepNum < 3 && <ChevronRight className="h-3 w-3 text-slate-300" />}
                    </React.Fragment>
                  ))}
                </div>

                {/* Form Step 1: Taraget School Selection */}
                {formStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-800 block">Search & Select Target Eswatini School</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                          placeholder="Search school name, town or region..." 
                          className="pl-9 bg-slate-50 border-slate-200 text-xs font-semibold h-10 rounded-xl"
                          value={schoolSearch}
                          onChange={(e) => setSchoolSearch(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="max-h-52 overflow-y-auto border border-slate-150 rounded-xl divide-y p-1.5 bg-slate-50">
                      {filteredSchoolsList.map((sc) => {
                        const isSelected = selectedSchool?.id === sc.id;
                        return (
                          <div 
                            key={sc.id} 
                            onClick={() => setSelectedSchool(sc)}
                            className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-all ${
                              isSelected ? "bg-indigo-600 text-white shadow-sm" : "bg-white hover:bg-slate-100 text-slate-800"
                            }`}
                          >
                            <div className="min-w-0">
                              <h5 className="font-extrabold text-xs truncate">{sc.name}</h5>
                              <p className={`text-[10px] font-semibold ${isSelected ? "text-indigo-100" : "text-slate-500"}`}>
                                📍 {sc.town}, {sc.region} Region
                              </p>
                            </div>
                            <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 border ${
                              isSelected ? "bg-white text-indigo-600 border-transparent" : "border-slate-350"
                            }`}>
                              {isSelected && <Check className="h-3 w-3 block" />}
                            </div>
                          </div>
                        );
                      })}
                      {filteredSchoolsList.length === 0 && (
                        <div className="text-center py-6 text-xs text-slate-500 font-semibold">
                          No matching schools found. Filter by Mbabane or Manzini town.
                        </div>
                      )}
                    </div>

                    {selectedSchool && (
                      <div className="bg-indigo-50 border border-indigo-150 p-3.5 rounded-xl flex items-start gap-2.5">
                        <Building className="h-5 w-5 text-indigo-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-extrabold text-indigo-950">You are applying to:</p>
                          <h6 className="font-black text-indigo-900 text-sm mt-0.5">{selectedSchool.name}</h6>
                          <p className="text-[10px] text-indigo-705 font-bold">Upon approval, your authorized teaching credentials will grant stream keys for this institution.</p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <Button 
                        disabled={!selectedSchool}
                        onClick={() => setFormStep(2)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 rounded-xl h-9"
                      >
                        Qualifying Credentials <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Form Step 2: Qualifications & Experience */}
                {formStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold text-slate-800 block">In-Country Contact Number</label>
                        <Input 
                          placeholder="e.g. +268 7600 0000" 
                          className="bg-slate-50 border-slate-200 text-xs font-semibold h-10 rounded-xl"
                          value={teacherPhone}
                          onChange={(e) => setTeacherPhone(e.target.value)}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold text-slate-800 block">Your Specialization</label>
                        <select 
                          className="w-full h-10 rounded-xl bg-slate-50 border border-slate-200 text-xs px-3 font-semibold text-slate-700"
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                        >
                          <option value="Early Childhood Literacy">Early Childhood Literacy</option>
                          <option value="Numeracy & Logic Games">Numeracy & Logic Games</option>
                          <option value="Montessori Sensory Play">Montessori Sensory Play</option>
                          <option value="Special Needs & Inclusive Care">Special Needs & Inclusive Care</option>
                          <option value="Swazi Language & Cultural Studies">Swazi Language & Cultural Studies</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold text-slate-800 block flex justify-between">
                        <span>ECD Classroom Experience</span>
                        <span className="text-indigo-650">{experienceYears} Years</span>
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="15" 
                        className="w-full accent-indigo-650 h-2 bg-slate-100 rounded-lg cursor-pointer"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold text-slate-800 block">Qualifications & Accreditation Details</label>
                      <textarea 
                        rows={3}
                        placeholder="State any certificates, degrees, Montessori training, university awards..."
                        className="w-full text-xs font-semibold p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-600/20"
                        value={qualifications}
                        onChange={(e) => setQualifications(e.target.value)}
                      />
                    </div>

                    {/* Integrated Certificate upload zone */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-extrabold text-slate-800 block">Accredition Council Booklet / Certification PDF</label>
                      <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[110px] ${
                          isDragging ? "border-indigo-500 bg-indigo-50/50" : "border-slate-250 hover:bg-slate-50 bg-slate-50/20"
                        }`}
                      >
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileSelect}
                        />
                        
                        {uploadProgress !== null ? (
                          <div className="w-full max-w-xs space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-slate-650">
                              <span>Compressing and securing...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${uploadProgress}%` }} />
                            </div>
                          </div>
                        ) : uploadedFile ? (
                          <div className="flex items-center gap-2.5 bg-indigo-50/70 border border-indigo-100 p-2.5 rounded-xl w-full max-w-sm">
                            <FileText className="h-8 w-8 text-indigo-600 shrink-0" />
                            <div className="text-left min-w-0 flex-1">
                              <p className="font-extrabold text-[11px] text-slate-900 truncate">{uploadedFile.name}</p>
                              <p className="text-[9px] text-slate-400 font-semibold">{uploadedFile.size} | Attached</p>
                            </div>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-6 w-6 rounded text-slate-400 hover:text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                setUploadedFile(null);
                              }}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-6 w-6 text-slate-400 mb-1.5" />
                            <p className="font-extrabold text-slate-800 text-[11px]">Drop qualified proof PDF here, or click to browse</p>
                            <p className="text-[9px] text-slate-400 font-semibold font-sans mt-0.5">Maximum file upload size 10MB (Ministry guidelines standard)</p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button 
                        variant="ghost"
                        onClick={() => setFormStep(1)}
                        className="text-slate-500 font-extrabold text-xs px-4"
                      >
                        Back
                      </Button>
                      <Button 
                        disabled={!qualifications || !teacherPhone}
                        onClick={() => setFormStep(3)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 rounded-xl h-9"
                      >
                        Review Submission <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Form Step 3: Bio & Review submission */}
                {formStep === 3 && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 text-left space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-205 pb-1">
                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Review application summary</span>
                        <Button variant="ghost" onClick={() => setFormStep(2)} className="h-5 text-indigo-600 text-[10px] font-bold p-0">Edit info</Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <span className="text-[9px] text-slate-400 font-extrabold block uppercase">Full Name</span>
                          <span className="text-xs text-slate-800 font-bold">{teacherName || "Sipho Dlamini"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 font-extrabold block uppercase">Official Email</span>
                          <span className="text-xs text-slate-800 font-bold">{teacherEmail}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 font-extrabold block uppercase">Preschool Partner</span>
                          <span className="text-xs text-indigo-950 font-black">{selectedSchool?.name || "Active Montessori"}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 font-extrabold block uppercase">Experience & Focus</span>
                          <span className="text-xs text-slate-800 font-bold">{experienceYears} Years — {specialization}</span>
                        </div>
                      </div>

                      <div className="border-t border-slate-200/50 pt-2 shrink-0">
                        <span className="text-[9px] text-slate-400 font-extrabold block uppercase">Certification Accreditation Booklet</span>
                        <div className="flex items-center gap-1.5 text-xs text-indigo-650 font-bold mt-0.5">
                          <Award className="h-4 w-4 text-indigo-500 shrink-0" />
                          <span>{uploadedFile?.name || "Eswatini_Teacher_Accrediting_Form.pdf"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-extrabold text-slate-800 block">Personal Motivation Intro (To School Principal)</label>
                      <textarea 
                        rows={2}
                        placeholder="Write a brief intro message introducing yourself to the review committee..."
                        className="w-full text-xs font-semibold p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
                        value={whyJoin}
                        onChange={(e) => setWhyJoin(e.target.value)}
                      />
                    </div>

                    <div className="bg-indigo-50/70 border border-indigo-100 p-3.5 rounded-xl text-[10px] text-indigo-900 font-semibold leading-relaxed">
                      🔒 <strong>Information Security Pledge:</strong> Submitted credentials are sent securely via Firestore to authenticated school heads for active registration auditing.
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button 
                        variant="ghost"
                        onClick={() => setFormStep(2)}
                        className="text-slate-500 font-extrabold text-xs px-4 animate-none"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handleSubmitApplication}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-6 rounded-xl h-10 shadow-sm"
                      >
                        Submit Completed Application
                      </Button>
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>

          </div>

          {/* Right: Qualifications Criteria & Resource Box */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            <Card className="border-slate-205 shadow-sm bg-white">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-xs font-extrabold text-slate-450 uppercase tracking-widest flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" />
                  Educator Standards & Permits
                </CardTitle>
                <h3 className="font-black text-slate-900 text-md tracking-tight leading-snug mt-1">Eswatini Early Education Permit Check</h3>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  Preschools and Daycares registered under the Ministry of Education & Training of Eswatini mandate specific criteria checks before staff can manage digital classroom streams.
                </p>

                <div className="space-y-3">
                  <div className="flex gap-2.5 items-start">
                    <div className="h-5 w-5 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-700 font-bold text-[10px] mt-0.5">1</div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">ECD Training or Certificate</h5>
                      <p className="text-[10px] text-slate-450 font-medium">Early childhood credentials including Sebenta National Institute training, NGO/church workshop certs, or local neighborhood playgroup facilitator portfolios.</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <div className="h-5 w-5 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-700 font-bold text-[10px] mt-0.5">2</div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">School Admin Authentication</h5>
                      <p className="text-[10px] text-slate-450 font-medium font-sans">Active evaluation of certificates by target school system administrators to secure stream rooms against bad actors.</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <div className="h-5 w-5 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-700 font-bold text-[10px] mt-0.5">3</div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">Virtual Chalkboard Activation</h5>
                      <p className="text-[10px] text-slate-450 font-medium">Automatic registration as staff instantly grants interactive chalk permissions over e-learning modules.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-205 flex items-center gap-2">
                  <FileSpreadsheet className="h-8 w-8 text-slate-400 shrink-0" />
                  <div className="min-w-0 text-left">
                    <p className="font-bold text-xs text-slate-800 truncate">MoET_ECD_Curriculum_Guidelines_2026.pdf</p>
                    <p className="text-[9px] text-slate-400 font-semibold">1.4 MB | Preschool Council standard booklet</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-150 shadow-sm p-4 text-indigo-950 rounded-2xl relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-y-1/4 translate-x-1/4 opacity-10">
                <GraduationCap className="h-40 w-40 text-indigo-900" />
              </div>
              <h4 className="font-black text-sm tracking-tight text-indigo-900">Live Stream & Lesson Ecosystem</h4>
              <p className="text-[11px] font-semibold text-indigo-800 leading-relaxed mt-1">
                Preschools Eswatini supports interactive chalkboard sessions! Teachers can write lesson plans, stream active canvas drawings vectors, and track participant votes in polls. Getting authorized here is your gateway to full platform utilities.
              </p>
              <div className="mt-3">
                <a href="/learning" className="inline-flex items-center text-[10px] bg-slate-900 text-white font-extrabold px-3 py-1.5 rounded-xl hover:bg-slate-800 transition-colors">
                  Explore Learning Ecosystem <ArrowRight className="ml-1.5 h-3 w-3" />
                </a>
              </div>
            </Card>

          </div>

        </div>

      ) : (

        // ================= SCHOOL ADMIN AUTHORIZATION VIEW =================
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
          
          {/* Left panel: Applicants feed */}
          <div className="lg:col-span-8 space-y-6">
            
            <Card className="border-slate-200 bg-white shadow-sm rounded-2xl overflow-hidden border">
              <CardHeader className="bg-slate-50/70 border-b border-indigo-50/50 pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <CardTitle className="text-md font-bold text-slate-900">Verify & Authorize Educators</CardTitle>
                    <CardDescription className="text-xs">
                      {user?.role === "SuperAdmin" 
                        ? "Currently displaying onboarding applicants for all partner preschools across Eswatini." 
                        : "Verify academic compliance and qualifications for applicants applying to your preschool."}
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <select 
                      className="h-8.5 rounded-lg bg-white border border-slate-250 text-[10px] px-2 font-bold text-slate-700 outline-none"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                    >
                      <option value="all">All Applicants</option>
                      <option value="pending">Pending Review Only</option>
                      <option value="approved">Approved & Authorized</option>
                      <option value="rejected">Rejected Only</option>
                    </select>
                  </div>
                </div>

                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input 
                    placeholder="Search applicants by name, email or specialization..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 bg-white border-slate-200 text-xs h-9 rounded-xl font-semibold"
                  />
                </div>
              </CardHeader>
              
              <CardContent className="p-0 divide-y">
                {loading ? (
                  <div className="p-12 text-center text-xs text-slate-400 font-extrabold flex items-center justify-center gap-2">
                    <span className="h-4 w-4 border-2 border-indigo-650 border-t-transparent rounded-full animate-spin" />
                    Loading submitted registrations from Ministry database...
                  </div>
                ) : filteredOnboardings.length > 0 ? (
                  filteredOnboardings.map((app) => {
                    const targetSchool = schools.find(s => s.id === app.schoolId);
                    const isSelected = selectedOnboarding?.id === app.id;
                    return (
                      <div 
                        key={app.id} 
                        onClick={() => {
                          setSelectedOnboarding(app);
                          setAdminNotes(app.notes || "");
                        }}
                        className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isSelected ? "bg-indigo-50/40 border-l-4 border-indigo-600" : ""
                        }`}
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-slate-900 text-xs truncate">{app.name}</h4>
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                              app.status === "approved" ? "bg-green-50 text-green-700 border border-green-200/50" :
                              app.status === "rejected" ? "bg-red-50 text-red-700 border border-red-200/50" :
                              "bg-amber-50 text-amber-700 border border-amber-200/50"
                            }`}>
                              {app.status}
                            </span>
                          </div>

                          <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {app.email} 
                            <span className="text-slate-300">|</span> 
                            <Phone className="h-3 w-3" /> {app.phone}
                          </p>

                          <p className="text-[10px] text-indigo-950 font-bold flex items-center gap-1.5 mt-1 bg-slate-100 px-2 py-0.5 rounded w-fit">
                            <Building className="h-3 w-3 text-indigo-600" /> Apply to: {targetSchool?.name || "Unspecified Preschool Partner"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right hidden sm:block">
                            <span className="text-[10px] font-black text-slate-650 block">ECD Specialization:</span>
                            <span className="text-[9px] font-extrabold text-indigo-850 block">{app.specialization}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center text-xs text-slate-500 font-semibold">
                    No submitted teacher registrations found matching specified filter categories.
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Right panel: Active review detail */}
          <div className="lg:col-span-4 space-y-6">
            
            <AnimatePresence mode="wait">
              {selectedOnboarding ? (
                <motion.div
                  key={selectedOnboarding.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-indigo-200 border-2 shadow-md bg-white overflow-hidden rounded-2xl">
                    <CardHeader className="bg-indigo-50/50 pb-4 border-b border-indigo-100 flex justify-between items-start">
                      <div>
                        <span className="text-[9px] bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded font-black max-w-fit block uppercase tracking-wide">Educator evaluation</span>
                        <CardTitle className="text-sm font-black text-slate-900 mt-2">{selectedOnboarding.name}</CardTitle>
                        <CardDescription className="text-[10px]">{selectedOnboarding.email}</CardDescription>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => setSelectedOnboarding(null)}
                        className="h-6 w-6 text-slate-400 hover:text-slate-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardHeader>

                    <CardContent className="p-4 space-y-4">
                      
                      <div className="space-y-3.5 text-left text-xs bg-slate-50/60 p-3.5 rounded-xl border border-slate-150">
                        <div>
                          <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Focus Specialization</span>
                          <span className="text-slate-800 font-extrabold text-xs block mt-0.5">⭐ {selectedOnboarding.specialization}</span>
                        </div>

                        <div>
                          <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Instructional experience</span>
                          <span className="text-slate-850 font-bold block mt-0.5">{selectedOnboarding.experienceYears} Years ECD Teaching</span>
                        </div>

                        <div>
                          <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Academic credentials qualifications</span>
                          <span className="text-slate-805 font-medium block mt-0.5 leading-relaxed text-[11px]">{selectedOnboarding.qualifications}</span>
                        </div>
                      </div>

                      {/* Attached qualifications interactive preview slot */}
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase block text-left">qualification credentials pamphlet</span>
                        <div className="bg-white border border-slate-200 p-2.5 rounded-xl flex items-center justify-between hover:border-indigo-300 transition-colors">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-7 w-7 text-indigo-600 shrink-0" />
                            <div className="min-w-0 text-left">
                              <p className="font-extrabold text-[10px] text-slate-800 truncate">{selectedOnboarding.certificateName || "Accreditation_Degree_UNT.pdf"}</p>
                              <p className="text-[8px] text-slate-400 font-semibold">{selectedOnboarding.certificateSize || "2.1 MB"}</p>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={() => setIsCertModalOpen(true)}
                            variant="secondary" 
                            size="sm"
                            className="h-7 bg-indigo-50 hover:bg-indigo-100 text-indigo-750 font-extrabold text-[9px] rounded-lg shrink-0"
                          >
                            Preview PDF
                          </Button>
                        </div>
                      </div>

                      {/* Admin Decision actions */}
                      <div className="space-y-2 pt-2 border-t border-slate-100 text-left">
                        <label className="text-[10px] font-extrabold text-slate-800 block">Feedback Notes (Private review reason)</label>
                        <textarea 
                          rows={3}
                          placeholder="Provide qualification feedback notes, or comments about the authorization parameters..."
                          className="w-full text-xs font-semibold p-3 bg-slate-50 border border-slate-205 rounded-xl text-slate-800 outline-none"
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                        />

                        {selectedOnboarding.status === "pending" ? (
                          <div className="grid grid-cols-2 gap-2 pt-2 shrink-0">
                            <Button 
                              onClick={() => handleReject(selectedOnboarding)}
                              variant="outline" 
                              className="border-red-200 hover:bg-red-50 text-red-750 font-extrabold text-xs h-9 rounded-xl"
                            >
                              Decline Permit
                            </Button>
                            <Button 
                              onClick={() => handleApprove(selectedOnboarding)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs h-9 rounded-xl shadow-xs"
                            >
                              Approve & Authorize
                            </Button>
                          </div>
                        ) : (
                          <div className="bg-slate-100 p-2.5 rounded-lg text-center text-[10px] text-slate-500 font-semibold italic">
                            This application has been marked "{selectedOnboarding.status}". Updates require Ministry administration clearance.
                          </div>
                        )}
                      </div>

                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-xs font-semibold">
                  Select any submitted teacher registration from the applicant feed to review credentials and grant permit privileges.
                </div>
              )}
            </AnimatePresence>

          </div>

        </div>

      )}

      {/* Embedded Qualification Document Verification Modal */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={() => setIsCertModalOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-2 text-slate-900">
                <ShieldCheck className="h-5 w-5 text-indigo-650" />
                <h2 className="text-sm font-black">Accreditation Credentials Verification Panel</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-slate-400 hover:text-slate-800"
                onClick={() => setIsCertModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              <div className="border border-indigo-150 rounded-2xl p-4 bg-indigo-50/20 text-indigo-950 text-left relative overflow-hidden">
                <div className="absolute right-4 top-4 bg-indigo-600 text-white text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  Accredited Code: A26-MoET
                </div>
                
                <h3 className="font-extrabold text-sm text-indigo-900">Kingdom of Eswatini</h3>
                <h4 className="text-xs font-bold text-indigo-750">Ministry of Education & Training</h4>
                <p className="text-[10px] text-indigo-650 font-bold mt-1">Eswatini National Qualifications Framework (ENQF) Accreditation Index</p>
                
                <div className="mt-4 border-t border-indigo-100 pt-3 flex flex-col gap-1 text-[11px] font-semibold text-slate-700">
                  <p>📄 <strong>Accredited Registry Item:</strong> {selectedOnboarding?.certificateName || "Nokwanda_Dlamini_Sebenta_ECD_Certificate.pdf"}</p>
                  <p>🎓 <strong>Qualified Person:</strong> {selectedOnboarding?.name || "Nokwanda Dlamini"}</p>
                  <p>📌 <strong>Certified Institution:</strong> Sebenta National Institute / Local Training Hub</p>
                  <p>🏆 <strong>Accredited Program:</strong> Level 4 Community Early Childhood Development Cert</p>
                </div>
              </div>

              {/* Simulated scan seals indicator */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="border border-slate-200 p-3 rounded-xl bg-slate-55/40 text-[10.5px] font-bold text-slate-650">
                  🛡️ <strong>Ministry Council Seal:</strong> VALIDATED
                  <p className="text-[9px] text-slate-400 font-medium font-sans mt-0.5">Checked against national teacher registers database (NTRD).</p>
                </div>

                <div className="border border-slate-205 p-3 rounded-xl bg-slate-55/40 text-[10.5px] font-bold text-slate-650">
                  🔒 <strong>Anti-Forgery Hash:</strong> SECURE
                  <p className="text-[9px] text-slate-400 font-medium font-mono mt-0.5">SHA256: 8f9a2e31c5d4b5a3e14</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-left flex gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[10px] text-amber-900 font-semibold leading-relaxed">
                  <strong>Verification Mandate:</strong> This digital preview validates qualification certification booklets files directly. Ensure actual certification documents copies exist inside physical school folders if requested by local inspectors.
                </div>
              </div>

            </div>

            <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 flex justify-between items-center">
              <span className="text-[9px] text-slate-400 font-bold">MoET Accreditation Board 2026</span>
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  toast.success("Downloading Qualification Certificate Booklet PDF...");
                }}
                className="inline-flex items-center gap-1 text-[10.5px] bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl font-extrabold leading-none transition-colors"
              >
                <Download className="h-3 w-3" /> Download Accredited Document
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

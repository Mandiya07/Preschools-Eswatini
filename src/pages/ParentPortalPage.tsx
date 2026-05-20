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
  WifiOff
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AIChatBot } from "@/components/AIChatBot";
import { subscribeToCollection, updateDocument, createDocument } from "@/lib/firestoreUtils";
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
  Newsletter 
} from "@/types";
import { Badge } from "@/components/ui/badge";

export function ParentPortalPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"dashboard" | "children" | "billing" | "messages">("dashboard");
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
      </main>

      <AIChatBot schoolName="Parent Support" />
    </div>
  );
}

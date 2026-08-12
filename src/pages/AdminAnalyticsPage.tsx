import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, TrendingUp, TrendingDown, Users, GraduationCap, DollarSign, 
  Activity, MousePointerClick, Filter, Eye, Smartphone, 
  FileDown, FileText, LayoutTemplate, CheckCircle2, AlertCircle, RefreshCw 
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { fetchCollection, subscribeToCollection } from "@/lib/firestoreUtils";
import { where } from "firebase/firestore";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import { toast } from "sonner";

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];

export function AdminAnalyticsPage() {
  const { user, activeSchoolId } = useAuth();
  const effectiveSchoolId = user?.role === 'SuperAdmin' ? activeSchoolId : user?.schoolId;
  const [loading, setLoading] = useState(true);
  
  const [students, setStudents] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    if (!effectiveSchoolId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    // Real-time subscriptions for school data
    const unsubStudents = subscribeToCollection('students', (data) => {
      setStudents(data.filter(s => s.schoolId === effectiveSchoolId));
      setLoading(false);
    });

    const unsubStaff = subscribeToCollection('staff', (data) => {
      setStaff(data.filter(s => s.schoolId === effectiveSchoolId));
    });

    const unsubInquiries = subscribeToCollection('inquiries', (data) => {
      setInquiries(data.filter(s => s.schoolId === effectiveSchoolId));
    });

    const unsubInvoices = subscribeToCollection('invoices', (data) => {
      setInvoices(data.filter(s => s.schoolId === effectiveSchoolId));
    });

    const unsubAttendance = subscribeToCollection('attendance', (data) => {
      setAttendance(data.filter(s => s.schoolId === effectiveSchoolId));
    });

    const unsubApps = subscribeToCollection('applications', (data) => {
      setApplications(data.filter(s => s.schoolId === effectiveSchoolId));
    });

    return () => {
      unsubStudents();
      unsubStaff();
      unsubInquiries();
      unsubInvoices();
      unsubAttendance();
      unsubApps();
    };
  }, [effectiveSchoolId]);

  // Dynamic Fee Collection Rate
  const feeStats = useMemo(() => {
    if (invoices.length === 0) return { collected: 0, total: 0, rate: 0 };
    const total = invoices.reduce((sum, inv) => sum + (Number(inv.amount || inv.totalAmount) || 0), 0);
    const collected = invoices
      .filter(inv => inv.status?.toLowerCase() === 'paid')
      .reduce((sum, inv) => sum + (Number(inv.amount || inv.totalAmount) || 0), 0);
    const rate = total > 0 ? Math.round((collected / total) * 100) : 0;
    return { collected, total, rate };
  }, [invoices]);

  // Dynamic Average Attendance Rate
  const attendanceRate = useMemo(() => {
    if (attendance.length === 0) return 0;
    const present = attendance.filter(a => a.status === 'present' || a.present === true).length;
    return Math.round((present / attendance.length) * 100);
  }, [attendance]);

  // Enrollment trend by month (computed from student enrollment dates or created dates)
  const enrollmentData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthIdx = new Date().getMonth();
    const resultMonths = months.slice(0, currentMonthIdx + 1);

    return resultMonths.map((m, idx) => {
      // count students enrolled on or before this month
      const count = students.filter(st => {
        if (!st.createdAt && !st.enrolledAt) return true;
        const d = new Date(st.createdAt || st.enrolledAt);
        return d.getMonth() <= idx;
      }).length;

      return {
        month: m,
        count: count > 0 ? count : (idx === currentMonthIdx ? students.length : 0)
      };
    });
  }, [students]);

  // Cashflow Trend Data (Expected vs Collected)
  const cashflowData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((monthName, idx) => {
      const monthInvoices = invoices.filter(inv => {
        if (!inv.date && !inv.createdAt) return false;
        const d = new Date(inv.date || inv.createdAt);
        return d.getMonth() === idx;
      });

      const expected = monthInvoices.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
      const collected = monthInvoices
        .filter(inv => inv.status?.toLowerCase() === 'paid')
        .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);

      return {
        month: monthName,
        expected,
        collected
      };
    });
  }, [invoices]);

  // Admissions Funnel (Inquiries -> Applications -> Enrolled)
  const conversionFunnel = useMemo(() => {
    return [
      { name: 'Inquiries', value: inquiries.length },
      { name: 'Applications', value: applications.length },
      { name: 'Enrolled', value: students.length }
    ];
  }, [inquiries, applications, students]);

  // Marketing Sources (from inquiries source field)
  const marketingData = useMemo(() => {
    if (inquiries.length === 0) {
      return [
        { name: 'Word of Mouth', value: 0 },
        { name: 'Preschools Registry', value: 0 },
        { name: 'Social Media', value: 0 },
        { name: 'Direct Search', value: 0 }
      ];
    }

    const sourceCounts: Record<string, number> = {};
    inquiries.forEach(inq => {
      const src = inq.source || 'Preschools Registry';
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;
    });

    return Object.entries(sourceCounts).map(([name, count]) => ({
      name,
      value: Math.round((count / inquiries.length) * 100)
    }));
  }, [inquiries]);

  // Export helper
  const handleExport = (type: string) => {
    const payload = {
      schoolId: effectiveSchoolId,
      timestamp: new Date().toISOString(),
      type,
      metrics: {
        totalStudents: students.length,
        totalStaff: staff.length,
        totalInquiries: inquiries.length,
        totalInvoices: invoices.length,
        feeCollectionRate: `${feeStats.rate}%`,
        attendanceRate: `${attendanceRate}%`
      },
      students: students.map(s => ({ name: `${s.firstName || ''} ${s.lastName || s.name || ''}`.trim(), classRoom: s.classRoom || s.grade })),
      invoices: invoices.map(i => ({ id: i.id, amount: i.amount, status: i.status, date: i.date }))
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${type} downloaded successfully!`);
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Advanced Analytics &amp; BI</h1>
          <p className="text-sm text-slate-500 mt-1">Data-driven insights to manage school growth, finances, and engagement sourced from Firebase.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live School Database
          </span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-[700px] h-12 bg-slate-100 rounded-xl p-1 mb-8">
          <TabsTrigger value="overview" className="rounded-lg font-bold text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="admissions" className="rounded-lg font-bold text-xs sm:text-sm">Admissions</TabsTrigger>
          <TabsTrigger value="financial" className="rounded-lg font-bold text-xs sm:text-sm">Financial</TabsTrigger>
          <TabsTrigger value="engagement" className="rounded-lg font-bold text-xs sm:text-sm">Engagement</TabsTrigger>
          <TabsTrigger value="reports" className="rounded-lg font-bold text-xs sm:text-sm">Reports</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-2xl border border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between pb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrollment</p>
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between mt-2">
                  <h2 className="text-3xl font-black text-slate-900">{students.length}</h2>
                  <span className="text-xs font-bold text-emerald-600 flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-0.5" /> Live
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Active registered learners</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between pb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fee Collection</p>
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <DollarSign className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between mt-2">
                  <h2 className="text-3xl font-black text-slate-900">{feeStats.rate}%</h2>
                  <span className="text-xs font-bold text-slate-500">
                    E{feeStats.collected.toLocaleString()} / E{feeStats.total.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Settled invoices percentage</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between pb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Attendance</p>
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <Activity className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between mt-2">
                  <h2 className="text-3xl font-black text-slate-900">{attendanceRate > 0 ? `${attendanceRate}%` : 'N/A'}</h2>
                  <span className="text-xs font-bold text-slate-500">
                    Target: 95%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{attendance.length} daily logs recorded</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between pb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New Inquiries</p>
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <Filter className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between mt-2">
                  <h2 className="text-3xl font-black text-slate-900">{inquiries.length}</h2>
                  <span className="text-xs font-bold text-amber-600">
                    {applications.length} applications
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Parent prospective leads</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 rounded-2xl border border-slate-200 shadow-sm">
              <CardHeader className="px-0 pt-0 pb-4">
                 <CardTitle className="text-lg font-bold text-slate-900">Enrollment Growth Trend</CardTitle>
                 <CardDescription>Cumulative student growth over the current academic year.</CardDescription>
              </CardHeader>
              <div className="h-[280px] w-full mt-2">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={enrollmentData}>
                       <defs>
                          <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                             <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="month" stroke="#94a3b8" />
                       <YAxis stroke="#94a3b8" allowDecimals={false} />
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                       />
                       <Area type="monotone" dataKey="count" name="Enrolled Students" stroke="#2563eb" fillOpacity={1} fill="url(#colorEnroll)" strokeWidth={2.5} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl border border-slate-200 shadow-sm">
              <CardHeader className="px-0 pt-0 pb-4">
                 <CardTitle className="text-lg font-bold text-slate-900">Teaching Staff &amp; Educator Ratios</CardTitle>
                 <CardDescription>Classroom capacity and educator-to-student balance.</CardDescription>
              </CardHeader>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Total Teaching &amp; Admin Staff</p>
                    <p className="text-2xl font-bold text-slate-900">{staff.length} educators</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-500">Live Educator Ratio</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {staff.length > 0 ? `1:${Math.round(students.length / staff.length)}` : (students.length > 0 ? `1:${students.length}` : '1:15')}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Admissions Capacity Utilized</span>
                    <span>{students.length} / {Math.max(50, students.length + 15)} Seats</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all" 
                      style={{ width: `${Math.min(100, Math.round((students.length / Math.max(50, students.length + 15)) * 100))}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
                  Staff counts and ratios are updated immediately whenever new teachers are added or assigned in the Staff directory.
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* ADMISSIONS TAB */}
        <TabsContent value="admissions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6 col-span-2 rounded-2xl border border-slate-200 shadow-sm">
              <CardHeader className="px-0 pt-0 pb-4">
                 <CardTitle className="text-lg font-bold text-slate-900">Admissions Conversion Funnel</CardTitle>
                 <CardDescription>From incoming inquiries and applications to confirmed enrollments.</CardDescription>
              </CardHeader>
              <div className="h-[280px] w-full mt-2">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={conversionFunnel} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 5 }}>
                       <XAxis type="number" stroke="#94a3b8" allowDecimals={false} />
                       <YAxis type="category" dataKey="name" stroke="#64748b" tick={{ fontSize: 12, fontWeight: 600 }} />
                       <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                       <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                       <Bar dataKey="value" name="Count" fill="#10b981" radius={[0, 6, 6, 0]} barSize={32} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6 rounded-2xl border border-slate-200 shadow-sm">
               <CardHeader className="px-0 pt-0 pb-4">
                 <CardTitle className="text-lg font-bold text-slate-900">Inquiry Channels</CardTitle>
                 <CardDescription>Where parent inquiries originate.</CardDescription>
              </CardHeader>
              <div className="h-[180px] mt-2 flex justify-center items-center">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marketingData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {marketingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: number) => [`${val}%`, 'Share']} />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {marketingData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <span className="font-semibold text-slate-700">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* FINANCIAL TAB */}
        <TabsContent value="financial" className="space-y-6">
          <Card className="p-6 rounded-2xl border border-slate-200 shadow-sm">
            <CardHeader className="px-0 pt-0 pb-4">
               <CardTitle className="text-lg font-bold text-slate-900">Fee Collection Cashflow</CardTitle>
               <CardDescription>Invoiced tuition vs collected revenue from live invoices database.</CardDescription>
            </CardHeader>
            <div className="h-[300px] w-full mt-2">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashflowData}>
                     <XAxis dataKey="month" stroke="#94a3b8" />
                     <YAxis stroke="#94a3b8" tickFormatter={(value) => `E${value}`} />
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <Tooltip formatter={(value: number) => [`E${value.toLocaleString()}`, '']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                     <Legend verticalAlign="top" height={36}/>
                     <Line type="monotone" dataKey="expected" name="Invoiced (E)" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                     <Line type="monotone" dataKey="collected" name="Collected (E)" stroke="#10b981" strokeWidth={3} dot={{r:4}} activeDot={{r: 6}} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        {/* ENGAGEMENT TAB */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
             <Card className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Learners Tracked</p>
                  <h3 className="text-2xl font-bold text-slate-900">{students.length}</h3>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">Active profiles</p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                  <Eye className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Inquiries Pipeline</p>
                  <h3 className="text-2xl font-bold text-slate-900">{inquiries.length}</h3>
                  <p className="text-xs text-blue-600 font-semibold mt-0.5">Direct parent leads</p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Invoices Created</p>
                  <h3 className="text-2xl font-bold text-slate-900">{invoices.length}</h3>
                  <p className="text-xs text-emerald-600 font-semibold mt-0.5">{feeStats.rate}% settled</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* REPORTS TAB */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
             <Card className="rounded-2xl border border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider">Enrollment Reports</CardTitle>
                    <FileText className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-xs text-slate-600">Export student enrollment logs, classroom allocations, and intake rosters.</p>
                    <Button onClick={() => handleExport("Enrollment Report")} variant="outline" size="sm" className="w-full flex gap-2 rounded-xl">
                      <FileDown className="h-4 w-4"/> Download Data
                    </Button>
                </CardContent>
             </Card>

             <Card className="rounded-2xl border border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider">Attendance Reports</CardTitle>
                    <Activity className="h-5 w-5 text-purple-600" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-xs text-slate-600">Download daily attendance records and student absence statistics.</p>
                    <Button onClick={() => handleExport("Attendance Report")} variant="outline" size="sm" className="w-full flex gap-2 rounded-xl">
                      <FileDown className="h-4 w-4"/> Download Data
                    </Button>
                </CardContent>
             </Card>

             <Card className="rounded-2xl border border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wider">Financial &amp; Invoices</CardTitle>
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-xs text-slate-600">Export fee collection summaries, ledger balances, and payment records.</p>
                    <Button onClick={() => handleExport("Financial Report")} variant="outline" size="sm" className="w-full flex gap-2 rounded-xl">
                      <FileDown className="h-4 w-4"/> Download Data
                    </Button>
                </CardContent>
             </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

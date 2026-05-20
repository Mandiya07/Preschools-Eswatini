import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, TrendingUp, TrendingDown, Users, GraduationCap, DollarSign, Activity, MousePointerClick, Filter, Eye, Smartphone, PieChart as PieChartIcon, FileDown, FileText, LayoutTemplate } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { fetchCollection } from "@/lib/firestoreUtils";
import { where } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

export function AdminAnalyticsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: 0,
    staff: 0,
    inquiries: 0,
    attendanceRate: 0
  });

  useEffect(() => {
    if (!user?.schoolId) return;

    const loadStats = async () => {
      setLoading(true);
      const [students, staff, inquiries] = await Promise.all([
        fetchCollection('students', where('schoolId', '==', user.schoolId)),
        fetchCollection('staff', where('schoolId', '==', user.schoolId)),
        fetchCollection('inquiries', where('schoolId', '==', user.schoolId))
      ]);

      setStats({
        students: students.length,
        staff: staff.length,
        inquiries: inquiries.length,
        attendanceRate: 94 // Mock for now
      });
      setLoading(false);
    };

    loadStats();
  }, [user]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const enrollmentData = [
    { month: 'Jan', count: 120 },
    { month: 'Feb', count: 125 },
    { month: 'Mar', count: 132 },
    { month: 'Apr', count: 135 },
    { month: 'May', count: 142 },
  ];

  const inquiriesData = [
    { month: 'Jan', count: 8 },
    { month: 'Feb', count: 12 },
    { month: 'Mar', count: 5 },
    { month: 'Apr', count: 15 },
    { month: 'May', count: stats.inquiries || 18 },
  ];

  const marketingData = [
    { name: 'Facebook', value: 45 },
    { name: 'Google Ads', value: 25 },
    { name: 'Referral', value: 20 },
    { name: 'Organic Walk-in', value: 10 },
  ];

  const cashflowData = [
    { month: 'Jan', collected: 120000, expected: 125000 },
    { month: 'Feb', collected: 128000, expected: 130000 },
    { month: 'Mar', collected: 115000, expected: 130000 },
    { month: 'Apr', collected: 135000, expected: 135000 },
    { month: 'May', collected: 90000, expected: 140000 },
  ];

  const conversionFunnel = [
    { name: 'Website Visits', value: 1200 },
    { name: 'Inquiries', value: 154 },
    { name: 'Tours Booked', value: 72 },
    { name: 'Applications', value: 45 },
    { name: 'Enrolled', value: 38 },
  ];

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#64748b'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Advanced Analytics & BI</h1>
        <p className="text-sm text-slate-500 mt-1">Data-driven insights to manage school growth, finances, and engagement.</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] h-12 bg-slate-100 rounded-xl p-1 mb-8">
          <TabsTrigger value="overview" className="rounded-lg font-bold">Overview</TabsTrigger>
          <TabsTrigger value="admissions" className="rounded-lg font-bold">Admissions & Mkt</TabsTrigger>
          <TabsTrigger value="financial" className="rounded-lg font-bold">Financial & Occ.</TabsTrigger>
          <TabsTrigger value="engagement" className="rounded-lg font-bold">Engagement</TabsTrigger>
          <TabsTrigger value="reports" className="rounded-lg font-bold">Reports & Exports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between pb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrollment</p>
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex items-baseline justify-between">
                  <h2 className="text-3xl font-extrabold text-slate-900">{stats.students || 142}</h2>
                  <span className="flex items-center text-xs font-bold text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" /> +12%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between pb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fee Collection</p>
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex items-baseline justify-between">
                  <h2 className="text-3xl font-extrabold text-slate-900">89%</h2>
                  <span className="flex items-center text-xs font-bold text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" /> +2.1%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between pb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Attendance</p>
                  <Activity className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex items-baseline justify-between">
                  <h2 className="text-3xl font-extrabold text-slate-900">{stats.attendanceRate}%</h2>
                  <span className="flex items-center text-xs font-bold text-slate-500">
                     Target: 95%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between pb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New Inquiries</p>
                  <Filter className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex items-baseline justify-between">
                  <h2 className="text-3xl font-extrabold text-slate-900">{stats.inquiries || 18}</h2>
                  <span className="flex items-center text-xs font-bold text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" /> This mo.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                 <CardTitle className="text-lg">Enrollment Growth Trend</CardTitle>
              </CardHeader>
              <div className="h-[300px] w-full mt-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={enrollmentData}>
                       <defs>
                          <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                       <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                       />
                       <Area type="monotone" dataKey="count" stroke="#2563eb" fillOpacity={1} fill="url(#colorEnroll)" strokeWidth={2} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-6 overflow-hidden relative">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Activity className="h-40 w-40 text-blue-600" />
               </div>
               <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <h3 className="font-bold text-xl mb-2">School Healthy Index & Regional Comp</h3>
                    <p className="text-slate-500 max-w-md text-sm mb-6">Your school is performing better than <strong className="text-blue-600">84%</strong> of similar ECCDE centers in the Eswatini region based on parent engagement and enrollment consistency.</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Target Capacity</p>
                        <p className="text-sm font-bold text-slate-900">160 Students</p>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2">
                           <div className="h-full bg-blue-600 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                     </div>
                     <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Waitlist Pipeline</p>
                        <p className="text-sm font-bold text-slate-900">22 Families</p>
                         <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2">
                           <div className="h-full bg-blue-600 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                     </div>
                  </div>
               </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="admissions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6 col-span-2">
              <CardHeader className="px-0 pt-0">
                 <CardTitle className="text-lg">Admissions Conversion Funnel</CardTitle>
                 <CardDescription>From website visits to enrolled students.</CardDescription>
              </CardHeader>
              <div className="h-[300px] w-full mt-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={conversionFunnel} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                       <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                       <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                       <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                       <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                       <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={30} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
               <CardHeader className="px-0 pt-0">
                 <CardTitle className="text-lg">Marketing Sources</CardTitle>
                 <CardDescription>Where do inquiries come from?</CardDescription>
              </CardHeader>
              <div className="h-[200px] mt-4 flex justify-center items-center">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={marketingData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {marketingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {marketingData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                    <span className="text-xs font-medium text-slate-700">{item.name} ({item.value}%)</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 col-span-full">
              <CardHeader className="px-0 pt-0">
                 <CardTitle className="text-lg">Website Traffic Analytics</CardTitle>
                 <CardDescription>Monthly unique visitors and pageviews</CardDescription>
              </CardHeader>
              <div className="h-[250px] w-full mt-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { week: 'W1', visitors: 400, pageviews: 1200 },
                      { week: 'W2', visitors: 300, pageviews: 900 },
                      { week: 'W3', visitors: 550, pageviews: 1500 },
                      { week: 'W4', visitors: 600, pageviews: 1800 },
                    ]}>
                       <defs>
                          <linearGradient id="colorVis" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                       <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                       <Area type="monotone" dataKey="pageviews" stroke="#cbd5e1" fill="none" strokeWidth={2} strokeDasharray="5 5" />
                       <Area type="monotone" dataKey="visitors" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorVis)" strokeWidth={2} />
                       <Legend verticalAlign="top" height={36}/>
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                 <CardTitle className="text-lg">Fee Collection vs Expectations</CardTitle>
                 <CardDescription>Actual revenue vs invoiced revenue (MOM)</CardDescription>
              </CardHeader>
              <div className="h-[300px] w-full mt-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cashflowData}>
                       <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                       <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(value) => `E${value/1000}k`} />
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <Tooltip formatter={(value: number) => [`E${value.toLocaleString()}`, '']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                       <Legend verticalAlign="top" height={36}/>
                       <Line type="monotone" dataKey="expected" name="Expected (E)" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                       <Line type="monotone" dataKey="collected" name="Collected (E)" stroke="#10b981" strokeWidth={3} dot={{r:4}} activeDot={{r: 6}} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
            </Card>

             <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                 <CardTitle className="text-lg">Occupancy Forecasting</CardTitle>
                 <CardDescription>Projected vs Actual Classroom Utilization</CardDescription>
              </CardHeader>
              <div className="h-[300px] w-full mt-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { term: 'Term 1', actual: 85, projected: 85 },
                      { term: 'Term 2', actual: 88, projected: 89 },
                      { term: 'Term 3', actual: null, projected: 92 },
                      { term: 'Term 4', actual: null, projected: 95 },
                    ]}>
                       <XAxis dataKey="term" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                       <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                       <Legend verticalAlign="top" height={36} />
                       <Bar dataKey="actual" name="Actual %" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={30} />
                       <Bar dataKey="projected" name="Projected %" fill="#93c5fd" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
             <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">App Adopton</p>
                  <h3 className="text-2xl font-bold text-slate-900">86%</h3>
                  <p className="text-xs text-green-600 font-medium mt-1">Active weekly</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Eye className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Msg Read Rate</p>
                  <h3 className="text-2xl font-bold text-slate-900">94%</h3>
                  <p className="text-xs text-green-600 font-medium mt-1">Within 24hrs</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                  <MousePointerClick className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Invoice Click-through</p>
                  <h3 className="text-2xl font-bold text-slate-900">72%</h3>
                  <p className="text-xs text-amber-600 font-medium mt-1">Avg 12hrs delay</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
               <CardTitle className="text-lg">Parent Portal Activity (Last 30 Days)</CardTitle>
               <CardDescription>Most frequently accessed modules by parents.</CardDescription>
            </CardHeader>
            <div className="h-[300px] w-full mt-4">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { feature: 'Daily Logs', access_count: 850 },
                    { feature: 'Billing', access_count: 320 },
                    { feature: 'Messages', access_count: 540 },
                    { feature: 'Calendar', access_count: 180 },
                    { feature: 'Report Cards', access_count: 420 },
                  ]}>
                     <XAxis dataKey="feature" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                     <Bar dataKey="access_count" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={50} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Enrollment Reports</CardTitle>
                    <FileText className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600">Export student enrollment data, status summaries, and intake trends.</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="w-full flex gap-2"><FileDown className="h-4 w-4"/> PDF</Button>
                        <Button variant="outline" size="sm" className="w-full flex gap-2"><FileDown className="h-4 w-4"/> Excel</Button>
                    </div>
                </CardContent>
             </Card>

             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Attendance Reports</CardTitle>
                    <Activity className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600">Download daily attendance logs, monthly summaries, and student absence records.</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="w-full flex gap-2"><FileDown className="h-4 w-4"/> PDF</Button>
                        <Button variant="outline" size="sm" className="w-full flex gap-2"><FileDown className="h-4 w-4"/> Excel</Button>
                    </div>
                </CardContent>
             </Card>

             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Financial Reports</CardTitle>
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600">Access revenue reports, fee collection dashboards, and outstanding invoice lists.</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="w-full flex gap-2"><FileDown className="h-4 w-4"/> PDF</Button>
                        <Button variant="outline" size="sm" className="w-full flex gap-2"><FileDown className="h-4 w-4"/> Excel</Button>
                    </div>
                </CardContent>
             </Card>

             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Ministry Templates</CardTitle>
                    <LayoutTemplate className="h-4 w-4 text-amber-600" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600">Generate standardized reporting documents required for Ministry of Education submissions.</p>
                    <Button variant="secondary" className="w-full flex gap-2"><FileDown className="h-4 w-4"/> Export Template</Button>
                </CardContent>
             </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


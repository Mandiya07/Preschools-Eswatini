import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Building2,
  Users, 
  GraduationCap, 
  Wallet, 
  Globe,
  ArrowUpRight,
  UserPlus,
  Plus,
  Loader2,
  AlertCircle,
  Calendar,
  Database
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { fetchDocument, subscribeToCollection, fetchCollection, createDocument, deleteDocument } from "@/lib/firestoreUtils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { School, Inquiry, Application, Student } from "@/types";
import { where } from "firebase/firestore";

export function AdminDashboardPage() {
  const { user } = useAuth();
  const [school, setSchool] = useState<School | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [lastInquiryId, setLastInquiryId] = useState<string | null>(null);

  useEffect(() => {
    async function loadSchool() {
      if (user?.schoolId) {
        const data = await fetchDocument('schools', user.schoolId) as School;
        setSchool(data);
      }
      setLoading(false);
    }
    loadSchool();
  }, [user]);

  useEffect(() => {
    if (!user?.schoolId) return;
    
    // Real-time subscriptions
    const unsubInquiries = subscribeToCollection(
      'inquiries', 
      (data) => setInquiries(data as Inquiry[]),
      where('schoolId', '==', user.schoolId)
    );

    const unsubApps = subscribeToCollection(
      'applications',
      (data) => setApplications(data as Application[]),
      where('schoolId', '==', user.schoolId)
    );

    const unsubStudents = subscribeToCollection(
      'students',
      (data) => setStudents(data as Student[]),
      where('schoolId', '==', user.schoolId)
    );

    const unsubNotes = subscribeToCollection(
      'dashboard_notes',
      (data) => setNotes(data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())),
      where('schoolId', '==', user.schoolId)
    );

    return () => {
      unsubInquiries();
      unsubApps();
      unsubStudents();
      unsubNotes();
    };
  }, [user]);

  // Check for new inquiries to show dashboard notification
  useEffect(() => {
    if (inquiries.length > 0) {
      const newestInquiry = inquiries.reduce((prev, current) => 
        (new Date(prev.createdAt) > new Date(current.createdAt)) ? prev : current
      );

      if (lastInquiryId && newestInquiry.id !== lastInquiryId && newestInquiry.status === 'New') {
        // In a real app we would trigger a Toast here
        console.log("New inquiry received in dashboard!", newestInquiry);
      }
      setLastInquiryId(newestInquiry.id);
    }
  }, [inquiries, lastInquiryId]);

  const handleDatabaseBackup = async () => {
    if (!user?.schoolId) return;
    
    try {
      const dbSchools = await fetchCollection('schools');
      const dbStudents = await fetchCollection('students');
      const dbApplications = await fetchCollection('applications');
      
      const backupData = {
        timestamp: new Date().toISOString(),
        schools: dbSchools,
        students: dbStudents,
        applications: dbApplications,
      };
      
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Backup failed:', error);
      alert('Backup failed.');
    }
  };

  const handleAddNote = async () => {
    if (!user?.schoolId || !newNote.trim()) return;
    try {
      await createDocument('dashboard_notes', null, {
        schoolId: user.schoolId,
        text: newNote.trim(),
        createdBy: user.name || user.email || 'Admin',
        createdAt: new Date().toISOString()
      });
      setNewNote("");
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteDocument('dashboard_notes', noteId);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user?.schoolId && !school) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
          <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
            <Building2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Ready to launch your school?</h2>
          <p className="text-slate-600 mb-8">You haven't registered a school yet. Start by creating your school profile to access the dashboard, website builder, and student management tools.</p>
          <div className="flex flex-col gap-3">
            <Button size="lg" className="h-12 text-base">
              <Plus className="mr-2 h-5 w-5" /> Register Your School
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const classEnrollment = students.reduce((acc, student) => {
    const className = student.class || 'Unassigned';
    acc[className] = (acc[className] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalStudents = students.length;
  const chartData = Object.entries(classEnrollment)
    .map(([name, count]) => ({
      name,
      students: count,
      percentage: totalStudents > 0 ? ((count / totalStudents) * 100).toFixed(1) : '0.0'
    }))
    .sort((a, b) => b.students - a.students);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
          <p className="font-semibold text-slate-900 mb-1">{label}</p>
          <p className="text-sm font-medium text-blue-600">
            Students: {data.students}
          </p>
          <p className="text-xs text-slate-500 font-medium">
            Enrollment: {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Here is what is happening at {school?.name || 'your school'} today.</p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr">
        <Card className="flex flex-col h-full shadow-sm">
          <CardContent className="p-6 flex flex-col h-full justify-between gap-4">
            <div className="flex items-center justify-between space-y-0">
              <p className="text-sm font-medium text-slate-600">Total Students</p>
              <GraduationCap className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-bold text-slate-900">{students.length}</div>
              <span className={`flex items-center text-xs font-medium ${students.length > 0 ? 'text-green-600' : 'text-slate-500'}`}>
                {students.length > 0 ? <ArrowUpRight className="mr-1 h-3 w-3" /> : null}
                {students.length > 0 ? 'Active pupils' : 'No students yet'}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col h-full shadow-sm">
          <CardContent className="p-6 flex flex-col h-full justify-between gap-4">
            <div className="flex items-center justify-between space-y-0">
              <p className="text-sm font-medium text-slate-600">Active Parents</p>
              <Users className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-bold text-slate-900">
                {Array.from(new Set(students.map(s => s.parentId).filter(Boolean))).length}
              </div>
              <span className="flex items-center text-xs font-medium text-slate-500">
                Registered profiles
              </span>
            </div>
          </CardContent>
        </Card>
 
        <Card className="flex flex-col h-full shadow-sm">
          <CardContent className="p-6 flex flex-col h-full justify-between gap-4">
            <div className="flex items-center justify-between space-y-0">
              <p className="text-sm font-medium text-slate-600">Pending Admissions</p>
              <UserPlus className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-bold text-slate-900">{applications.filter(a => a.status === 'submitted' || a.status === 'under_review').length}</div>
              <span className={`flex items-center text-xs font-medium ${applications.length > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
                {applications.length > 0 ? 'Needs review' : 'No new apps'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-full shadow-sm">
          <CardContent className="p-6 flex flex-col h-full justify-between gap-4">
            <div className="flex items-center justify-between space-y-0">
              <p className="text-sm font-medium text-slate-600">Total Revenue</p>
              <Wallet className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-bold text-slate-900">E45,200</div>
              <span className="flex items-center text-xs font-medium text-slate-500">
                This month
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 flex flex-col">
          <CardHeader>
            <CardTitle>Recent Parent Inquiries</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-6">
              {inquiries.length > 0 ? (
                inquiries.slice(0, 5).map((inquiry) => (
                  <div key={inquiry.id} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none text-slate-900">{inquiry.parentName}</p>
                      <p className="text-sm text-slate-500">Child: {inquiry.childName} ({inquiry.childAge})</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-slate-400">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        inquiry.status === 'New' ? 'bg-blue-100 text-blue-800' :
                        inquiry.status === 'Contacted' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {inquiry.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  <p>No recent inquiries found.</p>
                </div>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/admin/admissions">Manage Inquiries</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 flex-1">
            <Button variant="outline" className="justify-start h-12 px-4 shadow-sm border-slate-200" asChild>
               <Link to="/admin/events">
                 <Calendar className="mr-3 h-4 w-4 text-blue-600" /> Manage Events
               </Link>
            </Button>
            <Button variant="outline" className="justify-start h-12 px-4 shadow-sm border-slate-200">
              <UserPlus className="mr-3 h-4 w-4 text-blue-600" /> Accept New Student
            </Button>
            <Button variant="outline" className="justify-start h-12 px-4 shadow-sm border-slate-200">
              <Wallet className="mr-3 h-4 w-4 text-blue-600" /> Record Fee Payment
            </Button>
            <Button variant="outline" className="justify-start h-12 px-4 shadow-sm border-slate-200" asChild>
               <Link to="/admin/website">
                 <Globe className="mr-3 h-4 w-4 text-blue-600" /> Update Website Notice
               </Link>
            </Button>
            <Button variant="outline" className="justify-start h-12 px-4 shadow-sm border-slate-200" onClick={handleDatabaseBackup}>
              <Database className="mr-3 h-4 w-4 text-emerald-600" /> Backup Database (JSON)
            </Button>
            <div className="mt-auto pt-6">
              <div className="rounded-lg bg-blue-50 p-4 border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-900 mb-1">Subscription Active</h4>
                <p className="text-xs text-blue-700 mb-3">Your Professional Plan is active until Nov 15.</p>
                <Button size="sm" variant="outline" className="bg-white hover:bg-blue-50 text-blue-700 border-blue-200" asChild>
                  <Link to="/admin/billing">Manage Billing</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Enrollment by Grade Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 13 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 13 }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    content={<CustomTooltip />}
                  />
                  <Bar 
                    dataKey="students" 
                    name="Total Enrolled"
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]} 
                    barSize={40}
                    animationDuration={1000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 flex flex-col items-stretch h-[24rem]">
          <CardHeader>
            <CardTitle>Quick Notes & Reminders</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
              {notes.map(note => (
                <div key={note.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg relative group text-sm">
                  <p className="text-slate-800 whitespace-pre-wrap pr-6">{note.text}</p>
                  <p className="text-xs text-slate-500 mt-2 font-medium">— {note.createdBy}, {new Date(note.createdAt).toLocaleDateString()}</p>
                  <button 
                    onClick={() => handleDeleteNote(note.id)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold px-1"
                    title="Delete Note"
                  >
                    ×
                  </button>
                </div>
              ))}
              {notes.length === 0 && (
                <div className="text-center py-6 text-slate-500">
                  <p className="text-sm">No notes left by admins.</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-auto">
              <input 
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Type a reminder..."
                className="flex-1 text-sm rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                onKeyDown={e => e.key === 'Enter' && handleAddNote()}
              />
              <Button onClick={handleAddNote}>Add</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

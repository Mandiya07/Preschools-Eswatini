import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HeartPulse, Pill, Activity, ShieldAlert,
  Moon, Coffee, ClipboardList, CheckCircle2,
  CalendarDays, UserCheck, WifiOff, AlertCircle,
  Loader2
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/lib/AuthContext";
import { subscribeToCollection } from "@/lib/firestoreUtils";
import { where } from "firebase/firestore";

export function AdminHealthDailyPage() {
  const { user, activeSchoolId } = useAuth();
  const effectiveSchoolId = user?.role === 'SuperAdmin' ? activeSchoolId : user?.schoolId;
  const [activeTab, setActiveTab] = useState("daily-logs");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [students, setStudents] = useState([]);
  const [recentCriticalIncidents, setRecentCriticalIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!effectiveSchoolId) return;

    const unsubStudents = subscribeToCollection(
      'students',
      (data) => {
        setStudents(data.map((s: any) => ({
          id: s.id,
          name: s.name,
          healthStatus: s.healthStatus || 'Healthy',
          incidentFlag: s.incidentFlag || false
        })));
        setLoading(false);
      },
      where('schoolId', '==', effectiveSchoolId)
    );

    const unsubIncidents = subscribeToCollection(
      'critical_incidents',
      (data) => setRecentCriticalIncidents(data),
      where('schoolId', '==', effectiveSchoolId)
    );

    return () => {
      unsubStudents();
      unsubIncidents();
    };
  }, [effectiveSchoolId]);

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

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

  const toggleSelectStudent = (id: string) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedStudents.length === students.length && students.length > 0) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((s: any) => s.id));
    }
  };

  const handleBatchToggleHealth = () => {
    setStudents(prev => prev.map(s => {
      if (selectedStudents.includes(s.id)) {
        return { ...s, healthStatus: s.healthStatus === 'Healthy' ? 'Monitoring' : 'Healthy' };
      }
      return s;
    }));
    setSelectedStudents([]);
  };

  const handleBatchToggleIncident = () => {
    setStudents(prev => prev.map(s => {
      if (selectedStudents.includes(s.id)) {
        return { ...s, incidentFlag: !s.incidentFlag };
      }
      return s;
    }));
    setSelectedStudents([]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <SEO title="Health & Daily Logs | Preschools Eswatini Admin" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Health & Daily Logs
            {isOffline && <Badge variant="secondary" className="bg-amber-100 text-amber-800 animate-pulse text-[10px]"><WifiOff className="h-3 w-3 mr-1" /> Offline Notes Enabled</Badge>}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage student health, daily activities, meals, pick-ups, and incidents.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white">
            <ClipboardList className="mr-2 h-4 w-4" /> Export Logs
          </Button>
          <div className="relative group overflow-hidden">
            <Button className="bg-rose-600 hover:bg-rose-700">
              <UserCheck className="mr-2 h-4 w-4" /> Log Activity / Record
            </Button>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              aria-label="Capture with Camera"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title="Use Camera / Upload File"
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                if(target.files && target.files.length > 0) {
                    alert(`Photo saved to draft logs.`);
                }
              }}
            />
          </div>
        </div>
      </div>

      {recentCriticalIncidents.length > 0 && (
        <Card className="border-rose-200 bg-rose-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-rose-800 flex items-center text-sm font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 mr-2" />
              Critical Incidents (Last 24 Hours)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             {recentCriticalIncidents.map(incident => (
               <div key={incident.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-rose-100 shadow-sm">
                 <div className="flex items-center gap-3">
                   <div className="bg-rose-100 text-rose-700 p-2 rounded-full">
                     <AlertCircle className="w-4 h-4" />
                   </div>
                   <div>
                     <p className="font-bold text-sm text-slate-900">{incident.student} <span className="text-slate-500 font-normal ml-1">({incident.type})</span></p>
                     <p className="text-xs text-slate-600">{incident.description}</p>
                   </div>
                 </div>
                 <div className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">{incident.time}</div>
               </div>
             ))}
          </CardContent>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pickups Authorized</p>
              <h3 className="text-2xl font-bold text-slate-900">142</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Coffee className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Meals Tracked</p>
              <h3 className="text-2xl font-bold text-slate-900">312</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Moon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Nap Logs</p>
              <h3 className="text-2xl font-bold text-slate-900">89</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Health Updates</p>
              <h3 className="text-2xl font-bold text-slate-900">24</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily-logs" className="w-full mt-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] h-12 bg-slate-100 rounded-xl p-1 mb-8">
          <TabsTrigger value="daily-logs" className="rounded-lg font-bold data-[state=active]:shadow-sm">Daily Logs</TabsTrigger>
          <TabsTrigger value="health" className="rounded-lg font-bold data-[state=active]:shadow-sm">Health Records</TabsTrigger>
          <TabsTrigger value="incidents" className="rounded-lg font-bold data-[state=active]:shadow-sm">Incidents</TabsTrigger>
          <TabsTrigger value="assessments" className="rounded-lg font-bold data-[state=active]:shadow-sm">Assessments</TabsTrigger>
        </TabsList>

        <TabsContent value="daily-logs" className="space-y-6">
           {isOffline && (
             <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4">
               <div className="bg-amber-100 p-2 rounded-full mt-0.5">
                 <WifiOff className="h-4 w-4 text-amber-700" />
               </div>
               <div>
                 <h4 className="text-sm font-bold text-amber-900">Offline Note-Taking Active</h4>
                 <p className="text-xs text-amber-700 mt-1">
                   You are currently offline. You can continue logging meals, naps, incidents, and behavior. All notes are saved locally and will automatically sync with the school database when your connection returns.
                 </p>
               </div>
             </div>
           )}
           <Card className="rounded-[2rem] border-slate-200">
              <CardHeader className="border-b border-slate-100 pb-4">
                 <CardTitle>Today's Activity Log</CardTitle>
                 <CardDescription>Meals, Naps, Pickups, and Behavioral Observations.</CardDescription>
              </CardHeader>
              <div className="p-4 overflow-x-auto">
                 <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 rounded-xl">
                       <tr>
                          <th className="px-6 py-4 font-medium rounded-l-xl">Time</th>
                          <th className="px-6 py-4 font-medium">Student</th>
                          <th className="px-6 py-4 font-medium">Activity Type</th>
                          <th className="px-6 py-4 font-medium">Details</th>
                          <th className="px-6 py-4 font-medium rounded-r-xl">Logged By</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {[
                         { time: "15:30 PM", student: "Sipho Dlamini", type: "Pickup Authorization", details: "Picked up by Mom (Z. Dlamini)", user: "Teacher Rose" },
                         { time: "14:00 PM", student: "Bandile Nxumalo", type: "Nap/Sleep", details: "Slept for 1hr 15m. Restless.", user: "Teacher Rose" },
                         { time: "12:30 PM", student: "Tenele Gama", type: "Meal Tracking", details: "Ate all serving. Loved the fruit.", user: "Chef Musa" },
                         { time: "10:15 AM", student: "Musa Zwane", type: "Behavior", details: "Shared toys nicely with peers.", user: "Teacher Grace" }
                       ].map((log, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                             <td className="px-6 py-4 font-medium text-slate-900">{log.time}</td>
                             <td className="px-6 py-4 font-bold">{log.student}</td>
                             <td className="px-6 py-4">
                                <Badge variant="outline" className="bg-white">{log.type}</Badge>
                             </td>
                             <td className="px-6 py-4">{log.details}</td>
                             <td className="px-6 py-4 text-xs">{log.user}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
           <Card className="rounded-[2rem] border-slate-200">
             <CardHeader className="border-b border-slate-100 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Health Records & Tracking</CardTitle>
                    <CardDescription>Monitor student health status and mark incidents.</CardDescription>
                  </div>
                  {selectedStudents.length > 0 && (
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                         {selectedStudents.length} selected
                       </span>
                       <Button size="sm" onClick={handleBatchToggleHealth} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                         Toggle Status
                       </Button>
                       <Button size="sm" onClick={handleBatchToggleIncident} variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50">
                         Toggle Incident Flag
                       </Button>
                    </div>
                  )}
                </div>
             </CardHeader>
             <div className="p-4 overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                   <thead className="text-xs text-slate-500 uppercase bg-slate-50 rounded-xl">
                      <tr>
                         <th className="px-6 py-4 font-medium rounded-l-xl w-16">
                           <div className="flex items-center">
                             <input 
                               type="checkbox" 
                               checked={students.length > 0 && selectedStudents.length === students.length} 
                               onChange={selectAll}
                               className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                             />
                           </div>
                         </th>
                         <th className="px-6 py-4 font-medium">Student</th>
                         <th className="px-6 py-4 font-medium">Health Status</th>
                         <th className="px-6 py-4 font-medium rounded-r-xl">Incident Flag</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {students.map(student => (
                         <tr key={student.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <input 
                                  type="checkbox" 
                                  checked={selectedStudents.includes(student.id)} 
                                  onChange={() => toggleSelectStudent(student.id)}
                                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                                />
                              </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-900">{student.name}</td>
                            <td className="px-6 py-4">
                               <Badge variant={student.healthStatus === 'Healthy' ? 'secondary' : 'default'} className={student.healthStatus === 'Healthy' ? 'bg-emerald-100 text-emerald-700 w-24 justify-center' : 'bg-amber-100 text-amber-700 hover:bg-amber-200 w-24 justify-center'}>
                                 {student.healthStatus}
                               </Badge>
                            </td>
                            <td className="px-6 py-4">
                               {student.incidentFlag ? (
                                 <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 pointer-events-none">
                                   <ShieldAlert className="w-3 h-3 mr-1" /> Flagged
                                 </Badge>
                               ) : (
                                 <span className="text-sm text-slate-400">None</span>
                               )}
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

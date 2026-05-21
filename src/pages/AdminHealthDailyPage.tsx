import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HeartPulse, Pill, Activity, ShieldAlert,
  Moon, Coffee, ClipboardList, CheckCircle2,
  CalendarDays, UserCheck, WifiOff
} from "lucide-react";
import { SEO } from "@/components/SEO";

export function AdminHealthDailyPage() {
  const [activeTab, setActiveTab] = useState("daily-logs");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

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
           <Card className="rounded-[2rem] border-slate-200 p-8 text-center bg-slate-50 flex flex-col items-center justify-center">
              <Pill className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-2">Immunization & Health Tracking</h3>
              <p className="text-slate-500 max-w-sm mb-6">Track allergies, medical conditions, and stay compliant with immunization records.</p>
              <Button variant="outline" className="bg-white shadow-sm">View Medical Records</Button>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bus, MapPin, Search, Plus, Navigation, 
  Map as MapIcon, Users, Clock, AlertTriangle, CheckCircle2, Loader2
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { motion } from "motion/react";
import { useAuth } from "@/lib/AuthContext";
import { subscribeToCollection } from "@/lib/firestoreUtils";
import { where } from "firebase/firestore";

export function AdminTransportPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("live");
  const [searchQuery, setSearchQuery] = useState("");
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.schoolId) return;

    const unsubRoutes = subscribeToCollection(
      'transport_routes',
      (data) => {
        setRoutes(data);
        setLoading(false);
      },
      where('schoolId', '==', user.schoolId)
    );

    return () => unsubRoutes();
  }, [user?.schoolId]);

  const activeRoute = routes.length > 0 ? routes[0] : null;

  if (loading) {
     return <div className="flex h-64 items-center justify-center border rounded-xl"><Loader2 className="w-8 h-8 animate-spin text-blue-600"/></div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <SEO title="Transport Tracking | Sikolo Admin" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Transport Tracking</h1>
          <p className="text-sm text-slate-500 mt-1">Live GPS tracking, route management, and driver assignments.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white">
            <MapIcon className="mr-2 h-4 w-4" /> Route History
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Route
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Bus className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Vehicles</p>
              <h3 className="text-2xl font-bold text-slate-900">4 / 6</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Students in Transit</p>
              <h3 className="text-2xl font-bold text-slate-900">42</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Completed Routes</p>
              <h3 className="text-2xl font-bold text-slate-900">12</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Delays / Issues</p>
              <h3 className="text-2xl font-bold text-slate-900">1</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="live" className="w-full mt-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="live">Live Tracking</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="drivers">Drivers & Vehicles</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="mt-6 flex flex-col lg:flex-row gap-6 h-[600px]">
          {/* Left Panel: Active Route Details */}
          <Card className="w-full lg:w-1/3 flex flex-col">
            <CardHeader className="pb-4 border-b border-slate-100">
               <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Morning Route A</CardTitle>
                    <CardDescription>Mbabane City Center</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none animate-pulse">Live</Badge>
               </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
               <div className="p-4 space-y-4">
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                     <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center font-bold text-slate-700 shadow-sm">SD</div>
                     <div>
                       <p className="text-sm font-bold text-slate-900">{activeRoute.driver}</p>
                       <p className="text-xs text-slate-500">{activeRoute.plate} • 24 Students</p>
                     </div>
                  </div>
                  
                  <div className="relative pl-6 pt-2 space-y-6 before:absolute before:inset-0 before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                     {/* Timeline items */}
                     <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-white bg-green-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                        <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] bg-white border border-slate-100">
                           <div className="flex items-center justify-between space-x-2 mb-1">
                              <div className="font-bold text-slate-900 text-sm">School Departure</div>
                              <time className="text-xs font-medium text-amber-500">07:00 AM</time>
                           </div>
                           <div className="text-slate-500 text-xs text-green-600 font-medium">Completed</div>
                        </div>
                     </div>
                     
                     <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-white bg-green-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                        <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] bg-white border border-slate-100">
                           <div className="flex items-center justify-between space-x-2 mb-1">
                              <div className="font-bold text-slate-900 text-sm">Stop 1: CTA</div>
                              <time className="text-xs font-medium text-amber-500">07:15 AM</time>
                           </div>
                           <div className="text-slate-500 text-xs">Picked up 5 students</div>
                        </div>
                     </div>

                     <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-white bg-blue-600 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                           <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                        </div>
                        <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-xl shadow-[0_2px_10px_rgba(37,99,235,0.1)] bg-blue-50 border border-blue-100">
                           <div className="flex items-center justify-between space-x-2 mb-1">
                              <div className="font-bold text-blue-900 text-sm">Stop 2: Mall</div>
                              <time className="text-xs font-medium text-blue-600">Expected 07:30 AM</time>
                           </div>
                           <div className="text-blue-700 text-xs font-medium">Next stop • 2 mins away</div>
                        </div>
                     </div>

                     <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border-4 border-white bg-slate-300 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                        <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.05)] bg-slate-50 border border-slate-100 opacity-60">
                           <div className="flex items-center justify-between space-x-2 mb-1">
                              <div className="font-bold text-slate-800 text-sm">School Arrival</div>
                              <time className="text-xs font-medium text-slate-500">08:15 AM</time>
                           </div>
                           <div className="text-slate-500 text-xs">Waiting</div>
                        </div>
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>

          {/* Right Panel: Map View */}
          <Card className="full lg:w-2/3 h-full overflow-hidden bg-slate-100 relative group">
             {/* Mock Map Background */}
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
             
             {/* Map overaly grid to make it look like a map UI */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-slate-200/50 to-transparent pointer-events-none"></div>

             {/* UI overlay on Map */}
             <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
                <div className="bg-white/90 backdrop-blur pointer-events-auto px-4 py-2 rounded-xl shadow-lg border border-slate-200 flex items-center gap-2">
                   <Navigation className="h-4 w-4 text-blue-600" />
                   <span className="text-sm font-bold text-slate-900">Map View</span>
                </div>
                <div className="flex flex-col gap-2 pointer-events-auto">
                   <Button size="icon" variant="secondary" className="rounded-xl shadow-lg border border-slate-200 bg-white hover:bg-slate-50"><Plus className="h-4 w-4" /></Button>
                   <Button size="icon" variant="secondary" className="rounded-xl shadow-lg border border-slate-200 bg-white hover:bg-slate-50"><MapPin className="h-4 w-4" /></Button>
                </div>
             </div>

             {/* Live Bus Marker */}
             <motion.div 
               animate={{ x: [0, 20, 40], y: [0, -10, -5] }}
               transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
               className="absolute top-1/2 left-1/2 flex items-center justify-center"
             >
                <div className="relative">
                   <div className="absolute -inset-4 bg-blue-500/20 rounded-full animate-ping"></div>
                   <div className="h-10 w-10 bg-white rounded-full shadow-2xl flex items-center justify-center border-2 border-blue-600 text-blue-600 z-10 relative">
                     <Bus className="h-5 w-5" />
                   </div>
                   <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
                     ESD 123 CH • 45 km/h
                   </div>
                </div>
             </motion.div>
          </Card>
        </TabsContent>

        <TabsContent value="routes">
           <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                 <div>
                    <CardTitle>All Routes</CardTitle>
                    <CardDescription>Manage and schedule transport routes.</CardDescription>
                 </div>
                 <div className="relative w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search routes..." className="pl-9 bg-slate-50" />
                 </div>
              </CardHeader>
              <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-y border-slate-100">
                       <tr>
                          <th className="px-6 py-4 font-medium">Route ID & Name</th>
                          <th className="px-6 py-4 font-medium">Driver</th>
                          <th className="px-6 py-4 font-medium">Vehicle Plate</th>
                          <th className="px-6 py-4 font-medium">Students</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                          <th className="px-6 py-4 font-medium text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {routes.length > 0 ? routes.map((route) => (
                          <tr key={route.id} className="hover:bg-slate-50 transition-colors">
                             <td className="px-6 py-4">
                               <p className="font-bold text-slate-900">{route.name}</p>
                               <p className="text-xs text-slate-500 font-mono mt-0.5">{route.id}</p>
                             </td>
                             <td className="px-6 py-4">{route.driver}</td>
                             <td className="px-6 py-4">
                                <Badge variant="outline" className="bg-white font-mono">{route.plate}</Badge>
                             </td>
                             <td className="px-6 py-4 font-medium">{route.students}</td>
                             <td className="px-6 py-4">
                                {route.status === "Active" && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Active</Badge>}
                                {route.status === "Completed" && <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none">Completed</Badge>}
                                {route.status === "Scheduled" && <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Scheduled</Badge>}
                                {route.status === "Delayed" && <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Delayed</Badge>}
                             </td>
                             <td className="px-6 py-4 text-right">
                                <Button variant="ghost" size="sm" className="text-blue-600">Edit</Button>
                             </td>
                          </tr>
                       )) : (
                          <tr>
                             <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                               No active or scheduled routes found.
                             </td>
                          </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

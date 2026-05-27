import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, Package, Users, Building, 
  Settings, Clock, FileSpreadsheet, LayoutGrid
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/lib/AuthContext";
import { subscribeToCollection } from "@/lib/firestoreUtils";
import { where } from "firebase/firestore";

export function AdminHRInventoryPage() {
  const { user, activeSchoolId } = useAuth();
  const effectiveSchoolId = user?.role === 'SuperAdmin' ? activeSchoolId : user?.schoolId;
  const [activeTab, setActiveTab] = useState("hr");
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!effectiveSchoolId) return;

    const unsubStaff = subscribeToCollection(
      'staff',
      (data) => {
        setStaff(data);
        setLoading(false);
      },
      where('schoolId', '==', effectiveSchoolId)
    );

    return () => unsubStaff();
  }, [effectiveSchoolId]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <SEO title="HR & Inventory | Preschools Eswatini Admin" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">HR, Inventory & Facilities</h1>
          <p className="text-sm text-slate-500 mt-1">Manage staff payroll, timetables, assets, and classroom capacity.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white">
            <LayoutGrid className="mr-2 h-4 w-4" /> Manage Timetables
          </Button>
          <Button className="bg-slate-900 hover:bg-slate-800 text-white">
            <Settings className="mr-2 h-4 w-4" /> Module Settings
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Staff Present</p>
              <h3 className="text-2xl font-bold text-slate-900">{staff.filter((s: any) => s.status === 'Active').length} / {staff.length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Leave Requests</p>
              <h3 className="text-2xl font-bold text-slate-900">3</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Asset Count</p>
              <h3 className="text-2xl font-bold text-slate-900">0</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Class Capacity</p>
              <h3 className="text-2xl font-bold text-slate-900">84%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="hr" className="w-full mt-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] h-12 bg-slate-100 rounded-xl p-1 mb-8">
          <TabsTrigger value="hr" className="rounded-lg font-bold data-[state=active]:shadow-sm">Payroll & HR</TabsTrigger>
          <TabsTrigger value="inventory" className="rounded-lg font-bold data-[state=active]:shadow-sm">Inventory</TabsTrigger>
          <TabsTrigger value="facilities" className="rounded-lg font-bold data-[state=active]:shadow-sm">Facilities</TabsTrigger>
        </TabsList>

        <TabsContent value="hr" className="space-y-6">
           <Card className="rounded-[2rem] border-slate-200">
              <CardHeader className="border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
                 <div>
                    <CardTitle>Staff Records & Leave</CardTitle>
                    <CardDescription>Manage payroll integrations and absence tracking.</CardDescription>
                 </div>
                 <Button variant="secondary" size="sm">Run Payroll Report</Button>
              </CardHeader>
              <div className="p-4 overflow-x-auto">
                 <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 rounded-xl">
                       <tr>
                          <th className="px-6 py-4 font-medium rounded-l-xl">Staff Member</th>
                          <th className="px-6 py-4 font-medium">Role</th>
                          <th className="px-6 py-4 font-medium">Leave Balance</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                          <th className="px-6 py-4 font-medium rounded-r-xl text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {[
                         { name: "Teacher Rose", role: "Head Teacher", leave: "14 Days", status: "Present" },
                         { name: "Sipho Dlamini", role: "Bus Driver", leave: "10 Days", status: "Present" },
                         { name: "Chef Musa", role: "Cafeteria Staff", leave: "2 Days", status: "On Leave" },
                       ].map((staff, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                             <td className="px-6 py-4 font-bold text-slate-900">{staff.name}</td>
                             <td className="px-6 py-4">{staff.role}</td>
                             <td className="px-6 py-4 font-medium">{staff.leave}</td>
                             <td className="px-6 py-4">
                               <Badge variant="outline" className={staff.status === "Present" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}>{staff.status}</Badge>
                             </td>
                             <td className="px-6 py-4 text-right">
                                <Button variant="ghost" size="sm" className="text-blue-600">Edit</Button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
           <Card className="rounded-[2rem] border-slate-200 p-8 text-center bg-slate-50 flex flex-col items-center justify-center">
              <Package className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-2">Asset & Inventory Tracking</h3>
              <p className="text-slate-500 max-w-sm mb-6">Keep track of school laptops, buses, furniture, and consumable procurements via request logs.</p>
              <div className="flex gap-4">
                <Button variant="outline" className="bg-white shadow-sm">View Assets</Button>
                <Button>Order Procurement</Button>
              </div>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

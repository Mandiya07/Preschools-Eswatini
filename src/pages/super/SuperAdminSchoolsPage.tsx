import { useState } from "react";
import { 
  Building2, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ShieldCheck, 
  ShieldX, 
  ExternalLink,
  ChevronRight,
  MapPin,
  Calendar,
  CreditCard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { fetchCollection, updateDocument, createDocument, subscribeToCollection } from "@/lib/firestoreUtils";
import { useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function SuperAdminSchoolsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubRegs = subscribeToCollection("school_registrations", (data) => {
      setRegistrations(data);
    });
    
    const unsubSchools = subscribeToCollection("schools", (data) => {
      setSchools(data);
      setLoading(false);
    });

    return () => {
      unsubRegs();
      unsubSchools();
    };
  }, []);

  const handleApprove = async (reg: any) => {
    setProcessingId(reg.id);
    try {
      // 1. Create the school document
      const schoolId = await createDocument("schools", null, {
        name: reg.schoolName,
        email: reg.email,
        phone: reg.phone,
        principal: reg.principalName,
        verified: true,
        subscriptionPlan: "Free",
        subscriptionStatus: "active",
        createdAt: new Date().toISOString(),
        town: "Unknown", // Default or could be in form
        region: "Unknown",
        type: "Preschool"
      });

      // 2. Update the user role and schoolId
      if (reg.userId) {
        await updateDocument("users", reg.userId, {
          role: "SchoolAdmin",
          schoolId: schoolId
        });
      }

      // 3. Update registration status
      await updateDocument("school_registrations", reg.id, {
        status: "approved",
        approvedAt: new Date().toISOString()
      });

      toast.success(`School "${reg.schoolName}" approved and admin role assigned!`);
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error("Failed to approve school registration.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateDocument("school_registrations", id, { status: "rejected" });
      toast.info("Registration rejected.");
    } catch (error) {
      toast.error("Failed to reject registration.");
    }
  };

  const filteredSchools = schools.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (school.town && school.town.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const pendingRegistrations = registrations.filter(r => r.status === "pending");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">School Directory</h1>
          <p className="text-slate-500 italic text-sm">Manage all registered preschools and verify their documents.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border-slate-200">
              <Filter className="h-4 w-4 mr-2" /> Filters
           </Button>
           <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-100">
              Add New School
           </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-50 p-6">
           <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by school name or location..." 
                className="pl-10 h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-[10px] text-slate-400 uppercase bg-slate-50 border-y border-slate-100 font-black tracking-widest Ital">
                <tr>
                  <th className="px-6 py-4">School Details</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Subscription</th>
                  <th className="px-6 py-4">Verification</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredSchools.map((school) => (
                  <tr key={school.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black relative overflow-hidden group-hover:shadow-md transition-all">
                             {school.heroImage ? (
                               <img src={school.heroImage} className="h-full w-full object-cover" alt="" />
                             ) : (
                               <Building2 className="h-6 w-6" />
                             )}
                          </div>
                          <div className="min-w-0">
                             <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{school.name}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{school.type}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 text-slate-500">
                          <MapPin className="h-3 w-3" />
                          <span className="text-xs">{school.town}, {school.region}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="space-y-1">
                          <Badge variant="outline" className={`bg-white border-slate-200 text-xs font-bold ${
                            school.subscriptionPlan === 'Enterprise' ? 'border-purple-200 text-purple-600' :
                            school.subscriptionPlan === 'Professional' ? 'border-blue-200 text-blue-600' :
                            'text-slate-600'
                          }`}>
                            <CreditCard className="h-3 w-3 mr-1" /> {school.subscriptionPlan}
                          </Badge>
                          <p className={`text-[10px] font-black uppercase tracking-tighter ${school.subscriptionStatus === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                             {school.subscriptionStatus}
                          </p>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       {school.verified ? (
                         <div className="flex items-center gap-1.5 text-green-600">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="text-xs font-bold">Verified</span>
                         </div>
                       ) : (
                         <div className="flex items-center gap-1.5 text-orange-400">
                            <ShieldX className="h-4 w-4" />
                            <span className="text-xs font-bold">Pending</span>
                         </div>
                       )}
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-1.5 text-slate-400">
                          <Calendar className="h-3 w-3" />
                          <span className="text-[10px] font-bold uppercase">{new Date(school.createdAt || Date.now()).toLocaleDateString()}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400">
                               <MoreHorizontal className="h-4 w-4" />
                            </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-200 shadow-xl p-1">
                            <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest Ital px-2 py-1.5">Management</DropdownMenuLabel>
                            <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-bold text-xs py-2 px-3">
                               <ExternalLink className="h-3 w-3" /> View Website
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-bold text-xs py-2 px-3">
                               <ShieldCheck className="h-3 w-3" /> Manage Verification
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-bold text-xs py-2 px-3">
                               <CreditCard className="h-3 w-3" /> Edit Subscription
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-50" />
                            <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-bold text-xs py-2 px-3 text-red-600 hover:bg-red-50 hover:text-red-700">
                               Suspend School
                            </DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Verification Queue Section */}
      <div className="grid lg:grid-cols-2 gap-8">
         <Card className="border-none shadow-sm h-full">
            <CardHeader className="border-b border-slate-50">
               <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Pending Review</CardTitle>
               <CardDescription>Schools awaiting document verification.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-50">
                  {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading registrations...</div>
                  ) : pendingRegistrations.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 italic text-xs">No pending registrations.</div>
                  ) : pendingRegistrations.map(reg => (
                    <div key={reg.id} className="p-4 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                             <Building2 className="h-5 w-5" />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-900">{reg.schoolName}</p>
                             <p className="text-[10px] text-slate-500 font-medium">{reg.principalName} • {reg.email}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                         <Button 
                           size="sm" 
                           onClick={() => handleApprove(reg)}
                           disabled={!!processingId}
                           className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 h-8 text-[10px] font-black uppercase tracking-widest shadow-lg"
                         >
                            {processingId === reg.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Approve"}
                         </Button>
                         <Button 
                           size="sm" 
                           variant="ghost"
                           onClick={() => handleReject(reg.id)}
                           className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg px-2 h-8 text-[10px] font-black uppercase tracking-widest"
                         >
                            Reject
                         </Button>
                       </div>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-sm h-full flex flex-col bg-slate-900 text-white">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-6 flex-1">
               <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center text-blue-400">
                  <ShieldCheck className="h-10 w-10" />
               </div>
               <div>
                  <h3 className="text-xl font-black tracking-tight">Bulk Verifications</h3>
                  <p className="text-slate-400 text-sm mt-1">Verify multiple schools after regional inspections.</p>
               </div>
               <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 shadow-lg shadow-blue-900/40">
                  Execute Batch Action
               </Button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

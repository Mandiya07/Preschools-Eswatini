import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  CreditCard,
  Database,
  Sparkles,
  Users,
  UserCheck,
  GraduationCap,
  LayoutDashboard
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { fetchCollection, updateDocument, createDocument, subscribeToCollection } from "@/lib/firestoreUtils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";

export function SuperAdminSchoolsPage() {
  const navigate = useNavigate();
  const { setActiveSchoolId } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editSchool, setEditSchool] = useState<any | null>(null);
  const [suspendSchool, setSuspendSchool] = useState<any | null>(null);
  const [viewSchoolDetails, setViewSchoolDetails] = useState<any | null>(null);

  useEffect(() => {
    const unsubRegs = subscribeToCollection("school_registrations", (data) => {
      setRegistrations(data);
    });
    
    const unsubSchools = subscribeToCollection("schools", (data) => {
      const dbSchools = (data as any[]) || [];
      const mergedSchoolsMap = new Map<string, any>();
      import("@/data/preloadedSchools").then(({ PRELOADED_SCHOOLS }) => {
        PRELOADED_SCHOOLS.forEach((s: any) => mergedSchoolsMap.set(s.id, s));
        dbSchools.forEach(s => mergedSchoolsMap.set(s.id, s));
        setSchools(Array.from(mergedSchoolsMap.values()));
        setLoading(false);
      });
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
                             {school.heroImage && !school.heroImage.includes('unsplash.com') ? (
                               <img src={school.heroImage} className="h-full w-full object-cover" alt="" />
                             ) : (
                               <img src="/logo-512.png" alt="Preschools Eswatini" className="h-full w-full object-contain p-1" />
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
                          <p className={`text-[10px] font-black uppercase tracking-tighter ${
                            (school.subscriptionStatus === 'active' && school.ownerId !== 'super_admin_seed') ? 'text-green-500' : 'text-slate-400'
                          }`}>
                             {(!school.ownerId || school.ownerId === 'super_admin_seed') ? 'Unclaimed' : school.subscriptionStatus}
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
                         <DropdownMenuTrigger className="inline-flex items-center justify-center shrink-0 h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors outline-none cursor-pointer">
                            <MoreHorizontal className="h-4 w-4" />
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-200 shadow-xl p-1">
                            <DropdownMenuLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest Ital px-2 py-1.5">Management</DropdownMenuLabel>
                             <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-bold text-xs py-2 px-3" onClick={() => {
                               setActiveSchoolId(school.id);
                               navigate("/admin");
                            }}>
                               <LayoutDashboard className="h-3 w-3" /> Admin Dashboard
                            </DropdownMenuItem>
                             <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-bold text-xs py-2 px-3" onClick={() => setViewSchoolDetails(school)}>
                               <Building2 className="h-3 w-3" /> Quick Profile
                            </DropdownMenuItem>
                             <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-bold text-xs py-2 px-3" onClick={() => navigate(`/school/${school.id}`)}>
                               <ExternalLink className="h-3 w-3" /> Public Website
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-bold text-xs py-2 px-3" onClick={async () => {
                               try {
                                 await updateDocument("schools", school.id, { verified: !school.verified });
                                 toast.success(school.verified ? "School verification revoked." : "School verified successfully.");
                               } catch (err) {
                                 toast.error("Failed to update verification status.");
                               }
                            }}>
                               <ShieldCheck className="h-3 w-3" /> Manage Verification
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-bold text-xs py-2 px-3" onClick={() => setEditSchool(school)}>
                               <CreditCard className="h-3 w-3" /> Edit Subscription
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-50" />
                            <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-bold text-xs py-2 px-3 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => setSuspendSchool(school)}>
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

      {editSchool && (
        <Dialog open={true} onOpenChange={(open) => !open && setEditSchool(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Subscription for {editSchool.name}</DialogTitle>
              <DialogDescription>
                Change the current subscription plan for this school.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 py-4">
              {['Free', 'Basic', 'Professional', 'Enterprise'].map(plan => (
                <Button 
                   key={plan}
                   variant={editSchool.subscriptionPlan === plan ? "default" : "outline"}
                   onClick={async () => {
                     try {
                        await updateDocument("schools", editSchool.id, { subscriptionPlan: plan });
                        toast.success("Subscription plan updated.");
                        setEditSchool(null);
                     } catch (err) {
                        toast.error("Failed to update subscription.");
                     }
                   }}
                >
                  {plan}
                </Button>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditSchool(null)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {suspendSchool && (
        <Dialog open={true} onOpenChange={(open) => !open && setSuspendSchool(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-600">Suspend School: {suspendSchool.name}</DialogTitle>
              <DialogDescription>
                Are you sure you want to suspend this school? This action will set their subscription status to 'canceled'.
                They will no longer have access to premium features.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSuspendSchool(null)}>Cancel</Button>
              <Button 
                variant="destructive"
                onClick={async () => {
                  try {
                    await updateDocument("schools", suspendSchool.id, { subscriptionStatus: "canceled" });
                    toast.success("School suspended (subscription canceled).");
                    setSuspendSchool(null);
                  } catch (err) {
                    toast.error("Failed to suspend school.");
                  }
                }}
              >
                Confirm Suspension
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {viewSchoolDetails && (
        <Dialog open={true} onOpenChange={(open) => !open && setViewSchoolDetails(null)}>
          <DialogContent className="sm:max-w-xl rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
            <div className="h-32 bg-slate-900 relative">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
               <div className="absolute -bottom-12 left-8 h-24 w-24 rounded-2xl bg-white shadow-xl flex items-center justify-center p-1">
                  <div className="h-full w-full rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                     {viewSchoolDetails.heroImage && !viewSchoolDetails.heroImage.includes('unsplash.com') ? (
                        <img src={viewSchoolDetails.heroImage} className="h-full w-full object-cover" alt="" />
                     ) : (
                        <img src="/logo-512.png" alt="Preschools Eswatini" className="h-full w-full object-contain p-2" />
                     )}
                  </div>
               </div>
               <div className="absolute bottom-4 right-8 flex gap-2">
                  <Badge className={viewSchoolDetails.verified ? "bg-emerald-500" : "bg-orange-500"}>
                     {viewSchoolDetails.verified ? "Verified Partner" : "Verification Pending"}
                  </Badge>
               </div>
            </div>
            
            <div className="pt-16 pb-8 px-8 space-y-6">
               <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{viewSchoolDetails.name}</h2>
                  <div className="flex items-center gap-4 mt-2 text-slate-500 text-sm">
                     <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {viewSchoolDetails.town}, {viewSchoolDetails.region}</span>
                     <span className="flex items-center gap-1.5 font-bold text-slate-900"><CreditCard className="h-3.5 w-3.5" /> {viewSchoolDetails.subscriptionPlan} Plan</span>
                  </div>
               </div>

               <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <Users className="h-4 w-4 text-blue-600 mb-2" />
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Students</p>
                     <p className="text-xl font-black text-slate-900">--</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <GraduationCap className="h-4 w-4 text-purple-600 mb-2" />
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Faculty</p>
                     <p className="text-xl font-black text-slate-900">--</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <UserCheck className="h-4 w-4 text-emerald-600 mb-2" />
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admissions</p>
                     <p className="text-xl font-black text-slate-900">--</p>
                  </div>
               </div>

               <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-slate-500">Contact Email</span>
                     <span className="font-bold text-slate-900">{viewSchoolDetails.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-slate-500">Subscription Status</span>
                     <Badge variant="outline" className="capitalize border-slate-200">{viewSchoolDetails.subscriptionStatus}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-slate-500">Registered On</span>
                     <span className="font-medium text-slate-900">{new Date(viewSchoolDetails.createdAt).toLocaleDateString()}</span>
                  </div>
               </div>

               <div className="pt-4 flex gap-3">
                  <Button onClick={() => navigate(`/school/${viewSchoolDetails.id}`)} className="flex-1 bg-blue-600 hover:bg-blue-700 h-11 rounded-xl font-bold font-white shadow-lg shadow-blue-100">
                     Visit Website
                  </Button>
                  <Button variant="outline" onClick={() => setViewSchoolDetails(null)} className="h-11 px-6 rounded-xl font-bold border-slate-200">
                     Close
                  </Button>
               </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      

    </div>
  );
}

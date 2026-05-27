import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Shield, 
  UserCircle,
  Activity,
  CheckCircle2,
  XCircle,
  Plus
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
import { toast } from "sonner";
import { subscribeToCollection } from "@/lib/firestoreUtils";

export function SuperAdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [usersList, setUsersList] = useState<any[]>([]);
  const [schoolsList, setSchoolsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubUsers = subscribeToCollection("users", (data) => {
      setUsersList(data || []);
      setLoading(false);
    });

    const unsubSchools = subscribeToCollection("schools", (data) => {
      setSchoolsList(data || []);
    });

    return () => {
      unsubUsers();
      unsubSchools();
    };
  }, []);

  const getSchoolName = (schoolId: string) => {
    if (!schoolId) return "System";
    const sch = schoolsList.find(s => s.id === schoolId);
    return sch ? sch.name : "N/A";
  };

  const activeAdminsCount = usersList.filter(u => u.role === "SchoolAdmin" || u.role === "SuperAdmin").length;
  const registeredParentsCount = usersList.filter(u => u.role === "Parent").length;
  const bannedUsersCount = usersList.filter(u => u.status === "Suspended" || u.status === "Banned").length;

  const filteredUsers = usersList.filter(user => {
    const name = user.name || "";
    const email = user.email || "";
    const role = user.role || "";
    const schName = getSchoolName(user.schoolId || user.school);
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           role.toLowerCase().includes(searchTerm.toLowerCase()) ||
           schName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">User Management</h1>
          <p className="text-slate-500 italic text-sm">Oversee platform users, roles, and system-wide permissions.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-xl border-slate-200">
              <Filter className="h-4 w-4 mr-2" /> Filter Roles
           </Button>
           <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-100">
              <Plus className="h-4 w-4 mr-2" /> Invite Admin
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         {[
           { label: "Active Admins", value: activeAdminsCount.toLocaleString(), icon: Shield, color: "blue" },
           { label: "Registered Parents", value: registeredParentsCount.toLocaleString(), icon: Users, color: "purple" },
           { label: "Banned Users", value: bannedUsersCount.toLocaleString(), icon: XCircle, color: "red" },
         ].map((stat, i) => (
           <Card key={i} className="border-none shadow-sm group cursor-pointer hover:bg-slate-50 transition-colors">
              <CardContent className="p-6 flex items-center gap-4">
                 <div className={`h-12 w-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
                    <stat.icon className="h-6 w-6" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight">{stat.value}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="bg-white border-b border-slate-50 p-6">
           <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search users by name, email or school..." 
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
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Current Role</th>
                  <th className="px-6 py-4">Organization</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Activity</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-xs italic">
                      {loading ? "Loading users..." : "No users matched the criteria in database."}
                    </td>
                  </tr>
                ) : filteredUsers.map((user) => (
                  <tr key={user.id || user.uid} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs uppercase">
                             {(user.name || "U").split(' ').filter(Boolean).map((n: string) => n[0]).join('')}
                          </div>
                          <div>
                             <p className="font-bold text-slate-900 uppercase tracking-tight">{user.name || "Unnamed User"}</p>
                             <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {user.email || "No Email"}
                             </p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <Badge variant="outline" className={`bg-white border-slate-200 text-[10px] font-black uppercase tracking-widest ${
                         user.role === 'SuperAdmin' ? 'border-red-200 text-red-600' :
                         user.role === 'SchoolAdmin' ? 'border-blue-200 text-blue-600' :
                         'border-purple-200 text-purple-600'
                       }`}>
                         {user.role || 'Parent'}
                       </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium">
                       {getSchoolName(user.schoolId || user.school)}
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-1.5">
                          {user.status === 'Active' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                          <span className={`text-xs font-bold ${user.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{user.status}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-1.5 text-slate-400">
                          <Activity className="h-3 w-3" />
                          <span className="text-[10px] font-bold uppercase tracking-tight">{user.lastActive || 'N/A'}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <DropdownMenu>
                         <DropdownMenuTrigger className="inline-flex items-center justify-center shrink-0 h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors outline-none cursor-pointer">
                            <MoreHorizontal className="h-4 w-4" />
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-200 shadow-xl p-1">
                            <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-bold text-xs py-2 px-3" onClick={() => toast.info('Edit Profile coming soon.')}>
                               <UserCircle className="h-3 w-3" /> Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-bold text-xs py-2 px-3" onClick={() => toast.info('Permissions editor coming soon.')}>
                               <Shield className="h-3 w-3" /> Change Permissions
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-50" />
                            <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-bold text-xs py-2 px-3 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => {
                               toast.success(`${user.name} has been banned.`);
                            }}>
                               Ban Account
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
    </div>
  );
}

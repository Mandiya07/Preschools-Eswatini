import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Mail, MessageSquare, Phone, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { subscribeToCollection } from "@/lib/firestoreUtils";
import { where } from "firebase/firestore";

type Parent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  children: string[];
  lastActive: string;
};

export function AdminParentsPage() {
  const { user, activeSchoolId } = useAuth();
  const effectiveSchoolId = user?.role === 'SuperAdmin' ? activeSchoolId : user?.schoolId;
  const [parents, setParents] = useState<Parent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!effectiveSchoolId) return;

    // Getting students to group by parent
    const unsubStudents = subscribeToCollection(
      'students',
      (studentsData) => {
        const parentsMap = new Map<string, Parent>();
        
        studentsData.forEach((student: any) => {
          if (student.parentEmail) {
            const parentKey = student.parentEmail;
            if (parentsMap.has(parentKey)) {
              parentsMap.get(parentKey)!.children.push(student.name);
            } else {
              parentsMap.set(parentKey, {
                id: parentKey, // using email as ID for grouped view
                name: student.parentName || 'Parent of ' + student.name,
                email: student.parentEmail,
                phone: student.parentPhone || 'N/A',
                children: [student.name],
                lastActive: "Via Student Portal"
              });
            }
          }
        });
        
        setParents(Array.from(parentsMap.values()));
        setLoading(false);
      },
      where('schoolId', '==', effectiveSchoolId)
    );

    return () => {
      unsubStudents();
    };
  }, [effectiveSchoolId]);

  const filteredParents = parents.filter(parent => 
    parent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    parent.children.some(child => child.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
     return <div className="flex h-64 items-center justify-center border rounded-xl"><Loader2 className="w-8 h-8 animate-spin text-blue-600"/></div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Parents & Guardians</h1>
          <p className="text-sm text-slate-500 mt-1">Manage communication and parent portals.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white">
            <Mail className="mr-2 h-4 w-4" /> Message All
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Invite Parent
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Parent Directory</CardTitle>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by name or child..." 
                className="pl-9 bg-slate-50 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-y border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">Parent Name</th>
                  <th className="px-4 py-3 font-medium">Contact Details</th>
                  <th className="px-4 py-3 font-medium">Children Enrolled</th>
                  <th className="px-4 py-3 font-medium">Portal Activity</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredParents.length > 0 ? (
                  filteredParents.map((parent) => (
                    <tr key={parent.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                            {parent.name.charAt(0)}
                          </div>
                          <span className="font-medium text-slate-900">{parent.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-slate-900 text-sm flex items-center gap-2">
                          <Mail className="h-3 w-3 text-slate-400" /> {parent.email}
                        </div>
                        <div className="text-slate-500 text-xs flex items-center gap-2 mt-1">
                          <Phone className="h-3 w-3 text-slate-400" /> {parent.phone}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {parent.children.map(child => (
                            <span key={child} className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                              {child}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-500">
                        {parent.lastActive}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-green-600" title="WhatsApp Message" onClick={() => window.open(`https://wa.me/${parent.phone.replace(/[^0-9]/g, '')}`, '_blank')}>
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="secondary" size="sm" className="hidden sm:inline-flex rounded-xl">View Portal</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      No parents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

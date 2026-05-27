import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Edit2, Trash2, X, Download, Loader2, Mail, Phone, Briefcase } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { subscribeToCollection, createDocument, updateDocument, deleteDocument } from "@/lib/firestoreUtils";
import { where } from "firebase/firestore";

type Staff = {
  id: string;
  schoolId: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  specialization: string;
  status: "Active" | "On Leave" | "Former";
};

export function AdminStaffPage() {
  const { user, activeSchoolId } = useAuth();
  const effectiveSchoolId = user?.role === 'SuperAdmin' ? activeSchoolId : user?.schoolId;
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Staff>>({
    name: "",
    role: "",
    email: "",
    phone: "",
    specialization: "",
    status: "Active"
  });

  useEffect(() => {
    if (!effectiveSchoolId) return;

    const unsubscribe = subscribeToCollection(
      'staff',
      (data) => {
        setStaff(data as Staff[]);
        setLoading(false);
      },
      where('schoolId', '==', effectiveSchoolId)
    );

    return () => unsubscribe();
  }, [effectiveSchoolId]);

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (s?: Staff) => {
    if (s) {
      setEditingId(s.id);
      setFormData({ ...s });
    } else {
      setEditingId(null);
      setFormData({
        name: "", role: "", email: "", phone: "", specialization: "", status: "Active"
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveSchoolId) return;

    setSaving(true);
    try {
      if (editingId) {
        await updateDocument('staff', editingId, { 
          ...formData,
          updatedAt: new Date().toISOString()
        });
      } else {
        await createDocument('staff', null, { 
          ...formData, 
          schoolId: effectiveSchoolId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this staff record?")) {
      try {
        await deleteDocument('staff', id);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Staff Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your teachers, administrators, and support staff.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" /> Add Staff
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>School Staff</CardTitle>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by name or role..." 
                className="pl-9 bg-slate-50 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((member) => (
                <div key={member.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-200 transition-colors shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex gap-1">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600" onClick={() => handleOpenModal(member)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => handleDelete(member.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{member.name}</h3>
                    <p className="text-xs text-blue-600 font-medium mb-3">{member.role}</p>
                    
                    <div className="space-y-2">
                       <div className="flex items-center text-xs text-slate-500">
                        <Mail className="h-3 w-3 mr-2" /> {member.email || "No email"}
                      </div>
                      <div className="flex items-center text-xs text-slate-500">
                        <Phone className="h-3 w-3 mr-2" /> {member.phone || "No phone"}
                      </div>
                      <div className="flex items-center text-xs text-slate-500">
                        <Briefcase className="h-3 w-3 mr-2" /> {member.specialization || "Generalist"}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                       <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                           member.status === 'Active' ? 'bg-green-50 text-green-700' :
                           member.status === 'On Leave' ? 'bg-amber-50 text-amber-700' :
                           'bg-slate-50 text-slate-700'
                         }`}>
                          {member.status}
                        </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500">
                No staff members found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal for Add/Edit Staff */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId ? "Edit Staff Member" : "Add New Staff"}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form id="staff-form" onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <Input 
                    required 
                    value={formData.name || ""} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. Maria Zwane"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                    <Input 
                      required 
                      value={formData.role || ""} 
                      onChange={e => setFormData({...formData, role: e.target.value})} 
                      placeholder="e.g. Lead Teacher"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                      value={formData.status} 
                      onChange={e => setFormData({...formData, status: e.target.value as any})}
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Former">Former</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <Input 
                      type="email" 
                      value={formData.email || ""} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                    <Input 
                      value={formData.phone || ""} 
                      onChange={e => setFormData({...formData, phone: e.target.value})} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Specialization / Expertise</label>
                  <Input 
                    value={formData.specialization || ""} 
                    onChange={e => setFormData({...formData, specialization: e.target.value})} 
                    placeholder="e.g. Montessori Certified, First Aid"
                  />
                </div>
              </form>
            </div>
            
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50">
              <Button type="button" variant="outline" onClick={handleCloseModal} disabled={saving}>Cancel</Button>
              <Button type="submit" form="staff-form" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? "Save Changes" : "Save Staff"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

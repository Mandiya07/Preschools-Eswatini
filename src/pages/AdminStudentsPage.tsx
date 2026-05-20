import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Edit2, Trash2, X, Download, Loader2, User, Upload, Camera, FileUp } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { subscribeToCollection, createDocument, updateDocument, deleteDocument } from "@/lib/firestoreUtils";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { where } from "firebase/firestore";
import Papa from "papaparse";
import { toast } from "sonner";

type Student = {
  id: string;
  schoolId: string;
  name: string;
  age: number | string;
  class: string;
  parentName: string;
  parentContact: string;
  parentEmail?: string;
  medicalInfo: string;
  photoUrl?: string;
  status: "Active" | "Inactive" | "Graduated";
};

export function AdminStudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Student>>({
    name: "",
    age: "",
    class: "",
    parentName: "",
    parentContact: "",
    parentEmail: "",
    medicalInfo: "",
    photoUrl: "",
    status: "Active"
  });

  const [uploading, setUploading] = useState(false);
  const [bulkUploading, setBulkUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.schoolId) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file.");
      return;
    }

    setBulkUploading(true);
    const toastId = toast.loading("Processing CSV...");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as any[];
        let successCount = 0;
        let errorCount = 0;

        for (const row of rows) {
          try {
            await createDocument('students', null, {
              name: row.name || "Unknown",
              age: row.age || "",
              class: row.class || "",
              parentName: row.parentName || "",
              parentContact: row.parentContact || "",
              parentEmail: row.parentEmail || "",
              medicalInfo: row.medicalInfo || "",
              status: (row.status as any) || "Active",
              schoolId: user.schoolId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
            successCount++;
          } catch (err) {
            console.error("Failed to create student from CSV row:", row, err);
            errorCount++;
          }
        }

        setBulkUploading(false);
        toast.dismiss(toastId);
        if (errorCount === 0) {
          toast.success(`Successfully imported ${successCount} students.`);
        } else {
          toast.info(`Imported ${successCount} students. ${errorCount} rows failed.`);
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
      error: (error) => {
        setBulkUploading(false);
        toast.dismiss(toastId);
        toast.error(`Error parsing CSV: ${error.message}`);
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.schoolId) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      alert("Image size should be less than 2MB.");
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `schools/${user.schoolId}/students/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setFormData(prev => ({ ...prev, photoUrl: downloadURL }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!user?.schoolId) return;

    const unsubscribe = subscribeToCollection(
      'students',
      (data) => {
        setStudents(data as Student[]);
        setLoading(false);
      },
      where('schoolId', '==', user.schoolId)
    );

    return () => unsubscribe();
  }, [user]);

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (student.parentName && student.parentName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenModal = (student?: Student) => {
    if (student) {
      setEditingId(student.id);
      setFormData({ ...student });
    } else {
      setEditingId(null);
      setFormData({
        name: "", 
        age: "", 
        class: "", 
        parentName: "", 
        parentContact: "", 
        parentEmail: "",
        medicalInfo: "", 
        photoUrl: "",
        status: "Active"
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
    if (!user?.schoolId) return;

    setSaving(true);
    try {
      if (editingId) {
        await updateDocument('students', editingId, { 
          ...formData,
          updatedAt: new Date().toISOString()
        });
      } else {
        await createDocument('students', null, { 
          ...formData, 
          schoolId: user.schoolId,
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
    if (window.confirm("Are you sure you want to delete this student record?")) {
      try {
        await deleteDocument('students', id);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleExport = () => {
    if (students.length === 0) {
      toast.error("No students to export.");
      return;
    }

    const exportData = students.map(({ id, schoolId, photoUrl, ...rest }) => rest);
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `students_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Students exported successfully.");
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Students</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your enrolled students and viewing their records.</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleBulkUpload} 
            className="hidden" 
            accept=".csv" 
          />
          <Button 
            variant="outline" 
            className="bg-white"
            onClick={() => fileInputRef.current?.click()}
            disabled={bulkUploading}
          >
            {bulkUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
            Bulk Import
          </Button>
          <Button 
            variant="outline" 
            className="bg-white"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" /> Add Student
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>All Students</CardTitle>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search students or parents..." 
                className="pl-9 bg-slate-50 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-y border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">Student Name</th>
                  <th className="px-4 py-3 font-medium">Age</th>
                  <th className="px-4 py-3 font-medium">Class / Grade</th>
                  <th className="px-4 py-3 font-medium">Parent Contact</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <div className="flex items-center gap-3">
                          {student.photoUrl ? (
                            <img src={student.photoUrl} alt={student.name} className="h-8 w-8 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                              <User className="h-4 w-4" />
                            </div>
                          )}
                          <span>{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{student.age}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          {student.class}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-slate-900 text-xs font-medium">{student.parentName}</span>
                          <span className="text-slate-500 text-xs">{student.parentContact}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                         <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                           student.status === 'Active' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                           student.status === 'Inactive' ? 'bg-slate-50 text-slate-700 ring-slate-600/20' :
                           'bg-blue-50 text-blue-700 ring-blue-600/20'
                         } ring-1 ring-inset`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600" onClick={() => handleOpenModal(student)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => handleDelete(student.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      No students found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4">
             {filteredStudents.length > 0 ? (
               filteredStudents.map((student) => (
                 <div key={student.id} className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm space-y-3">
                    <div className="flex items-start justify-between">
                       <div className="flex items-center gap-3">
                          {student.photoUrl ? (
                            <img src={student.photoUrl} alt={student.name} className="h-10 w-10 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                              <User className="h-5 w-5" />
                            </div>
                          )}
                          <div className="space-y-1">
                             <p className="font-bold text-slate-900">{student.name}</p>
                             <p className="text-xs text-slate-500">Age: {student.age} • Class: {student.class}</p>
                          </div>
                       </div>
                       <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                          student.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'
                       }`}>
                         {student.status}
                       </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-50">
                       <div className="space-y-0.5">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Parent</p>
                          <p className="text-xs font-medium">{student.parentName}</p>
                       </div>
                       <div className="space-y-0.5">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Contact</p>
                          <p className="text-xs font-medium">{student.parentContact}</p>
                       </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                       <Button variant="outline" size="sm" className="h-8 rounded-lg text-slate-600 text-[10px] font-bold uppercase" onClick={() => handleOpenModal(student)}>
                         Edit
                       </Button>
                       <Button variant="ghost" size="sm" className="h-8 rounded-lg text-red-500 text-[10px] font-bold uppercase" onClick={() => handleDelete(student.id)}>
                         Delete
                       </Button>
                    </div>
                 </div>
               ))
             ) : (
               <div className="py-12 text-center text-slate-400 italic text-sm">No students found.</div>
             )}
          </div>
        </CardContent>
      </Card>

      {/* Modal for Add/Edit Student */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId ? "Edit Student Record" : "Add New Student"}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  {formData.photoUrl ? (
                    <img 
                      src={formData.photoUrl} 
                      alt="Student" 
                      className="h-24 w-24 rounded-full object-cover border-2 border-white shadow-md"
                      referrerPolicy="no-referrer" 
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                      <User className="h-8 w-8 mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">No Photo</span>
                    </div>
                  )}
                  <label 
                    htmlFor="photo-upload" 
                    className="absolute bottom-0 right-0 h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-blue-700 shadow-lg border-2 border-white transition-transform active:scale-95"
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  </label>
                  <input 
                    id="photo-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest">
                  {uploading ? "Uploading..." : "Click icon to upload photo"}
                </p>
              </div>

              <form id="student-form" onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                    <Input 
                      required 
                      value={formData.name || ""} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      placeholder="e.g. Sipho Dlamini"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                    <Input 
                      required 
                      type="number"
                      value={formData.age || ""} 
                      onChange={e => setFormData({...formData, age: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Class / Grade</label>
                    <Input 
                      required 
                      value={formData.class || ""} 
                      onChange={e => setFormData({...formData, class: e.target.value})} 
                      placeholder="e.g. Pre-Primary"
                    />
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                   <select 
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-2">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Parent / Guardian Info</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Parent Name</label>
                      <Input 
                        required 
                        value={formData.parentName || ""} 
                        onChange={e => setFormData({...formData, parentName: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
                      <Input 
                        required 
                        value={formData.parentContact || ""} 
                        onChange={e => setFormData({...formData, parentContact: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                      <Input 
                        type="email"
                        value={formData.parentEmail || ""} 
                        onChange={e => setFormData({...formData, parentEmail: e.target.value})} 
                        placeholder="parent@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Medical Info</label>
                  <textarea 
                    className="w-full rounded-md border border-slate-200 p-2 text-sm focus:ring-1 focus:ring-blue-600 focus:outline-none" 
                    rows={2} 
                    value={formData.medicalInfo || ""} 
                    onChange={e => setFormData({...formData, medicalInfo: e.target.value})}
                  />
                </div>
              </form>
            </div>
            
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50">
              <Button type="button" variant="outline" onClick={handleCloseModal} disabled={saving}>Cancel</Button>
              <Button type="submit" form="student-form" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? "Save Changes" : "Add Student"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

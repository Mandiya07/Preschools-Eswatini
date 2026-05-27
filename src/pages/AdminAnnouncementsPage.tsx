import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2, Trash2, X, Loader2, Megaphone, Clock, Send, Users, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { subscribeToCollection, createDocument, updateDocument, deleteDocument } from "@/lib/firestoreUtils";
import { where, orderBy } from "firebase/firestore";

type Announcement = {
  id: string;
  schoolId: string;
  title: string;
  content: string;
  date: string;
  priority: "Low" | "Normal" | "High" | "Urgent";
  targetAudience: "All" | "Parents" | "Staff";
};

export function AdminAnnouncementsPage() {
  const { user, activeSchoolId } = useAuth();
  const effectiveSchoolId = user?.role === 'SuperAdmin' ? activeSchoolId : user?.schoolId;
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: "",
    content: "",
    priority: "Normal",
    targetAudience: "All",
    date: new Date().toISOString()
  });

  useEffect(() => {
    if (!effectiveSchoolId) return;

    const unsubscribe = subscribeToCollection(
      'announcements',
      (data) => {
        // Sort manually since our helper doesn't always support complex queries easily
        const sorted = (data as Announcement[]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setAnnouncements(sorted);
        setLoading(false);
      },
      where('schoolId', '==', effectiveSchoolId)
    );

    return () => unsubscribe();
  }, [effectiveSchoolId]);

  const handleOpenModal = (a?: Announcement) => {
    if (a) {
      setEditingId(a.id);
      setFormData({ ...a });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        content: "",
        priority: "Normal",
        targetAudience: "All",
        date: new Date().toISOString()
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
        await updateDocument('announcements', editingId, formData);
      } else {
        await createDocument('announcements', null, { 
          ...formData, 
          schoolId: effectiveSchoolId,
          authorId: user.uid,
          date: new Date().toISOString()
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
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await deleteDocument('announcements', id);
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Announcements</h1>
          <p className="text-sm text-slate-500 mt-1">Publish news and updates to parents and staff portals.</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700">
          <Send className="mr-2 h-4 w-4" /> New Announcement
        </Button>
      </div>

      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map((a) => (
            <Card key={a.id} className="overflow-hidden border-slate-200">
               <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className={`w-full sm:w-1 ${
                      a.priority === 'Urgent' ? 'bg-red-500' :
                      a.priority === 'High' ? 'bg-amber-500' :
                      a.priority === 'Normal' ? 'bg-blue-500' :
                      'bg-slate-300'
                    }`} />
                    <div className="flex-1 p-6">
                       <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                             <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                a.priority === 'Urgent' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'
                             }`}>
                                <Megaphone className="h-5 w-5" />
                             </div>
                             <div>
                                <h3 className="font-bold text-slate-900">{a.title}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                   <span className="flex items-center text-xs text-slate-400">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {new Date(a.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                   </span>
                                   <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                                      a.targetAudience === 'All' ? 'bg-slate-50 border-slate-200 text-slate-600' :
                                      a.targetAudience === 'Staff' ? 'bg-purple-50 border-purple-100 text-purple-700' :
                                      'bg-blue-50 border-blue-100 text-blue-700'
                                   }`}>
                                      <Users className="h-2.5 w-2.5 mr-1" />
                                      {a.targetAudience}
                                   </span>
                                </div>
                             </div>
                          </div>
                          <div className="flex gap-1">
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600" onClick={() => handleOpenModal(a)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => handleDelete(a.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                       </div>
                       <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{a.content}</p>
                    </div>
                  </div>
               </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
             <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
                <Megaphone className="h-8 w-8 text-slate-200" />
             </div>
             <h3 className="text-lg font-bold text-slate-900">No announcements yet</h3>
             <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">Start broadcasting important updates to your school community.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId ? "Edit Announcement" : "Create Announcement"}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form id="announcement-form" onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="title">Subject / Title</label>
                  <Input 
                    id="title"
                    required 
                    value={formData.title || ""} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    placeholder="e.g. School Re-opening Date"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="priority">Priority</label>
                    <select 
                      id="priority"
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      value={formData.priority} 
                      onChange={e => setFormData({...formData, priority: e.target.value as any})}
                    >
                      <option value="Low">Low</option>
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="audience">Target Audience</label>
                    <select 
                      id="audience"
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      value={formData.targetAudience} 
                      onChange={e => setFormData({...formData, targetAudience: e.target.value as any})}
                    >
                      <option value="All">All (Public)</option>
                      <option value="Parents">Parents Only</option>
                      <option value="Staff">Staff Only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="content">Message Content</label>
                  <textarea 
                    id="content"
                    required
                    className="w-full rounded-md border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none min-h-[200px]" 
                    value={formData.content || ""} 
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    placeholder="Type your message here..."
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                   <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                   <div>
                      <p className="text-xs font-bold text-blue-900">Broadcasting Notice</p>
                      <p className="text-[10px] text-blue-700 mt-1">This will be visible on your school's website and parent portal. High priority announcements will trigger push notifications if enabled.</p>
                   </div>
                </div>
              </form>
            </div>
            
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50">
              <Button type="button" variant="outline" onClick={handleCloseModal} disabled={saving}>Cancel</Button>
              <Button type="submit" form="announcement-form" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingId ? "Update Announcement" : "Post Announcement"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

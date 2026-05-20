import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Edit2, Trash2, X, Loader2, Calendar, MapPin, Clock } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { subscribeToCollection, createDocument, updateDocument, deleteDocument } from "@/lib/firestoreUtils";
import { where } from "firebase/firestore";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

type Event = {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  type: "Academic" | "Holiday" | "Activity" | "Meeting";
};

export function AdminEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Event>>({
    title: "",
    description: "",
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date().toISOString().slice(0, 16),
    location: "",
    type: "Academic"
  });

  useEffect(() => {
    if (!user?.schoolId) return;

    const unsubscribe = subscribeToCollection(
      'events',
      (data) => {
        setEvents(data as Event[]);
        setLoading(false);
      },
      where('schoolId', '==', user.schoolId)
    );

    return () => unsubscribe();
  }, [user]);

  const handleOpenModal = (ev?: Event) => {
    if (ev) {
      setEditingId(ev.id);
      setFormData({ ...ev });
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        startDate: new Date().toISOString().slice(0, 16),
        endDate: new Date().toISOString().slice(0, 16),
        location: "",
        type: "Academic"
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
        await updateDocument('events', editingId, formData);
      } else {
        await createDocument('events', null, { 
          ...formData, 
          schoolId: user.schoolId,
          createdAt: new Date().toISOString()
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
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteDocument('events', id);
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

  const sortedEvents = [...events].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Events & Calendar</h1>
          <p className="text-sm text-slate-500 mt-1">Plan school activities, holidays, and meetings.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>

      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events.map(ev => ({
            id: ev.id,
            title: ev.title,
            start: ev.startDate,
            end: ev.endDate,
            backgroundColor: ev.type === 'Holiday' ? '#ef4444' :
                             ev.type === 'Activity' ? '#f59e0b' :
                             ev.type === 'Meeting' ? '#3b82f6' :
                             '#22c55e'
          }))}
          eventClick={(info) => {
            const event = events.find(e => e.id === info.event.id);
            if (event) handleOpenModal(event);
          }}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          height="500px"
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedEvents.length > 0 ? (
          sortedEvents.map((ev) => (
            <Card key={ev.id} className="overflow-hidden group hover:shadow-md transition-shadow">
               <div className={`h-2 ${
                 ev.type === 'Holiday' ? 'bg-red-500' :
                 ev.type === 'Activity' ? 'bg-amber-500' :
                 ev.type === 'Meeting' ? 'bg-blue-500' :
                 'bg-green-500'
               }`} />
              <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                <div className="space-y-1">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    ev.type === 'Holiday' ? 'bg-red-50 text-red-600' :
                    ev.type === 'Activity' ? 'bg-amber-50 text-amber-600' :
                    ev.type === 'Meeting' ? 'bg-blue-50 text-blue-600' :
                    'bg-green-50 text-green-600'
                  }`}>
                    {ev.type}
                  </span>
                  <CardTitle className="text-base font-bold">{ev.title}</CardTitle>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-blue-600" onClick={() => handleOpenModal(ev)}>
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-600" onClick={() => handleDelete(ev.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-slate-500 line-clamp-2">{ev.description || "No description provided."}</p>
                
                <div className="space-y-2 pt-2">
                   <div className="flex items-center text-xs text-slate-600">
                    <Calendar className="h-3 w-3 mr-2 text-slate-400" />
                    {new Date(ev.startDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </div>
                  <div className="flex items-center text-xs text-slate-600">
                    <Clock className="h-3 w-3 mr-2 text-slate-400" />
                    {new Date(ev.startDate).toLocaleTimeString(undefined, { timeStyle: 'short' })}
                  </div>
                  {ev.location && (
                    <div className="flex items-center text-xs text-slate-600">
                      <MapPin className="h-3 w-3 mr-2 text-slate-400" />
                      {ev.location}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
             <Calendar className="h-10 w-10 mx-auto mb-4 text-slate-200" />
             <h3 className="text-lg font-bold text-slate-900">No events scheduled</h3>
             <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">Keep your parents informed by adding school holidays, trips, and parent meetings.</p>
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
                {editingId ? "Edit Event" : "Create New Event"}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form id="event-form" onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="title">Event Title</label>
                  <Input 
                    id="title"
                    required 
                    value={formData.title || ""} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    placeholder="e.g. End of Term Party"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="type">Type</label>
                    <select 
                      id="type"
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      value={formData.type} 
                      onChange={e => setFormData({...formData, type: e.target.value as any})}
                    >
                      <option value="Academic">Academic</option>
                      <option value="Holiday">Holiday</option>
                      <option value="Activity">Activity</option>
                      <option value="Meeting">Meeting</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="location">Location</label>
                    <Input 
                      id="location"
                      value={formData.location || ""} 
                      onChange={e => setFormData({...formData, location: e.target.value})} 
                      placeholder="e.g. Main Hall"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="start">Start Date & Time</label>
                    <Input 
                      id="start"
                      type="datetime-local" 
                      required 
                      value={formData.startDate || ""} 
                      onChange={e => setFormData({...formData, startDate: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="end">End Date & Time</label>
                    <Input 
                      id="end"
                      type="datetime-local" 
                      required 
                      value={formData.endDate || ""} 
                      onChange={e => setFormData({...formData, endDate: e.target.value})} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="desc">Description</label>
                  <textarea 
                    id="desc"
                    className="w-full rounded-md border border-slate-200 p-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none" 
                    rows={3} 
                    value={formData.description || ""} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </form>
            </div>
            
            <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50">
              {editingId ? (
                <Button type="button" variant="destructive" onClick={() => { handleDelete(editingId); handleCloseModal(); }} disabled={saving}>Delete</Button>
              ) : (
                <div />
              )}
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={handleCloseModal} disabled={saving}>Cancel</Button>
                <Button type="submit" form="event-form" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingId ? "Update Event" : "Create Event"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

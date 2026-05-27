import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { School } from "@/types";
import { X, Loader2, Settings, Save } from "lucide-react";
import { updateDocument } from "@/lib/firestoreUtils";

export function SchoolProfileModal({ school, onClose, onUpdate }: { school: School, onClose: () => void, onUpdate: (s: School) => void }) {
  const [formData, setFormData] = useState({
    name: school.name || '',
    email: school.email || '',
    phone: school.phone || '',
    address: school.address || '',
    town: school.town || '',
    region: school.region || '',
    curriculum: school.curriculum || '',
    feePerTerm: school.feePerTerm || 0,
    description: school.description || '',
    boarding: school.boarding || 'Day',
    type: school.type || 'Private',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (school.id) {
        await updateDocument('schools', school.id, formData);
        onUpdate({ ...school, ...formData });
        onClose();
      }
    } catch (error) {
      console.error("Error updating school:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">School Profile Settings</h2>
              <p className="text-xs text-slate-500 font-medium">Update your core school information</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl border-slate-200" disabled={saving}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <form id="school-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">School Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Term Fees (E)</label>
                <input 
                  type="number" 
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.feePerTerm}
                  onChange={(e) => setFormData({...formData, feePerTerm: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Address</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Town / City</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.town}
                  onChange={(e) => setFormData({...formData, town: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Region</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                >
                  <option value="Hhohho">Hhohho</option>
                  <option value="Manzini">Manzini</option>
                  <option value="Shiselweni">Shiselweni</option>
                  <option value="Lubombo">Lubombo</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Curriculum</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.curriculum}
                  onChange={(e) => setFormData({...formData, curriculum: e.target.value})}
                >
                  <option value="National Syllabus (Eswatini)">National Syllabus</option>
                  <option value="Montessori">Montessori</option>
                  <option value="IEB (South African)">IEB (South African)</option>
                  <option value="Cambridge">Cambridge</option>
                  <option value="Reggio Emilia">Reggio Emilia</option>
                  <option value="Waldorf">Waldorf</option>
                  <option value="Christian ACE">Christian ACE</option>
                  <option value="Blended/Other">Blended/Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Boarding Concept</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.boarding}
                  onChange={(e) => setFormData({...formData, boarding: e.target.value as any})}
                >
                  <option value="Day">Day Only</option>
                  <option value="Boarding">Boarding Only</option>
                  <option value="Both">Day & Boarding</option>
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">About the School</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

            </div>

          </form>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
          <Button variant="outline" type="button" onClick={onClose} disabled={saving} className="rounded-xl font-bold bg-white drop-shadow-sm border-slate-200 text-slate-700">
            Cancel
          </Button>
          <Button type="submit" form="school-form" disabled={saving} className="rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

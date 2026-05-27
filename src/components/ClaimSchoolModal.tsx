import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { School } from "@/types";
import { X, Loader2, ShieldCheck, Mail, Phone, User, Briefcase } from "lucide-react";
import { createDocument } from "@/lib/firestoreUtils";
import { useAuth } from "@/lib/AuthContext";

export function ClaimSchoolModal({ school, onClose }: { school: School, onClose: () => void }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    role: '',
    message: ''
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to claim this school.");
      return;
    }
    setSaving(true);
    try {
      await createDocument('school_claims', null, {
        schoolId: school.id,
        schoolName: school.name,
        userId: user.uid,
        userName: formData.name,
        userEmail: formData.email,
        phone: formData.phone,
        roleAtSchool: formData.role,
        message: formData.message,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setSuccess(true);
    } catch (error) {
      console.error("Error submitting claim:", error);
      alert("Failed to submit claim request. Please try again later.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col p-8 text-center relative">
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </Button>
          <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Sign In to Claim</h2>
          <p className="text-sm text-slate-500 mb-6">You must be signed in to an account to claim ownership of {school.name}.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
            <Button asChild className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"><a href="/login">Go to Login</a></Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Claim Profile Ownership</h2>
              <p className="text-xs text-slate-500 font-medium">For {school.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl border-slate-200" disabled={saving}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {success ? (
             <div className="text-center py-6">
                <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Claim Request Submitted!</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Our verification team has received your request to claim ownership of <strong>{school.name}</strong>. 
                  We will contact you shortly to verify your affiliation. Once verified, this account will be upgraded to SchoolAdmin.
                </p>
                <Button onClick={onClose} className="w-full rounded-xl bg-blue-600 hover:bg-blue-700">Done</Button>
             </div>
          ) : (
            <form id="claim-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                <p className="text-sm text-blue-800">
                  By claiming this profile, you verify that you are an authorized representative of <strong>{school.name}</strong>. Provide the required information below to initiate the verification process.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" /> Full Name
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Your legal name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" /> Official Email Address
                  </label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="director@school.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" /> Phone Number
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="+268 7600 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-slate-400" /> Role at School
                  </label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Principal, Owner, Director"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Additional Information (Optional)</label>
                  <textarea 
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder="Provide any additional details to help verify your ownership, such as a link to the school's official website listing you as staff."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>
              </div>

            </form>
          )}
        </div>

        {!success && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
            <Button variant="outline" type="button" onClick={onClose} disabled={saving} className="rounded-xl font-bold bg-white drop-shadow-sm border-slate-200 text-slate-700">
              Cancel
            </Button>
            <Button type="submit" form="claim-form" disabled={saving} className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/20">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
              Submit Verification Request
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

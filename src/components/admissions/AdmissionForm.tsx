import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, ChevronRight, ChevronLeft, Upload, FileText, X } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { createDocument } from "@/lib/firestoreUtils";
import { Application, ApplicationStatus } from "@/types";

interface AdmissionFormProps {
  schoolId: string;
  schoolName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AdmissionForm({ schoolId, schoolName, onSuccess, onCancel }: AdmissionFormProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<{name: string, type: string}[]>([]);
  
  const [formData, setFormData] = useState<Partial<Application>>({
    childName: "",
    childDateOfBirth: "",
    gender: "Male" as any,
    proposedStartDate: "",
    gradeApplyingFor: "",
    parentName: user?.name || "",
    parentEmail: user?.email || "",
    parentPhone: "",
    address: "",
    medicalInfo: "",
    documents: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles(prev => [...prev, { name: file.name, type: file.type }]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const applicationData = {
        ...formData,
        schoolId,
        parentId: user.uid,
        status: "submitted" as ApplicationStatus,
        documents: files.map(f => ({ name: f.name, type: "other", url: "#" })), // Mock URLs
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await createDocument("applications", null, applicationData);
      
      // Also create a notification for the parent
      await createDocument("notifications", null, {
        userId: user.uid,
        schoolId,
        title: "Application Submitted",
        message: `Your application for ${formData.childName} to ${schoolName} has been successfully submitted.`,
        type: "admission_update",
        read: false,
        createdAt: new Date().toISOString()
      });

      onSuccess();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] w-full max-w-2xl">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Admission Application</h2>
          <p className="text-xs text-slate-500 font-medium">Applying to: {schoolName}</p>
        </div>
        <div className="flex items-center gap-2">
           {[1, 2, 3].map(i => (
             <div key={i} className={`h-2 w-8 rounded-full transition-colors ${step >= i ? 'bg-blue-600' : 'bg-slate-200'}`} />
           ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <form id="admission-form" onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center">1</span>
                Child's Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="childName">Child's Full Name</Label>
                  <Input 
                    id="childName" 
                    name="childName" 
                    required 
                    value={formData.childName} 
                    onChange={handleChange} 
                    placeholder="e.g. Sipho Dlamini"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childDateOfBirth">Date of Birth</Label>
                  <Input 
                    id="childDateOfBirth" 
                    name="childDateOfBirth" 
                    type="date" 
                    required 
                    value={formData.childDateOfBirth} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select 
                    id="gender" 
                    name="gender" 
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    value={formData.gender} 
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gradeApplyingFor">Grade / Program Applying For</Label>
                  <Input 
                    id="gradeApplyingFor" 
                    name="gradeApplyingFor" 
                    required 
                    value={formData.gradeApplyingFor} 
                    onChange={handleChange} 
                    placeholder="e.g. Pre-Primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proposedStartDate">Proposed Start Date</Label>
                  <Input 
                    id="proposedStartDate" 
                    name="proposedStartDate" 
                    type="date" 
                    required 
                    value={formData.proposedStartDate} 
                    onChange={handleChange} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalInfo">Known Medical Conditions or Allergies</Label>
                <textarea 
                   id="medicalInfo" 
                   name="medicalInfo" 
                   className="w-full rounded-md border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none" 
                   rows={3} 
                   value={formData.medicalInfo} 
                   onChange={handleChange}
                   placeholder="e.g. Asthma, Peanuts allergy..."
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center">2</span>
                Parent / Guardian Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="parentName">Full Name</Label>
                  <Input 
                    id="parentName" 
                    name="parentName" 
                    required 
                    value={formData.parentName} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentEmail">Email Address</Label>
                  <Input 
                    id="parentEmail" 
                    name="parentEmail" 
                    type="email" 
                    required 
                    value={formData.parentEmail} 
                    onChange={handleChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Contact Number</Label>
                  <Input 
                    id="parentPhone" 
                    name="parentPhone" 
                    required 
                    value={formData.parentPhone} 
                    onChange={handleChange} 
                    placeholder="e.g. +268 7600 0000"
                  />
                </div>
                <div className="col-span-1 sm:col-span-2 space-y-2">
                  <Label htmlFor="address">Residential Address</Label>
                  <textarea 
                    id="address" 
                    name="address" 
                    className="w-full rounded-md border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none" 
                    rows={2} 
                    required
                    value={formData.address} 
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center">3</span>
                Required Documents
              </h3>
              
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                 <p className="text-sm text-blue-800 leading-snug">
                   Please upload copies of the child's birth certificate and immunization records.
                 </p>
              </div>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer relative">
                   <input 
                    type="file" 
                    accept="image/*,application/pdf"
                    capture="environment"
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    multiple 
                    onChange={handleFileChange}
                   />
                   <Upload className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                   <p className="text-sm font-bold text-slate-700">Click or drag files to upload</p>
                   <p className="text-xs text-slate-400 mt-1">PDF, JPG, or PNG (Max 5MB each)</p>
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-white shadow-sm">
                        <div className="flex items-center gap-3">
                           <FileText className="h-4 w-4 text-blue-600" />
                           <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{file.name}</span>
                        </div>
                        <button type="button" onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-600">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-start gap-3">
                  <input type="checkbox" required className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                  <p className="text-xs text-slate-500 leading-normal">
                    I hereby certify that the information provided is true and correct. I understand that any false information may lead to the disqualification of this application.
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
        <Button variant="ghost" type="button" onClick={step === 1 ? onCancel : prevStep} disabled={loading}>
          {step === 1 ? "Cancel" : <><ChevronLeft className="mr-2 h-4 w-4" /> Previous</>}
        </Button>
        
        {step < 3 ? (
          <Button type="button" onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
            Next Section <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            type="submit" 
            form="admission-form" 
            className="bg-green-600 hover:bg-green-700 min-w-[140px]"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><CheckCircle2 className="mr-2 h-4 w-4" /> Submit Application</>}
          </Button>
        )}
      </div>
    </div>
  );
}

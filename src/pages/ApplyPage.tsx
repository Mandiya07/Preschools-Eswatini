import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CheckCircle, GraduationCap, MapPin } from "lucide-react";
import { createDocument, fetchDocument, fetchCollection } from "@/lib/firestoreUtils";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { School } from "@/types";

export function ApplyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const schoolId = searchParams.get("schoolId");
  
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    schoolId: schoolId || "",
    childName: "",
    childAge: "",
    parentName: user?.name || "",
    parentEmail: user?.email || "",
    parentPhone: "",
    message: "",
    status: "submitted"
  });

  useEffect(() => {
    async function init() {
      try {
        const allSchools = await fetchCollection("schools") as School[];
        setSchools(allSchools || []);
        
        if (schoolId) {
          const school = await fetchDocument("schools", schoolId) as School;
          setSelectedSchool(school);
          setFormData(prev => ({ ...prev, schoolId }));
        }
      } catch (err) {
        console.error("Failed to load school data", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [schoolId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    if (id === "schoolId") {
      const school = schools.find(s => s.id === value);
      setSelectedSchool(school || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.schoolId) {
      toast.error("Please select a school.");
      return;
    }
    
    setSubmitting(true);
    try {
      await createDocument("applications", null, {
        ...formData,
        userId: user?.uid || null,
        gradeApplyingFor: formData.childAge, // Mapping childAge to gradeApplyingFor
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setSuccess(true);
      toast.success("Application submitted successfully!");
    } catch (err) {
      console.error("Submission failed", err);
      toast.error("Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <div className="h-20 w-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Application Sent!</h1>
        <p className="text-slate-600 mb-8">
          Your application for <strong>{selectedSchool?.name}</strong> has been received. 
          The school's admissions team will contact you soon.
        </p>
        <Button onClick={() => navigate("/directory")} className="w-full h-12 bg-blue-600 text-white rounded-xl">
          Browse More Schools
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <SEO title="Apply for Admission | Preschools Eswatini" />
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="border-none shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-blue-600 text-white p-8">
              <CardTitle className="text-2xl font-black tracking-tight">Admission Application</CardTitle>
              <CardDescription className="text-blue-100 italic">Complete the form below to apply to your chosen preschool.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="schoolId">Target School</Label>
                  <select 
                    id="schoolId"
                    className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white transition-all outline-none text-sm h-11"
                    value={formData.schoolId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a school...</option>
                    {schools.map(s => (
                      <option key={s.id} value={s.id}>{s.name} - {s.town}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="childName">Child's Full Name</Label>
                    <Input id="childName" required value={formData.childName} onChange={handleChange} placeholder="John Dlamini" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="childAge">Child's Age / Grade</Label>
                    <Input id="childAge" required value={formData.childAge} onChange={handleChange} placeholder="e.g. 4 years / Grade 0" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Parent/Guardian Name</Label>
                    <Input id="parentName" required value={formData.parentName} onChange={handleChange} placeholder="Jane Dlamini" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentPhone">Phone Number</Label>
                    <Input id="parentPhone" type="tel" required value={formData.parentPhone} onChange={handleChange} placeholder="+268 ..." />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentEmail">Preferred Email</Label>
                  <Input id="parentEmail" type="email" required value={formData.parentEmail} onChange={handleChange} placeholder="jane@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Note to School (Optional)</Label>
                  <Textarea id="message" value={formData.message} onChange={handleChange} placeholder="Specific needs, questions, or info..." className="min-h-[100px]" />
                </div>

                <Button type="submit" disabled={submitting} className="w-full h-12 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 font-bold">
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-slate-900 text-white p-6">
             {selectedSchool ? (
               <div className="space-y-4">
                 <div className="h-40 -mx-6 -mt-6 bg-slate-800 overflow-hidden">
                   <img src={selectedSchool.heroImage} className="w-full h-full object-cover" alt="" />
                 </div>
                 <div>
                   <h3 className="font-black text-xl italic">{selectedSchool.name}</h3>
                   <div className="flex items-center gap-2 text-slate-400 text-xs mt-1">
                      <MapPin className="h-3 w-3" /> {selectedSchool.town}, {selectedSchool.region}
                   </div>
                 </div>
                 <div className="space-y-2 py-4 border-y border-white/10">
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-400">Curriculum</span>
                       <span className="font-bold">{selectedSchool.curriculum}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-400">Fees / Term</span>
                       <span className="font-bold text-green-400">E{selectedSchool.feePerTerm}</span>
                    </div>
                 </div>
                 <div className="p-4 bg-white/5 rounded-xl text-xs flex items-start gap-2">
                    <GraduationCap className="h-4 w-4 text-blue-400 mt-0.5" />
                    <p className="text-slate-300">This application will be sent directly to the school's admin dashbord.</p>
                 </div>
               </div>
             ) : (
               <div className="text-center py-12">
                 <GraduationCap className="h-12 w-12 mx-auto mb-4 text-blue-500 opacity-20" />
                 <p className="text-slate-400 italic">Select a school to see details</p>
               </div>
             )}
          </Card>
          
          <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-900 space-y-3">
             <h4 className="font-bold uppercase tracking-widest text-[10px]">Important Information</h4>
             <p>Schools typically respond within 3-5 working days. Ensure your contact details are correct as they may call you for a tour.</p>
             <p>Applying through Preschools Eswatini is free. Schools should not ask for 'application fees' without a formal invoice.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { createDocument } from "@/lib/firestoreUtils";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

export function RegisterSchoolPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    schoolName: "",
    principalName: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createDocument("school_registrations", null, {
        ...formData,
        userId: user?.uid || null,
        status: "pending",
        createdAt: new Date().toISOString()
      });
      setSubmitted(true);
      toast.success("Application submitted successfully! Our team will review it soon.");
    } catch (err) {
      console.error("Failed to submit registration", err);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <SEO title="Register School | Sikolo Platform" />
      
      {submitted ? (
        <div className="text-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h1 className="text-3xl font-bold mb-4 text-green-600">Application Submitted!</h1>
          <p className="text-slate-600">Thank you for registering your school. Our team will review your application and get back to you within 48 hours.</p>
          <Button className="mt-6" onClick={() => setSubmitted(false)}>Back to Form</Button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Register Your School</h1>
            <p className="text-slate-600 mt-2">Join the Sikolo platform and start digitizing your preschool's operations.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name</Label>
                <Input id="schoolName" required value={formData.schoolName} onChange={handleChange} placeholder="Enter school name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="principalName">Principal Name</Label>
                <Input id="principalName" required value={formData.principalName} onChange={handleChange} placeholder="Enter principal name" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" required value={formData.email} onChange={handleChange} placeholder="school@example.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" required value={formData.phone} onChange={handleChange} placeholder="+268 ..." />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Additional Information</Label>
              <Textarea id="message" value={formData.message} onChange={handleChange} placeholder="Tell us more about your school..." />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit Application"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

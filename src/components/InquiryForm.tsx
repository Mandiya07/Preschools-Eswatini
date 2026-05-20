import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2 } from "lucide-react";
import { createDocument } from "@/lib/firestoreUtils";
import { logAudit, AuditAction } from "@/lib/auditLogger";
import { useAuth } from "@/lib/AuthContext";

const inquirySchema = z.object({
  childName: z.string().min(2, "Child's name is required"),
  childAge: z.string().min(1, "Child's age is required"),
  parentName: z.string().min(2, "Parent's name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Valid phone number is required"),
  message: z.string().min(10, "Please provide some more details (min 10 chars)"),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
  schoolId: string;
  schoolName?: string;
  adminEmail?: string;
  onSuccess?: () => void;
}

export function InquiryForm({ schoolId, schoolName, adminEmail, onSuccess }: InquiryFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      parentName: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: InquiryFormValues) => {
    setIsSubmitting(true);
    try {
      const inquiryData = {
        ...data,
        schoolId,
        parentId: user?.uid || "anonymous",
        status: "New",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const newInquiryId = await createDocument("inquiries", null, inquiryData);
      
      // Send notification to school admin via API
      try {
        await fetch("/api/notify-admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            schoolId,
            schoolName: schoolName || "Your School",
            adminEmail: adminEmail || "",
            inquiryData
          })
        });
      } catch (notifyErr) {
        console.error("Notification API failed:", notifyErr);
        // We don't block the user success experience if notification fails
      }

      // Log the action for enterprise auditing
      if (user) {
        await logAudit(AuditAction.CREATE_DOCUMENT, 'inquiries', newInquiryId, {
          schoolId,
          type: "inquiry"
        });
      }

      setIsSuccess(true);
      reset();
      if (onSuccess) setTimeout(onSuccess, 2000);
    } catch (error) {
      console.error("Inquiry Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8 bg-green-50 rounded-xl border border-green-100">
        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-green-900">Inquiry Sent!</h3>
        <p className="text-green-700">The school will contact you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Child's Name</label>
          <Input {...register("childName")} placeholder="Full Name" />
          {errors.childName && <p className="text-[10px] text-red-500">{errors.childName.message}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Child's Age / Year Group</label>
          <Input {...register("childAge")} placeholder="e.g. 3 years" />
          {errors.childAge && <p className="text-[10px] text-red-500">{errors.childAge.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700">Parent's Name</label>
        <Input {...register("parentName")} placeholder="Full Name" />
        {errors.parentName && <p className="text-[10px] text-red-500">{errors.parentName.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Email Address</label>
          <Input {...register("email")} type="email" placeholder="email@example.com" />
          {errors.email && <p className="text-[10px] text-red-500">{errors.email.message}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Phone Number</label>
          <Input {...register("phone")} placeholder="+268 7600 0000" />
          {errors.phone && <p className="text-[10px] text-red-500">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700">Message / Questions</label>
        <textarea
          {...register("message")}
          className="w-full rounded-md border border-slate-200 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
          rows={3}
          placeholder="I'd like to schedule a tour..."
        ></textarea>
        {errors.message && <p className="text-[10px] text-red-500">{errors.message.message}</p>}
      </div>

      <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isSubmitting ? "Sending..." : "Submit Inquiry"}
      </Button>
    </form>
  );
}

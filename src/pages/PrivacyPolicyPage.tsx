import { SEO } from "@/components/SEO";

export function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <SEO title="Privacy Policy | Sikolo Platform" />
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Privacy Policy</h1>
      
      <div className="prose prose-slate max-w-none text-slate-600">
        <p>At Sikolo, we take your privacy seriously. This privacy policy explains how we collect, use, and protect your information when you use our platform.</p>
        
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create an account, update your school profile, or communicate with our support team.</p>
        
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">How We Use Your Information</h2>
        <p>We use your information to operate, maintain, and provide the features of the Sikolo platform, and to communicate with you regarding your school's account and updates.</p>
        
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Security</h2>
        <p>We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure.</p>
      </div>
    </div>
  );
}

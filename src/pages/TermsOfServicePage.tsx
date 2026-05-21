import { SEO } from "@/components/SEO";

export function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <SEO title="Terms of Service | Preschools Eswatini Platform" />
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Terms of Service</h1>
      
      <div className="prose prose-slate max-w-none text-slate-600">
        <p>By accessing or using the Preschools Eswatini platform, you agree to be bound by these terms of service.</p>
        
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Account Responsibilities</h2>
        <p>You are responsible for maintaining the security of your account and for all activities that occur under your account.</p>
        
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Acceptable Use</h2>
        <p>You agree not to use the platform for any unlawful purpose or to interfere with the operation of the service.</p>
        
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Modification of Terms</h2>
        <p>We may modify these terms at any time. Your continued use of the platform constitutes your agreement to the modified terms.</p>
      </div>
    </div>
  );
}

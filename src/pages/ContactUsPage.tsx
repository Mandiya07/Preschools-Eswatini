import { SEO } from "@/components/SEO";
import { Mail, Phone, MapPin } from "lucide-react";

export function ContactUsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <SEO title="Contact Us | Preschools Eswatini Platform" />
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Get in Touch</h1>
        <p className="mt-4 text-xl text-slate-600">We'd love to hear from you. Reach out for support or inquiries.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
          <Mail className="h-8 w-8 mx-auto text-blue-600 mb-4" />
          <h3 className="font-bold text-lg mb-2">Email</h3>
          <p className="text-slate-600">support@preschoolseswatini.com</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
          <Phone className="h-8 w-8 mx-auto text-blue-600 mb-4" />
          <h3 className="font-bold text-lg mb-2">WhatsApp</h3>
          <p className="text-slate-600">+268 7600 0000</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
          <MapPin className="h-8 w-8 mx-auto text-blue-600 mb-4" />
          <h3 className="font-bold text-lg mb-2">Office</h3>
          <p className="text-slate-600">Mbabane, Eswatini</p>
        </div>
      </div>
    </div>
  );
}

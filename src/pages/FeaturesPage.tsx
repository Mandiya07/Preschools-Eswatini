import { 
  Building2, 
  Globe, 
  Users, 
  Laptop, 
  MessageSquare, 
  Smartphone, 
  Shield, 
  BarChart3, 
  FileText,
  Calendar,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function FeaturesPage() {
  return (
    <div className="bg-white pb-24">
      {/* Header */}
      <div className="bg-blue-600 py-20 px-4 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Everything your school needs to succeed online
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-blue-100">
            A comprehensive suite of tools designed specifically for preschools, daycares, and early childhood centers in Eswatini and beyond.
          </p>
          <div className="mt-10">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-50 h-14 px-8 text-lg" asChild>
              <Link to="/register">Create Your Free Account</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
        <div className="space-y-24">
          
          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-6">
                <Globe className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Instant Website Builder</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Say goodbye to expensive web developers. Launch a beautiful, professional, and mobile-responsive website in minutes using our premium marketplace templates. Update your gallery, news, and programs anytime without writing a single line of code.
              </p>
              <ul className="space-y-3">
                {['Drag-and-drop editor', 'Premium education templates', 'Built-in gallery management', 'Automatic mobile optimization'].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-700">
                    <div className="mr-3 h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-100 rounded-2xl p-8 border border-slate-200 shadow-inner">
               <div className="aspect-video bg-white rounded-lg border border-slate-200 shadow-md overflow-hidden flex flex-col">
                  <div className="bg-slate-50 h-8 border-b border-slate-200 flex items-center px-3 gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 bg-slate-900 flex items-center justify-center relative">
                    <Globe className="h-12 w-12 text-slate-700" />
                    <div className="absolute top-4 left-4 right-4 h-4 bg-slate-800 rounded"></div>
                    <div className="absolute top-12 left-4 w-1/2 h-4 bg-slate-800 rounded"></div>
                  </div>
               </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 bg-slate-100 rounded-2xl p-8 border border-slate-200 shadow-inner">
               <div className="aspect-video bg-white rounded-lg border border-slate-200 shadow-md overflow-hidden flex">
                  <div className="w-1/4 bg-slate-50 border-r border-slate-200 p-2 space-y-2">
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                    <div className="h-2 bg-slate-200 rounded w-4/5"></div>
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                  </div>
                  <div className="flex-1 p-4 flex flex-col gap-3">
                    <div className="h-8 bg-blue-50 rounded border border-blue-100 flex items-center px-2">
                      <span className="text-[8px] font-medium text-blue-700">New Application Received</span>
                    </div>
                    <div className="flex-1 bg-slate-50 rounded border border-slate-100 p-2">
                      <div className="h-2 bg-slate-200 rounded w-1/3 mb-2"></div>
                      <div className="h-2 bg-slate-200 rounded w-1/4"></div>
                    </div>
                  </div>
               </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-6">
                <FileText className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Online Admissions System</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Replace messy paper forms with a streamlined digital enrollment process. Parents can apply from their phones, upload required documents securely, and receive automated status updates.
              </p>
              <ul className="space-y-3">
                {['Customizable application forms', 'Digital document uploads (Birth certs, etc)', 'Waitlist management', 'Automated email confirmations'].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-700">
                    <div className="mr-3 h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 mb-6">
                <Laptop className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Complete Admin Dashboard</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Run your entire school from one secure place. Manage student records, class assignments, attendance, and staff accounts with an intuitive interface designed for school principals and administrators.
              </p>
              <ul className="space-y-3">
                {['Centralized student database', 'Staff permission levels', 'Attendance tracking', 'Medical and emergency info access'].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-700">
                    <div className="mr-3 h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-100 rounded-2xl p-8 border border-slate-200 shadow-inner">
              <div className="grid grid-cols-2 gap-4">
                 {[Users, BarChart3, Calendar, Shield].map((Icon, i) => (
                   <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col items-center justify-center aspect-square shadow-sm">
                      <Icon className="h-8 w-8 text-blue-600 mb-2" />
                      <div className="h-2 w-12 bg-slate-200 rounded"></div>
                   </div>
                 ))}
              </div>
            </div>
          </div>

        </div>

        {/* Other Features Grid */}
        <div className="mt-24 pt-16 border-t border-slate-200">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Plus everything else you need</h2>
            <p className="mt-4 text-slate-600">A comprehensive set of tools to power every aspect of your institution.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 border border-slate-200 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all group">
              <MessageSquare className="h-10 w-10 text-blue-600 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3 text-slate-900">Parent Portal</h3>
              <p className="text-slate-600 font-medium">Secure access for parents to view student progress, attendance, and communicate with teachers.</p>
            </div>
            <div className="p-8 border border-slate-200 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all group">
              <BarChart3 className="h-10 w-10 text-emerald-600 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3 text-slate-900">Finance Management</h3>
              <p className="text-slate-600 font-medium">Advanced financial module for fee management, invoicing, expense tracking, and payroll.</p>
            </div>
            <div className="p-8 border border-slate-200 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all group">
              <FileText className="h-10 w-10 text-amber-600 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3 text-slate-900">Document Management</h3>
              <p className="text-slate-600 font-medium">Centralized secure archive for school records, student documents, and certificates.</p>
            </div>
            <div className="p-8 border border-slate-200 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all group">
              <Laptop className="h-10 w-10 text-purple-600 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3 text-slate-900">Content & Publishing</h3>
              <p className="text-slate-600 font-medium">Publish school blogs, digital magazines, event streams, and comprehensive newsletters.</p>
            </div>
            <div className="p-8 border border-slate-200 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all group">
               <Laptop className="h-10 w-10 text-indigo-600 mb-6 group-hover:scale-110 transition-transform" />
               <h3 className="text-xl font-bold mb-3 text-slate-900">E-Learning & AI Tools</h3>
               <p className="text-slate-600 font-medium">Empower learning with digital resources and AI-driven insights for automated grading and feedback.</p>
            </div>
            <div className="p-8 border border-slate-200 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all group">
               <Smartphone className="h-10 w-10 text-pink-600 mb-6 group-hover:scale-110 transition-transform" />
               <h3 className="text-xl font-bold mb-3 text-slate-900">Health & Compliance</h3>
               <p className="text-slate-600 font-medium">Track strict daily health logs, manage HR incidents, and ensure national compliance efficiently.</p>
            </div>
            <div className="p-8 border border-slate-200 rounded-3xl bg-amber-50/50 hover:bg-white hover:shadow-xl transition-all group border-dashed border-amber-300">
               <Heart className="h-10 w-10 text-amber-600 mb-6 group-hover:scale-110 transition-transform" />
               <h3 className="text-xl font-bold mb-3 text-slate-900 flex items-center gap-2">
                 Neighborhood Care <span className="bg-amber-100 text-amber-800 text-[10px] uppercase px-1.5 py-0.5 rounded-full font-black">Free</span>
               </h3>
               <p className="text-slate-600 font-medium">Access zero-subscription matching for home-based carers, au pairs, and registered backyard pre-primary daycare flatlets in Eswatini corridors.</p>
            </div>
            <div className="p-8 border border-slate-200 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-xl transition-all group md:col-span-3 lg:col-span-1 lg:col-start-2">
              <Building2 className="h-10 w-10 text-orange-600 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3 text-slate-900">Supplier Marketplace</h3>
              <p className="text-slate-600 font-medium">Discover verified educational suppliers, issue tenders, and request quotes for your school's needs.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

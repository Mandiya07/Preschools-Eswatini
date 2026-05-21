import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5 lg:gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Preschools<span className="text-blue-600">Eswatini</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-xs">
              Modernizing early childhood education in The Kingdom of Eswatini through digital innovation.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">For Parents</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/map" className="hover:text-blue-600 border border-amber-200 bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-xs font-semibold inline-block mb-1">Smart Map Locator</Link></li>
              <li><Link to="/directory" className="hover:text-blue-600">Find a Preschool</Link></li>
              <li><Link to="/apply" className="hover:text-blue-600">Online Applications</Link></li>
              <li><Link to="/blog" className="text-blue-600 font-semibold hover:text-blue-700">How Parents Benefit</Link></li>
              <li><Link to="/blog" className="hover:text-blue-600">Choose a Preschool</Link></li>
              <li><Link to="/faq" className="hover:text-blue-600">Parent FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">For Schools</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/features" className="hover:text-blue-600">Platform Features</Link></li>
              <li><Link to="/pricing" className="hover:text-blue-600">Pricing Plans</Link></li>
              <li><Link to="/website-builder" className="hover:text-blue-600">Website Builder</Link></li>
              <li><Link to="/blog" className="text-blue-600 font-semibold hover:text-blue-700">How to Register</Link></li>
              <li><Link to="/blog" className="hover:text-blue-600">Teacher Benefits</Link></li>
              <li><Link to="/admin" className="hover:text-blue-600">School Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Platform Features</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/insights" className="hover:text-blue-600 border border-blue-200 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-semibold inline-block mb-1">National Data Platform</Link></li>
              <li><Link to="/marketplace" className="hover:text-blue-600">Marketplace</Link></li>
              <li><Link to="/learning" className="hover:text-blue-600">Learning Ecosystem</Link></li>
              <li><Link to="/community" className="hover:text-blue-600">Community</Link></li>
              <li><Link to="/safety" className="hover:text-blue-600">Safety & Security</Link></li>
              <li><Link to="/advanced-features" className="hover:text-blue-600">Advanced Features</Link></li>
              <li><Link to="/blog" className="hover:text-blue-600">Supplier Onboarding</Link></li>
              <li><Link to="/marketing" className="hover:text-blue-600">Marketing Tools</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Connect</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link to="/blog" className="font-bold text-blue-600 hover:text-blue-700">Guides & Articles</Link></li>
              <li><Link to="/contact" className="hover:text-blue-600">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-blue-600">About the Platform</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-600">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-200 pt-8 md:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Preschools Eswatini. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            {/* Social Links would go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(true);
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md overflow-x-hidden">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 lg:gap-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-100">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Preschools<span className="text-blue-600"> Eswatini</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-6 xl:gap-8">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap">Home</Link>
            <Link to="/directory" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap">Find a School</Link>
            {(!user || user.role === 'User' || user.role === 'Parent') && (
              <>
                <Link to="/features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap">For Schools</Link>
                <Link to="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap">Pricing</Link>
              </>
            )}
            <Link to="/resources" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap">Resources</Link>
            <Link to="/marketplace" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap">Marketplace</Link>
            <Link to="/learning" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap">Learning</Link>
            <Link to="/community" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap">Community</Link>
          </div>
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          {user ? (
             <>
               {user.role === 'SuperAdmin' && (
                 <Button variant="ghost" asChild className="text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl">
                   <Link to="/super"><ShieldCheck className="h-4 w-4 mr-2" /> Platform Admin</Link>
                 </Button>
               )}
               {user.role === 'SchoolAdmin' && (
                 <Button variant="ghost" asChild className="text-sm font-medium text-blue-600 rounded-xl hover:bg-blue-50">
                   <Link to="/admin"><LayoutDashboard className="h-4 w-4 mr-2" /> School Dashboard</Link>
                 </Button>
               )}
               {user.role === 'Parent' && (
                 <Button variant="ghost" asChild className="text-sm font-medium text-blue-600 rounded-xl hover:bg-blue-50">
                   <Link to="/parent"><LayoutDashboard className="h-4 w-4 mr-2" /> Parent Portal</Link>
                 </Button>
               )}
               {user.role === 'Supplier' && (
                 <Button variant="ghost" asChild className="text-sm font-medium text-blue-600 rounded-xl hover:bg-blue-50">
                   <Link to="/supplier"><LayoutDashboard className="h-4 w-4 mr-2" /> Supplier Portal</Link>
                 </Button>
               )}
               {user.role === 'Advertiser' && (
                 <Button variant="ghost" asChild className="text-sm font-medium text-blue-600 rounded-xl hover:bg-blue-50">
                   <Link to="/advertiser"><LayoutDashboard className="h-4 w-4 mr-2" /> Ads Portal</Link>
                 </Button>
               )}
               <Button variant="ghost" onClick={logout} className="text-sm font-medium text-slate-500 hover:text-red-600 rounded-xl">
                 Log Out
               </Button>
             </>
          ) : (
            <>
              <Button variant="ghost" asChild className="text-sm font-medium text-slate-600 hover:text-slate-900 rounded-xl">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm px-5 h-9">
                <Link to="/register">Register School</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 overflow-x-hidden">
          <div className="flex flex-col space-y-2">
            <Link to="/" className="text-sm font-medium text-slate-600 py-3 block hover:text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/directory" className="text-sm font-medium text-slate-600 py-3 block hover:text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Find a School</Link>
            {(!user || user.role === 'User' || user.role === 'Parent') && (
              <>
                <Link to="/features" className="text-sm font-medium text-slate-600 py-3 block hover:text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>For Schools</Link>
                <Link to="/pricing" className="text-sm font-medium text-slate-600 py-3 block hover:text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
              </>
            )}
            <Link to="/resources" className="text-sm font-medium text-slate-600 py-3 block hover:text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Resources</Link>
            <Link to="/marketplace" className="text-sm font-medium text-slate-600 py-3 block hover:text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Marketplace</Link>
            <Link to="/learning" className="text-sm font-medium text-slate-600 py-3 block hover:text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Learning</Link>
            <Link to="/community" className="text-sm font-medium text-slate-600 py-3 block hover:text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Community</Link>
            <div className="flex flex-col space-y-2 pt-4 border-t border-slate-100">
                  {user ? (
                    <>
                      <Button className="w-full justify-center rounded-xl bg-blue-600 font-medium" asChild>
                        <Link to={user.role === 'SuperAdmin' ? '/super' : user.role === 'SchoolAdmin' ? '/admin' : user.role === 'Supplier' ? '/supplier' : user.role === 'Advertiser' ? '/advertiser' : '/parent'} onClick={() => setIsMobileMenuOpen(false)}>
                           Go to Dashboard
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-center rounded-xl border-slate-200 text-slate-600 font-medium" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                        Log Out
                      </Button>
                    </>
                  ) : (
                <>
                  <Button className="w-full justify-center rounded-xl bg-blue-600 font-medium shadow-sm" asChild>
                    <Link to={showSignIn ? "/login" : "/register"} onClick={() => setIsMobileMenuOpen(false)}>
                      {showSignIn ? "Sign In" : "Register School"}
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-center mt-2 text-sm text-slate-500 font-medium hover:text-slate-900" onClick={() => setShowSignIn(!showSignIn)}>
                    {showSignIn ? "Register a school instead?" : "Already have an account? Sign In"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

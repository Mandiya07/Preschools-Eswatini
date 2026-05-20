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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-100">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 uppercase">
              Preschools<span className="text-blue-600"> Eswatini</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-3 xl:gap-4">
            <Link to="/" className="text-[11px] font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest">Home</Link>
            <Link to="/directory" className="text-[11px] font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest">Find a School</Link>
            {(!user || user.role === 'User' || user.role === 'Parent') && (
              <>
                <Link to="/features" className="text-[11px] font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest">For Schools</Link>
                <Link to="/pricing" className="text-[11px] font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest">Pricing</Link>
              </>
            )}
            <Link to="/marketplace" className="text-[11px] font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest">Marketplace</Link>
            <Link to="/learning" className="text-[11px] font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest">Learning</Link>
            <Link to="/community" className="text-[11px] font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-widest">Community</Link>
          </div>
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          {user ? (
             <>
               {user.role === 'SuperAdmin' && (
                 <Button variant="ghost" asChild className="text-[11px] text-blue-600 font-black hover:bg-blue-50 rounded-xl">
                   <Link to="/super"><ShieldCheck className="h-4 w-4 mr-2" /> Platform Admin</Link>
                 </Button>
               )}
               {user.role === 'SchoolAdmin' && (
                 <Button variant="ghost" asChild className="text-[11px] text-blue-600 font-bold">
                   <Link to="/admin"><LayoutDashboard className="h-4 w-4 mr-2" /> School Dashboard</Link>
                 </Button>
               )}
               {user.role === 'Parent' && (
                 <Button variant="ghost" asChild className="text-[11px] text-blue-600 font-bold">
                   <Link to="/parent"><LayoutDashboard className="h-4 w-4 mr-2" /> Parent Portal</Link>
                 </Button>
               )}
               {user.role === 'Supplier' && (
                 <Button variant="ghost" asChild className="text-[11px] text-blue-600 font-bold">
                   <Link to="/supplier"><LayoutDashboard className="h-4 w-4 mr-2" /> Supplier Portal</Link>
                 </Button>
               )}
               {user.role === 'Advertiser' && (
                 <Button variant="ghost" asChild className="text-[11px] text-blue-600 font-bold">
                   <Link to="/advertiser"><LayoutDashboard className="h-4 w-4 mr-2" /> Ads Portal</Link>
                 </Button>
               )}
               <Button variant="ghost" onClick={logout} className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase">
                 Log Out
               </Button>
             </>
          ) : (
            <>
              <Button variant="ghost" asChild className="text-sm font-bold text-slate-600">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className="text-[11px] bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-100 font-black uppercase tracking-tighter cursor-pointer px-4 h-9">
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
          <div className="flex flex-col space-y-4">
            <Link to="/" className="text-xs font-bold text-slate-600 uppercase tracking-widest py-3 block" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/directory" className="text-xs font-bold text-slate-600 uppercase tracking-widest py-3 block" onClick={() => setIsMobileMenuOpen(false)}>Find a School</Link>
            {(!user || user.role === 'User' || user.role === 'Parent') && (
              <>
                <Link to="/features" className="text-xs font-bold text-slate-600 uppercase tracking-widest py-3 block" onClick={() => setIsMobileMenuOpen(false)}>For Schools</Link>
                <Link to="/pricing" className="text-xs font-bold text-slate-600 uppercase tracking-widest py-3 block" onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
              </>
            )}
            <Link to="/marketplace" className="text-xs font-bold text-slate-600 uppercase tracking-widest py-3 block" onClick={() => setIsMobileMenuOpen(false)}>Marketplace</Link>
            <Link to="/learning" className="text-xs font-bold text-slate-600 uppercase tracking-widest py-3 block" onClick={() => setIsMobileMenuOpen(false)}>Learning</Link>
            <Link to="/community" className="text-xs font-bold text-slate-600 uppercase tracking-widest py-3 block" onClick={() => setIsMobileMenuOpen(false)}>Community</Link>
            <div className="flex flex-col space-y-2 pt-4 border-t border-slate-100">
                  {user ? (
                    <>
                      <Button className="w-full justify-center rounded-xl bg-blue-600 font-black" asChild>
                        <Link to={user.role === 'SuperAdmin' ? '/super' : user.role === 'SchoolAdmin' ? '/admin' : user.role === 'Supplier' ? '/supplier' : user.role === 'Advertiser' ? '/advertiser' : '/parent'} onClick={() => setIsMobileMenuOpen(false)}>
                           Go to Dashboard
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-center rounded-xl border-slate-200 text-slate-500 font-bold" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                        Log Out
                      </Button>
                    </>
                  ) : (
                <>
                  <Button className="w-full justify-center rounded-xl bg-blue-600 font-black shadow-lg shadow-blue-100" asChild>
                    <Link to={showSignIn ? "/login" : "/register"} onClick={() => setIsMobileMenuOpen(false)}>
                      {showSignIn ? "Sign In" : "Register School"}
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-center mt-2 text-sm text-slate-500 font-medium" onClick={() => setShowSignIn(!showSignIn)}>
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

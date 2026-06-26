import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { 
  GraduationCap, Menu, X, LayoutDashboard, ShieldCheck, Download,
  Chrome, Compass, ArrowRight, Check 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSignIn, setShowSignIn] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();

  const [isInstallDialogOpen, setIsInstallDialogOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleDirectInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  const handleInstallClick = async () => {
    if (installPrompt) {
      await handleDirectInstall();
    } else {
      setIsInstallDialogOpen(true);
    }
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const getLinkClass = (path: string) => {
    const active = isActive(path);
    return `text-[13px] font-semibold transition-all duration-200 whitespace-nowrap px-1.5 py-1.5 rounded-xl shrink-0 ${
      active 
        ? "text-blue-600 bg-blue-50/70 shadow-sm shadow-blue-500/5 font-bold" 
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
    }`;
  };

  const getMobileLinkClass = (path: string) => {
    const active = isActive(path);
    return `text-sm font-semibold py-3 px-4 block rounded-xl transition-all ${
      active 
        ? "text-blue-600 bg-blue-50/80 font-bold" 
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md overflow-x-hidden">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 gap-2">
        <div className="flex items-center gap-4 shrink-0">
          <Link to="/" className="flex items-center shrink-0">
            <Logo variant="standard" size="md" showTextOnMobile={false} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden xl:flex xl:items-center xl:gap-0.5 min-[1350px]:gap-1 flex-1 justify-center px-1">
          <Link to="/directory" className={getLinkClass("/directory")}>Find a School</Link>
          <Link to="/features" className={getLinkClass("/features")}>For Schools</Link>
          <Link to="/pricing" className={getLinkClass("/pricing")}>Pricing</Link>
          <Link to="/resources" className={getLinkClass("/resources")}>Resources</Link>
          <Link to="/blog" className={getLinkClass("/blog")}>Guides</Link>
          <Link to="/marketplace" className={getLinkClass("/marketplace")}>Marketplace</Link>
          <Link to="/learning" className={getLinkClass("/learning")}>Learning</Link>
          <Link to="/community" className={getLinkClass("/community")}>Community</Link>
          <Link to="/teacher-onboarding" className={getLinkClass("/teacher-onboarding")}>Teach</Link>
          <Link to="/flatlets" className="text-[13px] font-semibold transition-all duration-200 whitespace-nowrap px-1.5 py-1.5 rounded-xl text-indigo-700 hover:text-indigo-900 bg-indigo-50/50 hover:bg-indigo-50 shrink-0">
            ♥ Flatlets Care
          </Link>
        </div>

        <div className="hidden items-center gap-1.5 xl:flex shrink-0">
          <Button 
            variant="ghost" 
            onClick={handleInstallClick} 
            className="text-[13px] font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 border border-slate-200/40 rounded-xl flex items-center gap-1.5 h-9 px-2.5 shrink-0"
          >
            <Download className="h-3.5 w-3.5 text-blue-600" />
            <span>Install App</span>
          </Button>

          {user ? (
             <>
               {user.role === 'SuperAdmin' && (
                 <Button variant="ghost" asChild className="text-[13px] font-semibold text-blue-600 hover:bg-blue-50/55 rounded-xl px-2.5 h-9 shrink-0">
                   <Link to="/super" className="flex items-center"><ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Platform Admin</Link>
                 </Button>
               )}
               {user.role === 'SchoolAdmin' && (
                 <Button variant="ghost" asChild className="text-[13px] font-semibold text-blue-600 rounded-xl hover:bg-blue-50/55 px-2.5 h-9 shrink-0">
                   <Link to="/admin" className="flex items-center"><LayoutDashboard className="h-3.5 w-3.5 mr-1.5" /> School Dashboard</Link>
                 </Button>
               )}
               {user.role === 'Parent' && (
                 <Button variant="ghost" asChild className="text-[13px] font-semibold text-blue-600 rounded-xl hover:bg-blue-50/55 px-2.5 h-9 shrink-0">
                   <Link to="/parent" className="flex items-center"><LayoutDashboard className="h-3.5 w-3.5 mr-1.5" /> Parent Portal</Link>
                 </Button>
               )}
               {user.role === 'Supplier' && (
                 <Button variant="ghost" asChild className="text-[13px] font-semibold text-blue-600 rounded-xl hover:bg-blue-50/55 px-2.5 h-9 shrink-0">
                   <Link to="/supplier" className="flex items-center"><LayoutDashboard className="h-3.5 w-3.5 mr-1.5" /> Supplier Portal</Link>
                 </Button>
               )}
               {user.role === 'Advertiser' && (
                 <Button variant="ghost" asChild className="text-[13px] font-semibold text-blue-600 rounded-xl hover:bg-blue-50/55 px-2.5 h-9 shrink-0">
                   <Link to="/advertiser" className="flex items-center"><LayoutDashboard className="h-3.5 w-3.5 mr-1.5" /> Ads Portal</Link>
                 </Button>
               )}
               <Button variant="ghost" onClick={logout} className="text-[13px] font-semibold text-slate-500 hover:text-red-600 rounded-xl px-2 h-9 shrink-0">
                 Log Out
               </Button>
             </>
          ) : (
            <>
              <Button variant="ghost" asChild className="text-[13px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-2.5 h-9 rounded-xl shrink-0">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className="text-[13px] font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm px-3.5 h-9 shrink-0">
                <Link to="/register">Register School</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center xl:hidden shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 py-4 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 max-h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col space-y-1.5">
            <div className="bg-blue-50/50 rounded-xl p-4 mb-2 border border-blue-100/50 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
                <Download className="h-4 w-4" />
                Install the App
              </div>
              <p className="text-xs text-blue-600/80 leading-relaxed mb-1">
                Add Preschools Eswatini to your home screen for quick access and offline features.
              </p>
              <Button 
                size="sm" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-8 rounded-lg text-xs font-semibold"
                onClick={() => {
                  handleInstallClick();
                  setIsMobileMenuOpen(false);
                }}
              >
                Install App
              </Button>
            </div>
            
            <Link to="/" className={getMobileLinkClass("/")} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link to="/directory" className={getMobileLinkClass("/directory")} onClick={() => setIsMobileMenuOpen(false)}>Find a School</Link>
            <Link to="/features" className={getMobileLinkClass("/features")} onClick={() => setIsMobileMenuOpen(false)}>For Schools</Link>
            <Link to="/pricing" className={getMobileLinkClass("/pricing")} onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
            <Link to="/resources" className={getMobileLinkClass("/resources")} onClick={() => setIsMobileMenuOpen(false)}>Resources</Link>
            <Link to="/blog" className={getMobileLinkClass("/blog")} onClick={() => setIsMobileMenuOpen(false)}>Guides</Link>
            <Link to="/marketplace" className={getMobileLinkClass("/marketplace")} onClick={() => setIsMobileMenuOpen(false)}>Marketplace</Link>
            <Link to="/learning" className={getMobileLinkClass("/learning")} onClick={() => setIsMobileMenuOpen(false)}>Learning</Link>
            <Link to="/community" className={getMobileLinkClass("/community")} onClick={() => setIsMobileMenuOpen(false)}>Community</Link>
            <Link to="/teacher-onboarding" className={getMobileLinkClass("/teacher-onboarding")} onClick={() => setIsMobileMenuOpen(false)}>Teach</Link>
            <Link to="/flatlets" className="text-sm font-semibold py-3 px-4 block rounded-xl transition-all text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50" onClick={() => setIsMobileMenuOpen(false)}>
              ♥ Flatlets Care
            </Link>
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

      <Dialog open={isInstallDialogOpen} onOpenChange={setIsInstallDialogOpen}>
        <DialogContent className="max-w-xl bg-white p-0 overflow-hidden border-0 shadow-2xl">
          <div className="bg-slate-900 p-6 text-white">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl font-black flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-400" />
                Install Preschools Eswatini
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                Choose your platform to download Preschools Eswatini directly to your device.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Android Download */}
              <div className="border border-slate-100 rounded-2xl p-5 bg-white shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                    <Download className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">Android (APK)</h3>
                    <p className="text-xs text-slate-500">Android 8.0+</p>
                  </div>
                </div>
                <Button 
                  asChild
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2"
                  onClick={() => toast.success("Downloading Android APK... Check your notifications.")}
                >
                  <a href="/Preschools_Eswatini.apk" download="Preschools_Eswatini.apk">
                    <Download className="h-4 w-4" />
                    Download APK
                  </a>
                </Button>
                <div className="text-[10px] text-center text-slate-400">Version 1.0.4 • 14 MB</div>
              </div>

              {/* iOS / Web App Install */}
              <div className="border border-slate-100 rounded-2xl p-5 bg-white shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">iOS / Web App</h3>
                    <p className="text-xs text-slate-500">No App Store needed</p>
                  </div>
                </div>
                {installPrompt ? (
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2"
                    onClick={handleDirectInstall}
                  >
                    <Download className="h-4 w-4" />
                    Install Now
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold flex items-center justify-center gap-2"
                    asChild
                  >
                    <Link to="/install" onClick={() => setIsInstallDialogOpen(false)}>
                      View Install Instructions
                    </Link>
                  </Button>
                )}
                <div className="text-[10px] text-center text-slate-400">Safari PWA Profile • 3 MB</div>
              </div>
            </div>

            <div className="pt-2">
              <Button 
                variant="ghost" 
                asChild 
                className="w-full text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl py-4 text-xs font-medium flex items-center justify-center"
                onClick={() => setIsInstallDialogOpen(false)}
              >
                <Link to="/install">
                  Having trouble? View the full installation guide
                </Link>
              </Button>
            </div>
          </div>

          <DialogFooter className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
            <Button variant="ghost" onClick={() => setIsInstallDialogOpen(false)} className="rounded-xl text-slate-500 hover:bg-slate-100">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
  );
}

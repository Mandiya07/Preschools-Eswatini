import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Building2, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  Megaphone, 
  HelpCircle, 
  Settings, 
  LogOut,
  ChevronLeft,
  Search,
  Bell,
  Menu,
  X,
  LayoutDashboard,
  ShieldAlert,
  FileText,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/AuthContext";

export function SuperAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/super', icon: LayoutDashboard },
    { name: 'Schools', href: '/super/schools', icon: Building2 },
    { name: 'Subscriptions', href: '/super/subscriptions', icon: CreditCard },
    { name: 'Revenue', href: '/super/revenue', icon: BarChart3 },
    { name: 'Users', href: '/super/users', icon: Users },
    { name: 'Verification', href: '/super/verification', icon: ShieldCheck },
    { name: 'Moderation', href: '/super/moderation', icon: ShieldAlert },
    { name: 'Announcements', href: '/super/announcements', icon: Megaphone },
    { name: 'CMS', href: '/super/cms', icon: FileText },
    { name: 'Social Hub', href: '/super/social', icon: Share2 },
    { name: 'Support', href: '/super/support', icon: HelpCircle },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Off-canvas menu for mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-slate-900/80" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
               <span className="text-xl font-black text-blue-600 tracking-tighter">PLATFORM HUB</span>
               <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                 <X className="h-5 w-5" />
               </Button>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-colors ${
                      isActive ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-100">
               <Button variant="ghost" className="w-full justify-start gap-3 text-slate-600 rounded-xl" onClick={handleLogout}>
                 <LogOut className="h-5 w-5" /> Logout
               </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 relative z-20 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
           <span className={`text-xl font-black text-blue-600 tracking-tighter transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0 invisible"}`}>
             SUPER ADMIN
           </span>
           {!sidebarOpen && <ShieldCheck className="h-8 w-8 text-blue-600 mx-auto" />}
        </div>

        <nav className="sidebar-nav flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href;
            
            // Add a subtle divider before Support or Analytics-related if needed? 
            // The user requested simplification, let's keep it clean.
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-bold transition-all group ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div className={`shrink-0 transition-transform ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`}>
                   <item.icon className="h-4 w-4" />
                </div>
                {sidebarOpen && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Button 
            variant="ghost" 
            className={`w-full gap-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all ${sidebarOpen ? "justify-start" : "justify-center p-0"}`}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>

        {/* Toggle Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 shadow-sm"
        >
          <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${sidebarOpen ? "" : "rotate-180"}`} />
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 relative z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative hidden md:block">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <Input 
                 placeholder="Search platform..." 
                 className="pl-10 h-10 w-64 rounded-xl border-slate-200 bg-slate-50 focus:bg-white text-sm"
               />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-400 relative">
               <Bell className="h-5 w-5" />
               <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
            </Button>
            
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            
            <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{user?.name || "Super Administrator"}</p>
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest Ital">Platform Owner</p>
               </div>
               <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-100">
                  SA
               </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
           <div className="max-w-7xl mx-auto pb-12">
              <Outlet />
           </div>
        </main>
      </div>
    </div>
  );
}

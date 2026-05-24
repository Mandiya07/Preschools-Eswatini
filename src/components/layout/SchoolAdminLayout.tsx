import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Inbox, 
  Settings, 
  Globe, 
  Bell, 
  Search,
  Menu,
  X,
  CreditCard,
  LogOut,
  Calendar,
  Handshake,
  BarChart3,
  UserCheck,
  Briefcase,
  Megaphone,
  Sparkles,
  Store,
  Bus,
  BookOpen,
  HeartPulse,
  WifiOff,
  ShieldCheck,
  Cloud,
  CheckCircle2,
  RefreshCw,
  CloudOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Badge } from "@/components/ui/badge";

export function SchoolAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pendingSync, setPendingSync] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const checkSyncStatus = () => {
      try {
        let totalPending = 0;
        // Check for specific known queues, or we can iterate localStorage if they have a known suffix
        const attQueue = JSON.parse(localStorage.getItem('attendance_offline_queue') || '[]');
        if (Array.isArray(attQueue)) {
          totalPending += attQueue.length;
        }
        setPendingSync(totalPending);
      } catch (e) {
        // ignore
      }
    };
    
    checkSyncStatus();
    // Poll every 2 seconds to keep it updated globally
    const interval = setInterval(checkSyncStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  // If we are currently simulating Parent, this layout isn't strictly for us, but for demo we can handle it or just let the router be.
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Admissions', href: '/admin/admissions', icon: Inbox },
    { name: 'CRM & Growth', href: '/admin/crm', icon: LayoutDashboard },
    { name: 'Partnerships', href: '/admin/partnerships', icon: Handshake },
    { name: 'Students', href: '/admin/students', icon: GraduationCap },
    { name: 'Attendance', href: '/admin/attendance', icon: UserCheck },
    { name: 'Staff', href: '/admin/staff', icon: Briefcase },
    { name: 'Parents', href: '/admin/parents', icon: Users },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { name: 'Communication', href: '/admin/communication', icon: Inbox },
    { name: 'AI Tools', href: '/admin/ai-tools', icon: Sparkles },
    { name: 'Website Builder', href: '/admin/website', icon: Globe },
    { name: 'E-Learning', href: '/admin/e-learning', icon: BookOpen },
    { name: 'Transport & Fleet', href: '/admin/transport', icon: Bus },
    { name: 'Health & Daily Logs', href: '/admin/health', icon: HeartPulse },
    { name: 'HR & Facilities', href: '/admin/hr-inventory', icon: Briefcase },
    { name: 'Compliance & Ministry', href: '/admin/compliance', icon: ShieldCheck },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Student Fees', href: '/admin/finance', icon: CreditCard },
    { name: 'Subscription', href: '/admin/billing', icon: Settings },
    { name: 'Marketplace', href: '/admin/marketplace', icon: Store },
    { name: 'Supplier Portal', href: '/admin/supplier-marketplace', icon: Store },
  ];

  const switchToParent = () => {
    login("Parent");
    navigate("/parent");
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-16 items-center flex-shrink-0 px-6 bg-slate-950">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">
              Little Stars Admin
            </span>
          </Link>
          <button 
            className="ml-auto lg:hidden text-slate-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col justify-between">
        <nav className="sidebar-nav space-y-0.5">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || (location.pathname.startsWith(item.href) && item.href !== '/admin');
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center justify-between rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-700 text-white' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className={`mr-2.5 h-4 w-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-8 px-3 flex flex-col gap-2">
             <Button variant="outline" size="sm" asChild className="w-full justify-start text-slate-300 border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white">
              <Link to="/">
                <Globe className="h-4 w-4 mr-2" />
                Return to Website
              </Link>
             </Button>
             <Button variant="outline" size="sm" onClick={switchToParent} className="w-full justify-start text-slate-800 bg-slate-100 hover:bg-slate-200 border-none">
              <LogOut className="h-4 w-4 mr-2" />
              Test Parent Portal
             </Button>
          </div>
        </div>
        
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center font-medium text-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium truncate w-32">{user?.name || 'Jane Admin'}</p>
              <p className="text-xs text-slate-400">{user?.role || 'Principal'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8 shadow-sm z-10">
          <div className="flex items-center flex-1">
            <button 
              className="mr-4 text-slate-500 hover:text-slate-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="max-w-md w-full hidden sm:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search students, parents..." 
                className="pl-9 bg-slate-50 border-transparent focus:border-slate-200 focus:bg-white"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex">
              {isOffline ? (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-none flex items-center gap-1.5 animate-pulse">
                  <WifiOff className="h-3.5 w-3.5" />
                  Offline Mode ({pendingSync > 0 ? `${pendingSync} pending` : 'Syncing Paused'})
                </Badge>
              ) : pendingSync > 0 ? (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-none flex items-center gap-1.5 animate-pulse">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Syncing {pendingSync} item{pendingSync !== 1 ? 's' : ''}...
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                  <Cloud className="h-3.5 w-3.5" />
                  All data synced
                </Badge>
              )}
            </div>
            <Link to="/school/1" target="_blank" className="text-sm font-medium text-blue-600 hover:text-blue-700 hidden sm:block">
              View Website
            </Link>
            <button className="relative p-1 text-slate-400 hover:text-slate-500">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import React from 'react';
import { Package, Truck, FileText, Settings, LogOut, DollarSign, Users, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';

export function SupplierPortalPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Supplier Portal</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { icon: <Store className="h-5 w-5" />, label: 'Dashboard', active: true },
            { icon: <Package className="h-5 w-5" />, label: 'Products & Catalog', active: false },
            { icon: <Truck className="h-5 w-5" />, label: 'Orders & Fulfillment', active: false },
            { icon: <DollarSign className="h-5 w-5" />, label: 'Invoices & Payments', active: false },
            { icon: <Users className="h-5 w-5" />, label: 'Clients (Schools)', active: false },
            { icon: <FileText className="h-5 w-5" />, label: 'Tenders & Bids', active: false },
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-sm font-medium ${item.active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-blue-400">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'Supplier'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium">
            <Settings className="h-5 w-5" /> Settings
          </button>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 mt-1 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors text-sm font-medium">
            <LogOut className="h-5 w-5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Supplier Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage your educational supplies and school orders.</p>
          </div>
          <div className="flex gap-4">
             <Button variant="outline">View Marketplace Store</Button>
             <Button className="bg-blue-600 hover:bg-blue-700">Add New Product</Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Active Orders', value: '24', icon: <Truck className="h-6 w-6 text-blue-600" />, trend: '+12% from last wk' },
            { label: 'Total Revenue', value: 'E45,200', icon: <DollarSign className="h-6 w-6 text-emerald-600" />, trend: '+5% from last mo' },
            { label: 'Products Listed', value: '142', icon: <Package className="h-6 w-6 text-orange-600" />, trend: '4 out of stock' },
            { label: 'School Clients', value: '18', icon: <Users className="h-6 w-6 text-purple-600" />, trend: '+2 new this month' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-50 rounded-xl">{stat.icon}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h4 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h4>
                <p className="text-xs font-medium text-slate-400 mt-2">{stat.trend}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Recent School Orders</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {[
                { school: 'Sunshine Early Learning', orderId: '#ORD-092T', date: 'Today, 09:30 AM', amount: 'E1,250', status: 'Pending Fulfillment' },
                { school: 'Little Stars Academy', orderId: '#ORD-091P', date: 'Yesterday, 14:15 PM', amount: 'E4,500', status: 'Shipped' },
                { school: 'Bambisanani Preschool', orderId: '#ORD-090L', date: 'Mon, 10:00 AM', amount: 'E850', status: 'Delivered' },
              ].map((order, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                       {order.school.charAt(0)}
                     </div>
                     <div>
                       <h4 className="text-sm font-bold text-slate-900">{order.school}</h4>
                       <p className="text-xs text-slate-500">{order.orderId} • {order.date}</p>
                     </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{order.amount}</p>
                    <p className={`text-xs font-medium ${order.status === 'Delivered' ? 'text-emerald-600' : order.status === 'Shipped' ? 'text-blue-600' : 'text-orange-600'}`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
             <h3 className="text-lg font-bold text-slate-900 mb-6">Marketplace Insights</h3>
             <div className="space-y-6">
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                  <h4 className="text-sm font-bold text-orange-900 mb-1">Low Stock Alert</h4>
                  <p className="text-xs text-orange-700">A4 Printing Paper is running low (12 boxes left). Schools frequently reorder this.</p>
                  <Button size="sm" variant="outline" className="mt-3 bg-white hover:bg-orange-50 text-orange-700 border-orange-200 w-full">Update Inventory</Button>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <h4 className="text-sm font-bold text-blue-900 mb-1">New Bid Opportunity</h4>
                  <p className="text-xs text-blue-700">Little Stars Daycare is requesting quotes for 20 classroom whiteboards.</p>
                  <Button size="sm" variant="outline" className="mt-3 bg-white hover:bg-blue-50 text-blue-700 border-blue-200 w-full">View Tender Details</Button>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

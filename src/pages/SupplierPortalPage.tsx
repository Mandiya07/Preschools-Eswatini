import React, { useState } from 'react';
import { Package, Truck, FileText, Settings, LogOut, DollarSign, Users, Store, CreditCard, CheckCircle2, Zap, ShieldCheck, Sparkles, Loader2, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updateDocument } from '@/lib/firestoreUtils';
import { toast } from 'sonner';

export function SupplierPortalPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'Dashboard' | 'Products' | 'Orders' | 'Invoices' | 'Clients' | 'Tenders' | 'Subscription'>('Dashboard');
  const [updatingPlan, setUpdatingPlan] = useState<string | null>(null);

  const activePlan = user?.subscriptionPlan || 'Basic';

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUpgradePlan = async (planId: string) => {
    if (!user?.uid) return;
    setUpdatingPlan(planId);
    try {
      await updateDocument('users', user.uid, { subscriptionPlan: planId });
      toast.success(`Successfully subscribed to ${planId}!`);
    } catch(err) {
      console.error(err);
      toast.error("Failed to update marketplace plan.");
    } finally {
      setUpdatingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0 shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Supplier Portal</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { icon: <Store className="h-5 w-5" />, label: 'Dashboard', key: 'Dashboard' },
            { icon: <Package className="h-5 w-5" />, label: 'Products & Catalog', key: 'Products' },
            { icon: <Truck className="h-5 w-5" />, label: 'Orders & Fulfillment', key: 'Orders' },
            { icon: <DollarSign className="h-5 w-5" />, label: 'Invoices & Payments', key: 'Invoices' },
            { icon: <Users className="h-5 w-5" />, label: 'Clients (Schools)', key: 'Clients' },
            { icon: <FileText className="h-5 w-5" />, label: 'Tenders & Bids', key: 'Tenders' },
            { icon: <CreditCard className="h-5 w-5" />, label: 'Seller Subscription', key: 'Subscription' },
          ].map((item, i) => (
            <button key={i} onClick={() => setActiveSection(item.key as any)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-sm font-medium ${activeSection === item.key ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
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
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20 font-bold uppercase">{activePlan}</span>
              </div>
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
        {activeSection === 'Subscription' ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            <header className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Seller Subscription & Billing</h1>
                <p className="text-slate-500 mt-1">Configure your seller commission tiers and visibility packages.</p>
              </div>
            </header>

            {/* Current Plan Overview Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-[2rem] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Zap className="w-48 h-48 text-white font-bold" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <Badge className="bg-blue-500/30 text-blue-200 border-none px-3 py-1 font-bold uppercase mb-3 text-[10px]">Active Partner Tier</Badge>
                  <h3 className="text-3xl font-bold tracking-tight">{activePlan} Partner</h3>
                  <p className="text-blue-200 mt-2 max-w-xl text-sm leading-relaxed">
                    {activePlan === 'Basic' && "You are on our free listing plan with a standard 10% commission on sales."}
                    {activePlan === 'Growth' && "You have unlocked the Growth tier. Enjoy a reduced 5% commission, a featured seller ribbon, and direct access to school bids!"}
                    {activePlan === 'Elite' && "Welcome to Elite! 0% commission on all transactions. Keep 100% of your earnings and enjoy maximum marketplace search visibility."}
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-w-[200px] bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/10">
                  <span className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">Billed Cycle</span>
                  <span className="text-xl font-bold">Monthly Renewal</span>
                  <span className="text-xs font-medium text-emerald-300 flex items-center gap-1.5 mt-1">
                    <CheckCircle2 className="h-4.5 w-4.5" /> Plan Is Active
                  </span>
                </div>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Available Subscription Tiers</h3>
                <p className="text-slate-500 text-sm mt-1">Upgrade or swap plans anytime. Your listing limits and commission rates update instantly.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    id: 'Basic',
                    name: 'Basic Supplier',
                    price: 'E0',
                    features: [
                      '10% transaction fee',
                      'Up to 15 product listings',
                      'Standard search placement',
                      'Email support only'
                    ]
                  },
                  {
                    id: 'Growth',
                    name: 'Growth Seller',
                    price: 'E199',
                    features: [
                      '5% transaction fee',
                      'Up to 100 product listings',
                      'Premium WhatsApp support',
                      'Featured seller ribbon extra visibility',
                      'Access school procurement bids & tenders'
                    ]
                  },
                  {
                    id: 'Elite',
                    name: 'Elite Partner',
                    price: 'E499',
                    features: [
                      '0% commission (Keep 100% margin)',
                      'Unlimited store database listings',
                      'Top 1% marketplace catalog visibility',
                      'Dedicated account executive manager',
                      'Real-time SMS alerts on new school tenders'
                    ]
                  }
                ].map((plan) => {
                  const isCurrent = activePlan.toLowerCase() === plan.id.toLowerCase();
                  return (
                    <div key={plan.id} className={`bg-white rounded-3xl p-6 border flex flex-col justify-between relative transition-all ${isCurrent ? "border-blue-600 shadow-md ring-2 ring-blue-500/10" : "border-slate-200 hover:shadow-lg"}`}>
                      {isCurrent && (
                        <div className="absolute top-0 right-6 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-extrabold tracking-wider px-3 py-1 rounded-full uppercase">
                          Current Tier
                        </div>
                      )}
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">{plan.name}</h4>
                        <div className="my-4 flex items-baseline gap-1">
                          <span className="text-2xl font-extrabold text-slate-900">{plan.price}</span>
                          <span className="text-xs text-slate-500 font-medium">/ month</span>
                        </div>
                        <ul className="space-y-2.5 mt-6">
                          {plan.features.map((f, fidx) => (
                            <li key={fidx} className="flex gap-2 text-xs text-slate-600 font-medium">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        disabled={isCurrent || updatingPlan !== null}
                        onClick={() => handleUpgradePlan(plan.id)}
                        className={`w-full mt-8 rounded-xl font-bold h-11 ${
                          isCurrent 
                            ? "bg-slate-100 text-slate-500 hover:bg-slate-100" 
                            : plan.id === 'Elite' 
                            ? "bg-slate-900 text-white hover:bg-slate-800" 
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {updatingPlan === plan.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isCurrent ? (
                          "Active Plan"
                        ) : (
                          `Upgrade to ${plan.id}`
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Invoice & Payment Methods */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h4 className="font-bold text-slate-900 text-sm mb-2">Integrated Payout Account</h4>
                <p className="text-xs text-slate-500 mb-4 font-medium">Set up where your school procurement payouts are transferred natively.</p>
                <div className="space-y-3">
                  <div className="p-4 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs">MTN</div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">MTN Mobile Money Wallet</p>
                        <p className="text-[10px] text-slate-400">Linked to +268 7600 ••••</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">Standard</span>
                  </div>
                  <div className="p-4 border border-dashed text-slate-400 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-50 hover:text-slate-600 transition-all text-xs font-semibold gap-2">
                    Add MTN MoMo / Bank Transfer Account <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2">Commission & Royalty Agreement</h4>
                  <p className="text-xs text-slate-500 mb-4 font-medium font-medium">A standard SLA is applicable on all B2B tenders received through the Sikolo procurement workspace.</p>
                  <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-slate-400" /> Automated invoice generation on procurement matching</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-slate-400" /> Transparent auditing for school compliance</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-slate-400" /> Dedicated payout reconciliations twice weekly</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-400 mt-4">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Secured and verified with PCI-DSS Eswatini guidelines.
                </div>
              </div>
            </div>
          </div>
        ) : activeSection === 'Products' ? (
          <div className="space-y-8 animate-in fade-in duration-300">
             <header className="flex justify-between items-center mb-6">
                <div>
                   <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Products & B2B Catalog</h1>
                   <p className="text-slate-500 mt-1">Add or modify items supplied directly to childcare centers.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Add New Item</Button>
             </header>
             <div className="py-20 text-center border rounded-2xl border-dashed bg-white">
                <Store className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">Your Catalog</h3>
                <p className="text-slate-500 text-sm">Products listed here automatically sync to the national marketplace directory.</p>
             </div>
          </div>
        ) : activeSection === 'Orders' ? (
          <div className="space-y-8 animate-in fade-in duration-300">
             <header className="flex justify-between items-center mb-6">
                <div>
                   <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">School Orders</h1>
                   <p className="text-slate-500 mt-1">Track and manage procurement deliveries to educational branches.</p>
                </div>
             </header>
             <div className="py-20 text-center border rounded-2xl border-dashed bg-white">
                <Truck className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No active pending orders</h3>
                <p className="text-slate-500 text-sm">New orders from preschool administrators will appear here instantly.</p>
             </div>
          </div>
        ) : activeSection === 'Invoices' ? (
          <div className="space-y-8 animate-in fade-in duration-300">
             <header className="flex justify-between items-center mb-6">
                <div>
                   <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Invoices & School Matching</h1>
                   <p className="text-slate-500 mt-1">Review financial transactions, royalty reports, and school payouts.</p>
                </div>
             </header>
             <div className="py-20 text-center border rounded-2xl border-dashed bg-white">
                <DollarSign className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No financial invoices yet</h3>
                <p className="text-slate-500 text-sm">Statements and payouts will be updated twice a week.</p>
             </div>
          </div>
        ) : activeSection === 'Clients' ? (
          <div className="space-y-8 animate-in fade-in duration-300">
             <header className="flex justify-between items-center mb-6">
                <div>
                   <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Active Clients (Schools)</h1>
                   <p className="text-slate-500 mt-1">Review daycare branches and early development hubs purchasing from you.</p>
                </div>
             </header>
             <div className="py-20 text-center border rounded-2xl border-dashed bg-white">
                <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No client profile matching yet</h3>
                <p className="text-slate-500 text-sm">Schools that add you as a premium verified supplier will be grouped here.</p>
             </div>
          </div>
        ) : activeSection === 'Tenders' ? (
          <div className="space-y-8 animate-in fade-in duration-300">
             <header className="flex justify-between items-center mb-6">
                <div>
                   <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tenders & Bids Inbox</h1>
                   <p className="text-slate-500 mt-1">Participate directly in early childhood education tenders and supply requests.</p>
                </div>
             </header>
             <div className="py-20 text-center border rounded-2xl border-dashed bg-white max-w-4xl mx-auto">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No active competitive quotes</h3>
                <p className="text-slate-500 text-sm">Upgrade to Growth or Elite partner tier to unlock direct school RFQs.</p>
             </div>
          </div>
        ) : (
          <>
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Supplier Dashboard</h1>
                <p className="text-slate-500 mt-1">Manage your educational supplies and school orders.</p>
              </div>
              <div className="flex gap-4">
                 <Button variant="outline" onClick={() => navigate('/marketplace')}>View Marketplace Store</Button>
                 <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setActiveSection('Products')}>Add New Product</Button>
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
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                    <h4 className="text-2xl font-extrabold text-slate-900 mt-1">{stat.value}</h4>
                    <p className="text-[11px] font-semibold text-slate-400 mt-2">{stat.trend}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders & Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Recent School Orders</h3>
                  <Button variant="ghost" size="sm" onClick={() => setActiveSection('Orders')}>View All</Button>
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
              
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                 <h3 className="text-lg font-bold text-slate-900 mb-6 font-bold">Marketplace Insights</h3>
                 <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                      <h4 className="text-sm font-bold text-orange-900 mb-1">Low Stock Alert</h4>
                      <p className="text-xs text-orange-700 leading-relaxed">A4 Printing Paper is running low (12 boxes left). Schools frequently reorder this.</p>
                      <Button size="sm" variant="outline" className="mt-3 bg-white hover:bg-orange-50 text-orange-700 border-orange-200 w-full" onClick={() => setActiveSection('Products')}>Update Inventory</Button>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                      <h4 className="text-sm font-bold text-blue-900 mb-1">New Bid Opportunity</h4>
                      <p className="text-xs text-blue-700 leading-relaxed">Little Stars Daycare is requesting quotes for 20 classroom whiteboards.</p>
                      <Button size="sm" variant="outline" className="mt-3 bg-white hover:bg-blue-50 text-blue-700 border-blue-200 w-full" onClick={() => setActiveSection('Tenders')}>View Tender Details</Button>
                    </div>
                 </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

import React from 'react';
import { Megaphone, BarChart3, Target, CreditCard, Settings, LogOut, Users, FileVideo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';

export function AdvertiserPortalPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
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
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Ads Portal</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { icon: <BarChart3 className="h-5 w-5" />, label: 'Dashboard', active: true },
            { icon: <Megaphone className="h-5 w-5" />, label: 'Campaigns', active: false },
            { icon: <Target className="h-5 w-5" />, label: 'Audience Targeting', active: false },
            { icon: <FileVideo className="h-5 w-5" />, label: 'Creative Assets', active: false },
            { icon: <Users className="h-5 w-5" />, label: 'Leads & Conversions', active: false },
            { icon: <CreditCard className="h-5 w-5" />, label: 'Billing & Invoices', active: false },
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-sm font-medium ${item.active ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-4 px-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-purple-400">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'Advertiser'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium border border-slate-800">
            <BarChart3 className="h-4 w-4" /> Return to Website
          </button>
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
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Advertiser Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage your campaigns targeting parents and schools.</p>
          </div>
          <div className="flex gap-4">
             <Button className="bg-purple-600 hover:bg-purple-700">Create New Campaign</Button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Active Campaigns', value: '3', icon: <Megaphone className="h-6 w-6 text-purple-600" />, trend: 'Running smoothly' },
            { label: 'Total Impressions', value: '142.5K', icon: <Target className="h-6 w-6 text-blue-600" />, trend: '+24% from last mo' },
            { label: 'Total Clicks', value: '8,432', icon: <BarChart3 className="h-6 w-6 text-pink-600" />, trend: 'Avg CTR: 5.9%' },
            { label: 'Spend (MTD)', value: 'E1,240', icon: <CreditCard className="h-6 w-6 text-emerald-600" />, trend: 'Budget remaining: E760' },
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

        {/* Campaigns & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Top Performing Campaigns</h3>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Back to School Uniforms', target: 'Parents (All Regions)', spend: 'E450', clicks: '3,200', ctr: '8.4%', status: 'Active' },
                { name: 'EdTech Software Demo Request', target: 'School Admins', spend: 'E600', clicks: '850', ctr: '4.2%', status: 'Active' },
                { name: 'Extracurricular Coding Bootcamp', target: 'Parents (Mbabane)', spend: 'E190', clicks: '1,400', ctr: '6.1%', status: 'Active' },
              ].map((campaign, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-purple-100 hover:bg-purple-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                       <Megaphone className="h-5 w-5" />
                     </div>
                     <div>
                       <h4 className="text-sm font-bold text-slate-900">{campaign.name}</h4>
                       <p className="text-xs text-slate-500">Targeting: {campaign.target}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-8 text-right">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{campaign.clicks}</p>
                      <p className="text-xs font-medium text-slate-500">Clicks</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{campaign.ctr}</p>
                      <p className="text-xs font-medium text-slate-500">CTR</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
             <h3 className="text-lg font-bold text-slate-900 mb-6">Audience Insights</h3>
             <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Engagement by Role</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Parents</span>
                        <span className="font-bold">65%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>School Admins</span>
                        <span className="font-bold">35%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-pink-50 border border-pink-100 mt-6">
                  <h4 className="text-sm font-bold text-pink-900 mb-1">Optimization Tip</h4>
                  <p className="text-xs text-pink-700">Video ads in the Parent Portal are seeing a 40% higher engagement rate this week.</p>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import React from "react";
import { SEO } from "@/components/SEO";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Users, TrendingUp, Map, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const enrollmentTrends = [
  { year: "2019", public: 12000, private: 8000 },
  { year: "2020", public: 12500, private: 8200 },
  { year: "2021", public: 11000, private: 7500 }, // COVID dip
  { year: "2022", public: 13000, private: 9000 },
  { year: "2023", public: 14500, private: 11000 },
  { year: "2024", public: 16000, private: 13500 },
];

const regionDistribution = [
  { name: "Hhohho", value: 35 },
  { name: "Manzini", value: 40 },
  { name: "Shiselweni", value: 10 },
  { name: "Lubombo", value: 15 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function NationalInsightsPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <SEO title="National Insights | Preschools Eswatini" description="National ECCDE data, preschool statistics and insights platform." />
      
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
             <div className="inline-flex items-center rounded-full bg-blue-500/20 px-3 py-1 text-sm font-bold text-blue-300 border border-blue-500/30">
               National Data Platform
             </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            ECCDE Insights & Analytics
          </h1>
          <p className="max-w-3xl text-xl text-slate-300">
            Real-time data map of the national early childhood education sector. 
            Empowering researchers, Ministry stakeholders, and NGOs to make informed decisions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-30px]">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
           <Card className="rounded-2xl border-none shadow-lg bg-white overflow-hidden">
              <div className="p-6">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Map className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Registered ECCDE Centres</p>
                      <h3 className="text-2xl font-bold text-slate-900">482</h3>
                    </div>
                 </div>
                 <div className="mt-4 flex items-center text-sm font-medium text-emerald-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12% vs last year
                 </div>
              </div>
           </Card>

           <Card className="rounded-2xl border-none shadow-lg bg-white overflow-hidden">
              <div className="p-6">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                      <Users className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Total Enrolled Children</p>
                      <h3 className="text-2xl font-bold text-slate-900">29,500</h3>
                    </div>
                 </div>
                 <div className="mt-4 flex items-center text-sm font-medium text-emerald-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +18% vs last year
                 </div>
              </div>
           </Card>

           <Card className="rounded-2xl border-none shadow-lg bg-white overflow-hidden">
              <div className="p-6">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">National Teacher Ratio</p>
                      <h3 className="text-2xl font-bold text-slate-900">1:15</h3>
                    </div>
                 </div>
                 <div className="mt-4 flex items-center text-sm font-medium text-amber-500">
                    Target: 1:12
                 </div>
              </div>
           </Card>

           <Card className="rounded-2xl border-none shadow-lg bg-white overflow-hidden">
              <div className="p-6">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-xl">
                      <MapPin className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">Underserved Regions</p>
                      <h3 className="text-2xl font-bold text-slate-900">Shiselweni</h3>
                    </div>
                 </div>
                 <div className="mt-4 flex items-center text-sm font-medium text-blue-600">
                    View heatmap →
                 </div>
              </div>
           </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-3xl border border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">National Enrollment Trends (2019 - Present)</CardTitle>
                <CardDescription>Public vs. private sector growth in early childhood education.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={enrollmentTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="year" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" tickFormatter={(value) => `${value / 1000}k`} />
                      <Tooltip 
                         contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="private" name="Private Enrolment" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="public" name="Public Enrolment" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
               <div className="bg-slate-900 p-8 flex flex-col items-center justify-center text-center h-[300px] relative overflow-hidden">
                 <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>
                 <div className="absolute opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                 <div className="relative z-10">
                   <h3 className="text-2xl font-bold text-white mb-4">Interactive Geographic Heatmaps</h3>
                   <p className="text-slate-300 max-w-md mx-auto mb-6">
                     Visualize capacity, demand, and growth across regions. Exclusively available for Ministry partners and registered NGOs.
                   </p>
                   <Button variant="secondary">Request Access via Admin</Button>
                 </div>
               </div>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="rounded-3xl border border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Regional Distribution</CardTitle>
                <CardDescription>Share of registered centres.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="h-[250px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={false}
                      >
                        {regionDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Predictive Demand Forecast</CardTitle>
                <CardDescription>Upcoming enrollment gaps for 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-700">Mbabane Supply Gap</span>
                      <span className="font-bold text-red-500">-12%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-red-500 w-[88%]"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-700">Manzini Supply Gap</span>
                      <span className="font-bold text-amber-500">-5%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-amber-500 w-[95%]"></div>
                    </div>
                  </div>
                  <div className="space-y-2 border-t pt-4 mt-4">
                    <p className="text-xs text-slate-500">
                      Based on birth rates and current registered capacity. An additional 40 new classrooms required in Mbabane by next year.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShieldCheck, QrCode, UserPlus, AlertTriangle, 
  FileText, HeartPulse, ShieldAlert, Video, Sparkles
} from "lucide-react";
import { SEO } from "@/components/SEO";

const FEATURES = [
  { id: "pickup", title: "Child Pickup Verification", icon: <ShieldCheck className="h-6 w-6" />, color: "bg-blue-50 text-blue-600", description: "Secure pickup authentication." },
  { id: "qr", title: "QR Pickup Codes", icon: <QrCode className="h-6 w-6" />, color: "bg-slate-50 text-slate-600", description: "Instant, secure digital pickup authorization." },
  { id: "visitor", title: "Visitor Management", icon: <UserPlus className="h-6 w-6" />, color: "bg-emerald-50 text-emerald-600", description: "Monitor and approve school site visitors." },
  { id: "emergency", title: "Emergency Alerts", icon: <AlertTriangle className="h-6 w-6" />, color: "bg-red-50 text-red-600", description: "Real-time communication in emergencies." },
  { id: "incident", title: "Incident Reports", icon: <FileText className="h-6 w-6" />, color: "bg-amber-50 text-amber-600", description: "Digital logging of safety incidents." },
  { id: "health", title: "Health Alerts", icon: <HeartPulse className="h-6 w-6" />, color: "bg-rose-50 text-rose-600", description: "Immediate health status updates." },
  { id: "allergy", title: "Allergy Tracking", icon: <ShieldAlert className="h-6 w-6" />, color: "bg-yellow-50 text-yellow-600", description: "Strict monitoring of student allergies." },
  { id: "cctv", title: "CCTV Readiness", icon: <Video className="h-6 w-6" />, color: "bg-purple-50 text-purple-600", description: "Infrastructure readiness for site monitoring." },
];

export function SafetySecurityPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <SEO title="Safety & Security | Sikolo" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Safety & Security Suite</h1>
          <p className="text-lg text-slate-600 mt-2">Protecting what matters most with advanced security features.</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
           <Sparkles className="mr-2 h-4 w-4" /> View Security Overview
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((feature) => (
          <Card key={feature.id} className="rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${feature.color}`}>
                {feature.icon}
              </div>
              <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

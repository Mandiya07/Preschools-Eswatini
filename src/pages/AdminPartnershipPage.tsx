import { useState, useRef, useEffect } from "react";
import { 
  FileText, 
  Send, 
  ChevronRight, 
  Download, 
  Printer, 
  Signature, 
  CheckCircle2, 
  Mail, 
  Building2,
  Calendar,
  Layers,
  Rocket
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { fetchDocument } from "@/lib/firestoreUtils";

export function AdminPartnershipPage() {
  const { user, activeSchoolId } = useAuth();
  const effectiveSchoolId = user?.role === 'SuperAdmin' ? activeSchoolId : user?.schoolId;
  const [partnerDetails, setPartnerDetails] = useState<any>(null);
  
  const [clientName, setClientName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [senderTitle, setSenderTitle] = useState(user?.role || "Principal");
  const [customNote, setCustomNote] = useState("");
  const [signatureText, setSignatureText] = useState(user?.name || "");
  const [isSigned, setIsSigned] = useState(false);
  const [step, setStep] = useState(1);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!effectiveSchoolId) return;
    
    async function loadData() {
      const data = await fetchDocument('schools', effectiveSchoolId) as any;
      if (data) {
        setPartnerDetails(data);
      }
    }
    loadData();
  }, [effectiveSchoolId]);

  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Partnership Proposals</h1>
          <p className="text-sm text-slate-500 mt-1">Generate and sign professional invitations for potential preschool clients.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white" onClick={() => setStep(1)} disabled={step === 1}>
            New Proposal
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700" 
            onClick={handlePrint}
            disabled={!isSigned}
          >
            <Printer className="mr-2 h-4 w-4" /> Print / Export PDF
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Controls - Hide on Print */}
        <div className="lg:col-span-4 space-y-6 no-print">
          <Card className="rounded-[2rem] border-slate-200 overflow-hidden shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <div className="bg-blue-100 h-10 w-10 rounded-xl flex items-center justify-center mb-2">
                <Layers className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Customize Document</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Recipient Name</Label>
                <Input 
                  id="client" 
                  placeholder="e.g. Mrs. Sarah Smith" 
                  value={clientName} 
                  onChange={(e) => setClientName(e.target.value)}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">Preschool Name</Label>
                <Input 
                  id="school" 
                  placeholder="e.g. Sunny Days Academy" 
                  value={schoolName} 
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Optional Custom Message</Label>
                <Textarea 
                  id="note" 
                  placeholder="Add a personal touch..." 
                  value={customNote} 
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="bg-slate-50 border-slate-200 min-h-[100px] resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="space-y-2">
                  <Label htmlFor="sign">Digital Signature (Type your name)</Label>
                  <div className="relative">
                    <Input 
                      id="sign" 
                      placeholder="Your Full Name" 
                      value={signatureText} 
                      onChange={(e) => {
                        setSignatureText(e.target.value);
                        setIsSigned(e.target.value.length > 0);
                      }}
                      className="bg-white border-slate-200 italic font-medium pr-10"
                      style={{ fontFamily: "'Dancing Script', cursive, serif" }}
                    />
                    {isSigned && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 italic">This creates a digital signature based on your name.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-blue-100 bg-blue-50/50 p-6 overflow-hidden relative group">
             <Rocket className="absolute -right-4 -bottom-4 h-24 w-24 text-blue-100 rotate-12 transition-transform group-hover:scale-110" />
             <div className="relative">
                <h4 className="font-bold text-blue-900 mb-2">Pro-Tip for Growth</h4>
                <p className="text-xs text-blue-700 leading-relaxed mb-4">
                  Preschool owners love seeing how much time they can save. Mention the **Auto-Invoicing** and **Daily Health Logs** in your custom note!
                </p>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-100 p-0 h-auto font-bold uppercase tracking-widest text-[10px]">
                  View Success Stories <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
             </div>
          </Card>
        </div>

        {/* Document Preview */}
        <div className="lg:col-span-8">
          <div 
            ref={printRef}
            className="bg-white shadow-2xl rounded-2xl min-h-[1056px] w-full flex flex-col print:m-0 print:shadow-none print:rounded-none relative overflow-hidden"
          >
            {/* Header / Hero Area */}
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-12 relative overflow-hidden">
               {/* Background pattern */}
               <div className="absolute inset-0 opacity-10">
                 <div className="absolute top-10 left-10 w-24 h-24 bg-white rounded-full blur-2xl"></div>
                 <div className="absolute bottom-10 right-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
               </div>

               <div className="relative z-10 flex justify-between items-start">
                 <div className="flex items-center gap-4">
                   <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-lg transform -rotate-3">
                     <Building2 className="h-8 w-8" />
                   </div>
                   <div>
                     <h2 className="font-black text-2xl tracking-tight">{partnerDetails?.name || "Ecosystem Partner"}</h2>
                     <p className="text-sm font-semibold tracking-[0.2em] uppercase text-blue-100 mt-1">Ecosystem Partner</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-bold text-white/90">{today}</p>
                   <p className="text-xs text-white/60 font-medium mt-1">PROPOSAL #{Math.floor(1000 + Math.random() * 9000)}</p>
                 </div>
               </div>

               <div className="mt-16 max-w-lg relative z-10">
                 <p className="text-sm font-bold text-blue-200 uppercase tracking-widest mb-3">Partnership Proposal For</p>
                 <h1 className="text-4xl font-extrabold text-white leading-tight mb-2">
                   {schoolName || "Your Preschool Name"}
                 </h1>
                 <p className="text-xl text-blue-100 font-medium">
                   Prepared for {clientName || "Potential Partner"}
                 </p>
               </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-12 space-y-10 text-slate-700">
               {/* Intro Note */}
               <div className="prose prose-slate max-w-none">
                 <p className="text-lg leading-relaxed text-slate-600">
                   Dear <span className="font-bold text-slate-900">{clientName ? clientName.split(' ')[0] : 'Partner'}</span>,
                 </p>
                 <p className="text-lg leading-relaxed text-slate-600">
                   Running a successful early childhood center is about nurturing the next generation. Yet, we know that administrative tasks, parent communication, and financial tracking can take you away from what matters most. We invite you to join the <strong>Little Stars Network</strong> to digitize and grow your preschool.
                 </p>
               </div>

               {/* Value Props Grid */}
               <div className="grid grid-cols-2 gap-8 my-10">
                 <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                   <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                     <Calendar className="h-5 w-5" />
                   </div>
                   <h3 className="font-bold text-slate-900 mb-2">Save 10+ Hours / Week</h3>
                   <p className="text-sm text-slate-600 leading-relaxed">Automate daily attendance, generate immediate billing invoices, and keep digital HR records effortlessly.</p>
                 </div>
                 <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100">
                   <div className="h-10 w-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                     <Mail className="h-5 w-5" />
                   </div>
                   <h3 className="font-bold text-slate-900 mb-2">Delight Your Parents</h3>
                   <p className="text-sm text-slate-600 leading-relaxed">Provide parents with real-time updates, daily health logs, and beautiful photo sharing directly through the platform.</p>
                 </div>
               </div>

               {customNote && (
                 <div className="relative">
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-full"></div>
                   <div className="pl-6 py-2">
                     <p className="italic text-slate-600 text-lg">"{customNote}"</p>
                   </div>
                 </div>
               )}

               <div className="bg-slate-50 p-8 rounded-2xl">
                 <h3 className="font-bold text-slate-900 text-xl mb-4">Next Steps</h3>
                 <ul className="space-y-4">
                   <li className="flex items-start gap-3">
                     <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                     <p className="text-slate-600 text-sm"><strong>Review this proposal</strong> and envision the time savings for your staff.</p>
                   </li>
                   <li className="flex items-start gap-3">
                     <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                     <p className="text-slate-600 text-sm"><strong>Schedule a free setup session</strong> where we tailor the platform to your needs.</p>
                   </li>
                   <li className="flex items-start gap-3">
                     <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                     <p className="text-slate-600 text-sm"><strong>Launch</strong> and immediately welcome parents into your new digital ecosystem.</p>
                   </li>
                 </ul>
               </div>
            </div>

            {/* Signature Area */}
            <div className="px-12 pb-12 mt-auto">
               <div className="border-t border-slate-100 pt-8 flex items-end justify-between">
                  <div>
                    <AnimatePresence>
                      {isSigned && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mb-4"
                        >
                          <p 
                            className="text-5xl text-blue-700 select-none pointer-events-none transform -rotate-2" 
                            style={{ fontFamily: "'Dancing Script', cursive, serif" }}
                          >
                            {signatureText}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="w-64 h-px bg-slate-200 mb-4"></div>
                    <p className="font-bold text-slate-900 text-sm uppercase tracking-tight">{signatureText || "____________________"}</p>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-1">{senderTitle}</p>
                  </div>
                  
                  <div className="text-right flex flex-col items-end">
                    <div className="h-20 w-20 border-2 border-indigo-100 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                       <Signature className="h-8 w-8 text-indigo-400" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorized Proposal</p>
                    <p className="text-[10px] text-slate-400 mt-1">littlestars.cloud</p>
                  </div>
               </div>
            </div>
            
            {/* Decorative bottom bar */}
            <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 w-full"></div>
          </div>

          
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
            @media print {
              .no-print { display: none !important; }
              body { background: white !important; }
              main { padding: 0 !important; }
              .shadow-2xl { box-shadow: none !important; }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}

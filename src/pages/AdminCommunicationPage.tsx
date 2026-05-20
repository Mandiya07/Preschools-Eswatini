import { useState, useEffect, FormEvent } from "react";
import { 
  Megaphone, 
  Mail, 
  MessageSquare, 
  PhoneCall, 
  Send, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Smartphone,
  MessageCircle,
  RefreshCw,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";
import { subscribeToCollection, createDocument } from "@/lib/firestoreUtils";
import { where, orderBy } from "firebase/firestore";
import { CommunicationLog, Student, Announcement, Newsletter } from "@/types";

export function AdminCommunicationPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<CommunicationLog[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form States
  const [messageType, setMessageType] = useState<"Email" | "SMS" | "WhatsApp" | "Push">("Email");
  const [target, setTarget] = useState<"All" | "Class" | "Individual">("All");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!user?.schoolId) return;

    const unsubLogs = subscribeToCollection(
      'communication_logs',
      (data) => setLogs(data as CommunicationLog[]),
      where('schoolId', '==', user.schoolId),
      orderBy('createdAt', 'desc')
    );

    const unsubStudents = subscribeToCollection(
      'students',
      (data) => setStudents(data as Student[]),
      where('schoolId', '==', user.schoolId)
    );

    const unsubAnnouncements = subscribeToCollection(
      'announcements',
      (data) => setAnnouncements(data as Announcement[]),
      where('schoolId', '==', user.schoolId)
    );

    const unsubNewsletters = subscribeToCollection(
      'newsletters',
      (data) => {
        setNewsletters(data as Newsletter[]);
        setLoading(false);
      },
      where('schoolId', '==', user.schoolId)
    );

    return () => {
      unsubLogs();
      unsubStudents();
      unsubAnnouncements();
      unsubNewsletters();
    };
  }, [user]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.schoolId || !content) return;

    setIsSending(true);
    try {
      // Create log entry
      const logData: Omit<CommunicationLog, "id"> = {
        schoolId: user.schoolId,
        senderId: user.uid,
        type: messageType,
        target,
        recipientIds: target === 'All' ? students.map(s => s.parentId).filter(Boolean) as string[] : [],
        subject: messageType === 'Email' ? subject : undefined,
        content,
        status: "Sent", // Simulating instant send
        createdAt: new Date().toISOString()
      };

      await createDocument('communication_logs', null, logData);
      
      // Also create general notifications if it's a push or all
      if (messageType === 'Push' || target === 'All') {
         // In a real app, this would happen server-side or via a batch
      }

      // Reset form
      setSubject("");
      setContent("");
      alert(`${messageType} broadcast sent successfully!`);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Sent': return <CheckCircle2 className="h-3 w-3 text-green-500" />;
      case 'Failed': return <AlertCircle className="h-3 w-3 text-red-500" />;
      default: return <Clock className="h-3 w-3 text-amber-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Email': return <Mail className="h-4 w-4" />;
      case 'SMS': return <Smartphone className="h-4 w-4" />;
      case 'WhatsApp': return <MessageCircle className="h-4 w-4" />;
      case 'Push': return <Bell className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Communication Center</h1>
          <p className="text-slate-500 italic">Centralized multi-channel messaging and alerts</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" /> Sync Contacts
           </Button>
           <Button className="bg-blue-600 hover:bg-blue-700 gap-2 shadow-lg shadow-blue-200">
              <Plus className="h-4 w-4" /> New Announcement
           </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center gap-2">
                 <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <Send className="h-4 w-4" />
                 </div>
                 <div>
                    <CardTitle className="text-lg">Quick Broadcast</CardTitle>
                    <CardDescription>Send messages across multiple platforms instantly</CardDescription>
                 </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSendMessage} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <Label>Channel</Label>
                      <div className="flex flex-wrap gap-2">
                         {(["Email", "SMS", "WhatsApp", "Push"] as const).map(type => (
                           <button
                             key={type}
                             type="button"
                             onClick={() => setMessageType(type)}
                             className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                               messageType === type 
                                 ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' 
                                 : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                             }`}
                           >
                             {getTypeIcon(type)}
                             {type}
                           </button>
                         ))}
                      </div>
                   </div>
                   <div className="space-y-2">
                      <Label>Audience</Label>
                      <div className="flex gap-2">
                         {(["All", "Class", "Individual"] as const).map(t => (
                           <button
                             key={t}
                             type="button"
                             onClick={() => setTarget(t)}
                             className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                               target === t 
                                 ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-200' 
                                 : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                             }`}
                           >
                             {t}
                           </button>
                         ))}
                      </div>
                   </div>
                </div>

                {messageType === 'Email' && (
                  <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="subject">Subject Line</Label>
                    <Input 
                      id="subject"
                      placeholder="Enter email subject..."
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="content">Message Content</Label>
                  <Textarea 
                    id="content"
                    placeholder={`Type your ${messageType.toLowerCase()} content here...`}
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="rounded-xl bg-slate-50 border-slate-200 focus:bg-white resize-none"
                  />
                  <div className="flex items-center justify-between mt-1">
                     <p className="text-[10px] text-slate-400 font-medium">
                        {content.length} characters • {Math.ceil(content.length / 160)} SMS segments
                     </p>
                     <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <Smartphone className="h-3 w-3" /> Push delivers in real-time
                     </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                   <div className="flex gap-2">
                      <Button type="button" variant="ghost" size="sm" className="text-slate-500 rounded-xl">Save as Draft</Button>
                      <Button type="button" variant="ghost" size="sm" className="text-slate-500 rounded-xl">Schedule for Later</Button>
                   </div>
                   <Button 
                    type="submit" 
                    disabled={isSending || !content} 
                    className="bg-blue-600 rounded-xl px-8 h-11 shadow-lg shadow-blue-100 relative overflow-hidden group"
                   >
                     {isSending ? (
                       <RefreshCw className="h-4 w-4 animate-spin" />
                     ) : (
                       <>
                         <span className="relative z-10 flex items-center gap-2">
                           Send {messageType} <Send className="h-4 w-4" />
                         </span>
                         <div className="absolute inset-0 bg-blue-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                       </>
                     )}
                   </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Tabs defaultValue="logs" className="w-full">
            <TabsList className="bg-slate-100 p-1 rounded-xl mb-6 inline-flex border border-slate-200">
              <TabsTrigger value="logs" className="rounded-lg px-6 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Recent Activity</TabsTrigger>
              <TabsTrigger value="announcements" className="rounded-lg px-6 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Announcements</TabsTrigger>
              <TabsTrigger value="newsletters" className="rounded-lg px-6 py-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">Newsletters</TabsTrigger>
            </TabsList>
            
            <TabsContent value="logs" className="space-y-4">
               {logs.length > 0 ? (
                 <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                       <table className="w-full text-left border-collapse">
                          <thead>
                             <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest Ital">Channel</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest Ital">Recipients</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest Ital">Snippet</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest Ital text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest Ital text-right">Sent Date</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {logs.map(log => (
                               <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                                  <td className="px-6 py-4">
                                     <div className="flex items-center gap-2">
                                        <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                           {getTypeIcon(log.type)}
                                        </div>
                                        <span className="text-xs font-bold text-slate-700">{log.type}</span>
                                     </div>
                                  </td>
                                  <td className="px-6 py-4">
                                     <Badge variant="outline" className="rounded-full text-[10px] bg-slate-50 border-slate-200">
                                        {log.target} ({log.recipientIds.length})
                                     </Badge>
                                  </td>
                                  <td className="px-6 py-4">
                                     <p className="text-xs text-slate-500 line-clamp-1 max-w-[200px]">
                                        {log.content}
                                     </p>
                                  </td>
                                  <td className="px-6 py-4">
                                     <div className="flex items-center justify-center">
                                        <div className={`p-1.5 rounded-full ${
                                           log.status === 'Sent' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                           {getStatusIcon(log.status)}
                                        </div>
                                     </div>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                     <p className="text-[10px] text-slate-400 font-bold whitespace-nowrap">
                                        {new Date(log.createdAt).toLocaleDateString()}
                                     </p>
                                     <p className="text-[9px] text-slate-300">
                                        {new Date(log.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                     </p>
                                  </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
               ) : (
                 <div className="p-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100 shadow-sm">
                    <Mail className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium italic">No broadcast logs yet.</p>
                 </div>
               )}
            </TabsContent>

            <TabsContent value="announcements">
              <div className="grid sm:grid-cols-2 gap-4">
                 {announcements.map(a => (
                   <Card key={a.id} className="border-slate-200">
                      <CardHeader className="p-4">
                         <div className="flex items-center justify-between mb-2">
                           <Badge className="rounded-full text-[9px]">{a.priority}</Badge>
                           <span className="text-[9px] text-slate-400">{new Date(a.date).toLocaleDateString()}</span>
                         </div>
                         <CardTitle className="text-sm font-bold">{a.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                         <p className="text-xs text-slate-500 line-clamp-3">{a.content}</p>
                         <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                            <span className="text-[10px] text-slate-400">Audience: {a.targetAudience}</span>
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600">Edit</Button>
                         </div>
                      </CardContent>
                   </Card>
                 ))}
                 <Card className="border-dashed border-2 flex items-center justify-center p-8 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="text-center">
                       <Plus className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">New Announcement</p>
                    </div>
                 </Card>
              </div>
            </TabsContent>

            <TabsContent value="newsletters">
               <div className="grid sm:grid-cols-2 gap-4">
                 {newsletters.map(n => (
                   <Card key={n.id} className="overflow-hidden border-slate-200">
                      <div className="h-32 bg-slate-100 relative">
                         {n.thumbnailUrl ? <img src={n.thumbnailUrl} className="w-full h-full object-cover" /> : (
                           <div className="absolute inset-0 flex items-center justify-center">
                              <Megaphone className="h-10 w-10 text-slate-200" />
                           </div>
                         )}
                         <div className="absolute top-2 right-2">
                            <Badge className={n.status === 'Published' ? 'bg-green-600' : 'bg-slate-500'}>{n.status}</Badge>
                         </div>
                      </div>
                      <CardHeader className="p-4">
                         <CardTitle className="text-sm">{n.title}</CardTitle>
                         <CardDescription className="text-[10px]">{new Date(n.publishedAt || '').toLocaleDateString()}</CardDescription>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 flex items-center gap-2">
                         <Button size="sm" variant="outline" className="flex-1 rounded-xl text-xs">Preview</Button>
                         <Button size="sm" className="bg-slate-900 rounded-xl text-xs">Publish</Button>
                      </CardContent>
                   </Card>
                 ))}
                 <Card className="border-dashed border-2 flex items-center justify-center p-8 cursor-pointer hover:bg-slate-50 transition-colors min-h-[250px]">
                    <div className="text-center">
                       <Plus className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Create Newsletter</p>
                    </div>
                 </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-8">
           {/* Emergency Alerts Card */}
           <Card className="bg-red-50 border-red-100 border-2 shadow-lg shadow-red-100/50 overflow-hidden relative">
              <div className="absolute -top-12 -right-12 h-32 w-32 bg-red-100/30 rounded-full blur-2xl pointer-events-none" />
              <CardHeader className="pb-2">
                 <div className="flex items-center gap-2 text-red-600 text-sm font-black uppercase tracking-tighter Ital">
                    <AlertCircle className="h-5 w-5" />
                    Emergency Protocol
                 </div>
              </CardHeader>
              <CardContent className="space-y-4 relative">
                 <p className="text-xs text-red-800 font-medium leading-relaxed">
                    Trigger a site-wide alert and send high-priority SMS notifications to all valid parent contacts.
                 </p>
                 <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-black rounded-xl h-12 shadow-md shadow-red-200">
                    ACTIVATE EMERGENCY ALERT
                 </Button>
                 <div className="flex items-center justify-between text-[9px] text-red-400 font-bold uppercase">
                    <span>Logs activity instantly</span>
                    <span>Bypasses DnD filters</span>
                 </div>
              </CardContent>
           </Card>

           {/* Stats Summary */}
           <Card className="border-slate-200">
              <CardHeader>
                 <CardTitle className="text-sm tracking-tight font-black uppercase Ital text-slate-400">Monthly Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-700">SMS Fragments</span>
                       <span className="text-xs font-bold text-blue-600">842 / 1,000</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-600 rounded-full" style={{ width: '84%' }} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-700">WhatsApp Messages</span>
                       <span className="text-xs font-bold text-green-600">128 / 500</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-green-600 rounded-full" style={{ width: '25%' }} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-700">Email Sends</span>
                       <span className="text-xs font-bold text-purple-600">Unlimited</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-purple-600 rounded-full w-full" />
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* Integration Help */}
           <div className="p-6 rounded-3xl bg-slate-900 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                  <ExternalLink className="h-24 w-24" />
               </div>
               <h3 className="text-lg font-bold mb-2">Omnichannel Setup</h3>
               <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Connect your Twilio, SendGrid or Meta Business account to enable direct message delivery.
               </p>
               <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold h-10 transition-all border-none">
                  Configure Integrations
               </Button>
           </div>
        </div>
      </div>
    </div>
  );
}

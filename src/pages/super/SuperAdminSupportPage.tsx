import React, { useState } from "react";
import { 
  HelpCircle, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MessageSquare,
  User,
  ArrowRight,
  Plus,
  X,
  Send,
  Mail,
  Building2,
  Bookmark,
  BookOpen,
  Check,
  ChevronRight,
  ArrowUpDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface TicketMessage {
  id: string;
  senderName: string;
  senderRole: 'admin' | 'user';
  message: string;
  createdAt: string;
}

interface InteractiveSupportTicket {
  id: string;
  subject: string;
  user: string;
  email: string;
  school: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  category: 'Billing' | 'Technical' | 'Feature Request' | 'Account' | 'Other';
  message: string;
  messages: TicketMessage[];
  assignedTo: string | null;
}

export function SuperAdminSupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("All Tickets");
  const [sortOption, setSortOption] = useState<"newest" | "priority-desc" | "priority-asc">("newest");
  const [selectedTicket, setSelectedTicket] = useState<InteractiveSupportTicket | null>(null);
  
  // Modals state
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState(false);
  
  // Form state for new ticket
  const [newSubject, setNewSubject] = useState("");
  const [newSchool, setNewSchool] = useState("");
  const [newUser, setNewUser] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCategory, setNewCategory] = useState<'Billing' | 'Technical' | 'Feature Request' | 'Account' | 'Other'>("Technical");
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>("Medium");
  const [newMessageBody, setNewMessageBody] = useState("");

  // Reply compose state
  const [replyText, setReplyText] = useState("");

  // Central Ticket State
  const [tickets, setTickets] = useState<InteractiveSupportTicket[]>([]);

  // Canned custom knowledge-base answers
  const cannedResponses = [
    {
      title: "Subscription & Billing Adjust",
      text: "Regarding pricing tiers, the Eswatini digital equity tier is free for high-density flatlets Care; Standard packages are E800 per term supporting up to 8 staff users, Premium tiers with digital logs are E1200 per term. Checking your registration profile and applying the correct offset..."
    },
    {
      title: "Logo File size Correction",
      text: "For logo and asset rejections, please make sure the file size is strictly under 2MB. If the PNG is too large, save it as a JPEG or downscale resolution. Your sandbox profile prevents larger uploads from finishing."
    },
    {
      title: "Administrative Reset bypass",
      text: "We have successfully initialized a credentials override. The bypass token is now live. Please log in with the temporary passcode: EswatiniPreschools2026 and configure your high-security password immediately."
    }
  ];

  // Live dynamic counting based on ticket states
  const folderCounts = {
    "All Tickets": tickets.length,
    "Priority (High)": tickets.filter(t => t.priority === 'High' || t.priority === 'Critical').length,
    "Unassigned": tickets.filter(t => !t.assignedTo).length,
    "Waiting Reply": tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed' && t.messages[t.messages.length - 1]?.senderRole === 'user').length,
    "Resolved": tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length,
  };

  // Filter & sort tickets to display
  const getFilteredTickets = () => {
    let result = [...tickets];

    // 1. Folder filtering
    if (selectedFolder === "Priority (High)") {
      result = result.filter(t => t.priority === "High" || t.priority === "Critical");
    } else if (selectedFolder === "Unassigned") {
      result = result.filter(t => !t.assignedTo);
    } else if (selectedFolder === "Waiting Reply") {
      result = result.filter(t => t.status !== "Resolved" && t.status !== "Closed" && t.messages[t.messages.length - 1]?.senderRole === 'user');
    } else if (selectedFolder === "Resolved") {
      result = result.filter(t => t.status === "Resolved" || t.status === "Closed");
    }

    // 2. Search filtering
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.id.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.user.toLowerCase().includes(q) ||
        t.school.toLowerCase().includes(q) ||
        t.message.toLowerCase().includes(q)
      );
    }

    // 3. Sorting
    if (sortOption === "newest") {
      result.sort((a, b) => b.id.localeCompare(a.id));
    } else if (sortOption === "priority-desc") {
      const weight = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      result.sort((a, b) => weight[b.priority] - weight[a.priority]);
    } else if (sortOption === "priority-asc") {
      const weight = { Critical: 4, High: 3, Medium: 2, Low: 1 };
      result.sort((a, b) => weight[a.priority] - weight[b.priority]);
    }

    return result;
  };

  const filteredTicketsList = getFilteredTickets();

  // Create manual support ticket handler
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newSchool.trim() || !newUser.trim() || !newMessageBody.trim()) {
      toast.error("Please fill out all required ticket fields.");
      return;
    }

    const tktId = `TKT-${Math.floor(1025 + Math.random() * 900)}`;
    const newTicket: InteractiveSupportTicket = {
      id: tktId,
      subject: newSubject,
      school: newSchool,
      user: newUser,
      email: newEmail || `${newUser.toLowerCase().replace(/\s+/g, '')}@school.sz`,
      priority: newPriority,
      status: "Open",
      createdAt: "Just now",
      category: newCategory,
      assignedTo: null,
      message: newMessageBody,
      messages: [
        {
          id: 'msg-init',
          senderName: newUser,
          senderRole: 'user',
          message: newMessageBody,
          createdAt: 'Just now'
        }
      ]
    };

    setTickets([newTicket, ...tickets]);
    setIsNewTicketOpen(false);
    
    // Reset fields
    setNewSubject("");
    setNewSchool("");
    setNewUser("");
    setNewEmail("");
    setNewCategory("Technical");
    setNewPriority("Medium");
    setNewMessageBody("");

    toast.success(`Ticket ${tktId} generated and loaded into queue!`);
  };

  // Submit response reply
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    const updatedTickets = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        const updatedMsgs = [
          ...t.messages,
          {
            id: `msg-reply-${Date.now()}`,
            senderName: "Super Admin (You)",
            senderRole: 'admin' as const,
            message: replyText,
            createdAt: 'Just now'
          }
        ];
        // Automatically make ticket in_progress if currently open
        const nextStatus = t.status === "Open" ? "In Progress" as const : t.status;
        
        const returnTkt = {
          ...t,
          status: nextStatus,
          messages: updatedMsgs,
          assignedTo: t.assignedTo || "Super Admin" // Auto assign to me on reply
        };
        
        // Keep active detail synchronised
        setSelectedTicket(returnTkt);
        return returnTkt;
      }
      return t;
    });

    setTickets(updatedTickets);
    setReplyText("");
    toast.success("Response sent to school administrative portal.");
  };

  // Update properties of currently selected ticket (Status or Priority)
  const updateTicketProperty = (id: string, updates: Partial<InteractiveSupportTicket>) => {
    const updated = tickets.map(t => {
      if (t.id === id) {
        const next = { ...t, ...updates };
        if (selectedTicket?.id === id) {
          setSelectedTicket(next);
        }
        return next;
      }
      return t;
    });
    setTickets(updated);
    toast.success("Support ticket index updated successfully.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            Platform Support Center
            <Badge className="bg-blue-100 text-blue-800 border-none font-bold text-xs">Admin Central</Badge>
          </h1>
          <p className="text-slate-500 italic text-sm">Centralized help desk tracking child-care hubs, flatlets, and registered school operators.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="rounded-xl border-slate-200 hover:bg-slate-50 flex items-center gap-2 font-bold text-xs"
            onClick={() => setIsKnowledgeBaseOpen(true)}
          >
            <BookOpen className="h-4 w-4 text-blue-500" /> Canned KB Answers
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md font-bold text-xs"
            onClick={() => setIsNewTicketOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Manual Ticket
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Left Folder Index */}
        <div className="space-y-6">
          <Card className="border border-slate-200/60 shadow-sm rounded-2xl">
            <CardHeader className="border-b border-slate-100 p-5">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400 block">Support Folders</span>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-1">
                {[
                  { name: 'All Tickets', key: 'All Tickets', count: folderCounts["All Tickets"], icon: MessageSquare },
                  { name: 'Priority (High)', key: 'Priority (High)', count: folderCounts["Priority (High)"], icon: AlertCircle },
                  { name: 'Unassigned', key: 'Unassigned', count: folderCounts["Unassigned"], icon: User },
                  { name: 'Waiting Reply', key: 'Waiting Reply', count: folderCounts["Waiting Reply"], icon: Clock },
                  { name: 'Resolved', key: 'Resolved', count: folderCounts["Resolved"], icon: CheckCircle2 },
                ].map((folder) => {
                  const isActive = selectedFolder === folder.key;
                  return (
                    <button 
                      key={folder.key} 
                      onClick={() => {
                        setSelectedFolder(folder.key);
                        // Clear selected focus ticket to prevent context collision
                        setSelectedTicket(null);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                        isActive ? 'bg-blue-50 text-blue-600 font-extrabold shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <folder.icon className={`h-4 w-4 ${isActive ? 'text-blue-500' : 'text-slate-400'}`} />
                        <span>{folder.name}</span>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${isActive ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                        {folder.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-250 bg-slate-50/50 p-4 rounded-xl text-left hidden lg:block">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2 mb-2">
              <HelpCircle className="h-4 w-4 text-blue-500" /> Platform SLO Guarantee
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Eswatini preschool and flatlet inquiries have a requested response window of 12 hours. Critical tickets require real-time bypass checkmarks.
            </p>
          </Card>
        </div>

        {/* Tickets Grid / Reply Panel Split */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid md:grid-cols-12 gap-6 items-start">
            {/* List block */}
            <div className={`space-y-4 ${selectedTicket ? 'md:col-span-6' : 'md:col-span-12'}`}>
              <Card className="border border-slate-200/65 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="Search tickets..." 
                      className="pl-10 h-10 rounded-xl border-slate-200 bg-slate-50/60 focus:bg-white text-xs font-semibold"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/50 p-1 rounded-xl">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSortOption("newest")}
                      className={`h-7 px-2.5 rounded-lg text-[10px] font-black uppercase ${sortOption === "newest" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500"}`}
                    >
                      Newest
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSortOption("priority-desc")}
                      className={`h-7 px-2.5 rounded-lg text-[10px] font-black uppercase ${sortOption === "priority-desc" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500"}`}
                    >
                      Priority
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100 max-h-[550px] overflow-y-auto scrollbar-thin">
                    {filteredTicketsList.map((t) => {
                      const isSelected = selectedTicket?.id === t.id;
                      return (
                        <div 
                          key={t.id} 
                          onClick={() => setSelectedTicket(t)}
                          className={`p-5 hover:bg-slate-50/70 transition-all flex items-start gap-4 cursor-pointer relative ${
                            isSelected ? 'bg-blue-50/45 border-l-4 border-l-blue-600' : 'bg-transparent'
                          }`}
                        >
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                            t.status === 'Open' ? 'bg-amber-100 text-amber-700' :
                            t.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            t.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                            'bg-slate-150 text-slate-500'
                          }`}>
                            <MessageSquare className="h-5 w-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="text-[9px] font-black text-slate-400 tracking-tight">{t.id}</span>
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase">{t.category}</span>
                              </div>
                              <Badge variant="outline" className={`border-none text-[8px] font-black uppercase tracking-wider px-2 py-0.5 ${
                                t.priority === 'Critical' ? 'bg-rose-100 text-rose-800' :
                                t.priority === 'High' ? 'bg-red-100 text-red-800' :
                                t.priority === 'Medium' ? 'bg-amber-100 text-amber-800' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {t.priority}
                              </Badge>
                            </div>

                            <h3 className="font-extrabold text-slate-900 text-sm truncate uppercase tracking-tight hover:text-blue-600 transition-colors">
                              {t.subject}
                            </h3>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold text-slate-450 mt-1 uppercase tracking-wider">
                              <span className="flex items-center gap-1 text-slate-500"><Building2 className="h-3 w-3 text-slate-400" /> {t.school}</span>
                              <span className="flex items-center gap-1 text-slate-400"><Clock className="h-3 w-3" /> {t.createdAt}</span>
                              {t.assignedTo && <span className="text-blue-600">👤 {t.assignedTo}</span>}
                            </div>
                          </div>

                          <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 self-center" />
                        </div>
                      );
                    })}

                    {filteredTicketsList.length === 0 && (
                      <div className="p-12 text-center text-slate-450 italic text-xs">
                        <HelpCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                        No support tickets match current filters or searches.
                      </div>
                    )}
                  </div>
                </CardContent>

                <div className="p-4 border-t border-slate-100 text-center bg-slate-50/50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                    Viewing {filteredTicketsList.length} of {tickets.length} tickets • {selectedFolder} Filter
                  </p>
                </div>
              </Card>
            </div>

            {/* Detailed Reply / Conversation panel */}
            {selectedTicket && (
              <div className="md:col-span-6 space-y-4 animate-in slide-in-from-right-4 duration-300">
                <Card className="border border-slate-300 shadow-md rounded-2xl overflow-hidden bg-white">
                  {/* Detailed Panel Header */}
                  <div className="p-4 bg-slate-50 border-b border-slate-200/70 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-blue-600">{selectedTicket.id}</span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          selectedTicket.status === "Open" ? "bg-amber-100 text-amber-800" :
                          selectedTicket.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                          selectedTicket.status === "Resolved" ? "bg-green-100 text-green-800" :
                          "bg-slate-200 text-slate-700"
                        }`}>
                          {selectedTicket.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs truncate mt-0.5">{selectedTicket.subject}</h4>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setSelectedTicket(null)}
                      className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Settings quick toggles (Modify priority and status live!) */}
                  <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 text-xs grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Set Status</label>
                      <select 
                        value={selectedTicket.status}
                        onChange={(e) => updateTicketProperty(selectedTicket.id, { status: e.target.value as any })}
                        className="h-8 w-full px-2 border border-slate-200 rounded-lg font-bold bg-white text-slate-800"
                      >
                        <option value="Open">🔴 Open</option>
                        <option value="In Progress">🔵 In Progress</option>
                        <option value="Resolved">🟢 Resolved</option>
                        <option value="Closed">⚫ Closed</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">Set Priority</label>
                      <select 
                        value={selectedTicket.priority}
                        onChange={(e) => updateTicketProperty(selectedTicket.id, { priority: e.target.value as any })}
                        className="h-8 w-full px-2 border border-slate-200 rounded-lg font-bold bg-white text-slate-800"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">💀 Critical</option>
                      </select>
                    </div>
                  </div>

                  {/* Scrollable Conversation Stream */}
                  <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto bg-slate-100/30 scrollbar-thin">
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-450 border-b border-slate-150 pb-1.5 flex items-center justify-between">
                        <span>Initiated inquiry</span>
                        <span className="text-[9px] text-slate-400 italic">via WebPortal</span>
                      </p>
                      <div className="mt-2 text-xs font-bold text-slate-800">
                        {selectedTicket.message}
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-200/50 text-[9px] font-medium text-slate-450 uppercase flex justify-between">
                        <span>👤 {selectedTicket.user}</span>
                        <span>✉️ {selectedTicket.email}</span>
                      </div>
                    </div>

                    {/* Replies array rendering */}
                    <div className="space-y-3 pt-2">
                      {selectedTicket.messages.map((m, idx) => {
                        const isAdmin = m.senderRole === "admin";
                        return (
                          <div 
                            key={m.id} 
                            className={`flex flex-col max-w-[85%] ${isAdmin ? "ml-auto items-end" : "mr-auto items-start"}`}
                          >
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-wide mb-1 px-1">
                              {m.senderName} • {m.createdAt}
                            </span>
                            <div className={`p-3 rounded-xl text-xs font-bold ${
                              isAdmin 
                                ? "bg-slate-900 text-white rounded-br-none" 
                                : "bg-white border border-slate-200 text-slate-850 rounded-bl-none"
                            }`}>
                              {m.message}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reply Input block */}
                  <form onSubmit={handleSendReply} className="p-4 border-t border-slate-200/80 bg-slate-50">
                    <div className="mb-2 flex items-center justify-between text-[10px] font-black text-slate-450 uppercase">
                      <span>Compose administrative reply</span>
                      <span>Assigns to: Me</span>
                    </div>
                    
                    <textarea 
                      placeholder="Write response message..." 
                      className="w-full min-h-16 p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] text-slate-400 font-bold uppercase">Insert Rapid KB response:</span>
                        <select 
                          className="text-[9px] font-black border border-slate-200 rounded bg-white text-slate-600 px-1 py-0.5"
                          onChange={(e) => {
                            if (e.target.value) {
                              setReplyText(prev => prev + e.target.value);
                              e.target.value = ""; // Clear selec
                            }
                          }}
                        >
                          <option value="">-- Choose template --</option>
                          {cannedResponses.map((cr, i) => (
                            <option key={i} value={cr.text}>{cr.title}</option>
                          ))}
                        </select>
                      </div>

                      <Button 
                        type="submit" 
                        size="sm" 
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg px-3.5 h-8 flex items-center gap-1 shadow-sm"
                        disabled={!replyText.trim()}
                      >
                        <Send className="h-3.5 w-3.5" /> Dispatch
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manual Ticket creation modal template dialog */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <Card className="max-w-md w-full border border-slate-200 shadow-2xl rounded-2xl bg-white overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black text-slate-950 uppercase tracking-wider">Generate Support Ticket</CardTitle>
                <CardDescription className="text-xs text-slate-500">Manual dispatch of inquiry to central administrative queue.</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsNewTicketOpen(false)}
                className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Requester Name *</label>
                  <Input 
                    required
                    placeholder="e.g. Sipho Mamba"
                    className="h-9 text-xs font-medium rounded-lg border-slate-200"
                    value={newUser}
                    onChange={(e) => setNewUser(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Requester Email</label>
                  <Input 
                    type="email"
                    placeholder="sipho@mamba.sz"
                    className="h-9 text-xs font-medium rounded-lg border-slate-200"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Institution/Preschool *</label>
                  <Input 
                    required
                    placeholder="e.g. Mbabane Creative"
                    className="h-9 text-xs font-medium rounded-lg border-slate-200"
                    value={newSchool}
                    onChange={(e) => setNewSchool(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Category</label>
                  <select 
                    className="h-9 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 px-2 font-medium"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                  >
                    <option value="Technical">Technical Support</option>
                    <option value="Billing">Billing / Invoicing</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Account">Account Security</option>
                    <option value="Other">Other Inquiries</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Priority Selection</label>
                <select 
                  className="h-9 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 px-2 font-medium"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Critical">Critical (Immediate SLA)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Subject Heading *</label>
                <Input 
                  required
                  placeholder="Summary of specific issue..."
                  className="h-9 text-xs font-medium rounded-lg border-slate-200"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Detailed Message *</label>
                <textarea 
                  required
                  placeholder="Draft client issue description..."
                  className="w-full min-h-20 p-2 text-xs font-medium border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-950"
                  value={newMessageBody}
                  onChange={(e) => setNewMessageBody(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsNewTicketOpen(false)}
                  className="h-9 rounded-lg text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white h-9 rounded-lg text-xs font-bold px-4"
                >
                  Launch Ticket
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Knowledge Base Overlay Canned responses information panel */}
      {isKnowledgeBaseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <Card className="max-w-lg w-full border border-slate-200 shadow-2xl rounded-2xl bg-white overflow-hidden animate-in zoom-in-95 duration-200 text-left">
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black text-slate-950 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500" /> Canned KB Knowledge Panel
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">Quick template answers tailored to recurring Eswatini preschool platform concerns.</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsKnowledgeBaseOpen(false)}
                className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin">
              {cannedResponses.map((item, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-250 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider">{item.title}</span>
                    <Button 
                      size="xs" 
                      variant="outline" 
                      onClick={() => {
                        // If reply is focused, append it
                        setReplyText(prev => prev + item.text);
                        setIsKnowledgeBaseOpen(false);
                        toast.success("Boilerplate injected into dispatcher compose area!");
                      }}
                      className="text-[9px] font-black uppercase text-blue-600 border-none hover:bg-blue-50"
                    >
                      Use as Reply
                    </Button>
                  </div>
                  <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
              <Button 
                onClick={() => setIsKnowledgeBaseOpen(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg px-4 h-9"
              >
                Close Panel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

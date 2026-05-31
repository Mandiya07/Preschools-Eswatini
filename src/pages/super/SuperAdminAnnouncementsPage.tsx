import React, { useState } from "react";
import { toast } from "sonner";
import {
  Megaphone,
  Plus,
  Search,
  MoreHorizontal,
  Users,
  Send,
  Eye,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SuperAdminAnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const [announcements, setAnnouncements] = useState<any[]>([]);

  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("All");
  const [newPriority, setNewPriority] = useState("Normal");
  const [newStatus, setNewStatus] = useState("Active");
  const [newBody, setNewBody] = useState("");

  const handleCreateBroadcast = () => {
    if (!newTitle.trim()) {
      toast.error("Please enter a broadcast title.");
      return;
    }
    const newAnn = {
      id: String(Date.now()),
      title: newTitle,
      target: newTarget,
      priority: newPriority,
      status: newStatus,
      sentAt: newStatus === "Active" ? "Just now" : "Scheduled",
      engagement: newStatus === "Active" ? "0 views" : "-",
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    toast.success(`Broadcast "${newTitle}" created successfully!`);
    setIsComposerOpen(false);
    // Reset form
    setNewTitle("");
    setNewTarget("All");
    setNewPriority("Normal");
    setNewStatus("Active");
    setNewBody("");
  };

  const handleDeleteAnnouncement = (id: string, title: string) => {
    setAnnouncements((prev) => prev.filter((ann) => ann.id !== id));
    toast.success(`Broadcast "${title}" has been deleted.`);
  };

  const handleUpdateStatus = (id: string, updatedStatus: string) => {
    setAnnouncements((prev) =>
      prev.map((ann) => {
        if (ann.id === id) {
          return { ...ann, status: updatedStatus };
        }
        return ann;
      }),
    );
    toast.success(`Broadcast status updated to ${updatedStatus}.`);
  };

  const filteredAnnouncements = announcements.filter(
    (ann) =>
      ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ann.priority.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Platform Broadcast
          </h1>
          <p className="text-slate-500 italic text-sm">
            Send global announcements to school admins and parents across
            Eswatini.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl border-slate-200"
            onClick={() => toast.info("Historical broadcast logs coming soon.")}
          >
            View History
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-100"
            onClick={() => setIsComposerOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> New Broadcast
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-white border-b border-slate-50 p-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Find broadcasts..."
                  className="pl-10 h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {filteredAnnouncements.map((ann, i) => (
                  <div
                    key={ann.id}
                    className="p-6 hover:bg-slate-50/50 transition-all flex items-start gap-4"
                  >
                    <div
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        ann.priority === "High" || ann.priority === "Urgent"
                          ? "bg-red-50 text-red-600"
                          : ann.priority === "Normal"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-green-50 text-green-600"
                      }`}
                    >
                      <Megaphone className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-slate-900 truncate uppercase tracking-tight">
                          {ann.title}
                        </h3>
                        <Badge
                          className={`${
                            ann.status === "Active"
                              ? "bg-green-100 text-green-600"
                              : ann.status === "Scheduled"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-slate-100 text-slate-400"
                          } border-none text-[10px] uppercase font-black`}
                        >
                          {ann.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 Ital">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> {ann.target}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {ann.sentAt}
                        </span>
                        <span className="flex items-center gap-1 text-blue-600">
                          <Eye className="h-3 w-3" /> {ann.engagement}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-blue-600"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 rounded-xl border-slate-200 shadow-xl p-1 bg-white"
                        >
                          <DropdownMenuItem
                            className="rounded-lg gap-2 cursor-pointer font-bold text-xs py-2 px-3 hover:bg-slate-50"
                            onClick={() => handleUpdateStatus(ann.id, "Active")}
                          >
                            Set Active
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="rounded-lg gap-2 cursor-pointer font-bold text-xs py-2 px-3 hover:bg-slate-50"
                            onClick={() =>
                              handleUpdateStatus(ann.id, "Completed")
                            }
                          >
                            Mark Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="rounded-lg gap-2 cursor-pointer font-bold text-xs py-2 px-3 hover:bg-slate-50"
                            onClick={() =>
                              handleUpdateStatus(ann.id, "Scheduled")
                            }
                          >
                            Set Scheduled
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-50" />
                          <DropdownMenuItem
                            className="rounded-lg gap-2 cursor-pointer font-bold text-xs py-2 px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() =>
                              handleDeleteAnnouncement(ann.id, ann.title)
                            }
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
                {filteredAnnouncements.length === 0 && (
                  <div className="p-8 text-center text-slate-400 italic text-xs">
                    No broadcasts found matching your search.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-slate-900 text-white">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest">
                Platform Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Email Delivery
                </p>
                <p className="text-sm font-black text-white">0%</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Push Open Rate
                </p>
                <p className="text-sm font-black text-white">0%</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Unsubscribes
                </p>
                <p className="text-sm font-black text-white">0%</p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 font-black uppercase tracking-tighter shadow-lg shadow-blue-900/40"
                  onClick={() =>
                    toast.info("Detailed analytics dashboard coming soon.")
                  }
                >
                  Detailed Analytics
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm h-fit">
            <CardHeader className="border-b border-slate-50">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">
                Broadcast Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-4">
                {[
                  "Announcements are sent immediately unless scheduled.",
                  "Use 'Urgent' priority only for system-wide outages.",
                  "Attach images/PDFs to increase engagement.",
                  "Target specific roles to reduce notification fatigue.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {isComposerOpen && (
        <Dialog open={true} onOpenChange={(open) => !open && setIsComposerOpen(false)}>
          <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-6 text-left">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-slate-900">Create New Platform Broadcast</DialogTitle>
              <DialogDescription className="text-slate-500 text-sm">
                Instantly broadcast messages to preschools, parents, or staff country-wide.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Announcement Title</label>
                <Input 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. System Maintenance This Sunday"
                  className="rounded-xl border-slate-200 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Target Audience</label>
                  <select
                    value={newTarget}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewTarget(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-slate-900"
                  >
                    <option value="All">All Users</option>
                    <option value="SchoolAdmins">School Admins</option>
                    <option value="Parents">Parents Only</option>
                    <option value="Suppliers">Suppliers Hub</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Priority Level</label>
                  <select
                    value={newPriority}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewPriority(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-slate-900"
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Publish Status</label>
                <select
                  value={newStatus}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewStatus(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-slate-900"
                >
                  <option value="Active">Active (Send Immediately)</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Message Body / Content</label>
                <textarea
                  value={newBody}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewBody(e.target.value)}
                  placeholder="Draft your detailed announcement body here..."
                  className="w-full min-h-24 p-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-slate-900"
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2 justify-end pt-2">
              <Button type="button" variant="outline" className="rounded-xl border-slate-200 font-bold" onClick={() => setIsComposerOpen(false)}>
                Cancel
              </Button>
              <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold" onClick={handleCreateBroadcast}>
                <Send className="h-4 w-4 mr-2" /> Send Broadcast
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { 
  Building2, 
  Users, 
  CreditCard, 
  TrendingUp, 
  Plus, 
  Search, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  BarChart3, 
  Filter, 
  ArrowRight, 
  LayoutDashboard, 
  List, 
  MessageSquare, 
  Clock, 
  Send, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Globe, 
  Database,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  FileText,
  UserCheck,
  Map,
  X,
  Share2,
  Bookmark,
  ChevronRight,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie,
  Legend
} from 'recharts';
import { subscribeToCollection, createDocument, updateDocument, deleteDocument } from "@/lib/firestoreUtils";
import { toast } from "sonner";

// Enum for Lead Stages
type LeadStage = 'discovery' | 'contacted' | 'demo_scheduled' | 'proposal_sent' | 'negotiation' | 'won' | 'lost';

interface Interaction {
  id: string;
  date: string;
  type: 'call' | 'email' | 'meeting' | 'demo' | 'whatsapp' | 'other';
  summary: string;
  outcome: string;
}

interface SalesLead {
  id?: string;
  preschoolName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  region: 'Hhohho' | 'Manzini' | 'Shiselweni' | 'Lubombo';
  town: string;
  websiteStatus: 'none' | 'outdated' | 'has_active';
  leadStage: LeadStage;
  targetSubscriptionTier: 'Starter - E199.00' | 'Standard - E399.00' | 'Professional - E699.00' | 'Enterprise - E1,499.00';
  estimatedValue: number;
  notes: string;
  nextFollowUp: string;
  interactions: Interaction[];
  createdAt: string;
  updatedAt: string;
}

const STAGE_CONFIGS: Record<LeadStage, { label: string; color: string; bg: string; border: string }> = {
  discovery: { label: 'Discovery', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' },
  contacted: { label: 'Contacted', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  demo_scheduled: { label: 'Demo Scheduled', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  proposal_sent: { label: 'Proposal Sent', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  negotiation: { label: 'Negotiation', color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' },
  won: { label: 'Won & Onboarded', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  lost: { label: 'Lost Prospect', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
};

const REGIONS = ['Hhohho', 'Manzini', 'Shiselweni', 'Lubombo'] as const;


export function SuperAdminSalesCRMPage() {
  const [leads, setLeads] = useState<SalesLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedStage, setSelectedStage] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"kanban" | "table" | "analytics">("kanban");
  
  // Lead Add / Edit states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<SalesLead | null>(null);
  
  // Form fields
  const [preschoolName, setPreschoolName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [leadRegion, setLeadRegion] = useState<'Hhohho' | 'Manzini' | 'Shiselweni' | 'Lubombo'>("Hhohho");
  const [leadTown, setLeadTown] = useState("");
  const [websiteStatus, setWebsiteStatus] = useState<'none' | 'outdated' | 'has_active'>("none");
  const [leadStage, setLeadStage] = useState<LeadStage>("discovery");
  const [targetTier, setTargetTier] = useState<'Starter - E199.00' | 'Standard - E399.00' | 'Professional - E699.00' | 'Enterprise - E1,499.00'>("Professional - E699.00");
  const [leadNotes, setLeadNotes] = useState("");
  const [nextFollowUp, setNextFollowUp] = useState("");
  
  // Lead Details Drawer/Modal
  const [selectedLeadDetails, setSelectedLeadDetails] = useState<SalesLead | null>(null);
  const [newInteractionType, setNewInteractionType] = useState<'call' | 'email' | 'meeting' | 'demo' | 'whatsapp' | 'other'>("call");
  const [newInteractionSummary, setNewInteractionSummary] = useState("");
  const [newInteractionOutcome, setNewInteractionOutcome] = useState("");

  // Auto School Provisioning state
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [leadToProvision, setLeadToProvision] = useState<SalesLead | null>(null);

  useEffect(() => {
    // Real-time listener for sales leads from Firestore
    const unsub = subscribeToCollection("sales_leads", (data) => {
      setLeads((data as SalesLead[]) || []);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Automatic clean up of demo/preloaded leads from live Firestore database
  useEffect(() => {
    const demoLeadNames = [
      "Siphofaneni Tiny Tots Academy",
      "Ezulwini Valley Pre-Primary",
      "Mbabane Heights Kindergarten",
      "Nhlangano Sunbeams Playgroup",
      "Manzini Central Early Learning",
      "Big Bend Sugar Nursery",
      "Siteki Stars Early Academy"
    ];
    leads.forEach(async (lead) => {
      if (lead.id && demoLeadNames.includes(lead.preschoolName)) {
        try {
          await deleteDocument("sales_leads", lead.id);
          console.log(`Auto-removed demo lead from DB: ${lead.preschoolName}`);
        } catch (e) {
          console.error("Failed to delete demo lead:", e);
        }
      }
    });
  }, [leads]);

  const handleOpenAddForm = () => {
    setEditingLead(null);
    setPreschoolName("");
    setContactName("");
    setContactPhone("");
    setContactEmail("");
    setLeadRegion("Hhohho");
    setLeadTown("");
    setWebsiteStatus("none");
    setLeadStage("discovery");
    setTargetTier("Professional - E699.00");
    setLeadNotes("");
    setNextFollowUp(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (lead: SalesLead) => {
    setEditingLead(lead);
    setPreschoolName(lead.preschoolName);
    setContactName(lead.contactName);
    setContactPhone(lead.contactPhone);
    setContactEmail(lead.contactEmail);
    setLeadRegion(lead.region);
    setLeadTown(lead.town);
    setWebsiteStatus(lead.websiteStatus);
    setLeadStage(lead.leadStage);
    setTargetTier(lead.targetSubscriptionTier as any || "Professional - E699.00");
    setLeadNotes(lead.notes);
    setNextFollowUp(lead.nextFollowUp || "");
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preschoolName || !leadTown) {
      toast.error("Please fill in the Preschool Name and Town");
      return;
    }

    // Determine estimated value based on selected subscription tier
    let estimatedVal = 699;
    if (targetTier === "Starter - E199.00") estimatedVal = 199;
    else if (targetTier === "Standard - E399.00") estimatedVal = 399;
    else if (targetTier === "Enterprise - E1,499.00") estimatedVal = 1499;

    const leadData: Omit<SalesLead, 'id'> = {
      preschoolName,
      contactName,
      contactPhone,
      contactEmail,
      region: leadRegion,
      town: leadTown,
      websiteStatus,
      leadStage,
      targetSubscriptionTier: targetTier,
      estimatedValue: estimatedVal,
      notes: leadNotes,
      nextFollowUp,
      interactions: editingLead ? editingLead.interactions : [],
      createdAt: editingLead ? editingLead.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingLead && editingLead.id) {
        await updateDocument("sales_leads", editingLead.id, leadData);
        toast.success(`Updated lead details for "${preschoolName}" successfully!`);
        
        // Refresh detail view if open
        if (selectedLeadDetails?.id === editingLead.id) {
          setSelectedLeadDetails({ id: editingLead.id, ...leadData });
        }
      } else {
        await createDocument("sales_leads", null, leadData);
        toast.success(`Created new sales lead for "${preschoolName}"!`);
      }
      setIsFormOpen(false);
      setEditingLead(null);
    } catch (err) {
      toast.error("Failed to save sales lead.");
      console.error(err);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (confirm("Are you sure you want to permanently delete this sales lead?")) {
      try {
        await deleteDocument("sales_leads", leadId);
        toast.success("Lead successfully removed from pipeline.");
        if (selectedLeadDetails?.id === leadId) {
          setSelectedLeadDetails(null);
        }
      } catch (err) {
        toast.error("Failed to delete lead.");
      }
    }
  };

  const handleUpdateStageDirectly = async (lead: SalesLead, newStage: LeadStage) => {
    if (!lead.id) return;
    try {
      await updateDocument("sales_leads", lead.id, {
        leadStage: newStage,
        updatedAt: new Date().toISOString()
      });
      toast.success(`Lead stage changed to ${STAGE_CONFIGS[newStage].label}`);
      
      // If changed to Won, prompt school provisioning
      if (newStage === 'won') {
        setLeadToProvision(lead);
        setShowProvisionModal(true);
      }
    } catch (err) {
      toast.error("Failed to update pipeline stage.");
    }
  };

  const handleAddInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadDetails || !selectedLeadDetails.id) return;
    if (!newInteractionSummary) {
      toast.error("Please add a brief summary of the interaction");
      return;
    }

    const newInteraction: Interaction = {
      id: `int-${Date.now()}`,
      date: new Date().toISOString(),
      type: newInteractionType,
      summary: newInteractionSummary,
      outcome: newInteractionOutcome
    };

    const updatedInteractions = [newInteraction, ...(selectedLeadDetails.interactions || [])];

    try {
      await updateDocument("sales_leads", selectedLeadDetails.id, {
        interactions: updatedInteractions,
        updatedAt: new Date().toISOString()
      });
      
      setSelectedLeadDetails({
        ...selectedLeadDetails,
        interactions: updatedInteractions,
        updatedAt: new Date().toISOString()
      });
      
      setNewInteractionSummary("");
      setNewInteractionOutcome("");
      toast.success("Log interaction registered!");
    } catch (err) {
      toast.error("Failed to add interaction log.");
    }
  };

  // Convert Lead to Active School System
  const handleProvisionSchool = async () => {
    if (!leadToProvision) return;
    try {
      // 1. Create a corresponding school entry
      const schoolId = `school-${Math.random().toString(36).substr(2, 9)}`;
      const schoolData = {
        name: leadToProvision.preschoolName,
        institutionType: "Preschool",
        country: "Eswatini",
        region: leadToProvision.region,
        town: leadToProvision.town,
        phone: leadToProvision.contactPhone,
        email: leadToProvision.contactEmail,
        verified: true,
        featured: false,
        ownerId: 'super_admin_seed', // Default owner until claimed, or pre-registered
        description: `Premium preschool offering early education. Managed subscription via Eswatini Web Builder.`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subscriptionStatus: leadToProvision.targetSubscriptionTier.includes("Enterprise") ? "active" : "pending"
      };

      await createDocument("schools", schoolId, schoolData);

      // 2. Provision default WebsiteConfig
      await createDocument("websites", null, {
        schoolId: schoolId,
        template: "preschool_playful",
        primaryColor: "#2563EB",
        secondaryColor: "#10B981",
        fontFamily: "Inter",
        headline: `Welcome to ${leadToProvision.preschoolName}`,
        subheadline: "Where every little step represents a giant leap in learning and play",
        logoUrl: "",
        published: true,
        createdAt: new Date().toISOString()
      });

      // 3. Mark lead as updated with active school identifier
      await updateDocument("sales_leads", leadToProvision.id!, {
        notes: `${leadToProvision.notes}\n\n[SYSTEM] Provisioned as active School ID: ${schoolId} on ${new Date().toLocaleDateString()}`,
        updatedAt: new Date().toISOString()
      });

      toast.success(`Successfully provisioned "${leadToProvision.preschoolName}" into live system and built parent template!`);
      setShowProvisionModal(false);
      setLeadToProvision(null);
    } catch (err) {
      toast.error("Failed to complete automatic school provisioning.");
      console.error(err);
    }
  };

  // Filter Leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.preschoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.town.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRegion = selectedRegion === "All" || lead.region === selectedRegion;
    const matchesStage = selectedStage === "All" || lead.leadStage === selectedStage;

    return matchesSearch && matchesRegion && matchesStage;
  });

  // Analytics Math
  const totalLeads = leads.length;
  const potentialPipeValue = leads
    .filter(l => l.leadStage !== 'lost' && l.leadStage !== 'won')
    .reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
  
  const wonLeads = leads.filter(l => l.leadStage === 'won');
  const wonValue = wonLeads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads.length / totalLeads) * 100) : 0;

  // Pipeline Chart Data
  const stages: LeadStage[] = ['discovery', 'contacted', 'demo_scheduled', 'proposal_sent', 'negotiation', 'won', 'lost'];
  const barChartData = stages.map(stage => {
    const count = leads.filter(l => l.leadStage === stage).length;
    const value = leads.filter(l => l.leadStage === stage).reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
    return {
      name: STAGE_CONFIGS[stage].label,
      count,
      value: value // value per term in Lilangeni (E)
    };
  });

  // Regional Distribution
  const pieChartData = REGIONS.map(region => {
    const count = leads.filter(l => l.region === region).length;
    const value = leads.filter(l => l.region === region).reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
    return {
      name: region,
      value: count,
      monetaryValue: value
    };
  });

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-8" id="sales-crm-root">
      
      {/* Upper Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 uppercase font-black tracking-widest text-[10px]">
              Eswatini Expansion
            </Badge>
            <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
            <span className="text-xs text-slate-500 font-mono">Platform Admin</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Preschool Sales CRM
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">
            Track, nurture, and automate subscription sales for preschool custom website builders. Currently managing outreach to local schools across the Kingdom.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={handleOpenAddForm} 
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-100 font-bold text-sm"
          >
            <Plus className="h-4 w-4" /> Add New Lead
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-2xl border-slate-200/80 shadow-sm overflow-hidden" id="metric-total-leads">
          <CardHeader className="p-6 pb-2 space-y-0 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Leads</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-3xl font-black text-slate-900">{totalLeads}</div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">Discovered across Eswatini</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-sm overflow-hidden" id="metric-active-pipe">
          <CardHeader className="p-6 pb-2 space-y-0 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Pipe Value</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-3xl font-black text-slate-900">E{potentialPipeValue} <span className="text-xs font-normal text-slate-400">/term</span></div>
            <p className="text-[10px] text-amber-600 font-bold mt-1 uppercase tracking-wider">Unclosed Opportunities</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-sm overflow-hidden" id="metric-won-value">
          <CardHeader className="p-6 pb-2 space-y-0 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recurring Revenue Won</span>
            <div className="p-2 rounded-xl bg-green-50 text-green-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-3xl font-black text-green-600">E{wonValue} <span className="text-xs font-normal text-slate-400">/term</span></div>
            <p className="text-[10px] text-green-600 font-bold mt-1 uppercase tracking-wider">Active paying accounts</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/80 shadow-sm overflow-hidden" id="metric-conv-rate">
          <CardHeader className="p-6 pb-2 space-y-0 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Conversion Rate</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-3xl font-black text-blue-600">{conversionRate}%</div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">{wonLeads.length} of {totalLeads} prospects onboarded</p>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === "kanban" 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" /> Kanban Board
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === "table" 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <List className="h-3.5 w-3.5" /> Lead Directory
            </button>
            <button
              onClick={() => setViewMode("analytics")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === "analytics" 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" /> Performance Stats
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search name, contact, town..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-200 text-xs focus:bg-white w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs px-3 font-semibold text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="All">All Regions</option>
                {REGIONS.map(reg => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>

              {viewMode !== "kanban" && (
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="h-10 rounded-xl border-slate-200 bg-slate-50 text-xs px-3 font-semibold text-slate-700 outline-none focus:border-blue-500"
                >
                  <option value="All">All Stages</option>
                  {stages.map(st => (
                    <option key={st} value={st}>{STAGE_CONFIGS[st].label}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Main View Render */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mb-3" />
          <p className="text-xs text-slate-500 font-mono">Synchronizing pipeline status...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-4xl mx-auto p-8">
          <LayoutDashboard className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-black text-slate-800">No Sales Leads Discovered</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-2">
            Build your Eswatini preschool subscription sales pipeline. Start adding manual leads or use the Social & Directory Lead Scraper to identify opportunities dynamically.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={handleOpenAddForm} className="bg-blue-600 text-white font-bold rounded-xl text-xs">
              <Plus className="h-4 w-4" /> Add First Lead
            </Button>
          </div>
        </div>
      ) : viewMode === "kanban" ? (
        
        /* ---------------- KANBAN BOARD ---------------- */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4 items-start">
          {stages.map(stage => {
            const stageLeads = filteredLeads.filter(l => l.leadStage === stage);
            const stageValue = stageLeads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
            const conf = STAGE_CONFIGS[stage];
            
            return (
              <div key={stage} className="bg-slate-50 rounded-2xl border border-slate-200/70 p-4 flex flex-col min-h-[500px]">
                
                {/* Column Header */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight truncate max-w-[120px]">
                    {conf.label}
                  </h3>
                  <Badge className={`${conf.bg} ${conf.color} font-mono text-[10px] rounded-md px-1.5 py-0.5`}>
                    {stageLeads.length}
                  </Badge>
                </div>

                <div className="text-[10px] text-slate-400 font-bold mb-4 font-mono">
                  E{stageValue} term val
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {stageLeads.map(lead => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLeadDetails(lead)}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow transition-all cursor-pointer group space-y-3 relative overflow-hidden"
                    >
                      {/* Left color bar indicator */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${conf.color.replace('text', 'bg')}`} />

                      <div>
                        <h4 className="text-xs font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors truncate">
                          {lead.preschoolName}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                          <MapPin className="h-3 w-3 text-slate-300" />
                          <span>{lead.town}, {lead.region}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] border-t border-slate-100 pt-2.5 mt-2">
                        <span className="font-mono text-slate-500 font-bold">
                          E{lead.estimatedValue}
                        </span>
                        
                        <Badge variant="outline" className="text-[9px] scale-90 origin-right rounded-md bg-slate-50">
                          {lead.targetSubscriptionTier.split(' - ')[0]}
                        </Badge>
                      </div>

                      {/* Follow-up Indicator */}
                      {lead.nextFollowUp && lead.leadStage !== 'won' && lead.leadStage !== 'lost' && (
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-500 bg-slate-50 rounded px-1.5 py-1 mt-2 w-fit">
                          <Clock className="h-2.5 w-2.5 text-amber-500" />
                          <span>Next: {new Date(lead.nextFollowUp).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="text-center py-8 text-slate-300 text-[10px] border-2 border-dashed border-slate-200 rounded-xl">
                      Drag / Move here
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : viewMode === "table" ? (
        
        /* ---------------- TABLE VIEW ---------------- */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                  <th className="p-4 pl-6">Preschool</th>
                  <th className="p-4">Contact Person</th>
                  <th className="p-4">Region / Town</th>
                  <th className="p-4">Website Need</th>
                  <th className="p-4">Stage</th>
                  <th className="p-4">Target Tier</th>
                  <th className="p-4 text-right">Est. Value</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredLeads.map(lead => {
                  const conf = STAGE_CONFIGS[lead.leadStage];
                  return (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 pl-6 font-black text-slate-900">
                        <div className="flex flex-col">
                          <span className="hover:text-blue-600 cursor-pointer" onClick={() => setSelectedLeadDetails(lead)}>{lead.preschoolName}</span>
                          <span className="text-[10px] text-slate-400 font-normal">Discovered: {new Date(lead.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 font-medium">
                        <div className="flex flex-col">
                          <span>{lead.contactName || "Unassigned"}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{lead.contactPhone}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-500 font-bold">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{lead.town} ({lead.region})</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant="outline" 
                          className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                            lead.websiteStatus === 'none' 
                              ? 'bg-red-50 text-red-700 border-red-100' 
                              : lead.websiteStatus === 'outdated' 
                              ? 'bg-amber-50 text-amber-700 border-amber-100' 
                              : 'bg-green-50 text-green-700 border-green-100'
                          }`}
                        >
                          {lead.websiteStatus === 'none' ? 'No Website' : lead.websiteStatus === 'outdated' ? 'Outdated Site' : 'Active Site'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={`${conf.bg} ${conf.color} border ${conf.border} text-[10px] rounded-lg font-bold px-2 py-0.5`}>
                          {conf.label}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-600 font-semibold">
                        {lead.targetSubscriptionTier}
                      </td>
                      <td className="p-4 text-right font-mono font-black text-slate-800">
                        E{lead.estimatedValue}
                      </td>
                      <td className="p-4 pr-6 text-right space-x-1.5 whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setSelectedLeadDetails(lead)} 
                          className="h-8 w-8 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenEditForm(lead)} 
                          className="h-8 w-8 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteLead(lead.id!)} 
                          className="h-8 w-8 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        
        /* ---------------- ANALYTICS & STATS ---------------- */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Stage Values and Counts */}
          <Card className="rounded-2xl border-slate-200/80 shadow-sm">
            <CardHeader className="p-6">
              <CardTitle className="text-base font-black text-slate-900 uppercase tracking-tight">Outreach Pipeline Value (SZL)</CardTitle>
              <CardDescription className="text-xs text-slate-400">Total estimated Term Revenue value allocated per pipeline stage</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `E${v}`} />
                    <Tooltip formatter={(value) => [`E${value}`, 'Term Value']} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {barChartData.map((entry, index) => {
                        // Matching pipeline color mapping
                        const keys = Object.keys(STAGE_CONFIGS);
                        const colors = ['#64748B', '#2563EB', '#8B5CF6', '#F59E0B', '#EC4899', '#10B981', '#EF4444'];
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Regional Leads Distribution */}
          <Card className="rounded-2xl border-slate-200/80 shadow-sm">
            <CardHeader className="p-6">
              <CardTitle className="text-base font-black text-slate-900 uppercase tracking-tight">Preschool Geolocation Leads</CardTitle>
              <CardDescription className="text-xs text-slate-400">Distribution of prospective website sales leads across Eswatini regions</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 flex flex-col md:flex-row items-center gap-6 justify-center">
              <div className="h-64 w-64 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val, name, props) => [`${val} preschools (E${props.payload.monetaryValue})`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3.5 flex-1">
                {pieChartData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-xs font-bold text-slate-700">{entry.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-black text-slate-900">{entry.value} leads</span>
                      <p className="text-[10px] text-slate-400 font-mono">E{entry.monetaryValue} pipe</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      )}

      {/* ---------------- DRAWERS & MODALS ---------------- */}

      {/* 1. Add / Edit Lead Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between bg-slate-50 p-5 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
                {editingLead ? "Edit Sales Lead Details" : "Register New Eswatini Preschool Lead"}
              </h3>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-full" onClick={() => setIsFormOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">Preschool Name *</label>
                  <Input
                    required
                    placeholder="e.g. Mbabane Heights Kindergarten"
                    value={preschoolName}
                    onChange={(e) => setPreschoolName(e.target.value)}
                    className="h-11 rounded-xl text-xs border-slate-200 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">Region (Eswatini) *</label>
                    <select
                      value={leadRegion}
                      onChange={(e) => setLeadRegion(e.target.value as any)}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 text-xs px-3 font-semibold text-slate-700 focus:bg-white outline-none focus:border-blue-500"
                    >
                      {REGIONS.map(reg => (
                        <option key={reg} value={reg}>{reg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">Town / Area *</label>
                    <Input
                      required
                      placeholder="e.g. Ezulwini"
                      value={leadTown}
                      onChange={(e) => setLeadTown(e.target.value)}
                      className="h-11 rounded-xl text-xs border-slate-200 bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">Contact Name</label>
                    <Input
                      placeholder="e.g. Sibusiso Dlamini"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="h-11 rounded-xl text-xs border-slate-200 bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">Contact Phone</label>
                    <Input
                      placeholder="e.g. +268 7602 1234"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="h-11 rounded-xl text-xs border-slate-200 bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">Contact Email</label>
                  <Input
                    type="email"
                    placeholder="e.g. director@preschool.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="h-11 rounded-xl text-xs border-slate-200 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">Current Website Need</label>
                    <select
                      value={websiteStatus}
                      onChange={(e) => setWebsiteStatus(e.target.value as any)}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 text-xs px-3 font-semibold text-slate-700 focus:bg-white outline-none focus:border-blue-500"
                    >
                      <option value="none">Has No Website</option>
                      <option value="outdated">Outdated / Legacy Website</option>
                      <option value="has_active">Has active website (Migration)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">Pipeline Stage</label>
                    <select
                      value={leadStage}
                      onChange={(e) => setLeadStage(e.target.value as any)}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 text-xs px-3 font-semibold text-slate-700 focus:bg-white outline-none focus:border-blue-500"
                    >
                      {stages.map(st => (
                        <option key={st} value={st}>{STAGE_CONFIGS[st].label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">Target Subscription</label>
                    <select
                      value={targetTier}
                      onChange={(e) => setTargetTier(e.target.value as any)}
                      className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 text-xs px-3 font-semibold text-slate-700 focus:bg-white outline-none focus:border-blue-500"
                    >
                      <option value="Starter - E199.00">Starter - E199.00</option>
                      <option value="Standard - E399.00">Standard - E399.00</option>
                      <option value="Professional - E699.00">Professional - E699.00</option>
                      <option value="Enterprise - E1,499.00">Enterprise - E1,499.00</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">Next Follow-Up Date</label>
                    <Input
                      type="date"
                      value={nextFollowUp}
                      onChange={(e) => setNextFollowUp(e.target.value)}
                      className="h-11 rounded-xl text-xs border-slate-200 bg-slate-50 focus:bg-white text-slate-700 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1.5">Discovery Notes / Background</label>
                  <textarea
                    rows={3}
                    placeholder="Provide details about their current parent-teacher communication, problems with current solutions, or special requirements..."
                    value={leadNotes}
                    onChange={(e) => setLeadNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 text-xs p-3 focus:bg-white outline-none focus:border-blue-500 text-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} className="rounded-xl text-xs font-bold">
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs px-6 shadow-lg shadow-blue-100">
                  {editingLead ? "Update Lead Details" : "Add Lead to Pipeline"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Lead Detailed Interactions View Drawer */}
      {selectedLeadDetails && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50">
          <div className="bg-white w-full max-w-xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <Badge className={`${STAGE_CONFIGS[selectedLeadDetails.leadStage].bg} ${STAGE_CONFIGS[selectedLeadDetails.leadStage].color} border border-slate-200 text-[10px] rounded`}>
                    {STAGE_CONFIGS[selectedLeadDetails.leadStage].label}
                  </Badge>
                  <span className="text-[10px] font-mono text-slate-400">ID: {selectedLeadDetails.id?.substring(0, 8)}...</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1">{selectedLeadDetails.preschoolName}</h3>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-xl text-slate-500 hover:text-slate-800 border-slate-200"
                  onClick={() => handleOpenEditForm(selectedLeadDetails)}
                  title="Edit details"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-slate-400 hover:text-slate-600"
                  onClick={() => setSelectedLeadDetails(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Core Information Grid */}
              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200/60 space-y-3.5">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Prospect Profile</h4>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Contact Person</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      {selectedLeadDetails.contactName || "None assigned"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Telephone Number</span>
                    <span className="font-mono text-slate-700 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {selectedLeadDetails.contactPhone || "No telephone"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Email Address</span>
                    <span className="text-slate-700 break-all flex items-center gap-1.5 font-medium">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {selectedLeadDetails.contactEmail || "No email"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Eswatini Town</span>
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {selectedLeadDetails.town} ({selectedLeadDetails.region})
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200/60 pt-3 mt-3 grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Target Tier</span>
                    <span className="font-bold text-blue-600 font-mono">
                      {selectedLeadDetails.targetSubscriptionTier}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Next Scheduled Action</span>
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {selectedLeadDetails.nextFollowUp ? new Date(selectedLeadDetails.nextFollowUp).toLocaleDateString() : "No follow-up set"}
                    </span>
                  </div>
                </div>

                {selectedLeadDetails.notes && (
                  <div className="border-t border-slate-200/60 pt-3 text-xs">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase mb-1">Notes / Context</span>
                    <p className="text-slate-600 bg-white p-3 rounded-xl border border-slate-100 text-xs italic leading-relaxed whitespace-pre-wrap">
                      "{selectedLeadDetails.notes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Status Action Workflow bar */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Advance Stage</h4>
                <div className="flex flex-wrap gap-2">
                  {stages.map(st => {
                    const isActive = selectedLeadDetails.leadStage === st;
                    return (
                      <button
                        key={st}
                        onClick={() => handleUpdateStageDirectly(selectedLeadDetails, st)}
                        className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
                          isActive 
                            ? "bg-slate-900 text-white border-slate-900 shadow-sm scale-105" 
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {STAGE_CONFIGS[st].label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interaction Logger Form */}
              <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 space-y-4">
                <h4 className="text-[10px] font-black uppercase text-blue-700 tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-blue-600" /> Log Interaction Call/Note
                </h4>

                <form onSubmit={handleAddInteraction} className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Channel</label>
                      <select
                        value={newInteractionType}
                        onChange={(e) => setNewInteractionType(e.target.value as any)}
                        className="w-full h-9 rounded-lg border border-slate-200 bg-white text-xs px-2 font-bold text-slate-700 outline-none focus:border-blue-500"
                      >
                        <option value="call">☎️ Phone Call</option>
                        <option value="email">✉️ Email</option>
                        <option value="meeting">🤝 Meeting</option>
                        <option value="demo">💻 Live Demo</option>
                        <option value="whatsapp">📱 WhatsApp</option>
                        <option value="other">📝 Note</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Key Outcome</label>
                      <Input
                        placeholder="e.g. Scheduled meeting, waiting on board approval..."
                        value={newInteractionOutcome}
                        onChange={(e) => setNewInteractionOutcome(e.target.value)}
                        className="h-9 rounded-lg text-xs border-slate-200 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Summary of Discussion</label>
                    <textarea
                      rows={2}
                      placeholder="Write brief notes about what was discussed..."
                      value={newInteractionSummary}
                      onChange={(e) => setNewInteractionSummary(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white text-xs p-2.5 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs gap-1">
                      <Send className="h-3 w-3" /> Log Interaction
                    </Button>
                  </div>
                </form>
              </div>

              {/* Interaction Log History timeline */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Interaction History</h4>
                
                <div className="space-y-4 relative pl-3 border-l border-slate-100 ml-1.5">
                  {(selectedLeadDetails.interactions || []).length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No historical activities registered for this lead. Log your first outreach call above.</p>
                  ) : (
                    selectedLeadDetails.interactions.map((act) => (
                      <div key={act.id} className="relative space-y-1.5">
                        
                        {/* Timeline Bullet */}
                        <div className="absolute -left-[16.5px] top-1.5 h-2 w-2 rounded-full bg-slate-400 border border-white" />

                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-[9px] scale-95 origin-left uppercase font-mono font-bold">
                            {act.type}
                          </Badge>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(act.date).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-slate-800">
                          {act.summary}
                        </div>

                        {act.outcome && (
                          <div className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit">
                            Outcome: {act.outcome}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 3. Automatic School Onboarding Provisioning Modal */}
      {showProvisionModal && leadToProvision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-green-50 p-6 border-b border-green-100 flex items-start gap-4">
              <div className="p-3 bg-green-500 rounded-2xl text-white">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <Badge className="bg-green-200 text-green-800 border-green-300 font-bold mb-1">Deal Won 🎉</Badge>
                <h3 className="text-base font-black text-slate-900">Auto-Provision Website System</h3>
                <p className="text-xs text-slate-500 mt-1">
                  You have successfully sold a website subscription to <strong>{leadToProvision.preschoolName}</strong>! 
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Clicking provision will automatically trigger the platform onboarding logic to instantly register this preschool as an active school inside our database, and build a beautiful, published, responsive portal template for them.
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between"><span className="font-bold">Preschool:</span> <span className="font-mono">{leadToProvision.preschoolName}</span></div>
                <div className="flex justify-between"><span className="font-bold">Contact Name:</span> <span>{leadToProvision.contactName}</span></div>
                <div className="flex justify-between"><span className="font-bold">Region/Town:</span> <span className="font-bold text-slate-600">{leadToProvision.town} ({leadToProvision.region})</span></div>
                <div className="flex justify-between"><span className="font-bold">Selected Subscription:</span> <span className="font-mono font-bold text-blue-600">{leadToProvision.targetSubscriptionTier}</span></div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => { setShowProvisionModal(false); setLeadToProvision(null); }} className="rounded-xl text-xs font-bold">
                  Skip for Now
                </Button>
                <Button onClick={handleProvisionSchool} className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs px-5 shadow-lg shadow-green-100 gap-2">
                  <UserCheck className="h-4 w-4" /> Provision Active School
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

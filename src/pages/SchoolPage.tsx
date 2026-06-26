import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Calendar, 
  ChevronLeft, 
  Clock, 
  MapPin, 
  MessageSquare, 
  Phone, 
  Star,
  CheckCircle2,
  Image as ImageIcon,
  Users,
  PlayCircle,
  Facebook,
  Instagram,
  Twitter,
  Globe,
  Mail,
  Loader2,
  ShieldCheck,
  Award,
  Info,
  BookOpenText,
  LayoutGrid,
  ClipboardCheck,
  Users as UserGroup,
  Share2,
  Link2,
  Check,
  GraduationCap
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { fetchDocument } from "@/lib/firestoreUtils";
import { School } from "@/types";
import { InquiryForm } from "@/components/InquiryForm";
import { AdmissionForm } from "@/components/admissions/AdmissionForm";
import { ClaimSchoolModal } from "@/components/ClaimSchoolModal";
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

const API_KEY =
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';


import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix generic Leaflet marker icon issue
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export function SchoolPage() {
  const { id } = useParams();
  const [school, setSchool] = useState<School | null>(null);
  const [websiteConfig, setWebsiteConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showFacilityModal, setShowFacilityModal] = useState(false);
  const [newFacilityName, setNewFacilityName] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const handleCopyUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share && school) {
      try {
        await navigator.share({
          title: `${school.name} | Preschools Eswatini`,
          text: `Check out ${school.name} on Preschools Eswatini!`,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      setShowShareModal(true); // Fallback to custom modal
    }
  };

  const handleAddFacility = () => {
    if (newFacilityName.trim() && school) {
        setSchool({...school, facilities: [...school.facilities, newFacilityName]});
        setNewFacilityName("");
        setShowFacilityModal(false);
    }
  };

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      let schoolData: School | null = null;
      let configData: any = null;

      try {
        schoolData = await fetchDocument('schools', id) as School | null;
        
        // If not found in Firestore, check preloaded schools
        if (!schoolData) {
          const { PRELOADED_SCHOOLS } = await import("@/data/preloadedSchools");
          schoolData = PRELOADED_SCHOOLS.find(s => s.id === id) || null;
        } else {
           // If found in Firestore, check if it's also a preloaded school
           const { PRELOADED_SCHOOLS } = await import("@/data/preloadedSchools");
           const preloaded = PRELOADED_SCHOOLS.find(s => s.id === id);
           if (preloaded) {
             // If preloaded, ensure it's visible, merge properties but prioritize preloaded active status if necessary
             schoolData = { ...preloaded, ...schoolData };
             if (schoolData.subscriptionStatus !== 'active' && preloaded.subscriptionStatus === 'active') {
                schoolData.subscriptionStatus = 'active';
             }
           }
        }
        
        configData = await fetchDocument('websites', id);
        
        setSchool(schoolData);
        setWebsiteConfig(configData);
      } catch (err: any) {
        console.warn("Failed to fetch from Firestore", err);
        try {
          const errDetail = JSON.parse(err.message);
          if (errDetail.error.includes("timed out")) {
             setError("Connection Error: The database is taking too long to respond. Please check your internet or retry later.");
          } else {
             setError(errDetail.error);
          }
        } catch (e) {
          setError(err.message || "An unexpected error occurred while loading the profile.");
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-medium text-lg">Loading school profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
        <div className="bg-red-50 p-12 rounded-[3rem] border border-red-100 max-w-md">
          <Info className="h-16 w-16 text-red-600 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-slate-900 mb-4">Connection Issue</h1>
          <p className="text-slate-600 mb-8 font-medium italic">
            {error}
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => window.location.reload()} className="rounded-2xl h-12 px-8 font-bold shadow-lg shadow-blue-100" size="lg">
              Retry Connection
            </Button>
            <Button asChild variant="ghost" className="rounded-2xl h-12 px-8 font-bold">
              <Link to="/directory">Return to Directory</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isPubliclyVisible = school && (!school.ownerId || school.ownerId === 'super_admin_seed' || school.subscriptionStatus === 'active');

  if (!school || !isPubliclyVisible) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 text-center">
        <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 max-w-md">
          <ShieldCheck className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-slate-900 mb-4">Profile Unavailable</h1>
          <p className="text-slate-600 mb-8 font-medium italic">
            This school profile is currently being registered or claimed and is awaiting activation by the administrator.
          </p>
          <Button asChild className="rounded-2xl h-12 px-8 font-bold shadow-lg shadow-blue-100" size="lg">
            <Link to="/directory">Return to Directory</Link>
          </Button>
        </div>
      </div>
    );
  }

  const programsList = school.programs || [];
  const facilitiesList = school.facilities || [];
  const admissionsDetailsList = school.admissionsDetails || [];
  const galleryList = (school.gallery || []).filter(img => !img.includes('unsplash.com'));
  const staffList = (school.staff || []).map(member => ({
    ...member,
    image: member.image?.includes('unsplash.com') ? null : member.image
  }));

  const isHeroPlaceholder = school.heroImage?.includes('unsplash.com');

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: websiteConfig?.fontFamily || 'inherit' }}>
      <SEO 
        title={`${school.name} | Preschools Eswatini`}
        description={`Learn more about ${school.name} in ${school.town}, ${school.region}. Discover their curriculum, facilities, and contact information.`}
        image={school.heroImage}
        schema={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": school.name,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": school.town,
            "addressRegion": school.region,
            "addressCountry": "SZ"
          },
          "telephone": school.phone,
          "email": school.email,
          "image": school.heroImage,
          "description": school.description
        }}
      />

      {/* Dynamic Navigation Sub-Header */}
      <div className="bg-slate-50 border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="text-slate-300">/</span>
            <Link to="/directory" className="hover:text-blue-600 transition-colors">Directory</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold truncate max-w-[150px] sm:max-w-[280px]">{school.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNativeShare}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors bg-white hover:bg-slate-50 px-3 sm:px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
            >
              <Share2 className="h-4 w-4" /> <span className="hidden sm:inline">Share Profile</span>
            </button>
            <Link 
              to="/directory" 
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50/80 hover:bg-blue-100/80 px-3 sm:px-4 py-2 rounded-xl border border-blue-100/50 shadow-xs"
              id="nav-back-directory-link"
            >
              <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back to Directory</span><span className="sm:hidden">Back</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative h-[400px] md:h-[500px]">
        <div className="absolute inset-0">
          {!isHeroPlaceholder && school.heroImage ? (
            <img src={school.heroImage} className="h-full w-full object-cover" alt={school.name} />
          ) : (
            <div className="h-full w-full bg-slate-50 flex items-center justify-center p-8">
               <img src="/logo-512.png" className="h-full w-full max-h-64 object-contain opacity-40" alt="Preschools Eswatini" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
        </div>
        
        <div className="absolute inset-0">
          <div className="mx-auto h-full max-w-7xl px-4 flex flex-col justify-end pb-12 sm:px-6 lg:px-8">
            <Link to="/directory" className="mb-6 inline-flex items-center text-sm font-medium text-slate-200 hover:text-white backdrop-blur-sm bg-slate-900/30 px-3 py-1.5 rounded-full w-fit transition-colors">
              <ChevronLeft className="mr-1 h-4 w-4" /> Back to Directory
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="rounded-full px-3 py-1 text-xs font-semibold text-white uppercase tracking-wider" style={{ backgroundColor: websiteConfig?.primaryColor || '#2563eb' }}>
                    {school.curriculum}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-yellow-400 font-medium bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                    <Star className="h-4 w-4 fill-current" /> {school.rating} ({school.reviews} reviews)
                  </div>
                  {school.verified && (
                    <div className="flex items-center gap-1 text-sm text-blue-400 font-medium bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                      <CheckCircle2 className="h-4 w-4 text-blue-400" /> Verified
                    </div>
                  )}
                </div>
                {websiteConfig?.images?.find((img: any) => img.target === 'School Logo') && (
                  <img 
                    src={websiteConfig.images.find((img: any) => img.target === 'School Logo').url} 
                    alt="School Logo" 
                    className="h-24 w-auto mb-4 object-contain bg-white/10 rounded p-2" 
                  />
                )}
                <h1 className="text-3xl font-extrabold text-white sm:text-5xl lg:text-6xl mb-2 leading-tight">
                  {websiteConfig?.headline || school.name}
                </h1>
                <p className="flex items-center text-lg text-slate-200">
                  <MapPin className="mr-2 h-5 w-5" /> {websiteConfig?.contactAddress || `${school.address}, ${school.town}, ${school.region}`}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 h-12" onClick={() => setShowApplyModal(true)}>
                  Apply Now
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 h-12 bg-transparent backdrop-blur-sm" onClick={() => setShowInquiryModal(true)}>
                  <MessageSquare className="mr-2 h-4 w-4" /> Message School
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 h-12 bg-transparent backdrop-blur-sm" onClick={() => setShowShareModal(true)}>
                  <Share2 className="mr-2 h-4 w-4" /> Share Page
                </Button>
                {!school.claimed && (
                  <Button size="lg" variant="secondary" className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold h-12 shadow-md shadow-amber-900/20" onClick={() => setShowClaimModal(true)}>
                    <ShieldCheck className="mr-2 h-5 w-5" /> Claim Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <Tabs defaultValue="about" className="w-full">
              <div className="border-b border-slate-200 mb-8 overflow-x-auto">
                <TabsList className="bg-transparent h-12 w-full justify-start gap-4">
                  <TabsTrigger value="about" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-1 text-sm font-medium">About</TabsTrigger>
                  {programsList.length > 0 && <TabsTrigger value="programs" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-1 text-sm font-medium">Programs</TabsTrigger>}
                  {facilitiesList.length > 0 && <TabsTrigger value="facilities" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-1 text-sm font-medium">Facilities</TabsTrigger>}
                  {admissionsDetailsList.length > 0 && <TabsTrigger value="admissions" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-1 text-sm font-medium">Admissions</TabsTrigger>}
                  {staffList.length > 0 && <TabsTrigger value="team" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-1 text-sm font-medium">Team</TabsTrigger>}
                  {galleryList.length > 0 && <TabsTrigger value="gallery" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-1 text-sm font-medium">Gallery</TabsTrigger>}
                  {school.videoUrl && <TabsTrigger value="video" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-1 text-sm font-medium">Video</TabsTrigger>}
                  <TabsTrigger value="contact" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-1 text-sm font-medium">Contact</TabsTrigger>
                  <TabsTrigger value="parent-portal" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-1 text-sm font-medium">Parent Portal</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="about" className="space-y-12">
                 {/* Trust & Verification */}
                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                      <ShieldCheck className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Trust & Verification</h2>
                      <p className="text-slate-500">How we ensure quality & safety.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                          <CheckCircle2 className={`h-8 w-8 mb-2 ${school.verified ? 'text-blue-600' : 'text-slate-300'}`} />
                          <span className="font-bold text-slate-900">{school.verified ? 'Verified' : 'Unverified'}</span>
                          <span className="text-xs text-slate-500">Ministry Approved</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                          <Star className="h-8 w-8 text-yellow-400 mb-2 fill-current" />
                          <span className="font-bold text-slate-900">{school.rating} / 5</span>
                          <span className="text-xs text-slate-500">{school.reviews} Reviews</span>
                      </div>
                  </div>
                </section>

                <section className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Info className="h-6 w-6 text-blue-600" /> About Our School
                    </h2>
                    <div className="text-lg text-slate-700 leading-relaxed bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                      <p>{school.description}</p>
                      {school.mission && (
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <strong className="text-slate-900 block mb-2">Our Mission:</strong> 
                          <p className="text-slate-600 italic">"{school.mission}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 text-lg">Quick Facts</h3>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between pb-2 border-b">
                         <span className="text-slate-500">Type</span>
                         <span className="font-medium text-slate-900">{school.boarding}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b">
                         <span className="text-slate-500">Curriculum</span>
                         <span className="font-medium text-slate-900">{school.curriculum}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b">
                         <span className="text-slate-500">Age Groups</span>
                         <span className="font-medium text-slate-900">{school.ageGroups?.join(', ') || '3 - 6 Years'}</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b">
                         <span className="text-slate-500">Termly Fee</span>
                         <span className="font-medium text-slate-900">E{school.feePerTerm}</span>
                      </div>
                    </div>
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="programs">
                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Educational Programs</h2>
                      <p className="text-slate-500 text-sm">Age-appropriate groups and curriculum details.</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6 font-sans">
                    {programsList.map((program, i) => (
                      <div key={i} className="rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all bg-white relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
                        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                          <GraduationCap className="h-5.5 w-5.5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{program.name}</h3>
                        <p className="text-xs font-bold text-blue-600 mb-3 bg-blue-50/60 px-2.5 py-1 rounded-lg w-fit">{program.age}</p>
                        <p className="text-slate-600 text-sm leading-relaxed">{program.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="facilities">
                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                        <LayoutGrid className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">Campus Facilities</h2>
                        <p className="text-slate-500 text-sm">Safe, modern spaces crafted for student interaction.</p>
                      </div>
                    </div>
                    <Button variant="outline" className="rounded-xl font-semibold text-xs py-1.5 h-9 border-slate-200" onClick={() => setShowFacilityModal(true)}>
                      + Add Facility
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {facilitiesList.map((facility, i) => (
                      <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        </div>
                        <span className="font-semibold text-slate-700 text-sm">{facility}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="admissions">
                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <ClipboardCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Admissions Information</h2>
                      <p className="text-slate-500 text-sm">Key requirements and steps to enroll your child.</p>
                    </div>
                  </div>
                  <div className="bg-blue-50/40 rounded-2xl p-6 border border-blue-100">
                    <h3 className="font-bold text-blue-900 mb-4 text-base">Required Enrollment Documents:</h3>
                    <ul className="space-y-3.5 mb-6">
                      {admissionsDetailsList.map((detail, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-700 text-sm leading-relaxed font-sans">
                          <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5 bg-white p-1 rounded-full border border-blue-200" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-6 border-t border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                       <div>
                         <span className="block text-xs uppercase font-bold tracking-wider text-slate-400">Termly Tuition Fee</span>
                         <span className="text-2xl font-black text-slate-900">E{school.feePerTerm} <span className="text-xs text-slate-500 font-medium">/ Term</span></span>
                       </div>
                       <Button onClick={() => setShowApplyModal(true)} className="rounded-xl font-bold h-11 px-6 shadow-sm">
                         Start Preschool Application
                       </Button>
                    </div>
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="team">
                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Meet Our Educators & Caregivers</h2>
                      <p className="text-slate-500 text-sm">Dedicated role-models leading child success.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staffList.map((member, i) => (
                      <div 
                        key={i} 
                        className="bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-blue-200 p-6 rounded-2xl text-center shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col items-center" 
                        onClick={() => setSelectedStaff(member)}
                      >
                        <div className="relative h-24 w-24 rounded-full border-2 border-slate-100 overflow-hidden mb-4 group-hover:border-blue-500 transition-colors shadow-sm">
                           {member.image ? (
                             <img src={member.image} alt={member.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
                           ) : (
                             <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400">
                               <Users className="h-10 w-10" />
                             </div>
                           )}
                        </div>
                        <h4 className="font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{member.name}</h4>
                        <p className="text-xs font-semibold text-blue-600 mt-1 bg-blue-50/60 px-2.5 py-0.5 rounded-full w-fit">{member.role}</p>
                        <span className="text-[10px] text-slate-400 mt-4 underline group-hover:text-slate-600">View Bio</span>
                      </div>
                    ))}
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="gallery">
                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">School Photo Gallery</h2>
                      <p className="text-slate-500 text-sm">A visual preview of daily learning and activities.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryList.map((img, i) => (
                      <div key={i} className="aspect-square rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden relative group shadow-sm hover:shadow-md transition-all">
                        <img src={img} alt={`Campus view ${i + 1}`} className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-black/40 px-2 py-1 rounded backdrop-blur-xs">Campus Photo</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="video">
                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <PlayCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Video Tour</h2>
                      <p className="text-slate-500 text-sm">Step inside our classrooms virtually.</p>
                    </div>
                  </div>
                  {school.videoUrl ? (
                    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg aspect-video w-full">
                        <iframe src={school.videoUrl} className="w-full h-full" title="School Video" allowFullScreen />
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-12 flex flex-col items-center justify-center text-slate-500 shadow-inner group transition-all">
                        <PlayCircle className="h-16 w-16 text-slate-300 group-hover:text-blue-500 transition-colors mb-4" />
                        <span className="font-bold text-slate-700">Video Tour Coming Soon</span>
                        <span className="text-xs text-slate-400 mt-1 max-w-xs text-center">We are currently recording and producing our high-definition campus trailer video.</span>
                    </div>
                  )}
                </section>
              </TabsContent>

              <TabsContent value="contact">
                <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Direct Contact Details</h2>
                      <p className="text-slate-500 text-sm">Reach the admissions office on the phone or over email.</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-4 font-sans text-sm">
                        <p className="text-slate-600 leading-relaxed">Have specific inquiries regarding fees, schedules, or transport? Reach out to the {school.name} team immediately.</p>
                        <ul className="space-y-3.5 pt-2">
                           <li className="flex items-center gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                             <Phone className="h-5 w-5 text-blue-600" />
                             <div>
                               <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Phone Number</span>
                               <a href={`tel:${school.phone}`} className="font-bold text-slate-900 hover:text-blue-600 transition-all">{school.phone}</a>
                             </div>
                           </li>
                           <li className="flex items-center gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                             <Mail className="h-5 w-5 text-blue-600" />
                             <div>
                               <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Address</span>
                               <a href={`mailto:${school.email}`} className="font-bold text-slate-900 hover:text-blue-600 transition-all">{school.email}</a>
                             </div>
                           </li>
                         </ul>
                    </div>
                    <div className="bg-slate-50/50 border border-slate-100 p-6 rounded-2xl flex flex-col justify-center text-center">
                       <h3 className="font-bold text-slate-800 text-lg mb-2">Send an Instant Inquiry</h3>
                       <p className="text-xs text-slate-500 mb-5">Would you prefer to type your inquiry online? Tap below to open our interactive messenger form.</p>
                       <Button onClick={() => setShowInquiryModal(true)} className="w-full h-11 rounded-xl font-bold shadow-sm">
                         Message Admissions Desk
                       </Button>
                    </div>
                  </div>
                </section>
              </TabsContent>

               <TabsContent value="parent-portal">
                 <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                   <h2 className="text-2xl font-bold text-slate-900 mb-6">Parent Portal</h2>
                   <p className="text-slate-600">Access secure information regarding your child's progress, school notices, and fees. Login to get started.</p>
                   <Button className="mt-4">Login to Parent Portal</Button>
                 </section>
               </TabsContent>
            </Tabs>
            
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-slate-900 text-lg mb-6">Information</h3>
              
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-50 p-2 text-blue-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Address</h4>
                    <p className="text-sm text-slate-500">{websiteConfig?.contactAddress || school.address}<br/>{school.town}, {school.region}</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-50 p-2 text-blue-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Operating Hours</h4>
                    <p className="text-sm text-slate-500">Mon - Fri: {school.hours}</p>
                    <p className="text-sm text-slate-500">Sat, Sun: Closed</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-50 p-2 text-blue-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Phone</h4>
                    <a href={`tel:${websiteConfig?.contactPhone || school.phone}`} className="text-sm text-slate-500 hover:text-blue-600 cursor-pointer block">
                      {websiteConfig?.contactPhone || school.phone}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-50 p-2 text-blue-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Email</h4>
                    <a href={`mailto:${websiteConfig?.contactEmail || school.email}`} className="text-sm text-slate-500 hover:text-blue-600 cursor-pointer block">
                      {websiteConfig?.contactEmail || school.email}
                    </a>
                  </div>
                </li>
              </ul>

              {/* Social Media Links */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex gap-3 justify-center">
                 {school.socialMedia?.facebook && (
                   <a href={school.socialMedia.facebook} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                     <Facebook className="h-5 w-5" />
                   </a>
                 )}
                 {school.socialMedia?.instagram && (
                   <a href={school.socialMedia.instagram} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-pink-100 hover:text-pink-600 transition-colors">
                     <Instagram className="h-5 w-5" />
                   </a>
                 )}
                 {school.socialMedia?.twitter && (
                   <a href={school.socialMedia.twitter} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-sky-100 hover:text-sky-500 transition-colors">
                     <Twitter className="h-5 w-5" />
                   </a>
                 )}
                 {school.socialMedia?.website && (
                   <a href={school.socialMedia.website} target="_blank" rel="noreferrer" className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
                     <Globe className="h-5 w-5" />
                   </a>
                 )}
                 <a href={`mailto:${school.email}`} className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
                    <Mail className="h-5 w-5" />
                 </a>
              </div>

              {/* Google Maps Interactive */}
              <div className="mt-6 rounded-xl overflow-hidden border border-slate-200 h-64 bg-slate-100 relative">
                {hasValidKey ? (
                  <APIProvider apiKey={API_KEY} version="weekly">
                    <Map
                      defaultCenter={school.coordinates || {lat: -26.315, lng: 31.136}}
                      defaultZoom={12}
                      mapId="SCHOOL_MAP_ID"
                      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                      style={{width: '100%', height: '100%'}}
                    >
                      {school.coordinates && (
                        <AdvancedMarker position={school.coordinates}>
                          <Pin background="#4285F4" glyphColor="#fff" />
                        </AdvancedMarker>
                      )}
                    </Map>
                  </APIProvider>
                ) : (
                  <div className="h-full w-full relative">
                    <MapContainer 
                      center={school.coordinates ? [school.coordinates.lat, school.coordinates.lng] : [-26.315, 31.136]} 
                      zoom={13} 
                      style={{ height: '100%', width: '100%' }}
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {school.coordinates && (
                        <Marker position={[school.coordinates.lat, school.coordinates.lng]}>
                          <Popup>{school.name}</Popup>
                        </Marker>
                      )}
                    </MapContainer>
                    <div className="absolute top-2 right-2 z-[500] bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md border border-slate-200 shadow-sm">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Guest Mode (OSM)</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <Button className="w-full h-11 text-base shadow-sm" onClick={() => setShowInquiryModal(true)}>Contact School</Button>
                <div className="text-center text-xs text-slate-400 mt-2 flex items-center justify-center gap-1">
                   Powered by <Building2 className="h-3 w-3 mx-1"/> Preschools Eswatini
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="share-modal-root">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              id="share-modal-backdrop"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden p-8 z-10"
              id="share-modal-container"
            >
              <button 
                onClick={() => setShowShareModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
                title="Close Share Modal"
                id="share-modal-close-btn"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="mb-6 text-center">
                <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Share2 className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Share {school.name}</h2>
                <p className="text-slate-500 text-xs mt-1 leading-normal">Spread the word about this preschool with your friends & family!</p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-600 truncate select-all flex-1 pr-2 font-mono">{shareUrl}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopyUrl}
                    className={`shrink-0 font-bold text-xs h-8 px-3 rounded-xl transition-all ${copied ? 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100' : 'hover:bg-slate-100 border-slate-200 text-slate-700'}`}
                    id="copy-share-url-btn"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1 text-emerald-500 animate-bounce" /> Copied
                      </>
                    ) : (
                      <>
                        <Link2 className="h-3.5 w-3.5 mr-1" /> Copy Link
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a 
                    href={`mailto:?subject=${encodeURIComponent(`Check out ${school.name} on Preschools Eswatini`)}&body=${encodeURIComponent(`Hi,\n\nI thought you might be interested in ${school.name} in ${school.town}, ${school.region}. You can view their profile here:\n\n${shareUrl}`)}`}
                    className="flex flex-col items-center justify-center gap-2 p-4 text-xs font-semibold rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-blue-200 transition-all text-center group"
                    id="share-email-link"
                  >
                    <Mail className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
                    <span>Email Page</span>
                  </a>

                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-2 p-4 text-xs font-semibold rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-blue-200 transition-all text-center group"
                    id="share-facebook-link"
                  >
                    <Facebook className="h-5 w-5 text-[#1877F2] group-hover:scale-110 transition-transform" />
                    <span>Facebook</span>
                  </a>

                  <a 
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out ${school.name} on Preschools Eswatini!`)}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-2 p-4 text-xs font-semibold rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-blue-200 transition-all text-center group"
                    id="share-twitter-link"
                  >
                    <Twitter className="h-5 w-5 text-[#1DA1F2] group-hover:scale-110 transition-transform" />
                    <span>Twitter / X</span>
                  </a>

                  <a 
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${school.name} on Preschools Eswatini: ${shareUrl}`)}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-2 p-4 text-xs font-semibold rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-emerald-200 transition-all text-center group"
                    id="share-whatsapp-link"
                  >
                    <Phone className="h-5 w-5 text-[#25D366] group-hover:scale-110 transition-transform" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInquiryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInquiryModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-8"
            >
              <button 
                onClick={() => setShowInquiryModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                title="Close Modal"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Inquire at {school.name}</h2>
                <p className="text-slate-500">Fill out the form below and the admissions team will get back to you shortly.</p>
              </div>

              <InquiryForm 
                schoolId={school.id} 
                schoolName={school.name}
                adminEmail={school.email}
                onSuccess={() => setShowInquiryModal(false)} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApplyModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl"
            >
              <AdmissionForm 
                schoolId={school.id} 
                schoolName={school.name}
                onSuccess={() => setShowApplyModal(false)}
                onCancel={() => setShowApplyModal(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showFacilityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFacilityModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
            >
               <button onClick={() => setShowFacilityModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                  <X className="h-6 w-6" />
               </button>
               <h3 className="text-2xl font-bold mb-6">Add New Facility</h3>
               <div className="space-y-4">
                 <input 
                    type="text" 
                    value={newFacilityName} 
                    onChange={(e) => setNewFacilityName(e.target.value)} 
                    placeholder="Facility name (e.g. Playground)" 
                    className="w-full p-3 border rounded-lg"
                 />
                 <Button onClick={handleAddFacility} className="w-full">Add Facility</Button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStaff(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 flex flex-col items-center"
            >
               <button onClick={() => setSelectedStaff(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                  <X className="h-6 w-6" />
               </button>
               <div className="h-32 w-32 rounded-full overflow-hidden mb-6 bg-slate-100">
                  {selectedStaff.image ? (
                     <img src={selectedStaff.image} alt={selectedStaff.name} className="h-full w-full object-cover" />
                  ) : (
                     <div className="h-full w-full flex items-center justify-center text-slate-400">
                       <Users className="h-16 w-16" />
                     </div>
                  )}
               </div>
               <h3 className="text-2xl font-bold mb-1">{selectedStaff.name}</h3>
               <p className="text-blue-600 font-medium mb-4">{selectedStaff.role}</p>
               <p className="text-slate-500 text-center">No further information is available for this team member at the moment.</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showClaimModal && school && (
        <ClaimSchoolModal 
          school={school} 
          onClose={() => setShowClaimModal(false)} 
        />
      )}
    </div>
  );
}



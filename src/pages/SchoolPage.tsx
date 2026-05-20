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
  Users as UserGroup
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { fetchDocument } from "@/lib/firestoreUtils";
import { MOCK_SCHOOLS } from "@/data/schools";
import { School } from "@/types";
import { InquiryForm } from "@/components/InquiryForm";
import { AdmissionForm } from "@/components/admissions/AdmissionForm";
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

const API_KEY =
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export function SchoolPage() {
  const { id } = useParams();
  const [school, setSchool] = useState<School | null>(null);
  const [websiteConfig, setWebsiteConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      
      let schoolData: School | null = null;
      let configData: any = null;

      try {
        schoolData = await fetchDocument('schools', id) as School | null;
        configData = await fetchDocument('websites', id);
      } catch (err) {
        console.warn("Failed to fetch from Firestore", err);
      }

      if (!schoolData) {
        try {
          const response = await fetch('/api/schools');
          const allSchools = await response.json();
          schoolData = allSchools.find((s: School) => s.id === id) || null;
        } catch(e) {
          console.error("Error fetching from API", e);
        }
        
        if (!schoolData) {
          schoolData = MOCK_SCHOOLS.find((s: School) => s.id === id) || null;
        }
      }

      setSchool(schoolData);
      setWebsiteConfig(configData);
      setLoading(false);
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

  if (!school) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">School not found</h1>
        <Button asChild>
          <Link to="/directory">Return to Directory</Link>
        </Button>
      </div>
    );
  }

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
          "description": school.about
        }}
      />
      {/* Hero Header */}
      <div className="relative h-[400px] md:h-[500px]">
        <div className="absolute inset-0">
          <img src={school.heroImage} className="h-full w-full object-cover" alt={school.name} />
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
                  <TabsTrigger value="programs" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-1 text-sm font-medium">Programs</TabsTrigger>
                  <TabsTrigger value="facilities" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-1 text-sm font-medium">Facilities</TabsTrigger>
                  <TabsTrigger value="admissions" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-1 text-sm font-medium">Admissions</TabsTrigger>
                  <TabsTrigger value="team" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-1 text-sm font-medium">Team</TabsTrigger>
                  <TabsTrigger value="gallery" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-1 text-sm font-medium">Gallery</TabsTrigger>
                  <TabsTrigger value="video" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-1 text-sm font-medium">Video</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="about" className="space-y-12">
                 {/* Trust & Verification */}
                <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Trust & Verification</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                            <CheckCircle2 className={`h-8 w-8 mb-2 ${school.verified ? 'text-blue-600' : 'text-slate-300'}`} />
                            <span className="font-bold text-slate-900">{school.verified ? 'Verified' : 'Unverified'}</span>
                            <span className="text-xs text-slate-500">Ministry Approved</span>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                            <Star className="h-8 w-8 text-yellow-400 mb-2 fill-current" />
                            <span className="font-bold text-slate-900">{school.rating} / 5</span>
                            <span className="text-xs text-slate-500">{school.reviews} Reviews</span>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                            <ShieldCheck className="h-8 w-8 text-emerald-500 mb-2" />
                            <span className="font-bold text-slate-900">High</span>
                            <span className="text-xs text-slate-500">Safety Score</span>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                            <Award className="h-8 w-8 text-amber-500 mb-2" />
                            <span className="font-bold text-slate-900">A+</span>
                            <span className="text-xs text-slate-500">Accreditation</span>
                        </div>
                    </div>
                </section>

                <section className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">About Our School</h2>
                    <div className="text-lg text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                      <p>{school.description}</p>
                      <div>
                        <strong className="text-slate-900">Mission:</strong> {school.mission}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4">Quick Facts</h3>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                         <span className="text-slate-500">Type</span>
                         <span className="font-medium text-slate-900">{school.boarding}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-slate-500">Curriculum</span>
                         <span className="font-medium text-slate-900">{school.curriculum}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-slate-500">Age Groups</span>
                         <span className="font-medium text-slate-900">{school.ageGroups.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="programs">
                {school.programs.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Educational Programs</h2>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {school.programs.map((program, i) => (
                        <div key={i} className="rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
                          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <GraduationCap className="h-6 w-6" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">{program.name}</h3>
                          <p className="text-sm font-medium text-blue-600 mb-3 bg-blue-50 px-2 py-0.5 rounded w-fit">{program.age}</p>
                          <p className="text-slate-600 text-sm leading-relaxed">{program.desc}</p>
                          <div className="mt-4 pt-4 border-t border-slate-100">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Available Daily</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </TabsContent>

              <TabsContent value="facilities">
                {school.facilities.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Campus Facilities</h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {school.facilities.map((facility, i) => (
                        <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                          <span className="font-medium text-slate-700">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </TabsContent>

              <TabsContent value="admissions">
                {school.admissionsDetails.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Admissions Information</h2>
                    <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                      <ul className="space-y-3">
                        {school.admissionsDetails.map((detail, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-700">
                            <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 pt-6 border-t border-blue-100 flex items-center justify-between">
                         <div>
                           <span className="block text-sm text-slate-500">Termly Fee (Approx)</span>
                           <span className="text-xl font-bold text-slate-900">E{school.feePerTerm}</span>
                         </div>
                         <Button onClick={() => setShowApplyModal(true)}>Start Application</Button>
                      </div>
                    </div>
                  </section>
                )}
              </TabsContent>

              <TabsContent value="team">
                {school.staff.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Meet the Team</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                      {school.staff.map((member, i) => (
                        <div key={i} className="text-center group">
                          <div className="mx-auto h-24 w-24 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden mb-3">
                             {member.image ? (
                               <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                             ) : (
                               <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400">
                                 <Users className="h-8 w-8" />
                               </div>
                             )}
                          </div>
                          <h4 className="font-semibold text-slate-900">{member.name}</h4>
                          <p className="text-sm text-slate-500">{member.role}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </TabsContent>
              
              <TabsContent value="gallery">
                {school.gallery.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {school.gallery.map((img, i) => (
                        <div key={i} className="aspect-square rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                          <img src={img} alt={`Gallery ${i}`} className="h-full w-full object-cover hover:scale-105 transition-transform" />
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </TabsContent>

              <TabsContent value="video">
                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">School Video</h2>
                  <div className="rounded-2xl border border-slate-200 bg-slate-100 aspect-video flex flex-col items-center justify-center text-slate-500 shadow-inner group cursor-pointer hover:bg-slate-200 transition-colors">
                     <PlayCircle className="h-16 w-16 text-slate-400 group-hover:text-blue-500 transition-colors mb-4" />
                     <span className="font-medium">Watch Tour Video</span>
                  </div>
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
                  <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
                    <MapPin className="h-8 w-8 text-slate-400 mb-2" />
                    <p className="text-sm font-medium text-slate-600">Map unavailable</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Google Maps API Key is required. Follow the setup instructions provided.
                    </p>
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
    </div>
  );
}

function GraduationCap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.42 10.922a2 2 0 0 0-.019-3.838L12.83 4.18a2 2 0 0 0-1.66 0L2.6 7.08a2 2 0 0 0 0 3.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  )
}


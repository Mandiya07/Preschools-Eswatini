import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import { Search, MapPin, Star, GraduationCap, Building2, CheckCircle2, Loader2, PlayCircle, Sparkles, Grid, Map as MapIcon, Columns, ChevronRight } from "lucide-react";
import { fetchCollection, subscribeToCollection } from "@/lib/firestoreUtils";
import { School } from "@/types";
import kidsImg from '@/assets/images/kids_playing_blocks_1779268580565.png';
import { APIProvider, Map, AdvancedMarker, Pin, useMap, InfoWindow } from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

function MapPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300 h-[500px] w-full">
      <div className="bg-white p-6 rounded-2xl shadow-sm max-w-md border border-slate-200">
        <MapIcon className="h-10 w-10 text-blue-500 mx-auto mb-3" />
        <h3 className="text-base font-extrabold text-slate-900 mb-2">Interactive Map Requires API Key</h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          Enable the integrated map view by configuring a Google Maps Platform API key in your workspace configurations.
        </p>
        <div className="text-left bg-slate-50 p-4 rounded-xl text-[11px] border border-slate-100 space-y-2 text-slate-600">
          <p className="font-bold text-slate-700">To add your API key:</p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Open <strong className="text-slate-800">Settings</strong> (⚙️ gear icon, top-right corner)</li>
            <li>Select <strong className="text-slate-800">Secrets</strong></li>
            <li>Add secret with name <code className="bg-slate-100 px-1.5 py-0.5 rounded text-red-600 font-mono text-[10px]">GOOGLE_MAPS_PLATFORM_KEY</code></li>
            <li>Paste your key as value and click Save</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

interface DirectoryMapProps {
  schools: School[];
  selectedSchool: School | null;
  onSchoolSelect: (school: School | null) => void;
}

function DirectoryMap({ schools, selectedSchool, onSchoolSelect }: DirectoryMapProps) {
  const map = useMap();
  
  // Pan to selected school when prop updates
  useEffect(() => {
    if (map && selectedSchool && selectedSchool.coordinates) {
      map.panTo(selectedSchool.coordinates);
      map.setZoom(13);
    }
  }, [map, selectedSchool]);

  return (
    <Map
      defaultCenter={{ lat: -26.3167, lng: 31.1333 }}
      defaultZoom={9}
      mapId="PRESCHOOL_ESWATINI_DIRECTORY_MAP_ID"
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
      style={{ width: '100%', height: '100%' }}
      disableDefaultUI={true}
      zoomControl={true}
      gestureHandling="greedy"
    >
      {schools.map((school) => {
        if (!school.coordinates) return null;
        const isSelected = selectedSchool?.id === school.id;
        return (
          <AdvancedMarker
            key={school.id}
            position={school.coordinates}
            onClick={() => onSchoolSelect(school)}
            zIndex={isSelected ? 10 : 1}
          >
            <Pin
              background={isSelected ? "#2563eb" : "#f59e0b"}
              borderColor={isSelected ? "#1d4ed8" : "#d97706"}
              glyphColor="#fff"
            />
          </AdvancedMarker>
        );
      })}

      {selectedSchool && selectedSchool.coordinates && (
        <InfoWindow
          position={selectedSchool.coordinates}
          onCloseClick={() => onSchoolSelect(null)}
        >
          <div className="p-1 min-w-[180px] max-w-[220px] text-left">
            <div className="w-full h-20 bg-slate-100 rounded-md mb-2 flex items-center justify-center overflow-hidden">
              {selectedSchool.heroImage && !selectedSchool.heroImage.includes('unsplash.com') ? (
                <img
                  src={selectedSchool.heroImage}
                  alt={selectedSchool.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="h-8 w-8 text-slate-300" />
              )}
            </div>
            <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">{selectedSchool.name}</h4>
            <p className="text-[10px] text-slate-500 mb-2">{selectedSchool.town}, {selectedSchool.region}</p>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-blue-600">E{selectedSchool.feePerTerm}/term</span>
              <Link
                to={`/school/${selectedSchool.id}`}
                className="inline-flex items-center text-[10px] font-black text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
              >
                Details <ChevronRight className="h-3 w-3 ml-0.5" />
              </Link>
            </div>
          </div>
        </InfoWindow>
      )}
    </Map>
  );
}

function IntegratedMap({ schools, selectedSchool, onSchoolSelect }: DirectoryMapProps) {
  if (!hasValidKey) {
    return <MapPlaceholder />;
  }

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <div className="relative h-full w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm min-h-[450px] bg-slate-100">
        <DirectoryMap 
          schools={schools} 
          selectedSchool={selectedSchool} 
          onSchoolSelect={onSchoolSelect} 
        />
      </div>
    </APIProvider>
  );
}

export function DirectoryPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedCurriculum, setSelectedCurriculum] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [selectedBoarding, setSelectedBoarding] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [maxFee, setMaxFee] = useState<number>(10000);
  const [viewMode, setViewMode] = useState<"grid" | "split" | "map">("grid");
  const [selectedMapSchool, setSelectedMapSchool] = useState<School | null>(null);

  useEffect(() => {
    const unsub = subscribeToCollection('schools', (data) => {
      const rawSchools = data as School[];
      
      // Add deterministic coordinates to institutions that lack them
      const ESWATINI_CENTER = { lat: -26.3167, lng: 31.1333 };
      const enhancedSchools = rawSchools.map((s) => {
        if (!s.coordinates) {
          // Stable coordinates based on id string hash
          let hash = 0;
          const str = s.id || s.name || "";
          for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
          }
          const latOffset = ((hash % 100) / 400) - 0.12; 
          const lngOffset = (((hash >> 8) % 100) / 400) - 0.12;
          const lat = ESWATINI_CENTER.lat + latOffset;
          const lng = ESWATINI_CENTER.lng + lngOffset;
          return { ...s, coordinates: { lat, lng } };
        }
        return s;
      });

      setSchools(enhancedSchools);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleCheckboxChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>, 
    value: string
  ) => {
    setter(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const filteredSchools = (schools || []).filter(school => {
    if (!school) return false;
    const matchesSearch = (school.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (school.town || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (school.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (school.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRegion = selectedRegion === "All" || school.region === selectedRegion;
    const matchesCurriculum = selectedCurriculum.length === 0 || selectedCurriculum.includes(school.curriculum);
    const matchesAges = selectedAges.length === 0 || school.ageGroups?.some(age => selectedAges.includes(age));
    const matchesBoarding = selectedBoarding.length === 0 || selectedBoarding.includes(school.boarding);
    const matchesFee = (school.feePerTerm || 0) <= maxFee;
    
    const matchesType = selectedTypes.length === 0 || selectedTypes.some(type => {
      const typeLower = type.toLowerCase();
      const schoolTypeLower = (school.type || "").toLowerCase();
      
      if (typeLower === "neighborhood flatlet") {
        return schoolTypeLower.includes("flatlet") || 
               schoolTypeLower.includes("minding") ||
               schoolTypeLower.includes("daycare") ||
               schoolTypeLower.includes("care point") ||
               schoolTypeLower.includes("nursery") ||
               school.tags?.some(tag => tag.toLowerCase().includes("flatlet") || tag.toLowerCase().includes("minding") || tag.toLowerCase().includes("daycare") || tag.toLowerCase().includes("subsidized"));
      }
      
      return schoolTypeLower === typeLower || schoolTypeLower.includes(typeLower);
    });

    const isPubliclyVisible = !school.ownerId || school.ownerId === 'super_admin_seed' || school.subscriptionStatus === 'active';

    return matchesSearch && matchesRegion && matchesCurriculum && matchesAges && matchesBoarding && matchesFee && matchesType && isPubliclyVisible;
  });

   const [isFilterOpen, setIsFilterOpen] = useState(false);

   return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <SEO 
        title="Directory | Explore Preschools & Daycares in Eswatini"
        description="Search through a comprehensive database of preschools and early education centers across Mbabane, Manzini, and all of Eswatini."
      />
      {/* Header */}
      <div className="relative py-16 sm:py-24 px-4 overflow-hidden rounded-b-[3rem] lg:rounded-b-[5rem] bg-blue-600 shadow-sm">
        <div className="absolute inset-0 z-0">
           <img src={kidsImg} alt="Kids playing" className="w-full h-full object-cover opacity-20" />
           <div className="absolute inset-0 bg-blue-900/60 mix-blend-multiply" />
        </div>
        <div className="mx-auto max-w-7xl text-center relative z-10">
          <div className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-bold text-white mb-6 shadow-sm border border-white/20">
            <Sparkles className="h-4 w-4 mr-2 text-yellow-300" />
            Discover Early Education
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
            Find the perfect preschool
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-blue-50 font-medium">
            Browse verified preschools, daycares, and ECCDE centres across Eswatini. 
          </p>
          
          {/* Search Box */}
          <div className="mx-auto mt-10 max-w-3xl flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="relative flex-1 flex items-center bg-white rounded-2xl shadow-2xl p-2 border-4 border-white/20 w-full">
              <Search className="absolute left-6 h-6 w-6 text-slate-400" />
              <Input 
                className="pl-16 border-0 bg-transparent py-8 text-lg focus-visible:ring-0 shadow-none font-medium h-full w-full"
                placeholder="Search by school name or town..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button className="h-14 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-lg font-bold shadow-lg shadow-blue-200 ml-2">Search</Button>
            </div>
            <Link to="/map" className="shrink-0">
               <Button className="h-14 px-8 rounded-2xl bg-amber-500 hover:bg-amber-600 text-lg font-bold shadow-xl shadow-amber-500/30 flex items-center gap-2 border-4 border-white/20">
                  <MapPin className="h-5 w-5" /> Smart Map locator
               </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 relative">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar Toggle (Mobile) */}
          <div className="md:hidden flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-4">
             <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-bold text-slate-900">{selectedRegion} Region</span>
             </div>
             <Button variant="outline" size="sm" className="rounded-xl border-slate-200" onClick={() => setIsFilterOpen(!isFilterOpen)}>
               {isFilterOpen ? 'Close Filters' : 'Show Filters'}
             </Button>
          </div>

          {/* Filters Sidebar */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0 animate-in fade-in slide-in-from-top-4 md:slide-in-from-left-4 duration-300`}>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs Ital">Refine Search</h3>
                 <button 
                  className="text-[10px] font-black uppercase tracking-tighter text-blue-600 hover:underline"
                  onClick={() => {
                    setSelectedRegion("All");
                    setSelectedCurriculum([]);
                    setSelectedAges([]);
                    setSelectedBoarding([]);
                    setSelectedTypes([]);
                    setMaxFee(10000);
                  }}
                 >
                   Clear all
                 </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Region</h4>
                  <div className="space-y-2">
                    {["All", "Hhohho", "Manzini", "Lubombo", "Shiselweni"].map(region => (
                       <label key={region} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="region" 
                          className="text-blue-600 focus:ring-blue-600"
                          checked={selectedRegion === region}
                          onChange={() => setSelectedRegion(region)}
                        />
                        <span className="text-sm text-slate-600">{region}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-medium text-slate-700 mb-2 text-indigo-700 flex items-center gap-1 font-bold">
                    <span>🏠 Institution Type</span>
                  </h4>
                  <div className="space-y-2">
                    {[
                      { label: "Private Schools", value: "Private" },
                      { label: "Community-Based / NCP", value: "Community-Based" },
                      { label: "Religious & Mission", value: "Religious/Mission" },
                      { label: "Government Subsidized", value: "Government-Subsidized" },
                      { label: "Neighborhood Flatlet ♥", value: "Neighborhood Flatlet" }
                    ].map(item => (
                      <label key={item.value} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded text-indigo-600 focus:ring-indigo-600 border-slate-300"
                          checked={selectedTypes.includes(item.value)}
                          onChange={() => handleCheckboxChange(setSelectedTypes, item.value)}
                        />
                        <span className={`text-sm ${item.value === "Neighborhood Flatlet" ? "text-indigo-600 font-bold" : "text-slate-600"}`}>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Curriculum</h4>
                  <div className="space-y-2">
                    {["Montessori", "Traditional", "Christian", "Play-based"].map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded text-blue-600 focus:ring-blue-600 border-slate-300"
                          checked={selectedCurriculum.includes(type)}
                          onChange={() => handleCheckboxChange(setSelectedCurriculum, type)}
                        />
                        <span className="text-sm text-slate-600">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Age Groups</h4>
                  <div className="space-y-2">
                    {["0-2 years", "2-4 years", "4-6 years"].map(age => (
                      <label key={age} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded text-blue-600 focus:ring-blue-600 border-slate-300"
                          checked={selectedAges.includes(age)}
                          onChange={() => handleCheckboxChange(setSelectedAges, age)}
                        />
                        <span className="text-sm text-slate-600">{age}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-medium text-slate-700 mb-2">Boarding Type</h4>
                  <div className="space-y-2">
                    {["Day", "Boarding", "Both"].map(type => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded text-blue-600 focus:ring-blue-600 border-slate-300"
                          checked={selectedBoarding.includes(type)}
                          onChange={() => handleCheckboxChange(setSelectedBoarding, type)}
                        />
                        <span className="text-sm text-slate-600">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-slate-700">Max Fee / Term</h4>
                    <span className="text-xs font-semibold text-slate-900">E{maxFee}</span>
                  </div>
                  <input 
                    type="range" 
                    min="500" 
                    max="10000" 
                    step="500"
                    value={maxFee}
                    onChange={(e) => setMaxFee(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>E500</span>
                    <span>E10k+</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Results Grid / Map / Split container */}
          <div className="flex-1 space-y-6">
            {/* Free In-Home Care & Flatlet Matching Alert Banner */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row gap-5 items-center justify-between text-left font-sans">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 bg-amber-100 rounded-full px-2.5 py-0.5 text-[10px] font-black text-amber-800 uppercase tracking-wide">
                  🎁 Free In-Home & Flatlet Support
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Looking for Home Nannies or Backyard Daycare Flatlets?</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  Access direct contacts of leading verified home-based nanny agencies (like Grace Nannies and END Network) and informal pre-primary backyard flatlets at <span className="text-amber-800 font-bold">E0.00 platform matching or subscription fees</span>.
                </p>
              </div>
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold rounded-xl text-xs px-4 shrink-0" asChild>
                <Link to="/flatlets">Discover Registries</Link>
              </Button>
            </div>

            {/* View Switching Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {loading ? 'Searching...' : `Found ${filteredSchools.length} ${filteredSchools.length === 1 ? 'school' : 'schools'}`}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Filter results reflect dynamically on lists and maps.</p>
              </div>
              
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200/50">
                <Button
                  size="sm"
                  variant="ghost"
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all h-8 ${viewMode === "grid" ? "bg-white text-blue-600 shadow-xs hover:bg-white" : "text-slate-600 hover:text-slate-900"}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-3.5 w-3.5 mr-1.5" /> List
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all h-8 ${viewMode === "split" ? "bg-white text-blue-600 shadow-xs hover:bg-white" : "text-slate-600 hover:text-slate-900"}`}
                  onClick={() => setViewMode("split")}
                >
                  <Columns className="h-3.5 w-3.5 mr-1.5" /> Split Map
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all h-8 ${viewMode === "map" ? "bg-white text-blue-600 shadow-xs hover:bg-white" : "text-slate-600 hover:text-slate-900"}`}
                  onClick={() => setViewMode("map")}
                >
                  <MapIcon className="h-3.5 w-3.5 mr-1.5" /> Map
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading schools...</p>
              </div>
            ) : (
              <>
                {/* 1. GRID VIEW MODE */}
                {viewMode === "grid" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                    {filteredSchools.map((school) => (
                      <Link to={`/school/${school.id}`} key={school.id} className="group flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                          {school.heroImage && !school.heroImage.includes('unsplash.com') ? (
                            <img src={school.heroImage} alt={school.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                          ) : (
                            <Building2 className="h-12 w-12 text-slate-300" />
                          )}
                          {school.featured && (
                            <div className="absolute top-3 left-3 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-black text-amber-900 flex items-center gap-1 shadow-xs uppercase tracking-wide">
                              <Star className="h-3 w-3 fill-amber-900" /> Featured
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col flex-1 p-5">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex flex-col">
                              <h3 className="text-lg font-bold text-slate-900 line-clamp-1 flex items-center gap-2">
                                {school.name}
                                {school.verified && <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-50 animate-in zoom-in duration-300" title="Verified School" />}
                              </h3>
                              <span className="text-xs text-slate-500 font-bold">Fees: E{school.feePerTerm}/term</span>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                               <div className="flex items-center gap-1 bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-xs font-medium shrink-0">
                                 <Star className="h-3 w-3 fill-green-700" /> {school.rating}
                               </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-xs text-slate-500 mb-4 gap-4 flex-wrap">
                            <span className="flex items-center gap-1 shrink-0 font-medium">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" /> {school.town}, {school.region}
                            </span>
                            <span className="flex items-center gap-1 shrink-0 font-medium">
                              <GraduationCap className="h-3.5 w-3.5 text-slate-400" /> {school.curriculum}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mt-auto">
                            {school.tags.map(tag => (
                              <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* 2. SPLIT VIEW MODE */}
                {viewMode === "split" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-300">
                    <div className="lg:col-span-5 space-y-3 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
                      {filteredSchools.map((school) => (
                        <div 
                          key={school.id}
                          onClick={() => setSelectedMapSchool(school)}
                          className={`flex gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${selectedMapSchool?.id === school.id ? 'border-blue-500 bg-blue-50/25 shadow-xs' : 'border-slate-200 hover:border-slate-350 bg-white shadow-xs'}`}
                        >
                          <div className="h-16 w-16 bg-slate-50 rounded-xl shrink-0 border border-slate-100 flex items-center justify-center overflow-hidden">
                            {school.heroImage && !school.heroImage.includes('unsplash.com') ? (
                              <img src={school.heroImage} alt={school.name} className="h-full w-full object-cover" />
                            ) : (
                              <Building2 className="h-8 w-8 text-slate-300" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-extrabold text-slate-900 text-sm truncate flex items-center gap-1.5">
                              {school.name}
                              {school.verified && <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 fill-blue-50" />}
                            </h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                              <MapPin className="h-3 w-3 text-slate-400" /> {school.town}
                            </p>
                            <div className="flex items-center justify-between mt-2.5">
                              <span className="text-xs font-black text-blue-600">E{school.feePerTerm}/term</span>
                              <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                ⭐ {school.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredSchools.length === 0 && (
                        <div className="p-8 text-center text-slate-400 italic text-xs">
                          No schools match current filters.
                        </div>
                      )}
                    </div>
                    
                    <div className="lg:col-span-7 h-[600px] sticky top-24">
                      <IntegratedMap 
                        schools={filteredSchools} 
                        selectedSchool={selectedMapSchool} 
                        onSchoolSelect={setSelectedMapSchool} 
                      />
                    </div>
                  </div>
                )}

                {/* 3. FULL MAP VIEW MODE */}
                {viewMode === "map" && (
                  <div className="h-[550px] w-full overflow-hidden rounded-3xl relative animate-in fade-in duration-300 bg-slate-100 shadow-inner">
                    <IntegratedMap 
                      schools={filteredSchools} 
                      selectedSchool={selectedMapSchool} 
                      onSchoolSelect={setSelectedMapSchool} 
                    />
                    
                    {/* Floating list-controller so map browse is fluid */}
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 p-3 flex flex-col gap-1.5 max-w-xs z-10 animate-in slide-in-from-bottom-5 duration-500">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Active Pin Selector</p>
                      <select 
                        className="h-9 px-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-850"
                        value={selectedMapSchool?.id || ""}
                        onChange={(e) => {
                          const id = e.target.value;
                          const found = filteredSchools.find(s => s.id === id);
                          setSelectedMapSchool(found || null);
                        }}
                      >
                        <option value="">-- Choose on-map school --</option>
                        {filteredSchools.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.town})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </>
            )}

            {!loading && filteredSchools.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
                <Search className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">No schools found</h3>
                <p className="text-slate-500">Try adjusting your search or filters.</p>
                <Button variant="outline" className="mt-4 rounded-xl" onClick={() => {
                    setSearchTerm(""); 
                    setSelectedRegion("All");
                    setSelectedCurriculum([]);
                    setSelectedAges([]);
                    setSelectedBoarding([]);
                    setSelectedTypes([]);
                    setMaxFee(10000);
                  }}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import { Search, MapPin, Star, GraduationCap, CheckCircle2, Loader2 } from "lucide-react";
import { fetchCollection } from "@/lib/firestoreUtils";
import { School } from "@/types";

export function DirectoryPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedCurriculum, setSelectedCurriculum] = useState<string[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [selectedBoarding, setSelectedBoarding] = useState<string[]>([]);
  const [maxFee, setMaxFee] = useState<number>(10000);

  useEffect(() => {
    async function loadSchools() {
      // First try fetching from Firestore
      let data: School[] = [];
      try {
        data = await fetchCollection('schools') as School[];
      } catch (err) {
        console.warn("Failed to fetch from Firestore", err);
      }
      
      if (data && data.length > 0) {
        setSchools(data);
      } else {
        // Fallback to API if empty
        try {
          const response = await fetch('/api/schools');
          const apiData = await response.json();
          setSchools(apiData);
        } catch(e) {
          console.error("Error fetching from API", e);
        }
      }
      setLoading(false);
    }
    loadSchools();
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
                          (school.town || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "All" || school.region === selectedRegion;
    const matchesCurriculum = selectedCurriculum.length === 0 || selectedCurriculum.includes(school.curriculum);
    const matchesAges = selectedAges.length === 0 || school.ageGroups?.some(age => selectedAges.includes(age));
    const matchesBoarding = selectedBoarding.length === 0 || selectedBoarding.includes(school.boarding);
    const matchesFee = (school.feePerTerm || 0) <= maxFee;

    return matchesSearch && matchesRegion && matchesCurriculum && matchesAges && matchesBoarding && matchesFee;
  });

   const [isFilterOpen, setIsFilterOpen] = useState(false);

   return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <SEO 
        title="Directory | Explore Preschools & Daycares in Eswatini"
        description="Search through a comprehensive database of preschools and early education centers across Mbabane, Manzini, and all of Eswatini."
      />
      {/* Header */}
      <div className="bg-blue-600 py-12 sm:py-16 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
            Find the perfect preschool
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg sm:text-xl text-blue-100 italic font-medium">
            Browse verified preschools, daycares, and ECCDE centres across Eswatini.
          </p>
          
          {/* Search Box */}
          <div className="mx-auto mt-8 sm:mt-10 max-w-xl">
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl p-1.5">
              <Search className="absolute left-5 h-5 w-5 text-slate-400" />
              <Input 
                className="pl-14 border-0 bg-transparent py-7 text-base focus-visible:ring-0 shadow-none font-medium"
                placeholder="Search by name or town..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button className="h-11 px-8 rounded-xl bg-blue-600 font-bold shadow-lg shadow-blue-200">Search</Button>
            </div>
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
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs Ital">Refine Search</h3>
                 <button 
                  className="text-[10px] font-black uppercase tracking-tighter text-blue-600 hover:underline"
                  onClick={() => {
                    setSelectedRegion("All");
                    setSelectedCurriculum([]);
                    setSelectedAges([]);
                    setSelectedBoarding([]);
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

          {/* Results Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-medium text-slate-900">
                {loading ? 'Searching...' : `Found ${filteredSchools.length} ${filteredSchools.length === 1 ? 'school' : 'schools'}`}
              </h2>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading schools...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSchools.map((school) => (
                <Link to={`/school/${school.id}`} key={school.id} className="group flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <img src={school.heroImage} alt={school.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    {school.featured && (
                      <div className="absolute top-3 left-3 rounded-full bg-amber-400 px-2 py-1 text-xs font-bold text-amber-900 flex items-center gap-1 shadow-sm">
                        <Star className="h-3 w-3 fill-amber-900" /> Featured
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col">
                        <h3 className="text-lg font-bold text-slate-900 line-clamp-1 flex items-center gap-2">
                          {school.name}
                          {school.verified && <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-50" title="Verified School" />}
                        </h3>
                        <span className="text-xs text-slate-500">Fees: E{school.feePerTerm}/term</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                         <div className="flex items-center gap-1 bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-xs font-medium shrink-0">
                           <Star className="h-3 w-3 fill-green-700" /> {school.rating}
                         </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-slate-500 mb-4 gap-4 flex-wrap">
                      <span className="flex items-center gap-1 shrink-0">
                        <MapPin className="h-4 w-4" /> {school.town}, {school.region}
                      </span>
                      <span className="flex items-center gap-1 shrink-0">
                        <GraduationCap className="h-4 w-4" /> {school.curriculum}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {school.tags.map(tag => (
                        <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            )}

            {!loading && filteredSchools.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
                <Search className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">No schools found</h3>
                <p className="text-slate-500">Try adjusting your search or filters.</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                    setSearchTerm(""); 
                    setSelectedRegion("All");
                    setSelectedCurriculum([]);
                    setSelectedAges([]);
                    setSelectedBoarding([]);
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

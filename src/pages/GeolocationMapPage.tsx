import React, { useState, useEffect, useRef } from "react";
import { SEO } from "@/components/SEO";
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { MapContainer, TileLayer, Marker, Popup, useMap as useLeafletMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { School } from "@/types";
import { fetchCollection } from "@/lib/firestoreUtils";
import { Search, MapPin, Navigation, Car, BellRing, Loader2, Star, CheckCircle2, ChevronRight, X, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Fix generic Leaflet marker icon issue
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ESWATINI_CENTER = { lat: -26.3167, lng: 31.1333 }; // Mbabane roughly
const API_KEY =
  (typeof process !== 'undefined' ? process.env.GOOGLE_MAPS_PLATFORM_KEY : null) ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

function LeafletMapContent({ schools, onSelectSchool, selectedSchool }: { schools: School[], onSelectSchool: (s: School) => void, selectedSchool: School | null }) {
  const map = useLeafletMap();

  useEffect(() => {
    if (selectedSchool && selectedSchool.coordinates) {
      map.setView([selectedSchool.coordinates.lat, selectedSchool.coordinates.lng], 14);
    }
  }, [selectedSchool, map]);

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {schools.map(school => {
        if (!school.coordinates) return null;
        return (
          <Marker 
            key={school.id} 
            position={[school.coordinates.lat, school.coordinates.lng]}
            eventHandlers={{ 
              click: () => onSelectSchool(school)
            }}
          >
            <Popup>
              <div className="p-1">
                <p className="font-bold text-slate-900 border-b border-slate-100 pb-1 mb-1">{school.name}</p>
                <p className="text-xs text-slate-500">{school.town}</p>
                <Button size="sm" variant="ghost" className="h-6 text-[10px] p-0 w-full mt-2" onClick={() => onSelectSchool(school)}>View Details</Button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

function MapContent({ schools }: { schools: School[] }) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [routeInfo, setRouteInfo] = useState<{distance: string, duration: string} | null>(null);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  // Simulation: Geofenced notifications
  const [geofenceActive, setGeofenceActive] = useState(false);

  // Mock user location near Mbabane
  useEffect(() => {
    setUserLocation({ lat: -26.3300, lng: 31.1400 });
  }, []);

  const handleSchoolSelect = (school: School) => {
    setSelectedSchool(school);
    if (map) {
      // Add small offset to not obscure marker with UI
      map.panTo({ lat: school.coordinates?.lat || ESWATINI_CENTER.lat, lng: school.coordinates?.lng || ESWATINI_CENTER.lng });
      map.setZoom(14);
    }
  };

  const getDirections = () => {
    if (!hasValidKey) return; // Directions only available with Google Maps
    if (!routesLib || !map || !selectedSchool || !userLocation || !selectedSchool.coordinates) return;

    polylinesRef.current.forEach(p => p.setMap(null));

    routesLib.Route.computeRoutes({
      origin: userLocation,
      destination: selectedSchool.coordinates,
      travelMode: 'DRIVING',
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
    }).then(({ routes }) => {
      if (routes?.[0]) {
        const newPolylines = routes[0].createPolylines();
        // Give it a nice blue color
        newPolylines.forEach(p => {
          p.setOptions({ strokeColor: '#2563eb', strokeOpacity: 0.8, strokeWeight: 6 });
          p.setMap(map);
        });
        polylinesRef.current = newPolylines;
        
        if (routes[0].viewport) {
           map.fitBounds(routes[0].viewport);
        }

        const distanceStr = (routes[0].distanceMeters! / 1000).toFixed(1) + ' km';
        const durationStr = Math.ceil(parseInt(routes[0].durationMillis as any) / 60000) + ' min';
        setRouteInfo({ distance: distanceStr, duration: durationStr });
      }
    }).catch(e => console.error("Routing error:", e));
  };

  const clearDirections = () => {
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];
    setRouteInfo(null);
  };

  const filteredSchools = schools.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.town.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] w-full">
      {/* Sidebar */}
      <div className="w-full md:w-96 bg-white border-r border-slate-200 flex flex-col shadow-xl z-10 flex-shrink-0">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800 mb-4">
             <MapPin className="h-3 w-3 mr-1" /> Smart Discovery
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Preschool Finder</h1>
          <p className="text-sm text-slate-500 mb-4">Find nearby schools, check transport zones, and get real-time directions.</p>
          
          {!hasValidKey && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex gap-3 items-start">
               <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
               <p className="text-[10px] text-amber-800 leading-tight">
                  <strong>Running in Guest Mode.</strong> Smart routing and street maps are disabled. Add a Google Maps API Key in Settings to unlock full features.
               </p>
            </div>
          )}

          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
             <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search areas or schools..."
                className="pl-10 h-12 bg-white rounded-xl border-slate-200"
             />
          </div>
        </div>

        {/* Selected School Details Area (slides in if selected) */}
        {selectedSchool ? (
          <div className="p-6 bg-white flex-1 overflow-y-auto">
             <button 
                onClick={() => { setSelectedSchool(null); clearDirections(); }}
                className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-4"
             >
                <X className="h-4 w-4 mr-1" /> Back to list
             </button>
             
             {selectedSchool.heroImage && !selectedSchool.heroImage.includes('unsplash.com') ? (
               <img src={selectedSchool.heroImage} alt={selectedSchool.name} className="w-full h-40 object-cover rounded-xl mb-4 shadow-sm" />
             ) : (
               <img src="/logo-512.png" alt="Preschools Eswatini" className="w-full h-40 object-contain rounded-xl mb-4 shadow-sm bg-slate-50 p-2" />
             )}
             
             <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                {selectedSchool.name} {selectedSchool.verified && <CheckCircle2 className="h-4 w-4 text-blue-500 fill-blue-50" />}
             </h2>
             <p className="text-slate-600 flex items-center text-sm mb-4">
                <MapPin className="h-4 w-4 mr-1 text-slate-400" /> {selectedSchool.town}, {selectedSchool.region}
             </p>
             
             <div className="flex gap-2 mb-6">
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                   <Star className="h-3 w-3 mr-1 fill-emerald-700" /> {selectedSchool.rating}
                </Badge>
                <Badge variant="outline">{selectedSchool.curriculum}</Badge>
             </div>

             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                <h4 className="font-semibold text-slate-900 mb-3 text-sm">Smart Navigation</h4>
                {!routeInfo ? (
                   <Button onClick={getDirections} disabled={!hasValidKey} className="w-full bg-blue-600 hover:bg-blue-700">
                      <Navigation className="h-4 w-4 mr-2" /> {hasValidKey ? "Get Directions" : "Routing Locked"}
                   </Button>
                ) : (
                   <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                         <span className="flex items-center text-slate-600"><Car className="h-4 w-4 mr-2 text-slate-400" /> Distance</span>
                         <span className="font-bold text-slate-900">{routeInfo.distance}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                         <span className="flex items-center text-slate-600"><Loader2 className="h-4 w-4 mr-2 text-slate-400" /> Est. Time</span>
                         <span className="font-bold text-slate-900">{routeInfo.duration}</span>
                      </div>
                      <Button variant="outline" className="w-full mt-2" onClick={clearDirections}>Clear Route</Button>
                   </div>
                )}
             </div>
             
             <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                   <div>
                      <h4 className="font-semibold text-slate-900 text-sm">Geofencing Alerts</h4>
                      <p className="text-xs text-slate-500 mt-1">Get notified when child arrives</p>
                   </div>
                   <button 
                      onClick={() => setGeofenceActive(!geofenceActive)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${geofenceActive ? 'bg-blue-600' : 'bg-slate-200'}`}
                   >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${geofenceActive ? 'translate-x-6' : 'translate-x-1'}`} />
                   </button>
                </div>
                {geofenceActive && (
                   <div className="mt-3 bg-blue-50 text-blue-700 text-xs p-3 rounded-lg border border-blue-100 flex items-start">
                      <BellRing className="h-4 w-4 mr-2 shrink-0 mt-0.5" />
                      Alert activated. You will receive an SMS and Push Notification when device enters 500m radius of {selectedSchool.name}.
                   </div>
                )}
             </div>

          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
            {filteredSchools.map(school => (
               <div 
                  key={school.id} 
                  onClick={() => handleSchoolSelect(school)}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all flex gap-4 items-center"
               >
                  {school.heroImage && !school.heroImage.includes('unsplash.com') ? (
                    <img src={school.heroImage} className="w-16 h-16 rounded-lg object-cover bg-slate-100 shrink-0" alt="" />
                  ) : (
                    <img src="/logo-512.png" className="w-16 h-16 rounded-lg object-contain bg-slate-50 p-1 shrink-0" alt="" />
                  )}
                  <div className="flex-1 min-w-0">
                     <h4 className="font-bold text-slate-900 text-sm truncate">{school.name}</h4>
                     <p className="text-xs text-slate-500 mt-1 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" /> {school.town}
                     </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300" />
               </div>
            ))}
          </div>
        )}
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-slate-100 h-full overflow-hidden" id="map-container">
         {hasValidKey ? (
            <Map
              defaultCenter={ESWATINI_CENTER}
              defaultZoom={11}
              mapId="PRESCHOOL_ESWATINI_DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{width: '100%', height: '100%'}}
              disableDefaultUI={true}
              zoomControl={true}
              gestureHandling="greedy"
            >
              {userLocation && (
                <AdvancedMarker position={userLocation} title="You usually are here" zIndex={20}>
                   <div className="h-5 w-5 bg-blue-600 rounded-full border-4 border-white shadow-[0_0_0_2px_rgba(37,99,235,0.3)] animate-pulse" />
                </AdvancedMarker>
              )}

              {filteredSchools.map(school => {
                 if (!school.coordinates) return null;
                 const isSelected = selectedSchool?.id === school.id;
                 
                 return (
                    <AdvancedMarker 
                       key={school.id} 
                       position={school.coordinates} 
                       onClick={() => handleSchoolSelect(school)}
                       zIndex={isSelected ? 10 : 1}
                    >
                       <Pin 
                          background={isSelected ? "#2563eb" : "#f59e0b"} 
                          borderColor={isSelected ? "#1d4ed8" : "#d97706"} 
                          glyphColor="#fff" 
                       />
                    </AdvancedMarker>
                 )
              })}
            </Map>
         ) : (
            <div className="w-full h-full relative">
               <MapContainer 
                  center={[ESWATINI_CENTER.lat, ESWATINI_CENTER.lng]} 
                  zoom={11} 
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                >
                  <LeafletMapContent 
                    schools={filteredSchools} 
                    onSelectSchool={handleSchoolSelect} 
                    selectedSchool={selectedSchool}
                  />
                </MapContainer>
                
                {/* Floating Action Hint */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-2xl shadow-2xl p-4 border border-blue-100 flex items-center gap-4 max-w-sm whitespace-nowrap">
                   <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                      <AlertCircle className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-slate-900">Advanced Features Locked</p>
                      <p className="text-[10px] text-slate-500">Google Maps key required for routing.</p>
                   </div>
                   <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      Get Setup
                   </Button>
                </div>
            </div>
         )}
         
         {/* Density/Heatmap toggle mock */}
         <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-xl shadow-lg border border-slate-200 p-2 flex flex-col gap-2 z-[500] md:z-[5] max-w-xs">
            <h4 className="text-sm font-bold text-slate-900 px-2 py-1">Map Layers</h4>
            <Button variant="ghost" size="sm" className="justify-start text-xs rounded-lg active:bg-blue-50">
               <Car className="h-3 w-3 mr-2" /> Transport Zones
            </Button>
            <Button variant="ghost" size="sm" className="justify-start text-xs rounded-lg active:bg-blue-50">
               <MapPin className="h-3 w-3 mr-2" /> School Density Heatmap
            </Button>
         </div>
      </div>
    </div>
  );
}

export function MapSearchPage() {
  const [schools, setSchools] = useState<School[]>([]);

  useEffect(() => {
    async function load() {
      let data: School[] = [];
      try {
        data = await fetchCollection('schools') as School[];
      } catch (err) { 
        console.error("Firestore fetch error:", err);
      }
      
      // Assign mock coordinates around Eswatini to schools that don't have them
      const enhancedData = data.map((s, i) => {
         if (!s.coordinates) {
            // slightly offset from center
            const lat = ESWATINI_CENTER.lat + (Math.random() * 0.4 - 0.2);
            const lng = ESWATINI_CENTER.lng + (Math.random() * 0.4 - 0.2);
            return { ...s, coordinates: { lat, lng } };
         }
         return s;
      });
      
      const publicSchools = enhancedData.filter(s => 
        !s.ownerId || s.ownerId === 'super_admin_seed' || s.subscriptionStatus === 'active'
      );
      
      setSchools(publicSchools);
    }
    load();
  }, []);

  if (hasValidKey) {
    return (
      <div className="w-full">
        <SEO title="Smart Map Locator | Preschools Eswatini" />
        <APIProvider apiKey={API_KEY} version="weekly">
           <MapContent schools={schools} />
        </APIProvider>
      </div>
    );
  }

  return (
    <div className="w-full">
      <SEO title="Smart Map Locator | Preschools Eswatini" />
      <MapContent schools={schools} />
    </div>
  );
}


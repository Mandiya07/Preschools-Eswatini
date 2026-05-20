import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { Store, ShoppingCart, BookOpen, Shirt, PenTool, Package, Search, LayoutGrid, Loader2 } from "lucide-react";
import { MarketplaceItem } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { subscribeToCollection } from "@/lib/firestoreUtils";

export function MarketplacePage() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToCollection('marketplace_items', (data) => {
      setItems(data as MarketplaceItem[]);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="space-y-16 pb-24">
      <SEO title="B2B Marketplace | Procurement for Preschools" />
      
      {/* Hero Section */}
      <section className="bg-slate-900 pt-20 pb-24 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
           <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-6 px-3 py-1">Wholesale & Procurement</Badge>
           <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
             Equip your preschool<br/>for success.
           </h1>
           <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
             Connect directly with verified wholesale suppliers for uniforms, educational toys, classroom furniture, and learning materials.
           </p>
           
           <div className="max-w-xl mx-auto relative flex items-center shadow-2xl">
             <Search className="absolute left-4 h-5 w-5 text-slate-400" />
             <Input 
               className="h-14 pl-12 pr-32 rounded-full border-0 bg-white/10 text-white placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-500"
               placeholder="Search suppliers, categories, or items..."
             />
             <Button className="absolute right-1 h-12 rounded-full bg-blue-600 hover:bg-blue-700 px-6 font-bold">
                Search
             </Button>
           </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
         <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-2 border border-slate-100 flex overflow-x-auto hide-scrollbar gap-2">
            {[ 
               {name: "All Items", icon: <LayoutGrid className="w-4 h-4"/>}, 
               {name: "Uniforms", icon: <Shirt className="w-4 h-4"/>}, 
               {name: "Toys & Play", icon: <Package className="w-4 h-4"/>}, 
               {name: "Stationery", icon: <PenTool className="w-4 h-4"/>}, 
               {name: "Furniture", icon: <Store className="w-4 h-4"/>}, 
               {name: "Books", icon: <BookOpen className="w-4 h-4"/>} 
            ].map((cat, i) => (
               <Button key={i} variant={i===0 ? "default" : "ghost"} className={`rounded-xl whitespace-nowrap font-bold h-12 px-6 ${i===0 ? 'bg-slate-900 shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
                  {cat.icon} <span className="ml-2">{cat.name}</span>
               </Button>
            ))}
         </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold text-slate-900">Featured Products</h2>
           <Button variant="ghost" className="text-blue-600 font-bold">View all suppliers</Button>
        </div>
        
        {loading ? (
             <div className="flex h-64 items-center justify-center border rounded-xl"><Loader2 className="w-8 h-8 animate-spin text-blue-600"/></div>
        ) : items.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
               <Card key={item.id} className="rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 transition-all group cursor-pointer">
                  <div className="h-48 bg-slate-100 flex items-center justify-center border-b border-slate-100 relative group-hover:bg-blue-50 transition-colors">
                     {item.imageUrl ? (
                       <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                     ) : (
                       <Package className="h-16 w-16 text-slate-300 group-hover:scale-110 transition-transform group-hover:text-blue-200" />
                     )}
                     <Badge className="absolute top-4 left-4 bg-white/80 backdrop-blur text-slate-900 font-bold border-0 shadow-sm">{item.category}</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-500 text-sm mb-6 line-clamp-2">{item.description}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900">E{item.price}</span>
                      <span className="text-sm font-medium text-slate-400">/unit</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                     <Button className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 font-bold h-12">Add to Procurement List</Button>
                  </CardFooter>
               </Card>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border rounded-xl border-dashed">
            <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No items available</h3>
            <p className="text-slate-500">Suppliers haven't listed any items yet.</p>
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-center text-white flex flex-col items-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
             <Store className="w-64 h-64" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold mb-4">Are you a regional supplier?</h2>
            <p className="text-blue-100 max-w-xl mb-8 font-medium mx-auto">Get verified and start selling directly to administrative teams across hundreds of accredited preschools using our dedicated supplier portal.</p>
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-slate-50 rounded-xl h-14 px-8 font-bold shadow-lg">
               <Link to="/register-supplier">Create Supplier Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

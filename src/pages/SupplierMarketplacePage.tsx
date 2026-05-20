import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Store, ShoppingCart, Package, TrendingUp,
  Search, Filter, Plus
} from "lucide-react";
import { SEO } from "@/components/SEO";

export function SupplierMarketplacePage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <SEO title="Supplier Marketplace | Sikolo" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Supplier Portal</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your storefronts, wholesale products, and supply orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Active Orders</p>
            <h3 className="text-2xl font-bold text-slate-900">42</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Pending Deliveries</p>
            <h3 className="text-2xl font-bold text-slate-900">12</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-slate-500">Total Revenue (MoM)</p>
            <h3 className="text-2xl font-bold text-slate-900">E 45,000</h3>
          </CardContent>
        </Card>
      </div>

       <Card className="rounded-[2rem] border-slate-200">
          <CardHeader className="border-b border-slate-100 pb-4">
             <CardTitle>Your Products & Storefronts</CardTitle>
          </CardHeader>
          <div className="p-6">
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: "Basic Uniform Bundle", category: "Uniforms", price: "E 250", status: "Active" },
                  { name: "STEM Toy Kit", category: "Educational Toys", price: "E 400", status: "Active" },
                  { name: "Classroom Decor Set", category: "Teacher Resources", price: "E 150", status: "Draft" },
                ].map((item, i) => (
                   <Card key={i} className="rounded-2xl border-slate-200">
                      <CardHeader>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription>{item.category}</CardDescription>
                      </CardHeader>
                      <CardContent>
                         <div className="flex justify-between items-center">
                            <span className="font-bold text-lg">{item.price}</span>
                            <Badge variant={item.status === "Active" ? "default" : "secondary"}>{item.status}</Badge>
                         </div>
                      </CardContent>
                   </Card>
                ))}
             </div>
          </div>
       </Card>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { Store, ShoppingCart, BookOpen, Shirt, PenTool, Package } from "lucide-react";
import { MarketplaceItem } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const MOCK_ITEMS: MarketplaceItem[] = [
  { id: "1", supplierId: "s1", name: "Durable Uniform Sets", description: "High-quality uniform bundles for all ages.", category: "Uniforms", price: 250, imageUrl: "", stockQuantity: 50 },
  { id: "2", supplierId: "s1", name: "Back-to-School Kits", description: "Complete essential supplies for classrooms.", category: "Preschool Supplies", price: 450, imageUrl: "", stockQuantity: 30 },
  { id: "3", supplierId: "s2", name: "STEM Discovery Toys", description: "Inspiring science and math-focused sensory toys.", category: "Educational Toys", price: 350, imageUrl: "", stockQuantity: 40 },
  { id: "4", supplierId: "s2", name: "Classroom Planning Guide", description: "Comprehensive teacher lesson plans.", category: "Teacher Resources", price: 150, imageUrl: "", stockQuantity: 100 },
  { id: "5", supplierId: "s3", name: "Ergonomic Furniture Set", description: "Desks and cots designed for preschool comfort.", category: "Preschool Furniture", price: 1200, imageUrl: "", stockQuantity: 10 },
  { id: "6", supplierId: "s3", name: "Digital Learning Pack", description: "Premium worksheets and coloring guides.", category: "Learning Materials", price: 50, imageUrl: "", stockQuantity: 999 },
];

export function MarketplacePage() {
  return (
    <div className="space-y-12 max-w-7xl mx-auto py-12 px-4">
      <SEO title="Marketplace | Sikolo" />
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Preschools Marketplace</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">Connecting suppliers with preschool administrators for all classroom needs.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {MOCK_ITEMS.map((item) => (
           <Card key={item.id} className="rounded-3xl border border-slate-200">
              <CardHeader>
                <div className="mb-4">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
                <CardDescription>{item.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">{item.description}</p>
                <p className="text-2xl font-extrabold text-slate-900">E {item.price}</p>
              </CardContent>
              <CardFooter>
                 <Button className="w-full">Add to Cart</Button>
              </CardFooter>
           </Card>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-12 text-center text-white flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6">Are you a supplier?</h2>
        <p className="text-slate-400 max-w-xl mb-8">Sell your products to thousands of accredited preschools using our dedicated supplier management portal.</p>
        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
           <Link to="/admin/supplier-marketplace">Go to Supplier Portal</Link>
        </Button>
      </div>
    </div>
  );
}

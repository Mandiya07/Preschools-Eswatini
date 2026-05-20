import { SEO } from "@/components/SEO";
import { BookOpen, Users, Lightbulb } from "lucide-react";

export function ParentResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <SEO title="Parent Resources | Sikolo Platform" />
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Parent Resources</h1>
        <p className="mt-4 text-xl text-slate-600">Supporting your child's journey, every step of the way.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <BookOpen className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="font-bold text-lg mb-2">Learning Guides</h3>
          <p className="text-slate-600">Explore articles on supporting early childhood development at home.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <Users className="h-8 w-8 text-blue-600 mb-4" />
          <h3 className="font-bold text-lg mb-2">Community Forum</h3>
          <p className="text-slate-600">Connect with other parents and share experiences.</p>
        </div>
      </div>
    </div>
  );
}

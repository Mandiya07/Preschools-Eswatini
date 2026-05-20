import React, { useState } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, BrainCircuit, Search, MapPin, DollarSign, GraduationCap } from "lucide-react";
import { School } from "@/types";

export function AIMatchingPage() {
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<School[]>([]);

  const handleMatch = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/match-schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirements }),
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error matching schools:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <SEO title="AI Preschool Match | Sikolo Platform" />
      
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">AI Preschool Match</h1>
        <p className="mt-4 text-xl text-slate-600">Tell us what you're looking for, and our AI will find the perfect school for your child.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <textarea
          className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder="E.g., I'm looking for a Montessori preschool in Mbabane for a 3-year-old, with a budget of under E5000 per term, and after-school care."
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
        />
        <Button onClick={handleMatch} disabled={loading || !requirements} className="w-full bg-blue-600 hover:bg-blue-700">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><BrainCircuit className="h-5 w-5 mr-2" /> Find My Perfect School</>}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Recommended for you:</h2>
          <div className="grid gap-6">
            {results.map((school) => (
              <div key={school.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex gap-4">
                <img src={school.heroImage} alt={school.name} className="w-32 h-32 rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold text-xl">{school.name}</h3>
                  <p className="text-slate-600 text-sm mt-1">{school.region}, {school.town}</p>
                  <p className="text-slate-500 text-sm mt-2 line-clamp-2">{school.description}</p>
                  <div className="flex gap-4 mt-3 text-sm font-medium">
                     <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> E{school.feePerTerm}</span>
                     <span className="flex items-center gap-1"><GraduationCap className="h-4 w-4" /> {school.curriculum}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

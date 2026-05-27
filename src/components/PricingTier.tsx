import React from 'react';
import { Check, X } from 'lucide-react';

export type PlanId = 'free' | 'basic' | 'professional' | 'enterprise';

export const FEATURES = {
  attendance: "Attendance Tracking",
  admissions: "Admissions Management",
  finance: "Financial Management",
  communication: "Parent Communication",
  analytics: "Basic Analytics",
  advanced_analytics: "Advanced Analytics",
  transport: "Transport Management",
  hr: "HR & Payroll",
  custom_domain: "Custom Website Domain",
  api_access: "API Access",
};

export const PRICING_TIERS = [
  {
    id: "free",
    name: "Free",
    price: { monthly: 0, annual: 0 },
    features: ['attendance', 'admissions'],
    limits: { students: 50, storage: 1 },
    description: "Basic tools for very small or new preschools."
  },
  {
    id: "basic",
    name: "Basic",
    price: { monthly: 299, annual: 2490 },
    features: ['attendance', 'admissions', 'finance', 'communication'],
    limits: { students: 150, storage: 5 },
    description: "Essential management for growing preschools."
  },
  {
    id: "professional",
    name: "Professional",
    price: { monthly: 499, annual: 4990 },
    features: ['attendance', 'admissions', 'finance', 'communication', 'analytics', 'transport'],
    limits: { students: 500, storage: 20 },
    description: "Complete management for established schools.",
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: { monthly: 899, annual: 8990 },
    features: ['attendance', 'admissions', 'finance', 'communication', 'analytics', 'advanced_analytics', 'transport', 'hr', 'custom_domain', 'api_access'],
    limits: { students: 9999, storage: 100 },
    description: "Advanced tools & APIs for large schools or chains."
  }
];

interface PricingTierProps {
  selectedPlan: string;
  onSelectPlan: (plan: string, features: string[]) => void;
  billingCycle: 'monthly' | 'annual';
  onBillingCycleChange?: (cycle: 'monthly' | 'annual') => void;
}

export function PricingTier({ selectedPlan, onSelectPlan, billingCycle, onBillingCycleChange }: PricingTierProps) {
  return (
    <div className="space-y-6">
      {onBillingCycleChange && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-slate-100 p-1.5 rounded-xl w-fit mx-auto">
          <button 
            type="button"
            className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => onBillingCycleChange('monthly')}
          >
            Monthly
          </button>
          <button 
            type="button"
            className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${billingCycle === 'annual' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => onBillingCycleChange('annual')}
          >
            Annual Save 20%
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRICING_TIERS.map((tier) => (
          <div 
            key={tier.id}
            className={`relative flex flex-col p-6 rounded-3xl border-2 transition-all cursor-pointer ${
              selectedPlan === tier.id 
                ? 'border-blue-600 bg-blue-50/10 shadow-lg scale-105 z-10' 
                : 'border-slate-100 hover:border-blue-300 bg-white hover:shadow-md'
            }`}
            onClick={() => onSelectPlan(tier.id, tier.features)}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-full">
                Most Popular
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="text-lg font-bold text-slate-900">{tier.name}</h3>
              <p className="text-sm text-slate-500 min-h-[40px] mt-1">{tier.description}</p>
            </div>
            
            <div className="mb-6">
              <span className="text-3xl font-black text-slate-900">
                E{tier.price[billingCycle]}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase ml-1">
                /{billingCycle === 'monthly' ? 'mo' : 'yr'}
              </span>
              {tier.price.monthly === 0 && (
                <div className="text-xs text-emerald-600 font-bold mt-1">Forever free</div>
              )}
            </div>
            
            <div className="flex-grow space-y-3 mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Included Features</p>
              {Object.entries(FEATURES).map(([featureId, featureName]) => {
                const included = tier.features.includes(featureId);
                return (
                  <div key={featureId} className={`flex items-start gap-2 text-sm ${included ? 'text-slate-700' : 'text-slate-300'}`}>
                    {included ? (
                      <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-4 w-4 shrink-0 mt-0.5" />
                    )}
                    <span className={included ? 'font-medium' : ''}>{featureName}</span>
                  </div>
                );
              })}
            </div>
            
            <button
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors ${
                selectedPlan === tier.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {selectedPlan === tier.id ? 'Selected' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

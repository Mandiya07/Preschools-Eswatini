import { useState } from "react";
import { CheckCircle2, Sparkles, Building2, TrendingUp, MonitorSmartphone, Camera, ShieldCheck, Palette, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";

import { PRICING_TIERS, FEATURES } from "@/components/PricingTier";

export function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'termly' | 'annual'>('monthly');

  return (
    <div className="bg-slate-50 pb-24 min-h-screen">
      <SEO 
        title="Pricing | Preschools Eswatini Platform"
        description="Simple, transparent pricing for preschools, daycares, and early childhood centers to manage admissions, marketing, and parent communications."
      />
      {/* Header */}
      <div className="bg-white py-20 px-4 text-center border-b border-slate-200">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-6 text-xl text-slate-600">
            Choose the plan that best fits your preschool's size and needs. All plans include secure hosting and our easy-to-use site builder.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-slate-200/60 p-1.5 rounded-xl w-fit mx-auto mb-10">
          <button 
            type="button"
            className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-800'}`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button 
            type="button"
            className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${billingCycle === 'termly' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-800'}`}
            onClick={() => setBillingCycle('termly')}
          >
            Per Term
          </button>
          <button 
            type="button"
            className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${billingCycle === 'annual' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-800'}`}
            onClick={() => setBillingCycle('annual')}
          >
            Annual (Save 20%)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {PRICING_TIERS.map((plan) => (
            <div 
              key={plan.id} 
              className={`rounded-3xl bg-white border p-6 flex flex-col transition-all ${
                plan.popular 
                  ? 'border-blue-600 shadow-xl ring-2 ring-blue-600/20 relative scale-[1.02] z-10' 
                  : 'border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3.5 py-1 text-[10px] font-black text-white tracking-widest uppercase shadow-sm">
                  Main Selling Plan
                </div>
              )}
              
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl font-black text-slate-900">{plan.name}</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {plan.bestFor}
                </span>
              </div>
              <p className="text-xs font-semibold text-blue-600 italic mb-2">"{plan.tagline}"</p>
              <p className="text-slate-500 text-xs mb-4 pb-4 border-b border-slate-100 min-h-[48px] leading-relaxed">{plan.description}</p>
              
              {billingCycle === 'termly' && plan.price.termly ? (
                <div className="mb-5 flex flex-col gap-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">Term 1 (Opening)</span>
                    <span className="font-black text-slate-900">E{plan.price.termly.t1}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">Term 2</span>
                    <span className="font-black text-slate-900">E{plan.price.termly.t2}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">Term 3 (Closing)</span>
                    <span className="font-black text-slate-900">E{plan.price.termly.t3}</span>
                  </div>
                </div>
              ) : billingCycle === 'annual' ? (
                <div className="mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">E{plan.price.annual.toLocaleString()}</span>
                    <span className="text-xs font-bold text-slate-500">/year</span>
                  </div>
                  <p className="text-[11px] font-bold text-emerald-600 mt-1">
                    ~E{plan.price.effectiveMonthly}/mo effective (2 Months Free)
                  </p>
                </div>
              ) : (
                <div className="mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">E{plan.price.monthly}</span>
                    <span className="text-xs font-bold text-slate-500">/month</span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-400 mt-1">
                    Billed monthly • {plan.trial}
                  </p>
                </div>
              )}
              
              <ul className="mb-6 space-y-2.5 flex-1 text-xs">
                <li className="flex items-start gap-2 text-slate-700 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>{plan.limits.students === 9999 ? 'Unlimited' : plan.limits.students}</strong> Student Capacity</span>
                </li>
                <li className="flex items-start gap-2 text-slate-700 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>{plan.limits.admins}</strong> Staff / Admin {plan.limits.admins === 1 ? 'Login' : 'Logins'}</span>
                </li>
                <li className="flex items-start gap-2 text-slate-700 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>{plan.limits.storage >= 1 ? `${plan.limits.storage}GB` : '500MB'}</strong> Cloud Storage</span>
                </li>
                {plan.highlights.map((h, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{h}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={plan.popular ? 'default' : 'outline'} 
                className={`w-full h-11 text-sm font-extrabold rounded-xl ${
                  plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' : 'border-slate-300 hover:bg-blue-50 hover:text-blue-700'
                }`} 
                asChild
              >
                <Link to={`/register?plan=${plan.id}`}>Get Started ({plan.trial.split(' ')[0]} Free)</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Referral Reward Callout Banner */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white rounded-[2.5rem] p-8 sm:p-10 shadow-xl border border-emerald-500/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                Preschool Network Referral Program
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Refer a Preschool. <span className="text-emerald-300">Earn E100 Credit</span> for Every School.
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
                When you invite fellow directors or cluster schools to join Preschools Eswatini, your school receives <strong>E100 account credit</strong> as soon as they subscribe. Apply credits directly to your plan renewals or SMS &amp; domain add-ons!
              </p>
            </div>
            <div className="shrink-0">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-emerald-50 font-black rounded-2xl shadow-lg px-6 h-12 text-sm" asChild>
                <Link to="/register">Get Started &amp; Earn Credits</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Local Eswatini Payment Architecture Section */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-[2.5rem] p-8 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Building2 className="w-64 h-64 text-blue-400" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-yellow-400 text-yellow-950 px-3 py-1 text-xs font-black uppercase tracking-wider">
                  🇸🇿 Eswatini-First Payments
                </span>
                <span className="rounded-full bg-blue-800/80 text-blue-200 px-3 py-1 text-xs font-bold border border-blue-700">
                  Zero Card Processing Friction
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Built For Eswatini's Local Banking & Mobile Money Reality
                </h2>
                <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
                  We prioritize local payment workflows designed specifically for Eswatini preschools and parents. Because international payment gateways like Stripe do not natively support Eswatini merchant accounts, our architecture emphasizes low-tariff MTN Mobile Money and direct bank transfers.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-7 w-7 bg-yellow-400 text-yellow-950 rounded-lg flex items-center justify-center font-black text-xs">Mo</div>
                    <h3 className="font-bold text-white text-sm">MTN Mobile Money</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Primary mobile money method aligned with published MTN Eswatini local MoMo tariffs. Fast and accessible to 90%+ of parents.
                  </p>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-7 w-7 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black text-xs">EFT</div>
                    <h3 className="font-bold text-white text-sm">Local Bank EFT</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Direct electronic funds transfer via FNB Eswatini, Standard Bank, and Nedbank with fast Proof of Payment (POP) verification.
                  </p>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-7 w-7 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-black text-xs">🌍</div>
                    <h3 className="font-bold text-white text-sm">Card & Regional Ready</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Integration-ready architecture for international cards & regional South African expansion when cross-border processing is needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Free Home-Based Care & Flatlets Offer Section */}
        <div className="mt-20 max-w-5xl mx-auto font-sans">
          <div className="bg-amber-50/60 border-2 border-dashed border-amber-300 rounded-[2.5rem] p-8 sm:p-10 flex flex-col md:flex-row gap-8 items-center justify-between text-left">
            <div className="max-w-2xl space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 uppercase tracking-wide">
                🎁 100% Platform-Free Offers
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                No Subscriptions for Home-Based Care or Backyard Flatlets
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed font-semibold">
                Our platform believes in digital equity for Eswatini&apos;s early educators & parents. We charge <span className="text-amber-700 font-extrabold">E0.00 search and registry fees</span> for parents seeking child minders, travel au pairs, and on-demand home helpers. Furthermore, peri-urban informal backyard daycare flatlets can join our directory with zero platform costs or listing fees.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Zero Registry Subscriptions
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Zero Client Matching Fees
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Free Flatlet Dual-Intent Listing
                </div>
              </div>
            </div>
            <div className="shrink-0 w-full md:w-auto text-left">
              <div className="bg-white px-6 py-5 rounded-2xl border border-amber-200 shadow-sm text-center md:text-left min-w-[200px]">
                <div className="text-4xl font-extrabold text-amber-600">E0</div>
                <div className="text-xs font-bold text-slate-800 uppercase mt-1">Platform In-Home Support Fees</div>
                <div className="text-[10px] text-slate-400 mt-1">Direct contact numbers provided free</div>
                <Button size="sm" className="mt-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold w-full rounded-xl" asChild>
                  <Link to="/flatlets">Discover Registries</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Add-ons and Extensibility */}
        <div className="mt-32 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Extend Your Platform</h2>
            <p className="text-xl text-slate-600">Add-on modules and premium services to custom-fit your needs.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Modules */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                <MonitorSmartphone className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Enhancement Modules</h3>
              <p className="text-slate-600 mb-4">Available for Professional & Enterprise plans.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-blue-600" /> AI Learning Assistant</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-blue-600" /> Learning Management System (LMS)</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-blue-600" /> Digital Document Management</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-blue-600" /> Content & Media Hub</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-blue-600" /> Advanced Financial Management</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-blue-600" /> Transport Tracking Module</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-blue-600" /> ERP (HR, Inventory, Assets)</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-blue-600" /> ECCDE Ministry Compliance Checklists</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-blue-600" /> Community Marketplace</li>
              </ul>
              <Button variant="outline" className="w-full" asChild><Link to="/advanced-features">View Modules</Link></Button>
            </div>

            {/* Services */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Grow Your Preschool</h3>
              <p className="text-slate-600 mb-4">Let our professional team handle your marketing.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-orange-600" /> Featured Directory Listing</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-orange-600" /> Platform Advertising Space</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-orange-600" /> Professional Photography & Media</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-orange-600" /> Digital Marketing & SEO</li>
              </ul>
              <Button variant="outline" className="w-full" asChild><Link to="/contact">Request Quote</Link></Button>
            </div>

            {/* Customization & Verification */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Premium Experience</h3>
              <p className="text-slate-600 mb-4">Stand out with verified trust, content hubs, and bespoke design.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-green-600" /> Official Preschool Verification & Badges</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-green-600" /> Premium Marketplace & Content Themes</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-green-600" /> Custom Development</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-green-600" /> Regional Expansion Support</li>
              </ul>
              <Button variant="outline" className="w-full" asChild><Link to="/features">Explore</Link></Button>
            </div>

            {/* Support Ecosystem */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                <LifeBuoy className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Support Ecosystem</h3>
              <p className="text-slate-600 mb-4">Get the help you need when you need it.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-indigo-600" /> 24/7 AI Support Assistant</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-indigo-600" /> Knowledge Base & Tutorials</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-indigo-600" /> Video Onboarding</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-indigo-600" /> Live Chat System</li>
              </ul>
              <Button variant="outline" className="w-full" asChild><Link to="/faq">View Support Plans</Link></Button>
            </div>

            {/* Photography & Content Creation */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                <Camera className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Photography & Content</h3>
              <p className="text-slate-600 mb-4">Professional media to showcase your institution.</p>
              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">E1,500</span>
                <span className="text-slate-500 font-medium">- E15,000+</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-purple-600" /> Professional Photography</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-purple-600" /> Drone Shots</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-purple-600" /> Video Production</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-purple-600" /> Preschool Promotional Videos</li>
              </ul>
              <Button variant="outline" className="w-full" asChild><Link to="/contact">Book a Shoot</Link></Button>
            </div>

            {/* Branding Services */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-6">
                <Palette className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Branding Services</h3>
              <p className="text-slate-600 mb-4">Professional identity design for your institution.</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-pink-600" /> Logo Design</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-pink-600" /> Preschool Profile Documents</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-pink-600" /> Prospectus</li>
                <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-4 w-4 text-pink-600" /> Social Media Branding</li>
              </ul>
              <Button variant="outline" className="w-full" asChild><Link to="/contact">Get a Quote</Link></Button>
            </div>
          </div>
        </div>

        {/* Partner Pricing */}
        <div className="mt-32 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">For Partners & Ecosystem</h2>
            <p className="text-xl text-slate-600">Connect with schools and parents across the country.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Supplier Pricing - Subscription Plans for Sellers */}
            <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[2.5rem] p-8 md:p-12 border border-blue-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <Building2 className="w-48 h-48 text-blue-900" />
              </div>
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-blue-100/50">
                  <div>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none mb-3 font-bold">New Seller Subscriptions</Badge>
                    <h3 className="text-3xl font-extrabold text-slate-900">Marketplace Seller Plans</h3>
                    <p className="text-slate-600 mt-2 max-w-xl">Choose a seller model that aligns with your volume. List uniforms, resources, toys, food, and furniture directly to early childhood institutions.</p>
                  </div>
                  <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 rounded-xl py-6 font-bold" asChild>
                    <Link to="/register-supplier">Become a Supplier</Link>
                  </Button>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                  {[
                    {
                      name: "Basic Supplier",
                      price: "E0",
                      period: "/mo",
                      features: ["10% Sales Commission", "Up to 15 listings", "Standard support", "Standard listing placement"]
                    },
                    {
                      name: "Growth Seller",
                      price: "E199",
                      period: "/mo",
                      popular: true,
                      features: ["5% Sales Commission", "Up to 100 listings", "WhatsApp support", "Featured seller ribbon", "Access to school quotes"]
                    },
                    {
                      name: "Elite Partner",
                      price: "E499",
                      period: "/mo",
                      features: ["0% Sales Commission", "Unlimited listings", "Dedicated account manager", "Top search ranking", "Real-time SMS alerts for bids"]
                    }
                  ].map((tier, idx) => (
                    <div key={idx} className={`bg-white rounded-2xl p-6 border flex flex-col justify-between ${tier.popular ? "border-blue-500 shadow-md ring-2 ring-blue-500/20" : "border-slate-200"}`}>
                      <div>
                        {tier.popular && <span className="text-[10px] bg-blue-600 text-white font-extrabold px-2.5 py-0.5 rounded-full inline-block uppercase mb-1">Best Value</span>}
                        <h4 className="font-bold text-slate-900 text-base">{tier.name}</h4>
                        <div className="my-3 flex items-baseline gap-1">
                          <span className="text-2xl font-extrabold text-slate-900">{tier.price}</span>
                          <span className="text-xs text-slate-500">{tier.period}</span>
                        </div>
                        <ul className="space-y-2 mt-4">
                          {tier.features.map((feat, fidx) => (
                            <li key={fidx} className="flex items-start gap-2 text-xs text-slate-600">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Advertiser Pricing */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-[2rem] p-8 border border-purple-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <MonitorSmartphone className="w-24 h-24 text-purple-900" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Advertisers</h3>
                <p className="text-slate-600 mb-6 min-h-[3rem]">Reach our engaged audience of parents, students, and educators.</p>
                
                <div className="mb-6 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-slate-900">Custom</span>
                  <span className="text-slate-500 font-medium">campaign pricing</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-5 w-5 text-purple-600" /> Parent Portal placements</li>
                  <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-5 w-5 text-purple-600" /> Highly targeted demographics</li>
                  <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-5 w-5 text-purple-600" /> Real-time performance tracking</li>
                  <li className="flex items-center gap-2 text-sm text-slate-700 font-medium"><CheckCircle2 className="h-5 w-5 text-purple-600" /> Banner ads & sponsored content</li>
                </ul>
                <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
                  <Link to="/register-advertiser">Start Advertising</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-32 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "Can I use my own domain name (e.g. www.myschool.sz)?",
                a: "Yes! Custom domains are supported on the Professional and Enterprise plans. We can help you connect your existing domain or register a new one for you."
              },
              {
                q: "Do I need technical skills to build the website?",
                a: "Not at all. Our drag-and-drop builder is designed specifically for preschool owners. If you can use Facebook or WhatsApp, you can build your school's website."
              },
              {
                q: "What happens if I need help?",
                a: "We offer local support via email and WhatsApp for all our customers. Professional and Enterprise plans include priority support."
              },
              {
                q: "Can parents pay school fees through the platform?",
                a: "Yes! Our billing and invoicing module allows you to track payments and parents can view their balances natively in their parent portal."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h4 className="font-semibold text-slate-900 mb-2">{faq.q}</h4>
                <p className="text-slate-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

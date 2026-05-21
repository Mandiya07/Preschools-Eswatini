import { CheckCircle2, Sparkles, Building2, TrendingUp, MonitorSmartphone, Camera, ShieldCheck, Palette, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";

export function PricingPage() {
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, i) => (
            <div key={i} className={`rounded-3xl bg-white border p-8 flex flex-col ${plan.popular ? 'border-blue-600 shadow-xl relative' : 'border-slate-200 shadow-sm'}`}>
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold text-white tracking-widest uppercase shadow-sm">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-slate-500 text-sm mb-6 pb-6 border-b border-slate-100 min-h-[4rem]">{plan.description}</p>
              
              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                <span className="text-slate-500 font-medium">{plan.period}</span>
              </div>
              
              <ul className="mb-8 space-y-4 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              
              <Button variant={plan.popular ? 'default' : 'outline'} className={`w-full h-12 ${!plan.popular && 'border-slate-300'}`} asChild>
                <Link to="/register">{plan.cta}</Link>
              </Button>
            </div>
          ))}
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
              <Button variant="outline" className="w-full">View Modules</Button>
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
              <Button variant="outline" className="w-full">Request Quote</Button>
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
              <Button variant="outline" className="w-full">Explore</Button>
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
              <Button variant="outline" className="w-full">View Support Plans</Button>
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
              <Button variant="outline" className="w-full">Book a Shoot</Button>
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
              <Button variant="outline" className="w-full">Get a Quote</Button>
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

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for small daycares and learning centers starting their digital journey.",
    price: "E299",
    period: "/month",
    popular: false,
    cta: "Start Free Trial",
    features: [
      "Custom Preschool Website (.preschoolseswatini.com)",
      "Listed in National Directory",
      "Up to 50 Student Records",
      "Basic Announcements",
      "Email Support"
    ]
  },
  {
    name: "Professional",
    description: "The complete toolkit for growing preschools, daycares, and early learning centres.",
    price: "E599",
    period: "/month",
    popular: true,
    cta: "Start Free Trial",
    features: [
      "Everything in Starter",
      "Online Admissions & Applications",
      "Parent Portal Access",
      "Unlimited Student Records",
      "Billing, Invoicing & Financials",
      "Digital Document Archive",
      "E-Learning Course & Video Management",
      "Community Marketplace",
      "Custom Domain Support",
      "Priority WhatsApp & Live Support"
    ]
  },
  {
    name: "Enterprise",
    description: "Advanced features for large preschools, ECD chains, or groups of centres.",
    price: "E999",
    period: "/month",
    popular: false,
    cta: "Contact Sales",
    features: [
      "Everything in Professional",
      "Multi-Branch & Institution Management",
      "Advanced Export & Reporting",
      "Full Trust, Verification & Accreditation",
      "Multiple Staff Admin Accounts",
      "24/7 AI Support Assistant",
      "Unlimited Video & Content Hosting",
      "Dedicated Account Manager",
      "Full API & Custom Integrations"
    ]
  }
];

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { motion } from "motion/react";
import { Logo } from "@/components/layout/Logo";
import { 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  Globe, 
  Laptop, 
  MessageSquare, 
  Smartphone, 
  Users,
  PlayCircle,
  Star,
  Quote,
  ArrowRight,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  Heart,
  Sparkles,
  Sun
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AIChatBot } from "@/components/AIChatBot";

// Images
import classroomImg from '@/assets/images/black_preschool_children_classroom_1778977043228.png';
import girlImg from '@/assets/images/black_preschool_girl_smiling_1778977067358.png';
import teacherImg from '@/assets/images/black_preschool_teacher_kids_1778977086971.png';

import { PRICING_TIERS, FEATURES } from "@/components/PricingTier";

export function LandingPage() {
  return (
    <div className="flex flex-col bg-slate-50 font-sans overflow-x-hidden">
      <SEO 
        title="Preschools Eswatini | Find & Launch Early Education"
        description="The modern platform for early childhood education in Eswatini. Connect parents with top preschools, list your daycare, and manage admissions easily."
      />
      
      {/* 1. Hero Section - With Background Image & Gradient Overlay */}
      <section className="relative pt-28 pb-28 lg:pt-36 lg:pb-40 overflow-hidden rounded-b-[3rem] lg:rounded-b-[5rem] shadow-xl text-white">
        {/* Hero Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={teacherImg} 
            alt="Preschool Teacher and Kids in Eswatini" 
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Gradient dark overlay for crystal-clear readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/60 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 max-w-2xl"
            >
              <div className="inline-flex items-center gap-2.5 mb-6 p-2 pr-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-inner">
                <Logo variant="icon" size="sm" />
                <span className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse fill-amber-400" />
                  Eswatini's National Early Education System
                </span>
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.05]">
                Run your school
                <span className="block text-emerald-400 mt-2 drop-shadow-md">beautifully.</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-slate-200 leading-relaxed max-w-xl font-normal">
                Replace chaotic WhatsApp groups and paper admissions with a single, elegant platform. Launch a professional website, manage enrollments, and engage parents—all in one place. Built specifically for daycares and preschools.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-14 px-8 text-base bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black shadow-xl shadow-emerald-500/25 rounded-2xl transition-all hover:-translate-y-1" asChild>
                  <Link to="/register">Create Your School Website</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-white/10 hover:bg-white/20 text-white border-white/30 rounded-2xl backdrop-blur-md transition-all hover:-translate-y-1" asChild>
                  <Link to="/directory"><Heart className="mr-2 h-5 w-5 text-rose-400 fill-rose-400"/> Discover Schools</Link>
                </Button>
              </div>
              <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 max-w-lg">
                <Logo variant="standard" size="sm" />
                <div className="text-xs text-slate-200 font-medium leading-normal border-t sm:border-t-0 sm:border-l border-white/20 pt-2 sm:pt-0 sm:pl-4">
                  Official platform connecting preschools across the Kingdom of Eswatini.
                </div>
              </div>
            </motion.div>
            
            {/* Glassmorphism Floating Feature Cards */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="lg:col-span-5 relative"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-white/15">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Live Preschool Portal</h3>
                      <p className="text-[11px] text-slate-300">Kingdom-Wide Platform</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span> Active System
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4">
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Preschools</p>
                    <p className="text-2xl font-black text-white mt-1">120+</p>
                  </div>
                  <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4">
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Regions</p>
                    <p className="text-2xl font-black text-emerald-300 mt-1">All 4</p>
                  </div>
                </div>

                <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold shrink-0">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-white">Instant Mobile Website</p>
                    <p className="text-slate-300 text-[11px] mt-0.5">Includes MoMo fees, SMS &amp; parent portal</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Value Proposition & Features Overview - Minimal Grid */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl tracking-tight">Everything you need to thrive</h2>
            <p className="mt-4 text-xl text-slate-600 font-medium">A completely integrated software suite built specifically for preschool administration and parent engagement.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div 
                whileHover={{ y: -5 }}
                key={i} 
                className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all"
              >
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-2xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Demo Preview Section - SaaS Alternate Layout */}
      <section className="py-24 bg-white rounded-[3rem] lg:rounded-[5rem] shadow-sm mb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-32">
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center rounded-full bg-secondary/20 px-3 py-1 text-sm font-bold text-secondary-foreground mb-4">
                Website Builder
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight sm:text-4xl">Your school, beautifully presented online.</h3>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed font-medium">
                Launch a mobile-responsive, beautifully designed website without writing a line of code. Update photo galleries, post news, and showcase your curriculum directly from your phone.
              </p>
              <ul className="space-y-5">
                {['Custom preschool templates', 'Integrated photo galleries', 'News and notices board', 'Custom domain support'].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-700 font-bold text-lg">
                    <CheckCircle2 className="mr-4 h-6 w-6 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <div className="relative">
              <div className="absolute inset-0 bg-secondary/30 rounded-[2.5rem] transform translate-x-4 translate-y-4"></div>
              <img src={classroomImg} alt="Preschool children playing" className="relative rounded-[2rem] shadow-xl border-4 border-white object-cover aspect-[4/3] w-full" />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] transform -translate-x-4 translate-y-4"></div>
              <div className="relative bg-white rounded-[2rem] shadow-xl border-4 border-white p-8 flex flex-col gap-4 aspect-[4/3] justify-center">
                {/* Mock admission form */}
                <div className="h-8 w-1/2 bg-slate-100 rounded-full mb-6"></div>
                <div className="space-y-6">
                  <div>
                    <div className="h-3 w-1/4 bg-slate-100 rounded-full mb-3"></div>
                    <div className="h-12 w-full bg-slate-50 border border-slate-100 rounded-xl"></div>
                  </div>
                  <div>
                    <div className="h-3 w-1/3 bg-slate-100 rounded-full mb-3"></div>
                    <div className="h-12 w-full bg-slate-50 border border-slate-100 rounded-xl"></div>
                  </div>
                  <div className="pt-4">
                    <div className="h-12 w-1/3 bg-primary rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary mb-4">
                Online Admissions
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight sm:text-4xl">Paperless enrollments.</h3>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed font-medium">
                Allow parents to apply online, submit required documents securely, and pay registration fees seamlessly. Manage waiting lists and application statuses from your dashboard.
              </p>
              <Button variant="link" className="px-0 text-primary font-bold text-lg" asChild>
                <Link to="/features">See all admission features <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </motion.div>
          </div>

        </div>
      </section>


      {/* 5. Directory CTA Section */}
      <section className="py-24 bg-white overflow-hidden mb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-secondary/10 rounded-[3rem] shadow-sm border border-secondary/20 overflow-hidden flex flex-col md:flex-row items-center">
            <div className="p-10 lg:p-16 flex-1 flex flex-col justify-center">
              <h3 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight sm:text-4xl">Are you a parent?</h3>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed font-medium">
                Explore our national directory of preschools. Filter by location, curriculum, and age groups to find the perfect learning environment for your child.
              </p>
              <div>
                <Button size="lg" className="h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-lg shadow-xl" asChild>
                  <Link to="/directory">Browse Preschool Directory</Link>
                </Button>
              </div>
            </div>
            <div className="w-full md:w-2/5 relative min-h-[350px] m-4 md:m-0 md:mr-8 rounded-[2rem] overflow-hidden">
              <img src={girlImg} alt="Smiling preschool girl" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Pricing Section */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-700 font-bold px-3.5 py-1 rounded-full text-xs uppercase tracking-wider mb-3">
              Transparent & Accessible Eswatini Pricing
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">Simple, predictable pricing for every preschool</h2>
            <p className="mt-4 text-lg text-slate-600 font-medium">Starting from just E199/month (less than E7/day). Free 14-day trial on all standard plans.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {PRICING_TIERS.map((plan) => (
              <motion.div 
                whileHover={{ y: -6 }}
                key={plan.id} 
                className={`bg-white rounded-3xl border p-6 flex flex-col ${
                  plan.popular ? 'border-primary ring-2 ring-primary shadow-xl relative scale-[1.02] z-10' : 'border-slate-200 shadow-sm hover:border-primary/40'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3.5 py-1 text-[10px] font-black text-white tracking-widest uppercase shadow-md">
                    Main Selling Plan
                  </div>
                )}
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-extrabold text-slate-900">{plan.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    {plan.bestFor}
                  </span>
                </div>
                <p className="text-xs font-semibold text-primary italic mb-2">"{plan.tagline}"</p>
                <p className="text-slate-500 text-xs mb-4 pb-4 border-b border-slate-100 font-medium min-h-[44px] leading-relaxed">{plan.description}</p>
                
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">E{plan.price.monthly}</span>
                    <span className="text-slate-500 font-bold text-sm">/mo</span>
                  </div>
                  <p className="text-[11px] font-bold text-emerald-600 mt-0.5">
                    or E{plan.price.annual.toLocaleString()}/yr (Save 20%)
                  </p>
                </div>
                
                <ul className="mb-6 space-y-2.5 flex-1 text-xs">
                  <li className="flex items-start gap-2 text-slate-800 font-bold">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>{plan.limits.students === 9999 ? 'Unlimited' : plan.limits.students}</strong> Student Capacity</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-800 font-bold">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>{plan.limits.admins}</strong> Staff / Admin {plan.limits.admins === 1 ? 'Login' : 'Logins'}</span>
                  </li>
                  {plan.highlights.slice(0, 4).map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-600 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-tight">{h}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={plan.popular ? 'default' : 'outline'} 
                  className={`w-full h-11 text-sm font-bold rounded-xl ${plan.popular ? 'shadow-md shadow-primary/20' : 'border-slate-300'}`} 
                  asChild
                >
                  <Link to={`/register?plan=${plan.id}`}>Get Started Free</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8.5 Grassroots Peri-Urban Flatlet Section */}
      <section className="py-20 bg-indigo-900 text-white rounded-[3rem] lg:rounded-[5rem] overflow-hidden my-16 mx-4 sm:mx-6 lg:mx-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="max-w-2xl space-y-4 text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3.5 py-1 text-xs font-bold text-amber-300 border border-white/10 uppercase tracking-widest">
              Grassroots Advocacy & Care
            </span>
            <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ml-3">No Subscription</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Supporting Informal Daycare Flatlets & Home Nannies
            </h2>
            <p className="text-slate-200 text-lg leading-relaxed">
              We are committed to digital equity with <strong className="text-amber-300">E0.00 platform search &amp; registration fees</strong>. Backyard pre-primary nurseries can join our free micro-directory, and parents can instantly connect with verified independent nanny networks (like Grace Nannies and END Network) with zero subscription fees or matching commissions.
            </p>
          </div>
          <Button size="lg" className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold h-14 px-8 rounded-2xl flex items-center gap-2 group whitespace-nowrap" asChild>
            <Link to="/flatlets">
              Explore Free Registries <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>

      {/* 9. Contact Section - Redesigned to be warmer */}
      <section className="py-24 bg-white border-y border-slate-200 rounded-t-[3rem] lg:rounded-t-[5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <div className="inline-flex items-center rounded-full bg-secondary/20 px-3 py-1 text-sm font-bold text-secondary-foreground mb-4">
                We're Here to Help
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight mb-6 sm:text-4xl text-slate-900">Get in touch</h2>
              <p className="text-slate-600 mb-10 text-xl font-medium">Have questions about migrating your school to our platform? Our team is ready to help you every step of the way.</p>
              
              <div className="space-y-8">
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Email Us</p>
                    <p className="text-lg font-bold text-slate-900">hello@preschools.sz</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary-foreground">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Call or WhatsApp</p>
                    <p className="text-lg font-bold text-slate-900">+268 7600 0000</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center text-accent-foreground">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Our Office</p>
                    <p className="text-lg font-bold text-slate-900">Mbabane, Eswatini</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-[2.5rem] p-8 sm:p-10 border border-slate-200/60 shadow-lg">
              <h3 className="text-2xl font-extrabold text-slate-900 mb-8 font-sans">Send a message</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                    <Input placeholder="Your name" className="text-slate-900 bg-white border-slate-200 h-14 rounded-2xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">School Name</label>
                    <Input placeholder="Your preschool" className="text-slate-900 bg-white border-slate-200 h-14 rounded-2xl" />
                  </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                    <Input type="email" placeholder="you@example.com" className="text-slate-900 bg-white border-slate-200 h-14 rounded-2xl" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                    <Textarea placeholder="How can we help?" className="text-slate-900 bg-white border-slate-200 min-h-[140px] rounded-2xl resize-none" />
                </div>
                <Button className="w-full h-14 text-lg font-bold mt-4 rounded-2xl shadow-lg shadow-primary/20">Send Message</Button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* 10. Final CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden rounded-t-[3rem] lg:rounded-t-[5rem] mt-[-2rem] z-10 shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        <div className="absolute top-10 right-10 text-white opacity-20 animate-float" style={{ animationDelay: '1s' }}>
            <Sparkles size={80} />
        </div>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-extrabold text-white sm:text-6xl mb-6 tracking-tight">Ready to modernise your preschool?</h2>
            <p className="text-white/90 text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Join the modern platform dedicated to making early childhood administrative tasks effortless and beautiful.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-16 px-10 text-lg bg-white text-primary hover:bg-slate-50 font-extrabold rounded-2xl shadow-2xl transition-transform hover:-translate-y-1" asChild>
                <Link to="/register">Create Your School Account</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <AIChatBot schoolName="Preschools Eswatini" />
    </div>
  );
}

const features = [
  {
    icon: <Globe className="h-7 w-7" />,
    title: "Instant Website & Content Publishing",
    description: "Launch a beautiful website and publish blogs, magazines, and newsletters to your community seamlessly."
  },
  {
    icon: <Users className="h-7 w-7" />,
    title: "Smart Admissions & Waitlists",
    description: "Accept applications online, automatically prioritize waitlists, and completely digitize your enrollment process."
  },
  {
    icon: <MessageSquare className="h-7 w-7" />,
    title: "Learning Ecosystem",
    description: "Distribute educational resources, curriculum guides, and media directly to parents and students."
  },
  {
    icon: <Laptop className="h-7 w-7" />,
    title: "Finance & Fee Management",
    description: "Generate fee statements, manage petty cash, process digital payments, and project financial revenue."
  },
  {
    icon: <Building2 className="h-7 w-7" />,
    title: "B2B Marketplace & Partnerships",
    description: "Connect with accredited suppliers for bulk purchasing and negotiate partnerships with local brands."
  },
  {
    icon: <Smartphone className="h-7 w-7" />,
    title: "Mobile First HR & Daily Health",
    description: "Manage staff payroll, track daily student health logs, and monitor compliance—all from your mobile device."
  }
];




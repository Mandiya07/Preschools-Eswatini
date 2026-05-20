import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { motion } from "motion/react";
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

export function LandingPage() {
  return (
    <div className="flex flex-col bg-slate-50 font-sans overflow-x-hidden">
      <SEO 
        title="Preschools Eswatini | Find & Launch Early Education"
        description="The modern platform for early childhood education in Eswatini. Connect parents with top preschools, list your daycare, and manage admissions easily."
      />
      
      {/* 1. Hero Section - Warm & Welcoming */}
      <section className="relative pt-24 pb-24 lg:pt-32 lg:pb-40 bg-white overflow-hidden rounded-b-[3rem] lg:rounded-b-[5rem] shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(#fcd34d_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="absolute top-20 left-10 text-yellow-300 opacity-50 animate-float">
            <Sun size={64} />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary mb-6 shadow-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                The Modern Platform for Early Education
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-[1.05]">
                Run your school
                <span className="block text-primary mt-2">beautifully.</span>
              </h1>
              <p className="mt-6 text-xl text-slate-600 leading-relaxed max-w-xl font-medium">
                Replace chaotic WhatsApp groups and paper admissions with a single, elegant platform. Launch a professional website, manage enrollments, and engage parents—all in one place. Built specifically for daycares and preschools.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-14 px-8 text-base shadow-lg shadow-primary/20 rounded-2xl transition-transform hover:-translate-y-1" asChild>
                  <Link to="/register">Create Your School Website</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-white border-slate-200 rounded-2xl hover:bg-slate-50 transition-transform hover:-translate-y-1" asChild>
                  <Link to="/directory"><Heart className="mr-2 h-5 w-5 text-secondary"/> Discover Schools</Link>
                </Button>
              </div>
              <div className="mt-10 flex items-center gap-4 text-sm text-slate-500 font-bold">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-10 w-10 rounded-full border-2 border-white bg-slate-${200 + i*100} flex items-center justify-center text-[10px] shadow-sm font-bold text-white`}>
                      S{i}
                    </div>
                  ))}
                </div>
                Trusted by 50+ preschools across Eswatini
              </div>
            </motion.div>
            
            {/* Hero Visual */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="relative mx-auto w-full max-w-lg lg:max-w-none"
            >
              <div className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-tr from-primary to-secondary opacity-20 blur-3xl"></div>
              <div className="relative rounded-[2rem] border-4 border-white bg-white shadow-2xl shadow-primary/10 overflow-hidden aspect-[4/3] lg:aspect-[3/4] xl:aspect-[4/3] flex flex-col">
                <div className="h-10 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2 z-10 relative">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  <div className="ml-4 h-6 w-48 bg-white border border-slate-200 rounded-md"></div>
                </div>
                <div className="flex-1 relative bg-slate-50 flex flex-col">
                  {/* Fake website preview inside browser */}
                  <div className="h-1/2 relative overflow-hidden group">
                    <img src={teacherImg} alt="Teacher and Kids" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                       <div className="h-6 w-3/4 bg-white/90 rounded-full mb-2"></div>
                       <div className="h-4 w-1/2 bg-white/70 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1 p-6 flex flex-col gap-4">
                    <div className="h-16 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-4 items-center animate-pulse">
                       <div className="h-8 w-8 bg-blue-100 rounded-full"></div>
                       <div className="flex-1">
                         <div className="h-3 w-1/2 bg-slate-200 rounded-full mb-2"></div>
                         <div className="h-2 w-1/3 bg-slate-100 rounded-full"></div>
                       </div>
                    </div>
                  </div>
                  {/* Floating element */}
                  <div className="absolute bottom-10 right-[-20px] bg-white rounded-2xl border border-slate-200 shadow-xl p-4 w-52 rotate-[-6deg] animate-float">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-xl">🎉</div>
                      <div className="h-3 w-24 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full mb-1.5"></div>
                    <div className="h-2 w-2/3 bg-slate-100 rounded-full"></div>
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

      {/* 4. Testimonials */}
      <section className="py-24 bg-slate-900 text-white rounded-[3rem] lg:rounded-[5rem] mx-4 sm:mx-6 lg:mx-8 mb-12 shadow-2xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight">Loved by School Leaders</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { text: "This platform completely transformed how we communicate with parents. The online admissions saved us weeks of sorting through paper forms.", author: "Zandi Thwala", role: "Principal, Little Explorers" },
              { text: "Having a professional website made a huge difference. We filled our enrollment capacity for next year in record time because parents could easily find us and apply online.", author: "Siphesihle Dlamini", role: "Owner, Tiny Tots Center" },
              { text: "The parent portal is fantastic. Parents loved being able to log in, see fee statements, and read updates without having to scroll through noisy WhatsApp groups.", author: "Nomsa Mkhonta", role: "Administrator, Bright Minds" },
            ].map((testimonial, i) => (
              <motion.div 
                whileHover={{ y: -5 }}
                key={i} 
                className="bg-slate-800/80 rounded-[2rem] p-8 border border-slate-700 relative backdrop-blur-sm"
              >
                <Quote className="absolute top-8 right-8 h-8 w-8 text-slate-600 opacity-50" />
                <div className="flex gap-1 mb-6 text-secondary">
                  <Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" /><Star className="h-5 w-5 fill-current" />
                </div>
                <p className="text-slate-200 mb-8 text-base leading-relaxed font-medium">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white text-lg">{testimonial.author.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-white text-base">{testimonial.author}</p>
                    <p className="text-sm text-slate-400 font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
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
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">Simple, transparent pricing</h2>
            <p className="mt-4 text-xl text-slate-600 font-medium">Start with our free trial. Upgrade when you need more power.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div 
                whileHover={{ y: -10 }}
                key={i} 
                className={`bg-white rounded-[2.5rem] border p-8 sm:p-10 flex flex-col ${plan.popular ? 'border-primary ring-2 ring-primary shadow-2xl relative' : 'border-slate-200 shadow-md'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white tracking-widest uppercase shadow-md">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">{plan.name}</h3>
                <p className="text-slate-500 text-base mb-6 font-medium min-h-[3rem]">{plan.description}</p>
                <div className="mb-8 flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500 font-bold text-lg">{plan.period}</span>
                </div>
                <ul className="mb-10 space-y-5 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-4 text-slate-700 font-bold">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={plan.popular ? 'default' : 'outline'} className={`w-full h-14 text-lg font-bold rounded-2xl ${plan.popular ? 'shadow-lg shadow-primary/20' : 'border-slate-300'}`} asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </motion.div>
            ))}
          </div>
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

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for small daycares starting their digital journey.",
    price: "E299",
    period: "/mo",
    popular: false,
    features: [
      "Custom School Website",
      "Listed in School Directory",
      "Up to 50 Students",
      "Basic Parent Portal",
      "Email Support"
    ]
  },
  {
    name: "Professional",
    description: "The complete toolkit for growing preschools and academies.",
    price: "E599",
    period: "/mo",
    popular: true,
    features: [
      "Everything in Starter",
      "Online Admissions System",
      "Up to 200 Students",
      "SMS & Email Announcements",
      "Staff Management",
      "Priority WhatsApp Support"
    ]
  },
  {
    name: "Enterprise",
    description: "Advanced features for large institutions or groups.",
    price: "E999",
    period: "/mo",
    popular: false,
    features: [
      "Everything in Professional",
      "Unlimited Students",
      "Advanced Analytics",
      "Custom Domain Support",
      "Dedicated Account Manager",
      "Custom API Integrations"
    ]
  }
];



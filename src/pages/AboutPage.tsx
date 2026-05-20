import { SEO } from "@/components/SEO";
import { motion } from "motion/react";
import schoolImg from "@/assets/images/happy_school_building_1779268620645.png";
import kidsImg from "@/assets/images/kids_playing_blocks_1779268580565.png";

export function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-16">
      <SEO title="About | Sikolo Platform" />
      
      <div className="text-center max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-bold text-blue-800 mb-6"
        >
          Our Story
        </motion.div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6">About Sikolo</h1>
        <p className="text-2xl text-slate-600 font-medium leading-relaxed">
          Empowering early learning institutions, enabling brighter futures.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-200 rounded-[3rem] transform -rotate-3 scale-105 opacity-50 z-0"></div>
          <img 
            src={schoolImg} 
            alt="Colorful school building" 
            className="relative z-10 w-full rounded-[2.5rem] shadow-xl object-cover aspect-[4/3] border-4 border-white"
          />
        </div>
        <div className="prose prose-slate prose-lg max-w-none text-slate-700">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Bridging the Gap</h2>
          <p className="font-medium leading-relaxed">
            Sikolo is a cutting-edge platform designed to bridge the digital gap in early childhood education. 
            Our mission is to provide daycares and preschools with the tools they 
            need to excel in a modern, connected world.
          </p>
          <p className="font-medium leading-relaxed mt-4">
            We believe in streamlining administrative tasks, enhancing parent-school communication, 
            and providing students and teachers with world-class digital learning experiences that spark joy and curiosity.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
        <div className="prose prose-slate prose-lg max-w-none text-slate-700 order-2 md:order-1">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Our Vision</h2>
          <p className="font-medium leading-relaxed">
            To create a seamlessly connected educational ecosystem where every child has access to quality information, and every school administrator is empowered to lead with data-driven insights.
          </p>
          <ul className="space-y-4 mt-6">
            <li className="flex items-center gap-3 font-bold text-slate-700">
              <span className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">1</span>
              Accessible to all schools
            </li>
            <li className="flex items-center gap-3 font-bold text-slate-700">
              <span className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">2</span>
              Nurturing parent engagement
            </li>
            <li className="flex items-center gap-3 font-bold text-slate-700">
              <span className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">3</span>
              Tools that save administrators time
            </li>
          </ul>
        </div>
        <div className="relative order-1 md:order-2">
          <div className="absolute inset-0 bg-emerald-200 rounded-[3rem] transform rotate-3 scale-105 opacity-50 z-0"></div>
          <img 
            src={kidsImg} 
            alt="Children playing with blocks" 
            className="relative z-10 w-full rounded-[2.5rem] shadow-xl object-cover aspect-[4/3] border-4 border-white"
          />
        </div>
      </div>

    </div>
  );
}

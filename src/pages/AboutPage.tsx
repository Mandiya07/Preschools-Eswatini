import { SEO } from "@/components/SEO";

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <SEO title="About | Sikolo Platform" />
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">About Sikolo</h1>
        <p className="mt-4 text-xl text-slate-600">Empowering institutions, enabling futures.</p>
      </div>

      <div className="prose prose-slate max-w-none text-slate-600">
        <p className="text-lg">
          Sikolo is a cutting-edge platform designed to bridge the digital gap in education. 
          Our mission is to provide daycares and preschools with the tools they 
          need to excel in a digital-first world.
        </p>
        <p>
          We believe in streamlining administrative tasks, enhancing parent-school communication, 
          and providing students and teachers with world-class digital learning experiences.
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Our Vision</h2>
        <p>
          To create a seamlessly connected educational ecosystem where every child has access to quality information and every school administrator is empowered to lead with data-driven insights.
        </p>
      </div>
    </div>
  );
}

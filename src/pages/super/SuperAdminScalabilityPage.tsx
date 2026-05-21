import { useState } from "react";
import { 
  Building2, GitBranch, Layout, Server, Plug, 
  Palette, Settings, FileCode, CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

export function SuperAdminScalabilityPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <SEO title="Scalability & Platform | Preschools Eswatini SuperAdmin" />

      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Scalability & Platform</h1>
        <p className="text-slate-500 text-lg">Manage multi-school groups, platform extensions, and white-labeling.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Multi-school & Franchises", icon: Building2, desc: "Manage institution groups and franchise hierarchies." },
          { title: "Branch Management", icon: GitBranch, desc: "Control regional branch settings and local configs." },
          { title: "White-labeling", icon: Palette, desc: "Configure custom branding and domain overrides." },
          { title: "API & Integrations", icon: Server, desc: "Manage external API keys, webhooks, and data sync." },
          { title: "Plugin Ecosystem", icon: Plug, desc: "Enable/disable 3rd party platform plugins." },
          { title: "Theme Marketplace", icon: Layout, desc: "Approve and distribute UI themes to schools." },
          { title: "Add-on Modules", icon: Settings, desc: "Tweak pricing and enabled features by tier." },
          { title: "Developer Tools", icon: FileCode, desc: "Manage API documentation and developer access." },
        ].map((item, i) => (
          <Card key={i} className="shadow-sm border-none p-6">
            <CardHeader className="p-0 mb-4 flex flex-row items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <item.icon className="h-6 w-6" />
              </div>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <CardDescription>{item.desc}</CardDescription>
               <Button className="mt-4 w-full" variant="outline">Manage</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

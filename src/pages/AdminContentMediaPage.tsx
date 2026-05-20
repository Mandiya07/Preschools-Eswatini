import { useState } from "react";
import { 
  Camera, Video, Mic, Newspaper, Radio, Download, 
  Upload, Plus, FileText, Image as ImageIcon, Film
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEO } from "@/components/SEO";

export function AdminContentMediaPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <SEO title="Content & Media | Sikolo" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Content & Media System</h1>
          <p className="text-slate-500 text-lg">Manage photos, videos, news, and brochures for your school.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl">
           <Upload className="mr-2 h-4 w-4" /> Upload New Media
        </Button>
      </div>

      <Tabs defaultValue="gallery" className="space-y-6">
        <TabsList>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="news">News & Events</TabsTrigger>
          <TabsTrigger value="streaming">Streaming & Podcasts</TabsTrigger>
          <TabsTrigger value="docs">Brochures & Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery">
          <Card className="border-none shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4">Photo Galleries</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-square bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                        <ImageIcon className="h-8 w-8" />
                    </div>
                ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="news">
            <Card className="border-none shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Latest News</h2>
                    <Button variant="secondary" size="sm" className="rounded-xl">
                        <Plus className="mr-2 h-4 w-4" /> Publish Post
                    </Button>
                </div>
                <div className="space-y-4">
                    {["Open Day Announcement", "Science Fair Winners", "New Sports Equipment"].map((post, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 border rounded-2xl">
                            <Newspaper className="h-8 w-8 text-blue-600" />
                            <span className="font-medium text-slate-900">{post}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </TabsContent>

        <TabsContent value="streaming">
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Film className="h-5 w-5 text-purple-600" /> Video & Streams
                    </h2>
                    <Input placeholder="Enter video/stream link (e.g., YouTube URL)" />
                </Card>
                <Card className="border-none shadow-sm p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Mic className="h-5 w-5 text-amber-600" /> Podcast Episodes
                    </h2>
                    <Input placeholder="Enter podcast link" />
                </Card>
            </div>
        </TabsContent>

        <TabsContent value="docs">
            <Card className="border-none shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">Brochures & Resources</h2>
                <div className="grid grid-cols-2 gap-4">
                    {[1,2].map(i => (
                        <div key={i} className="flex items-center gap-4 p-6 border rounded-2xl">
                            <FileText className="h-8 w-8 text-slate-400" />
                            <div>
                                <h4 className="font-bold">Info_Brochure_{2026+i}.pdf</h4>
                                <p className="text-xs text-slate-500">2.4MB • PDF</p>
                            </div>
                            <Button variant="ghost" className="ml-auto"><Download className="h-4 w-4" /></Button>
                        </div>
                    ))}
                </div>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

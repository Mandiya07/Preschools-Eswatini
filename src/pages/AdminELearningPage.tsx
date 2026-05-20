import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, Search, Plus, PlayCircle, 
  FileText, CheckCircle2, Copy, BarChart, Upload
} from "lucide-react";
import { SEO } from "@/components/SEO";
import type { LearningDocument } from "@/types";

const MOCK_COURSES = [
  { id: "C01", title: "Introduction to Phonics", level: "Grade 1", modules: 8, students: 45, status: "Published", progress: 68 },
  { id: "C02", title: "Basic Numeracy & Forms", level: "Grade 1", modules: 6, students: 45, status: "Published", progress: 42 },
  { id: "C03", title: "Environmental Studies", level: "Grade 2", modules: 10, students: 38, status: "Draft", progress: 0 },
  { id: "C04", title: "Creative Arts", level: "Grade 1", modules: 5, students: 45, status: "Published", progress: 89 },
];

const MOCK_DOCUMENTS: LearningDocument[] = [
  { id: "doc1", schoolId: "sch1", title: "Phonics Worksheet 1", type: "worksheet", url: "#", status: "private", createdAt: "2026-05-19", updatedAt: "2026-05-19" },
  { id: "doc2", schoolId: "sch1", title: "Lesson Plan: Science", type: "lesson_plan", url: "#", status: "pending_approval", createdAt: "2026-05-20", updatedAt: "2026-05-20" },
  { id: "doc3", schoolId: "sch1", title: "School Presentation", type: "presentation", url: "#", status: "shared_to_network", createdAt: "2026-05-15", updatedAt: "2026-05-15" },
];

export function AdminELearningPage() {
  const [activeTab, setActiveTab] = useState("courses");
  const [documents, setDocuments] = useState<LearningDocument[]>(MOCK_DOCUMENTS);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <SEO title="E-Learning | Sikolo Admin" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">E-Learning & Courses</h1>
          <p className="text-sm text-slate-500 mt-1">Manage online courses, digital assignments, and AI-assisted grading.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white">
            <Copy className="mr-2 h-4 w-4" /> Import from Template
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Create Course
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Courses</p>
              <h3 className="text-2xl font-bold text-slate-900">12</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <PlayCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Video Lessons</p>
              <h3 className="text-2xl font-bold text-slate-900">48</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Grading</p>
              <h3 className="text-2xl font-bold text-slate-900">124</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <BarChart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Avg. Completion</p>
              <h3 className="text-2xl font-bold text-slate-900">68%</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="w-full mt-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 lg:w-[750px] h-12 bg-slate-100 rounded-xl p-1 mb-8">
          <TabsTrigger value="courses" className="rounded-lg font-bold data-[state=active]:shadow-sm">All Courses</TabsTrigger>
          <TabsTrigger value="management" className="rounded-lg font-bold data-[state=active]:shadow-sm">Management</TabsTrigger>
          <TabsTrigger value="assignments" className="rounded-lg font-bold data-[state=active]:shadow-sm">Assignments</TabsTrigger>
          <TabsTrigger value="ai-grading" className="rounded-lg font-bold data-[state=active]:shadow-sm">AI Grading</TabsTrigger>
          <TabsTrigger value="library" className="rounded-lg font-bold data-[state=active]:shadow-sm">Resource Library</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Course Catalog</h3>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input placeholder="Search courses..." className="pl-9 bg-white" />
              </div>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_COURSES.map((course) => (
                 <Card key={course.id} className="rounded-2xl border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
                    <div className="h-32 bg-slate-100 relative">
                       <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 mix-blend-multiply"></div>
                       {/* Abstract pattern bg */}
                       <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, slate-800 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                       
                       <Badge className={`absolute top-4 right-4 ${course.status === 'Published' ? 'bg-white text-slate-900 hover:bg-slate-50' : 'bg-slate-800 text-white hover:bg-slate-700'} border-none shadow-sm`}>
                         {course.status}
                       </Badge>
                       
                       <div className="absolute bottom-4 left-4">
                          <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-none shadow-sm text-slate-800 font-bold">
                             {course.level}
                          </Badge>
                       </div>
                    </div>
                    <CardHeader className="pb-3 pt-5">
                       <CardTitle className="text-xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{course.title}</CardTitle>
                       <CardDescription className="text-sm">
                          {course.modules} Modules • {course.students} Students
                       </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4 flex-1">
                       {course.status === 'Published' ? (
                         <div className="space-y-2">
                            <div className="flex justify-between text-xs font-medium text-slate-500">
                               <span>Class Progress</span>
                               <span>{course.progress}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                               <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
                            </div>
                         </div>
                       ) : (
                         <p className="text-sm text-slate-500 line-clamp-2">Complete adding your video lessons and assignments before publishing to students.</p>
                       )}
                    </CardContent>
                    <CardFooter className="pt-0 pb-5">
                       <Button variant="outline" className="w-full bg-white border-slate-200">
                          Manage Course
                       </Button>
                    </CardFooter>
                 </Card>
              ))}
           </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
           <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                 <CardTitle className="mb-2">Upload Course</CardTitle>
                 <CardDescription>Upload new curriculum materials.</CardDescription>
                 <Button className="mt-4 w-full"><Upload className="mr-2 h-4 w-4"/> Upload Course</Button>
              </Card>
              <Card className="p-6">
                 <CardTitle className="mb-2">Manage Videos</CardTitle>
                 <CardDescription>Edit lesson video structure.</CardDescription>
                 <Button variant="outline" className="mt-4 w-full"><PlayCircle className="mr-2 h-4 w-4"/> Edit Lessons</Button>
              </Card>
              <Card className="p-6">
                 <CardTitle className="mb-2">Student Progress</CardTitle>
                 <CardDescription>View class progress analytics.</CardDescription>
                 <Button variant="outline" className="mt-4 w-full"><BarChart className="mr-2 h-4 w-4"/> View Report</Button>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
           <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
             <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Resource Library</CardTitle>
                  <CardDescription>Manage your educational materials and shared network resources.</CardDescription>
                </div>
                <Button>
                  <Upload className="mr-2 h-4 w-4" /> Upload Document
                </Button>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 {documents.map((doc) => (
                   <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                         <FileText className="h-6 w-6 text-slate-400" />
                         <div>
                            <p className="font-medium text-slate-900">{doc.title}</p>
                            <p className="text-xs text-slate-500 uppercase">{doc.type}</p>
                         </div>
                      </div>
                      <Badge variant={doc.status === 'shared_to_network' ? 'default' : 'outline'}>
                        {doc.status.replace('_', ' ')}
                      </Badge>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="ai-grading" className="space-y-6">
           <Card className="rounded-[2rem] border-slate-200 shadow-sm overflow-hidden bg-white">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 border-b border-slate-100">
                 <div className="max-w-2xl">
                    <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-none mb-4">Beta Feature</Badge>
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-2">AI-Assisted Grading</h2>
                    <p className="text-slate-600 font-medium leading-relaxed">
                       Automatically grade multiple-choice questions, fill-in-the-blanks, and get suggested feedback for open-ended essay questions based on your rubrics.
                    </p>
                 </div>
              </div>
              <div className="p-8">
                 <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-24 w-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                       <CheckCircle2 className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No pending assignments!</h3>
                    <p className="text-slate-500 mb-6 max-w-md">All submitted assignments have been processed. Students can view their results in the Parent Portal.</p>
                    <Button variant="outline" className="border-slate-200">Review Auto-Graded Papers</Button>
                 </div>
              </div>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, Search, Plus, PlayCircle, 
  FileText, CheckCircle2, Copy, BarChart, Upload, Loader2
} from "lucide-react";
import { SEO } from "@/components/SEO";
import type { LearningDocument } from "@/types";
import { useAuth } from "@/lib/AuthContext";
import { subscribeToCollection, createDocument, updateDocument } from "@/lib/firestoreUtils";
import { where, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { toast } from "sonner";

export function AdminELearningPage() {
  const { user, activeSchoolId } = useAuth();
  const effectiveSchoolId = user?.role === 'SuperAdmin' ? activeSchoolId : user?.schoolId;
  const [activeTab, setActiveTab] = useState("courses");
  const [documents, setDocuments] = useState<LearningDocument[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [progress, setProgress] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [filterStudent, setFilterStudent] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!effectiveSchoolId) return;

    const unsubCourses = subscribeToCollection(
      'courses',
      (data) => setCourses(data),
      where('schoolId', '==', effectiveSchoolId)
    );

    const unsubProgress = subscribeToCollection(
      'student_progress',
      (data) => setProgress(data),
      where('schoolId', '==', effectiveSchoolId)
    );

    const unsubDocs = subscribeToCollection(
      'learning_documents',
      (data) => setDocuments(data as LearningDocument[]),
      where('schoolId', '==', effectiveSchoolId)
    );

    const unsubLessons = subscribeToCollection(
      'lessons',
      (data) => setLessons(data),
      where('schoolId', '==', effectiveSchoolId)
    );

    setLoading(false);

    return () => {
      unsubCourses();
      unsubProgress();
      unsubDocs();
      unsubLessons();
    };
  }, [effectiveSchoolId]);

  const filteredProgress = progress.filter(p => 
    p.studentName?.toLowerCase().includes(filterStudent.toLowerCase()) &&
    p.course?.toLowerCase().includes(filterCourse.toLowerCase())
  );

  const handleVideoUpload = async (lessonId: string, file: File | null) => {
    if (!file || !effectiveSchoolId) return;
    try {
      toast.loading("Uploading video...", { id: "video-upload" });
      const fileRef = ref(storage, `schools/${effectiveSchoolId}/lessons/${lessonId}/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      await updateDocument('lessons', lessonId, { videoUrl: url });
      toast.success("Video uploaded successfully!", { id: "video-upload" });
    } catch(err) {
      console.error("Upload error", err);
      toast.error("Failed to upload video.", { id: "video-upload" });
    }
  };

  if (loading) {
     return <div className="flex h-64 items-center justify-center border rounded-xl"><Loader2 className="w-8 h-8 animate-spin text-blue-600"/></div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <SEO title="E-Learning | Preschools Eswatini Admin" />
      
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
        <TabsList className="grid w-full grid-cols-6 lg:w-[900px] h-12 bg-slate-100 rounded-xl p-1 mb-8">
          <TabsTrigger value="courses" className="rounded-lg font-bold data-[state=active]:shadow-sm">All Courses</TabsTrigger>
          <TabsTrigger value="management" className="rounded-lg font-bold data-[state=active]:shadow-sm">Management</TabsTrigger>
          <TabsTrigger value="progress" className="rounded-lg font-bold data-[state=active]:shadow-sm">Progress</TabsTrigger>
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
              {courses.length > 0 ? courses.map((course) => (
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
              )) : (
                <div className="col-span-full py-12 text-center text-slate-500">No courses available.</div>
              )}
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

           <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Lesson Materials</CardTitle>
                <CardDescription>Manage files for each lesson.</CardDescription>
              </CardHeader>
              <div className="space-y-4">
                {lessons.map(lesson => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                     <div className="flex-1 mr-4">
                        <p className="font-semibold text-slate-900">{lesson.title}</p>
                        <p className="text-sm text-slate-500 mb-2">{lesson.course}</p>
                        {lesson.videoUrl ? (
                           <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 max-w-sm">
                             <video src={lesson.videoUrl} controls className="w-full aspect-video" />
                           </div>
                        ) : (
                           <div className="mt-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 max-w-sm aspect-video flex flex-col items-center justify-center text-slate-400">
                             <PlayCircle className="h-8 w-8 mb-2 opacity-50" />
                             <span className="text-xs font-medium">No video uploaded</span>
                           </div>
                        )}
                     </div>
                     <div className="flex flex-col items-end gap-2 shrink-0">
                       {lesson.videoUrl && (
                          <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-emerald-200">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Hosted on Cloud
                          </Badge>
                       )}
                       <label className="cursor-pointer mt-2">
                          <input type="file" accept="video/*" className="hidden" onChange={(e) => handleVideoUpload(lesson.id, (e.target as HTMLInputElement).files?.[0] || null)} />
                          <div className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-100">
                             <Upload className="h-4 w-4 mr-2" /> {lesson.videoUrl ? 'Replace Video' : 'Upload to Cloud Storage'}
                          </div>
                       </label>
                     </div>
                  </div>
                ))}
              </div>
           </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
           <div className="flex gap-4">
              <Input placeholder="Filter by student..." value={filterStudent} onChange={e => setFilterStudent(e.target.value)} className="max-w-xs" />
              <Input placeholder="Filter by course..." value={filterCourse} onChange={e => setFilterCourse(e.target.value)} className="max-w-xs" />
           </div>
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProgress.map((p) => (
                 <Card key={p.id}>
                    <CardContent className="p-6">
                        <h4 className="font-semibold">{p.studentName}</h4>
                        <p className="text-sm text-slate-500 mb-4">{p.course}</p>
                        <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                           <span>Progress</span>
                           <span>{p.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full rounded-full ${p.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${p.progress}%` }}></div>
                        </div>
                        <Badge className="mt-4">{p.status}</Badge>
                    </CardContent>
                 </Card>
              ))}
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

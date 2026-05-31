import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Coffee, 
  Plus, 
  Utensils, 
  History, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Calendar,
  ChefHat
} from "lucide-react";
import { createDocument, subscribeToCollection } from "@/lib/firestoreUtils";
import { where, orderBy, query, limit, Timestamp } from "firebase/firestore";
import { Student, DailyLog, MealLogDetails, MealType, MealIntakeLevel, WeeklyDietaryReport } from "@/types";
import { format, startOfWeek, endOfWeek, subDays } from "date-fns";

interface MealTrackingModuleProps {
  schoolId: string;
  students: Student[];
}

export function MealTrackingModule({ schoolId, students }: MealTrackingModuleProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [mealType, setMealType] = useState<MealType>("Lunch");
  const [intakeLevel, setIntakeLevel] = useState<MealIntakeLevel>("All");
  const [foodItems, setFoodItems] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentLogs, setRecentLogs] = useState<DailyLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  useEffect(() => {
    if (!schoolId) return;

    const unsub = subscribeToCollection(
      'daily_logs',
      (data) => {
        setRecentLogs(data as DailyLog[]);
        setLoadingLogs(false);
      },
      where('schoolId', '==', schoolId),
      where('logType', '==', 'Meal'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    return () => unsub();
  }, [schoolId]);

  const handleLogMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !foodItems) return;

    setIsSubmitting(true);
    try {
      const details: MealLogDetails = {
        mealType,
        foodItems: foodItems.split(',').map(item => item.trim()),
        intakeLevel,
        notes,
        nutritionalNotes: `Recorded nutritional intake: ${intakeLevel} consumption.`
      };

      const logData: Omit<DailyLog, "id"> = {
        schoolId,
        studentId: selectedStudentId,
        date: new Date().toISOString().split('T')[0],
        logType: "Meal",
        details,
        loggedBy: "Staff Member", // In real app, get from auth
        createdAt: new Date().toISOString()
      };

      await createDocument("daily_logs", null, logData);
      
      // Reset form
      setFoodItems("");
      setNotes("");
      setSelectedStudentId("");
      alert("Meal log recorded successfully!");
    } catch (error) {
      console.error("Error logging meal:", error);
      alert("Failed to record meal log.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWeeklyReport = async (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const start = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const end = format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');

    try {
      const reportData: Omit<WeeklyDietaryReport, 'id'> = {
        schoolId,
        studentId,
        studentName: student.name,
        startDate: start,
        endDate: end,
        summary: `Weekly nutritional intake for ${student.name} was generally ${intakeLevel.toLowerCase()}.`,
        recommendations: "Continue monitoring hydration and variety in vegetable intake.",
        generatedBy: "System Administrator",
        createdAt: new Date().toISOString()
      };

      await createDocument("weekly_dietary_reports", null, reportData);
      alert(`Weekly report generated for ${student.name}!`);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Record Meal Form */}
        <Card className="rounded-[2rem] border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-emerald-600" />
              Record Nutritional Intake
            </CardTitle>
            <CardDescription>Log what children ate today to keep parents informed.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogMeal} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Select Student</label>
                <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                  <SelectTrigger className="rounded-xl border-slate-200">
                    <SelectValue placeholder="Choose a student..." />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>{student.name} ({student.class})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Meal Type</label>
                  <Select value={mealType} onValueChange={(v: any) => setMealType(v)}>
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Breakfast">Breakfast</SelectItem>
                      <SelectItem value="Morning Snack">Morning Snack</SelectItem>
                      <SelectItem value="Lunch">Lunch</SelectItem>
                      <SelectItem value="Afternoon Snack">Afternoon Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Intake Amount</label>
                  <Select value={intakeLevel} onValueChange={(v: any) => setIntakeLevel(v)}>
                    <SelectTrigger className="rounded-xl border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All / Finished</SelectItem>
                      <SelectItem value="Most">Most (75%)</SelectItem>
                      <SelectItem value="Some">Some (50%)</SelectItem>
                      <SelectItem value="None">None / Empty</SelectItem>
                      <SelectItem value="Refused">Refused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Food Items</label>
                <Input 
                  placeholder="e.g. Rice, Grilled Chicken, Steamed Carrots, Apple slice"
                  value={foodItems}
                  onChange={(e) => setFoodItems(e.target.value)}
                  className="rounded-xl border-slate-200"
                />
                <p className="text-[10px] text-slate-400">Separate items with commas</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Observation Notes</label>
                <Textarea 
                  placeholder="Any dietary observations or mood during meal..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="rounded-xl border-slate-200 min-h-[80px]"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl"
                disabled={isSubmitting || !selectedStudentId || !foodItems}
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Log Nutritional Intake
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Logs & Report Generation */}
        <div className="space-y-6">
          <Card className="rounded-[2rem] border-slate-200 bg-emerald-50/30 border-emerald-100">
            <CardHeader>
              <CardTitle className="text-emerald-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                Generate Weekly Report
              </CardTitle>
              <CardDescription className="text-emerald-700">Select a student to generate their dietary summary for parents.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex gap-2">
                  <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                    <SelectTrigger className="rounded-xl border-slate-200 bg-white">
                      <SelectValue placeholder="Select Student..." />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(student => (
                        <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    className="border-emerald-200 text-emerald-700 font-bold rounded-xl"
                    disabled={!selectedStudentId}
                    onClick={() => generateWeeklyReport(selectedStudentId)}
                  >
                    Generate
                  </Button>
               </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <History className="h-4 w-4" />
                Recent Meal Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingLogs ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                </div>
              ) : recentLogs.length > 0 ? (
                recentLogs.map(log => {
                  const student = students.find(s => s.id === log.studentId);
                  const details = log.details as MealLogDetails;
                  return (
                    <div key={log.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                          <ChefHat className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{student?.name || "Unknown Student"}</p>
                          <p className="text-[10px] text-slate-500">{details.mealType} • {details.intakeLevel} intake</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-bold border-emerald-100 text-emerald-700">
                        {details.foodItems?.[0]}{details.foodItems?.length > 1 ? ` +${details.foodItems.length - 1}` : ''}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No meal logs recorded yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

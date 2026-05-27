import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle, Clock, CalendarIcon, ChevronLeft, ChevronRight, WifiOff, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { subscribeToCollection, createDocument, updateDocument, fetchCollection } from "@/lib/firestoreUtils";
import { where, query, collection, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Student = {
  id: string;
  name: string;
  class: string;
};

type AttendanceRecord = {
  id: string;
  studentId: string;
  date: string;
  status: "Present" | "Absent" | "Late" | "Excused";
  schoolId: string;
};

export function AdminAttendancePage() {
  const { user, activeSchoolId } = useAuth();
  const effectiveSchoolId = user?.role === 'SuperAdmin' ? activeSchoolId : user?.schoolId;
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<{ studentId: string; status: AttendanceRecord["status"]; date: string }[]>([]);
  const [syncing, setSyncing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  useEffect(() => {
    const queue = localStorage.getItem('attendance_offline_queue');
    if (queue) {
      try {
        setOfflineQueue(JSON.parse(queue));
      } catch (e) {
        console.error("Failed to parse offline queue", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('attendance_offline_queue', JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  const toggleSelectStudent = (id: string) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const selectAllInClass = (className: string, deselect = false) => {
    const classStudentIds = students.filter(s => s.class === className).map(s => s.id);
    if (deselect) {
      setSelectedStudents(prev => prev.filter(id => !classStudentIds.includes(id)));
    } else {
      setSelectedStudents(prev => Array.from(new Set([...prev, ...classStudentIds])));
    }
  };

  const handleBulkStatusChange = async (status: AttendanceRecord["status"]) => {
    if (!effectiveSchoolId || selectedStudents.length === 0) return;
    
    setSaving("bulk-selection");
    try {
      const promises = selectedStudents.map(studentId => toggleAttendance(studentId, status));
      await Promise.all(promises);
      setSelectedStudents([]);
    } catch (error) {
      console.error("Bulk attendance error:", error);
    } finally {
      setSaving(null);
    }
  };

  useEffect(() => {
    const handleOnline = async () => {
      setIsOffline(false);
    };
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const processQueue = async () => {
      if (!isOffline && offlineQueue.length > 0 && effectiveSchoolId && !syncing) {
        setSyncing(true);
        try {
          const queueToProcess = [...offlineQueue];
          setOfflineQueue([]); // Clear immediately so we don't re-enter if more trigger
          for (const item of queueToProcess) {
            await processOfflineRecord(item);
          }
        } catch (error) {
          console.error("Failed to sync offline records", error);
        } finally {
          setSyncing(false);
        }
      }
    };
    processQueue();
  }, [isOffline, offlineQueue, effectiveSchoolId]);

  const processOfflineRecord = async (item: { studentId: string; status: AttendanceRecord["status"]; date: string }) => {
    if (!effectiveSchoolId) return;
    try {
      // Find existing record in firestore for that date to be safe
      const existingData = await fetchCollection('attendance', 
        where('schoolId', '==', effectiveSchoolId),
        where('date', '==', item.date),
        where('studentId', '==', item.studentId)
      ) as AttendanceRecord[];

      if (existingData.length > 0) {
        await updateDocument('attendance', existingData[0].id, { status: item.status });
      } else {
        await createDocument('attendance', null, {
          schoolId: effectiveSchoolId,
          studentId: item.studentId,
          date: item.date,
          status: item.status,
          recordedBy: user?.uid || 'offline-sync',
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error("Error processing offline record", err);
    }
  };

  useEffect(() => {
    if (!effectiveSchoolId) return;

    const loadData = async () => {
      setLoading(true);
      // Fetch students
      const studentsData = await fetchCollection('students', where('schoolId', '==', effectiveSchoolId)) as Student[];
      setStudents(studentsData);

      // Fetch attendance for selected date
      const attendanceData = await fetchCollection('attendance', 
        where('schoolId', '==', effectiveSchoolId),
        where('date', '==', selectedDate)
      ) as AttendanceRecord[];
      
      const recordMap: Record<string, AttendanceRecord> = {};
      attendanceData.forEach(rec => {
        recordMap[rec.studentId] = rec;
      });
      setAttendance(recordMap);
      setLoading(false);
    };

    loadData();
  }, [effectiveSchoolId, selectedDate]);

  const toggleAttendance = async (studentId: string, status: AttendanceRecord["status"]) => {
    if (!effectiveSchoolId) return;
    
    if (isOffline) {
      // Optimistically update UI
      const existingRecord = attendance[studentId];
      if (existingRecord) {
        setAttendance(prev => ({
          ...prev,
          [studentId]: { ...existingRecord, status }
        }));
      } else {
        const tempId = `temp-${Date.now()}`;
        setAttendance(prev => ({
          ...prev,
          [studentId]: { id: tempId, studentId, date: selectedDate, status, schoolId: effectiveSchoolId! }
        }));
      }
      
      // Update queue
      setOfflineQueue(prev => {
        const filtered = prev.filter(q => !(q.studentId === studentId && q.date === selectedDate));
        return [...filtered, { studentId, status, date: selectedDate }];
      });
      return;
    }

    setSaving(studentId);
    try {
      const existingRecord = attendance[studentId];
      if (existingRecord && !existingRecord.id.startsWith('temp-')) {
        if (existingRecord.status === status) {
          // Do nothing if same
        } else {
          await updateDocument('attendance', existingRecord.id, { status });
        }
        setAttendance(prev => ({
          ...prev,
          [studentId]: { ...existingRecord, status }
        }));
      } else {
        const newDocId = await createDocument('attendance', null, {
          schoolId: effectiveSchoolId,
          studentId,
          date: selectedDate,
          status,
          recordedBy: user?.uid || 'anonymous',
          createdAt: new Date().toISOString()
        });
        setAttendance(prev => ({
          ...prev,
          [studentId]: { id: newDocId as string, studentId, date: selectedDate, status, schoolId: effectiveSchoolId }
        }));
      }
    } catch (error) {
      console.error("Attendance save error:", error);
    } finally {
      setSaving(null);
    }
  };

  const markAllPresent = async (className: string) => {
    if (!effectiveSchoolId) return;
    const classStudents = students.filter(s => s.class === className);
    setSaving(`bulk-${className}`);
    
    try {
      if (isOffline) {
        setOfflineQueue(prev => {
          let updatedQueue = [...prev];
          classStudents.forEach(student => {
            const existingRecord = attendance[student.id];
            if (!existingRecord || existingRecord.status !== 'Present') {
              updatedQueue = updatedQueue.filter(q => !(q.studentId === student.id && q.date === selectedDate));
              updatedQueue.push({ studentId: student.id, status: 'Present', date: selectedDate });
            }
          });
          return updatedQueue;
        });

        // Optimistically update
        setAttendance(prev => {
          const newAttendance = { ...prev };
          classStudents.forEach(student => {
            const existingRecord = newAttendance[student.id];
            if (!existingRecord || existingRecord.status !== 'Present') {
              newAttendance[student.id] = existingRecord 
                ? { ...existingRecord, status: 'Present' }
                : { id: `temp-${Date.now()}-${student.id}`, studentId: student.id, date: selectedDate, status: 'Present', schoolId: effectiveSchoolId! };
            }
          });
          return newAttendance;
        });
      } else {
        const promises = classStudents.map(async (student) => {
          const existingRecord = attendance[student.id];
          if (!existingRecord || existingRecord.status !== 'Present') {
            return toggleAttendance(student.id, 'Present');
          }
        });
        await Promise.all(promises);
      }
    } finally {
      setSaving(null);
    }
  };

  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const classes = Array.from(new Set(students.map(s => s.class))) as string[];
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: students.length,
    present: (Object.values(attendance) as AttendanceRecord[]).filter(r => r.status === 'Present').length,
    absent: (Object.values(attendance) as AttendanceRecord[]).filter(r => r.status === 'Absent').length,
    late: (Object.values(attendance) as AttendanceRecord[]).filter(r => r.status === 'Late').length,
    excused: (Object.values(attendance) as AttendanceRecord[]).filter(r => r.status === 'Excused').length,
    pending: students.length - Object.keys(attendance).length
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Attendance Tracker</h1>
          <p className="text-sm text-slate-500 mt-1">Manage daily attendance and view reporting.</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeDate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 px-3 text-sm font-semibold text-slate-700 min-w-[140px] justify-center">
             <CalendarIcon className="h-4 w-4 text-slate-400" />
             {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => changeDate(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-white border-slate-200">
           <CardContent className="p-4">
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
           </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-100">
           <CardContent className="p-4">
              <p className="text-[10px] uppercase tracking-wider font-bold text-green-600">Present</p>
              <p className="text-2xl font-bold text-green-700">{stats.present}</p>
           </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
           <CardContent className="p-4">
              <p className="text-[10px] uppercase tracking-wider font-bold text-red-600">Absent</p>
              <p className="text-2xl font-bold text-red-700">{stats.absent}</p>
           </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100">
           <CardContent className="p-4">
              <p className="text-[10px] uppercase tracking-wider font-bold text-amber-600">Late</p>
              <p className="text-2xl font-bold text-amber-700">{stats.late}</p>
           </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
           <CardContent className="p-4">
              <p className="text-[10px] uppercase tracking-wider font-bold text-blue-600">Excused</p>
              <p className="text-2xl font-bold text-blue-700">{stats.excused}</p>
           </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200 border-dashed">
           <CardContent className="p-4">
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Pending</p>
              <p className="text-2xl font-bold text-slate-500">{stats.pending}</p>
           </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <input 
            type="text"
            placeholder="Search students or classes..."
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {selectedStudents.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSelectedStudents([])}
            className="rounded-xl h-10 px-4 text-xs font-bold text-slate-500 border-slate-200"
          >
            Clear Selection ({selectedStudents.length})
          </Button>
        )}
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4">
          <div className="bg-amber-100 p-2 rounded-full mt-0.5">
            <WifiOff className="h-4 w-4 text-amber-700" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="text-sm font-bold text-amber-900">Offline Attendance Mode Active</h4>
            <p className="text-xs text-amber-700 mt-1">
              You are currently offline. Records will automatically sync when your connection returns.
            </p>
            {offlineQueue.length > 0 && (
              <p className="text-xs font-semibold text-amber-800 mt-2">
                • {offlineQueue.length} record{offlineQueue.length === 1 ? '' : 's'} pending sync
              </p>
            )}
          </div>
        </div>
      )}

      {!isOffline && syncing && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-4">
          <div className="bg-blue-100 p-2 rounded-full mt-0.5">
            <RefreshCw className="h-4 w-4 text-blue-700 animate-spin" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="text-sm font-bold text-blue-900">Background Syncing</h4>
            <p className="text-xs text-blue-700 mt-1">
              Synchronizing attendance records to Firebase...
            </p>
          </div>
        </div>
      )}

      <div className="space-y-12">
        {classes.length > 0 ? (
          classes.map(className => {
            const classStudents = filteredStudents.filter(s => s.class === className);
            if (classStudents.length === 0) return null;

            return (
              <Card key={className} className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0 pb-3 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <div className="h-8 w-1.5 bg-blue-600 rounded-full"></div>
                      {className}
                      <span className="ml-2 text-xs font-normal text-slate-400">({classStudents.length} Students)</span>
                    </CardTitle>
                    <div className="flex items-center gap-2 border-l border-slate-200 pl-4 ml-2">
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="h-7 px-2 text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-wider"
                         onClick={() => selectAllInClass(className)}
                       >
                         Select All
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="sm" 
                         className="h-7 px-2 text-[10px] font-bold text-slate-400 hover:text-red-600 uppercase tracking-wider"
                         onClick={() => selectAllInClass(className, true)}
                       >
                         Deselect All
                       </Button>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl h-8 text-xs gap-2"
                    onClick={() => markAllPresent(className)}
                    disabled={saving === `bulk-${className}`}
                  >
                    {saving === `bulk-${className}` ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                    Mark All Present
                  </Button>
                </CardHeader>
                <CardContent className="px-0">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {classStudents.map(student => {
                        const record = attendance[student.id];
                        const isSelected = selectedStudents.includes(student.id);
                        return (
                          <Card 
                            key={student.id} 
                            className={`overflow-hidden transition-all border-none cursor-pointer relative group ${
                              isSelected ? 'ring-2 ring-blue-600 bg-blue-50/30' :
                              record?.status === 'Present' ? 'bg-green-50 ring-1 ring-green-200' :
                              record?.status === 'Absent' ? 'bg-red-50 ring-1 ring-red-200' :
                              record?.status === 'Late' ? 'bg-amber-50 ring-1 ring-amber-200' :
                              record?.status === 'Excused' ? 'bg-blue-50 ring-1 ring-blue-200' :
                              'bg-white ring-1 ring-slate-100 shadow-sm hover:ring-blue-200'
                            }`}
                            onClick={() => toggleSelectStudent(student.id)}
                          >
                            <div className={`absolute top-2 right-2 h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                               isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200 opacity-0 group-hover:opacity-100'
                            }`}>
                               {isSelected && <CheckCircle2 className="h-3 w-3 text-white" />}
                            </div>
                            <CardContent className="p-4" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleSelectStudent(student.id)}>
                                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                                    record?.status === 'Present' ? 'bg-green-100 text-green-600' :
                                    record?.status === 'Absent' ? 'bg-red-100 text-red-600' :
                                    record?.status === 'Late' ? 'bg-amber-100 text-amber-600' :
                                    record?.status === 'Excused' ? 'bg-blue-100 text-blue-600' :
                                    'bg-slate-100 text-slate-500'
                                  }`}>
                                    {student.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900">{student.name}</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">ID: {student.id.slice(0, 8)}</p>
                                  </div>
                                </div>
                                {saving === student.id && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
                              </div>
                              
                              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl w-full border border-slate-100">
                                <button 
                                  onClick={() => toggleAttendance(student.id, 'Present')}
                                  disabled={!!saving && saving !== student.id}
                                  className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg transition-all ${
                                    record?.status === 'Present' 
                                      ? 'bg-green-600 text-white shadow-md' 
                                      : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                  }`}
                                  title="Present"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                  <span className="text-[9px] font-black uppercase tracking-tighter mt-1">Present</span>
                                </button>
                                <button 
                                  onClick={() => toggleAttendance(student.id, 'Absent')}
                                  disabled={!!saving && saving !== student.id}
                                  className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg transition-all ${
                                    record?.status === 'Absent' 
                                      ? 'bg-red-600 text-white shadow-md' 
                                      : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                  }`}
                                  title="Absent"
                                >
                                  <XCircle className="h-4 w-4" />
                                  <span className="text-[9px] font-black uppercase tracking-tighter mt-1">Absent</span>
                                </button>
                                <button 
                                  onClick={() => toggleAttendance(student.id, 'Late')}
                                  disabled={!!saving && saving !== student.id}
                                  className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg transition-all ${
                                    record?.status === 'Late' 
                                      ? 'bg-amber-500 text-white shadow-md' 
                                      : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                  }`}
                                  title="Late"
                                >
                                  <Clock className="h-4 w-4" />
                                  <span className="text-[9px] font-black uppercase tracking-tighter mt-1">Late</span>
                                </button>
                                <button 
                                  onClick={() => toggleAttendance(student.id, 'Excused')}
                                  disabled={!!saving && saving !== student.id}
                                  className={`flex-1 flex flex-col items-center justify-center py-2 rounded-lg transition-all ${
                                    record?.status === 'Excused' 
                                      ? 'bg-blue-600 text-white shadow-md' 
                                      : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                  }`}
                                  title="Excused"
                                >
                                  <CalendarIcon className="h-4 w-4" />
                                  <span className="text-[9px] font-black uppercase tracking-tighter mt-1">Excused</span>
                                </button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                   </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
               <CalendarIcon className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No students matching criteria</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">Try adjusting your search or add students to your school classes.</p>
          </div>
        )}
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedStudents.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-8 duration-300">
           <div className="bg-slate-900 text-white rounded-[2rem] shadow-2xl p-2 pl-6 flex items-center gap-6 border border-slate-800">
              <div className="flex flex-col">
                 <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Selected</span>
                 <span className="text-xl font-black">{selectedStudents.length}</span>
              </div>
              
              <div className="h-10 w-[1px] bg-slate-700"></div>
              
              <div className="flex items-center gap-2">
                 <Button 
                   size="sm" 
                   className="h-12 px-6 rounded-2xl bg-green-600 hover:bg-green-700 font-bold gap-2"
                   disabled={saving === 'bulk-selection'}
                   onClick={() => handleBulkStatusChange('Present')}
                 >
                   {saving === 'bulk-selection' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                   Present
                 </Button>
                 <Button 
                   size="sm" 
                   className="h-12 px-6 rounded-2xl bg-red-600 hover:bg-red-700 font-bold gap-2"
                   disabled={saving === 'bulk-selection'}
                   onClick={() => handleBulkStatusChange('Absent')}
                 >
                   {saving === 'bulk-selection' ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                   Absent
                 </Button>
                 <Button 
                   size="sm" 
                   className="h-12 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 font-bold gap-2"
                   disabled={saving === 'bulk-selection'}
                   onClick={() => handleBulkStatusChange('Late')}
                 >
                   {saving === 'bulk-selection' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
                   Late
                 </Button>
                 <Button 
                   size="sm" 
                   className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold gap-2"
                   disabled={saving === 'bulk-selection'}
                   onClick={() => handleBulkStatusChange('Excused')}
                 >
                   {saving === 'bulk-selection' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarIcon className="h-4 w-4" />}
                   Excused
                 </Button>
              </div>
              
              <div className="h-10 w-[1px] bg-slate-700"></div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-12 w-12 rounded-2xl hover:bg-slate-800 text-slate-400"
                onClick={() => setSelectedStudents([])}
              >
                 <XCircle className="h-6 w-6" />
              </Button>
           </div>
        </div>
      )}
    </div>
  );
}

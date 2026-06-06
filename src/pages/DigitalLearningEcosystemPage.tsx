import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/AuthContext";
import { subscribeToCollection, createDocument, updateDocument, deleteDocument } from "@/lib/firestoreUtils";
import { 
  Gamepad2, Video, BookOpenText, Printer, 
  Users, Presentation, Sparkles, ChevronRight,
  X, Play, Pause, ChevronLeft, Volume2, 
  Check, RefreshCw, Send, Sparkle, Palette, FileText,
  ThumbsUp, Clock, Plus, Tv, MessageSquare, Share2,
  User, ArrowLeft, Bell
} from "lucide-react";
import { SEO } from "@/components/SEO";
import kidsDigitalImg from '@/assets/images/kids_digital_learning_1779268599993.png';
import { generateAIContent } from "@/services/geminiService";
import { toast } from "sonner";

// Predefined learning modules
const FEATURES = [
  { 
    id: "games", 
    title: "Interactive Games", 
    icon: <Gamepad2 className="h-6 w-6" />, 
    color: "bg-blue-50 text-blue-600 border-blue-100", 
    description: "Engaging, curriculum-aligned educational games that adapt to your child's pace, focusing on early math, Siswati vocabulary, and literacy skills.",
    count: "45+ Games"
  },
  { 
    id: "videos", 
    title: "Educational Videos", 
    icon: <Video className="h-6 w-6" />, 
    color: "bg-rose-50 text-rose-600 border-rose-100", 
    description: "A library of 500+ curated video lessons narrated by master teachers, covering topics from storytelling to simple calculations and national heritage.",
    count: "500+ Videos"
  },
  { 
    id: "story", 
    title: "Storytelling", 
    icon: <BookOpenText className="h-6 w-6" />, 
    color: "bg-purple-50 text-purple-600 border-purple-100", 
    description: "Immersive, interactive storytelling modules that promote reading comprehension, Siswati folk-tales, and high empathy in early childhood.",
    count: "120+ Stories"
  },
  { 
    id: "worksheets", 
    title: "Printable Worksheets", 
    icon: <Printer className="h-6 w-6" />, 
    color: "bg-amber-50 text-amber-600 border-amber-100", 
    description: "Downloadable PDF activity sheets for offline learning, structured to complement our digital lessons, plus our built-in tracing pad.",
    count: "300+ PDFs"
  },
  { 
    id: "parents", 
    title: "Parent Activities", 
    icon: <Users className="h-6 w-6" />, 
    color: "bg-emerald-50 text-emerald-600 border-emerald-100", 
    description: "Weekly guided home activities and interactive checklists for parents to reinforce classroom learning through fun, daily routines.",
    count: "52+ Plans"
  },
  { 
    id: "live", 
    title: "Live Virtual Classes", 
    icon: <Presentation className="h-6 w-6" />, 
    color: "bg-indigo-50 text-indigo-600 border-indigo-100", 
    description: "Weekly live classrooms simulation where preschool students connect with qualified educators and peers virtual-first in Eswatini.",
    count: "15+ Sessions/wk"
  },
  { 
    id: "music", 
    title: "Music & Arts", 
    icon: <Palette className="h-6 w-6" />, 
    color: "bg-pink-50 text-pink-600 border-pink-100", 
    description: "Creative arts modules focusing on traditional music, painting, and visual rhythm. Play our virtual synthesized piano directly on screen!",
    count: "30+ Lessons"
  },
];

// Mock database of stories
const STORIES = [
  {
    title: "The Brave Lion of Hlane National Park",
    pages: [
      { text: "Once upon a time in Eswatini, near the beautiful Hlane National Park, lived a small but extremely brave lion cub named Simphiwe.", img: "🦁🦁🦁" },
      { text: "While Simphiwe was small, he always looked out for his friends. One afternoon, a little monkey got his balloon stuck on a tall branch of an Acacia tree.", img: "🌳🎈🐒" },
      { text: "Simphiwe didn't hesitate! He climbed the tree step-by-step, gently retrieved the balloon using his paws, and made a new friend forever!", img: "🎉🎈🦁🐒" },
    ]
  },
  {
    title: "Sizwe the Clever Giraffe",
    pages: [
      { text: "Sizwe was a very tall giraffe who lived near Mlilwane. He loved reading books and solving number puzzles every morning under the shade of trees.", img: "🦒🦒🦒" },
      { text: "One day, the local animals had a problem: they wanted to count all the delicious marula fruits, but couldn't reach them high up.", img: "🌳🍒🦓🦒" },
      { text: "Sizwe smiled, used his long neck to pick them one by one, and taught everyone how to add and subtract together!", img: "✨🦒🍎🎉" },
    ]
  }
];

export function DigitalLearningEcosystemPage() {
  const [exploreId, setExploreId] = useState<string | null>(null);
  
  // AI Personalization Wizard states
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("4");
  const [childInterest, setChildInterest] = useState("Animals & nature");
  const [childFocus, setChildFocus] = useState("Vocabulary & letters");
  const [customPrompt, setCustomPrompt] = useState("");
  
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // States for sub-modules interactivity
  // 1. Game State (counting)
  const [gameScore, setGameScore] = useState(0);
  const [gameAnswer, setGameAnswer] = useState<number | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState(4);
  const [gameFeedback, setGameFeedback] = useState("");

  const resetGame = () => {
    const num = Math.floor(Math.random() * 5) + 3; // random between 3 and 7
    setCorrectAnswer(num);
    setGameAnswer(null);
    setGameFeedback("");
  };

  const handleGameGuess = (guess: number) => {
    setGameAnswer(guess);
    if (guess === correctAnswer) {
      setGameScore(g => g + 10);
      setGameFeedback("Yebo! Correct! 🎉 Standard-aligned ECD points added!");
      toast.success("Excellent job! Correct counting.");
    } else {
      setGameFeedback("Not quite! Let's count them together one by one.");
    }
  };

  // 2. Video Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(30);

  // 3. Storybook State
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyPage, setStoryPage] = useState(0);

  // 4. Trace Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#2563eb");

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = brushColor;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    
    // Get correct coordinates
    let clientX: number;
    let clientY: number;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let clientX: number;
    let clientY: number;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Redraw transparent model letter A
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 150px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("A", canvas.width / 2, canvas.height / 2);
  };

  // Initialize tracing template
  useEffect(() => {
    if (exploreId === "worksheets" && canvasRef.current) {
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.fillStyle = "#cbd5e1";
        ctx.font = "bold 140px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("A", canvas.width / 2, canvas.height / 2);
      }, 100);
    }
  }, [exploreId]);

  // 5. Parent activities checklists
  const [activitiesState, setActivitiesState] = useState([
    { id: 1, text: "Read a bedtime story together in Siswati & English", done: false },
    { id: 2, text: "Ask your child to count 5 spoons during lunch", done: false },
    { id: 3, text: "Play a quick clap-and-rhythm matching game", done: false },
    { id: 4, text: "Ask them of their favorite activity at school today", done: false }
  ]);

  const toggleActivity = (id: number) => {
    setActivitiesState(prev => prev.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    ));
  };

  // 6. Integrated Live Virtual Classes Simulation Engine & Persistent Corkboard
  const { user } = useAuth();
  const [dbNotes, setDbNotes] = useState<any[]>([]);

  // Database-backed real-time live classes
  const [realLiveClasses, setRealLiveClasses] = useState<any[]>([]);
  const [allRealClasses, setAllRealClasses] = useState<any[]>([]);
  const [currentRealClassId, setCurrentRealClassId] = useState<string | null>(null);
  const [realLiveChats, setRealLiveChats] = useState<any[]>([]);

  // Stream Scheduling configurations
  const [scheduleDate, setScheduleDate] = useState("2026-06-07");
  const [scheduleTime, setScheduleTime] = useState("14:00");
  const [bookingMode, setBookingMode] = useState<"instant" | "scheduled">("instant");

  // Broadcaster states
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [broadcastSetupOpen, setBroadcastSetupOpen] = useState<boolean>(false);
  
  // Setup fields
  const [newBroadcastTitle, setNewBroadcastTitle] = useState("");
  const [newBroadcastTeacher, setNewBroadcastTeacher] = useState("");
  const [newBroadcastTheme, setNewBroadcastTheme] = useState("bg-slate-900 border-indigo-500/20");
  const [newBroadcastVocab, setNewBroadcastVocab] = useState("Sawubona (Hello), Siyingilizi (Circle), Ubuntu (Cooperation)");
  const [newBroadcastPollQuestion, setNewBroadcastPollQuestion] = useState("Can your child count with beans easily?");
  const [newBroadcastPollOptionsStr, setNewBroadcastPollOptionsStr] = useState("Yes, easily;Almost there;Finding it tricky");

  // Whiteboard trace coordinates tracking
  const educatorBoardCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewerBoardCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [educatorIsDrawing, setEducatorIsDrawing] = useState(false);
  const [educatorBrushColor, setEducatorBrushColor] = useState("#fbbf24"); // Yellow chalk default

  // Educational Videos
  const [educationalVideos, setEducationalVideos] = useState<any[]>([]);
  const [expandedVideo, setExpandedVideo] = useState<any | null>(null);
  const [showAddVideoDialog, setShowAddVideoDialog] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoDesc, setNewVideoDesc] = useState("");
  const [newVideoTopic, setNewVideoTopic] = useState("");
  const [newVideoWeek, setNewVideoWeek] = useState("");
  const [newVideoDate, setNewVideoDate] = useState("");

  const [activeEditingVideoId, setActiveEditingVideoId] = useState<string | null>(null);
  const [editVideoWeek, setEditVideoWeek] = useState("");
  const [editVideoDate, setEditVideoDate] = useState("");

  const [systemNotifications, setSystemNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    try {
      // Subscribe to real cloud-hosted collaboration notes
      const unsubscribe = subscribeToCollection("dashboard_notes", (data) => {
        const sorted = [...data].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        setDbNotes(sorted);
      });

      // Subscribe to educational videos
      const unsubVideos = subscribeToCollection("educational_videos", (data) => {
        const sorted = [...data].sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        setEducationalVideos(sorted);
      });

      // Subscribe to real-time live classes
      const unsubClasses = subscribeToCollection("live_classes", (data) => {
        setAllRealClasses(data);
        const activeOnes = data.filter((c: any) => c.active === true || (c.active !== false && c.status !== "scheduled"));
        setRealLiveClasses(activeOnes);
      });

      // Subscribe to real-time live chats
      const unsubChats = subscribeToCollection("live_chats", (data) => {
        const sorted = [...data].sort((a, b) => {
          const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tA - tB;
        });
        setRealLiveChats(sorted);
      });

      // Subscribe to notifications
      const unsubNotifications = subscribeToCollection("notifications", (data) => {
        const sorted = [...data].sort((a, b) => {
          const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tB - tA; // Newest first
        });
        setSystemNotifications(sorted);
      });

      return () => {
        unsubscribe();
        unsubVideos();
        unsubClasses();
        unsubChats();
        unsubNotifications();
      };
    } catch (e) {
      console.warn("Could not load database-backed live notes. Simulator falling back to local memory storage.", e);
    }
  }, []);

  // Monitor if active real class gets closed or deleted by host
  const selectedRealClass = realLiveClasses.find(c => c.id === currentRealClassId) || null;

  useEffect(() => {
    if (currentRealClassId && !realLiveClasses.some(c => c.id === currentRealClassId)) {
      setCurrentRealClassId(null);
      setIsBroadcasting(false);
      toast.info("The live educator class session has ended or is now offline.");
    }
  }, [realLiveClasses, currentRealClassId]);

  // Sync real-time drawing strokes to viewers
  useEffect(() => {
    if (currentRealClassId && selectedRealClass && !isBroadcasting && viewerBoardCanvasRef.current) {
      const canvas = viewerBoardCanvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const paths = selectedRealClass.boardDrawingData || [];
        paths.forEach((path: any) => {
          if (!path.points || path.points.length === 0) return;
          ctx.beginPath();
          ctx.moveTo(path.points[0].x, path.points[0].y);
          ctx.strokeStyle = path.color || "#fbbf24";
          ctx.lineWidth = 3.5;
          ctx.lineCap = "round";
          for (let i = 1; i < path.points.length; i++) {
            ctx.lineTo(path.points[i].x, path.points[i].y);
          }
          ctx.stroke();
        });
      }
    }
  }, [currentRealClassId, selectedRealClass, isBroadcasting]);

  // Host drawing state & logic
  const [localStrokePoints, setLocalStrokePoints] = useState<{ x: number; y: number }[]>([]);

  const startDrawingOnEducatorBoard = (e: any) => {
    const canvas = educatorBoardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    
    let x = 0;
    let y = 0;
    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else if (e.nativeEvent && e.nativeEvent.touches && e.nativeEvent.touches.length > 0) {
      x = e.nativeEvent.touches[0].clientX - rect.left;
      y = e.nativeEvent.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = educatorBrushColor;
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    setEducatorIsDrawing(true);
    setLocalStrokePoints([{ x, y }]);
  };

  const drawOnEducatorBoard = (e: any) => {
    if (!educatorIsDrawing) return;
    const canvas = educatorBoardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();

    let x = 0;
    let y = 0;
    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else if (e.nativeEvent && e.nativeEvent.touches && e.nativeEvent.touches.length > 0) {
      x = e.nativeEvent.touches[0].clientX - rect.left;
      y = e.nativeEvent.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    setLocalStrokePoints(prev => [...prev, { x, y }]);
  };

  const stopDrawingOnEducatorBoard = async () => {
    if (!educatorIsDrawing) return;
    setEducatorIsDrawing(false);
    
    if (localStrokePoints.length > 1 && currentRealClassId && selectedRealClass) {
      try {
        const currentPaths = selectedRealClass.boardDrawingData || [];
        const newPath = {
          color: educatorBrushColor,
          points: localStrokePoints
        };
        const updatedPaths = [...currentPaths, newPath];
        await updateDocument("live_classes", currentRealClassId, {
          boardDrawingData: updatedPaths
        });
      } catch (err) {
        console.warn("Could not sync drawing stroke vectors to Firestore", err);
      }
    }
    setLocalStrokePoints([]);
  };

  const clearEducatorBoard = async () => {
    const canvas = educatorBoardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentRealClassId) {
      try {
        await updateDocument("live_classes", currentRealClassId, {
          boardDrawingData: []
        });
        toast.info("Chalkboard cleared successfully!");
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const castVoteRealTime = async (optionIndex: number) => {
    if (!currentRealClassId || !selectedRealClass) return;
    try {
      const currentVotes = [...(selectedRealClass.pollVotes || selectedRealClass.pollOptions.map(() => 0))];
      currentVotes[optionIndex] = (currentVotes[optionIndex] || 0) + 1;
      await updateDocument("live_classes", currentRealClassId, {
        pollVotes: currentVotes
      });
      setLiveClassPollAnswer(optionIndex);
      toast.success("Family coach response vote submitted in real-time!");
    } catch (err) {
      toast.error("Could not record vote.");
    }
  };

  const [liveClassPollAnswer, setLiveClassPollAnswer] = useState<number | null>(null);
  const [liveClassNewNote, setLiveClassNewNote] = useState<string>("");
  const [liveClassActiveTab, setLiveClassActiveTab] = useState<"chat" | "notes" | "vocab">("chat");

  // Load parent & teacher collaboration notes exclusively from Firestore 
  const allNotes = dbNotes.map((n: any) => ({
    id: n.id,
    author: n.author || "Parent Coach",
    note: n.note,
    votes: n.votes || 0,
    timestamp: n.timestamp || "Just now",
    isDb: true
  }));

  // Auto-select first active dynamic database stream on load if available
  useEffect(() => {
    if (exploreId === "live" && realLiveClasses.length > 0 && !currentRealClassId) {
      setCurrentRealClassId(realLiveClasses[0].id);
    }
  }, [exploreId, realLiveClasses, currentRealClassId]);

  // Handle send comment - posts to current class or fallback "general_lobby" for real-time interaction
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoTitle.trim() || !newVideoUrl.trim()) return;

    // Very basic transform for YouTube watch URLs to embed URLs to allow iframes
    let finalUrl = newVideoUrl.trim();
    if (finalUrl.includes("youtube.com/watch?v=")) {
      finalUrl = finalUrl.replace("watch?v=", "embed/");
      // Remove any extra parameters like &t= or &list=
      if (finalUrl.includes("&")) {
        finalUrl = finalUrl.split("&")[0];
      }
    } else if (finalUrl.includes("youtu.be/")) {
      finalUrl = finalUrl.replace("youtu.be/", "youtube.com/embed/");
      if (finalUrl.includes("?")) {
        finalUrl = finalUrl.split("?")[0];
      }
    }

    try {
      await createDocument("educational_videos", null, {
        title: newVideoTitle,
        videoUrl: finalUrl,
        description: newVideoDesc,
        topic: newVideoTopic,
        scheduledWeek: newVideoWeek,
        scheduledDate: newVideoDate,
        teacher: user?.name || user?.email?.split('@')[0] || "Educator",
        createdAt: new Date().toISOString(),
        views: 0
      });

      if (newVideoWeek || newVideoDate) {
        await createDocument("notifications", null, {
          message: `New Video Scheduled: "${newVideoTitle}" was added by ${user?.name || user?.email?.split('@')[0] || "an Educator"} for ${newVideoWeek ? newVideoWeek : ""}${newVideoWeek && newVideoDate ? " on " : ""}${newVideoDate ? new Date(newVideoDate).toLocaleDateString([], { month: "short", day: "numeric" }) : ""}.`,
          type: "schedule_update",
          createdAt: new Date().toISOString(),
          read: false
        }).catch(err => console.warn("Failed to send schedule notification", err));
      }

      setShowAddVideoDialog(false);
      setNewVideoTitle("");
      setNewVideoUrl("");
      setNewVideoDesc("");
      setNewVideoTopic("");
      setNewVideoWeek("");
      setNewVideoDate("");
      toast.success("Educational video added to the curriculum library!");
    } catch (err: any) {
      toast.error("Failed to add video: " + err.message);
    }
  };

  const handleSaveVideoSchedule = async (video: any) => {
    if (!video.id) return;
    try {
      await updateDocument("educational_videos", video.id, {
        scheduledWeek: editVideoWeek,
        scheduledDate: editVideoDate,
      });
      
      if (editVideoWeek || editVideoDate) {
        await createDocument("notifications", null, {
          message: `Schedule Update: The viewing schedule for "${video.title}" was updated by ${user?.name || user?.email?.split('@')[0] || "an Educator"} to ${editVideoWeek ? editVideoWeek : ""}${editVideoWeek && editVideoDate ? " on " : ""}${editVideoDate ? new Date(editVideoDate).toLocaleDateString([], { month: "short", day: "numeric" }) : ""}.`,
          type: "schedule_update",
          createdAt: new Date().toISOString(),
          read: false
        }).catch(err => console.warn("Failed to send schedule notification", err));
      }

      toast.success("Suggested viewing schedule updated!");
      setActiveEditingVideoId(null);
      // Update expanded view if it's currently open
      if (expandedVideo?.id === video.id) {
        setExpandedVideo({ ...expandedVideo, scheduledWeek: editVideoWeek, scheduledDate: editVideoDate });
      }
    } catch (err: any) {
      toast.error("Failed to update schedule: " + err.message);
    }
  };

  const handleSendLiveClassChat = async (chatText: string) => {
    if (!chatText.trim()) return;
    
    const authorName = user?.name || (user?.email ? user.email.split('@')[0] : "Home Coach");
    const timestampText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const targetClassId = currentRealClassId || "general_lobby";

    try {
      await createDocument("live_chats", null, {
        classId: targetClassId,
        user: authorName,
        message: chatText.trim(),
        timestamp: timestampText,
        createdAt: new Date().toISOString()
      });
      toast.success("Message sent to live lobby!");
    } catch (err: any) {
      console.warn("Could not save live chat to database", err);
      toast.error("Could not send chat. " + err.message);
    }
  };

  // 7. Interactive Piano/Synth
  const playSynthTone = (frequency: number) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime); 
      
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.6);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.6);
    } catch {
      toast.error("Audio synth blocked or unsupported in this sandbox frame");
    }
  };

  // AI Personalized Path Generator
  const handleGeneratePersonalization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) {
      toast.error("Please enter your child's name first.");
      return;
    }

    setAiLoading(true);
    setAiResponse(null);

    const promptMessage = `
      Child Name: ${childName}
      Child Age: ${childAge} years old
      Interests: ${childInterest}
      Learning Area focus: ${childFocus}
      Additional specific details/context: ${customPrompt || "Default basic path"}
      
      Write a customized 1-day learning path for this pupil named ${childName}.
      Include:
      1. SIBUSISO GREETING: A customized encouragement line starting with a warm Siswati greeting.
      2. MORNING ADVENTURE: 1 hands-on activity based on their age and interest.
      3. LITERACY BOOST: 1 simple reading or speaking play task tailored to their focus level.
      4. MATH PLAY: A fun counting exercise matching the theme.
      5. CREATIVE OUTDOOR TASK: 1 motor-skills, physical, or sensory exercise outside.
      Keep the structure beautiful with tidy headings, bullet points, and positive early childhood education advice.
    `;

    try {
      const result = await generateAIContent(promptMessage, 'learning_personalization');
      if (result.error) {
        throw new Error(result.error);
      }
      setAiResponse(result.text);
      toast.success(`Personalization path ready for ${childName}!`);
    } catch (err: any) {
      toast.error(err.message || "Unable to reach Gemini assistant. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16 px-4 sm:px-6 lg:px-8">
      <SEO title="Digital Learning Ecosystem | Preschools Eswatini" />
      
      {/* Top Header with Notifications */}
      <div className="flex justify-end pt-4 relative">
        <Button 
          variant="ghost" 
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative h-10 w-10 min-w-10 rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50 transition-colors z-20"
          aria-label="View notifications"
        >
          <Bell className="h-5 w-5 text-slate-700" />
          {systemNotifications.filter(n => !n.read).length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center animate-bounce shadow-sm">
              {systemNotifications.filter(n => !n.read).length}
            </span>
          )}
        </Button>

        {showNotifications && (
          <div className="absolute top-16 right-0 w-80 max-w-[calc(100vw-32px)] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-30 animate-in fade-in slide-in-from-top-2">
            <div className="bg-slate-50 border-b border-slate-100 p-3 flex justify-between items-center">
              <h4 className="font-extrabold text-sm text-slate-800">Alerts & Updates</h4>
              {systemNotifications.filter(n => !n.read).length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={async () => {
                    const unread = systemNotifications.filter(n => !n.read);
                    for (const n of unread) {
                      await updateDocument("notifications", n.id, { read: true }).catch(()=>null);
                    }
                  }}
                  className="h-6 text-[10px] font-bold text-slate-500 hover:text-slate-800 px-2"
                >
                  Mark all read
                </Button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {systemNotifications.length === 0 ? (
                <div className="p-6 text-center text-slate-400">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-semibold">No recent alerts</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {systemNotifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-3 text-left transition-colors ${notification.read ? 'bg-white opacity-70' : 'bg-blue-50/50 hover:bg-blue-50'}`}
                      onClick={async () => {
                        if (!notification.read) {
                          await updateDocument("notifications", notification.id, { read: true }).catch(()=>null);
                        }
                      }}
                    >
                      <p className="text-xs font-semibold text-slate-700 leading-snug">{notification.message}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">
                        {notification.createdAt ? new Date(notification.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : "Recently"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center pt-4">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors px-4 py-1.5 text-sm font-bold text-blue-800">
            <Sparkles className="h-4 w-4 mr-2 text-blue-600" /> Playful Learning Experience
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 leading-none">
            Digital Early-Learning <span className="text-blue-600 block sm:inline">Ecosystem</span>
          </h1>
          <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
            A comprehensive, interactive curriculum framework that makes early childhood development delightful for children, actionable for parents, and insights-packed for expert schools.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button 
              onClick={() => setIsPersonalizing(true)}
              className="h-14 px-8 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-600/25 flex items-center gap-2 transform active:scale-95 transition-all"
            >
              <Sparkles className="h-5 w-5 fill-white text-white" /> Experience AI Personalization
            </Button>
            <a href="#modules">
              <Button 
                variant="outline" 
                className="h-14 px-6 text-base font-bold text-slate-700 bg-white border-2 border-slate-200 hover:border-slate-300 rounded-2xl"
              >
                Browse Modules
              </Button>
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-blue-200/60 rounded-[3rem] transform rotate-3 scale-105 opacity-50 z-0"></div>
          <img 
            src={kidsDigitalImg} 
            alt="Child using digital learning app" 
            className="img-interactive-decor relative z-10 w-full rounded-[2.5rem] shadow-xl object-cover aspect-square border-4 border-white"
          />
        </div>
      </div>

      {/* Modules Grid */}
      <div id="modules" className="pt-12 border-t border-slate-100">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Discover Our Modules</h2>
          <p className="text-slate-500 font-semibold max-w-2xl mx-auto text-sm">
            Click on <strong className="text-blue-600">Explore</strong> below to interact with playable mocks of our interactive mini-apps, creative pads, storytelling flipbooks, and parent tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <Card 
              key={feature.id} 
              className="rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-3">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${feature.color} border shrink-0`}>
                  {feature.icon}
                </div>
                <div className="flex flex-col min-w-0">
                  <CardTitle className="text-lg font-bold text-slate-900 truncate">{feature.title}</CardTitle>
                  <Badge variant="secondary" className="w-fit mt-1 text-[10px] font-bold bg-slate-100 text-slate-600 border-none shrink-0">{feature.count}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-2 flex-grow flex flex-col justify-between">
                <p className="text-sm text-slate-600 font-semibold leading-relaxed">
                  {feature.description}
                </p>
                <Button 
                  onClick={() => setExploreId(feature.id)}
                  variant="ghost" 
                  className="mt-6 px-4 py-2 w-full justify-between items-center bg-blue-50/40 hover:bg-blue-100/50 text-blue-600 font-bold rounded-xl border border-blue-100 group transition-colors"
                >
                  <span className="flex items-center gap-1.5 text-xs">Explore {feature.title} Live</span>
                  <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Static CTA placeholder for parents banner */}
      <div className="bg-slate-900 text-white rounded-[2rem] p-8 md:p-12 relative overflow-hidden shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <Badge className="bg-blue-600 text-white font-bold border-none hover:bg-blue-600/90 py-1 px-3">ECD STANDARDS</Badge>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">Curriculum Aligned to National & International Standards</h3>
          <p className="text-slate-300 font-semibold text-sm leading-relaxed">
            Our learning pathways are developed by ECD experts in collaboration with preschool educators inside Eswatini, ensuring seamless integration between virtual play tasks and real-world milestones.
          </p>
        </div>
      </div>

      {/* AI Personalization Dialog / Modal */}
      {isPersonalizing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-150 transform transition-all duration-300">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 md:px-8 py-5 border-b border-slate-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600 fill-blue-500" />
                <h3 className="font-black text-xl text-slate-900 tracking-tight">AI Early-learning Planner</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsPersonalizing(false)}
                className="h-9 w-9 text-slate-400 hover:text-slate-600 rounded-full"
                aria-label="Close planning wizard"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 space-y-6">
              {!aiResponse && !aiLoading && (
                <form onSubmit={handleGeneratePersonalization} className="space-y-5">
                  <div className="text-center max-w-md mx-auto space-y-1 pb-2">
                    <p className="text-xs text-blue-600 font-extrabold tracking-uppercase">GEMINI CO-PILOT</p>
                    <h4 className="text-lg font-black text-slate-800">Generate a custom learning path path instantly</h4>
                    <p className="text-xs text-slate-400 font-semibold">Our AI compiles age-appropriate activities, numeracy boosts, and creative tasks tailored to your child.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Child Name */}
                    <div className="space-y-2">
                      <label id="child-name-label" className="text-xs font-bold text-slate-700 block">Child's Name</label>
                      <Input 
                        placeholder="e.g., Thabo" 
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        required
                        className="rounded-xl h-11 border-slate-200"
                        aria-labelledby="child-name-label"
                      />
                    </div>

                    {/* Child Age */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 block">Age Group</label>
                      <select 
                        value={childAge} 
                        onChange={(e) => setChildAge(e.target.value)}
                        className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-semibold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="2">2 Years (Toddler Play)</option>
                        <option value="3">3 Years (Early Explorer)</option>
                        <option value="4">4 Years (Junior Pre-K)</option>
                        <option value="5">5 Years (Curriculum Ready)</option>
                        <option value="6">6 Years (Foundation Transition)</option>
                      </select>
                    </div>

                    {/* Interests */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 block">Key Interests / Motivating Themes</label>
                      <select 
                        value={childInterest} 
                        onChange={(e) => setChildInterest(e.target.value)}
                        className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-semibold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="Animals & Nature">Animals & Traditional Wildlife</option>
                        <option value="Space, Rockets & Stars">Space, Rockets & Universe</option>
                        <option value="Vehicles & Trains">Vehicles, Trucks & Trains</option>
                        <option value="Music, Rhythm & Chants">Music, Singing & Traditional Rhythms</option>
                        <option value="Painting & Drawing">Coloring, Sand Art & Drawing</option>
                        <option value="Blocks, Building & Puzzles">Blocks, Lego & Spatial Building</option>
                      </select>
                    </div>

                    {/* Developmental Focus */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 block">Developmental Goal / Targets</label>
                      <select 
                        value={childFocus} 
                        onChange={(e) => setChildFocus(e.target.value)}
                        className="w-full h-11 rounded-xl border border-slate-200 px-3 text-sm font-semibold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="Vocabulary & letters">Vocabulary & Letter Recognition (A-Z)</option>
                        <option value="Numbers & basic arithmetic">Number Sense & Counting Logic</option>
                        <option value="Fine motor skills & crafting">Fine Motor Skills & Artistic Expression</option>
                        <option value="Emotional awareness & social trust">Emotional Awareness & Sharing Coordination</option>
                      </select>
                    </div>
                  </div>

                  {/* Additional notes */}
                  <div className="space-y-2">
                    <label id="additional-context-label" className="text-xs font-bold text-slate-700 block">Specific Parental Note or Routine Adaptations (Optional)</label>
                    <textarea 
                      placeholder="e.g. Include a short puzzle activity focusing on the color green, or prefers active physical outdoor fun." 
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="w-full min-h-[80px] p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none font-semibold text-slate-700 placeholder:text-slate-400"
                      aria-labelledby="additional-context-label"
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => setIsPersonalizing(false)}
                      className="rounded-xl font-bold text-slate-600 h-11 px-5"
                    >
                      Close Wizard
                    </Button>
                    <Button 
                      type="submit" 
                      className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-6 shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                    >
                      <Sparkles className="h-4 w-4" /> Create Custom Path
                    </Button>
                  </div>
                </form>
              )}

              {/* AI Generation Pending State */}
              {aiLoading && (
                <div className="py-16 text-center space-y-4">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-slate-800 text-lg">Assembling customized ECD path for {childName || "your child"}...</p>
                    <p className="text-xs text-slate-400 font-bold max-w-sm mx-auto">Gemini is aligning activities with national early sensory criteria and modern creative models.</p>
                  </div>
                </div>
              )}

              {/* AI Result Presentation Screen */}
              {aiResponse && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 md:p-6 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <Sparkles className="h-5 w-5 fill-blue-500 text-blue-600" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-black text-slate-900 tracking-tight text-base">Interactive Learning Plan Built successfully</h4>
                      <p className="text-xs text-slate-500 font-medium">Adapted for {childAge}-year-old children focused on {childFocus}. Enjoy your active coaching session today!</p>
                    </div>
                  </div>

                  {/* Generated Plan Render */}
                  <div className="border border-slate-200/80 rounded-2xl p-5 bg-slate-50/50 max-h-[400px] overflow-y-auto space-y-4 text-slate-700 text-sm font-medium leading-relaxed font-sans">
                    {aiResponse.split("\n").map((line, idx) => {
                      const trimmed = line.trim();
                      if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
                        return (
                          <h5 key={idx} className="font-extrabold text-slate-900 text-base mt-4 border-b border-slate-100 pb-1 flex items-center gap-1.5">
                            <Sparkle className="h-4 w-4 text-blue-500" />
                            {trimmed.replace(/\*\*/g, "")}
                          </h5>
                        );
                      }
                      if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
                        return (
                          <li key={idx} className="ml-4 list-disc pl-1 font-semibold text-slate-600 my-1">
                            {trimmed.replace(/^(\*|-)\s*/, "").replace(/\*\*/g, "")}
                          </li>
                        );
                      }
                      if (trimmed.match(/^\d+\./)) {
                        return (
                          <div key={idx} className="font-bold text-slate-800 text-sm mt-3 flex items-start gap-2">
                            <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-xs leading-none mt-0.5">{trimmed.match(/^\d+/)?.[0]}</span>
                            <span>{trimmed.replace(/^\d+\.\s*/, "").replace(/\*\*/g, "")}</span>
                          </div>
                        );
                      }
                      return <p key={idx} className="my-1.5 font-medium whitespace-pre-line">{trimmed}</p>;
                    })}
                  </div>

                  <div className="pt-4 flex justify-between items-center gap-4 border-t border-slate-100">
                    <Button 
                      variant="ghost" 
                      onClick={() => setAiResponse(null)}
                      className="rounded-xl font-bold text-blue-600 h-10 px-4"
                    >
                      <RefreshCw className="mr-1.5 h-4 w-4" /> Reset Form
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(aiResponse || "");
                          toast.success("Learning path copied to clipboard!");
                        }}
                        className="rounded-xl font-bold text-slate-700 h-10 px-4"
                      >
                        Copy Path
                      </Button>
                      <Button 
                        onClick={() => setIsPersonalizing(false)}
                        className="rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold h-10 px-5"
                      >
                        Done & Close
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Creation & Scheduling Setup Dialog */}
      {broadcastSetupOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl max-h-[95vh] overflow-y-auto shadow-2xl border border-slate-150 transform transition-all duration-300">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 md:px-8 py-5 border-b border-slate-100 flex items-center justify-between z-10 animate-fade-in">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-indigo-650 animate-pulse" />
                <h3 className="font-black text-lg text-slate-900 tracking-tight">Classroom Broadcast Setup</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setBroadcastSetupOpen(false)}
                className="h-8 w-8 text-slate-450 hover:text-slate-650 rounded-full"
              >
                <X className="h-4.5 w-4.5" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 space-y-6">
              
              {/* Mode Selection */}
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase text-slate-400 block tracking-wider">Broadcast Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingMode("instant")}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                      bookingMode === "instant"
                        ? "border-indigo-600 bg-indigo-50/25 text-indigo-900 shadow-sm"
                        : "border-slate-150 hover:border-slate-200 text-slate-600 bg-white"
                    }`}
                  >
                    <span className="text-xl block mb-1">🔴</span>
                    <span className="text-xs font-black block leading-none">Instant Broadcast</span>
                    <span className="text-[10px] font-bold text-slate-400 block mt-1 leading-tight">Start teaching immediately and notify online families.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookingMode("scheduled")}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                      bookingMode === "scheduled"
                        ? "border-indigo-600 bg-indigo-50/25 text-indigo-900 shadow-sm"
                        : "border-slate-150 hover:border-slate-200 text-slate-600 bg-white"
                    }`}
                  >
                    <span className="text-xl block mb-1">📅</span>
                    <span className="text-xs font-black block leading-none">Book & Schedule Slot</span>
                    <span className="text-[10px] font-bold text-slate-400 block mt-1 leading-tight">Reserve a time slot, budget bandwidth, and pin parent alerts.</span>
                  </button>
                </div>
              </div>

              {/* Form Input fields */}
              <div className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase text-slate-500 block tracking-wider">Lesson / Seminar Topic</label>
                  <Input 
                    placeholder="e.g., Practical Siswati & Counting Plays"
                    value={newBroadcastTitle}
                    onChange={(e) => setNewBroadcastTitle(e.target.value)}
                    className="rounded-xl h-10 border-slate-200 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Teacher Name */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-slate-500 block tracking-wider">Educator Name</label>
                    <Input 
                      placeholder="e.g., Nokwanda Dlamini"
                      value={newBroadcastTeacher}
                      onChange={(e) => setNewBroadcastTeacher(e.target.value)}
                      className="rounded-xl h-10 border-slate-200 text-xs font-semibold"
                    />
                  </div>

                  {/* Theme Select */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-slate-500 block tracking-wider">Board Theme & Backdrop</label>
                    <select
                      value={newBroadcastTheme}
                      onChange={(e) => setNewBroadcastTheme(e.target.value)}
                      className="w-full rounded-xl h-10 border border-slate-200 text-xs font-semibold px-2.5 bg-white text-slate-700 outline-none"
                    >
                      <option value="from-slate-900 to-indigo-950">🌌 Cosmic Dream Indigo</option>
                      <option value="from-emerald-950 to-slate-950">🌲 Preschool Forest Green</option>
                      <option value="from-amber-950 to-indigo-950">🧱 Clay Earth Playground</option>
                      <option value="from-slate-900 to-slate-950"> Midnight Slate</option>
                    </select>
                  </div>
                </div>

                {/* Scheduling Parameters if Booking Mode is "scheduled" */}
                {bookingMode === "scheduled" && (
                  <div className="p-4 bg-amber-50/40 border border-amber-100 rounded-2xl grid grid-cols-2 gap-3 animate-fade-in">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-amber-800 block">Select Target Date</label>
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="w-full rounded-xl h-9 border border-amber-200 text-xs font-bold px-2 bg-white text-slate-700 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-amber-800 block">Start Time (SAST)</label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full rounded-xl h-9 border border-amber-200 text-xs font-bold px-2 bg-white text-slate-700 outline-none"
                      />
                    </div>
                    <div className="col-span-2 text-[10px] text-amber-900 font-semibold leading-normal">
                      💡 <strong>Advantage:</strong> Scheduling streams allows children's families to prepare localized cellular data vouchers and setup connections beforehand.
                    </div>
                  </div>
                )}

                {/* Vocabulary Focus */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase text-slate-500 block tracking-wider">Siswati Vocabulary Highlights</label>
                  <Input 
                    placeholder="e.g. Sawubona (Hello), Siyingilizi (Circle), Sibili (Two)"
                    value={newBroadcastVocab}
                    onChange={(e) => setNewBroadcastVocab(e.target.value)}
                    className="rounded-xl h-10 border-slate-200 text-xs font-semibold"
                  />
                </div>

                <div className="border border-indigo-50 hover:border-indigo-150 p-4 rounded-2xl bg-slate-50/50 space-y-3">
                  <span className="text-[10px] font-extrabold text-indigo-600 block uppercase tracking-wide">Family Interaction Setup</span>
                  {/* Live Opinion Poll */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-slate-700 block">Chalkboard Poll Question</label>
                    <Input 
                      placeholder="e.g., Can your toddler count with beans easily?"
                      value={newBroadcastPollQuestion}
                      onChange={(e) => setNewBroadcastPollQuestion(e.target.value)}
                      className="rounded-xl h-9 border-slate-200 text-xs font-semibold bg-white"
                    />
                  </div>

                  {/* Poll Options */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 block">Choices (Separate with semicolons ";")</label>
                    <Input 
                      placeholder="e.g., Yes, easily; Almost there; Finding it tricky"
                      value={newBroadcastPollOptionsStr}
                      onChange={(e) => setNewBroadcastPollOptionsStr(e.target.value)}
                      className="rounded-xl h-9 border-slate-200 text-xs font-semibold bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Trigger Actions */}
              <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                <Button 
                  variant="outline" 
                  onClick={() => setBroadcastSetupOpen(false)}
                  className="rounded-xl border-slate-200 h-10 font-bold text-xs"
                >
                  Cancel
                </Button>
                
                <Button
                  onClick={async () => {
                    if (!newBroadcastTitle.trim() || !newBroadcastTeacher.trim()) {
                      toast.error("Please supply both a Lesson Topic and Educator Name!");
                      return;
                    }

                    const optArr = newBroadcastPollOptionsStr.split(";").map(x => x.trim()).filter(Boolean);
                    const isInstant = bookingMode === "instant";

                    try {
                      const payload = {
                        title: newBroadcastTitle.trim(),
                        teacher: newBroadcastTeacher.trim(),
                        vocab: newBroadcastVocab.trim(),
                        pollQuestion: newBroadcastPollQuestion.trim(),
                        pollOptions: optArr,
                        pollVotes: optArr.map(() => 0),
                        background: newBroadcastTheme,
                        currentStep: 0,
                        active: isInstant,
                        status: bookingMode,
                        createdAt: new Date().toISOString()
                      } as any;

                      if (!isInstant) {
                        payload.scheduledDate = scheduleDate;
                        payload.scheduledTime = scheduleTime;
                      }

                      const createdDoc = await createDocument("live_classes", null, payload);

                      if (isInstant && createdDoc) {
                        setCurrentRealClassId(createdDoc);
                        setIsBroadcasting(true);
                        toast.success("Broadcast initiated! Families notified in real-time.");
                      } else {
                        // Create Community Corkboard notice pinned dynamically
                        await createDocument("dashboard_notes", null, {
                          author: newBroadcastTeacher.trim(),
                          note: `📅 UPCOMING LIVE LESSON ANNOUNCEMENT: "${newBroadcastTitle.trim()}" is booked to broadcast on ${scheduleDate} at ${scheduleTime}. Early Prep Reminder: Please review intermediate study cards so we can play playgroup count games together!`,
                          votes: 3,
                          timestamp: `${scheduleDate} @ ${scheduleTime}`,
                          createdAt: new Date().toISOString(),
                          userId: user?.uid || "anonymous_session"
                        });
                        toast.success("Time booked & notice instantly pinned to parent board successfully!");
                      }

                      setBroadcastSetupOpen(false);
                    } catch (err: any) {
                      toast.error("Could not write broadcast to database. " + err.message);
                    }
                  }}
                  className="rounded-xl bg-indigo-650 hover:bg-indigo-750 text-white font-black text-xs h-10 px-6 border-none"
                >
                  {bookingMode === "instant" ? "🟢 Launch Dynamic Stream" : "📅 Book & Announce Stream"}
                </Button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Explore Module Dialog Overlay */}
      {exploreId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-150 transform transition-all duration-300">
            
            {/* Modal Navigation Header */}
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  {FEATURES.find(f => f.id === exploreId)?.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 leading-tight">
                    {FEATURES.find(f => f.id === exploreId)?.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold">Interactive Module Explorer</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setExploreId(null)}
                className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-full"
                aria-label="Close template preview"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Showcase Core Content depending on feature selected */}
            <div className="p-6 md:p-8">
              
              {/* MODULE 1: GAMES */}
              {exploreId === "games" && (
                <div className="space-y-6 text-center">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-600">Mini Playable App</span>
                    <h4 className="text-lg font-black text-slate-800">Learn addition: Count the Emalangeni Coins!</h4>
                    <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
                      Look at the coins displayed inside the golden box and count them. Tap on the correct number!
                    </p>
                  </div>

                  {/* Golden box playground */}
                  <div className="bg-amber-50/50 border rounded-2xl p-6 border-amber-100 inline-block min-w-[200px]">
                    <div className="flex gap-2 justify-center text-3xl select-none" aria-label="Counting items display">
                      {Array.from({ length: correctAnswer }).map((_, i) => (
                        <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 100}ms` }}>🪙</span>
                      ))}
                    </div>
                  </div>

                  {/* Feedback line */}
                  {gameFeedback && (
                    <p className={`text-sm font-extrabold py-1 px-3 w-fit mx-auto rounded-full ${
                      gameAnswer === correctAnswer ? "bg-emerald-100 text-emerald-800" : "bg-red-50 text-red-700"
                    }`}>
                      {gameFeedback}
                    </p>
                  )}

                  {/* Multi-choices buttons */}
                  <div className="flex justify-center gap-3">
                    {[3, 4, 5, 6, 7].map((num) => (
                      <Button
                        key={num}
                        onClick={() => handleGameGuess(num)}
                        disabled={gameAnswer !== null}
                        className={`h-12 w-12 rounded-xl text-sm font-bold border-2 transition-all shadow-sm ${
                          gameAnswer === num 
                            ? num === correctAnswer 
                              ? "bg-emerald-600 text-white border-emerald-500" 
                              : "bg-red-500 text-white border-red-400"
                            : gameAnswer !== null && num === correctAnswer
                            ? "bg-emerald-600 text-white border-emerald-500"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-between items-center text-xs text-slate-400 font-bold border-t border-slate-100">
                    <span>Active Score: <strong className="text-slate-700 text-sm">{gameScore} pts</strong></span>
                    <Button variant="ghost" onClick={resetGame} className="rounded-lg h-8 px-2.5 hover:bg-slate-50 text-blue-600">
                      <RefreshCw className="mr-1 h-3 w-3" /> Next Question
                    </Button>
                  </div>
                </div>
              )}

              {/* MODULE 2: VIDEOS */}
              {exploreId === "videos" && (
                <div className="space-y-6">
                  {expandedVideo ? (
                    <div className="space-y-4 animate-fade-in">
                      <Button variant="ghost" onClick={() => setExpandedVideo(null)} className="h-8 px-3 text-slate-500 rounded-xl mb-2 hover:bg-slate-100">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Library
                      </Button>
                      
                      <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 group shadow-lg border border-slate-200">
                        <iframe
                          src={expandedVideo.videoUrl}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>

                      <div className="px-1 space-y-2">
                        <h4 className="text-xl font-black text-slate-800">{expandedVideo.title}</h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 pb-2">
                          <span className="flex items-center gap-1"><User className="h-3 w-3" /> {expandedVideo.teacher}</span>
                          <span className="flex items-center gap-1">• {expandedVideo.topic}</span>
                          {expandedVideo.views !== undefined && <span>• {expandedVideo.views} views</span>}
                          {(expandedVideo.scheduledWeek || expandedVideo.scheduledDate) && (
                            <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full ml-auto">
                              <Clock className="h-3 w-3" />
                              {expandedVideo.scheduledWeek ? expandedVideo.scheduledWeek : ""}
                              {expandedVideo.scheduledWeek && expandedVideo.scheduledDate ? " • " : ""}
                              {expandedVideo.scheduledDate ? new Date(expandedVideo.scheduledDate).toLocaleDateString([], { month: "short", day: "numeric" }) : ""}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 rounded-2xl p-4 border border-slate-100">
                          {expandedVideo.description || "No description provided."}
                        </p>

                        {/* Schedule Editor for Teachers */}
                        {((user?.role as string) === "school_owner" || (user?.role as string) === "admin" || user?.email?.toLowerCase().includes("teacher") || user?.name?.toLowerCase().includes("teacher")) && (
                          <div className="pt-2">
                            {activeEditingVideoId === expandedVideo.id ? (
                              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl space-y-3">
                                <h5 className="font-bold text-xs text-rose-800 uppercase tracking-wider flex items-center gap-1.5"><Clock className="h-3 w-3" /> Edit Viewing Schedule</h5>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-rose-600 block">Academic Week</label>
                                    <select 
                                      value={editVideoWeek} 
                                      onChange={e => setEditVideoWeek(e.target.value)}
                                      className="w-full h-8 rounded-lg border border-rose-200 bg-white px-2 text-xs focus:outline-none focus:ring-1 focus:ring-rose-300"
                                    >
                                      <option value="">None</option>
                                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(w => (
                                        <option key={w} value={`Week ${w}`}>Week {w}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-rose-600 block">Specific Date (Optional)</label>
                                    <Input
                                      type="date"
                                      value={editVideoDate}
                                      onChange={e => setEditVideoDate(e.target.value)}
                                      className="rounded-lg h-8 text-xs border-rose-200 bg-white"
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-1">
                                  <Button variant="ghost" size="sm" onClick={() => setActiveEditingVideoId(null)} className="h-7 text-xs font-bold text-rose-700 hover:bg-rose-100">Cancel</Button>
                                  <Button size="sm" onClick={() => handleSaveVideoSchedule(expandedVideo)} className="h-7 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white">Save Schedule</Button>
                                </div>
                              </div>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setEditVideoWeek(expandedVideo.scheduledWeek || "");
                                  setEditVideoDate(expandedVideo.scheduledDate || "");
                                  setActiveEditingVideoId(expandedVideo.id);
                                }}
                                className="h-8 text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50 rounded-xl"
                              >
                                <Clock className="h-3.5 w-3.5 mr-1.5" /> Adjust Viewing Schedule
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-center sm:text-left space-y-1">
                          <span className="text-[10px] uppercase tracking-wider font-extrabold text-rose-600">Video Library</span>
                          <h4 className="text-xl font-black text-slate-800">Educational Video Stream</h4>
                        </div>
                        
                        {((user?.role as string) === "school_owner" || (user?.role as string) === "admin" || user?.email?.toLowerCase().includes("teacher") || user?.name?.toLowerCase().includes("teacher")) && (
                          <Button 
                            onClick={() => setShowAddVideoDialog(true)}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl h-9"
                          >
                            <Plus className="h-4 w-4 mr-1.5" /> Post Lesson
                          </Button>
                        )}
                      </div>

                      {educationalVideos.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                          <Video className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                          <h3 className="text-sm font-bold text-slate-700">No videos posted yet</h3>
                          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Educators can add YouTube links or embed videos here for distance learners.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {educationalVideos.map(video => (
                            <div 
                              key={video.id}
                              onClick={() => {
                                setExpandedVideo(video);
                                // Optional: increment view count
                                if (video.id) {
                                  updateDocument("educational_videos", video.id, { views: (video.views || 0) + 1 }).catch(()=>null);
                                }
                              }}
                              className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition-all hover:-translate-y-1"
                            >
                              <div className="aspect-video bg-rose-50 border-b border-slate-100 relative overflow-hidden flex items-center justify-center">
                                {/* If it starts with https://..., we could extract thumbnail for youtube, or just show play button overlay */}
                                {video.videoUrl && video.videoUrl.includes("youtube.com") ? (
                                  <img 
                                    src={`https://img.youtube.com/vi/${video.videoUrl.split("embed/")[1]?.split("?")[0]}/hqdefault.jpg`} 
                                    alt={video.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                      e.currentTarget.style.display='none';
                                    }}
                                  />
                                ) : (
                                  <Video className="h-10 w-10 text-rose-200 group-hover:scale-110 transition-transform duration-500" />
                                )}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                  <div className="h-10 w-10 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Play className="h-4 w-4 ml-0.5 fill-white" />
                                  </div>
                                </div>
                              </div>
                              <div className="p-4 space-y-1.5 relative">
                                <span className="inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 leading-none">
                                  {video.topic || "Core Lesson"}
                                </span>
                                {(video.scheduledWeek || video.scheduledDate) && (
                                  <div className="absolute top-2 right-4 flex items-center gap-1 text-[9px] font-black text-rose-500 bg-rose-50/50 px-2 py-1 rounded-full border border-rose-100">
                                    <Clock className="h-2.5 w-2.5" />
                                    <span>
                                      {video.scheduledWeek ? video.scheduledWeek : ""}
                                      {video.scheduledWeek && video.scheduledDate ? " • " : ""}
                                      {video.scheduledDate ? new Date(video.scheduledDate).toLocaleDateString([], { month: "short", day: "numeric" }) : ""}
                                    </span>
                                  </div>
                                )}
                                <h5 className="font-extrabold text-sm text-slate-800 line-clamp-1">{video.title}</h5>
                                <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
                                  <span>{video.teacher}</span>
                                  <span>{video.views || 0} views</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Add Video Dialog */}
                  {showAddVideoDialog && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center border-b border-slate-100 p-4 bg-slate-50/50">
                          <h4 className="font-black text-slate-800 flex items-center gap-2">
                            <Plus className="h-4 w-4 text-rose-500" /> Add New Video
                          </h4>
                          <Button variant="ghost" size="icon" onClick={() => setShowAddVideoDialog(false)} className="h-8 w-8 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <form onSubmit={handleAddVideo} className="p-5 space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 block">Lesson Title*</label>
                            <Input
                              value={newVideoTitle}
                              onChange={e => setNewVideoTitle(e.target.value)}
                              placeholder="e.g. Siswati Vowels Practice"
                              className="rounded-xl h-10 border-slate-200"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 block">Video URL (YouTube)*</label>
                            <Input
                              value={newVideoUrl}
                              onChange={e => setNewVideoUrl(e.target.value)}
                              placeholder="https://youtube.com/watch?v=..."
                              className="rounded-xl h-10 border-slate-200"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 block">Topic Subject</label>
                            <Input
                              value={newVideoTopic}
                              onChange={e => setNewVideoTopic(e.target.value)}
                              placeholder="e.g. Numeracy, Phonics, Art"
                              className="rounded-xl h-10 border-slate-200"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 block">Brief Description / Guide</label>
                            <textarea
                              value={newVideoDesc}
                              onChange={e => setNewVideoDesc(e.target.value)}
                              placeholder="What should parents help the child focus on?"
                              className="w-full flex min-h-[80px] rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-600 block">Scheduled Week (Optional)</label>
                              <select 
                                value={newVideoWeek} 
                                onChange={e => setNewVideoWeek(e.target.value)}
                                className="w-full h-10 rounded-xl border border-slate-200 bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                              >
                                <option value="">None</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(w => (
                                  <option key={w} value={`Week ${w}`}>Week {w}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-600 block">Scheduled Date (Optional)</label>
                              <Input
                                type="date"
                                value={newVideoDate}
                                onChange={e => setNewVideoDate(e.target.value)}
                                className="rounded-xl h-10 border-slate-200"
                              />
                            </div>
                          </div>
                          
                          <div className="pt-2 flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => setShowAddVideoDialog(false)} className="rounded-xl font-bold h-10">Cancel</Button>
                            <Button type="submit" className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 px-6">Publish</Button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MODULE 3: STORYTELLING */}
              {exploreId === "story" && (
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-purple-600">Interactive Bedtime Storybook</span>
                    <h4 className="text-lg font-black text-slate-800">{STORIES[storyIndex].title}</h4>
                  </div>

                  {/* Curated Interactive Story Card */}
                  <Card className="rounded-2xl border-slate-150 p-6 shadow-inner bg-gradient-to-tr from-slate-50/50 to-purple-50/20 text-center space-y-4">
                    <div className="text-6xl select-none" aria-hidden="true">
                      {STORIES[storyIndex].pages[storyPage].img}
                    </div>
                    <p className="text-slate-700 leading-relaxed font-semibold text-sm h-[60px] flex items-center justify-center max-w-md mx-auto">
                      "{STORIES[storyIndex].pages[storyPage].text}"
                    </p>
                    <div className="text-xs text-slate-400 font-bold">
                      Page {storyPage + 1} of {STORIES[storyIndex].pages.length}
                    </div>
                  </Card>

                  {/* Story selectors & flip buttons */}
                  <div className="flex justify-between items-center gap-4">
                    <select
                      value={storyIndex}
                      onChange={(e) => {
                        setStoryIndex(parseInt(e.target.value));
                        setStoryPage(0);
                      }}
                      className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-semibold bg-white text-slate-700"
                    >
                      {STORIES.map((story, idx) => (
                        <option key={idx} value={idx}>{story.title}</option>
                      ))}
                    </select>

                    <div className="flex gap-2 shrink-0">
                      <Button 
                        disabled={storyPage === 0}
                        onClick={() => setStoryPage(p => p - 1)}
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl h-9 font-bold"
                      >
                        Prev Page
                      </Button>
                      <Button 
                        disabled={storyPage === STORIES[storyIndex].pages.length - 1}
                        onClick={() => setStoryPage(p => p + 1)}
                        size="sm" 
                        className="rounded-xl h-9 bg-purple-600 hover:bg-purple-700 text-white font-bold"
                      >
                        Next Page
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* MODULE 4: WORKSHEETS */}
              {exploreId === "worksheets" && (
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-600">Digital Tracing Canvas & Activities</span>
                    <h4 className="text-md font-black text-slate-800">Preschool Alphabet: Draw/Trace Letter 'A'</h4>
                    <p className="text-xs text-slate-500 font-semibold">Slide your mouse or finger to trace on screen. Teaches pencil grip and coordination!</p>
                  </div>

                  {/* Painting Tracing Board */}
                  <div className="flex flex-col items-center gap-4">
                    <canvas
                      ref={canvasRef}
                      width={320}
                      height={200}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="border border-slate-200 rounded-2xl bg-white shadow-inner cursor-crosshair touch-none"
                    />

                    {/* Control Brush */}
                    <div className="flex items-center justify-between w-full max-w-sm gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-500">Brush:</span>
                        {["#2563eb", "#dc2626", "#16a34a", "#db2777"].map((color) => (
                          <button
                            key={color}
                            onClick={() => setBrushColor(color)}
                            className={`h-6 w-6 rounded-full border-2 ${
                              brushColor === color ? "border-slate-800 scale-110" : "border-slate-200"
                            }`}
                            style={{ backgroundColor: color }}
                            aria-label={`Set brush to ${color}`}
                          />
                        ))}
                      </div>
                      <Button 
                        variant="ghost" 
                        onClick={clearCanvas} 
                        className="rounded-lg h-8 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                      >
                        Clear Template
                      </Button>
                    </div>
                  </div>

                  {/* Real printable links */}
                  <div className="border-t border-dashed border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-5 w-5 text-amber-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">Sizwe_Tracing_LetterA_to_Z.pdf</p>
                        <p className="text-[10px] text-slate-400 font-semibold">File size: 1.2 MB | 26 Pages</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => toast.success("PDF worksheet downloaded to simulated directory successfully!")}
                      className="rounded-xl h-9 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                    >
                      <Printer className="h-3.5 w-3.5" /> Print Worksheet PDF
                    </Button>
                  </div>
                </div>
              )}

              {/* MODULE 5: PARENT ACTIVITIES */}
              {exploreId === "parents" && (
                <div className="space-y-6">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600">Daily checklist & feedback loop</span>
                    <h4 className="text-lg font-black text-slate-800">Weekly interactive Parenting routine</h4>
                    <p className="text-xs text-slate-500 font-semibold">Integrate play seamlessly into your daily chores. Tick off tasks you complete with your child!</p>
                  </div>

                  <div className="space-y-3 bg-slate-50 border rounded-2xl p-4 shadow-sm">
                    {activitiesState.map((activity) => (
                      <div 
                        key={activity.id}
                        onClick={() => toggleActivity(activity.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          activity.done 
                            ? "bg-emerald-50 text-emerald-800 border-emerald-100 line-through" 
                            : "bg-white text-slate-700 border-slate-200/60 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 ${
                          activity.done ? "bg-emerald-600 border-emerald-500 text-white" : "border-slate-300"
                        }`}>
                          {activity.done && <Check className="h-3.5 w-3.5" />}
                        </div>
                        <span className="text-xs font-bold leading-none">{activity.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Calculated Parenting Progress Bar */}
                  <div className="space-y-2 border-t border-slate-100 pt-4">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                      <span>ECD Parenting Completion Profile</span>
                      <span className="text-emerald-700 text-sm">
                        {Math.round((activitiesState.filter(a => a.done).length / activitiesState.length) * 100)}% Complete
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden w-full">
                      <div 
                        className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                        style={{ width: `${(activitiesState.filter(a => a.done).length / activitiesState.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODULE 6: LIVE VIRTUAL CLASSES */}
              {exploreId === "live" && (
                <div className="space-y-6">
                  
                  {/* Real-time Collaboration Portal Jumbotron */}
                  <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-indigo-50/70 p-4 border border-indigo-100 rounded-3xl">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-700 block">Classroom Broadcast Portal</span>
                      <h4 className="text-xs font-bold text-slate-800">Swaziland Early Childhood Distance Learning Hub</h4>
                      <p className="text-[11px] text-slate-500 font-bold">Conduct lessons in real-time as an educator, or join active classes to share tips!</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => {
                          setNewBroadcastTeacher(user?.name || (user?.email ? user.email.split("@")[0] : "Teacher Guest"));
                          setNewBroadcastTitle("Practical Siswati & Counting Plays");
                          setBroadcastSetupOpen(true);
                        }}
                        className="bg-indigo-650 hover:bg-indigo-750 font-black text-xs text-white rounded-xl px-4 h-9 flex items-center gap-1.5 shadow-md active:scale-95 transition-all text-[11px] shrink-0 border-none"
                      >
                        <Plus className="h-4 w-4" /> Host a Live Lesson
                      </Button>
                    </div>
                  </div>

                  {/* Channel Selection Feed */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block font-sans">SELECT WEBINAR CHANNEL</span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      
                      {/* Genuine database-backed live host streams! */}
                      {realLiveClasses.map((cls) => {
                        const isSelected = currentRealClassId === cls.id;
                        return (
                          <button
                            key={cls.id}
                            onClick={() => {
                              setCurrentRealClassId(cls.id);
                              setLiveClassPollAnswer(null);
                              toast.success(`Joined real-time broadcast conducted by ${cls.teacher}!`);
                            }}
                            className={`p-3 bg-gradient-to-r from-amber-50/30 to-emerald-50/30 rounded-2xl border-2 text-left transition-all flex flex-col justify-between relative overflow-hidden ${
                              isSelected 
                                ? "border-emerald-600 shadow-md ring-2 ring-emerald-500/10" 
                                : "border-emerald-150 hover:border-emerald-250"
                            }`}
                          >
                            <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-650 animate-ping"></span>
                              <span className="text-[8px] font-black text-red-600">LIVE</span>
                            </div>
                            <div className="mb-1">
                              <span className="text-[9px] font-black text-emerald-800 uppercase tracking-tight">🔴 Real Host</span>
                            </div>
                            <span className="text-[9px] font-extrabold text-slate-500 block truncate leading-none">Educator: {cls.teacher}</span>
                            <span className="text-[11px] font-black text-slate-900 leading-tight block line-clamp-1 mt-1">{cls.title}</span>
                          </button>
                        );
                      })}

                      {realLiveClasses.length === 0 && (
                        <div className="col-span-1 p-3 border border-dashed border-slate-200 rounded-2xl bg-slate-50/20 flex flex-col items-center justify-center text-center text-[10px] text-slate-400 font-bold leading-normal">
                          <span>No cloud hosts active.</span>
                          <span className="text-indigo-650">Conduct a new broadcast!</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Scheduled Classes Feed */}
                  {allRealClasses.filter(c => c.status === "scheduled" && c.active === false).length > 0 && (
                    <div className="space-y-2 mt-4 animate-fade-in">
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-600 block font-sans">📅 UPCOMING STREAM BOOKINGS & REGULATION</span>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        {allRealClasses.filter(c => c.status === "scheduled" && c.active === false).map((cls) => {
                          return (
                            <div
                              key={cls.id}
                              className="p-3 bg-amber-50/20 rounded-2xl border-2 border-dashed border-amber-200 text-left transition-all flex flex-col justify-between relative overflow-hidden"
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <span className="text-[9px] font-black text-amber-700 uppercase tracking-tight">📅 Time Booked</span>
                                <Badge className="bg-amber-100 text-amber-800 text-[8px] font-bold px-1.5 py-0 border-none shrink-0">Scheduled</Badge>
                              </div>
                              <span className="text-[9px] font-extrabold text-slate-500 block truncate leading-none">Educator: {cls.teacher}</span>
                              <span className="text-[11px] font-black text-slate-900 leading-tight block line-clamp-1 mt-1">{cls.title}</span>
                              
                              <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex flex-col gap-1.5 w-full">
                                <div className="text-[9px] font-black text-amber-900">
                                  ⏰ {cls.scheduledDate} @ {cls.scheduledTime} (SAST)
                                </div>
                                <Button
                                  size="sm"
                                  onClick={async () => {
                                    try {
                                      await updateDocument("live_classes", cls.id, {
                                        active: true,
                                        status: "live"
                                      });
                                      setCurrentRealClassId(cls.id);
                                      setIsBroadcasting(true);
                                      toast.success(`Broadcasting initiated for: ${cls.title}!`);
                                    } catch (err: any) {
                                      toast.error("Could not trigger broadcast");
                                    }
                                  }}
                                  className="h-6 w-full bg-amber-500 hover:bg-amber-600 hover:shadow-md transition-all font-black text-[9px] text-slate-900 border-none rounded-lg flex items-center justify-center gap-1 shrink-0"
                                >
                                  Go Live Now 🟢
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Main Grid: Streaming screen on left, interactive tabs/chat on right */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    
                    {/* LEFT COLUMN: ACTIVE SCREEN PLAYER (7/12 cols) */}
                    <div className="md:col-span-8 flex flex-col space-y-3">
                      
                      {currentRealClassId !== null && selectedRealClass ? (
                        /* ============== CASE A: GENUINE DATABASE REALTIME CHALKBOARD STREAM VIEW ============== */
                        <div className={`relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-gradient-to-b ${selectedRealClass.background || "from-slate-900 to-indigo-950"} flex flex-col justify-between p-4 min-h-[340px] transition-all duration-500`}>
                          
                          {/* Stream Header Icons overlay */}
                          <div className="flex items-center justify-between z-10 w-full bg-black/40 px-3 py-1.5 rounded-2xl backdrop-blur-md border border-white/5">
                            <div className="flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span>
                              <span className="font-extrabold text-[9px] text-emerald-400">🔴 DATABASE REAL-TIME WEBINAR</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {isBroadcasting && (
                                <Button
                                  size="sm"
                                  onClick={async () => {
                                    try {
                                      await updateDocument("live_classes", selectedRealClass.id, {
                                        active: false
                                      });
                                      setIsBroadcasting(false);
                                      setCurrentRealClassId(null);
                                      toast.success("Broadcast stream terminated.");
                                    } catch (err) {
                                      toast.error("Could not terminate session.");
                                    }
                                  }}
                                  className="bg-red-650 hover:bg-red-700 h-6 px-2 text-[9px] font-black text-white hover:text-white rounded-lg border-none shrink-0"
                                >
                                  ⏹️ End Broadcast
                                </Button>
                              )}
                              <Badge className="bg-emerald-600 text-white font-bold text-[8px] border-none px-2 py-0.5 animate-pulse">
                                Active Board
                              </Badge>
                            </div>
                          </div>

                          {/* Interactive Board content area depending on host's active step */}
                          <div className="flex-grow flex flex-col justify-center text-center p-3 relative space-y-2 select-none">
                            {selectedRealClass.currentStep === 0 && (
                              // Phase 1: Greetings
                              <div className="space-y-2 animate-fade-in">
                                <span className="text-4xl block animate-bounce" style={{ animationDuration: '2.5s' }}>👋🏽🎵🇸🇿</span>
                                <Badge className="bg-emerald-600 text-white font-extrabold text-[9px]">PHASE 1: CLASS GREETINGS</Badge>
                                <h5 className="font-extrabold text-white text-md tracking-tight leading-normal">{selectedRealClass.title}</h5>
                                <p className="text-xs text-emerald-300 font-bold">
                                  Welcome to <strong className="text-white">{selectedRealClass.teacher}</strong>'s virtual stream room.
                                </p>
                                <div className="max-w-xs mx-auto text-[11px] text-slate-300 font-medium italic mt-1 bg-black/40 p-2.5 rounded-2xl border border-white/5 leading-relaxed">
                                  "Welcome families! Check intermediate study booklets inside the Handouts tab, or type a welcome chat!"
                                </div>
                              </div>
                            )}

                            {selectedRealClass.currentStep === 1 && (
                              // Phase 2: Live Draw Chalkboard Canvas
                              <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in relative pt-4">
                                <div className="absolute inset-x-0 -top-1 text-center flex flex-col items-center pointer-events-none">
                                  <Badge className="bg-amber-500 text-slate-900 border-none font-black text-[8px] h-4 leading-none">PHASE 2: HANDS-ON WHITEBOARD CHALKBOARD</Badge>
                                  <span className="text-[9px] text-slate-300 font-extrabold mt-0.5 leading-none">
                                    {isBroadcasting ? "Draw on the board below using your cursor/fingertip!" : "Real-time vector synchronization of teacher's board!"}
                                  </span>
                                </div>

                                <div className="relative w-full aspect-video max-h-[195px] border-2 border-emerald-800 rounded-2xl bg-slate-950/40 overflow-hidden shadow-inner mt-4">
                                  {isBroadcasting ? (
                                    <canvas
                                      ref={educatorBoardCanvasRef}
                                      width={400}
                                      height={220}
                                      onMouseDown={startDrawingOnEducatorBoard}
                                      onMouseMove={drawOnEducatorBoard}
                                      onMouseUp={stopDrawingOnEducatorBoard}
                                      onMouseLeave={stopDrawingOnEducatorBoard}
                                      onTouchStart={startDrawingOnEducatorBoard}
                                      onTouchMove={drawOnEducatorBoard}
                                      onTouchEnd={stopDrawingOnEducatorBoard}
                                      className="w-full h-full cursor-cell touch-none bg-emerald-950/10"
                                    />
                                  ) : (
                                    <canvas
                                      ref={viewerBoardCanvasRef}
                                      width={400}
                                      height={220}
                                      className="w-full h-full pointer-events-none bg-emerald-950/10"
                                    />
                                  )}
                                </div>

                                {isBroadcasting && (
                                  <div className="absolute bottom-1 w-full flex justify-center items-center gap-2 pointer-events-auto">
                                    <div className="flex gap-1 p-0.5 bg-black/70 border border-white/10 rounded-lg">
                                      {[
                                        { color: "#ffffff", label: "⚪" },
                                        { color: "#fbbf24", label: "🟡" },
                                        { color: "#10b981", label: "🟢" },
                                        { color: "#38bdf8", label: "🔵" }
                                      ].map((c) => (
                                        <button
                                          key={c.color}
                                          onClick={() => setEducatorBrushColor(c.color)}
                                          className={`w-5 h-5 rounded flex items-center justify-center text-xs border ${
                                            educatorBrushColor === c.color ? "border-white scale-110" : "border-transparent"
                                          }`}
                                        >
                                          {c.label}
                                        </button>
                                      ))}
                                    </div>
                                    <Button
                                      size="sm"
                                      onClick={clearEducatorBoard}
                                      className="bg-black/60 hover:bg-black/80 h-6 text-[9px] font-black text-red-400 rounded-lg py-0 px-2 shrink-0 border border-red-950"
                                    >
                                      🧽 Clear Board
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}

                            {selectedRealClass.currentStep === 2 && (
                              // Phase 3: Real interactive poll
                              <div className="space-y-3 animate-fade-in max-w-sm mx-auto relative z-20">
                                <span className="text-4xl block">🗳️🏆🇸🇿</span>
                                <Badge className="bg-rose-500 text-white border-none font-extrabold text-[9px]">PHASE 3: INTERACTIVE QUIZ POLL</Badge>
                                <h5 className="font-extrabold text-slate-100 text-xs tracking-tight mb-2">
                                  Teacher Check Question: <strong className="text-amber-300">{selectedRealClass.pollQuestion}</strong>
                                </h5>

                                {liveClassPollAnswer === null ? (
                                  <div className="flex flex-col gap-1.5">
                                    {selectedRealClass.pollOptions.map((opt: string, oIdx: number) => (
                                      <Button
                                        key={oIdx}
                                        onClick={() => castVoteRealTime(oIdx)}
                                        size="sm"
                                        className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-[11px] rounded-xl h-8 py-0 transition-all text-left justify-start"
                                      >
                                        <span className="bg-white/20 text-white h-5 w-5 rounded mr-2 flex items-center justify-center text-[10px]">{oIdx + 1}</span>
                                        {opt}
                                      </Button>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="bg-black/40 p-3 rounded-2xl border border-white/10 space-y-2 text-left">
                                    <p className="text-[10px] font-bold text-slate-300">Live Family feedback responses in real-time:</p>
                                    {selectedRealClass.pollOptions.map((opt: string, oIdx: number) => {
                                      const votesArray = selectedRealClass.pollVotes || selectedRealClass.pollOptions.map(() => 0);
                                      const choiceVotes = votesArray[oIdx] || 0;
                                      const totalVotes = votesArray.reduce((acc: number, cur: number) => acc + (cur || 0), 0) || 1;
                                      const pct = Math.round((choiceVotes / totalVotes) * 100);
                                      const isMyVote = liveClassPollAnswer === oIdx;
                                      return (
                                        <div key={oIdx} className="space-y-1">
                                          <div className="flex justify-between items-center text-[10px] font-black text-white">
                                            <span>{opt} {isMyVote && <strong className="text-emerald-400 font-extrabold">(Done)</strong>}</span>
                                            <span>{pct}% ({choiceVotes} families)</span>
                                          </div>
                                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div 
                                              className={`h-full rounded-full ${isMyVote ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'}`}
                                              style={{ width: `${pct}%` }}
                                            ></div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => setLiveClassPollAnswer(null)} 
                                      className="h-6 text-[9px] font-bold text-indigo-300 hover:text-white p-0 shrink-0"
                                    >
                                      Reset / Vote on other
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}

                            {selectedRealClass.currentStep === 3 && (
                              // Phase 4: Class completion wrap notes
                              <div className="space-y-2 animate-fade-in text-center p-4">
                                <span className="text-4xl block animate-bounce">🏡📝✨</span>
                                <Badge className="bg-emerald-500 text-white border-none font-extrabold text-[9px]">PHASE 4: LESSON WRAP-UP</Badge>
                                <h5 className="font-extrabold text-slate-100 text-xs tracking-tight">Lesson completed! Family Homework schedules are ready.</h5>
                                <p className="text-[11px] text-slate-300 font-semibold max-w-xs mx-auto leading-relaxed mt-1">
                                  "Wonderful work team! Review standard syllabus files in the Handouts sidebar tab & post notes below!"
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Host Controls overlays */}
                          <div className="z-10 w-full bg-black/70 p-2 text-xs rounded-2xl flex sm:flex-row flex-col gap-2 items-center justify-between backdrop-blur-md border border-white/5 mt-auto">
                            {isBroadcasting ? (
                              <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2">
                                <div className="flex items-center gap-1 shrink-0">
                                  <span className="text-[9px] font-black text-amber-400 mr-1 uppercase">PHASE:</span>
                                  {[
                                    { label: "1.👋", key: 0 },
                                    { label: "2.✏️", key: 1 },
                                    { label: "3.🗳️", key: 2 },
                                    { label: "4.🎓", key: 3 }
                                  ].map((step) => (
                                    <button
                                      key={step.key}
                                      onClick={async () => {
                                        try {
                                          await updateDocument("live_classes", selectedRealClass.id, {
                                            currentStep: step.key
                                          });
                                          toast.success("Broadcast stream transitioned to Step " + (step.key + 1));
                                        } catch (err) {
                                          console.warn(err);
                                        }
                                      }}
                                      className={`px-2 py-1 rounded-lg text-[9px] font-black transition-all ${
                                        selectedRealClass.currentStep === step.key
                                          ? "bg-amber-400 text-slate-900 scale-105 shadow-sm"
                                          : "bg-white/10 text-white hover:bg-white/20"
                                      }`}
                                    >
                                      {step.label}
                                    </button>
                                  ))}
                                </div>

                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                  <Input
                                    placeholder="Enter chalkboard instant banner text..."
                                    value={selectedRealClass.boardNotes || ""}
                                    onChange={async (e) => {
                                      try {
                                        await updateDocument("live_classes", selectedRealClass.id, {
                                          boardNotes: e.target.value
                                        });
                                      } catch (err) {
                                        console.warn(err);
                                      }
                                    }}
                                    className="h-7 text-[10px] w-48 rounded-lg bg-white/10 text-white border-white/10 py-0 focus:outline-none"
                                  />
                                  <span className="text-[9px] font-black text-rose-450 uppercase animate-pulse flex items-center gap-1 shrink-0">
                                    🔴 BROADCASTER
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-1">
                                  <span className="h-1.5 w-1.5 rounded-full bg-red-650 animate-ping"></span>
                                  <span className="text-[10px] text-white font-black uppercase">LIVE STAGING BROADCAST VIEW</span>
                                </div>
                                <span className="text-[9.5px] text-[#fbbf24] font-black">
                                  {selectedRealClass.boardNotes ? `📢 Board: "${selectedRealClass.boardNotes}"` : "Enjoy watching the active chalkboard lessons!"}
                                </span>
                              </div>
                            )}
                          </div>

                        </div>
                      ) : (
                        /* ============== CASE B: THE OFFLINE BROADCAST STANDBY PORTAL ============== */
                        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 flex flex-col justify-between p-6 md:p-8 min-h-[340px] text-center select-none text-white animate-fade-in shadow-indigo-950/20">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                              <Video className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
                              <span className="font-extrabold text-[9px] uppercase tracking-wider text-slate-200">Broadcast Manager Portal</span>
                            </div>
                            <Badge className="bg-indigo-950/40 text-indigo-300 border border-indigo-500/20 font-bold text-[8px] tracking-wide px-2 py-0.5 border-none">
                              Online Standby
                            </Badge>
                          </div>

                          <div className="flex-grow flex flex-col items-center justify-center space-y-4 max-w-md mx-auto my-auto py-2">
                            <span className="text-5xl animate-bounce" style={{ animationDuration: '3s' }}>🏫🇸🇿✨</span>
                            <div className="space-y-1">
                              <h5 className="font-black text-white text-[13px] tracking-tight">Active Distance Classroom Monitor</h5>
                              <p className="text-[10.5px] text-slate-300 font-semibold leading-relaxed">
                                No student classrooms are broadcast live right now. Click below to host an immediate classroom chalkboard session with drawing features, or announce a scheduled ECD timeframe to parent-coaches!
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2 justify-center pt-1.5">
                              <Button
                                onClick={() => {
                                  setNewBroadcastTeacher(user?.name || (user?.email ? user.email.split("@")[0] : "Teacher Guest"));
                                  setNewBroadcastTitle("Interactive Alphabets & Color Play");
                                  setBookingMode("instant");
                                  setBroadcastSetupOpen(true);
                                }}
                                className="bg-indigo-600 hover:bg-indigo-750 text-white font-black text-[11px] rounded-xl h-8 px-4 border-none shadow-md"
                              >
                                🔴 Go Live Now
                              </Button>
                              <Button
                                onClick={() => {
                                  setNewBroadcastTeacher(user?.name || (user?.email ? user.email.split("@")[0] : "Teacher Guest"));
                                  setNewBroadcastTitle("Traditional Telling & Counting Plays");
                                  setBookingMode("scheduled");
                                  setBroadcastSetupOpen(true);
                                }}
                                variant="outline"
                                className="border-white/20 hover:bg-white/10 text-white font-bold text-[11px] rounded-xl h-8 px-4"
                              >
                                📅 Register Time Slot
                              </Button>
                            </div>
                          </div>

                          <div className="text-[9px] text-indigo-200 font-bold border-t border-white/5 pt-2 flex items-center justify-center gap-1.5 leading-none">
                            ⚡ Low latency real-time brush coordinates, chalkboard quizzes, and Parent-Educator comments.
                          </div>
                        </div>
                      )}

                      {/* Lesson Milestones Timeline Map */}
                      <div className="bg-slate-100/50 p-3 rounded-2xl border border-slate-200">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-2 sm:text-left text-center">Lesson Progress Phases</span>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 relative">
                          {(() => {
                            const listMilestones = [
                              { label: "Greetings", time: 0 },
                              { label: "Chalkboard", time: 30 },
                              { label: "Quiz Poll", time: 60 },
                              { label: "Wrap-up", time: 90 }
                            ];

                            const stepIndex = (currentRealClassId !== null && selectedRealClass)
                              ? (selectedRealClass.currentStep ?? 0)
                              : 0;

                            return listMilestones.map((st, sidx) => {
                              const isPastOrActive = stepIndex >= sidx;
                              const isActive = stepIndex === sidx;
                              return (
                                <div key={sidx} className={`flex items-center gap-2 transition-all p-1 rounded-xl w-full sm:w-auto ${isActive ? 'bg-white shadow-sm border border-slate-200/50' : ''}`}>
                                  <div className={`h-6 w-6 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 border ${
                                    isActive ? 'bg-indigo-600 text-white border-indigo-400 animate-pulse' : isPastOrActive ? 'bg-indigo-50 text-indigo-750 border-indigo-100' : 'bg-slate-200 text-slate-405 border-transparent'
                                  }`}>
                                    {sidx + 1}
                                  </div>
                                  <div className="text-left leading-none min-w-0">
                                    <p className={`font-extrabold text-[10px] leading-none ${isActive ? 'text-indigo-800' : isPastOrActive ? 'text-slate-800' : 'text-slate-400'}`}>{st.label}</p>
                                    <span className="text-[8px] opacity-60 font-medium font-sans">ECD Phase {sidx + 1}</span>
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>

                    </div>

                    {/* RIGHT COLUMN: COLLABORATIVE PANEL TAB GRID (5/12 cols) */}
                    <div className="md:col-span-4 flex flex-col justify-between border border-slate-200 rounded-3xl overflow-hidden bg-slate-50/20 h-[420px]">
                      
                      {/* Sidebar navigation tabs */}
                      <div className="bg-slate-100 p-1 border-b flex sm:flex-row flex-col gap-1">
                        {[
                          { id: "chat", label: "Comments", icon: <MessageSquare className="h-3.5 w-3.5" /> },
                          { id: "vocab", label: "Vocabulary", icon: <BookOpenText className="h-3.5 w-3.5" /> },
                          { id: "notes", label: "Handouts", icon: <FileText className="h-3.5 w-3.5" /> }
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setLiveClassActiveTab(tab.id as any)}
                            className={`flex items-center justify-center gap-1.5 flex-1 py-1.5 rounded-xl text-[10px] font-extrabold transition-all border ${
                              liveClassActiveTab === tab.id 
                                ? "bg-white text-indigo-700 shadow-sm border-indigo-100 font-black" 
                                : "text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-50"
                            }`}
                          >
                            {tab.icon}
                            <span>{tab.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Dynamic Panel scroll area */}
                      <div className="p-4 overflow-y-auto flex-grow h-[260px] text-xs font-semibold text-slate-700">
                        
                        {/* TAB 1: LIVE CHAT */}
                        {liveClassActiveTab === "chat" && (
                          <div className="space-y-3">
                            <div className="bg-indigo-50 border border-indigo-100 p-2 rounded-xl text-[10px] text-indigo-800 font-semibold mb-2 leading-relaxed">
                              💡 <strong>{currentRealClassId !== null ? "Connected to Cloud Database:" : "Simulated Live Integration:"}</strong> Chat with your peers in real-time as a Parent Partner!
                            </div>
                            
                            <div className="space-y-2.5">
                              {(() => {
                                if (currentRealClassId !== null && selectedRealClass) {
                                  // RENDER GENUINE REALTIME CHATS FROM DATABASE
                                  const classChats = realLiveChats.filter(c => c.classId === currentRealClassId);
                                  const activeMap = [
                                    { user: "👑 Class Moderator", message: `Sanibonani! Welcome to ${selectedRealClass.teacher}'s live classroom board. Type notes below and follow the chalkboard!`, timestamp: "Just now", isSystem: true },
                                    ...classChats.map(c => ({ user: c.user, message: c.message, timestamp: c.timestamp || "Active", isSystem: false }))
                                  ];
                                  return activeMap.map((msg, i) => (
                                    <div 
                                      key={i} 
                                      className={`p-2.5 rounded-2xl max-w-[90%] space-y-0.5 ${
                                        msg.isSystem 
                                          ? "bg-slate-100 text-slate-700 mx-auto w-full text-center text-[10px] leading-snug rounded-xl border border-dashed border-slate-300"
                                          : msg.user.startsWith("You") || msg.user === (user?.name || (user?.email ? user.email.split('@')[0] : "Home Coach"))
                                          ? "bg-indigo-600 text-white ml-auto rounded-tr-none shadow-sm"
                                          : msg.user.toLowerCase().includes("teacher") || msg.user.toLowerCase().includes("educator") || msg.user === selectedRealClass.teacher
                                          ? "bg-amber-50/70 border border-amber-100 text-amber-900 rounded-tl-none shadow-sm"
                                          : "bg-white border border-slate-150 text-slate-800 rounded-tl-none shadow-sm"
                                      }`}
                                    >
                                      {!msg.isSystem && (
                                        <div className="flex justify-between items-center text-[9px] font-extrabold mb-0.5">
                                          <span className={msg.user.startsWith("You") || msg.user === (user?.name || (user?.email ? user.email.split('@')[0] : "Home Coach")) ? "text-indigo-200" : (msg.user.toLowerCase().includes("teacher") || msg.user === selectedRealClass.teacher) ? "text-amber-800" : "text-indigo-650"}>{msg.user}</span>
                                          <span className="opacity-60 text-[8px] font-medium">{msg.timestamp}</span>
                                        </div>
                                      )}
                                      <p className="leading-relaxed font-semibold text-[11px]">{msg.message}</p>
                                    </div>
                                  ));
                                } else {
                                  // RENDER GENUINE GENERAL LOBBY CHATS FROM DATABASE
                                  const classChats = realLiveChats.filter(c => c.classId === "general_lobby");
                                  const activeMap = [
                                    { user: "👑 Standby Moderator", message: `Welcome to the Distance Early Childhood lobby! Write parent tips below to collaborate while awaiting a live host broadcast.`, timestamp: "Just now", isSystem: true },
                                    ...classChats.map(c => ({ user: c.user, message: c.message, timestamp: c.timestamp || "Active", isSystem: false }))
                                  ];
                                  return activeMap.map((msg, i) => (
                                    <div 
                                      key={i} 
                                      className={`p-2.5 rounded-2xl max-w-[90%] space-y-0.5 ${
                                        msg.isSystem 
                                          ? "bg-slate-100 text-slate-700 mx-auto w-full text-center text-[10px] leading-snug rounded-xl border border-dashed border-slate-300"
                                          : msg.user.startsWith("You") || msg.user === (user?.name || (user?.email ? user.email.split('@')[0] : "Home Coach"))
                                          ? "bg-indigo-600 text-white ml-auto rounded-tr-none shadow-sm"
                                          : msg.user.toLowerCase().includes("teacher") || msg.user.toLowerCase().includes("educator")
                                          ? "bg-amber-50/70 border border-amber-100 text-amber-900 rounded-tl-none shadow-sm"
                                          : "bg-white border border-slate-150 text-slate-800 rounded-tl-none shadow-sm"
                                      }`}
                                    >
                                      {!msg.isSystem && (
                                        <div className="flex justify-between items-center text-[9px] font-extrabold mb-0.5">
                                          <span className={msg.user.startsWith("You") || msg.user === (user?.name || (user?.email ? user.email.split('@')[0] : "Home Coach")) ? "text-indigo-200" : msg.user.toLowerCase().includes("teacher") ? "text-amber-800" : "text-indigo-650"}>{msg.user}</span>
                                          <span className="opacity-60 text-[8px] font-medium">{msg.timestamp}</span>
                                        </div>
                                      )}
                                      <p className="leading-relaxed font-semibold text-[11px]">{msg.message}</p>
                                    </div>
                                  ));
                                }
                              })()}
                            </div>
                          </div>
                        )}

                        {/* TAB 2: VOCABULARY TERMS */}
                        {liveClassActiveTab === "vocab" && (
                          <div className="space-y-4">
                            <div className="text-[10px] text-slate-400 font-extrabold uppercase">Standard aligned Vocabulary items</div>
                            <div className="grid grid-cols-1 gap-2">
                              {(() => {
                                const list = (currentRealClassId !== null && selectedRealClass)
                                  ? (selectedRealClass.vocab || "Ubuntu (Cooperation), Siyingilizi (Circle), Kakuhle (Well)").split(",").map((s: string) => s.trim())
                                  : ["Sawubona (Greetings/Hello)", "Zulu (Heaven/Sky)", "Siyingilizi (Circle/Round)", "Sibili (Two/Numbers)", "Kuthula (Peace)"];

                                return list.map((v: string, i: number) => (
                                  <div key={i} className="bg-white border border-slate-150 p-2.5 rounded-xl flex items-center justify-between hover:shadow-sm transition-all duration-300">
                                    <div className="space-y-0.5 min-w-0">
                                      <h6 className="font-extrabold text-slate-900 text-[11px]">{v.split("(")[0]?.trim() || v}</h6>
                                      <p className="text-[10px] text-slate-500 font-semibold">{v.includes("(") ? `(${v.split("(")[1] || ""}` : "Interactive word token"}</p>
                                    </div>
                                    <Button 
                                      onClick={() => {
                                        try {
                                          const cleanWord = v.split("(")[0]?.trim() || v;
                                          const utterance = new SpeechSynthesisUtterance(cleanWord);
                                          utterance.lang = "en-ZA"; 
                                          window.speechSynthesis.speak(utterance);
                                          toast.info(`Speaking: "${cleanWord}" (Swazi English voice)`);
                                        } catch {
                                          toast.error("Audio speaking framework error");
                                        }
                                      }}
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 shrink-0"
                                    >
                                      <Volume2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                ));
                              })()}
                            </div>
                            <div className="bg-slate-100/50 p-3 rounded-2xl border border-slate-200 text-[10px] text-slate-500 font-semibold leading-relaxed">
                              📎 <strong>Preschool Milestones guide:</strong> Learning these terms daily expands phoneme awareness by 32% (aligned with regional Swazi curriculum standard).
                            </div>
                          </div>
                        )}

                        {/* TAB 3: HANDOUTS & FILES */}
                        {liveClassActiveTab === "notes" && (
                          <div className="space-y-3">
                            <div className="text-[10px] text-slate-400 font-extrabold uppercase">Teacher Handout Files & Study Guides</div>
                            <div className="bg-white border border-slate-150 p-3 rounded-2xl space-y-3 hover:shadow-sm transition-shadow">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">PDF</div>
                                <div className="min-w-0">
                                  <p className="font-extrabold text-slate-800 text-[11px] truncate">
                                    {((currentRealClassId !== null && selectedRealClass) ? selectedRealClass.title.split(" ")[0] : "ECD_Core")}_Weekly_Homework_Booklet.pdf
                                  </p>
                                  <p className="text-[9px] text-slate-400 font-semibold">18 Pages | 2.4 MB</p>
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                onClick={() => toast.success("Study Booklet downloaded inside sandbox workspace!")}
                                className="w-full text-[10px] font-black h-8 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 rounded-xl"
                              >
                                Download Weekly Booklet PDF
                              </Button>
                            </div>

                            <div className="bg-slate-100/50 p-3 rounded-2xl border border-slate-200 p-3 rounded-2xl space-y-2">
                              <span className="text-[9px] font-bold text-slate-400 uppercase">Acreditation Criteria</span>
                              <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">
                                Both parents and educators obtain joint credits by remaining active for more than 40 seconds on the stream or posting a tip to the shared board.
                              </p>
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Chat textbox input at bottom (only visible on chat tab) */}
                      {liveClassActiveTab === "chat" ? (
                        <form 
                          onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.currentTarget;
                            const input = form.elements.namedItem("liveChatInput") as HTMLInputElement;
                            const val = input.value;
                            if (!val.trim()) return;
                            handleSendLiveClassChat(val);
                            form.reset();
                          }} 
                          className="flex border-t bg-white focus-within:ring-2 focus-within:ring-indigo-500/20"
                        >
                          <input
                            name="liveChatInput"
                            placeholder="Comment or reply to session notes..." 
                            autoComplete="off"
                            className="flex-1 px-4 py-2 text-xs focus:outline-none placeholder:text-slate-400 bg-white font-semibold text-slate-800"
                          />
                          <Button type="submit" size="sm" className="h-9 w-9 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white p-0 shrink-0">
                            <Send className="h-4 w-4" />
                          </Button>
                        </form>
                      ) : (
                        <div className="p-3 border-t bg-white text-center text-[10px] text-slate-400 font-semibold">
                          Switch to Comments tab to type messages.
                        </div>
                      )}
                    </div>

                  </div>

                  {/* BOTTOM HALF SECTION: SHARED PARENT COLLABORATIVE NOTES BOARD */}
                  <div className="border-t border-dashed border-slate-200 pt-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h5 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 animate-pulse" style={{ animationDuration: '3s' }}>
                          <Users className="h-4 w-4 text-emerald-600" />
                          Parent & Educator Session Collaboration Notes
                        </h5>
                        <p className="text-[11px] text-slate-400 font-semibold">Post helpful home notes, learnings, or ask for cooperative lessons from other families.</p>
                      </div>
                      
                      {/* Note creator action button overlay triggers modal form directly */}
                      <div className="flex items-center gap-2">
                        <Input 
                          placeholder="Tip: e.g., 'We used clay models!'" 
                          value={liveClassNewNote}
                          onChange={(e) => setLiveClassNewNote(e.target.value)}
                          className="rounded-xl h-9 text-xs border-slate-200 bg-white max-w-[200px] font-semibold"
                        />
                        <Button 
                          onClick={async () => {
                            if (!liveClassNewNote.trim()) {
                              toast.error("Please type your collaboration note first!");
                              return;
                            }
                            
                            const authorName = user?.name || (user?.email ? user.email.split('@')[0] : "Home Coach");
                            const timestampText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " (Active)";
                            
                            // Real Firestore persistence
                            try {
                              await createDocument("dashboard_notes", null, {
                                author: authorName,
                                note: liveClassNewNote.trim(),
                                votes: 1,
                                timestamp: timestampText,
                                createdAt: new Date().toISOString(),
                                userId: user?.uid || "anonymous_session"
                              });
                              setLiveClassNewNote("");
                              toast.success("Home note pinned real-time to active cloud Firestore database!");
                            } catch (err: any) {
                              console.warn("Firestore error persisting notes:", err);
                              toast.error("Could not send tip. " + err.message);
                            }
                          }}
                          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 hover:shadow-md transition-all text-white font-black text-xs h-9 px-4 flex items-center gap-1 shrink-0"
                        >
                          <Plus className="h-3.5 w-3.5" /> Pin note
                        </Button>
                      </div>
                    </div>

                    {/* Corkboard Grid layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {allNotes.map((note) => (
                        <div key={note.id} className="bg-amber-50/50 p-4 border border-amber-200/50 rounded-2xl relative shadow-sm hover:shadow-md duration-300 transition-all flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-black text-slate-400">
                              <span className="text-emerald-700 flex items-center gap-1">📌 {note.author}</span>
                              <span>{note.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-705 font-bold leading-relaxed">"{note.note}"</p>
                          </div>
                          
                          <div className="pt-3 border-t border-amber-200/40 mt-3 flex justify-between items-center">
                            <span className="text-[10px] text-slate-400 font-bold">
                              {note.isDb ? "🟢 Cloud Verified" : "Standard Approved tip"}
                            </span>
                            <Button 
                              variant="ghost" 
                              onClick={async () => {
                                try {
                                  await updateDocument("dashboard_notes", note.id, {
                                    votes: (note.votes || 0) + 1
                                  });
                                  toast.success("Upvoted community collaboration tip in Firestore!");
                                } catch (err) {
                                  toast.error("Could not complete database upvote.");
                                }
                              }}
                              className="h-6 px-1.5 rounded-lg text-emerald-800 hover:bg-emerald-50 hover:text-emerald-950 font-extrabold text-[10px] flex items-center gap-1.5 shrink-0"
                            >
                              <ThumbsUp className="h-3 w-3" />
                              <span>{note.votes} Upvotes</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>

                </div>
              )}

              {/* MODULE 7: MUSIC & ARTS */}
              {exploreId === "music" && (
                <div className="space-y-6 text-center">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-pink-600">Web Audio mini synthetic instrument</span>
                    <h4 className="text-lg font-black text-slate-800"> ECD Virtual Rainbow Piano Keyboard</h4>
                    <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
                      Tap or click on the colorful keys below to play organic tones! Introduce young minds to musical frequency.
                    </p>
                  </div>

                  {/* Playable Piano Keyboard */}
                  <div className="flex gap-1 justify-center py-6 bg-slate-50 rounded-2xl border max-w-md mx-auto relative shadow-inner">
                    {/* Rainbow piano keys */}
                    {[
                      { note: "C4 (Do)", freq: 261.63, bg: "bg-red-500 hover:bg-red-400 text-white" },
                      { note: "D4 (Re)", freq: 293.66, bg: "bg-orange-500 hover:bg-orange-400 text-white" },
                      { note: "E4 (Mi)", freq: 329.63, bg: "bg-amber-500 hover:bg-amber-400 text-white" },
                      { note: "F4 (Fa)", freq: 349.23, bg: "bg-green-500 hover:bg-green-400 text-white" },
                      { note: "G4 (Sol)", freq: 392.00, bg: "bg-blue-500 hover:bg-blue-400 text-white" },
                      { note: "A4 (La)", freq: 440.00, bg: "bg-indigo-500 hover:bg-indigo-400 text-white" },
                      { note: "B4 (Ti)", freq: 493.88, bg: "bg-purple-500 hover:bg-purple-400 text-white" },
                    ].map((key, i) => (
                      <button
                        key={i}
                        onClick={() => playSynthTone(key.freq)}
                        className={`w-12 h-36 rounded-md shadow-md pt-24 font-extrabold text-[10px] flex flex-col justify-end pb-3 transition-transform active:translate-y-1 select-none ${key.bg}`}
                        aria-label={`Play note ${key.note}`}
                      >
                        <Volume2 className="h-3 w-3 mx-auto mb-1 opacity-70" />
                        <span>{key.note.split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-400 font-bold">
                    *Tones are synthesized dynamically using the Web Audio API without downloading bulky static MP3 sound bytes.
                  </p>
                </div>
              )}

              {/* General CTA to return */}
              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <Button 
                  onClick={() => setExploreId(null)}
                  className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 h-10"
                >
                  Return to Dashboard
                </Button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

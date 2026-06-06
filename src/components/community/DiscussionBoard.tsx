import React, { useState, useEffect } from "react";
import { 
  fetchCollection, 
  createDocument, 
  updateDocument, 
  deleteDocument,
  subscribeToCollection 
} from "@/lib/firestoreUtils";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { 
  MessageSquare, 
  Heart, 
  Plus, 
  ChevronLeft, 
  Search, 
  Trash2, 
  User, 
  Clock, 
  Lock,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { orderBy, where, query } from "firebase/firestore";

const CATEGORIES = [
  "All",
  "General",
  "ECD & Curriculum",
  "Admissions & Fees",
  "Parenting & Nutrition",
  "Special Needs",
  "Events & Extracurriculars"
];

interface Topic {
  id: string;
  title: string;
  content: string;
  category: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
  likes: string[];
  repliesCount: number;
}

interface Reply {
  id: string;
  topicId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
}

export function DiscussionBoard() {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  
  // Filtering and Searching
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Create form states
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [newContent, setNewContent] = useState("");
  
  // Reply form states
  const [newReply, setNewReply] = useState("");

  // Real-time subscription to discussion topics
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCollection(
      "discussion_topics",
      (fetchedTopics: any[]) => {
        // Sort manually by date-time descending
        const sorted = [...fetchedTopics].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTopics(sorted as Topic[]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Real-time subscription to replies for the selected topic
  useEffect(() => {
    if (!selectedTopic) {
      setReplies([]);
      return;
    }

    setRepliesLoading(true);
    const unsubscribe = subscribeToCollection(
      "discussion_replies",
      (fetchedReplies: any[]) => {
        // Filter those belonging to this topic and sort by older-first (chronological thread)
        const topicReplies = fetchedReplies
          .filter(reply => reply.topicId === selectedTopic.id)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setReplies(topicReplies as Reply[]);
        setRepliesLoading(false);
      }
    );

    return () => unsubscribe();
  }, [selectedTopic]);

  // Handle Like/Unlike
  const handleLike = async (topic: Topic, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please log in to like threads.");
      return;
    }

    const hasLiked = topic.likes?.includes(user.uid) || false;
    let updatedLikes = topic.likes || [];

    if (hasLiked) {
      updatedLikes = updatedLikes.filter(uid => uid !== user.uid);
    } else {
      updatedLikes = [...updatedLikes, user.uid];
    }

    try {
      await updateDocument("discussion_topics", topic.id, {
        likes: updatedLikes
      });
      toast.success(hasLiked ? "Post unliked" : "Post liked!");
    } catch {
      toast.error("Failed to update like status.");
    }
  };

  // Create Thread
  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to start a discussion.");
      return;
    }
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const topicData = {
        title: newTitle.trim(),
        content: newContent.trim(),
        category: newCategory,
        authorId: user.uid,
        authorName: user.name || user.email || "Anonymous Parent",
        authorRole: user.role,
        createdAt: new Date().toISOString(),
        likes: [],
        repliesCount: 0
      };

      await createDocument("discussion_topics", null, topicData);
      toast.success("Discussion started successfully!");
      setNewTitle("");
      setNewContent("");
      setIsCreating(false);
    } catch (err) {
      toast.error("Failed to post discussion. Verify permissions.");
    }
  };

  // Add Comment/Reply
  const handleCreateReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to write a reply.");
      return;
    }
    if (!newReply.trim()) return;
    if (!selectedTopic) return;

    try {
      const replyData = {
        topicId: selectedTopic.id,
        content: newReply.trim(),
        authorId: user.uid,
        authorName: user.name || user.email || "Anonymous Parent",
        authorRole: user.role,
        createdAt: new Date().toISOString()
      };

      await createDocument("discussion_replies", null, replyData);
      
      // Update replies count on topic
      const currentRepliesCount = selectedTopic.repliesCount || 0;
      await updateDocument("discussion_topics", selectedTopic.id, {
        repliesCount: currentRepliesCount + 1
      });

      // Optimistically update selectedTopic state
      setSelectedTopic(prev => prev ? { ...prev, repliesCount: currentRepliesCount + 1 } : null);

      toast.success("Comment posted!");
      setNewReply("");
    } catch (err) {
      toast.error("Failed to add comment.");
    }
  };

  // Delete Topic
  const handleDeleteTopic = async (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this discussion thread?")) return;

    try {
      await deleteDocument("discussion_topics", topicId);
      toast.success("Thread deleted.");
      if (selectedTopic?.id === topicId) {
        setSelectedTopic(null);
      }
    } catch {
      toast.error("Failed to delete thread.");
    }
  };

  // Delete Reply
  const handleDeleteReply = async (replyId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    if (!selectedTopic) return;

    try {
      await deleteDocument("discussion_replies", replyId);
      
      // Decrement repliesCount
      const currentRepliesCount = selectedTopic.repliesCount || 0;
      const newCount = Math.max(0, currentRepliesCount - 1);
      await updateDocument("discussion_topics", selectedTopic.id, {
        repliesCount: newCount
      });

      // Optimistically update selectedTopic state
      setSelectedTopic(prev => prev ? { ...prev, repliesCount: newCount } : null);

      toast.success("Comment removed.");
    } catch {
      toast.error("Failed to delete comment.");
    }
  };

  // Helpers to render badges
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SuperAdmin":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Super Admin</Badge>;
      case "SchoolAdmin":
      case "school_owner":
      case "admin":
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">School Admin</Badge>;
      case "Parent":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Parent</Badge>;
      default:
        return <Badge variant="outline" className="text-slate-600">Community Member</Badge>;
    }
  };

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case "ECD & Curriculum": return "bg-purple-50 text-purple-700 border-purple-100";
      case "Admissions & Fees": return "bg-blue-50 text-blue-700 border-blue-100";
      case "Parenting & Nutrition": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Special Needs": return "bg-rose-50 text-rose-700 border-rose-100";
      case "Events & Extracurriculars": return "bg-amber-50 text-amber-700 border-amber-100";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // Filter topics
  const filteredTopics = topics.filter(topic => {
    const matchesCategory = activeCategory === "All" || topic.category === activeCategory;
    const matchesSearch = 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {selectedTopic ? (
        // Thread Detail View
        <div className="space-y-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedTopic(null)} 
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 rounded-xl"
          >
            <ChevronLeft className="h-4 w-4" /> Back to discussion boards
          </Button>

          {/* Original Post */}
          <Card className="rounded-2xl border-slate-200 overflow-hidden shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700">{selectedTopic.authorName}</span>
                      {getRoleBadge(selectedTopic.authorRole)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(selectedTopic.createdAt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getCategoryBadgeColor(selectedTopic.category)} border font-semibold`}>
                    {selectedTopic.category}
                  </Badge>
                  {((user && selectedTopic.authorId === user.uid) || (user && user.role === "SuperAdmin")) && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => handleDeleteTopic(selectedTopic.id, e)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600 h-8 w-8 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                {selectedTopic.title}
              </h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-base font-medium">
                {selectedTopic.content}
              </p>

              {/* Like bar */}
              <div className="flex items-center gap-4 mt-8 pt-4 border-t border-slate-100">
                <Button 
                  variant="ghost" 
                  onClick={(e) => handleLike(selectedTopic, e)}
                  className={`flex items-center gap-2 rounded-xl h-9 px-3 ${
                    user && selectedTopic.likes?.includes(user.uid) 
                      ? "text-rose-600 bg-rose-50" 
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${user && selectedTopic.likes?.includes(user.uid) ? "fill-rose-500" : ""}`} />
                  <span className="font-bold text-sm">{(selectedTopic.likes || []).length} Likes</span>
                </Button>
                <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                  <MessageSquare className="h-4 w-4" />
                  <span>{selectedTopic.repliesCount || 0} Comments</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comment Stream */}
          <div className="space-y-4">
            <h3 className="font-black text-lg text-slate-900 tracking-tight flex items-center gap-2 pl-1">
              Comments ({replies.length})
            </h3>

            {repliesLoading ? (
              <div className="text-center py-6 text-slate-400">Loading replies...</div>
            ) : replies.length === 0 ? (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center text-slate-500 font-medium">
                No comments yet. Start the conversation support by posting a comment below!
              </div>
            ) : (
              <div className="space-y-4">
                {replies.map((reply) => (
                  <Card key={reply.id} className="rounded-xl border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-700">{reply.authorName}</span>
                              {getRoleBadge(reply.authorRole)}
                            </div>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" />
                              {new Date(reply.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>

                        {((user && reply.authorId === user.uid) || (user && user.role === "SuperAdmin")) && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteReply(reply.id)}
                            className="text-red-500 hover:bg-red-50 hover:text-red-600 h-7 w-7 rounded-lg"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm ml-10 leading-relaxed font-medium">
                        {reply.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Add Reply Box */}
          <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden pt-1">
            <CardContent className="p-4">
              {user ? (
                <form onSubmit={handleCreateReply} className="space-y-3">
                  <span className="text-sm font-bold text-slate-700">Write a comment:</span>
                  <Textarea 
                    placeholder="Provide constructive feedback or advice here..." 
                    className="min-h-[100px] resize-none rounded-xl"
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    maxLength={1000}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={!newReply.trim()} className="rounded-xl px-5">
                      Submit Comment
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-slate-600">
                  <Lock className="h-8 w-8 text-slate-400 mb-2" />
                  <p className="font-bold text-sm">Sign in to join the discussion</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
                    Only authorized community parents and teachers can submit replies or share feedback on threads.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        // Thread Catalog / List View
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search topics, author, content..." 
                className="pl-10 h-11 rounded-2xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              {/* Category Filter */}
              <div className="flex items-center gap-2 text-slate-500 font-bold text-xs shrink-0 pl-1">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <span>Filter:</span>
              </div>
              <select 
                value={activeCategory} 
                onChange={(e) => setActiveCategory(e.target.value)}
                className="h-11 rounded-2xl border border-slate-200 px-3 text-sm font-semibold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {user ? (
                <Button 
                  onClick={() => setIsCreating(true)} 
                  className="rounded-2xl h-11 font-bold flex items-center gap-2 shadow-sm shrink-0"
                >
                  <Plus className="h-4 w-4" /> Start Thread
                </Button>
              ) : (
                <div className="text-xs font-semibold text-slate-500 px-4 py-2 border border-dashed border-slate-200 rounded-xl bg-slate-50 flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5" /> Sign in to post
                </div>
              )}
            </div>
          </div>

          {/* New Thread Form */}
          {isCreating && (
            <Card className="rounded-3xl border-slate-200 max-w-4xl shadow-md border-2 border-blue-500/10">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-black text-slate-900">Start a New Discussion Board</CardTitle>
                <CardDescription>Share preschool related inquiries, ECD learnings, or seek feedback from other Eswatini parents.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleCreateTopic} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700">Topic Title</label>
                      <Input 
                        placeholder="e.g., Best curriculum standard for 3-year-olds in Mbabane" 
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                        className="rounded-xl"
                        maxLength={150}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700">Category Tag</label>
                      <select 
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm font-semibold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        {CATEGORIES.filter(c => c !== "All").map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Thread Details / Inquiry Context</label>
                    <Textarea 
                      placeholder="Outline your questions, suggestions, or concerns in detail..." 
                      className="min-h-[160px] resize-none rounded-xl"
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      onClick={() => setIsCreating(false)} 
                      className="rounded-xl font-semibold"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="rounded-xl px-6 font-bold"
                    >
                      Publish Thread
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Topics Feed */}
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading catalog...</div>
          ) : filteredTopics.length === 0 ? (
            <div className="bg-white/80 border border-slate-200/50 rounded-3xl p-12 text-center text-slate-500 font-medium shadow-sm">
              <MessageSquare className="h-10 w-10 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-bold">No discussions matching your query</p>
              <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                Be the first to create a topic! Clear your filters or hit 'Start Thread' above to initiate an ECD conversation.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTopics.map((topic) => {
                const alreadyLiked = user && topic.likes?.includes(user.uid);
                return (
                  <Card 
                    key={topic.id} 
                    onClick={() => setSelectedTopic(topic)}
                    className="rounded-2xl border-slate-200 hover:border-blue-500/30 hover:shadow-md cursor-pointer transition-all group"
                  >
                    <CardContent className="p-5 flex flex-col md:flex-row items-start justify-between gap-4">
                      
                      {/* Left: Metadata & summary */}
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={`${getCategoryBadgeColor(topic.category)} border text-[11px] font-semibold py-0.5`}>
                            {topic.category}
                          </Badge>
                          <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(topic.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight leading-snug">
                          {topic.title}
                        </h3>

                        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed font-semibold">
                          {topic.content}
                        </p>

                        <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500 font-semibold">
                          <span className="bg-slate-100 px-2.5 py-1 rounded-full text-slate-700">Posted by {topic.authorName}</span>
                          {getRoleBadge(topic.authorRole)}
                        </div>
                      </div>

                      {/* Right: Actions and Counters */}
                      <div className="flex md:flex-col items-center justify-between md:justify-center gap-2 shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                        <div className="flex items-center gap-3">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => handleLike(topic, e)}
                            className={`flex items-center gap-1 rounded-xl h-8 px-2.5 ${
                              alreadyLiked ? "text-rose-600 bg-rose-50" : "text-slate-500 hover:bg-slate-50"
                            }`}
                          >
                            <Heart className={`h-3.5 w-3.5 ${alreadyLiked ? "fill-rose-500" : ""}`} />
                            <span className="font-bold text-xs">{(topic.likes || []).length}</span>
                          </Button>

                          <div className="flex items-center gap-1.5 h-8 px-2.5 text-slate-500 font-bold text-xs bg-slate-50 rounded-xl">
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>{topic.repliesCount || 0}</span>
                          </div>
                        </div>

                        {((user && topic.authorId === user.uid) || (user && user.role === "SuperAdmin")) && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => handleDeleteTopic(topic.id, e)}
                            className="text-red-500 hover:bg-red-50 hover:text-red-600 h-8 w-8 rounded-lg md:self-end"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

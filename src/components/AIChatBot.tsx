import React, { useState, useRef, useEffect } from "react";
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2, 
  Bot, 
  User, 
  Sparkles,
  MinusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { chatWithAI, ChatMessage } from "@/services/geminiService";

interface AIChatBotProps {
  schoolName?: string;
  context?: any;
}

export function AIChatBot({ schoolName = "Preschools Eswatini", context }: AIChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Hi! I'm the ${schoolName} AI assistant. How can I help you today?` }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const response = await chatWithAI([...messages, userMessage], context);
    
    if (response.error) {
       setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } else {
       setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    }
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 z-50 group flex items-center justify-center p-0"
      >
        <MessageCircle className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
      </Button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 w-80 sm:w-96 z-50 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[500px]'}`}>
      <Card className="h-full flex flex-col shadow-2xl border-slate-200 overflow-hidden rounded-2xl">
        <CardHeader className="bg-blue-600 text-white p-4 flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Bot className="h-5 w-5" />
             </div>
             <div>
                <CardTitle className="text-sm font-bold">{schoolName} Assistant</CardTitle>
                <div className="flex items-center gap-1">
                   <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                   <p className="text-[10px] text-blue-100 font-medium">Online</p>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-1">
             <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-100 hover:text-white hover:bg-blue-500" onClick={() => setIsMinimized(!isMinimized)}>
                <MinusCircle className="h-4 w-4" />
             </Button>
             <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-100 hover:text-white hover:bg-blue-500" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
             </Button>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <>
            <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
               <div className="flex justify-center mb-4">
                  <span className="px-2 py-0.5 bg-white rounded-full text-[8px] font-black text-slate-400 border border-slate-100 shadow-sm uppercase tracking-tighter">
                    AI Powered Assistant
                  </span>
               </div>
               
               {messages.map((msg, i) => (
                 <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                       <div className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'}`}>
                          {msg.role === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                       </div>
                       <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                         msg.role === 'user' 
                           ? 'bg-blue-600 text-white rounded-tr-none' 
                           : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                       }`}>
                          {msg.text}
                       </div>
                    </div>
                 </div>
               ))}
               
               {loading && (
                 <div className="flex justify-start">
                    <div className="flex gap-2 max-w-[85%]">
                       <div className="h-6 w-6 rounded-lg bg-white text-slate-400 border border-slate-100 flex items-center justify-center shadow-sm">
                          <Bot className="h-3 w-3" />
                       </div>
                       <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                          <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                          <span className="text-[10px] text-slate-400 italic">Thinking...</span>
                       </div>
                    </div>
                 </div>
               )}
            </CardContent>

            <CardFooter className="p-3 bg-white border-t border-slate-100 shrink-0">
               <form onSubmit={handleSend} className="flex gap-2 w-full">
                  <Input 
                    placeholder="Ask a question..."
                    className="flex-1 rounded-xl border-slate-200 bg-slate-50 text-xs h-10 focus:bg-white"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="h-10 w-10 shrink-0 rounded-xl bg-blue-600 shadow-lg shadow-blue-100"
                    disabled={loading || !input.trim()}
                  >
                     <Send className="h-4 w-4" />
                  </Button>
               </form>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Plus, Menu, Sparkles, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AdvancedContextSettings } from "@/components/advanced-context-settings";
import { VoiceTextarea } from "@/components/voice-textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  _id: string;
  title: string;
  messages: Message[];
  systemPrompt: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to generate system prompt from context
const generateSystemPromptFromContext = (ctx: any): string => {
  const now = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  const currentDate = now.toLocaleDateString('en-US', dateOptions);
  const currentTime = now.toLocaleTimeString('en-US', timeOptions);
  const currentDateTime = `${currentDate} at ${currentTime}`;
  
  let prompt = `You are Alpha, the personal assistant of Rohit. Your purpose is to help Rohit plan, organize, and tackle everything in his life with the context provided below.

**CURRENT DATE & TIME:**
${currentDateTime}

**IMPORTANT:** Always consider the current date and time when:
- Planning schedules and timelines
- Calculating days/weeks until deadlines
- Suggesting what to do today/this week
- Estimating preparation time needed
- Prioritizing urgent vs non-urgent tasks

**Your Role:**
- Guide and plan everything ahead for Rohit
- Provide strategic advice considering all commitments
- Help prioritize tasks based on urgency and importance
- Be proactive, supportive, and motivating
- Always consider the full context AND current date/time when providing recommendations

---

`;

  if (ctx.generalMemory) {
    prompt += `**GENERAL MEMORY:**
${ctx.generalMemory}

---

`;
  }

  // Exams Section
  if (ctx.exams?.subjects || ctx.exams?.dates || ctx.exams?.preparationStatus || ctx.exams?.notes) {
    prompt += `**ARREAR EXAMS:**
`;
    if (ctx.exams.subjects) prompt += `Subjects: ${ctx.exams.subjects}\n`;
    if (ctx.exams.dates) prompt += `Exam Dates: ${ctx.exams.dates}\n`;
    if (ctx.exams.preparationStatus) prompt += `Preparation Status: ${ctx.exams.preparationStatus}\n`;
    if (ctx.exams.notes) prompt += `Notes: ${ctx.exams.notes}\n`;
    prompt += `\n---\n\n`;
  }

  // Stacia Work Section
  if (ctx.staciaWork?.currentProjects || ctx.staciaWork?.deadlines || ctx.staciaWork?.priorities || ctx.staciaWork?.notes) {
    prompt += `**STACIA WORK:**
`;
    if (ctx.staciaWork.currentProjects) prompt += `Current Projects: ${ctx.staciaWork.currentProjects}\n`;
    if (ctx.staciaWork.deadlines) prompt += `Deadlines: ${ctx.staciaWork.deadlines}\n`;
    if (ctx.staciaWork.priorities) prompt += `Priorities: ${ctx.staciaWork.priorities}\n`;
    if (ctx.staciaWork.notes) prompt += `Notes: ${ctx.staciaWork.notes}\n`;
    prompt += `\n---\n\n`;
  }

  // Other Work Section
  if (ctx.otherWork?.projects || ctx.otherWork?.deadlines || ctx.otherWork?.notes) {
    prompt += `**OTHER WORK COMMITMENTS:**
`;
    if (ctx.otherWork.projects) prompt += `Projects: ${ctx.otherWork.projects}\n`;
    if (ctx.otherWork.deadlines) prompt += `Deadlines: ${ctx.otherWork.deadlines}\n`;
    if (ctx.otherWork.notes) prompt += `Notes: ${ctx.otherWork.notes}\n`;
    prompt += `\n---\n\n`;
  }

  // Mockello Section
  if (ctx.mockello?.features || ctx.mockello?.deadlines || ctx.mockello?.status || ctx.mockello?.notes) {
    prompt += `**MOCKELLO STARTUP:**
`;
    if (ctx.mockello.features) prompt += `Features/Products: ${ctx.mockello.features}\n`;
    if (ctx.mockello.deadlines) prompt += `Deadlines: ${ctx.mockello.deadlines}\n`;
    if (ctx.mockello.status) prompt += `Current Status: ${ctx.mockello.status}\n`;
    if (ctx.mockello.notes) prompt += `Notes: ${ctx.mockello.notes}\n`;
    prompt += `\n---\n\n`;
  }

  // Hitroo Section
  if (ctx.hitroo?.features || ctx.hitroo?.deadlines || ctx.hitroo?.status || ctx.hitroo?.notes) {
    prompt += `**HITROO STARTUP:**
`;
    if (ctx.hitroo.features) prompt += `Features/Products: ${ctx.hitroo.features}\n`;
    if (ctx.hitroo.deadlines) prompt += `Deadlines: ${ctx.hitroo.deadlines}\n`;
    if (ctx.hitroo.status) prompt += `Current Status: ${ctx.hitroo.status}\n`;
    if (ctx.hitroo.notes) prompt += `Notes: ${ctx.hitroo.notes}\n`;
    prompt += `\n---\n\n`;
  }

  prompt += `Based on all the above context, provide strategic advice, actionable plans, and help Rohit manage his time effectively. Always consider his energy levels, deadlines, and long-term goals.`;

  return prompt;
};

const DEFAULT_SYSTEM_PROMPT = `You are Alpha, the personal assistant of Rohit. Your purpose is to help Rohit plan, organize, and tackle everything in his life with the context provided below.

**About Rohit:**
- Student managing multiple responsibilities
- Working on startups: Hitroo and Mockello
- Has products under development with deadlines to meet
- Works for Stacia and other clients
- Dealing with college deadlines and assignments
- Preparing for arrear exams that need to be cleared
- Needs guidance on when to approach faculties

**Your Role:**
- Guide and plan everything ahead for Rohit
- Help create actionable plans to clear arrear exams
- Advise on the best actions to take right now considering all context
- Help plan and tackle startup work (Hitroo, Mockello)
- Manage product deadlines and deliverables
- Balance work commitments (Stacia and others)
- Track college deadlines and assignments
- Strategize arrear exam preparation
- Advise on optimal timing to approach faculties
- Keep all context in mind when providing recommendations

**Your Approach:**
- Be proactive and strategic
- Prioritize tasks based on urgency and importance
- Provide clear, actionable steps
- Consider Rohit's energy and time constraints
- Help maintain work-life balance
- Be supportive and motivating

Always consider the full context of Rohit's situation when providing advice and planning.`;

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load conversations, context, and system prompt on mount
  useEffect(() => {
    const loadData = async () => {
      // Load context from MongoDB and generate system prompt
      try {
        const contextResponse = await fetch('/api/context');
        if (contextResponse.ok) {
          const contextData = await contextResponse.json();
          if (contextData.context) {
            // Save to localStorage
            localStorage.setItem('alpha-context', JSON.stringify(contextData.context));
            
            // Generate system prompt from context
            const generatedPrompt = generateSystemPromptFromContext(contextData.context);
            setSystemPrompt(generatedPrompt);
            localStorage.setItem('alpha-system-prompt', generatedPrompt);
            console.log('System prompt loaded from MongoDB context');
          } else {
            // Fallback to saved system prompt
            const savedPrompt = localStorage.getItem("alpha-system-prompt");
            if (savedPrompt) {
              setSystemPrompt(savedPrompt);
            }
          }
        } else {
          // Fallback to localStorage
          const savedPrompt = localStorage.getItem("alpha-system-prompt");
          if (savedPrompt) {
            setSystemPrompt(savedPrompt);
          }
        }
      } catch (error) {
        console.error('Failed to load context from server:', error);
        // Fallback to localStorage
        const savedPrompt = localStorage.getItem("alpha-system-prompt");
        if (savedPrompt) {
          setSystemPrompt(savedPrompt);
        }
      }

      // Load conversations from MongoDB
      try {
        const response = await fetch('/api/conversations');
        if (response.ok) {
          const data = await response.json();
          setConversations(data.conversations);
          
          // Also sync to localStorage
          localStorage.setItem('alpha-conversations', JSON.stringify(data.conversations));
        }
      } catch (error) {
        console.error('Failed to load conversations from server:', error);
        // Fallback to localStorage
        const localConversations = localStorage.getItem('alpha-conversations');
        if (localConversations) {
          setConversations(JSON.parse(localConversations));
        }
      }
    };

    loadData();
  }, []);

  // Save current conversation
  const saveConversation = async () => {
    if (messages.length === 0) return;

    const title = messages[0]?.content.slice(0, 50) || 'New Conversation';
    
    try {
      if (currentConversationId) {
        // Update existing conversation
        await fetch(`/api/conversations/${currentConversationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            messages,
            systemPrompt,
          }),
        });
      } else {
        // Create new conversation
        const response = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            messages,
            systemPrompt,
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setCurrentConversationId(data.conversation._id);
        }
      }
      
      // Reload conversations
      const response = await fetch('/api/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
        localStorage.setItem('alpha-conversations', JSON.stringify(data.conversations));
      }
    } catch (error) {
      console.error('Failed to save conversation:', error);
      // Fallback to localStorage only
      const localConversations = [...conversations];
      const conversationData = {
        _id: currentConversationId || Date.now().toString(),
        title,
        messages,
        systemPrompt,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      if (currentConversationId) {
        const index = localConversations.findIndex(c => c._id === currentConversationId);
        if (index !== -1) {
          localConversations[index] = conversationData;
        }
      } else {
        localConversations.unshift(conversationData);
        setCurrentConversationId(conversationData._id);
      }
      
      setConversations(localConversations);
      localStorage.setItem('alpha-conversations', JSON.stringify(localConversations));
    }
  };

  // Auto-save conversation when messages change
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        saveConversation();
      }, 2000); // Save 2 seconds after last message
      
      return () => clearTimeout(timer);
    }
  }, [messages]);

  // Save system prompt to localStorage
  const handleSaveSystemPrompt = (prompt: string) => {
    setSystemPrompt(prompt);
    localStorage.setItem("alpha-system-prompt", prompt);
  };

  // Load a conversation
  const loadConversation = (conversation: Conversation) => {
    setMessages(conversation.messages);
    setCurrentConversationId(conversation._id);
    setSystemPrompt(conversation.systemPrompt || systemPrompt);
    setSidebarOpen(false);
  };

  // Delete a conversation
  const deleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await fetch(`/api/conversations/${id}`, {
        method: 'DELETE',
      });
      
      const updatedConversations = conversations.filter(c => c._id !== id);
      setConversations(updatedConversations);
      localStorage.setItem('alpha-conversations', JSON.stringify(updatedConversations));
      
      if (currentConversationId === id) {
        setMessages([]);
        setCurrentConversationId(null);
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Create assistant message placeholder
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      // Abort previous request if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      // Add current date/time to system prompt
      const now = new Date();
      const dateOptions: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      
      const currentDate = now.toLocaleDateString('en-US', dateOptions);
      const currentTime = now.toLocaleTimeString('en-US', timeOptions);
      const currentDateTime = `${currentDate} at ${currentTime}`;
      
      // Inject current date/time into system prompt
      const updatedSystemPrompt = systemPrompt.includes('**CURRENT DATE & TIME:**')
        ? systemPrompt.replace(/\*\*CURRENT DATE & TIME:\*\*\n.*?\n/, `**CURRENT DATE & TIME:**\n${currentDateTime}\n`)
        : `**CURRENT DATE & TIME:**\n${currentDateTime}\n\n${systemPrompt}`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          systemPrompt: updatedSystemPrompt,
          model: "gpt-4o",
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              break;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulatedContent += parsed.content;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessageId
                      ? { ...m, content: accumulatedContent }
                      : m
                  )
                );
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Error:", error);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessageId
              ? {
                  ...m,
                  content:
                    "I apologize, but I encountered an error. Please try again.",
                }
              : m
          )
        );
      }
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setCurrentConversationId(null);
    setSidebarOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="p-2.5 border-b border-border/40">
        <Button
          onClick={handleNewChat}
          variant="ghost"
          className="w-full justify-start text-[11px] font-light h-8 hover:bg-accent/70 transition-all duration-200"
        >
          <Plus className="mr-2 h-3 w-3 stroke-[1.5]" />
          New conversation
        </Button>
      </div>
      <ScrollArea className="flex-1 px-2 py-3">
        <div className="space-y-0.5">
          {conversations.map((conversation) => (
            <div
              key={conversation._id}
              className={cn(
                "group w-full text-left px-2.5 py-1.5 text-[11px] rounded-lg hover:bg-accent/60 transition-all duration-200 font-light flex items-center gap-2 cursor-pointer",
                currentConversationId === conversation._id
                  ? "bg-accent/60 text-foreground"
                  : "text-muted-foreground"
              )}
              onClick={() => loadConversation(conversation)}
            >
              <MessageSquare className="h-3 w-3 stroke-[1.5] flex-shrink-0" />
              <span className="truncate flex-1">{conversation.title}</span>
              <button
                onClick={(e) => deleteConversation(conversation._id, e)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 stroke-[1.5]" />
              </button>
            </div>
          ))}
          {conversations.length === 0 && (
            <div className="text-[10px] text-muted-foreground/40 text-center py-4 px-2">
              No conversations yet
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-2.5 border-t border-border/40">
        <div className="text-[10px] text-muted-foreground/50 font-light px-2.5">
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 border-r border-border/40 flex-col backdrop-blur-sm">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 border-border/40">
          <div className="flex flex-col h-full">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b border-border/40 px-3 md:px-4 py-2.5 flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden h-7 w-7 hover:bg-accent/70"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-3.5 w-3.5 stroke-[1.5]" />
            </Button>
            <h1 className="text-[11px] font-light tracking-tight text-muted-foreground">
              Alpha
            </h1>
          </div>
          <AdvancedContextSettings 
            onSave={handleSaveSystemPrompt}
          />
        </header>

        {/* Messages Area */}
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="max-w-2xl mx-auto px-3 md:px-6 py-6 md:py-12">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-4 animate-fade-in">
                <div className="mb-5 p-3 rounded-2xl bg-accent/20 backdrop-blur-sm animate-scale-in">
                  <Sparkles className="h-6 w-6 text-foreground/70 stroke-[1.5]" />
                </div>
                <h2 className="text-xl md:text-2xl font-extralight mb-1.5 text-foreground tracking-tight">
                  Hello Rohit, I'm Alpha
                </h2>
                <p className="text-[11px] text-muted-foreground/60 font-light max-w-md">
                  Your personal assistant ready to help you plan and tackle everything—from arrear exams to startup deadlines
                </p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-xl">
                  <button
                    onClick={() => setInput("Help me create a study plan for my arrear exams")}
                    className="text-left px-4 py-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-all duration-200 border border-border/20"
                  >
                    <p className="text-[12px] font-light text-foreground">Plan arrear exam preparation</p>
                  </button>
                  <button
                    onClick={() => setInput("What should I prioritize today considering all my deadlines?")}
                    className="text-left px-4 py-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-all duration-200 border border-border/20"
                  >
                    <p className="text-[12px] font-light text-foreground">What to prioritize today?</p>
                  </button>
                  <button
                    onClick={() => setInput("Help me manage Hitroo and Mockello product deadlines")}
                    className="text-left px-4 py-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-all duration-200 border border-border/20"
                  >
                    <p className="text-[12px] font-light text-foreground">Manage startup deadlines</p>
                  </button>
                  <button
                    onClick={() => setInput("When should I approach my faculty about my arrears?")}
                    className="text-left px-4 py-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-all duration-200 border border-border/20"
                  >
                    <p className="text-[12px] font-light text-foreground">Faculty approach timing</p>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-5">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2.5 md:gap-3 group animate-fade-in-up",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/40 flex items-center justify-center mt-0.5 backdrop-blur-sm">
                        <Sparkles className="h-3 w-3 text-foreground/70 stroke-[1.5]" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-2xl px-3.5 py-2.5 max-w-[90%] md:max-w-[80%] text-[13px] font-light leading-relaxed transition-all duration-200",
                        message.role === "user"
                          ? "bg-foreground text-background shadow-sm"
                          : "bg-accent/30 text-foreground backdrop-blur-sm"
                      )}
                    >
                      {message.content ? (
                        message.role === "assistant" ? (
                          <div className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                ul: ({ children }) => <ul className="mb-2 ml-4 list-disc">{children}</ul>,
                                ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal">{children}</ol>,
                                li: ({ children }) => <li className="mb-1">{children}</li>,
                                strong: ({ children }) => <strong className="font-medium">{children}</strong>,
                                code: ({ children }) => <code className="bg-background/50 px-1 py-0.5 rounded text-[12px]">{children}</code>,
                                pre: ({ children }) => <pre className="bg-background/50 p-2 rounded-lg overflow-x-auto my-2">{children}</pre>,
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          message.content
                        )
                      ) : (
                        <div className="flex gap-1 py-1">
                          <div className="w-1 h-1 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-1 h-1 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-1 h-1 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      )}
                    </div>
                    {message.role === "user" && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-foreground/5 flex items-center justify-center mt-0.5 backdrop-blur-sm">
                        <div className="text-[9px] font-light text-foreground/60">U</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-border/40 bg-background/80 backdrop-blur-sm">
          <div className="max-w-2xl mx-auto px-3 md:px-6 py-3 md:py-4">
            <form onSubmit={handleSubmit} className="relative">
              <VoiceTextarea
                value={input}
                onChange={(value) => setInput(value)}
                placeholder="Type a message or click mic to record..."
                className="text-[13px] font-light border-border/30 focus-visible:ring-1 focus-visible:ring-ring/50 rounded-2xl bg-accent/20 placeholder:text-muted-foreground/40 transition-all duration-200 pr-20"
                minHeight="min-h-[44px]"
                onEnterPress={() => {
                  if (input.trim()) {
                    handleSubmit(new Event('submit') as any);
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                className="absolute right-12 bottom-1.5 h-7 w-7 rounded-xl transition-all duration-200 disabled:opacity-30"
              >
                <Send className="h-3 w-3 stroke-[1.5]" />
              </Button>
            </form>
            <p className="text-[9px] text-muted-foreground/40 text-center mt-2 font-light">
              ⏎ Send · ⇧⏎ New line · 🎤 Click mic to record
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

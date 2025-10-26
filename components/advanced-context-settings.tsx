"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { VoiceTextarea } from "@/components/voice-textarea";
import { VoiceInput } from "@/components/voice-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings2, Save, Brain, GraduationCap, Briefcase, Rocket, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContextData {
  generalMemory: string;
  exams: {
    subjects: string;
    dates: string;
    preparationStatus: string;
    notes: string;
  };
  staciaWork: {
    currentProjects: string;
    deadlines: string;
    priorities: string;
    notes: string;
  };
  otherWork: {
    projects: string;
    deadlines: string;
    notes: string;
  };
  mockello: {
    features: string;
    deadlines: string;
    status: string;
    notes: string;
  };
  hitroo: {
    features: string;
    deadlines: string;
    status: string;
    notes: string;
  };
}

interface AdvancedContextSettingsProps {
  onSave: (systemPrompt: string) => void;
}

const DEFAULT_CONTEXT: ContextData = {
  generalMemory: "",
  exams: {
    subjects: "",
    dates: "",
    preparationStatus: "",
    notes: "",
  },
  staciaWork: {
    currentProjects: "",
    deadlines: "",
    priorities: "",
    notes: "",
  },
  otherWork: {
    projects: "",
    deadlines: "",
    notes: "",
  },
  mockello: {
    features: "",
    deadlines: "",
    status: "",
    notes: "",
  },
  hitroo: {
    features: "",
    deadlines: "",
    status: "",
    notes: "",
  },
};

export function AdvancedContextSettings({ onSave }: AdvancedContextSettingsProps) {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<ContextData>(DEFAULT_CONTEXT);
  const [saving, setSaving] = useState(false);

  // Load context from both localStorage and MongoDB
  useEffect(() => {
    if (open) {
      loadContext();
    }
  }, [open]);

  const loadContext = async () => {
    console.log('Loading context...');
    try {
      // Try loading from MongoDB first
      const response = await fetch('/api/context');
      if (response.ok) {
        const data = await response.json();
        console.log('MongoDB response:', data);
        if (data.context) {
          // Merge with default structure to ensure all fields exist
          const mergedContext = {
            generalMemory: data.context.generalMemory || '',
            exams: {
              subjects: data.context.exams?.subjects || '',
              dates: data.context.exams?.dates || '',
              preparationStatus: data.context.exams?.preparationStatus || '',
              notes: data.context.exams?.notes || '',
            },
            staciaWork: {
              currentProjects: data.context.staciaWork?.currentProjects || '',
              deadlines: data.context.staciaWork?.deadlines || '',
              priorities: data.context.staciaWork?.priorities || '',
              notes: data.context.staciaWork?.notes || '',
            },
            otherWork: {
              projects: data.context.otherWork?.projects || '',
              deadlines: data.context.otherWork?.deadlines || '',
              notes: data.context.otherWork?.notes || '',
            },
            mockello: {
              features: data.context.mockello?.features || '',
              deadlines: data.context.mockello?.deadlines || '',
              status: data.context.mockello?.status || '',
              notes: data.context.mockello?.notes || '',
            },
            hitroo: {
              features: data.context.hitroo?.features || '',
              deadlines: data.context.hitroo?.deadlines || '',
              status: data.context.hitroo?.status || '',
              notes: data.context.hitroo?.notes || '',
            },
          };
          console.log('Setting merged context from MongoDB:', mergedContext);
          setContext(mergedContext);
          localStorage.setItem('alpha-context', JSON.stringify(mergedContext));
          return;
        }
      }
      
      // Fallback to localStorage
      console.log('Falling back to localStorage');
      const localContext = localStorage.getItem('alpha-context');
      if (localContext) {
        console.log('Found localStorage context:', localContext);
        const parsedContext = JSON.parse(localContext);
        // Merge with default structure
        const mergedContext = {
          generalMemory: parsedContext.generalMemory || '',
          exams: {
            subjects: parsedContext.exams?.subjects || '',
            dates: parsedContext.exams?.dates || '',
            preparationStatus: parsedContext.exams?.preparationStatus || '',
            notes: parsedContext.exams?.notes || '',
          },
          staciaWork: {
            currentProjects: parsedContext.staciaWork?.currentProjects || '',
            deadlines: parsedContext.staciaWork?.deadlines || '',
            priorities: parsedContext.staciaWork?.priorities || '',
            notes: parsedContext.staciaWork?.notes || '',
          },
          otherWork: {
            projects: parsedContext.otherWork?.projects || '',
            deadlines: parsedContext.otherWork?.deadlines || '',
            notes: parsedContext.otherWork?.notes || '',
          },
          mockello: {
            features: parsedContext.mockello?.features || '',
            deadlines: parsedContext.mockello?.deadlines || '',
            status: parsedContext.mockello?.status || '',
            notes: parsedContext.mockello?.notes || '',
          },
          hitroo: {
            features: parsedContext.hitroo?.features || '',
            deadlines: parsedContext.hitroo?.deadlines || '',
            status: parsedContext.hitroo?.status || '',
            notes: parsedContext.hitroo?.notes || '',
          },
        };
        console.log('Setting merged context from localStorage:', mergedContext);
        setContext(mergedContext);
      } else {
        console.log('No localStorage context found');
      }
    } catch (error) {
      console.error('Failed to load context:', error);
      const localContext = localStorage.getItem('alpha-context');
      if (localContext) {
        try {
          const parsedContext = JSON.parse(localContext);
          setContext(parsedContext);
        } catch (parseError) {
          console.error('Failed to parse local context:', parseError);
        }
      }
    }
  };

  const generateSystemPrompt = (ctx: ContextData): string => {
    // Get current date and time
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
    if (ctx.exams.subjects || ctx.exams.dates || ctx.exams.preparationStatus || ctx.exams.notes) {
      prompt += `**ARREAR EXAMS:**
`;
      if (ctx.exams.subjects) prompt += `Subjects: ${ctx.exams.subjects}\n`;
      if (ctx.exams.dates) prompt += `Exam Dates: ${ctx.exams.dates}\n`;
      if (ctx.exams.preparationStatus) prompt += `Preparation Status: ${ctx.exams.preparationStatus}\n`;
      if (ctx.exams.notes) prompt += `Notes: ${ctx.exams.notes}\n`;
      prompt += `\n---\n\n`;
    }

    // Stacia Work Section
    if (ctx.staciaWork.currentProjects || ctx.staciaWork.deadlines || ctx.staciaWork.priorities || ctx.staciaWork.notes) {
      prompt += `**STACIA WORK:**
`;
      if (ctx.staciaWork.currentProjects) prompt += `Current Projects: ${ctx.staciaWork.currentProjects}\n`;
      if (ctx.staciaWork.deadlines) prompt += `Deadlines: ${ctx.staciaWork.deadlines}\n`;
      if (ctx.staciaWork.priorities) prompt += `Priorities: ${ctx.staciaWork.priorities}\n`;
      if (ctx.staciaWork.notes) prompt += `Notes: ${ctx.staciaWork.notes}\n`;
      prompt += `\n---\n\n`;
    }

    // Other Work Section
    if (ctx.otherWork.projects || ctx.otherWork.deadlines || ctx.otherWork.notes) {
      prompt += `**OTHER WORK COMMITMENTS:**
`;
      if (ctx.otherWork.projects) prompt += `Projects: ${ctx.otherWork.projects}\n`;
      if (ctx.otherWork.deadlines) prompt += `Deadlines: ${ctx.otherWork.deadlines}\n`;
      if (ctx.otherWork.notes) prompt += `Notes: ${ctx.otherWork.notes}\n`;
      prompt += `\n---\n\n`;
    }

    // Mockello Section
    if (ctx.mockello.features || ctx.mockello.deadlines || ctx.mockello.status || ctx.mockello.notes) {
      prompt += `**MOCKELLO STARTUP:**
`;
      if (ctx.mockello.features) prompt += `Features/Products: ${ctx.mockello.features}\n`;
      if (ctx.mockello.deadlines) prompt += `Deadlines: ${ctx.mockello.deadlines}\n`;
      if (ctx.mockello.status) prompt += `Current Status: ${ctx.mockello.status}\n`;
      if (ctx.mockello.notes) prompt += `Notes: ${ctx.mockello.notes}\n`;
      prompt += `\n---\n\n`;
    }

    // Hitroo Section
    if (ctx.hitroo.features || ctx.hitroo.deadlines || ctx.hitroo.status || ctx.hitroo.notes) {
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

  const handleSave = async () => {
    setSaving(true);
    console.log('Saving context:', context);
    
    try {
      // Save to MongoDB
      const response = await fetch('/api/context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context),
      });
      
      if (response.ok) {
        console.log('Context saved to MongoDB successfully');
      } else {
        console.error('Failed to save to MongoDB:', await response.text());
      }
      
      // Save to localStorage
      localStorage.setItem('alpha-context', JSON.stringify(context));
      console.log('Context saved to localStorage:', localStorage.getItem('alpha-context'));
      
      // Generate and save system prompt
      const systemPrompt = generateSystemPrompt(context);
      onSave(systemPrompt);
      
      setOpen(false);
    } catch (error) {
      console.error('Failed to save context:', error);
      // Still save to localStorage
      localStorage.setItem('alpha-context', JSON.stringify(context));
      const systemPrompt = generateSystemPrompt(context);
      onSave(systemPrompt);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-accent/70">
          <Settings2 className="h-3.5 w-3.5 stroke-[1.5]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/40">
          <DialogTitle className="text-base font-light tracking-tight flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Context Management
          </DialogTitle>
          <DialogDescription className="text-[11px] font-light">
            Manage all aspects of your life. Alpha will remember everything you add here.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="flex-1">
          <div className="px-6 pt-4">
            <TabsList className="grid grid-cols-6 w-full h-auto p-1 bg-accent/30">
              <TabsTrigger value="general" className="text-[10px] py-1.5 data-[state=active]:bg-background">
                <Brain className="h-3 w-3 mr-1" />
                General
              </TabsTrigger>
              <TabsTrigger value="exams" className="text-[10px] py-1.5 data-[state=active]:bg-background">
                <GraduationCap className="h-3 w-3 mr-1" />
                Exams
              </TabsTrigger>
              <TabsTrigger value="stacia" className="text-[10px] py-1.5 data-[state=active]:bg-background">
                <Briefcase className="h-3 w-3 mr-1" />
                Stacia
              </TabsTrigger>
              <TabsTrigger value="other" className="text-[10px] py-1.5 data-[state=active]:bg-background">
                <Briefcase className="h-3 w-3 mr-1" />
                Other
              </TabsTrigger>
              <TabsTrigger value="mockello" className="text-[10px] py-1.5 data-[state=active]:bg-background">
                <Rocket className="h-3 w-3 mr-1" />
                Mockello
              </TabsTrigger>
              <TabsTrigger value="hitroo" className="text-[10px] py-1.5 data-[state=active]:bg-background">
                <Sparkles className="h-3 w-3 mr-1" />
                Hitroo
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[50vh] px-6 py-4">
            {/* General Memory */}
            <TabsContent value="general" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label className="text-[11px] font-light text-muted-foreground">
                  General Memory & Personal Context
                </Label>
                <VoiceTextarea
                  value={context.generalMemory}
                  onChange={(value) => setContext({ ...context, generalMemory: value })}
                  placeholder="Add general information about yourself, your goals, preferences, daily routines, etc... (Click mic to record)"
                  className="text-[12px] font-light leading-relaxed border-border/30 focus-visible:ring-1 focus-visible:ring-ring/50 rounded-xl bg-accent/20"
                  minHeight="min-h-[300px]"
                />
                <p className="text-[10px] text-muted-foreground/60 font-light">
                  This is your general memory that Alpha will always remember about you. Click the mic icon to record audio.
                </p>
              </div>
            </TabsContent>

            {/* Exams */}
            <TabsContent value="exams" className="space-y-4 mt-0">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-[11px] font-light text-muted-foreground">Subjects & Topics</Label>
                  <VoiceTextarea
                    value={context.exams.subjects}
                    onChange={(value) => setContext({ ...context, exams: { ...context.exams, subjects: value }})}
                    placeholder="List your arrear exam subjects and key topics... (Click mic to record)"
                    className="text-[12px] font-light"
                    minHeight="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-light text-muted-foreground">Exam Dates</Label>
                  <VoiceInput
                    value={context.exams.dates}
                    onChange={(value) => setContext({ ...context, exams: { ...context.exams, dates: value }})}
                    placeholder="e.g., Math - Dec 15, Physics - Dec 20... (Click mic)"
                    className="text-[12px] font-light"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-light text-muted-foreground">Preparation Status</Label>
                  <VoiceTextarea
                    value={context.exams.preparationStatus}
                    onChange={(value) => setContext({ ...context, exams: { ...context.exams, preparationStatus: value }})}
                    placeholder="How prepared are you for each subject?... (Click mic)"
                    className="text-[12px] font-light"
                    minHeight="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-light text-muted-foreground">Additional Notes</Label>
                  <VoiceTextarea
                    value={context.exams.notes}
                    onChange={(value) => setContext({ ...context, exams: { ...context.exams, notes: value }})}
                    placeholder="Faculty contacts, study resources, weak areas... (Click mic)"
                    className="text-[12px] font-light"
                    minHeight="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Stacia Work */}
            <TabsContent value="stacia" className="space-y-4 mt-0">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-[11px] font-light text-muted-foreground">Current Projects</Label>
                  <VoiceTextarea
                    value={context.staciaWork.currentProjects}
                    onChange={(value) => setContext({ ...context, staciaWork: { ...context.staciaWork, currentProjects: value }})}
                    placeholder="List current Stacia projects you're working on... (Click mic)"
                    className="text-[12px] font-light"
                    minHeight="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-light text-muted-foreground">Deadlines</Label>
                  <VoiceTextarea
                    value={context.staciaWork.deadlines}
                    onChange={(value) => setContext({ ...context, staciaWork: { ...context.staciaWork, deadlines: value }})}
                    placeholder="Important deadlines for Stacia work... (Click mic)"
                    className="text-[12px] font-light"
                    minHeight="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-light text-muted-foreground">Priorities</Label>
                  <VoiceTextarea
                    value={context.staciaWork.priorities}
                    onChange={(value) => setContext({ ...context, staciaWork: { ...context.staciaWork, priorities: value }})}
                    placeholder="What needs immediate attention?... (Click mic)"
                    className="text-[12px] font-light"
                    minHeight="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-light text-muted-foreground">Notes</Label>
                  <VoiceTextarea
                    value={context.staciaWork.notes}
                    onChange={(value) => setContext({ ...context, staciaWork: { ...context.staciaWork, notes: value }})}
                    placeholder="Any additional context about Stacia work... (Click mic)"
                    className="text-[12px] font-light"
                    minHeight="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Other Work */}
            <TabsContent value="other" className="space-y-4 mt-0">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-[11px] font-light text-muted-foreground">Projects</Label>
                  <VoiceTextarea
                    value={context.otherWork.projects}
                    onChange={(value) => setContext({ ...context, otherWork: { ...context.otherWork, projects: value }})}
                    placeholder="Other freelance or work projects... (Click mic)"
                    className="text-[12px] font-light"
                    minHeight="min-h-[120px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-light text-muted-foreground">Deadlines</Label>
                  <VoiceTextarea
                    value={context.otherWork.deadlines}
                    onChange={(value) => setContext({ ...context, otherWork: { ...context.otherWork, deadlines: value }})}
                    placeholder="Deadlines for other work... (Click mic)"
                    className="text-[12px] font-light"
                    minHeight="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-light text-muted-foreground">Notes</Label>
                  <VoiceTextarea
                    value={context.otherWork.notes}
                    onChange={(value) => setContext({ ...context, otherWork: { ...context.otherWork, notes: value }})}
                    placeholder="Additional context... (Click mic)"
                    className="text-[12px] font-light"
                    minHeight="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Mockello */}
            <TabsContent value="mockello" className="space-y-4 mt-0">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-[11px] font-light text-muted-foreground">Features & Products</Label>
                  <VoiceTextarea
                    value={context.mockello.features}
                    onChange={(value) => setContext({ ...context, mockello: { ...context.mockello, features: value }})}
                    placeholder="What features/products are you building for Mockello?... (Click mic)"
                    className="text-[12px] font-light"
                    minHeight="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-light text-muted-foreground">Deadlines & Milestones</Label>
                  <VoiceTextarea
                    value={context.mockello.deadlines}
                    onChange={(value) => setContext({ ...context, mockello: { ...context.mockello, deadlines: value }})}
                    placeholder="Important deadlines and milestones... (Click mic)"
                    className="text-[12px] font-light"
                    minHeight="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-light text-muted-foreground">Current Status</Label>
                  <VoiceTextarea
                    value={context.mockello.status}
                    onChange={(value) => setContext({ ...context, mockello: { ...context.mockello, status: value }})}
                    placeholder="What's the current state of Mockello?... (Click mic)"
                    className="text-[12px] font-light"
                    minHeight="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-light text-muted-foreground">Notes</Label>
                  <VoiceTextarea
                    value={context.mockello.notes}
                    onChange={(value) => setContext({ ...context, mockello: { ...context.mockello, notes: value }})}
                    placeholder="Challenges, opportunities, ideas... (Click mic)"
                    className="text-[12px] font-light"
                    minHeight="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Hitroo */}
            <TabsContent value="hitroo" className="space-y-4 mt-0">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-[11px] font-light text-muted-foreground">Features & Products</Label>
                  <VoiceTextarea
                    value={context.hitroo.features}
                    onChange={(value) => setContext({ ...context, hitroo: { ...context.hitroo, features: value }})}
                    placeholder="What features/products are you building for Hitroo?... (Click mic)"
                    className="text-[12px] font-light"
                    minHeight="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-light text-muted-foreground">Deadlines & Milestones</Label>
                  <VoiceTextarea
                    value={context.hitroo.deadlines}
                    onChange={(value) => setContext({ ...context, hitroo: { ...context.hitroo, deadlines: value }})}
                    placeholder="Important deadlines and milestones... (Click mic)"
                    className="text-[12px] font-light"
                    minHeight="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-light text-muted-foreground">Current Status</Label>
                  <VoiceTextarea
                    value={context.hitroo.status}
                    onChange={(value) => setContext({ ...context, hitroo: { ...context.hitroo, status: value }})}
                    placeholder="What's the current state of Hitroo?... (Click mic)"
                    className="text-[12px] font-light"
                    minHeight="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-light text-muted-foreground">Notes</Label>
                  <VoiceTextarea
                    value={context.hitroo.notes}
                    onChange={(value) => setContext({ ...context, hitroo: { ...context.hitroo, notes: value }})}
                    placeholder="Challenges, opportunities, ideas... (Click mic)"
                    className="text-[12px] font-light"
                    minHeight="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="px-6 py-4 border-t border-border/40 flex justify-between items-center">
          <p className="text-[10px] text-muted-foreground/60 font-light">
            All changes are saved to both MongoDB and localStorage
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-[11px] font-light h-8"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="text-[11px] font-light h-8 gap-2"
            >
              <Save className="h-3 w-3 stroke-[1.5]" />
              {saving ? 'Saving...' : 'Save All Context'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


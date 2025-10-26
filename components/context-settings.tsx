"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Settings2, Save } from "lucide-react";

interface ContextSettingsProps {
  systemPrompt: string;
  onSave: (prompt: string) => void;
}

export function ContextSettings({ systemPrompt, onSave }: ContextSettingsProps) {
  const [open, setOpen] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(systemPrompt);

  const handleSave = () => {
    onSave(editedPrompt);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-accent/70">
          <Settings2 className="h-3.5 w-3.5 stroke-[1.5]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/40">
          <DialogTitle className="text-base font-light tracking-tight">
            Context & Settings
          </DialogTitle>
          <DialogDescription className="text-[11px] font-light">
            Customize Alpha's knowledge about you and your current situation
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="px-6 py-4 max-h-[60vh]">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="system-prompt" className="text-[11px] font-light text-muted-foreground">
                System Prompt / Context Window
              </Label>
              <Textarea
                id="system-prompt"
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                placeholder="Enter context about your situation..."
                className="min-h-[400px] text-[13px] font-light leading-relaxed border-border/30 focus-visible:ring-1 focus-visible:ring-ring/50 rounded-xl bg-accent/20"
              />
              <p className="text-[10px] text-muted-foreground/60 font-light">
                This context will be included in every conversation to help Alpha understand your situation better.
              </p>
            </div>
          </div>
        </ScrollArea>
        <div className="px-6 py-4 border-t border-border/40 flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-[11px] font-light h-8"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="text-[11px] font-light h-8 gap-2"
          >
            <Save className="h-3 w-3 stroke-[1.5]" />
            Save Context
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


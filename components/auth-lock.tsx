"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const CORRECT_PASSWORD = "iamunique7$";
const AUTH_KEY = "alpha-authenticated";
const AUTH_EXPIRY = "alpha-auth-expiry";

interface AuthLockProps {
  children: React.ReactNode;
}

export function AuthLock({ children }: AuthLockProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    // Check if already authenticated and not expired
    const checkAuth = () => {
      const authenticated = localStorage.getItem(AUTH_KEY);
      const expiry = localStorage.getItem(AUTH_EXPIRY);
      
      if (authenticated === "true" && expiry) {
        const expiryTime = parseInt(expiry);
        const now = Date.now();
        
        // Check if session is still valid (24 hours)
        if (now < expiryTime) {
          setIsAuthenticated(true);
        } else {
          // Session expired, clear auth
          localStorage.removeItem(AUTH_KEY);
          localStorage.removeItem(AUTH_EXPIRY);
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === CORRECT_PASSWORD) {
      // Set auth with 24-hour expiry
      const expiryTime = Date.now() + (24 * 60 * 60 * 1000);
      localStorage.setItem(AUTH_KEY, "true");
      localStorage.setItem(AUTH_EXPIRY, expiryTime.toString());
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
      setShake(true);
      setPassword("");
      setTimeout(() => setShake(false), 500);
    }
  };

  // Show loading state briefly
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse">
          <Sparkles className="h-8 w-8 text-foreground/70" />
        </div>
      </div>
    );
  }

  // Show lock screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background px-4">
        <div className={cn(
          "w-full max-w-sm space-y-6 animate-fade-in",
          shake && "animate-shake"
        )}>
          {/* Logo/Icon */}
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-2xl bg-accent/30 backdrop-blur-sm">
              <Lock className="h-8 w-8 text-foreground/70" />
            </div>
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-extralight tracking-tight">Alpha</h1>
              <p className="text-[11px] text-muted-foreground/60 font-light">
                Enter password to continue
              </p>
            </div>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter password"
                className="text-center text-[13px] font-light h-12 rounded-xl border-border/30 focus-visible:ring-1 focus-visible:ring-ring/50 bg-accent/20"
                autoFocus
              />
              {error && (
                <p className="text-[10px] text-destructive text-center font-light animate-fade-in">
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl text-[13px] font-light"
              disabled={!password}
            >
              <Lock className="h-3.5 w-3.5 mr-2" />
              Unlock
            </Button>
          </form>

          {/* Footer */}
          <p className="text-[9px] text-center text-muted-foreground/40 font-light">
            Your personal assistant
          </p>
        </div>
      </div>
    );
  }

  // Show main app if authenticated
  return <>{children}</>;
}


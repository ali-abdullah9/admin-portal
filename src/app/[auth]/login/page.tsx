"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole } from "lucide-react";
import { useAuth } from "@/app/AuthProvider";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Add a small delay to simulate authentication process
    setTimeout(() => {
      login(username, password);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl">
              NT
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">NusTAC Admin Portal</CardTitle>
          <CardDescription>Enter your credentials to sign in</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="admin1" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 mr-2 rounded-full border-2 border-background border-t-transparent animate-spin"/>
                  Signing in...
                </>
              ) : (
                <>
                  <LockKeyhole className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </CardFooter>
        </form>
        <div className="p-6 pt-0 text-center text-sm text-muted-foreground">
          <p>Valid test credentials:</p>
          <code className="p-1 bg-muted rounded">admin1 / admin123</code>, 
          <code className="p-1 bg-muted rounded ml-1">admin2 / admin456</code>, 
          <code className="p-1 bg-muted rounded ml-1">moderator / mod123</code>
        </div>
      </Card>
    </div>
  );
}
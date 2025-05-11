"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LockKeyhole } from "lucide-react";
import { useAuth } from "../AuthProvider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Three.js container reference
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Check if already authenticated on load
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard'); // Replace with your dashboard path
    }
  }, [isAuthenticated, router]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Add a small delay to simulate authentication process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Perform login
      const success = await login(username, password);
      
      if (success) {
        // Store authentication token in localStorage
        localStorage.setItem('authToken', 'your-auth-token-here'); // Replace with your actual token
        localStorage.setItem('user', JSON.stringify({ username }));
        
        // Redirect to dashboard
        router.push('/'); // Replace with your dashboard path
      } else {
        // Handle failed login
        console.error("Login failed");
        // You could add error state and display a message here
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasRef.current.appendChild(renderer.domElement);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colArray = new Float32Array(particlesCount * 3);
    
    // Fill arrays with random values
    for (let i = 0; i < particlesCount * 3; i++) {
      // Position: Distribute particles in a 3D space
      posArray[i] = (Math.random() - 0.5) * 10;
      
      // Color: Create a gradient from blue to purple
      colArray[i * 3] = 0.1; // Red
      colArray[i * 3 + 1] = 0.3 + Math.random() * 0.3; // Green
      colArray[i * 3 + 2] = 0.7 + Math.random() * 0.3; // Blue
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colArray, 3));
    
    // Material for particles
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    
    // Create particle system
    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Animation variables
    let frame = 0;
    const mouse = {
      x: 0,
      y: 0,
    };
    
    // Mouse move event listener
    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);
    
    // Window resize event listener
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      frame += 0.01;
      
      // Rotate particle system slowly
      particleSystem.rotation.x = frame * 0.1;
      particleSystem.rotation.y = frame * 0.05;
      
      // React to mouse movement
      particleSystem.rotation.x += mouse.y * 0.01;
      particleSystem.rotation.y += mouse.x * 0.01;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup function
    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);
  
  // If already authenticated, don't show login form (prevents flash of login screen)
  if (isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">Redirecting to dashboard...</div>
    </div>;
  }
  
  return (
    <>
      {/* Three.js Canvas Container - Full screen background */}
      <div 
        ref={canvasRef} 
        className="fixed inset-0 -z-10 bg-gradient-to-b from-background/90 to-background/80"
      />
      
      {/* Login Form */}
      <div className="min-h-screen flex items-center justify-center ">
        <Card className="w-full max-w-md shadow-lg border-primary/20 backdrop-blur-sm bg-background/70">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl dark:text-white">
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
                  className="bg-background/50 backdrop-blur-sm"
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
                  className="bg-background/50 backdrop-blur-sm"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full mt-8" type="submit" disabled={isLoading}>
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
        </Card>
      </div>
    </>
  );
}
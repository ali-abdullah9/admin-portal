"use client";


import { ConvexClientProvider } from "./ConvexClientProvider";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/Navbar";
import AuthProvider from "./AuthProvider";
import Footer from "@/components/layout/Footer";
import { useEffect } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

// Metadata needs to be in a separate file or as a const for Client Components
export const metadata = {
  title: "NusTAC - Admin Portal",
  description: "Secure campus access management system",
};

// Three.js starry background component
const ThreeJsBackground = () => {
  useEffect(() => {
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Add renderer to DOM
    const container = document.getElementById('stars-background');
    if (container) {
      container.appendChild(renderer.domElement);
      
      // Set renderer size to match container
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    }

    // Create particles for starry effect
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 300; // Number of stars
    
    // Create positions for particles
    const positions = new Float32Array(particlesCount * 3);
    
    // Set random positions for particles
    for (let i = 0; i < particlesCount; i++) {
      // Positions - spread wider for more empty space
      positions[i * 3] = (Math.random() - 0.5) * 15;      // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;  // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;  // z
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Material for particles - small white dots for stars
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.015,
      sizeAttenuation: true,
      color: 0xffffff,
      transparent: true,
      opacity: 0.7
    });
    
    // Create particles mesh
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Add soft ambient light
    const ambientLight = new THREE.AmbientLight(0x5e35b1, 0.2);
    scene.add(ambientLight);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Very slow rotation for stars
      particles.rotation.x += 0.0002;
      particles.rotation.y += 0.0001;
      
      // Render scene
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (container) {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup on unmount
    return () => {
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <div id="stars-background" className="fixed inset-0 -z-10 overflow-hidden opacity-60" />;
};

// Purple gradient background component
const GradientBackground = () => (
  <div className="fixed inset-0 -z-20 overflow-hidden bg-[#0f0921]">
    {/* Animated purple wave effect */}
    <div className="absolute inset-0 opacity-60">
      <motion.div
        className="absolute top-1/3 right-0 left-0 h-[300px] bg-gradient-to-b from-[#51338C]/20 to-transparent blur-3xl"
        animate={{
          y: [0, 20, 0],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/4 right-0 left-0 h-[200px] bg-gradient-to-b from-[#51338C]/10 to-transparent blur-3xl"
        animate={{
          y: [0, -30, 0],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />
    </div>
  </div>
);

export default function RootLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col text-white antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ConvexClientProvider>
              {/* Animated backgrounds */}
              <ThreeJsBackground />
              <GradientBackground />
              
              {/* Header */}
              <header className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-[#0f0921]/70 backdrop-blur supports-[backdrop-filter]:bg-[#0f0921]/40">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <Navbar />
                </div>
              </header>

              {/* Main content */}
              <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {children}
              </main>

              {/* Footer with dark styling */}
              <footer className="">
                <div className="">
                  <Footer  />
                </div>
              </footer>
              
              <Toaster position="bottom-right" />
            </ConvexClientProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
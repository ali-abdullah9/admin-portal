"use client";

import { useState, useEffect, FC, ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import * as THREE from "three";

// Dynamic loading for Three.js background - similar to dashboard
const ThreeBackground: FC = () => {
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
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Add renderer to DOM
    const container = document.getElementById("three-container");
    if (container) {
      container.appendChild(renderer.domElement);
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    }

    // Create particles for starry effect - but fewer than dashboard
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;

    // Create positions for particles
    const positions = new Float32Array(particlesCount * 3);

    // Set random positions for particles
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15; // z
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    // Material for particles - small red-tinted dots for "error" feel
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.015,
      sizeAttenuation: true,
      color: 0xff6666,
      transparent: true,
      opacity: 0.7,
    });

    // Create particles mesh
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Add soft ambient light
    const ambientLight = new THREE.AmbientLight(0xff3333, 0.2);
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

    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      id="three-container"
      className="absolute inset-0 -z-10 overflow-hidden opacity-60"
    />
  );
};

// Red-purple gradient background instead of purple
const GradientBackground: FC = () => (
  <div className="absolute inset-0 -z-20 overflow-hidden bg-[#0f0921]">
    {/* Animated red-purple wave effect */}
    <div className="absolute inset-0 opacity-60">
      <motion.div
        className="absolute top-1/3 right-0 left-0 h-[300px] bg-gradient-to-b from-[#8C3351]/20 to-transparent blur-3xl"
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
        className="absolute top-1/4 right-0 left-0 h-[200px] bg-gradient-to-b from-[#8C3351]/10 to-transparent blur-3xl"
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

// Glitch text effect for the 404
interface GlitchTextProps {
  children: ReactNode;
}

const GlitchText: FC<GlitchTextProps> = ({ children }) => {
  return (
    <div className="relative inline-block">
      <motion.span
        className="relative inline-block text-white"
        animate={{
          x: [0, -2, 3, -1, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          repeatDelay: 5,
        }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 inline-block text-red-500 opacity-70"
        animate={{
          x: [0, 2, -3, 1, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          repeatDelay: 5,
          delay: 0.05,
        }}
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)" }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute top-0 left-0 inline-block text-blue-400 opacity-70"
        animate={{
          x: [0, -2, 3, -1, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          repeatDelay: 5,
          delay: 0.1,
        }}
        style={{ clipPath: "polygon(0 45%, 100% 45%, 100% 100%, 0 100%)" }}
      >
        {children}
      </motion.span>
    </div>
  );
};

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ShareDialog: React.FC<ShareDialogProps> = ({ isOpen, onClose }) => {
  const [shareLink, setShareLink] = useState("https://admin-portal-taupe.vercel.app/");
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#1B1130] p-6 rounded-xl w-full max-w-md border border-purple-500/30"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-white mb-4">Share Dashboard</h3>
        <p className="text-gray-300 mb-6">Share access to this dashboard with other team members</p>
        
        <div className="flex items-stretch mb-4">
          <input
            type="text"
            value={shareLink}
            onChange={(e) => setShareLink(e.target.value)}
            className="flex-1 bg-[#140D28] border border-purple-500/30 rounded-l-lg px-4 py-2 text-white"
            readOnly
          />
          <button
            onClick={copyToClipboard}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 rounded-r-lg transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        
        <div className="flex justify-between gap-4 mt-8">
          <button
            className="flex-1 py-2 px-4 rounded-lg bg-[#281A41] hover:bg-[#332152] text-white transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Custom404: FC = () => {
  const [countdown, setCountdown] = useState<number>(10);

  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown]);

  // Optional: Implement actual redirect
  useEffect(() => {
    if (countdown <= 0) {
      // Uncomment to enable actual redirect
      // window.location.href = '/';
    }
  }, [countdown]);

  return (
    <div className="w-full min-h-screen relative flex items-center justify-center">
      {/* Three.js animated background */}
      <ThreeBackground />

      {/* Gradient background */}
      <GradientBackground />

      <div className="relative z-10 py-8 max-w-2xl w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-8xl font-bold mb-6 text-white">
              <GlitchText>404</GlitchText>
            </h1>
            <h2 className="text-3xl font-bold text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto">
              The page you are looking for might have been removed, had its name changed, 
              or is temporarily unavailable.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/"
                  className="flex items-center justify-center gap-2 bg-[#281A41] hover:bg-[#332152] text-white px-6 py-3 rounded-lg transition-all"
                >
                  <Home size={18} className="text-red-400" />
                  <span>Back to Home</span>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button 
                  onClick={() => window.history.back()}
                  className="flex items-center justify-center gap-2 bg-transparent border border-gray-600 hover:border-gray-400 text-white px-6 py-3 rounded-lg transition-all"
                >
                  <ArrowLeft size={18} className="text-blue-400" />
                  <span>Go Back</span>
                </button>
              </motion.div>
            </div>
            
            {countdown > 0 && (
              <div className="text-gray-400">
                Redirecting to home in {countdown} seconds...
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Error details card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-[#140D28] rounded-xl p-6 shadow-lg border border-red-500/30"
        >
          <h3 className="text-xl font-bold text-white mb-4">Error Details</h3>
          <div className="space-y-3 text-gray-300">
            <p>
              <span className="text-red-400 font-semibold">Error Code:</span> 404 Not Found
            </p>
            <p>
              <span className="text-red-400 font-semibold">Description:</span> The requested
              URL was not found on this server.
            </p>
            <p>
              <span className="text-red-400 font-semibold">Possible Causes:</span>
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>The URL may be misspelled</li>
              <li>The page may have been moved or deleted</li>
              <li>You may not have access to this resource</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Custom404;
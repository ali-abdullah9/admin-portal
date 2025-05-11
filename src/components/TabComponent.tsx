"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  BarChart2,
  UserPlus,
  Edit2,
  User,
  Share2
} from "lucide-react";
import LogsPage from "./LogsPage";
import AccessLogsAnalytics from "./AccessLogsAnalytics";
import { AddUserForm } from "./AddUserForm";
import EditUserForm from "./EditUserForm";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// Dynamic loading for Three.js background
const ThreeBackground = () => {
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

      // Set renderer size to match container
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    }

    // Create particles for starry effect
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 300;

    // Create positions for particles
    const positions = new Float32Array(particlesCount * 3);

    // Set random positions for particles
    for (let i = 0; i < particlesCount; i++) {
      // Positions - spread wider for more empty space
      positions[i * 3] = (Math.random() - 0.5) * 15; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15; // z
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    // Material for particles - small white dots for stars
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.015,
      sizeAttenuation: true,
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
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
    window.addEventListener("resize", () => {
      if (container) {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
      }
    });

    // Cleanup on unmount
    return () => {
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return (
    <div
      id="three-container"
      className="absolute inset-0 -z-10 overflow-hidden opacity-60"
    />
  );
};

// Purple gradient background as seen in the image
const GradientBackground = () => (
  <div className="absolute inset-0 -z-20 overflow-hidden bg-[#0f0921]">
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

// Tab component that matches the style from the image
interface TabItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  iconColor: string;
}

const TabItem: React.FC<TabItemProps> = ({ icon, label, isActive, onClick, iconColor }) => (
  <motion.button
    onClick={onClick}
    className={`relative flex-1 py-3 px-4 rounded-lg text-white transition-all focus:outline-none overflow-hidden ${
      isActive ? "bg-[#281A41]" : "bg-transparent hover:bg-[#281A41]/50"
    }`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center justify-center gap-2">
      <div className={iconColor}>{icon}</div>
      <span
        className={`font-medium ${isActive ? "text-white" : "text-gray-300"}`}
      >
        {label}
      </span>
    </div>
  </motion.button>
);

// Share dialog component
interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

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
        onClick={e => e.stopPropagation()}
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


export default function NusTacAdminDashboard() {
  const [activeTab, setActiveTab] = useState("Access Log");
  const [isLoading, setIsLoading] = useState(true);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full min-h-screen relative">
      {/* Three.js animated background */}
      <ThreeBackground />

      {/* Gradient background */}
      <GradientBackground />

      {/* Share Dialog */}
      <AnimatePresence>
        {isShareDialogOpen && (
          <ShareDialog 
            isOpen={isShareDialogOpen} 
            onClose={() => setIsShareDialogOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Loading screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-[#0f0921] z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                className="inline-block mb-4"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <div className="w-16 h-16 rounded-full border-t-4 border-l-4 border-purple-500 animate-spin"></div>
              </motion.div>
              <h2 className="text-xl font-bold text-white mb-2">
                Loading Dashboard
              </h2>
              <p className="text-gray-400">
                Preparing your admin experience...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 py-8">
        {/* Header area with status indicators */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Admin Dashboard
            </h1>
          </div>
          
          {/* Share button */}
          <motion.button
            onClick={() => setIsShareDialogOpen(true)}
            className="flex items-center gap-2 bg-[#281A41] hover:bg-[#332152] text-white px-4 py-2 rounded-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 size={18} className="text-purple-400" />
            <span>Share</span>
          </motion.button>
        </div>

        {/* Main tabs */}
        <div className="grid grid-cols-4 gap-3 bg-transparent mb-8">
          <TabItem
            icon={<FileText size={18} />}
            label="Access Logs"
            isActive={activeTab === "Access Log"}
            onClick={() => setActiveTab("Access Log")}
            iconColor="text-blue-400"
          />
          <TabItem
            icon={<BarChart2 size={18} />}
            label="Analytics"
            isActive={activeTab === "Analytics"}
            onClick={() => setActiveTab("Analytics")}
            iconColor="text-green-400"
          />
          <TabItem
            icon={<UserPlus size={18} />}
            label="Add User"
            isActive={activeTab === "Add"}
            onClick={() => setActiveTab("Add")}
            iconColor="text-purple-400"
          />
          <TabItem
            icon={<Edit2 size={18} />}
            label="Edit User"
            isActive={activeTab === "Edit"}
            onClick={() => setActiveTab("Edit")}
            iconColor="text-pink-400"
          />
        </div>

        {/* Content area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="bg-[#140D28] rounded-xl p-6 shadow-lg min-h-[500px] border border-blue-500/30"
          >
            {activeTab === "Access Log" && (
              <div className="py-2">
                <LogsPage />
              </div>
            )}

            {activeTab === "Analytics" && (
              <div>
                {/* Header with title and action buttons */}

                {/* Rest of analytics content */}
                <AccessLogsAnalytics />
              </div>
            )}

            {activeTab === "Add" && (
              <div className="py-2">
                <AddUserForm />
              </div>
            )}

            {activeTab === "Edit" && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <User size={24} className="text-pink-400" />
                  <div>
                    <h2 className="text-2xl font-bold">Edit User</h2>
                    <p className="text-gray-400">
                      Update role and access privileges for an existing user
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <EditUserForm />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../themeToggle";
import { useAuth } from "@/app/AuthProvider";

export default function Navbar() {
  const { user, logout, isAuthorized } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scrolling for navbar effects
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  // Add a small padding to main content instead of the body
  useEffect(() => {
    // Apply a small fixed top margin to the main element rather than body padding
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.style.marginTop = '60px'; // Fixed value that matches navbar height
    }

    return () => {
      // Cleanup
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.style.marginTop = '0';
      }
    };
  }, []);

  // Don't render the navbar on login page
  if (pathname === '/login') {
    return null;
  }

  // Only render if user is authorized
  if (!isAuthorized()) {
    return null;
  }

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-[#0E0B21] border-b border-[#262042] h-[60px]"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto h-full">
        {/* Desktop Navigation */}
        <div className="flex items-center justify-between h-full">
          {/* Logo and Brand */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="h-10 w-10 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-xl relative overflow-hidden"
              whileHover={{ 
                rotate: [-2, 2, 0],
                transition: { duration: 0.5 }
              }}
            >
              <motion.div 
                className="absolute inset-0 bg-blue-500"
                animate={{ 
                  background: ["#2563eb", "#3b82f6", "#2563eb"]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                }}
              />
              <span className="relative z-10">NT</span>
            </motion.div>
            <div>
              <Link href="/" className="flex flex-col">
                <motion.span 
                  className="text-xl font-bold tracking-tight text-white"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  NusTAC
                </motion.span>
                <motion.span 
                  className="text-xs text-gray-400 -mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Admin Portal
                </motion.span>
              </Link>
            </div>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center">
            <div className="flex mr-6">
              {[
                { path: '/', label: 'Dashboard' },
                { path: '/users', label: 'Users' },
                { path: '/contact', label: 'Contact Us' },
                { path: '/about', label: 'About' }
              ].map((item, index) => (
                <motion.div 
                  key={item.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.2 }}
                >
                  <Link
                    href={item.path}
                    className={`px-4 py-2 mx-1 font-medium text-sm relative ${
                      pathname === item.path 
                        ? "text-blue-400" 
                        : "text-gray-300 hover:text-white transition-colors"
                    }`}
                  >
                    {item.label}
                    {pathname === item.path && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="flex items-center space-x-4 border-l border-[#262042] pl-6">
              <motion.div 
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
              >
                <ModeToggle />
              </motion.div>
              
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-2 bg-[#281A41] hover:bg-[#342E54] text-white border border-[#342E54]/50"
                      >
                        <User className="h-4 w-4" />
                        <span>{user.username}</span>
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 bg-[#1A1730] border border-[#342E54] text-white"
                  >
                    <DropdownMenuItem className="text-gray-400 focus:text-white focus:bg-[#342E54]">
                      <span className="capitalize">{user.role}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#342E54]" />
                    <DropdownMenuItem 
                      onClick={logout} 
                      className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-[#342E54]"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <ModeToggle />
            </motion.div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <motion.div
                animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </motion.div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="md:hidden bg-[#12101F] absolute left-0 right-0 top-[60px] border-t border-[#342E54]"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto py-3 space-y-1">
                {[
                  { path: '/', label: 'Dashboard' },
                  { path: '/users', label: 'Users' },
                  { path: '/contact', label: 'Contact Us' },
                  { path: '/about', label: 'About' }
                ].map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.2 }}
                  >
                    <Link
                      href={item.path}
                      className={`block px-4 py-2 rounded-md text-base font-medium ${
                        pathname === item.path 
                          ? "text-blue-400 bg-[#281A41]" 
                          : "text-gray-300 hover:bg-[#281A41] hover:text-white"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                
                {user && (
                  <>
                    <motion.div 
                      className="px-4 py-2 text-gray-400 flex items-center mt-4 border-t border-[#342E54]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      <span>{user.username}</span>
                      <span className="text-xs ml-2 px-2 py-0.5 bg-[#281A41] rounded-full capitalize">{user.role}</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button 
                        variant="ghost" 
                        onClick={logout} 
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-[#281A41] px-4"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Logout</span>
                      </Button>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Subtle background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/5"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: Math.random() * 50 + 10,
              height: Math.random() * 50 + 10,
            }}
            animate={{
              opacity: [0.2, 0.3, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>
    </motion.nav>
  );
}
"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Github, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  // Create refs for animations
  const [footerRef, footerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const staggerChildrenVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Custom hover variants for different social platforms
  const githubHoverVariants = {
    hover: { 
      scale: 1.2,
      color: "#333",
      transition: { duration: 0.3 }
    }
  };

  const linkedinHoverVariants = {
    hover: { 
      scale: 1.2,
      color: "#0077B5",
      transition: { duration: 0.3 }
    }
  };

  const instagramHoverVariants = {
    hover: { 
      scale: 1.2,
      color: "#E1306C",
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.footer 
      ref={footerRef}
      initial="hidden"
      animate={footerInView ? "visible" : "hidden"}
      variants={fadeInUpVariants}
      className="border-t py-12 bg-gradient-to-b from-muted/40 to-background"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          variants={staggerChildrenVariants}
        >
          {/* Column 1 - Logo and description */}
          <motion.div className="space-y-3" variants={fadeInUpVariants}>
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="h-10 w-10 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl dark:text-white relative overflow-hidden"
                whileHover={{
                  boxShadow: "0 0 15px var(--color-primary)"
                }}
              >
                <span>NT</span>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">NusTAC</span>
                <span className="text-xs text-muted-foreground">Admin Portal</span>
              </div>
            </motion.div>
            <p className="text-sm text-muted-foreground mt-2">
              A comprehensive campus access management system designed for the National University of Sciences and Technology (NUST).
            </p>
            <motion.div 
              className="flex space-x-4 pt-2"
              variants={staggerChildrenVariants}
            >
              <motion.a
                href="https://github.com/nustac"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
                whileHover="hover"
                variants={githubHoverVariants}
              >
                <Github size={20} />
              </motion.a>
              <motion.a
                href="https://linkedin.com/company/nustac"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
                whileHover="hover"
                variants={linkedinHoverVariants}
              >
                <Linkedin size={20} />
              </motion.a>
              <motion.a
                href="https://instagram.com/nustac"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
                whileHover="hover"
                variants={instagramHoverVariants}
              >
                <Instagram size={20} />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Column 2 - Quick Links */}
          <motion.div variants={fadeInUpVariants}>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <motion.ul 
              className="space-y-3"
              variants={staggerChildrenVariants}
            >
              {[
                { path: "/", label: "Dashboard" },
                { path: "/users", label: "Users" },
                { path: "/about", label: "About" },
                { path: "/contact", label: "Contact" }
              ].map((link) => (
                <motion.li
                  key={link.path}
                  variants={fadeInUpVariants}
                  whileHover={{
                    x: 5,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Link 
                    href={link.path} 
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm group flex items-center"
                  >
                    <motion.span
                      className="inline-block w-0 h-[1px] bg-primary mr-0 group-hover:w-2 group-hover:mr-2"
                      transition={{ duration: 0.2 }}
                    />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Column 3 - Developers */}
          <motion.div variants={fadeInUpVariants}>
            <h3 className="text-lg font-semibold mb-4">Development Team</h3>
            <motion.ul 
              className="space-y-3"
              variants={staggerChildrenVariants}
            >
              {[
                { 
                  name: "Ali Abdullah", 
                  links: [
                    { icon: <Github size={16} />, url: "https://github.com/ali-abdullah9", variant: githubHoverVariants },
                    { icon: <Linkedin size={16} />, url: "https://www.linkedin.com/in/ali-abdullah-75682027a/", variant: linkedinHoverVariants },
                    { icon: <Instagram size={16} />, url: "https://www.instagram.com/ali_ab_dullah_/", variant: instagramHoverVariants }
                  ]
                },
                { 
                  name: "Syed Fahad Shah", 
                  links: [
                    { icon: <Github size={16} />, url: "https://github.com/faahad43", variant: githubHoverVariants },
                    { icon: <Linkedin size={16} />, url: "https://www.linkedin.com/in/faahad43/", variant: linkedinHoverVariants },
                    { icon: <Instagram size={16} />, url: "https://www.instagram.com/faahad_43", variant: instagramHoverVariants }
                  ]
                },
                { 
                  name: "Rehan Haider", 
                  links: [
                    { icon: <Github size={16} />, url: "https://github.com/rehan-hdr", variant: githubHoverVariants },
                    { icon: <Linkedin size={16} />, url: "https://www.linkedin.com/in/rehan-haider-28867828a", variant: linkedinHoverVariants },
                    { icon: <Instagram size={16} />, url: "https://www.instagram.com/rehanhaider.0/", variant: instagramHoverVariants }
                  ]
                }
              ].map((dev, index) => (
                <motion.li 
                  key={index} 
                  className="flex justify-between items-center p-2 rounded-lg hover:bg-background transition-colors"
                  variants={fadeInUpVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-sm">{dev.name}</span>
                  <div className="flex space-x-2">
                    {dev.links.map((link, lIndex) => (
                      <motion.a 
                        key={lIndex}
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-muted-foreground transition-colors"
                        whileHover="hover"
                        variants={link.variant}
                      >
                        {link.icon}
                      </motion.a>
                    ))}
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Column 4 - Contact */}
          <motion.div variants={fadeInUpVariants}>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <motion.ul 
              className="space-y-3"
              variants={staggerChildrenVariants}
            >
              {[
                { 
                  icon: <Mail className="h-4 w-4 mr-2 text-primary" />, 
                  content: "contact@nustac.edu.pk" 
                },
                { 
                  icon: <Phone className="h-4 w-4 mr-2 text-primary" />, 
                  content: "+92-51-1234567" 
                },
                { 
                  icon: <MapPin className="h-4 w-4 mr-2 mt-0.5 text-primary" />, 
                  content: "SEECS Building, NUST H-12 Campus, Islamabad, Pakistan" 
                }
              ].map((item, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start text-sm text-muted-foreground"
                  variants={fadeInUpVariants}
                  whileHover={{ x: 3 }}
                >
                  <motion.span 
                    whileHover={{ 
                      rotate: [-5, 5, 0],
                      transition: { duration: 0.3 }
                    }}
                  >
                    {item.icon}
                  </motion.span>
                  <span className="flex-1">{item.content}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>

        {/* Copyright - removed "Made with love" part */}
        <motion.div 
          className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground"
          variants={fadeInUpVariants}
        >
          <p>
            © {new Date().getFullYear().toString()} NusTAC - National University of Sciences and Technology
          </p>
          <p className="mt-1">All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
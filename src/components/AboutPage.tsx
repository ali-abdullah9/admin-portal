"use client";

import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ThreeJsMajesticBadge from "./ThreeJsMajesticBadge";
import { 
  Users, 
  Clock, 
  Shield, 
  Database, 
  UserCog,
  Star,
  Github, 
  Linkedin, 
  Instagram, 
  MapPin,
  Mail,
  Phone
} from "lucide-react";

export default function AboutPage() {
  // Function to create intersection observer refs for animations
  const useAnimateInView = (threshold = 0.1) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold, triggerOnce: true });
    
    useEffect(() => {
      if (inView) {
        controls.start("visible");
      }
    }, [controls, inView]);
    
    return { ref, controls };
  };
  
  // Create individual animations for different sections
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ref: heroRef, controls: heroControls } = useAnimateInView(0.1);
  const { ref: overviewRef, controls: overviewControls } = useAnimateInView(0.1);
  const { ref: componentsRef, controls: componentsControls } = useAnimateInView(0.1);
  const { ref: teamRef, controls: teamControls } = useAnimateInView(0.1);
  const { ref: contactRef, controls: contactControls } = useAnimateInView(0.1);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };
  
  
  const starItemVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 20px rgba(59, 130, 246, 0.2)",
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100
      }
    }
  };
  
  const componentCardVariants = {
    hidden: { scale: 0.9, opacity: 0, y: 30 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    },
    hover: {
      y: -10,
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100
      }
    }
  };
  
  const personCardVariants = {
    hidden: { scale: 0.9, opacity: 0, y: 30 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    },
    hover: {
      y: -10,
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100
      }
    }
  };
  
  const iconContainerVariants = {
    hover: {
      rotate: [0, -10, 10, 0],
      transition: {
        duration: 0.5
      }
    }
  };
  
  const headingVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };
  
  return (
    <div className="p-8 ">
      <motion.h1 
        className="text-4xl font-bold mb-8 text-center text-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        About NusTAC
      </motion.h1>
      
      {/* Enhanced 3D Badge Display with animation */}
      <motion.div 
        className="mb-16 max-w-5xl mx-auto shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
        ref={heroRef}
      >
        <ThreeJsMajesticBadge />
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={overviewControls}
        ref={overviewRef}
      >
        <motion.div 
          className="bg-card/30 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/20"
          variants={cardVariants}
          whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-primary flex items-center">
            <Shield className="mr-2 h-6 w-6" />
            <span>System Overview</span>
          </h2>
          <motion.p className="mb-6 text-muted-foreground leading-relaxed" variants={itemVariants}>
            NusTAC (NUST Access Control) is a comprehensive campus access management system designed for the National University of Sciences and Technology (NUST) in Islamabad, Pakistan.
          </motion.p>
          <motion.p className="mb-6 text-muted-foreground leading-relaxed" variants={itemVariants}>
            Our system provides secure, efficient, and highly adaptable access control for various university departments, labs, classrooms, and administrative facilities across the campus.
          </motion.p>
          <motion.p className="text-muted-foreground leading-relaxed" variants={itemVariants}>
            With real-time monitoring, detailed access logs, and powerful analytics, NusTAC ensures that only authorized personnel can access specific areas, enhancing campus security while maintaining accessibility.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="bg-card/30 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/20"
          variants={cardVariants}
          whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-primary flex items-center">
            <Star className="mr-2 h-6 w-6" />
            <span>Key Features</span>
          </h2>
          <motion.ul className="space-y-4" variants={containerVariants}>
            {[
              { icon: <Shield size={18} />, text: "QR-based authentication using hybrid encryption (Kyber and AES)" },
              { icon: <Clock size={18} />, text: "Time-limited access tokens (5-minute session time)" },
              { icon: <UserCog size={18} />, text: "Role-based access control for staff, faculty, students, and visitors" },
              { icon: <Database size={18} />, text: "Department-specific permissions management" },
              { icon: <Shield size={18} />, text: "Real-time access tracking and comprehensive analytics" },
              { icon: <Star size={18} />, text: "Multi-platform ecosystem (web admin, mobile app, scanner)" }
            ].map((feature, index) => (
              <motion.li 
                key={index} 
                className="flex items-start"
                variants={starItemVariants}
                whileHover="hover"
              >
                <motion.div 
                  className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5 shadow-inner"
                  variants={iconContainerVariants}
                  whileHover="hover"
                >
                  <span className="text-primary text-lg">{feature.icon}</span>
                </motion.div>
                <span className="text-lg">{feature.text}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>
      <motion.div 
  className="mb-16 max-w-6xl mx-auto"
  variants={containerVariants}
  initial="hidden"
  animate={componentsControls}
  ref={componentsRef}
>
  <motion.h2 
    className="text-2xl font-semibold mb-8 text-center text-primary"
    variants={headingVariants}
  >
    System Components
  </motion.h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {[
      {
        number: 1,
        title: "Admin Portal",
        description: "A comprehensive web dashboard for administrators to manage users, view access logs, analyze usage patterns, and configure system settings.",
        features: ["User Management", "Access Logs", "Analytics", "System Settings"]
      },
      {
        number: 2,
        title: "Mobile Application",
        description: "Allows users to generate secure, encrypted QR codes with a 5-minute validity period. Users can also view their personal access logs and manage their profile.",
        features: ["QR Generation", "5-min Session", "Access History", "User Profile"]
      },
      {
        number: 3,
        title: "Scanner Application",
        description: "Installed at entry points to scan and decrypt user QR codes, verify access permissions for specific rooms, and record entry attempts in the access logs.",
        features: ["QR Scanning", "Decryption", "Access Verification", "Log Recording"]
      }
    ].map((component, index) => (
      <motion.div
        key={index}
        className="bg-card/30 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/20 group hover:bg-primary/5 transition-all"
        variants={componentCardVariants}
        whileHover="hover"
      >
        <motion.div 
          className="h-16 w-16 rounded-full bg-primary/30 flex items-center justify-center text-primary text-2xl font-bold mb-6 mx-auto shadow-inner group-hover:shadow-primary/30 transition-all"
          whileHover={{ 
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.5 }
          }}
        >
          {component.number}
        </motion.div>
        <motion.h3 
          className="text-xl font-medium mb-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 * index, duration: 0.5 }}
        >
          {component.title}
        </motion.h3>
        <motion.p 
          className="text-muted-foreground mb-6 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 * index, duration: 0.5 }}
        >
          {component.description}
        </motion.p>
        <div className="grid grid-cols-2 gap-3">
          {component.features.map((feature, featureIndex) => (
            <motion.div 
              key={featureIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 * index + 0.1 * featureIndex, duration: 0.3 }}
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "var(--color-primary-foreground)",
                color: "var(--color-primary)"
              }}
              className="bg-primary/10 rounded-lg p-3 text-sm text-center font-medium shadow-sm"
            >
              {feature}
            </motion.div>
          ))}
        </div>
      </motion.div>
    ))}
  </div>
</motion.div>
      
<motion.div 
  className="mb-16 max-w-6xl mx-auto"
  variants={containerVariants}
  initial="hidden"
  animate={teamControls}
  ref={teamRef}
>
  <motion.h2 
    className="text-2xl font-semibold mb-8 text-center text-primary"
    variants={headingVariants}
  >
    Development Team
  </motion.h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {[
      {
        initials: "AA",
        name: "Ali Abdullah",
        role: "Admin Portal Development",
        socials: [
          { icon: <Github size={24} />, url: "https://github.com/ali-abdullah9" },
          { icon: <Linkedin size={24} />, url: "https://www.linkedin.com/in/ali-abdullah-75682027a/" },
          { icon: <Instagram size={24} />, url: "https://www.instagram.com/ali_ab_dullah_/" }
        ]
      },
      {
        initials: "FS",
        name: "Syed Fahad Shah",
        role: "Mobile QR Generation",
        socials: [
          { icon: <Github size={24} />, url: "https://github.com/faahad43" },
          { icon: <Linkedin size={24} />, url: "https://www.linkedin.com/in/faahad43/" },
          { icon: <Instagram size={24} />, url: "https://www.instagram.com/faahad_43" }
        ]
      },
      {
        initials: "RH",
        name: "Rehan Haider",
        role: "Scanner Application",
        socials: [
          { icon: <Github size={24} />, url: "https://github.com/rehan-hdr" },
          { icon: <Linkedin size={24} />, url: "https://www.linkedin.com/in/rehan-haider-28867828a" },
          { icon: <Instagram size={24} />, url: "https://www.instagram.com/rehanhaider.0/" }
        ]
      }
    ].map((person, index) => (
      <motion.div
        key={index}
        className="bg-card/30 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/20 group hover:bg-primary/5 transition-all"
        variants={personCardVariants}
        whileHover="hover"
        initial="hidden"
        animate="visible"
        custom={index}
      >
        <motion.div
          className="relative h-32 w-32 bg-primary/20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-primary/30 transition-all overflow-hidden"
          whileHover={{ 
            boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
            scale: 1.05
          }}
        >
          <span className="text-primary text-3xl font-bold relative z-10">{person.initials}</span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-primary/0 to-primary/30"
            animate={{
              y: ["100%", "0%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: index * 0.5,
            }}
          />
        </motion.div>
        <motion.h3 
          className="text-xl font-medium mb-2 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          {person.name}
        </motion.h3>
        <motion.p 
          className="text-center text-primary/80 font-medium mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + index * 0.1 }}
        >
          {person.role}
        </motion.p>
        <motion.div 
          className="flex justify-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + index * 0.1 }}
        >
          {person.socials.map((social, socialIndex) => (
            <motion.a
              key={socialIndex}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              whileHover={{ 
                scale: 1.2,
                rotate: [0, -15, 15, 0],
                transition: { duration: 0.5 }
              }}
            >
              {social.icon}
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    ))}
  </div>
</motion.div>
      
<motion.div 
  className="mb-16 max-w-6xl mx-auto"
  variants={containerVariants}
  initial="hidden"
  animate={contactControls}
  ref={contactRef}
>
  <motion.div 
    className="bg-card/30 backdrop-blur-sm rounded-xl p-10 shadow-lg border border-primary/20"
    variants={cardVariants}
    whileHover={{ 
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      y: -5
    }}
  >
    <motion.h2 
      className="text-2xl font-semibold mb-8 text-center text-primary"
      variants={headingVariants}
    >
      Contact Information
    </motion.h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <motion.div 
        className="bg-background/50 p-6 rounded-lg shadow-inner"
        variants={cardVariants}
        whileHover={{ 
          scale: 1.03,
          transition: { type: "spring", stiffness: 300, damping: 10 }
        }}
      >
        <h3 className="text-xl font-medium mb-4 text-primary/90 flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          Technical Support
        </h3>
        <motion.p 
          className="flex items-center text-lg text-muted-foreground mb-3"
          variants={itemVariants}
        >
          <Phone className="mr-3 h-5 w-5 text-primary/70" />
          +92-51-1234567
        </motion.p>
        <motion.p 
          className="flex items-center text-lg text-muted-foreground mb-3"
          variants={itemVariants}
        >
          <Mail className="mr-3 h-5 w-5 text-primary/70" />
          support@nustac.edu.pk
        </motion.p>
        <motion.p 
          className="flex items-center text-lg text-muted-foreground"
          variants={itemVariants}
        >
          <Clock className="mr-3 h-5 w-5 text-primary/70" />
          Monday-Friday, 9am-5pm
        </motion.p>
      </motion.div>
            
      <motion.div 
        className="bg-background/50 p-6 rounded-lg shadow-inner"
        variants={cardVariants}
        whileHover={{ 
          scale: 1.03,
          transition: { type: "spring", stiffness: 300, damping: 10 }
        }}
      >
        <h3 className="text-xl font-medium mb-4 text-primary/90 flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Administration
        </h3>
        <motion.p 
          className="flex items-center text-lg text-muted-foreground mb-3"
          variants={itemVariants}
        >
          <Phone className="mr-3 h-5 w-5 text-primary/70" />
          +92-51-7654321
        </motion.p>
        <motion.p 
          className="flex items-center text-lg text-muted-foreground mb-3"
          variants={itemVariants}
        >
          <Mail className="mr-3 h-5 w-5 text-primary/70" />
          admin@nustac.edu.pk
        </motion.p>
        <motion.p 
          className="flex items-center text-lg text-muted-foreground"
          variants={itemVariants}
        >
          <MapPin className="mr-3 h-5 w-5 text-primary/70" />
          SEECS Building, H-12 Campus
        </motion.p>
      </motion.div>
    </div>
  </motion.div>
</motion.div>
</div>
  );
}
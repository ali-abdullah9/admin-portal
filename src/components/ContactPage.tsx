"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Github, 
  Linkedin, 
  Instagram,
  Check, 
  User,
  Users
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    subject: "",
    message: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Animation controls
  const formControls = useAnimation();
  const infoControls = useAnimation();
  const teamControls = useAnimation();
  
  // Create intersection observer refs
  const [formRef, formInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [infoRef, infoInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [teamRef, teamInView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  // Start animations when sections come into view
  useEffect(() => {
    if (formInView) formControls.start("visible");
    if (infoInView) infoControls.start("visible");
    if (teamInView) teamControls.start("visible");
  }, [formControls, infoControls, teamControls, formInView, infoInView, teamInView]);

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
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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
  
  const cardVariants = {
    hidden: { scale: 0.96, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100
      }
    }
  };
  
  const iconHoverVariants = {
    hover: { 
      scale: 1.2, 
      rotate: [0, -10, 10, 0],
      color: "var(--color-primary)",
      transition: { 
        duration: 0.3,
        type: "spring",
        stiffness: 300
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      department: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    try {
      // Replace with actual form submission logic
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("Message sent", {
        description: "We'll get back to you as soon as possible.",
      });
      
      setSubmitted(true);
      
      // Reset form after animation completes
      setTimeout(() => {
        // Reset form
        setFormData({
          name: "",
          email: "",
          department: "",
          subject: "",
          message: ""
        });
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      toast.error("Error sending message", {
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <motion.h1 
        className="text-3xl font-bold mb-8 relative overflow-hidden pb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span>Contact Us</span>
        <motion.div 
          className="absolute bottom-0 left-0 h-1 bg-primary"
          initial={{ width: 0 }}
          animate={{ width: "3rem" }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
      </motion.h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
        <motion.div 
          className="lg:col-span-2"
          ref={formRef}
          initial="hidden"
          animate={formControls}
          variants={containerVariants}
        >
          <motion.div variants={cardVariants}>
            <Card className="bg-card/30 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-primary" />
                  <span>Send a Message</span>
                </CardTitle>
                <CardDescription>
                  Fill out the form below to get in touch with our team. We'll respond as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                      <div className="relative">
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="bg-background/50 pl-10 transition-all focus:border-primary/50"
                        />
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                    </motion.div>
                    
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="bg-background/50 pl-10 transition-all focus:border-primary/50"
                        />
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                    </motion.div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="department" className="text-sm font-medium">Department</Label>
                      <Select
                        value={formData.department}
                        onValueChange={handleSelectChange}
                      >
                        <SelectTrigger id="department" className="bg-background/50 transition-all focus:border-primary/50">
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="administration">Administration</SelectItem>
                          <SelectItem value="security">Security Team</SelectItem>
                          <SelectItem value="development">Development Team</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                    
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                      <div className="relative">
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="Brief subject of your message"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="bg-background/50 transition-all focus:border-primary/50"
                        />
                      </div>
                    </motion.div>
                  </div>
                  
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your detailed message..."
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={8}
                      required
                      className="bg-background/50 transition-all focus:border-primary/50"
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="flex justify-end"
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit" 
                      disabled={loading || submitted}
                      className="w-full md:w-auto relative overflow-hidden group dark:text-white"
                    >
                      <motion.span 
                        className="flex items-center justify-center relative z-10"
                        animate={{
                          x: submitted ? -5 : 0,
                        }}
                      >
                        {loading ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                            <span>Sending...</span>
                          </>
                        ) : submitted ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            <span>Sent!</span>
                          </>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <motion.span
                              className="inline-block ml-2"
                              animate={{ 
                                x: [0, 5, 0],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut"
                              }}
                            >
                              <Send className="h-4 w-4" />
                            </motion.span>
                          </>
                        )}
                      </motion.span>
                      
                      <motion.div 
                        className="absolute inset-0 bg-primary/10"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: loading ? "100%" : submitted ? "100%" : "0%"
                        }}
                        transition={{ duration: loading ? 1.5 : 0.3 }}
                      />
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        <motion.div
          ref={infoRef}
          initial="hidden"
          animate={infoControls}
          variants={containerVariants}
        >
          <motion.div 
            className="mb-6" 
            variants={cardVariants}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
          >
            <Card className="bg-card/30 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  <span>Contact Information</span>
                </CardTitle>
                <CardDescription>
                  Reach out to us directly using the information below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div 
                  className="flex items-start"
                  variants={itemVariants}
                  whileHover={{ x: 3, transition: { duration: 0.3 } }}
                >
                  <motion.div
                    whileHover={{ 
                      rotate: [0, -15, 15, 0],
                      transition: { duration: 0.5 }
                    }}
                  >
                    <Mail className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">contact@nustac.edu.pk</p>
                    <p className="text-sm text-muted-foreground">support@nustac.edu.pk</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  variants={itemVariants}
                  whileHover={{ x: 3, transition: { duration: 0.3 } }}
                >
                  <motion.div
                    whileHover={{ 
                      rotate: [0, -15, 15, 0],
                      transition: { duration: 0.5 }
                    }}
                  >
                    <Phone className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-sm text-muted-foreground">+92-51-1234567 (General)</p>
                    <p className="text-sm text-muted-foreground">+92-51-7654321 (Technical Support)</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  variants={itemVariants}
                  whileHover={{ x: 3, transition: { duration: 0.3 } }}
                >
                  <motion.div
                    whileHover={{ 
                      rotate: [0, -15, 15, 0],
                      transition: { duration: 0.5 }
                    }}
                  >
                    <MapPin className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-sm text-muted-foreground">School of Electrical Engineering & Computer Science (SEECS)</p>
                    <p className="text-sm text-muted-foreground">National University of Sciences & Technology (NUST)</p>
                    <p className="text-sm text-muted-foreground">H-12, Islamabad, Pakistan</p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            ref={teamRef}
            initial="hidden"
            animate={teamControls}
            variants={cardVariants}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
          >
            <Card className="bg-card/30 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  <span>Development Team</span>
                </CardTitle>
                <CardDescription>
                  Connect with our team members.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "Ali Abdullah", socials: [
                    { icon: <Github size={18} />, url: "https://github.com/ali-abdullah9" },
                    { icon: <Linkedin size={18} />, url: "https://www.linkedin.com/in/ali-abdullah-75682027a/" },
                    { icon: <Instagram size={18} />, url: "https://www.instagram.com/ali_ab_dullah_/" }
                  ]},
                  { name: "Syed Fahad Shah", socials: [
                    { icon: <Github size={18} />, url: "https://github.com/faahad43" },
                    { icon: <Linkedin size={18} />, url: "https://www.linkedin.com/in/faahad43/" },
                    { icon: <Instagram size={18} />, url: "https://www.instagram.com/faahad_43" }
                  ]},
                  { name: "Rehan Haider", socials: [
                    { icon: <Github size={18} />, url: "https://github.com/rehan-hdr" },
                    { icon: <Linkedin size={18} />, url: "https://www.linkedin.com/in/rehan-haider-28867828a" },
                    { icon: <Instagram size={18} />, url: "https://www.instagram.com/rehanhaider.0/" }
                  ]}
                ].map((person, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 transition-colors"
                    variants={itemVariants}
                    whileHover={{ x: 3, scale: 1.02, transition: { duration: 0.3 } }}
                  >
                    <motion.p 
                      className="flex items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <motion.div 
                        className="h-8 w-8 rounded-full bg-primary/10 mr-2 flex items-center justify-center"
                        whileHover={{
                          backgroundColor: "var(--color-primary)",
                          color: "var(--color-primary-foreground)",
                          scale: 1.1,
                          transition: { duration: 0.3 }
                        }}
                      >
                        {person.name.charAt(0)}
                      </motion.div>
                      {person.name}
                    </motion.p>
                    <div className="flex space-x-2">
                      {person.socials.map((social, socialIndex) => (
                        <motion.a
                          key={socialIndex}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                          whileHover="hover"
                          variants={iconHoverVariants}
                        >
                          {social.icon}
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Github, 
  Linkedin, 
  Instagram 
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
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        department: "",
        subject: "",
        message: ""
      });
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
      <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>
                Fill out the form below to get in touch with our team. We'll respond as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger id="department">
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
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Brief subject of your message"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your detailed message..."
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={8}
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={loading} className="w-full md:w-auto dark: text-white">
                    {loading ? "Sending..." : "Send Message"}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="shadow-sm mb-6">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Reach out to us directly using the information below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm text-muted-foreground">contact@nustac.edu.pk</p>
                  <p className="text-sm text-muted-foreground">support@nustac.edu.pk</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-sm text-muted-foreground">+92-51-1234567 (General)</p>
                  <p className="text-sm text-muted-foreground">+92-51-7654321 (Technical Support)</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-sm text-muted-foreground">School of Electrical Engineering & Computer Science (SEECS)</p>
                  <p className="text-sm text-muted-foreground">National University of Sciences & Technology (NUST)</p>
                  <p className="text-sm text-muted-foreground">H-12, Islamabad, Pakistan</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Development Team</CardTitle>
              <CardDescription>
                Connect with our team members.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p>Ali Abdullah</p>
                <div className="flex space-x-2">
                  <a href="https://github.com/ali-abdullah9" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Github size={18} />
                  </a>
                  <a href="https://www.linkedin.com/in/ali-abdullah-75682027a/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin size={18} />
                  </a>
                  <a href="https://www.instagram.com/ali_ab_dullah_/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Instagram size={18} />
                  </a>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <p>Syed Fahad Shah</p>
                <div className="flex space-x-2">
                  <a href="https://github.com/faahad43" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Github size={18} />
                  </a>
                  <a href="https://www.linkedin.com/in/faahad43/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin size={18} />
                  </a>
                  <a href="https://www.instagram.com/faahad_43" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Instagram size={18} />
                  </a>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <p>Rehan Haider</p>
                <div className="flex space-x-2">
                  <a href="https://github.com/rehan-hdr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Github size={18} />
                  </a>
                  <a href="www.linkedin.com/in/rehan-haider-28867828a" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin size={18} />
                  </a>
                  <a href="https://www.instagram.com/rehanhaider.0/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Instagram size={18} />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
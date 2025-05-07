"use client";

import React from "react";
import Link from "next/link";
import { Github, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t py-8 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 - Logo and description */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl dark: text-white">
                NT
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">NusTAC</span>
                <span className="text-xs text-muted-foreground">Admin Portal</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              A comprehensive campus access management system designed for the National University of Sciences and Technology (NUST).
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://github.com/nustac" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com/company/nustac" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://instagram.com/nustac" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/users" 
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Users
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Developers */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Development Team</h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span className="text-sm">Ali Abdullah</span>
                <div className="flex space-x-2">
                  <a href="https://github.com/ali-abdullah9" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Github size={16} />
                  </a>
                  <a href="https://www.linkedin.com/in/ali-abdullah-75682027a/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin size={16} />
                  </a>
                  <a href="https://www.instagram.com/ali_ab_dullah_/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Instagram size={16} />
                  </a>
                </div>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-sm">Syed Fahad Shah</span>
                <div className="flex space-x-2">
                  <a href="https://github.com/faahad43" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Github size={16} />
                  </a>
                  <a href="https://www.linkedin.com/in/faahad43/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin size={16} />
                  </a>
                  <a href="https://www.instagram.com/faahad_43" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Instagram size={16} />
                  </a>
                </div>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-sm">Rehan Haider</span>
                <div className="flex space-x-2">
                  <a href="https://github.com/rehan-hdr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Github size={16} />
                  </a>
                  <a href="https://www.linkedin.com/in/rehan-haider-28867828a" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin size={16} />
                  </a>
                  <a href="https://www.instagram.com/rehanhaider.0/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Instagram size={16} />
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2 text-primary" />
                <span>contact@nustac.edu.pk</span>
              </li>
              <li className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                <span>+92-51-1234567</span>
              </li>
              <li className="flex items-start text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span className="flex-1">SEECS Building, NUST H-12 Campus, Islamabad, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear().toString()} NusTAC - National University of Sciences and Technology</p>
          <p className="mt-1">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
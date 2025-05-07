"use client";

import React from "react";
import Link from "next/link";
import { Github, Linkedin, Instagram } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">About NusTAC</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-primary">System Overview</h2>
          <p className="mb-4 text-muted-foreground">
            NusTAC (NUST Access Control) is a comprehensive campus access management system designed for the National University of Sciences and Technology (NUST) in Islamabad, Pakistan.
          </p>
          <p className="mb-4 text-muted-foreground">
            Our system provides secure, efficient, and highly adaptable access control for various university departments, labs, classrooms, and administrative facilities across the campus.
          </p>
          <p className="text-muted-foreground">
            With real-time monitoring, detailed access logs, and powerful analytics, NusTAC ensures that only authorized personnel can access specific areas, enhancing campus security while maintaining accessibility.
          </p>
        </div>
        
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-primary">Key Features</h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-primary text-sm">✓</span>
              </div>
              <span>QR-based authentication using hybrid encryption (Kyber and AES)</span>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-primary text-sm">✓</span>
              </div>
              <span>Time-limited access tokens (5-minute session time)</span>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-primary text-sm">✓</span>
              </div>
              <span>Role-based access control for staff, faculty, students, and visitors</span>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-primary text-sm">✓</span>
              </div>
              <span>Department-specific permissions management</span>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-primary text-sm">✓</span>
              </div>
              <span>Real-time access tracking and comprehensive analytics</span>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-primary text-sm">✓</span>
              </div>
              <span>Multi-platform ecosystem (web admin, mobile app, scanner)</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-primary">System Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg p-6 shadow-sm border border-primary/20">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold mb-4">1</div>
            <h3 className="text-lg font-medium mb-2">Admin Portal</h3>
            <p className="text-sm text-muted-foreground mb-4">
              A comprehensive web dashboard for administrators to manage users, view access logs, analyze usage patterns, and configure system settings.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted rounded p-2 text-xs">User Management</div>
              <div className="bg-muted rounded p-2 text-xs">Access Logs</div>
              <div className="bg-muted rounded p-2 text-xs">Analytics</div>
              <div className="bg-muted rounded p-2 text-xs">System Settings</div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm border border-primary/20">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold mb-4">2</div>
            <h3 className="text-lg font-medium mb-2">Mobile Application</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Allows users to generate secure, encrypted QR codes with a 5-minute validity period. Users can also view their personal access logs and manage their profile.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted rounded p-2 text-xs">QR Generation</div>
              <div className="bg-muted rounded p-2 text-xs">5-min Session</div>
              <div className="bg-muted rounded p-2 text-xs">Access History</div>
              <div className="bg-muted rounded p-2 text-xs">User Profile</div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm border border-primary/20">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold mb-4">3</div>
            <h3 className="text-lg font-medium mb-2">Scanner Application</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Installed at entry points to scan and decrypt user QR codes, verify access permissions for specific rooms, and record entry attempts in the access logs.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted rounded p-2 text-xs">QR Scanning</div>
              <div className="bg-muted rounded p-2 text-xs">Decryption</div>
              <div className="bg-muted rounded p-2 text-xs">Access Verification</div>
              <div className="bg-muted rounded p-2 text-xs">Log Recording</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-primary">How It Works</h2>
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <div className="flex flex-col space-y-6">
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-4 mt-1">1</div>
              <div>
                <h3 className="font-medium mb-1">User Registration & Access Assignment</h3>
                <p className="text-sm text-muted-foreground">Administrators create user accounts and assign access permissions through the Admin Portal. Users are given credentials to log in to the mobile app.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-4 mt-1">2</div>
              <div>
                <h3 className="font-medium mb-1">QR Code Generation</h3>
                <p className="text-sm text-muted-foreground">Users log into the mobile app and generate an encrypted QR code when they need to access a room. The QR code contains their credentials and is encrypted using a hybrid Kyber/AES scheme. This QR code is valid for only 5 minutes.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-4 mt-1">3</div>
              <div>
                <h3 className="font-medium mb-1">Access Verification</h3>
                <p className="text-sm text-muted-foreground">At the room's entry point, the Scanner App scans and decrypts the QR code, verifies the user's permissions for that specific room, and either grants or denies access. Each attempt is recorded in the access logs database.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-4 mt-1">4</div>
              <div>
                <h3 className="font-medium mb-1">Monitoring & Analytics</h3>
                <p className="text-sm text-muted-foreground">Administrators can view all access attempts through the Admin Portal, analyze usage patterns, and adjust permissions as needed. Users can view their personal access history through the mobile app.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-primary">Security Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="font-medium mb-3">Hybrid Encryption</h3>
            <p className="text-sm text-muted-foreground">
              NusTAC employs a cutting-edge hybrid encryption scheme using Kyber (a post-quantum key encapsulation mechanism) and AES for data encryption, ensuring security even against quantum computing threats.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="font-medium mb-3">Time-Limited Tokens</h3>
            <p className="text-sm text-muted-foreground">
              All access QR codes expire after 5 minutes, minimizing the risk of unauthorized access through code sharing or theft. Each code can only be used once.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="font-medium mb-3">Granular Permissions</h3>
            <p className="text-sm text-muted-foreground">
              Access permissions are highly specific, allowing administrators to control access to individual rooms for specific users, based on their roles, departments, and individual needs.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="font-medium mb-3">Comprehensive Audit Trails</h3>
            <p className="text-sm text-muted-foreground">
              Every access attempt is logged with detailed information, creating a complete audit trail for security analysis and investigation if needed.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-primary">Departments Supported</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {["Seecs", "Sada", "Iaec", "S3h", "Smme", "Rimms", "Ns", 
            "Sns", "Nshs", "Igis", "Nice", "Scme", "Asap", "Nls"].map((dept) => (
            <div key={dept} className="bg-card rounded-lg p-4 text-center shadow-sm">
              <span className="font-medium">{dept.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4 text-primary">Development Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg p-6 shadow-sm text-center">
            <div className="h-24 w-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-primary text-2xl font-bold">AA</span>
            </div>
            <h3 className="text-lg font-medium mb-1">Ali Abdullah</h3>
            <p className="text-sm text-muted-foreground mb-4">Admin Portal Development</p>
            <div className="flex justify-center space-x-3">
              <a href="https://github.com/ali-abdullah9" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={20} />
              </a>
              <a href="https://www.linkedin.com/in/ali-abdullah-75682027a/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://www.instagram.com/ali_ab_dullah_/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm text-center">
            <div className="h-24 w-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-primary text-2xl font-bold">FS</span>
            </div>
            <h3 className="text-lg font-medium mb-1">Syed Fahad Shah</h3>
            <p className="text-sm text-muted-foreground mb-4">Mobile QR Generation</p>
            <div className="flex justify-center space-x-3">
              <a href="https://github.com/faahad43" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={20} />
              </a>
              <a href="https://www.linkedin.com/in/faahad43/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://www.instagram.com/faahad_43" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-sm text-center">
            <div className="h-24 w-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-primary text-2xl font-bold">RH</span>
            </div>
            <h3 className="text-lg font-medium mb-1">Rehan Haider</h3>
            <p className="text-sm text-muted-foreground mb-4">Scanner Application</p>
            <div className="flex justify-center space-x-3">
              <a href="https://github.com/rehan-hdr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={20} />
              </a>
              <a href="www.linkedin.com/in/rehan-haider-28867828a" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://www.instagram.com/rehanhaider.0/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg p-6 shadow-sm border border-primary/20">
        <h2 className="text-xl font-semibold mb-4 text-primary">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Technical Support</h3>
            <p className="text-sm text-muted-foreground mb-1">Email: support@nustac.edu.pk</p>
            <p className="text-sm text-muted-foreground mb-1">Phone: +92-51-1234567</p>
            <p className="text-sm text-muted-foreground">Hours: Monday-Friday, 9am-5pm</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Administration</h3>
            <p className="text-sm text-muted-foreground mb-1">Email: admin@nustac.edu.pk</p>
            <p className="text-sm text-muted-foreground mb-1">Phone: +92-51-7654321</p>
            <p className="text-sm text-muted-foreground mb-4">Location: SEECS Building, H-12 Campus</p>
            
            <Link href="/contact" className="text-primary hover:text-primary/80 text-sm font-medium">
              Contact Form →
            </Link>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-12 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear().toString()} NusTAC - National University of Sciences and Technology</p>
        <p className="mt-1">All rights reserved.</p>
      </div>
    </div>
  );
}
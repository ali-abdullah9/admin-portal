"use client";

import React from "react";
import ThreeJsMajesticBadge from "./ThreeJsMajesticBadge"; // Import the fixed badge component

export default function AboutPage() {
  return (
    <div className="p-8 bg-gradient-to-b from-background to-background/90">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">About NusTAC</h1>
      
      {/* Enhanced 3D Badge Display */}
      <div className="mb-16 max-w-5xl mx-auto shadow-2xl">
        <ThreeJsMajesticBadge />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-6xl mx-auto">
        <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/20">
          <h2 className="text-2xl font-semibold mb-6 text-primary">System Overview</h2>
          <p className="mb-6 text-muted-foreground leading-relaxed">
            NusTAC (NUST Access Control) is a comprehensive campus access management system designed for the National University of Sciences and Technology (NUST) in Islamabad, Pakistan.
          </p>
          <p className="mb-6 text-muted-foreground leading-relaxed">
            Our system provides secure, efficient, and highly adaptable access control for various university departments, labs, classrooms, and administrative facilities across the campus.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            With real-time monitoring, detailed access logs, and powerful analytics, NusTAC ensures that only authorized personnel can access specific areas, enhancing campus security while maintaining accessibility.
          </p>
        </div>
        
        <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/20">
          <h2 className="text-2xl font-semibold mb-6 text-primary">Key Features</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5 shadow-inner">
                <span className="text-primary text-lg">✓</span>
              </div>
              <span className="text-lg">QR-based authentication using hybrid encryption (Kyber and AES)</span>
            </li>
            <li className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5 shadow-inner">
                <span className="text-primary text-lg">✓</span>
              </div>
              <span className="text-lg">Time-limited access tokens (5-minute session time)</span>
            </li>
            <li className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5 shadow-inner">
                <span className="text-primary text-lg">✓</span>
              </div>
              <span className="text-lg">Role-based access control for staff, faculty, students, and visitors</span>
            </li>
            <li className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5 shadow-inner">
                <span className="text-primary text-lg">✓</span>
              </div>
              <span className="text-lg">Department-specific permissions management</span>
            </li>
            <li className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5 shadow-inner">
                <span className="text-primary text-lg">✓</span>
              </div>
              <span className="text-lg">Real-time access tracking and comprehensive analytics</span>
            </li>
            <li className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 mt-0.5 shadow-inner">
                <span className="text-primary text-lg">✓</span>
              </div>
              <span className="text-lg">Multi-platform ecosystem (web admin, mobile app, scanner)</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mb-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8 text-center text-primary">System Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/20 transform transition-transform hover:scale-105">
            <div className="h-16 w-16 rounded-full bg-primary/30 flex items-center justify-center text-primary text-2xl font-bold mb-6 mx-auto shadow-inner">1</div>
            <h3 className="text-xl font-medium mb-4 text-center">Admin Portal</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              A comprehensive web dashboard for administrators to manage users, view access logs, analyze usage patterns, and configure system settings.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/10 rounded-lg p-3 text-sm text-center font-medium shadow-sm">User Management</div>
              <div className="bg-primary/10 rounded-lg p-3 text-sm text-center font-medium shadow-sm">Access Logs</div>
              <div className="bg-primary/10 rounded-lg p-3 text-sm text-center font-medium shadow-sm">Analytics</div>
              <div className="bg-primary/10 rounded-lg p-3 text-sm text-center font-medium shadow-sm">System Settings</div>
            </div>
          </div>
          
          <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/20 transform transition-transform hover:scale-105">
            <div className="h-16 w-16 rounded-full bg-primary/30 flex items-center justify-center text-primary text-2xl font-bold mb-6 mx-auto shadow-inner">2</div>
            <h3 className="text-xl font-medium mb-4 text-center">Mobile Application</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Allows users to generate secure, encrypted QR codes with a 5-minute validity period. Users can also view their personal access logs and manage their profile.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/10 rounded-lg p-3 text-sm text-center font-medium shadow-sm">QR Generation</div>
              <div className="bg-primary/10 rounded-lg p-3 text-sm text-center font-medium shadow-sm">5-min Session</div>
              <div className="bg-primary/10 rounded-lg p-3 text-sm text-center font-medium shadow-sm">Access History</div>
              <div className="bg-primary/10 rounded-lg p-3 text-sm text-center font-medium shadow-sm">User Profile</div>
            </div>
          </div>
          
          <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/20 transform transition-transform hover:scale-105">
            <div className="h-16 w-16 rounded-full bg-primary/30 flex items-center justify-center text-primary text-2xl font-bold mb-6 mx-auto shadow-inner">3</div>
            <h3 className="text-xl font-medium mb-4 text-center">Scanner Application</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Installed at entry points to scan and decrypt user QR codes, verify access permissions for specific rooms, and record entry attempts in the access logs.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/10 rounded-lg p-3 text-sm text-center font-medium shadow-sm">QR Scanning</div>
              <div className="bg-primary/10 rounded-lg p-3 text-sm text-center font-medium shadow-sm">Decryption</div>
              <div className="bg-primary/10 rounded-lg p-3 text-sm text-center font-medium shadow-sm">Access Verification</div>
              <div className="bg-primary/10 rounded-lg p-3 text-sm text-center font-medium shadow-sm">Log Recording</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-8 text-center text-primary">Development Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/20 group hover:bg-primary/5 transition-all">
            <div className="h-32 w-32 bg-primary/20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-primary/30 transition-all">
              <span className="text-primary text-3xl font-bold">AA</span>
            </div>
            <h3 className="text-xl font-medium mb-2 text-center">Ali Abdullah</h3>
            <p className="text-center text-primary/80 font-medium mb-6">Admin Portal Development</p>
            <div className="flex justify-center space-x-4">
              <a href="https://github.com/ali-abdullah9" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              </a>
              <a href="https://www.linkedin.com/in/ali-abdullah-75682027a/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://www.instagram.com/ali_ab_dullah_/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>
          
          <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/20 group hover:bg-primary/5 transition-all">
            <div className="h-32 w-32 bg-primary/20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-primary/30 transition-all">
              <span className="text-primary text-3xl font-bold">FS</span>
            </div>
            <h3 className="text-xl font-medium mb-2 text-center">Syed Fahad Shah</h3>
            <p className="text-center text-primary/80 font-medium mb-6">Mobile QR Generation</p>
            <div className="flex justify-center space-x-4">
              <a href="https://github.com/faahad43" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              </a>
              <a href="https://www.linkedin.com/in/faahad43/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://www.instagram.com/faahad_43" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>
          
          <div className="bg-card/30 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary/20 group hover:bg-primary/5 transition-all">
            <div className="h-32 w-32 bg-primary/20 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-primary/30 transition-all">
              <span className="text-primary text-3xl font-bold">RH</span>
            </div>
            <h3 className="text-xl font-medium mb-2 text-center">Rehan Haider</h3>
            <p className="text-center text-primary/80 font-medium mb-6">Scanner Application</p>
            <div className="flex justify-center space-x-4">
              <a href="https://github.com/rehan-hdr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              </a>
              <a href="https://www.linkedin.com/in/rehan-haider-28867828a" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://www.instagram.com/rehanhaider.0/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-16 max-w-6xl mx-auto">
        <div className="bg-card/30 backdrop-blur-sm rounded-xl p-10 shadow-lg border border-primary/20">
          <h2 className="text-2xl font-semibold mb-8 text-center text-primary">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-background/50 p-6 rounded-lg shadow-inner">
              <h3 className="text-xl font-medium mb-4 text-primary/90">Technical Support</h3>
              <p className="flex items-center text-lg text-muted-foreground mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-primary/70"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                +92-51-1234567
              </p>
              <p className="flex items-center text-lg text-muted-foreground mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-primary/70"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                support@nustac.edu.pk
              </p>
              <p className="flex items-center text-lg text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-primary/70"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Monday-Friday, 9am-5pm
              </p>
            </div>
            
            <div className="bg-background/50 p-6 rounded-lg shadow-inner">
              <h3 className="text-xl font-medium mb-4 text-primary/90">Administration</h3>
              <p className="flex items-center text-lg text-muted-foreground mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-primary/70"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                +92-51-7654321
              </p>
              <p className="flex items-center text-lg text-muted-foreground mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-primary/70"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                admin@nustac.edu.pk
              </p>
              <p className="flex items-center text-lg text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-primary/70"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                SEECS Building, H-12 Campus
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
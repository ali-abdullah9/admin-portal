"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../themeToggle";
import { useAuth } from "@/app/AuthProvider";

export default function Navbar() {
  const { user, logout, isAuthorized } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Don't render the navbar on login page
  if (pathname === '/login') {
    return null;
  }

  // Only render if user is authorized
  if (!isAuthorized()) {
    return null;
  }

  return (
    <nav className="bg-background text-foreground p-3 transition-colors border-b">
      <div className="container mx-auto">
        {/* Desktop Navigation */}
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl dark:text-white">
              NT
            </div>
            <div>
              <Link href="/" className="flex flex-col">
                <span className="text-xl font-bold tracking-tight">NusTAC</span>
                <span className="text-xs text-muted-foreground -mt-1">Admin Portal</span>
              </Link>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10 transition-colors ${
                pathname === "/" ? "text-primary" : ""
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/users"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10 transition-colors ${
                pathname === "/users" ? "text-primary" : ""
              }`}
            >
              Users
            </Link>
            <Link
              href="/contact"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10 transition-colors ${
                pathname === "/logs" ? "text-primary" : ""
              }`}
            >
              Contact Us
            </Link>
            <Link
              href="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/10 transition-colors ${
                pathname === "/about" ? "text-primary" : ""
              }`}
            >
              About
            </Link>
            <div className="ml-3 border-l pl-3 flex items-center space-x-3">
              <ModeToggle />
              
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{user.username}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-muted-foreground">
                      <span className="capitalize">{user.role}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-500 hover:text-red-700 focus:text-red-700">
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
            <ModeToggle />
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-2 pb-3 space-y-1 border-t mt-2">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10 transition-colors ${
                pathname === "/" ? "text-primary" : ""
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/users"
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10 transition-colors ${
                pathname === "/users" ? "text-primary" : ""
              }`}
            >
              Users
            </Link>
            <Link
              href="/contact"
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10 transition-colors ${
                pathname === "/contact" ? "text-primary" : ""
              }`}
            >
              Contact Us
            </Link>
            <Link
              href="/about"
              className={`block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10 transition-colors ${
                pathname === "/about" ? "text-primary" : ""
              }`}
            >
              About
            </Link>
            {user && (
              <>
                <div className="px-3 py-2 text-muted-foreground flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{user.username}</span>
                  <span className="text-xs ml-2 px-2 py-0.5 bg-muted rounded-full capitalize">{user.role}</span>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={logout} 
                  className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
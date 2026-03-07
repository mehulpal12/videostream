"use client"

import { useState } from 'react';
import { Search, User, Menu, X } from 'lucide-react';
import { UserButton, SignInButton,  SignOutButton } from '@clerk/nextjs';
import { ModeToggle } from './mode-toggle';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Browse', href: '#' },
    { name: 'Mentors', href: '#' },
    { name: 'Dashboard', href: '/studentdashboard' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Logo & Desktop Search */}
          <div className="flex items-center gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 font-bold text-xl tracking-tighter text-foreground cursor-pointer"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <span className="text-sm">V</span>
              </div>
              <span className="hidden sm:inline">VideoStream</span>
            </motion.div>

            {/* Desktop Search */}
            <div className="hidden lg:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search courses..." 
                className="bg-muted border border-input rounded-full py-1.5 pl-10 pr-4 w-[300px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          {/* Right: Desktop Links & Auth */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-6 text-sm font-medium">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-muted-foreground hover:text-blue-500 transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:width-full" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <ModeToggle />
              
              <SignOutButton>
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:opacity-80">
                    Sign In
                  </button>
                </SignInButton>
              </SignOutButton>
              
              <SignInButton>
                <UserButton afterSignOutUrl="/" />
              </SignInButton>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ModeToggle />
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-foreground hover:bg-muted rounded-md transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full bg-muted border border-input rounded-lg py-2 pl-10 pr-4 text-sm"
                />
              </div>
              
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-base font-medium text-foreground hover:text-blue-500 py-2"
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <SignInButton>
                  <div className="flex items-center gap-3">
                    <UserButton />
                    <span className="text-sm font-medium">Account</span>
                  </div>
                </SignInButton>
                <SignOutButton>
                  <SignInButton mode="modal">
                    <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium">
                      Sign In
                    </button>
                  </SignInButton>
                </SignOutButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
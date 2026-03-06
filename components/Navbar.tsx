import {  Search, User } from 'lucide-react';
import { UserButton, SignInButton } from '@clerk/nextjs';
import { ModeToggle } from './mode-toggle';
import Link from 'next/link';

export default function Navbar() {
  return (
    // bg-background/80 handles the adaptive background with transparency
    // border-border uses the theme-aware border color
    <nav className="flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border">
      <div className="flex items-center gap-8">
        {/* Branding stays blue, but text-foreground adapts */}
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-foreground">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <span className="text-sm">V</span>
          </div>
          VideoStream
        </div>

        {/* Search Bar - bg-muted adapts to light/dark automatically */}
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search for courses, skills, or mentors" 
            className="bg-muted border border-input rounded-full py-2 pl-10 pr-4 w-[400px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm font-medium text-foreground">
        {/* Links use hover:text-blue-500 for consistent branding */}
        <a href="#" className="hover:text-blue-500 transition-colors">Browse</a>
        <a href="#" className="hover:text-blue-400 transition-colors">Mentors</a>
        <Link href="studentdashboard" className="hover:text-blue-400 transition-colors">dashboard</Link>
        <SignInButton className="text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity">Sign In</SignInButton>
        
 

        <div className="flex items-center gap-3 pl-2 border-l border-border">
          <ModeToggle />
          {/* Avatar bg-secondary adapts to light/dark */}
          <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">
            <UserButton  className="w-4 h-4 text-secondary-foreground" />
          </div>
        </div>
      </div>
    </nav>
  );
}
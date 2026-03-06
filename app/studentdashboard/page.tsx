"use client"

import React, { useState } from 'react';
import { 
  LayoutDashboard, BookOpen, Search, Settings, 
  BarChart3, Bell, Play, Calendar, 
  Clock, Zap, CheckCircle2 
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from '@/components/mode-toggle';

// Design Constants mapping to Tailwind-friendly logic
const DESIGN = {
  primary: "bg-[#2563eb]",
  primaryText: "text-[#2563eb]",
  primaryHover: "hover:bg-[#1d4ed8]",
  border: "border-border", // Uses CSS variable for theme switching
  surface: "bg-card/50 backdrop-blur-sm",
};

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': return <DashboardHome />;
      case 'My Courses': return <Placeholder title="My Enrolled Courses" />;
      case 'Browse': return <Placeholder title="Explore New Skills" />;
      case 'Analytics': return <Placeholder title="Learning Progress Analytics" />;
      case 'Settings': return <Placeholder title="Account Settings" />;
      default: return <DashboardHome />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className={`w-64 border-r ${DESIGN.border} flex flex-col sticky top-0 h-screen bg-card/30`}>
        <div className="p-8">
          <div className={`flex items-center gap-2 font-bold text-xl tracking-tighter ${DESIGN.primaryText}`}>
            <div className={`w-8 h-8 ${DESIGN.primary} rounded-lg flex items-center justify-center text-white`}>V</div>
            VideoStream
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
          <NavItem icon={<BookOpen size={18} />} label="My Courses" active={activeTab === 'My Courses'} onClick={() => setActiveTab('My Courses')} />
          <NavItem icon={<Search size={18} />} label="Browse" active={activeTab === 'Browse'} onClick={() => setActiveTab('Browse')} />
          <NavItem icon={<BarChart3 size={18} />} label="Analytics" active={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')} />
          <NavItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
        </nav>

        <div className="p-4 mt-auto">
          <Card className={`bg-primary/5 border-primary/20 p-4 border`}>
            <h4 className={`text-xs font-bold ${DESIGN.primaryText} uppercase tracking-widest mb-2`}>Pro Plan</h4>
            <p className="text-[10px] text-muted-foreground mb-4 leading-relaxed">Get unlimited access to all premium courses.</p>
            <Button size="sm" className={`w-full ${DESIGN.primary} ${DESIGN.primaryHover} text-white text-[11px] h-8 rounded-lg shadow-lg shadow-blue-600/20`}>
              Upgrade Now
            </Button>
          </Card>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className={`h-16 border-b ${DESIGN.border} flex items-center justify-between px-8 bg-background/80 backdrop-blur-md z-10`}>
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className={`w-full bg-muted/50 border ${DESIGN.border} rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all`}
            />
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <div className={`flex items-center gap-3 pl-4 border-l ${DESIGN.border}`}>
              <Avatar className={`h-9 w-9 border ${DESIGN.border}`}>
                <AvatarImage src="https://i.pravatar.cc/150?u=alex" />
                <AvatarFallback>AR</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <ScrollArea className="flex-1">
          {renderContent()}
        </ScrollArea>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function NavItem({ icon, label, active = false, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group
        ${active ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}
      `}
    >
      <span className={active ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary transition-colors'}>
        {icon}
      </span>
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </button>
  );
}

function DashboardHome() {
  return (
    <div className="max-w-5xl mx-auto p-8 space-y-10">
      <section>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back, Alex! 👋</h2>
        <p className="text-muted-foreground text-sm italic">You've completed 75% of your weekly goal.</p>
      </section>

      <div className={`relative rounded-3xl overflow-hidden aspect-[21/9] border ${DESIGN.border} group shadow-2xl bg-card`}>
        <img 
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
          alt="Course"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent p-12 flex flex-col justify-center">
          <span className={`bg-primary text-[10px] font-black uppercase px-2 py-1 rounded w-fit mb-4 text-white`}>In Progress</span>
          <h3 className="text-4xl font-black mb-4 max-w-lg leading-[1.1]">Advanced React Patterns</h3>
          <p className="text-muted-foreground text-sm max-w-md mb-8 leading-relaxed">
            Master design patterns, performance optimization, and scalable architecture.
          </p>
          <Button className={`${DESIGN.primary} ${DESIGN.primaryHover} text-white w-fit px-8 py-6 rounded-xl gap-2 shadow-xl shadow-blue-600/20`}>
            <Play size={18} fill="currentColor" /> Resume Learning
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <CourseCard title="Python for Data Science" progress={82} />
        <CourseCard title="UI/UX Masterclass" progress={35} />
      </div>
    </div>
  );
}

function CourseCard({ title, progress }: { title: string, progress: number }) {
  return (
    <Card className="bg-card/50 border-border overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold">{title}</h4>
          <span className="text-xs text-primary font-bold">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>
    </Card>
  );
}

function Placeholder({ title }: { title: string }) {
  return <div className="p-8"><h1 className="text-2xl font-bold">{title}</h1><p className="text-muted-foreground mt-2">Section content coming soon...</p></div>;
}
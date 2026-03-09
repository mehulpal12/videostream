"use client"

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, BookOpen, Search, Settings, 
  BarChart3, Bell, Play, Calendar, 
  Clock, Zap, CheckCircle2, TrendingUp, Award, BookMarked
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from '@/components/mode-toggle';
import Link from 'next/link';

const DESIGN = {
  primary: "bg-[#2563eb]",
  primaryText: "text-[#2563eb]",
  primaryHover: "hover:bg-[#1d4ed8]",
  border: "border-border",
  surface: "bg-card/50 backdrop-blur-sm",
};

interface Course {
  id: string;
  title: string;
  mentor: string;
  price: number;
  badge?: string | null;
  color: string;
  createdAt: string;
}

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': return <DashboardHome />;
      case 'My Courses': return <MyCourses searchQuery={searchQuery} />;
      case 'Browse': return <BrowseCourses searchQuery={searchQuery} />;
      case 'Analytics': return <AnalyticsTab />;
      case 'Settings': return <SettingsTab />;
      default: return <DashboardHome />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className={`w-64 border-r ${DESIGN.border} flex flex-col sticky top-0 h-screen bg-card/30`}>
        <div className="p-8">
          <Link href="/" className={`flex items-center gap-2 font-bold text-xl tracking-tighter ${DESIGN.primaryText}`}>
            <div className={`w-8 h-8 ${DESIGN.primary} rounded-lg flex items-center justify-center text-white`}>V</div>
            VideoStream
          </Link>
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          <Link href="/courses">
            <Button className={`${DESIGN.primary} ${DESIGN.primaryHover} text-white w-fit px-8 py-6 rounded-xl gap-2 shadow-xl shadow-blue-600/20`}>
              <Play size={18} fill="currentColor" /> Resume Learning
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <CourseCard title="Python for Data Science" progress={82} />
        <CourseCard title="UI/UX Masterclass" progress={35} />
      </div>
    </div>
  );
}

function MyCourses({ searchQuery }: { searchQuery: string }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const filtered = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.mentor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Enrolled Courses</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} courses enrolled</p>
        </div>
      </div>
      
      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((course, index) => (
            <Link key={course.id} href="/courses">
              <Card className="bg-card/50 border-border overflow-hidden hover:border-primary/50 transition-all cursor-pointer group">
                <div className={`h-32 ${course.color} relative`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  {course.badge && (
                    <span className="absolute top-3 left-3 text-[9px] font-black bg-background/80 backdrop-blur px-2 py-1 rounded">{course.badge}</span>
                  )}
                </div>
                <CardContent className="p-6">
                  <h4 className="font-bold mb-1 group-hover:text-primary transition-colors">{course.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{course.mentor}</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-primary font-bold">{Math.floor(Math.random() * 60 + 20)}% complete</span>
                  </div>
                  <Progress value={Math.floor(Math.random() * 60 + 20)} className="h-2" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          <BookMarked className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No courses found</p>
          <p className="text-sm mt-1">Try adjusting your search or browse new courses</p>
        </div>
      )}
    </div>
  );
}

function BrowseCourses({ searchQuery }: { searchQuery: string }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const filtered = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.mentor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Explore New Skills</h1>
        <p className="text-muted-foreground text-sm mt-1">{filtered.length} courses available</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course) => (
          <Link key={course.id} href="/courses">
            <Card className="bg-card/50 border-border overflow-hidden hover:border-primary/50 hover:-translate-y-1 transition-all cursor-pointer group">
              <div className={`h-36 ${course.color} relative`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                {course.badge && (
                  <span className="absolute top-3 left-3 text-[9px] font-black bg-background/80 backdrop-blur px-2 py-1 rounded">{course.badge}</span>
                )}
              </div>
              <CardContent className="p-5">
                <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors line-clamp-2">{course.title}</h4>
                <p className="text-xs text-muted-foreground mb-3">{course.mentor}</p>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="font-bold">${course.price.toFixed(2)}</span>
                  <Button size="sm" className="h-7 text-[11px] bg-primary text-white">Enroll</Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No courses found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
}

function AnalyticsTab() {
  const stats = [
    { icon: <BookOpen className="w-5 h-5" />, label: "Courses Enrolled", value: "8", color: "text-blue-500" },
    { icon: <Clock className="w-5 h-5" />, label: "Hours Learned", value: "124", color: "text-green-500" },
    { icon: <TrendingUp className="w-5 h-5" />, label: "Avg. Progress", value: "67%", color: "text-purple-500" },
    { icon: <Award className="w-5 h-5" />, label: "Certificates", value: "3", color: "text-yellow-500" },
  ];

  const weeklyData = [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 1.8 },
    { day: "Wed", hours: 3.2 },
    { day: "Thu", hours: 0.5 },
    { day: "Fri", hours: 2.0 },
    { day: "Sat", hours: 4.1 },
    { day: "Sun", hours: 1.5 },
  ];

  const maxHours = Math.max(...weeklyData.map(d => d.hours));

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Learning Progress Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your learning journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card/50 border-border p-5">
            <div className={`${stat.color} mb-3`}>{stat.icon}</div>
            <p className="text-2xl font-black">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Weekly Activity Chart */}
      <Card className="bg-card/50 border-border p-6">
        <h3 className="font-bold mb-6">Weekly Activity</h3>
        <div className="flex items-end gap-4 h-40">
          {weeklyData.map((data) => (
            <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground">{data.hours}h</span>
              <div 
                className="w-full bg-primary/20 rounded-t-lg relative overflow-hidden transition-all hover:bg-primary/30"
                style={{ height: `${(data.hours / maxHours) * 100}%` }}
              >
                <div 
                  className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all"
                  style={{ height: '100%' }}
                />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground">{data.day}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-card/50 border-border p-6">
        <h3 className="font-bold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <ActivityItem title="Completed 'Advanced Grid Layouts'" time="2 hours ago" icon={<CheckCircle2 className="w-4 h-4 text-green-500" />} />
          <ActivityItem title="Started 'Color Theory for Digital'" time="5 hours ago" icon={<Play className="w-4 h-4 text-blue-500" />} />
          <ActivityItem title="Earned certificate in 'React Basics'" time="Yesterday" icon={<Award className="w-4 h-4 text-yellow-500" />} />
        </div>
      </Card>
    </div>
  );
}

function ActivityItem({ title, time, icon }: { title: string; time: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors">
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}

function SettingsTab() {
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your preferences</p>
      </div>

      <Card className="bg-card/50 border-border p-6 space-y-6">
        <h3 className="font-bold">Profile</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">First Name</label>
            <input className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-sm" defaultValue="Alex" />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Last Name</label>
            <input className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-sm" defaultValue="Rivera" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Email</label>
            <input className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-sm" defaultValue="alex@example.com" />
          </div>
        </div>
      </Card>

      <Card className="bg-card/50 border-border p-6 space-y-4">
        <h3 className="font-bold">Notifications</h3>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm">Push Notifications</span>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-11 h-6 rounded-full transition-colors ${notifications ? 'bg-primary' : 'bg-muted'} relative`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${notifications ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </label>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm">Email Updates</span>
          <button
            onClick={() => setEmailUpdates(!emailUpdates)}
            className={`w-11 h-6 rounded-full transition-colors ${emailUpdates ? 'bg-primary' : 'bg-muted'} relative`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${emailUpdates ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </label>
      </Card>

      <Button className="bg-primary text-white">Save Changes</Button>
    </div>
  );
}

function CourseCard({ title, progress }: { title: string, progress: number }) {
  return (
    <Link href="/courses">
      <Card className="bg-card/50 border-border overflow-hidden hover:border-primary/50 transition-all cursor-pointer">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold">{title}</h4>
            <span className="text-xs text-primary font-bold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>
    </Link>
  );
}
import React from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Settings, 
  Maximize, ChevronDown, CheckCircle2, Lock, PlayCircle,
  Download, MessageSquare, FileText, Info, Share2, Bell, User
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';

export default function WatchPage() {
  return (
    // bg-background and text-foreground adapt automatically
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      {/* --- HEADER --- */}
      <Navbar />

      <main className="grid lg:grid-cols-[1fr_380px] h-[calc(100vh-65px)]">
        {/* --- LEFT: VIDEO & INFO --- */}
        <ScrollArea className="h-full border-r border-border">
          <div className="p-4 lg:p-8">
            {/* VIDEO PLAYER UI */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border shadow-2xl group bg-black">
              {/* Fake Video Content */}
              <div className="absolute inset-0 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000')] bg-cover bg-center">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
                <button className="relative z-10 w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition active:scale-95">
                  <Play className="w-8 h-8 fill-primary-foreground text-primary-foreground ml-1" />
                </button>
              </div>

              {/* VIDEO CONTROLS - Kept dark for focus */}
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-col gap-4">
                  <Progress value={45} className="h-1 bg-white/20 cursor-pointer" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-4">
                        <SkipBack className="w-5 h-5 cursor-pointer text-slate-300 hover:text-white" />
                        <Play className="w-5 h-5 cursor-pointer text-white fill-white" />
                        <SkipForward className="w-5 h-5 cursor-pointer text-slate-300 hover:text-white" />
                      </div>
                      <div className="flex items-center gap-3">
                        <Volume2 className="w-5 h-5 text-slate-300" />
                        <div className="w-20 h-1 bg-white/20 rounded-full" />
                      </div>
                      <span className="text-xs font-mono text-slate-300">12:45 / 24:00</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="px-1.5 py-0.5 border border-white/20 rounded text-[10px] font-bold text-white">HD</div>
                      <Settings className="w-5 h-5 text-slate-300 cursor-pointer" />
                      <Maximize className="w-5 h-5 text-slate-300 cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LESSON DETAILS */}
            <div className="mt-8 space-y-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-12 p-0 gap-8">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 text-muted-foreground data-[state=active]:text-foreground transition-none">Overview</TabsTrigger>
                  <TabsTrigger value="notes" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 text-muted-foreground data-[state=active]:text-foreground transition-none">Notes</TabsTrigger>
                  <TabsTrigger value="resources" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 text-muted-foreground data-[state=active]:text-foreground transition-none">Resources</TabsTrigger>
                  <TabsTrigger value="discussion" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 text-muted-foreground data-[state=active]:text-foreground transition-none">Discussion</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Lesson 4: Advanced Grid Layouts</h2>
                    <Button variant="outline" className="border-border hover:bg-accent gap-2">
                      <Share2 className="w-4 h-4" /> Share
                    </Button>
                  </div>
                  <p className="text-muted-foreground leading-relaxed max-w-3xl">
                    In this session, we dive deep into complex grid structures and how to maintain balance across different screen sizes. 
                    We will explore responsive container strategies and the psychological impact of whitespace in modern UI design.
                  </p>

                  <div className="flex items-center gap-4 mt-8 pt-8 border-t border-border">
                    <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden">
                      <img src="https://i.pravatar.cc/150?u=alex" alt="Instructor" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Alex Rivera</h4>
                      <p className="text-xs text-muted-foreground">Senior Product Designer</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </ScrollArea>

        {/* --- RIGHT: COURSE CONTENT SIDEBAR --- */}
        <aside className="flex flex-col bg-card/50">
          <div className="p-6 border-b border-border flex justify-between items-center">
            <h3 className="font-bold text-foreground">Course Content</h3>
            <span className="text-[10px] font-bold text-primary px-2 py-1 bg-primary/10 rounded uppercase">18 Lessons</span>
          </div>

          <ScrollArea className="flex-1">
            {/* SECTION 1 */}
            <div className="p-0">
              <div className="px-6 py-4 bg-muted/30 flex items-center justify-between group cursor-pointer">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Section 1</p>
                  <h4 className="text-sm font-bold text-foreground">Getting Started</h4>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="px-2 py-2 space-y-1">
                <LessonItem id={1} title="Introduction to UI Design" time="08:42" completed />
                <LessonItem id={2} title="Setup Your Workspace" time="12:15" completed />
              </div>
            </div>

            {/* SECTION 2 */}
            <div className="p-0 border-t border-border">
              <div className="px-6 py-4 flex items-center justify-between group cursor-pointer">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Section 2</p>
                  <h4 className="text-sm font-bold text-foreground">Core Principles</h4>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="px-2 py-2 space-y-1">
                <LessonItem id={4} title="Advanced Grid Layouts" time="24:00" active />
                <LessonItem id={5} title="Color Theory for Digital" time="18:30" />
              </div>
            </div>

            {/* SECTION 3 (LOCKED) */}
            <div className="p-0 border-t border-border opacity-50">
              <div className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Section 3</p>
                  <h4 className="text-sm font-bold text-foreground">Visual Mastery</h4>
                </div>
                <Lock className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </ScrollArea>

          <div className="p-4 bg-muted/20 border-t border-border">
            <Button className="w-full bg-primary hover:opacity-90 text-primary-foreground gap-2 h-12 rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-95">
              <Download className="w-4 h-4" /> Download Course Files
            </Button>
          </div>
        </aside>
      </main>

      {/* Floating Chat Bot */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 transition active:scale-95 z-50">
        <div className="relative">
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-primary" />
        </div>
      </button>
    </div>
  );
}

// Adaptive Helper Sub-component
function LessonItem({ id, title, time, completed = false, active = false }: any) {
  return (
    <div className={`
      flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer group
      ${active ? 'bg-primary/10 border border-primary/20' : 'hover:bg-accent'}
    `}>
      <div className="flex-shrink-0">
        {completed ? (
          <CheckCircle2 className="w-5 h-5 text-primary" />
        ) : active ? (
          <div className="relative w-5 h-5 flex items-center justify-center">
             <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20" />
             <div className="w-2 h-2 bg-primary rounded-full" />
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-muted flex items-center justify-center group-hover:border-primary/50 transition-colors" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h5 className={`text-xs font-semibold truncate ${active ? 'text-primary' : 'text-foreground'}`}>
          {id}. {title}
        </h5>
        <div className="flex items-center gap-2 mt-1 text-muted-foreground">
          <PlayCircle className="w-3 h-3" />
          <span className="text-[10px] font-mono">{time}</span>
        </div>
      </div>
      {active && <div className="h-4 w-1 bg-primary rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
    </div>
  );
}
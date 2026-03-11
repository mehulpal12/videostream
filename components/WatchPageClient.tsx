"use client";

import React, { useState, useRef } from 'react';
import { 
  Play, ChevronDown, ChevronUp, CheckCircle2, 
  Share2, FileVideo, GraduationCap, ArrowLeft
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import Link from 'next/link';

interface Lecture {
  id: string;
  title: string;
  videoUrl: string;
  order: number;
}

interface Section {
  id: string;
  title: string;
  order: number;
  lectures: Lecture[];
}

interface Course {
  id: string;
  title: string;
  sections: Section[];
}

export default function WatchPageClient({ initialCourse }: { initialCourse: Course }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // 1. Initialize state with the first available lecture
  const [activeLesson, setActiveLesson] = useState<Lecture | null>(
    initialCourse.sections?.[0]?.lectures?.[0] || null
  );
  
  const [expandedSections, setExpandedSections] = useState<string[]>(
    initialCourse.sections?.[0] ? [initialCourse.sections[0].id] : []
  );
  
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100">
      <Navbar />

      <main className="grid lg:grid-cols-[1fr_400px] h-[calc(100vh-65px)] mt-16 overflow-hidden">
        
        {/* --- LEFT SIDE: THE PLAYER --- */}
        <ScrollArea className="h-full border-r border-white/5 bg-[#0E131F]">
          <div className="p-4 lg:p-10 max-w-5xl mx-auto">
            
            {/* Header Breadcrumb */}
            <div className="flex items-center gap-4 mb-6">
               <Link href={`/courses/${initialCourse.id}`} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <ArrowLeft size={20} className="text-slate-500" />
               </Link>
               <div>
                  <h1 className="text-sm font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
                    <GraduationCap size={14}/> {initialCourse.title}
                  </h1>
               </div>
            </div>

            {/* VIDEO BOX */}
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 bg-black group shadow-2xl shadow-blue-500/5">
              {activeLesson?.videoUrl ? (
                <video 
                  ref={videoRef}
                  key={activeLesson.id}
                  src={activeLesson.videoUrl}
                  className="w-full h-full object-contain"
                  controls
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-4">
                  <FileVideo size={48} className="opacity-20" />
                  <p>Select a lecture to begin watching</p>
                </div>
              )}
              
              {!isPlaying && activeLesson?.videoUrl && (
                <div onClick={handleTogglePlay} className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer group-hover:bg-black/20 transition-all">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
                    <Play className="w-10 h-10 fill-white text-white ml-1" />
                  </div>
                </div>
              )}
            </div>

            {/* LESSON INFO */}
            <div className="mt-10 space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                   <h2 className="text-3xl font-black tracking-tight">{activeLesson?.title || "Welcome to the Course"}</h2>
                   <p className="text-slate-500 mt-2">Lesson {activeLesson?.order} • HD Presentation</p>
                </div>
                <Button variant="outline" className="rounded-2xl border-white/10 hover:bg-white/5 gap-2 px-6">
                  <Share2 size={16} /> Share Progress
                </Button>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-transparent border-b border-white/5 w-full justify-start rounded-none h-12 p-0 gap-8">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none text-slate-400 data-[state=active]:text-white transition-all">Overview</TabsTrigger>
                  <TabsTrigger value="resources" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none text-slate-400 data-[state=active]:text-white transition-all">Resources</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="pt-8 text-slate-400 leading-relaxed text-lg">
                  This lecture covers key systematic concepts of {initialCourse.title}. 
                  Follow along with the video and check the resources tab for any supplementary files or code snippets.
                </TabsContent>
                <TabsContent value="resources" className="pt-8 italic text-slate-500">
                  No downloadable resources attached to this specific lesson yet.
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </ScrollArea>

        {/* --- RIGHT SIDE: CURRICULUM SIDEBAR --- */}
        <aside className="flex flex-col bg-[#0B0F17]">
          <div className="p-6 border-b border-white/5 bg-[#111622]">
            <h3 className="font-black uppercase text-xs tracking-[0.2em] text-slate-500">Course Content</h3>
          </div>

          <ScrollArea className="flex-1">
            {initialCourse.sections.map((section) => (
              <div key={section.id} className="border-b border-white/5">
                <div 
                  onClick={() => setExpandedSections(prev => 
                    prev.includes(section.id) ? prev.filter(i => i !== section.id) : [...prev, section.id]
                  )}
                  className="px-6 py-5 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer transition-colors"
                >
                  <div className="max-w-[80%]">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Section {section.order}</p>
                    <h4 className="text-sm font-bold truncate text-slate-200">{section.title}</h4>
                  </div>
                  {expandedSections.includes(section.id) ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                </div>

                {expandedSections.includes(section.id) && (
                  <div className="px-3 pb-4 space-y-1">
                    {section.lectures.map((lecture) => (
                      <button 
                        key={lecture.id}
                        onClick={() => {
                          setActiveLesson(lecture);
                          setIsPlaying(true);
                        }}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all text-left ${
                          activeLesson?.id === lecture.id 
                            ? 'bg-blue-600/10 border border-blue-500/30' 
                            : 'hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <div className={`size-8 rounded-xl flex items-center justify-center transition-colors ${
                          activeLesson?.id === lecture.id ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-500'
                        }`}>
                          {activeLesson?.id === lecture.id ? <Play size={12} fill="currentColor"/> : <FileVideo size={12}/>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className={`text-xs font-bold truncate ${activeLesson?.id === lecture.id ? 'text-white' : 'text-slate-400'}`}>
                            {lecture.order}. {lecture.title}
                          </h5>
                        </div>
                        {/* You can add a CheckCircle here if progress is tracked */}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>
        </aside>
      </main>
    </div>
  );
}
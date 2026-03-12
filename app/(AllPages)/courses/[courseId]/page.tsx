"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Play, ChevronDown, ChevronUp, Lock, 
  Share2, Loader2, GraduationCap 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import axios from 'axios';

interface Lecture {
  id: string;
  title: string;
  videoUrl: string;
  duration: number;
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

export default function WatchPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lecture | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrollLoading, setIsEnrollLoading] = useState(false);
  
  // FIX: Hydration Mismatch Control
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    async function initPage() {
      try {
        // 1. Fetch Course Data
        const res = await fetch(`/api/courses/${courseId}`);
        const data = await res.json();
        
        if (res.ok && data) {
          setCourse(data);
          
          // 2. Check Enrollment Status (Ensure path: app/api/courses/[courseId]/check-enrollment/route.ts)
          try {
            const enrollRes = await axios.get(`/api/courses/${courseId}/enroll`);
            setIsEnrolled(enrollRes.data.isEnrolled);
          } catch (error) {
            console.error("Enrollment check failed:", error);
            setIsEnrolled(false);
          }

          if (data.sections?.[0]?.lectures?.[0]) {
            setActiveLesson(data.sections[0].lectures[0]);
            setExpandedSections([data.sections[0].id]);
          }
        }
      } catch (err) {
        console.error("Initialization failed:", err);
      } finally {
        setIsLoading(false);
      }
    }
    if (courseId) initPage();
  }, [courseId]);

  const handleEnroll = () => {
    setIsEnrollLoading(true);
    router.push(`/courses/${courseId}/checkout`); 
  };

  const handleTogglePlay = () => {
    if (!isEnrolled) return;
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  // Prevent rendering until mounted to solve hydration issues
  if (!isMounted || isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#0B0F17]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!course) return <div className="p-20 text-center text-white">Course not found.</div>;

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100">
      <Navbar />

      <main className="grid lg:grid-cols-[1fr_380px] h-[calc(100vh-65px)] mt-16 overflow-hidden">
        {/* MAIN VIDEO AREA */}
        <ScrollArea className="h-full border-r border-white/5">
          <div className="p-4 lg:p-8">
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 bg-black shadow-2xl">
              {isEnrolled ? (
                <>
                  {activeLesson?.videoUrl ? (
                    <video 
                      ref={videoRef}
                      key={activeLesson.id}
                      src={activeLesson.videoUrl}
                      className="w-full h-full object-contain"
                      controls
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                      No video available for this lesson.
                    </div>
                  )}
                </>
              ) : (
                /* LOCKED UI */
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B0F17]/90 backdrop-blur-md p-8 text-center">
                  <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20">
                    <Lock className="text-blue-500" size={32} />
                  </div>
                  <h3 className="text-2xl font-black mb-2 tracking-tight">Systematic Access Required</h3>
                  <p className="text-sm text-slate-400 max-w-xs mb-8 leading-relaxed">
                    This lecture is part of a premium curriculum. Enroll now to unlock all sections and resources.
                  </p>
                  <Button 
                    onClick={handleEnroll} 
                    disabled={isEnrollLoading}
                    className="bg-blue-600 hover:bg-blue-700 px-10 py-7 rounded-2xl font-black gap-3 text-lg shadow-xl shadow-blue-600/20 transition-all active:scale-95"
                  >
                    {isEnrollLoading ? <Loader2 className="animate-spin" /> : <GraduationCap size={24}/>}
                    Enroll to Unlock
                  </Button>
                </div>
              )}
            </div>

            {/* LESSON INFO */}
            <div className="mt-10 space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter">{activeLesson?.title}</h2>
                  <p className="text-sm font-bold text-blue-500 mt-2 uppercase tracking-widest">{course.title}</p>
                </div>
                <Button variant="outline" className="gap-2 rounded-xl border-white/10 hover:bg-white/5 text-slate-300">
                  <Share2 size={16} /> Share Course
                </Button>
              </div>

              {/* TABS - Now safe from Hydration Mismatch */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-transparent border-b border-white/5 w-full justify-start rounded-none h-12 p-0 gap-8">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-full px-0 font-bold transition-all">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="data-[state=active]:bg-transparent data-[state=active]:text-blue-500 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-full px-0 font-bold transition-all">
                    Resources
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="pt-8 text-slate-400 leading-relaxed">
                  <p>
                    Take notes and follow along systematically. Use the sidebar to track your progress through the curriculum. 
                    {isEnrolled ? " High-quality source code and project assets are available in the Resources tab." : " Please enroll to access the technical documentation and project files associated with this lesson."}
                  </p>
                </TabsContent>
                <TabsContent value="resources" className="pt-8 italic text-slate-500">
                   {isEnrolled ? "Downloadable assets will appear here soon." : "Resources are locked for non-enrolled users."}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </ScrollArea>

        {/* SIDEBAR CURRICULUM */}
        <aside className="hidden lg:flex flex-col bg-[#0d121d] border-l border-white/5">
          <div className="p-6 border-b border-white/5 bg-[#0B0F17]/50">
            <h3 className="font-black text-sm uppercase tracking-widest text-slate-400">Curriculum</h3>
          </div>

          <ScrollArea className="flex-1">
            {(course.sections ?? []).sort((a, b) => a.order - b.order).map((section) => (
              <div key={section.id} className="border-b border-white/5">
                <button 
                  onClick={() => setExpandedSections(prev => 
                    prev.includes(section.id) ? prev.filter(i => i !== section.id) : [...prev, section.id]
                  )}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                >
                  <div>
                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1">Section {section.order}</p>
                    <h4 className="text-sm font-bold text-slate-200">{section.title}</h4>
                  </div>
                  {expandedSections.includes(section.id) ? <ChevronUp size={18} className="text-slate-500" /> : <ChevronDown size={18} className="text-slate-500" />}
                </button>

                {expandedSections.includes(section.id) && (
                  <div className="px-3 pb-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                    {section.lectures.sort((a, b) => a.order - b.order).map((lecture) => (
                      <button 
                        key={lecture.id}
                        onClick={() => {
                          if (isEnrolled) {
                            setActiveLesson(lecture);
                            setIsPlaying(true);
                          }
                        }}
                        disabled={!isEnrolled}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                          !isEnrolled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                        } ${
                          activeLesson?.id === lecture.id 
                          ? 'bg-blue-600/10 border border-blue-500/20' 
                          : 'hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${activeLesson?.id === lecture.id ? 'bg-blue-500 text-white' : 'bg-white/5 text-slate-500'}`}>
                          {isEnrolled ? <Play size={12} fill="currentColor" /> : <Lock size={12} />}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <h5 className={`text-xs font-bold truncate ${activeLesson?.id === lecture.id ? 'text-white' : 'text-slate-400'}`}>
                            {lecture.title}
                          </h5>
                        </div>
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
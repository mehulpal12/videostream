"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Play, ChevronDown, ChevronUp, CheckCircle2, Lock, 
  Share2, Loader2, FileText, GraduationCap 
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

  useEffect(() => {
    async function initPage() {
      try {
        // 1. Fetch Course Data
        const res = await fetch(`/api/courses/${courseId}`);
        const data = await res.json();
        
        if (res.ok && data) {
          setCourse(data);
          
          // 2. Check Enrollment Status
          // We assume you have an endpoint to check this, or it's included in course data
          const enrollRes = await axios.get(`/api/courses/${courseId}/check-enrollment`);
          setIsEnrolled(enrollRes.data.isEnrolled);

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
    initPage();
  }, [courseId]);

 const handleEnroll = () => {
  setIsEnrollLoading(true);
  
  try {
    // 1. You can add a small delay for better UX or just redirect immediately
    // 2. Redirect the user to your Checkout or Course Landing page
    router.push(`/courses/${courseId}/checkout`); 
    
    // Alternatively, if you want them to go to a general pricing page:
    // router.push("/pricing");
    
  } catch (error) {
    console.error("Redirect failed", error);
  } finally {
    // We don't necessarily need to set loading to false if we are navigating away
    // but it's good practice for safety
    setIsEnrollLoading(false);
  }
};

  const handleTogglePlay = () => {
    if (!isEnrolled) return;
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) return <div className="p-20 text-center">Course not found.</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="grid lg:grid-cols-[1fr_380px] h-[calc(100vh-65px)] mt-16">
        <ScrollArea className="h-full border-r border-border">
          <div className="p-4 lg:p-8">
            
            {/* VIDEO PLAYER / LOCKED STATE */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-black group shadow-2xl">
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
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      No video available for this lesson.
                    </div>
                  )}
                  
                  {!isPlaying && activeLesson?.videoUrl && (
                    <div onClick={handleTogglePlay} className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer transition-all hover:bg-black/20">
                      <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
                        <Play className="w-8 h-8 fill-primary-foreground text-primary-foreground ml-1" />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* LOCKED UI */
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B0F17] p-8 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Lock className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">This Content is Locked</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mb-8">
                    Enroll in this course to unlock all lectures and start your systematic learning journey.
                  </p>
                  <Button 
                    onClick={handleEnroll} 
                    disabled={isEnrollLoading}
                    className="bg-primary hover:bg-primary/90 px-8 py-6 rounded-2xl font-bold gap-2 text-lg"
                  >
                    {isEnrollLoading ? <Loader2 className="animate-spin" /> : <GraduationCap size={20}/>}
                    Enroll to Unlock
                  </Button>
                </div>
              )}
            </div>

            {/* INFO SECTION */}
            <div className="mt-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                   <h2 className="text-2xl font-bold tracking-tight">{activeLesson?.title}</h2>
                   <p className="text-sm text-muted-foreground mt-1">From: {course.title}</p>
                </div>
                <Button variant="outline" className="gap-2"><Share2 size={16} /> Share</Button>
              </div>

              <Tabs defaultValue="overview">
                <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-12 p-0 gap-8">
                  <TabsTrigger value="overview" className="tab-trigger">Overview</TabsTrigger>
                  <TabsTrigger value="resources" className="tab-trigger">Resources</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="pt-6">
                  <p className="text-muted-foreground leading-relaxed">
                    Welcome to this lesson. Use the curriculum sidebar to navigate through the course systematically. 
                    {isEnrolled ? " Enjoy your learning!" : " Please enroll to access resources."}
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </ScrollArea>

        {/* SIDEBAR */}
        <aside className="flex flex-col bg-card/30 border-l border-border">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-bold">Course Content</h3>
            {!isEnrolled && <Lock size={14} className="text-muted-foreground" />}
          </div>

          <ScrollArea className="flex-1">
            {(course.sections ?? []).map((section) => (
              <div key={section.id} className="border-b border-border/50">
                <div 
                  onClick={() => setExpandedSections(prev => 
                    prev.includes(section.id) ? prev.filter(i => i !== section.id) : [...prev, section.id]
                  )}
                  className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 cursor-pointer"
                >
                  <div className="max-w-[80%]">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Section {section.order}</p>
                    <h4 className="text-sm font-bold truncate">{section.title}</h4>
                  </div>
                  {expandedSections.includes(section.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {expandedSections.includes(section.id) && (
                  <div className="px-3 pb-3 space-y-1">
                    {section.lectures.map((lecture) => (
                      <div 
                        key={lecture.id}
                        onClick={() => {
                          if (isEnrolled) {
                            setActiveLesson(lecture);
                            setIsPlaying(true);
                          } else {
                            alert("Please enroll to watch this lesson.");
                          }
                        }}
                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                          !isEnrolled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        } ${
                          activeLesson?.id === lecture.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-accent'
                        }`}
                      >
                        {isEnrolled ? (
                          <Play size={14} className={activeLesson?.id === lecture.id ? 'text-primary' : 'text-muted-foreground'} />
                        ) : (
                          <Lock size={12} className="text-muted-foreground" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h5 className={`text-xs font-semibold truncate ${activeLesson?.id === lecture.id ? 'text-primary' : ''}`}>
                            {lecture.title}
                          </h5>
                        </div>
                      </div>
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
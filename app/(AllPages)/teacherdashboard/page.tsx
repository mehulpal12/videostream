"use client";

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayCircle, Plus, CloudUpload, Save, Eye, Loader2, 
  CheckCircle2, Trash2, X, ChevronRight, FileVideo, Film
} from 'lucide-react';

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

export default function CourseBuilder() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- COURSE STATE ---
  const [courseId, setCourseId] = useState<string | null>(null);
  const [courseName, setCourseName] = useState("Mastering the MERN Stack");
  const [mentor, setMentor] = useState("Mehul Pal");
  const [price, setPrice] = useState("4999");

  // --- CURRICULUM STATE ---
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  
  // --- LECTURE UPLOAD STATE ---
  const [lectureTitle, setLectureTitle] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0); // Real-time %
  
  // --- UI STATUS ---
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  // 1. Initialize the Course
  const handleInitialSave = async () => {
    setIsCreatingCourse(true);
    try {
      const res = await axios.post("/api/courses", { title: courseName, mentor, price });
      setCourseId(res.data.id);
      if (res.data.sections) setSections(res.data.sections);
    } catch (error) {
       alert("Error synchronizing course");
    } finally {
      setIsCreatingCourse(false);
    }
  };

  // 2. Add New Section
  const handleAddSection = async () => {
    if (!courseId || !newSectionTitle.trim()) return;
    try {
      const res = await axios.post(`/api/courses/${courseId}/sections`, {
        title: newSectionTitle,
        order: sections.length + 1
      });
      setSections([...sections, { ...res.data, lectures: [] }]);
      setActiveSectionId(res.data.id);
      setNewSectionTitle("");
      setShowAddSection(false);
    } catch (error) {
      alert("Failed to add section");
    }
  };

  // 3. Real-Time Multi-Lecture Upload
  const handleLectureUpload = async () => {
    if (!videoFile || !activeSectionId) return;

    setIsUploading(true);
    setUploadProgress(0); // Start at 0

    const currentSection = sections.find((s) => s.id === activeSectionId);
    const nextOrder = (currentSection?.lectures?.length || 0) + 1;

    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("title", lectureTitle || `Lecture ${nextOrder}`);
    formData.append("sectionId", activeSectionId);
    formData.append("order", nextOrder.toString());

    try {
      // THE REAL-TIME MAGIC: Axios onUploadProgress
      const res = await axios.post("/api/upload/lecture", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        },
      });

      if (res.status === 201 || res.status === 200) {
        setSections((prev) =>
          prev.map((s) =>
            s.id === activeSectionId
              ? { ...s, lectures: [...(s.lectures || []), res.data].sort((a, b) => a.order - b.order) }
              : s
          )
        );

        // Reset
        setVideoFile(null);
        setLectureTitle("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (error: any) {
      alert(error.response?.data?.error || "Upload failed");
    } finally {
      setIsUploading(false);
      // Delay resetting progress slightly for visual satisfaction
      setTimeout(() => setUploadProgress(0), 10000);
    }
  };

  const activeSection = sections.find(s => s.id === activeSectionId);

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F17] text-slate-100 font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-[#0B0F17]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-lg"><PlayCircle size={20} /></div>
          <div>
            <input 
              className="bg-transparent border-none text-lg font-bold focus:ring-0 w-64 p-0 outline-none" 
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Builder Mode</p>
          </div>
        </div>
        
        {!courseId ? (
          <button onClick={handleInitialSave} className="bg-blue-600 px-6 py-2 rounded-xl font-bold text-sm">Initialize Course</button>
        ) : (
          <div className="flex items-center gap-2 text-green-400 text-xs font-bold bg-green-400/10 px-4 py-2 rounded-full">
            <CheckCircle2 size={14} /> System Active
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-80 border-r border-white/5 bg-[#0B0F17] flex flex-col">
          <div className="p-6 flex-1 overflow-y-auto">
            <h3 className="text-xs font-black uppercase text-slate-500 mb-6">Curriculum</h3>
            <div className="space-y-4">
              {sections.map((section) => (
                <div key={section.id}>
                  <div 
                    onClick={() => setActiveSectionId(section.id)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between ${activeSectionId === section.id ? 'border-blue-500 bg-blue-500/10' : 'border-white/5'}`}
                  >
                    <span className="text-xs font-bold">Section {section.order}: {section.title}</span>
                    <ChevronRight size={14} className={activeSectionId === section.id ? 'rotate-90 text-blue-500' : ''}/>
                  </div>
                  {activeSectionId === section.id && (
                    <div className="pl-4 mt-2 space-y-1 border-l-2 border-white/5 ml-2">
                      {section.lectures.map((lec) => (
                        <div key={lec.id} className="text-[10px] text-slate-400 py-1 flex items-center gap-2">
                          <FileVideo size={10}/> {lec.order}. {lec.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {courseId && <button onClick={() => setShowAddSection(true)} className="w-full py-2 border border-dashed border-white/10 rounded-xl text-xs text-slate-500 hover:text-white transition-all">+ New Section</button>}
            </div>
            {showAddSection && (
              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <input className="w-full bg-transparent border-none text-sm p-0 mb-3 outline-none" placeholder="Section Name..." value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)} />
                <button onClick={handleAddSection} className="w-full bg-blue-600 text-[10px] font-bold py-2 rounded-lg">Add</button>
              </div>
            )}
          </div>
        </aside>

        {/* WORKSPACE */}
        <main className="flex-1 bg-[#0E131F] p-12 overflow-y-auto">
          {!activeSectionId ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600">
               <Film size={64} className="mb-4 opacity-10"/>
               <p>Select a section to begin uploading</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-8">
              <div>
                <h2 className="text-3xl font-black italic">Upload Lecture</h2>
                <p className="text-slate-500 text-sm">Target: <span className="text-blue-500">{activeSection?.title}</span></p>
              </div>

              <input 
                className="w-full bg-transparent border-b border-white/10 py-4 text-xl outline-none focus:border-blue-500"
                placeholder="Lecture Title..."
                value={lectureTitle}
                onChange={(e) => setLectureTitle(e.target.value)}
              />

              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`aspect-video rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${videoFile ? 'border-green-500/50 bg-green-500/5' : 'border-white/5 hover:border-blue-500/30'}`}
              >
                <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)}/>
                {videoFile ? (
                  <div className="text-center">
                    <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4"/>
                    <p className="font-bold">{videoFile.name}</p>
                    <p className="text-xs text-slate-500">{(videoFile.size / 1048576).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="text-center text-slate-500">
                    <CloudUpload size={48} className="mx-auto mb-4"/>
                    <p className="font-bold text-white">Select Video</p>
                  </div>
                )}
              </div>

              {/* REAL-TIME PROGRESS AREA */}
              <div className="space-y-4">
                <AnimatePresence>
                  {isUploading && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0 }}
                      className="bg-white/5 p-6 rounded-3xl border border-white/10"
                    >
                      <div className="flex justify-between items-end mb-4">
                        <div>
                          <p className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em] mb-1">Live Upload</p>
                          <h4 className="text-sm font-bold">Syncing content with server...</h4>
                        </div>
                        <span className="text-2xl font-black text-white">{uploadProgress}%</span>
                      </div>
                      
                      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        />
                      </div>
                      
                      <p className="mt-4 text-[10px] text-slate-500 italic text-center">
                        Do not close this window until the process finish
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-end">
                  <button 
                    disabled={!videoFile || isUploading}
                    onClick={handleLectureUpload}
                    className="px-12 py-4 bg-blue-600 rounded-2xl font-black uppercase tracking-tighter hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                  >
                    {isUploading ? <Loader2 className="animate-spin" /> : "Upload Lecture"}
                  </button>
                </div>
              </div>

              {/* RECENT UPLOADS */}
              <div className="pt-12 border-t border-white/5">
                <h4 className="text-xs font-black uppercase text-slate-500 mb-6 tracking-widest">Section Sequence</h4>
                <div className="space-y-3">
                  {activeSection?.lectures.map((lec) => (
                    <div key={lec.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-4">
                        <span className="size-8 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-black">{lec.order}</span>
                        <span className="text-sm font-bold">{lec.title}</span>
                      </div>
                      <CheckCircle2 size={16} className="text-green-500/40" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
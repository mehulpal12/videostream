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
    
    // IF the course already existed, this will load all the previous sections/lectures!
    if (res.data.sections) {
      setSections(res.data.sections);
    }
  } catch (error) {
     alert("Error syncronizing course");
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

  // 3. Multi-Lecture Sequential Upload
  const handleLectureUpload = async () => {
    if (!videoFile || !activeSectionId) return;

    setIsUploading(true);
    const currentSection = sections.find((s) => s.id === activeSectionId);
    const nextOrder = (currentSection?.lectures?.length || 0) + 1;

    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("title", lectureTitle || `Lecture ${nextOrder}`);
    formData.append("sectionId", activeSectionId);
    formData.append("order", nextOrder.toString());

    try {
      const res = await axios.post("/api/upload/lecture", formData);

      // Update state and automatically sort by order
      setSections((prev) =>
        prev.map((s) =>
          s.id === activeSectionId
            ? { ...s, lectures: [...(s.lectures || []), res.data].sort((a, b) => a.order - b.order) }
            : s
        )
      );

      // Reset form for next upload in same section
      setVideoFile(null);
      setLectureTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      
    } catch (error: any) {
      alert(error.response?.data?.error || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const activeSection = sections.find(s => s.id === activeSectionId);

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F17] text-slate-100">
      {/* HEADER */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-[#0B0F17]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-600/20"><PlayCircle size={20} /></div>
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
          <button onClick={handleInitialSave} disabled={isCreatingCourse} className="bg-blue-600 px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-500 transition-all flex items-center gap-2">
            {isCreatingCourse ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
            Initialize Course
          </button>
        ) : (
          <div className="flex items-center gap-2 text-green-400 text-xs font-bold bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20">
            <CheckCircle2 size={14} /> Course Structure Active
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR: Curriculum Tree */}
        <aside className="w-80 border-r border-white/5 bg-[#0B0F17] flex flex-col">
          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest">Curriculum</h3>
              {courseId && <button onClick={() => setShowAddSection(true)} className="text-blue-500 hover:scale-110 transition-transform"><Plus size={20}/></button>}
            </div>

            <div className="space-y-4">
              {sections.map((section) => (
                <div key={section.id} className="group">
                  <div 
                    onClick={() => setActiveSectionId(section.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${activeSectionId === section.id ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/5 hover:bg-white/5'}`}
                  >
                    <span className="text-xs font-bold truncate">Section {section.order}: {section.title}</span>
                    <ChevronRight size={14} className={`transition-transform ${activeSectionId === section.id ? 'rotate-90 text-blue-500' : 'text-slate-600'}`}/>
                  </div>
                  
                  <AnimatePresence>
                    {activeSectionId === section.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden">
                        <div className="pl-4 mt-2 space-y-1 border-l-2 border-white/5 ml-2">
                          {section.lectures.map((lec) => (
                            <div key={lec.id} className="flex items-center gap-2 text-[10px] text-slate-400 py-2 hover:text-white transition-colors">
                              <FileVideo size={12} className="text-blue-500/50"/> {lec.order}. {lec.title}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {showAddSection && (
              <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <input 
                  autoFocus
                  className="w-full bg-transparent border-none text-sm p-0 mb-3 focus:ring-0 outline-none" 
                  placeholder="e.g. Database Setup"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                />
                <div className="flex gap-2">
                  <button onClick={handleAddSection} className="flex-1 bg-blue-600 text-[10px] font-bold py-2 rounded-lg">Add</button>
                  <button onClick={() => setShowAddSection(false)} className="px-3 bg-white/5 rounded-lg"><X size={14}/></button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* WORKSPACE: Multi-Upload Area */}
        <main className="flex-1 bg-[#0E131F] p-12 overflow-y-auto">
          {!activeSectionId ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600">
               <Film size={64} className="mb-4 opacity-20"/>
               <p className="font-medium">Select a section to begin uploading lectures</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="mb-10">
                <h2 className="text-3xl font-black mb-2">Upload Content</h2>
                <p className="text-slate-500 flex items-center gap-2">
                  Current Section: <span className="text-blue-500 font-bold bg-blue-500/10 px-3 py-1 rounded-full text-xs">{activeSection?.title}</span>
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Lecture Title</label>
                  <input 
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-blue-500/50 transition-all"
                    placeholder={`Lecture ${(activeSection?.lectures?.length || 0) + 1} Title...`}
                    value={lectureTitle}
                    onChange={(e) => setLectureTitle(e.target.value)}
                  />
                </div>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`aspect-video rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${videoFile ? 'border-green-500/50 bg-green-500/5' : 'border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5'}`}
                >
                  <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)}/>
                  {videoFile ? (
                    <div className="text-center animate-in fade-in zoom-in duration-300">
                      <div className="bg-green-500/20 p-4 rounded-full w-fit mx-auto mb-4 text-green-500"><CheckCircle2 size={32}/></div>
                      <p className="font-bold text-lg">{videoFile.name}</p>
                      <p className="text-xs text-slate-500">Ready to sync • {(videoFile.size / 1048576).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500">
                      <div className="bg-white/5 p-4 rounded-full w-fit mx-auto mb-4"><CloudUpload size={32}/></div>
                      <p className="font-bold text-white">Click to select video</p>
                      <p className="text-xs">Max 70MB per lecture</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button 
                    disabled={!videoFile || isUploading}
                    onClick={handleLectureUpload}
                    className="px-10 py-4 bg-blue-600 rounded-2xl font-bold flex items-center gap-3 disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95"
                  >
                    {isUploading ? <Loader2 className="animate-spin" size={20}/> : <Plus size={20}/>}
                    {isUploading ? "Uploading to Cloud..." : "Add Lecture to Section"}
                  </button>
                </div>

                {/* RECENT UPLOADS IN THIS SECTION */}
                <div className="mt-16 pt-8 border-t border-white/5">
                  <h4 className="text-sm font-bold text-slate-400 mb-6 flex items-center gap-2">
                     Curriculum Sequence <span className="bg-white/5 px-2 py-0.5 rounded text-[10px]">{activeSection?.lectures?.length} items</span>
                  </h4>
                  <div className="space-y-3">
                    {activeSection?.lectures.map((lec) => (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={lec.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#151B28] border border-white/5">
                        <div className="flex items-center gap-4">
                          <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xs shadow-lg shadow-blue-600/20">
                            {lec.order}
                          </div>
                          <span className="text-sm font-bold">{lec.title}</span>
                        </div>
                        <CheckCircle2 size={18} className="text-green-500/50" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
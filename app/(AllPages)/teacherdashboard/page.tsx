"use client";

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayCircle, Plus, CloudUpload, Save, Loader2, 
  CheckCircle2, X, ChevronRight, FileVideo, Film, Edit3, Settings,
  Trash2, Eye, Lock, Layout, ChevronDown, Share2
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

  // --- NAVIGATION STATE ---
  const [view, setView] = useState<'setup' | 'editor' | 'preview'>('setup');

  // --- COURSE DATA STATE ---
  const [courseId, setCourseId] = useState<string | null>(null);
  const [courseData, setCourseData] = useState({
    title: "",
    mentor: "",
    price: "",
    description: "",
    badge: "",
  });

  // --- CURRICULUM STATE ---
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  
  // --- PREVIEW SPECIFIC STATE ---
  const [previewLecture, setPreviewLecture] = useState<Lecture | null>(null);
  const [expandedPreviewSections, setExpandedPreviewSections] = useState<string[]>([]);

  // --- UI STATUS ---
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [lectureTitle, setLectureTitle] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Auto-set first lecture when entering preview
  useEffect(() => {
    if (view === 'preview' && sections.length > 0) {
      const firstLec = sections[0].lectures[0];
      if (firstLec) setPreviewLecture(firstLec);
      setExpandedPreviewSections([sections[0].id]);
    }
  }, [view, sections]);

  const handleSaveCourseDetails = async () => {
    if (!courseData.title || !courseData.mentor) return alert("Required fields missing.");
    setIsSyncing(true);
    try {
      const res = await axios.post("/api/courses", courseData);
      const data = res.data;
      setCourseId(data.id);
      setSections(data.sections || []);
      setCourseData({
        title: data.title, mentor: data.mentor, price: data.price.toString(),
        description: data.description || "", badge: data.badge || "",
      });
      setView('editor');
    } catch (error) {
      alert("Sync failed.");
    } finally { setIsSyncing(false); }
  };

  const handleAddSection = async () => {
    if (!courseId || !newSectionTitle.trim()) return;
    setIsAddingSection(true);
    try {
      const res = await axios.post(`/api/courses/${courseId}/sections`, {
        title: newSectionTitle, order: sections.length + 1
      });
      setSections(prev => [...prev, { ...res.data, lectures: [] }]);
      setActiveSectionId(res.data.id);
      setNewSectionTitle("");
      setShowAddSection(false);
    } catch (error) { alert("Add section failed."); }
    finally { setIsAddingSection(false); }
  };

  const handleLectureUpload = async () => {
    if (!videoFile || !activeSectionId) return;
    setIsUploading(true);
    setUploadProgress(0);
    const activeSection = sections.find(s => s.id === activeSectionId);
    const nextOrder = (activeSection?.lectures?.length || 0) + 1;
    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("title", lectureTitle || `Lecture ${nextOrder}`);
    formData.append("sectionId", activeSectionId);
    formData.append("order", nextOrder.toString());

    try {
      const res = await axios.post("/api/upload/lecture", formData, {
        onUploadProgress: (e) => e.total && setUploadProgress(Math.round((e.loaded * 100) / e.total)),
      });
      setSections(prev => prev.map(s => s.id === activeSectionId ? { ...s, lectures: [...s.lectures, res.data].sort((a, b) => a.order - b.order) } : s));
      setVideoFile(null); setLectureTitle("");
    } catch (error) { alert("Upload failed"); }
    finally { setIsUploading(false); }
  };

  const currentActiveSection = sections.find(s => s.id === activeSectionId);

  return (
    <div className="flex flex-col h-screen bg-[#0B0F17] text-slate-100 overflow-hidden font-sans">
      
      {/* --- SYSTEM HEADER --- */}
      <header className="h-20 flex items-center justify-between px-8 bg-[#0B0F17]/80 backdrop-blur-xl border-b border-white/5 shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20"><PlayCircle size={22} /></div>
            <h1 className="text-lg font-black tracking-tighter uppercase italic">LMS.Engine</h1>
          </div>
          
          <nav className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
            {[
              { id: 'setup', icon: Settings, label: '1. Setup' },
              { id: 'editor', icon: Edit3, label: '2. Editor' },
              { id: 'preview', icon: Eye, label: '3. Preview' }
            ].map((tab) => (
              <button 
                key={tab.id}
                disabled={!courseId && tab.id !== 'setup'}
                onClick={() => setView(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${view === tab.id ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300 disabled:opacity-20'}`}
              >
                <tab.icon size={14}/> {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* --- VIEW 1: COURSE SETUP --- */}
        {view === 'setup' && (
          <main className="flex-1 overflow-y-auto p-12 bg-[#0E131F]">
            <div className="max-w-3xl mx-auto space-y-12">
              <h2 className="text-4xl font-black tracking-tight">General Settings</h2>
              <div className="grid grid-cols-2 gap-8 bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Course Title</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-xl font-bold outline-none focus:border-blue-500 transition-all" value={courseData.title} onChange={(e) => setCourseData({...courseData, title: e.target.value})} />
                </div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Mentor</label><input className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500" value={courseData.mentor} onChange={(e) => setCourseData({...courseData, mentor: e.target.value})} /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Price (INR)</label><input className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500" type="number" value={courseData.price} onChange={(e) => setCourseData({...courseData, price: e.target.value})} /></div>
                <div className="col-span-2 space-y-2"><label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Description</label><textarea className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 min-h-[120px] resize-none" value={courseData.description} onChange={(e) => setCourseData({...courseData, description: e.target.value})} /></div>
              </div>
              <div className="flex justify-end pt-4">
                <button disabled={isSyncing} onClick={handleSaveCourseDetails} className="bg-blue-600 px-10 py-5 rounded-3xl font-black uppercase text-sm tracking-tighter flex items-center gap-3 shadow-xl shadow-blue-600/20 disabled:opacity-50">
                  {isSyncing ? <Loader2 className="animate-spin"/> : <Save size={18}/>}
                  {courseId ? "Save Changes" : "Create Course"}
                </button>
              </div>
            </div>
          </main>
        )}

        {/* --- VIEW 2: CURRICULUM EDITOR --- */}
        {view === 'editor' && (
          <div className="flex flex-1 overflow-hidden">
            <aside className="w-80 border-r border-white/5 bg-[#0B0F17] flex flex-col">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-500">Curriculum</h3>
                <button onClick={() => setShowAddSection(true)} className="size-8 flex items-center justify-center bg-blue-600/10 text-blue-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Plus size={18}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {sections.map(section => (
                  <button key={section.id} onClick={() => setActiveSectionId(section.id)} className={`w-full text-left p-4 rounded-2xl border transition-all ${activeSectionId === section.id ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 hover:bg-white/5'}`}>
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Section {section.order}</span>
                    <h4 className="text-xs font-bold text-slate-200 truncate">{section.title}</h4>
                  </button>
                ))}
                {showAddSection && (
                  <div className="p-4 bg-white/5 rounded-2xl border border-blue-500/30">
                    <input autoFocus className="w-full bg-transparent border-none text-sm mb-4 outline-none font-bold" placeholder="e.g. Intro" value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)} />
                    <button disabled={isAddingSection || !newSectionTitle.trim()} onClick={handleAddSection} className="w-full bg-blue-600 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">{isAddingSection ? <Loader2 size={12} className="animate-spin mx-auto"/> : "Add"}</button>
                  </div>
                )}
              </div>
            </aside>
            <main className="flex-1 bg-[#0E131F] p-12 overflow-y-auto">
              {!activeSectionId ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-20"><Film size={80}/><p className="mt-4 font-bold">Select a section</p></div>
              ) : (
                <div className="max-w-3xl mx-auto space-y-12 pb-20">
                  <h2 className="text-3xl font-black italic tracking-tighter">Section Editor</h2>
                  <div className="space-y-8">
                    <input className="w-full bg-transparent border-b border-white/10 py-4 text-2xl font-bold outline-none focus:border-blue-500" placeholder="Lecture Title..." value={lectureTitle} onChange={(e) => setLectureTitle(e.target.value)} />
                    <div onClick={() => !isUploading && fileInputRef.current?.click()} className={`aspect-video rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${videoFile ? 'border-green-500 bg-green-500/5 shadow-2xl shadow-green-500/10' : 'border-white/10 hover:border-blue-500/40'}`}>
                      <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)}/>
                      {videoFile ? (<><CheckCircle2 size={56} className="text-green-500 mb-4"/><p className="text-lg font-bold">{videoFile.name}</p></>) : (<><CloudUpload size={32} className="text-slate-500 mb-4"/><p className="text-lg font-bold">Select Video</p></>)}
                    </div>
                    {isUploading && (
                      <div className="p-8 bg-blue-600/10 rounded-[2.5rem] border border-blue-500/20">
                        <div className="flex justify-between items-center mb-4"><p className="text-[10px] font-black uppercase text-blue-500">Uploading</p><span className="text-3xl font-black">{uploadProgress}%</span></div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden"><motion.div className="h-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]" initial={{ width: 0 }} animate={{ width: `${uploadProgress}%` }} /></div>
                      </div>
                    )}
                    <div className="flex justify-end"><button disabled={!videoFile || isUploading} onClick={handleLectureUpload} className="px-16 py-5 bg-blue-600 rounded-[2rem] font-black uppercase text-sm tracking-tighter shadow-xl shadow-blue-600/20">Upload</button></div>
                  </div>
                  <div className="pt-16 space-y-3">
                    {currentActiveSection?.lectures.map(lec => (
                      <div key={lec.id} className="flex items-center justify-between p-5 rounded-3xl bg-white/[0.02] border border-white/5 group transition-colors">
                        <div className="flex items-center gap-5"><span className="size-10 rounded-2xl bg-white/5 flex items-center justify-center text-[10px] font-black group-hover:bg-blue-600 transition-all">{lec.order}</span><h5 className="text-sm font-bold">{lec.title}</h5></div>
                        <button className="p-2 text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </main>
          </div>
        )}

        {/* --- VIEW 3: STUDENT PREVIEW (Student Dashboard UI) --- */}
        {view === 'preview' && (
          <main className="flex-1 flex bg-[#0B0F17] overflow-hidden">
            {/* MAIN PREVIEW AREA */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="p-8 space-y-8">
                {/* VIDEO PLAYER PREVIEW */}
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/5">
                  {previewLecture?.videoUrl ? (
                    <video 
                      key={previewLecture.id}
                      src={previewLecture.videoUrl} 
                      className="w-full h-full object-contain" 
                      controls 
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4">
                      <Lock size={48} className="opacity-20"/>
                      <p className="font-bold">Select a lecture to preview video stream</p>
                    </div>
                  )}
                </div>

                {/* INFO AREA */}
                <div className="space-y-6 max-w-4xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-3xl font-black tracking-tight">{previewLecture?.title || courseData.title}</h2>
                      <p className="text-blue-500 font-bold text-xs uppercase tracking-widest mt-2">Mentor: {courseData.mentor}</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-6 py-2 bg-white/5 rounded-xl text-xs font-bold border border-white/5 flex items-center gap-2"><Share2 size={14}/> Share</button>
                    </div>
                  </div>
                  
                  {/* TABS SIMULATION */}
                  <div className="border-b border-white/5 flex gap-8">
                    <button className="pb-4 border-b-2 border-blue-600 text-sm font-black uppercase tracking-widest">Overview</button>
                    <button className="pb-4 border-b-2 border-transparent text-slate-500 text-sm font-black uppercase tracking-widest">Resources</button>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-sm">{courseData.description || "No description provided for this course yet."}</p>
                </div>
              </div>
            </div>

            {/* CURRICULUM PREVIEW SIDEBAR */}
            <aside className="w-[380px] bg-[#0E131F] border-l border-white/5 flex flex-col">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-black text-sm uppercase tracking-widest text-slate-400">Curriculum</h3>
                <Layout size={16} className="text-slate-600"/>
              </div>
              <div className="flex-1 overflow-y-auto">
                {sections.map((section) => (
                  <div key={section.id} className="border-b border-white/5">
                    <button 
                      onClick={() => setExpandedPreviewSections(prev => prev.includes(section.id) ? prev.filter(i => i !== section.id) : [...prev, section.id])}
                      className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-all"
                    >
                      <div className="text-left">
                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Module {section.order}</p>
                        <h4 className="text-xs font-bold text-slate-200">{section.title}</h4>
                      </div>
                      <ChevronDown size={16} className={`text-slate-500 transition-transform ${expandedPreviewSections.includes(section.id) ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedPreviewSections.includes(section.id) && (
                      <div className="px-3 pb-4 space-y-1">
                        {section.lectures.map((lec) => (
                          <button 
                            key={lec.id}
                            onClick={() => setPreviewLecture(lec)}
                            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${previewLecture?.id === lec.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'hover:bg-white/5 text-slate-400'}`}
                          >
                            <PlayCircle size={14} className={previewLecture?.id === lec.id ? 'text-white' : 'text-blue-500'} />
                            <span className="text-xs font-bold truncate text-left">{lec.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </aside>
          </main>
        )}
      </div>
    </div>
  );
}
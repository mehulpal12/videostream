"use client";

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  PlayCircle, Plus, CloudUpload, Save, Eye, Loader2, CheckCircle2, Trash2, X
} from 'lucide-react';

interface Section {
  id: number;
  title: string;
  items: string[];
}

export default function CourseBuilder() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("Welcome to the Course");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("49.99");
  const [mentor, setMentor] = useState("Instructor");
  const [courseName, setCourseName] = useState("Advanced React Design Patterns");
  
  // Status State
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [activeLecture, setActiveLecture] = useState("1.1 Introduction");

  // Dynamic sections
  const [sections, setSections] = useState<Section[]>([
    { id: 1, title: "Section 1: Basics", items: ["1.1 Introduction", "1.2 Getting Started"] },
    { id: 2, title: "Section 2: Hooks", items: ["2.1 useRef Deep Dive", "2.2 Hooks Challenge"] },
  ]);
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const MAX_FILE_SIZE = 70 * 1024 * 1024; // 70MB

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        alert("File size too large (Max 70MB)");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!file) {
      alert("Please select a video file first");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      await axios.post("/api/video-upload", formData);
      router.push("/");
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed. Please check your connection.");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await axios.post("/api/courses", {
        title: courseName,
        mentor: mentor,
        price: price,
        badge: "NEW",
        color: "bg-gradient-to-br from-blue-600 to-purple-600",
      });
      setPublishSuccess(true);
      setTimeout(() => setPublishSuccess(false), 3000);
    } catch (error) {
      console.error("Publish failed", error);
      alert("Failed to publish course. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    const newId = sections.length + 1;
    setSections([...sections, {
      id: newId,
      title: newSectionTitle,
      items: [],
    }]);
    setNewSectionTitle("");
    setShowAddSection(false);
  };

  const handleRemoveSection = (id: number) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const handlePreview = () => {
    window.open('/courses', '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#111621] text-slate-900 dark:text-slate-100">
      {/* --- TOP NAVIGATION --- */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 dark:bg-[#111621] dark:border-slate-800">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-blue-600">
            <div className="flex items-center justify-center text-white rounded-lg size-8 bg-blue-600">
              <PlayCircle size={20} />
            </div>
            <h2 className="text-lg font-bold tracking-tight">VideoStream</h2>
          </div>
          <div className="hidden h-6 w-px bg-slate-200 dark:bg-slate-800 md:block" />
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold">Course Builder</h1>
            <input 
              className="text-xs text-slate-500 bg-transparent border-none p-0 focus:ring-0 focus:outline-none w-64"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Course name..."
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handlePreview}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
          >
            <Eye size={16} /> Preview
          </button>
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-6 py-2 text-sm font-bold text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPublishing ? (
              <><Loader2 className="animate-spin" size={16} /> Publishing...</>
            ) : publishSuccess ? (
              <><CheckCircle2 size={16} /> Published!</>
            ) : (
              'Publish Course'
            )}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* --- CURRICULUM SIDEBAR --- */}
        <aside className="hidden w-80 flex-col border-r border-slate-200 bg-white dark:bg-[#111621] dark:border-slate-800 lg:flex">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Curriculum</h3>
              <button 
                onClick={() => setShowAddSection(true)}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Plus size={14} /> Add Section
              </button>
            </div>

            {/* Add Section Form */}
            {showAddSection && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2 p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30"
              >
                <input
                  autoFocus
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSection()}
                  placeholder="Section title..."
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-1 focus:ring-blue-600 outline-none"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleAddSection}
                    className="flex-1 text-xs font-bold text-white bg-blue-600 rounded-lg py-1.5 hover:bg-blue-700"
                  >
                    Add
                  </button>
                  <button 
                    onClick={() => { setShowAddSection(false); setNewSectionTitle(""); }}
                    className="px-3 text-xs font-bold text-slate-500 hover:text-slate-700 rounded-lg py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            <nav className="space-y-4">
              {sections.map((section) => (
                <SidebarSection 
                  key={section.id}
                  title={section.title} 
                  activeLecture={activeLecture} 
                  setActive={setActiveLecture}
                  items={section.items}
                  onRemove={() => handleRemoveSection(section.id)}
                  canRemove={sections.length > 1}
                />
              ))}
            </nav>
          </div>
        </aside>

        {/* --- MAIN BUILDER AREA --- */}
        <main className="flex-1 p-4 overflow-y-auto md:p-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
            
            {/* Lecture Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase">
                <span>Section 1</span> <span>/</span> <span>Lecture 1.1</span>
              </div>
              <input 
                className="w-full p-0 text-3xl font-black bg-transparent border-none focus:ring-0 placeholder:text-slate-300 dark:placeholder:text-slate-700" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Integrated Upload Zone */}
            <input 
              type="file" 
              accept="video/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            
            <motion.div 
              onClick={handleUploadClick}
              whileHover={{ scale: 1.01, borderColor: "rgba(36, 99, 235, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              className={`p-12 text-center transition-all border-2 border-dashed rounded-xl bg-white dark:bg-slate-900 group cursor-pointer ${
                file ? "border-green-500/50" : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={`flex items-center justify-center transition-transform rounded-full size-16 group-hover:scale-110 ${
                  file ? "bg-green-500/10 text-green-500" : "bg-blue-600/10 text-blue-600"
                }`}>
                  {file ? <CheckCircle2 size={32} /> : <CloudUpload size={32} />}
                </div>
                <div>
                  <h4 className="text-lg font-bold">
                    {file ? file.name : "Upload Video Lesson"}
                  </h4>
                  <p className="max-w-xs mx-auto text-sm text-slate-500">
                    {file ? `Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB` : "Drag & drop MP4/MOV files (Max 70MB)"}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Description Textarea */}
            <textarea 
               className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[150px] focus:ring-1 focus:ring-blue-600 outline-none"
               placeholder="Lecture description..."
               value={description}
               onChange={(e) => setDescription(e.target.value)}
            />

            {/* Settings Bar */}
            <div className="p-6 shadow-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex gap-8">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Mentor Name</label>
                  <input 
                    type="text" 
                    className="w-32 bg-slate-50 dark:bg-slate-800 border-none rounded-lg font-bold mt-1 text-sm" 
                    value={mentor}
                    onChange={(e) => setMentor(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Pricing</label>
                  <input 
                    type="number" 
                    className="w-24 bg-slate-50 dark:bg-slate-800 border-none rounded-lg font-bold mt-1" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-6 py-2 text-sm font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Discard</button>
                <button 
                  onClick={() => handleSubmit()}
                  disabled={isUploading || !file}
                  className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isUploading ? (
                    <> <Loader2 className="animate-spin" size={16} /> Uploading... </>
                  ) : (
                    <> <Save size={16} /> Save Lecture </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function SidebarSection({ title, items, activeLecture, setActive, onRemove, canRemove }: any) {
  return (
    <div className="space-y-2 group/section">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
        {canRemove && (
          <button 
            onClick={onRemove}
            className="opacity-0 group-hover/section:opacity-100 text-slate-400 hover:text-red-500 transition-all"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
      <div className="space-y-1">
        {items.length > 0 ? items.map((item: string) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              activeLecture === item 
                ? "bg-blue-600/10 text-blue-600 border border-blue-600/20 font-semibold" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <PlayCircle size={14} />
            {item}
          </button>
        )) : (
          <p className="text-xs text-slate-400 italic px-3 py-2">No lectures added yet</p>
        )}
      </div>
    </div>
  );
}
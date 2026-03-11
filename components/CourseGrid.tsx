"use client";

import React, { useState, useMemo } from 'react';
import { Star, User, Filter } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

// --- CONSTANTS ---
const PRICE_TYPES = ['Free', 'Paid'];
const SORT_OPTIONS = ['Most Relevant', 'Newest', 'Price: Low to High', 'Price: High to Low'];

interface Course {
  id: string;
  title: string;
  mentor: string;
  price: number;
  badge?: string | null;
  color: string;
  createdAt: string;
}

export default function CourseGrid({ 
  courses: initialCourses, 
  searchQuery = '' 
}: { 
  courses: Course[]; 
  searchQuery?: string;
}) {
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('Most Relevant');

  // --- REFINED FILTERING & SORTING LOGIC ---
  const filteredAndSorted = useMemo(() => {
    let result = [...initialCourses];

    // 1. Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.mentor.toLowerCase().includes(q) ||
        (c.badge && c.badge.toLowerCase().includes(q))
      );
    }

    // 2. Price filter (Fixed logic)
    if (priceFilter === 'Free') {
      result = result.filter(c => c.price === 0);
    } else if (priceFilter === 'Paid') {
      result = result.filter(c => c.price > 0);
    }

    // 3. Sort (Fixed cases)
    switch (sortBy) {
      case 'Newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'Price: Low to High':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        // Most Relevant: Keep original order or sort by date
        break;
    }

    return result;
  }, [initialCourses, searchQuery, priceFilter, sortBy]);

  // Handle Radio Toggle (Allow unchecking)
  const handlePriceFilter = (type: string) => {
    setPriceFilter(prev => prev === type ? null : type);
  };

  return (
    <div id="courses" className="grid lg:grid-cols-[280px_1fr] gap-12 items-start bg-background text-foreground transition-colors duration-300">
      
      {/* SIDEBAR FILTERS */}
      <aside className="space-y-10 sticky top-24 hidden lg:block">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-8 flex items-center gap-2">
            <Filter size={14} /> Filters
          </h3>
          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-foreground">Price Range</h4>
              <div className="space-y-3">
                {PRICE_TYPES.map((item) => (
                  <label key={item} className="flex items-center gap-3 text-muted-foreground text-sm cursor-pointer hover:text-primary transition group">
                    <input 
                      type="radio" 
                      name="price"
                      // Changed: use checked to reflect state correctly
                      checked={priceFilter === item}
                      onChange={() => handlePriceFilter(item)}
                      className="rounded-full border-border bg-transparent text-primary focus:ring-primary w-4 h-4" 
                    /> 
                    <span className={`transition-transform ${priceFilter === item ? 'text-primary font-bold translate-x-1' : 'group-hover:translate-x-1'}`}>
                      {item}
                    </span>
                  </label>
                ))}
                {priceFilter && (
                  <button 
                    onClick={() => setPriceFilter(null)}
                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline mt-2"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <MentorCard 
          name="Marcus Thorne" 
          role="Google Senior UX Designer" 
        />
      </aside>

      {/* RESULTS GRID */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-border pb-6">
          <span className="text-muted-foreground text-sm font-medium">
            Showing <span className="text-foreground font-bold">{filteredAndSorted.length}</span> results
            {searchQuery && (
              <span> for &quot;<span className="text-primary font-bold">{searchQuery}</span>&quot;</span>
            )}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer text-primary border-none outline-none appearance-none"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt} value={opt} className="bg-background text-foreground">{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSorted.map((course) => (
            <ItemCard key={course.id} course={course} />
          ))}
          
          {/* No results state */}
          {filteredAndSorted.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="bg-muted p-4 rounded-full">
                <Filter className="text-muted-foreground" size={32} />
              </div>
              <p className="text-muted-foreground font-medium italic">
                {searchQuery ? `No courses found matching "${searchQuery}".` : 'No courses match your selected filters.'}
              </p>
              <Button variant="outline" size="sm" onClick={() => {setPriceFilter(null); setSortBy('Most Relevant');}}>
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// --- SUB-COMPONENTS (Kept as per your original code) ---

const MentorCard = ({ name, role }: { name: string; role: string }) => (
  <Card className="bg-primary/5 border-primary/20 rounded-2xl p-6 text-center group shadow-none">
    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">Mentor of the month</h3>
    <div className="relative w-20 h-20 mx-auto mb-4">
      <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-20 group-hover:opacity-40 transition" />
      <div className="relative w-full h-full bg-muted rounded-full border-2 border-primary p-1">
        <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
          <User className="text-muted-foreground" />
        </div>
      </div>
    </div>
    <h4 className="font-bold text-foreground">{name}</h4>
    <p className="text-xs text-muted-foreground mb-6 mt-1">{role}</p>
    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/10">
      View Profile
    </Button>
  </Card>
);

const ItemCard = ({ course }: { course: Course }) => (
  <Link href={`/courses/${course.id}`}>
    <Card className="bg-card text-card-foreground border-border rounded-xl overflow-hidden hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 group shadow-sm hover:shadow-xl hover:shadow-primary/5 cursor-pointer">
      <div className={`h-44 ${course.color || 'bg-muted'} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
        <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-mono border border-border">
          12h 45m
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        <div className="flex gap-2">
          {course.badge && (
            <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-1 rounded uppercase tracking-tighter">
              {course.badge}
            </span>
          )}
          <span className="text-[9px] font-black bg-muted text-muted-foreground px-2 py-1 rounded uppercase tracking-tighter">Course</span>
        </div>
        
        <h3 className="font-bold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
          {course.title}
        </h3>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center border border-border">
            <User size={12}/>
          </div>
          {course.mentor}
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
            <Star className="w-3 h-3 fill-yellow-500" /> 4.9
          </div>
          <span className="font-bold text-foreground">
            {course.price === 0 ? "Free" : `₹${course.price.toLocaleString()}`}
          </span>
        </div>
      </div>
    </Card>
  </Link>
);
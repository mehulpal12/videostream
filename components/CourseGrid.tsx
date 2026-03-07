import React from 'react';
import { Star, ChevronRight, User, Filter } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {prisma} from "@/lib/prisma"; 

// --- CONSTANTS ---
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Expert'];
const PRICE_TYPES = ['Free', 'Paid'];

export default async function CourseGrid() {
  // 1. Fetch courses from the Backend (Neon DB)
  const courses = await prisma.course.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-12 items-start bg-background text-foreground transition-colors duration-300">
      
      {/* SIDEBAR FILTERS */}
      <aside className="space-y-10 sticky top-24 hidden lg:block">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-8 flex items-center gap-2">
            <Filter size={14} /> Filters
          </h3>
          <div className="space-y-8">
            <FilterSection title="Difficulty" items={DIFFICULTIES} type="checkbox" />
            <FilterSection title="Price Range" items={PRICE_TYPES} type="radio" name="price" />
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
            Showing <span className="text-foreground font-bold">{courses.length}</span> results
          </span>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm">Sort by:</span>
            <select className="bg-transparent text-sm font-bold focus:outline-none cursor-pointer text-primary border-none outline-none">
              <option className="bg-background">Most Relevant</option>
              <option className="bg-background">Newest</option>
              <option className="bg-background">Price: Low to High</option>
            </select>
          </div>
        </div>

        {/* 2. Map through the actual database results */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <ItemCard key={course.id} course={course} />
          ))}
          
          {courses.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground italic">
              No courses found in the database.
            </div>
          )}
        </div>

        {/* <Pagination /> */}
      </section>
    </div>
  );
}

// --- SUB-COMPONENTS ---


// ... FilterSection, MentorCard, and Pagination remain the same

const FilterSection = ({ title, items, type, name }: any) => (
  <div className="space-y-4">
    <h4 className="text-sm font-bold text-foreground">{title}</h4>
    <div className="space-y-3">
      {items.map((item: string) => (
        <label key={item} className="flex items-center gap-3 text-muted-foreground text-sm cursor-pointer hover:text-primary transition group">
          <input 
            type={type} 
            name={name}
            className="rounded border-border bg-transparent text-primary focus:ring-primary" 
          /> 
          <span className="group-hover:translate-x-1 transition-transform">{item}</span>
        </label>
      ))}
    </div>
  </div>
);

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

const ItemCard = ({ course }: { course: any }) => (
  <Card className="bg-card text-card-foreground border-border rounded-xl overflow-hidden hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 group shadow-sm hover:shadow-xl hover:shadow-primary/5">
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
          ${course.price.toFixed(2)}
        </span>
      </div>
    </div>
  </Card>
);
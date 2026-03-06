import React from 'react';
import { Search, Bell, Grid, Menu, ChevronRight, Star, ShoppingCart, Filter, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/hero';
import TrendingNow from '@/components/TrendingNow';
import CourseGrid from '@/components/CourseGrid';
import Footer from '@/components/Footer';

export default function VideoStreamDashboard() {
  const categories = ['#Development', '#UXDesign', '#Business', '#DataScience'];
  
  return (
    <div className="min-h-screen  text-white font-sans selection:bg-blue-500/30">
      {/* --- NAVIGATION --- */}
      <Navbar/>

      <main className="max-w-[1600px] mx-auto p-8">
        
        {/* --- HERO SECTION --- */}
        <Hero/>

        {/* --- TRENDING NOW --- */}
        <TrendingNow/>

        {/* --- MAIN GRID AREA --- */}
        <CourseGrid/>
      </main>

      {/* --- FOOTER --- */}
      <Footer/>
    </div>
  );
}
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/hero';
import TrendingNow from '@/components/TrendingNow';
import CourseGrid from '@/components/CourseGrid';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';

export default async function VideoStreamDashboard({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params?.search || '';

  // Fetch all courses server-side and pass to client CourseGrid
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Serialize dates for client component
  const serializedCourses = courses.map(c => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen text-white font-sans selection:bg-blue-500/30">
      {/* --- NAVIGATION --- */}
      <Navbar />

      <main className="max-w-[1600px] mx-auto p-8 pt-24">
        
        {/* --- HERO SECTION --- */}
        <Hero />

        {/* --- TRENDING NOW --- */}
        <TrendingNow />

        {/* --- MAIN GRID AREA --- */}
        <CourseGrid courses={serializedCourses} searchQuery={searchQuery} />
      </main>

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
}
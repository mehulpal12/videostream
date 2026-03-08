import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from "@/components/ui/button"
import {prisma} from "@/lib/prisma" // Import your Prisma singleton

const TrendingNow = async () => {
  // 1. Fetch data from Neon via Prisma
  // We'll take the 3 most recent courses
  const trendingCourses = await prisma.course.findMany({
    take: 3,
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className=" text-foreground transition-colors duration-300">
      <section className="mb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Trending Now</h2>
            <p className="text-muted-foreground text-sm mt-1">Hand-picked courses by our top mentors.</p>
          </div>
          <Button variant="link" className="text-primary font-semibold h-auto p-0">
            View all
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trendingCourses.map((course) => (
            <Link 
              href={`/courses`} // Dynamic link using ID
              key={course.id} 
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer flex flex-col"
            >
              {/* Image / Gradient Area using DB color */}
              <div className={`h-48 ${course.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                {course.badge && (
                  <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-black tracking-widest border border-border">
                    {course.badge}
                  </div>
                )}
              </div>

              {/* Content Area */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {course.mentor} • Senior Eng
                </p>
                
                <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                  {/* Rendering Float as currency */}
                  <span className="text-xl font-black">
                    ${course.price.toFixed(2)}
                  </span>
                  <button 
                    className="p-2.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all active:scale-90"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default TrendingNow
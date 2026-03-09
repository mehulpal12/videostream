"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const platformLinks = [
    { name: "Browse Courses", href: "/" },
    { name: "Become a Mentor", href: "/teacherdashboard" },
    { name: "Pricing Plans", href: "#" },
  ];

  const communityLinks = [
    { name: "Learning Hub", href: "/" },
    { name: "Success Stories", href: "#" },
    { name: "Help Center", href: "#" },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-card/50 border-t border-border mt-24 pt-20 pb-10 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        
        {/* Brand Section */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter text-primary">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">V</div>
            VideoStream
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Revolutionizing online learning with interactive 4K video streams and expert mentorship for a global community of lifelong learners.
          </p>
        </div>

        {/* Dynamic Link Sections */}
        <div>
          <h4 className="font-bold mb-6 text-foreground">Platform</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            {platformLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-primary transition-colors italic md:not-italic">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-foreground">Community</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            {communityLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-primary transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Section */}
        <div>
          <h4 className="font-bold mb-6 text-foreground">Subscribe to Newsletter</h4>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-muted/50 border border-border rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm" 
            />
            <button 
              type="submit"
              className="bg-primary hover:opacity-90 text-primary-foreground px-6 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-primary/10"
            >
              Join
            </button>
          </form>
          {subscribed && (
            <p className="text-green-500 text-sm mt-3 font-medium animate-in fade-in">
              ✓ Subscribed successfully!
            </p>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1600px] mx-auto px-8 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground/60 text-[10px] uppercase font-bold tracking-widest">
        <p>© 2026 VideoStream Inc. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-foreground transition-colors">Cookie Settings</a>
        </div>
      </div>
    </footer>
  );
}
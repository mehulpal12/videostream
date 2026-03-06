import React from 'react';

export default function Footer() {
  const platformLinks = [
    { name: "Browse Courses", href: "#" },
    { name: "Become a Mentor", href: "#" },
    { name: "Pricing Plans", href: "#" },
  ];

  const communityLinks = [
    { name: "Learning Hub", href: "#" },
    { name: "Success Stories", href: "#" },
    { name: "Help Center", href: "#" },
  ];

  return (
    <footer className="bg-card/50 border-t border-border mt-24 pt-20 pb-10 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        
        {/* Brand Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-primary">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">V</div>
            VideoStream
          </div>
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
                <a href={link.href} className="hover:text-primary transition-colors italic md:not-italic">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-foreground">Community</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            {communityLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="hover:text-primary transition-colors">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Section */}
        <div>
          <h4 className="font-bold mb-6 text-foreground">Subscribe to Newsletter</h4>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-muted/50 border border-border rounded-xl px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-primary/50 text-sm" 
            />
            <button className="bg-primary hover:opacity-90 text-primary-foreground px-6 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-primary/10">
              Join
            </button>
          </div>
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
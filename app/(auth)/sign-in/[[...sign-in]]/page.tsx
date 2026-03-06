import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-[#050505] text-white">
      {/* Left Side: Branding/Marketing */}
      <section className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-900/20 to-transparent border-r border-white/5">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
          <div className="w-8 h-8 bg-blue-600 rounded-lg" />
          StreamLearn
        </div>
        
        <div>
          <h2 className="text-4xl font-medium leading-tight mb-4">
            Master the stack <br /> 
            <span className="text-slate-500">one stream at a time.</span>
          </h2>
          <p className="text-slate-400 max-w-md">
            Join 10k+ developers learning fullstack skills through interactive live sessions.
          </p>
        </div>

        <div className="text-sm text-slate-500">
          © 2026 StreamLearn Inc.
        </div>
      </section>

      {/* Right Side: Custom Sign In Form */}
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-semibold tracking-tight">Login</h1>
            <p className="text-slate-400">Enter your credentials to access your account</p>
          </div>

          <SignIn
            appearance={{
              elements: {
                // Remove Clerk's default card & styling
                card: "bg-transparent shadow-none border-none p-0 m-0 w-full",
                header: "hidden", // We use our own custom header above
                navbar: "hidden",
                footer: "bg-transparent",
                
                // Inputs: Minimalist dark style
                formFieldInput: "bg-white/[0.03] border-white/10 text-white focus:border-blue-500 focus:ring-0 h-12 rounded-xl transition-all",
                formFieldLabel: "text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2",
                
                // Primary Action: High-contrast bold
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]",
                
                // Social Buttons: Outlined modern
                socialButtonsBlockButton: "bg-white/[0.03] border-white/10 hover:bg-white/[0.08] text-white h-12 rounded-xl transition-all",
                socialButtonsBlockButtonText: "font-medium text-slate-200",
                
                // Divider: Sublte
                dividerLine: "bg-white/5",
                dividerText: "text-slate-500 text-[10px] font-bold uppercase tracking-tighter bg-[#050505] px-3",
                
                // Links
                footerActionText: "text-slate-500",
                footerActionLink: "text-blue-400 hover:text-blue-300 font-semibold transition-colors",
              },
            }}
          />
        </div>
      </section>
    </main>
  );
}
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-[#050505] text-white">
      {/* Left Side: Value Proposition */}
      <section className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-tr from-blue-900/20 to-transparent border-r border-white/5">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter cursor-pointer">
          <div className="w-8 h-8 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20" />
          StreamLearn
        </div>
        
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Live Now: Next.js 16 Masterclass
          </div>
          <h2 className="text-5xl font-semibold leading-[1.1] tracking-tight">
            Start your <br /> 
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">coding journey.</span>
          </h2>
          <ul className="space-y-4 text-slate-400">
            <li className="flex items-center gap-3">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              Access to 500+ hours of premium content
            </li>
            <li className="flex items-center gap-3">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              Join a community of 10,000+ developers
            </li>
          </ul>
        </div>

        <div className="text-sm text-slate-500">
          Trusted by engineers at top tech companies.
        </div>
      </section>

      {/* Right Side: Sign Up Form */}
      <section className="flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-[400px] py-12">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-semibold tracking-tight text-white">Create Account</h1>
            <p className="text-slate-400 mt-2">Join StreamLearn and level up your skills today.</p>
          </div>

          <SignUp
            appearance={{
              elements: {
                card: "bg-transparent shadow-none border-none p-0 m-0 w-full",
                header: "hidden",
                navbar: "hidden",
                footer: "bg-transparent",
                
                // Inputs: Matches the Sign-In aesthetic
                formFieldInput: "bg-white/[0.03] border-white/10 text-white focus:border-blue-500 focus:ring-0 h-11 rounded-xl transition-all",
                formFieldLabel: "text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em] mb-2",
                
                // Primary Action
                formButtonPrimary: "bg-white hover:bg-slate-200 text-black h-11 rounded-xl text-sm font-bold transition-all active:scale-[0.98] mt-2",
                
                // Social Buttons
                socialButtonsBlockButton: "bg-white/[0.03] border-white/10 hover:bg-white/[0.08] text-white h-11 rounded-xl transition-all",
                socialButtonsBlockButtonText: "font-medium text-slate-300",
                
                // Divider
                dividerLine: "bg-white/5",
                dividerText: "text-slate-600 text-[10px] font-bold uppercase tracking-widest bg-[#050505] px-4",
                
                // Footer & Links
                footerActionText: "text-slate-500",
                footerActionLink: "text-blue-400 hover:text-blue-300 font-semibold ml-1",
              },
            }}
          />
        </div>
      </section>
    </main>
  );
}
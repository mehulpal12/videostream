/**
 * Design System Constants
 * Use these for consistent branding across custom components and Clerk UI
 */

export const COLORS = {
  bg: "#050505",           // Deep black background
  surface: "white/[0.03]", // Subtle transparent containers
  border: "white/10",      // Thin border for dark mode
  primary: "#2563eb",      // Brand Blue (Blue-600)
  primaryHover: "#1d4ed8", // Darker Blue (Blue-700)
  textMain: "#ffffff",     // Pure white text
  textMuted: "#94a3b8",    // Slate-400 for descriptions
  textDim: "#64748b",      // Slate-500 for labels/dividers
};

export const CLERK_APPEARANCE = {
  elements: {
    // Layout
    card: "bg-transparent shadow-none border-none p-0 m-0 w-full",
    header: "hidden",
    navbar: "hidden",
    footer: "bg-transparent mt-4",

    // Inputs
    formFieldInput: `bg-${COLORS.surface} border-${COLORS.border} text-white focus:border-blue-500 focus:ring-0 h-11 rounded-xl transition-all`,
    formFieldLabel: "text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em] mb-2",
    
    // Buttons
    formButtonPrimary: "bg-white hover:bg-slate-200 text-black h-11 rounded-xl text-sm font-bold transition-all active:scale-[0.98] mt-2",
    socialButtonsBlockButton: `bg-${COLORS.surface} border-${COLORS.border} hover:bg-white/[0.08] text-white h-11 rounded-xl transition-all`,
    socialButtonsBlockButtonText: "font-medium text-slate-300",
    
    // Accents
    dividerLine: "bg-white/5",
    dividerText: `text-slate-600 text-[10px] font-bold uppercase tracking-widest bg-[${COLORS.bg}] px-4`,
    footerActionText: "text-slate-500",
    footerActionLink: "text-blue-400 hover:text-blue-300 font-semibold ml-1",
  },
};
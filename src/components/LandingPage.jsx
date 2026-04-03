import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#f9f9f7]/80 backdrop-blur-md flex justify-between items-center px-6 h-20 shadow-[0px_20px_40px_rgba(4,27,11,0.04)]">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-['Noto_Serif'] font-bold text-[#041b0b]">Mansik</span>
          <nav className="hidden md:flex gap-8 items-center">
            <a className="text-[#041b0b] font-bold font-['Noto_Serif'] tracking-tight duration-300 ease-in-out hover:opacity-80 transition-opacity" href="#">Home</a>
            <a className="text-[#041b0b]/60 font-['Noto_Serif'] tracking-tight duration-300 ease-in-out hover:opacity-80 transition-opacity" href="#">Insights</a>
            <a className="text-[#041b0b]/60 font-['Noto_Serif'] tracking-tight duration-300 ease-in-out hover:opacity-80 transition-opacity" href="#">AI Companion</a>
            <a className="text-[#041b0b]/60 font-['Noto_Serif'] tracking-tight duration-300 ease-in-out hover:opacity-80 transition-opacity" href="#">Guidance</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/auth" className="text-[#041b0b] font-medium hover:text-[#516600] transition-colors pr-2">Sign In</Link>
          <Link to="/auth" className="bg-[#041b0b] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#344c38] transition-colors shadow-sm">Get Started</Link>
        </div>
      </header>

      <main className="pt-20 flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex items-center px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover" alt="misty mountain range at sunrise" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH2fg_3AUMFdL0apHwDLUVI2dBHp9SapmNXJhlvdO-1_uST2zj8_4Y-J2g5qleCSBL8-xOsiITswi3DI8C5JbNs9fA91PbZouTzd6N6yAWq6ZIQXIRxk-XQ3ilEg2oLjMvrvrWdnlJGAbp6-DNkJITB0nBl5ksIqBZsfP6jVwYIgturtqcCouyjuJo7xqzmf9fwyJX3pjZzmMsC4Wt76LpWgPoaZe9tV5q3slyfYV_JA0QOKKxxFiYQcMn019ujWMFqHJ2WTdHXFk" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#f9f9f7]/0 to-[#f9f9f7]"></div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
            <span className="uppercase tracking-[0.3em] text-xs font-semibold text-primary opacity-60">The Modern Sanctuary</span>
            <h1 className="text-6xl md:text-8xl font-headline font-bold text-primary tracking-tight leading-[1.1]">
              Restore your inner <br /><span className="italic font-normal">stillness.</span>
            </h1>
            <p className="text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              A premium digital retreat designed to harmonise your mental landscape through scientific precision and gentle guidance.
            </p>
            <div className="pt-4">
              <Link to="/auth" className="inline-block bg-primary text-on-primary px-10 py-5 rounded-full text-lg font-medium shadow-[0px_20px_40px_rgba(4,27,11,0.1)] hover:scale-105 transition-transform">
                Enter the Sanctuary
              </Link>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-32 px-6 bg-surface">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-headline font-bold text-primary leading-tight">
                A sanctuary built for <br />cognitive clarity.
              </h2>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                In an age of constant noise, Mansik provides the silence. We combine ancient wisdom with longitudinal data tracking to offer a personalized path to wellness that respects your pace.
              </p>
            </div>
            <div className="relative border border-[#e2e3e1] rounded-[2.5rem] p-4 shadow-xl">
               <img className="w-full aspect-[4/5] object-cover rounded-[2rem]" alt="minimalist interior of a meditation room" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGglJmfMF-YzAHSVLgLXLSQ4K_WOkWArPgxR3nSnOuJfg8jky2N-F86nFsAEEo2p8AN5_Yyi1B6mdManXwaKL47KptA5olM7Xc4CMHp_mUnR2_tFwuJ9ON0l9K6gbTYc7UkmqE9sjBom3qQ13HUZPyddY9zsvXeHhPUt07tTNDazeXF04HHAAKxekzG8_Hbk07MZkvvPsrdlrRPPO4wKjU4uC2s3AQziMDN-RdGLWIW4_QA4YL2b2TvMdIxChqN9dnqBEBjzZ1_54" />
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-6 bg-[#f4f4f2] text-xs tracking-wide">
        <div className="flex flex-col flex-wrap md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-lg font-['Noto_Serif'] text-[#041b0b]">Mansik</span>
            <p className="text-[#041b0b]/40">© 2026 Mansik Wellness. Crafted for serenity.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

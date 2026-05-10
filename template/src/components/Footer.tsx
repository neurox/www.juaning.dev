import { Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-8 md:py-12 bg-[#0b0f15] border-t border-white/5 mt-16 md:mt-24">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-8 max-w-7xl mx-auto gap-6 md:gap-8">
        
        <div className="text-xl font-bold tracking-tight text-slate-300">
          JUANING<span className="text-cyan-500/70">.dev</span>
        </div>
        
        <div className="flex space-x-6">
          <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
             <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
             <span className="hidden sm:inline-block text-sm">GitHub</span>
          </a>
          <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
             <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
             <span className="hidden sm:inline-block text-sm">LinkedIn</span>
          </a>
          <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
             <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
             <span className="hidden sm:inline-block text-sm">Twitter</span>
          </a>
        </div>
        
        <div className="text-slate-600 text-sm flex items-center gap-2">
          © {new Date().getFullYear()} Juan Gómez.
          <span className="hidden sm:inline">All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

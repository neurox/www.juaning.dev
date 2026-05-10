import { Activity, Code, Cpu, Database, Layout, Server, Terminal } from "lucide-react";
import { motion } from "motion/react";

export function SystemOverview() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="lg:col-span-12 xl:col-span-7 glass-card rounded-xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden group"
    >
      {/* Background Icon Decoration */}
      <div className="absolute -top-10 -right-10 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none">
        <Cpu className="w-64 h-64 text-cyan-500" />
      </div>

      <header className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
        <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-3">
          <Server className="w-6 h-6 text-cyan-500" />
          System Overview
        </h2>
        <span className="font-mono text-xs md:text-sm text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded border border-cyan-500/20">
          STATUS: ONLINE
        </span>
      </header>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start mt-2 relative z-10">
        {/* Profile Image Node */}
        <div className="relative group/avatar cursor-pointer shrink-0">
          <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500"></div>
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-lg bg-slate-900 border border-white/10 overflow-hidden relative z-10 hud-glow transition-all duration-300">
            {/* Using a tech-appropriate placeholder image. SVG embedded fallback if needed, but linking image as requested. */}
            <img 
              src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=600&auto=format&fit=crop" 
              alt="Profile avatar" 
              className="w-full h-full object-cover grayscale opacity-70 group-hover/avatar:grayscale-0 group-hover/avatar:opacity-100 transition-all duration-500"
            />
          </div>
        </div>

        {/* Bio Info */}
        <div className="flex-grow">
          <h3 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Juan Gómez</h3>
          <p className="font-mono text-cyan-500 text-sm md:text-base mb-4 flex items-center gap-2">
            <Terminal className="w-4 h-4" /> &gt; Senior Backend & DevOps Engineer_
          </p>
          <p className="text-slate-400 leading-relaxed mb-6 max-w-2xl text-sm md:text-base">
            Architecting resilient, high-availability systems. Specializing in distributed computing, automated CI/CD pipelines, and infrastructure as code. Obsessed with reducing latency and optimizing deployment velocity.
          </p>
          
          {/* Tech Stack Tags */}
          <div className="flex flex-wrap gap-2.5">
            {[
              { name: "Kubernetes", color: "bg-blue-500" },
              { name: "AWS", color: "bg-orange-500" },
              { name: "Go", color: "bg-cyan-400" },
              { name: "Rust", color: "bg-red-400" },
              { name: "Docker", color: "bg-blue-400" }
            ].map((tech) => (
              <span 
                key={tech.name} 
                className="font-mono text-xs bg-slate-800/60 text-slate-300 px-2.5 py-1.5 rounded border border-white/5 flex items-center gap-2 hover:border-slate-500 transition-colors"
              >
                <span className={`w-2 h-2 rounded-full ${tech.color} shadow-[0_0_8px_rgba(255,255,255,0.3)]`}></span> {tech.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

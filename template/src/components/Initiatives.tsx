import { Layers, Network, Database } from "lucide-react";
import { motion } from "motion/react";

const PROJECTS = [
  {
    id: 1,
    title: "Distributed Cache Layer",
    description: "Implementing a highly available, partitioned Redis cluster across multiple availability zones to reduce database load and improve response times for read-heavy endpoints.",
    status: "DEPLOYING",
    phase: "ROLLOUT",
    progress: 85,
    icon: Layers,
    colorTheme: "purple" // Special requested accent color
  },
  {
    id: 2,
    title: "GitOps Pipeline Refactor",
    description: "Migrating legacy Jenkins CI/CD pipelines to ArgoCD for true GitOps declarative infrastructure management. Enforcing strict security policies via OPA Gatekeeper.",
    status: "STABLE",
    phase: "MAINTENANCE",
    progress: 100,
    icon: Network,
    colorTheme: "cyan"
  },
  {
    id: 3,
    title: "Event Sourcing Arch",
    description: "Evaluating Kafka vs. Redpanda for transitioning the core billing monolith into an event-driven, decoupled microservices architecture.",
    status: "PLANNING",
    phase: "DISCOVERY",
    progress: 15,
    icon: Database,
    colorTheme: "gray"
  }
];

export function Initiatives() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card rounded-xl p-6 md:p-8 flex flex-col gap-6"
    >
      <header className="flex items-center justify-between border-b border-white/10 pb-4">
        <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-3">
          <Network className="w-6 h-6 text-cyan-500" />
          Active Initiatives
        </h2>
        <div className="hidden md:flex gap-2">
          {/* Decorative navigation buttons for UI authenticity */}
          <button className="w-8 h-8 rounded bg-slate-800/50 border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-900 transition-colors text-slate-400">
            &larr;
          </button>
          <button className="w-8 h-8 rounded bg-slate-800/50 border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-slate-900 transition-colors text-slate-400">
            &rarr;
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECTS.map((project, i) => {
          const Icon = project.icon;
          
          // Theme configurations
          const isPurple = project.colorTheme === "purple";
          const isCyan = project.colorTheme === "cyan";
          
          const ringColor = isPurple ? "bg-[#8A2BE2]" : isCyan ? "bg-cyan-500" : "bg-slate-500";
          const textColor = isPurple ? "text-[#8A2BE2]" : isCyan ? "text-cyan-500" : "text-slate-500";
          const borderColor = isPurple ? "border-t-[#8A2BE2]" : "border-t-transparent";
          const cardShadow = isPurple ? "accent-purple" : isCyan ? "hover:border-cyan-500/50" : "hover:border-slate-500/50";
          
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + (i * 0.1) }}
              key={project.id}
              className={`bg-slate-800/20 border border-white/5 rounded-xl p-6 md:p-7 relative group hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col h-full border-t-[3px] ${borderColor} ${cardShadow}`}
            >
              {/* Status Badge */}
              <div className="absolute top-5 right-5 flex items-center gap-2">
                {isPurple ? (
                   <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8A2BE2] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8A2BE2]"></span>
                  </span>
                ) : (
                  <span className={`w-2.5 h-2.5 rounded-full ${ringColor}`}></span>
                )}
                <span className={`font-mono text-[10px] sm:text-xs tracking-wider ${textColor}`}>
                  {project.status}
                </span>
              </div>

              <Icon className={`w-10 h-10 mb-6 transition-opacity duration-300 ${isPurple ? "text-[#8A2BE2] opacity-90 group-hover:opacity-100" : isCyan ? "text-cyan-500 opacity-70 group-hover:opacity-100" : "text-slate-500 group-hover:text-cyan-400"}`} />
              
              <h3 className="text-xl font-semibold text-slate-100 mb-3">{project.title}</h3>
              <p className="text-sm text-slate-400 mb-8 line-clamp-3 leading-relaxed flex-grow">
                {project.description}
              </p>

              {/* Progress Section */}
              <div className="mt-auto">
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-3 border border-white/5">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${ringColor} ${!isPurple && !isCyan ? "group-hover:bg-cyan-500/50" : ""}`} 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between font-mono text-[11px] text-slate-500">
                  <span className="uppercase tracking-wider">PHASE: {project.phase}</span>
                  <span>{project.progress}%</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

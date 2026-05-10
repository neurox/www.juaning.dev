import { FileCode, Activity } from "lucide-react";
import { motion } from "motion/react";

const LOGS = [
  {
    id: 1,
    date: "2024.10.24",
    title: "Install Solr 8 on macOS",
    description: "A step-by-step guide to compiling and configuring Apache Solr 8 locally for development testing, avoiding common Homebrew pitfalls."
  },
  {
    id: 2,
    date: "2024.09.12",
    title: "Optimizing Docker Builds for Go",
    description: "Techniques for utilizing multi-stage builds and minimal scratch images to reduce container footprint by 80%."
  },
  {
    id: 3,
    date: "2024.08.05",
    title: "Zero-Downtime DB Migrations",
    description: "Implementing the expand-and-contract pattern for PostgreSQL schema changes in high-throughput environments."
  }
];

export function Logbook() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="lg:col-span-12 xl:col-span-5 glass-card rounded-xl p-6 md:p-8 flex flex-col gap-6 h-full"
    >
      <header className="flex items-center justify-between border-b border-white/10 pb-4">
        <h2 className="text-xl md:text-2xl font-semibold flex items-center gap-3">
          <Activity className="w-6 h-6 text-cyan-500" />
          Logbook
        </h2>
        <button className="font-mono text-sm text-cyan-500 hover:text-cyan-300 transition-colors flex items-center gap-1 group">
          VIEW_ALL <span className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">&rarr;</span>
        </button>
      </header>

      <div className="flex flex-col gap-4 overflow-y-auto flex-grow scrollbar-hide py-1">
        {LOGS.map((log, i) => (
          <motion.article 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + (i * 0.1) }}
            key={log.id} 
            className="p-4 md:p-5 bg-slate-800/40 border border-white/5 rounded-lg hover:border-cyan-500/40 hover:bg-slate-800/80 transition-all duration-300 group cursor-pointer"
          >
            <div className="font-mono text-xs text-slate-500 mb-2 flex justify-between items-center">
              <span>SYS.LOG // {log.date}</span>
              <span className="text-cyan-500 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 font-bold tracking-wider">&lt;read&gt;</span>
            </div>
            <h4 className="text-lg font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors mb-2 leading-tight flex items-start gap-2">
              <FileCode className="w-5 h-5 opacity-40 shrink-0 mt-0.5" />
              {log.title}
            </h4>
            <p className="text-sm text-slate-400 line-clamp-2 md:line-clamp-3 ml-7">
              {log.description}
            </p>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

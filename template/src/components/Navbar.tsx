import { motion } from "motion/react";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0b0f15]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto">
        
        {/* Brand */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl md:text-2xl font-bold tracking-tight text-slate-100"
        >
          JUANING<span className="text-cyan-500">.dev</span>
        </motion.div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 -ml-12">
          {["Home", "About", "Portfolio"].map((link, i) => (
            <motion.a 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={link} 
              href="#"
              className={`text-sm font-medium transition-colors duration-200 ${
                link === "Home" 
                  ? "text-cyan-500 border-b-2 border-cyan-500 pb-1" 
                  : "text-slate-400 hover:text-cyan-400"
              }`}
            >
              {link}
            </motion.a>
          ))}
        </div>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 md:gap-6"
        >
          <button className="font-mono text-sm text-slate-400 hover:text-cyan-400 transition-colors uppercase hidden sm:block">
            ES | <span className="text-slate-200">EN</span>
          </button>
          
          <button className="bg-cyan-500 text-slate-950 px-5 py-2.5 rounded text-sm font-semibold hover:bg-cyan-400 transition-all hover:shadow-[0_0_15px_rgba(14,165,233,0.4)] active:scale-95 flex items-center justify-center">
            Contact
          </button>
        </motion.div>
      </div>
    </nav>
  );
}

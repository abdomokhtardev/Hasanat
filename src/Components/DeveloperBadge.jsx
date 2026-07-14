import { motion } from "framer-motion";

const DeveloperBadge = () => {
  return (
    <motion.a 
      href="http://abdomokhtardev.pages.dev"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-subtle)] px-4 py-2 rounded-full shadow-[var(--shadow-float)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
    >
      <div className="relative flex items-center justify-center w-3 h-3">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75 animate-ping"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
      </div>
      <div className="flex flex-col ml-1">
        <span className="text-[10px] text-[var(--text-muted)] font-bold font-tajawal leading-none mb-1">طُور بواسطة</span>
        <span className="text-sm font-bold text-[var(--text-main)] font-tajawal leading-none group-hover:text-[var(--accent)] transition-colors">abdomokhtardev</span>
      </div>
    </motion.a>
  );
};

export default DeveloperBadge;

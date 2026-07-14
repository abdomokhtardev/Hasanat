import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CHALLENGES = [
  "اقرأ صفحة من القرآن الكريم الآن.",
  "تصدق اليوم ولو بجنيه واحد.",
  "اتصل بوالدتك أو والدك واطمئن عليهما.",
  "استغفر الله 100 مرة.",
  "صلِّ ركعتي الضحى.",
  "ادعُ لشخص تحبه بظهر الغيب.",
  "تبسم في وجه من تقابله اليوم.",
  "صلِّ على النبي 100 مرة.",
  "اقرأ سورة الملك قبل النوم.",
  "ساعد شخصاً محتاجاً اليوم."
];

const DailyChallenge = () => {
  const [challenge, setChallenge] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Check local storage for today's challenge
    const today = new Date().toLocaleDateString();
    const savedDate = localStorage.getItem("hasanat_challenge_date");
    const savedChallenge = localStorage.getItem("hasanat_challenge_text");
    const savedStatus = localStorage.getItem("hasanat_challenge_status");

    if (savedDate === today && savedChallenge) {
      setChallenge(savedChallenge);
      setIsCompleted(savedStatus === "true");
    } else {
      // Pick a new random challenge
      const randomChallenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
      setChallenge(randomChallenge);
      setIsCompleted(false);
      localStorage.setItem("hasanat_challenge_date", today);
      localStorage.setItem("hasanat_challenge_text", randomChallenge);
      localStorage.setItem("hasanat_challenge_status", "false");
    }
  }, []);

  const handleComplete = () => {
    setIsCompleted(true);
    localStorage.setItem("hasanat_challenge_status", "true");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-md relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--accent)]/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)]">
          <i className="fa-solid fa-bullseye text-lg"></i>
        </div>
        <div>
          <h3 className="text-xl font-bold font-tajawal text-[var(--text-main)]">تحدي اليوم</h3>
          <p className="text-xs text-[var(--text-muted)] font-tajawal">تحدٍ بسيط يرفع درجاتك</p>
        </div>
      </div>

      <p className="text-[var(--text-main)] font-tajawal font-medium text-lg mb-6 pr-2 border-r-2 border-[var(--accent)]/50">
        "{challenge}"
      </p>

      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.button
            key="btn-incomplete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
            className="w-full py-3 bg-[var(--bg-main)] border border-[var(--accent)]/30 hover:bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl font-bold font-tajawal flex items-center justify-center gap-2 transition-colors"
          >
            <span>أتممت التحدي</span>
            <i className="fa-regular fa-circle-check"></i>
          </motion.button>
        ) : (
          <motion.div
            key="btn-complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full py-3 bg-green-500/20 border border-green-500/30 text-green-600 rounded-xl font-bold font-tajawal flex items-center justify-center gap-2"
          >
            <span>تقبل الله منك!</span>
            <i className="fa-solid fa-check text-lg"></i>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DailyChallenge;

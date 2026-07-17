/* eslint-disable react-hooks/exhaustive-deps */
import SwitchAzkar from "../Components/SwitchAzkar";
import { useData } from "../hooks/UseData.js";
import { useEffect, useState } from "react";
import CountZkr from "../Components/CountZkr.jsx";
import { motion } from "framer-motion";

const init = localStorage.getItem("choiceZkr") ? localStorage.getItem("choiceZkr") : "sabah";
const initValCount = localStorage.getItem("countZkr") ? JSON.parse(localStorage.getItem("countZkr")) : [];

const Azkar = () => {
  const { azkar, loading, Spinner } = useData();
  const [choice, setChoice] = useState(init);
  const [counter, setCounter] = useState(initValCount);

  useEffect(() => {
    localStorage.setItem("choiceZkr", choice);
  }, [choice]);

  function resetZkrCount() {
    if (!azkar || !azkar[0] || !azkar[1]) return;
    const len1 = azkar[0]?.content?.length || 0;
    const len2 = azkar[1]?.content?.length || 0;
    const maxLen = Math.max(len1, len2);

    const countArr = Array.from({ length: maxLen }, () => ({
      countMorning: 0,
      countEvening: 0,
    }));
    setCounter(countArr);
  }

  useEffect(() => {
    let intervalId;

    const fetchFajrAndCheckReset = async () => {
      let fajrHour = 4;
      let fajrMinute = 0;

      try {
        const res = await fetch(`https://api.aladhan.com/v1/timingsByAddress?address=القاهرة&method=5`);
        const data = await res.json();
        [fajrHour, fajrMinute] = data.data.timings.Fajr.split(":").map(Number);
      } catch (err) {
        console.error("Failed to fetch Fajr time, using fallback", err);
      }

      const checkReset = () => {
        const lastReset = localStorage.getItem("hasanat_azkar_last_reset");
        const now = new Date();
        const fajrDate = new Date();
        fajrDate.setHours(fajrHour, fajrMinute, 0, 0);
        
        const activeDate = new Date(now);
        if (now < fajrDate) {
          activeDate.setDate(activeDate.getDate() - 1);
        }
        
        const activeCycle = `${activeDate.getFullYear()}-${activeDate.getMonth() + 1}-${activeDate.getDate()}`;
        
        if (lastReset !== activeCycle) {
          resetZkrCount();
          localStorage.setItem("hasanat_azkar_last_reset", activeCycle);
        } else if (initValCount.length === 0 && azkar && azkar.length >= 2) {
          resetZkrCount();
        }
      };

      if (azkar && azkar.length >= 2) {
        checkReset();
        // Check every minute if Fajr time has come
        intervalId = setInterval(checkReset, 60000);
      }
    };

    if (azkar && azkar.length >= 2) {
      fetchFajrAndCheckReset();
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [azkar, initValCount.length]);

  useEffect(() => {
    localStorage.setItem("countZkr", JSON.stringify(counter));
  }, [counter]);

  if (loading || !azkar || azkar.length === 0) {
    return (
      <div className="pt-32 min-h-screen flex justify-center items-center bg-[var(--bg-main)]">
        {loading ? Spinner() : <p className="text-[var(--text-muted)] font-tajawal">جاري تحميل الأذكار...</p>}
      </div>
    );
  }

  const currentAzkarList = azkar[choice === "sabah" ? 0 : 1]?.content || [];

  // Calculate Progress
  const totalCountRequired = currentAzkarList.reduce((acc, zkr) => {
    return acc + (parseInt(String(zkr.repeat).replace(/\D/g, '')) || 1);
  }, 0);

  const currentTotalCount = currentAzkarList.reduce((acc, _, index) => {
    const val = choice === "masaa" ? (counter[index]?.countEvening || 0) : (counter[index]?.countMorning || 0);
    const req = parseInt(String(currentAzkarList[index]?.repeat || "1").replace(/\D/g, '')) || 1;
    return acc + Math.min(val, req);
  }, 0);

  const progressPercent = totalCountRequired === 0 ? 0 : Math.round((currentTotalCount / totalCountRequired) * 100);

  return (
    <main className="min-h-screen pt-32 pb-24 bg-[var(--bg-main)] relative">
      <div className="w-full max-w-4xl mx-auto px-4 flex flex-col">

        {/* Rich Header */}
        <div className="w-full mb-12 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[var(--accent)] text-[var(--gold-main)] rounded-full flex items-center justify-center text-2xl mb-6 shadow-md border-2 border-[var(--gold-main)]/30">
            <i className="fa-solid fa-hands-praying"></i>
          </div>
          <h1 className="text-4xl md:text-5xl text-[var(--text-main)] font-bold font-amiri mb-4">
            الأذكار اليومية
          </h1>
          <p className="text-[var(--text-muted)] text-lg font-tajawal font-medium mb-10">
            ألا بذكر الله تطمئن القلوب
          </p>

          <SwitchAzkar setChoice={setChoice} choice={choice} />

          {/* Progress */}
          <div className="w-full max-w-lg mt-10 flex flex-col gap-3">
            <div className="flex justify-between text-sm text-[var(--text-muted)] font-tajawal font-bold">
              <span>نسبة الإنجاز ({progressPercent}%)</span>
              <span>{currentTotalCount} من {totalCountRequired}</span>
            </div>
            <div className="w-full h-2 bg-[var(--border-subtle)] rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-[var(--gold-main)]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Elegant Reading List - Smaller Text */}
        <div className="w-full flex flex-col gap-6">
          {currentAzkarList.map((zkr, index) => {
            const req = parseInt(String(zkr.repeat).replace(/\D/g, '')) || 1;
            const val = choice === "masaa" ? (counter[index]?.countEvening || 0) : (counter[index]?.countMorning || 0);
            const isCompleted = val >= req;

            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={`${choice}-${index}`}
                className={`w-full p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center card-glass transition-all duration-300 ${isCompleted ? "opacity-60 bg-[var(--accent-light)] border-[var(--accent)]/30" : "bg-[var(--bg-card)] border-[var(--border-subtle)]"
                  }`}
              >
                <div className="flex-1 text-center md:text-right">
                  <p className={`font-amiri text-lg md:text-xl leading-[2.2] md:leading-[2.2] ${isCompleted ? 'text-[var(--accent)]' : 'text-[var(--text-main)]'}`}>
                    {zkr.zekr}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col items-center justify-center pt-6 md:pt-0 border-t md:border-t-0 md:border-r border-[var(--border-subtle)] md:pr-8">
                  <CountZkr
                    choice={choice}
                    setCounter={setCounter}
                    index={index}
                    isCompleted={isCompleted}
                    currentCount={val}
                    req={req}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Azkar;

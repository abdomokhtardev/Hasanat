import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const CATEGORIES = [
  { id: "Fajr", name: "صلاة الفجر" },
  { id: "Dhuhr", name: "صلاة الظهر" },
  { id: "Asr", name: "صلاة العصر" },
  { id: "Maghrib", name: "صلاة المغرب" },
  { id: "Isha", name: "صلاة العشاء" },
];

const TIMINGS = [
  { id: "before", name: "قبل الصلاة" },
  { id: "after", name: "بعد الصلاة" },
];

const ICONS = [
  "fa-book-open", "fa-book-quran", "fa-heart", "fa-droplet", 
  "fa-person-walking", "fa-dumbbell", "fa-seedling", "fa-pen-to-square",
  "fa-hand-holding-heart", "fa-star", "fa-moon", "fa-sun"
];

const Habits = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState(() => {
    return JSON.parse(localStorage.getItem("hasanat_habits")) || [];
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [newHabit, setNewHabit] = useState({ 
    title: "", 
    category: "Fajr", 
    timing: "before", 
    offsetMinutes: 30,
    targetMinutes: 15,
    icon: "fa-book-quran"
  });
  const [manualInputs, setManualInputs] = useState({});
  const [prayerTimings, setPrayerTimings] = useState(null);

  useEffect(() => {
    async function fetchTimingsAndCheckReset() {
      try {
        const res = await fetch(`https://api.aladhan.com/v1/timingsByAddress?address=القاهره&method=5`);
        const data = await res.json();
        const timings = data.data.timings;
        setPrayerTimings(timings);
        
        let savedHabits = JSON.parse(localStorage.getItem("hasanat_habits")) || [];
        
        // If user is logged in, fetch from Firebase to merge/override
        if (user) {
          try {
            const docSnap = await getDoc(doc(db, "users", user.uid));
            if (docSnap.exists() && docSnap.data().habits) {
              savedHabits = docSnap.data().habits;
            }
          } catch (err) {
            console.error("Failed to fetch habits from Firebase", err);
          }
        }

        // --- Fajr Reset Logic ---
        const lastReset = localStorage.getItem("hasanat_habits_last_reset");
        
        // Parse Fajr time for today
        const [fajrHour, fajrMinute] = timings.Fajr.split(":").map(Number);
        const now = new Date();
        const fajrDate = new Date();
        fajrDate.setHours(fajrHour, fajrMinute, 0, 0);

        // Determine active cycle based on current time
        const activeDate = new Date(now);
        if (now < fajrDate) {
          activeDate.setDate(activeDate.getDate() - 1);
        }
        const activeCycle = `${activeDate.toLocaleDateString()}-after-fajr`;

        if (lastReset !== activeCycle) {
          const resetHabits = savedHabits.map(h => ({ ...h, completedMinutes: 0 }));
          setHabits(resetHabits);
          localStorage.setItem("hasanat_habits", JSON.stringify(resetHabits));
          localStorage.setItem("hasanat_habits_last_reset", activeCycle);
          if (user) {
            setDoc(doc(db, "users", user.uid), { habits: resetHabits }, { merge: true });
          }
        } else {
          setHabits(savedHabits);
        }
      } catch (err) {
        console.error("Failed to fetch timings", err);
        setHabits(JSON.parse(localStorage.getItem("hasanat_habits")) || []);
      }
    }
    
    fetchTimingsAndCheckReset();
  }, [user]);

  useEffect(() => {
    localStorage.setItem("hasanat_habits", JSON.stringify(habits));
    if (user && habits.length > 0) {
      setDoc(doc(db, "users", user.uid), { habits }, { merge: true }).catch(console.error);
    }
  }, [habits, user]);

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabit.title.trim() || newHabit.targetMinutes <= 0) return;
    
    if (editingHabitId) {
      setHabits(prev => prev.map(h => 
        h.id === editingHabitId ? { ...h, ...newHabit } : h
      ));
      setEditingHabitId(null);
    } else {
      const habit = {
        id: Date.now().toString(),
        ...newHabit,
        completedMinutes: 0,
      };
      setHabits(prev => [...prev, habit]);
    }
    
    setShowAddForm(false);
    setNewHabit({ title: "", category: "Fajr", timing: "before", offsetMinutes: 30, targetMinutes: 15, icon: "fa-book-quran" });
  };

  const handleEditClick = (habit) => {
    setNewHabit({
      title: habit.title,
      category: habit.category,
      timing: habit.timing,
      offsetMinutes: habit.offsetMinutes,
      targetMinutes: habit.targetMinutes,
      icon: habit.icon || "fa-book-quran"
    });
    setEditingHabitId(habit.id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addManualTime = (id) => {
    const timeToAdd = parseInt(manualInputs[id]) || 0;
    if (timeToAdd <= 0) return;

    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const newCompleted = Math.min(habit.completedMinutes + timeToAdd, habit.targetMinutes);
        return { ...habit, completedMinutes: newCompleted };
      }
      return habit;
    }));
    setManualInputs(prev => ({...prev, [id]: ""}));
  };

  const markComplete = (id) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        return { ...habit, completedMinutes: habit.targetMinutes };
      }
      return habit;
    }));
  };

  const deleteHabit = (id) => {
    const updated = habits.filter(h => h.id !== id);
    setHabits(updated);
  };

  const groupedHabits = CATEGORIES.map(cat => ({
    ...cat,
    items: habits.filter(h => h.category === cat.id)
  })).filter(cat => cat.items.length > 0);

  // Habit Collision Check
  const getInterval = (h) => {
    if (h.timing === "before") {
      return { start: -h.offsetMinutes, end: -h.offsetMinutes + h.targetMinutes };
    } else {
      return { start: h.offsetMinutes, end: h.offsetMinutes + h.targetMinutes };
    }
  };

  let collisionHabit = null;
  const newHabitInterval = getInterval(newHabit);
  
  for (let h of habits) {
    if (h.id === editingHabitId) continue;
    if (h.category === newHabit.category) {
      const hInt = getInterval(h);
      const maxStart = Math.max(newHabitInterval.start, hInt.start);
      const minEnd = Math.min(newHabitInterval.end, hInt.end);
      // Strictly less than for overlap. If maxStart == minEnd they are just adjacent.
      if (maxStart < minEnd) {
        collisionHabit = h;
        break;
      }
    }
  }

  // Time suitability logic
  let timeStatusType = "good";
  let timeStatusText = "وقت ممتاز وفي متسع لإنجاز العادة براحة.";
  let autoFixAction = null;
  let autoFixText = "";

  if (collisionHabit) {
    timeStatusType = "collision";
    timeStatusText = `تعارض أوقات! هذا الوقت يتقاطع مع العادة المسجلة: "${collisionHabit.title}". يرجى تعديل وقت التنفيذ.`;
  } else if (newHabit.timing === "before") {
    if (newHabit.offsetMinutes < newHabit.targetMinutes) {
      timeStatusType = "overlap";
      timeStatusText = "تنبيه خطير: مدة العادة أطول من الوقت المتاح قبل الصلاة، ستتداخل مع وقت الصلاة وتضيعها!";
      autoFixAction = () => setNewHabit({...newHabit, offsetMinutes: newHabit.targetMinutes + 10});
      autoFixText = "تعديل للبدء مبكراً";
    } else if (newHabit.offsetMinutes - newHabit.targetMinutes < 10) {
      timeStatusType = "tight";
      timeStatusText = "تنبيه: الوقت ضيق جداً، ستنتهي من العادة قبل الإقامة بوقت غير كافٍ.";
      autoFixAction = () => setNewHabit({...newHabit, offsetMinutes: newHabit.targetMinutes + 15});
      autoFixText = "زيادة وقت السماحية";
    }
  }

  let timeStatusColor = "text-green-600 bg-green-500/10 border-green-500/30 dark:text-green-400";
  let timeStatusIcon = "fa-circle-check";
  if (timeStatusType === "collision" || timeStatusType === "overlap") {
    timeStatusColor = "text-red-600 bg-red-500/10 border-red-500/40 dark:text-red-400";
    timeStatusIcon = timeStatusType === "collision" ? "fa-ban" : "fa-triangle-exclamation";
  } else if (timeStatusType === "tight") {
    timeStatusColor = "text-orange-600 bg-orange-500/10 border-orange-500/40 dark:text-orange-400";
    timeStatusIcon = "fa-clock";
  }

  // Format 24h to 12h
  const formatTime = (time24) => {
    if (!time24) return "";
    let [h, m] = time24.split(":");
    h = parseInt(h);
    const period = h >= 12 ? "م" : "ص";
    h = h % 12 || 12;
    return `${h}:${m} ${period}`;
  };

  return (
    <main className="min-h-screen pt-32 pb-24 bg-[var(--bg-main)] px-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="card-glass p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-center sm:text-right">
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] text-2xl shadow-sm">
              <i className="fa-solid fa-layer-group"></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold font-amiri text-[var(--text-main)] mb-2">عادات الصلوات</h1>
              <p className="text-[var(--text-muted)] font-tajawal">اربط عاداتك اليومية بأوقات الصلاة لتضمن استمراريتها</p>
            </div>
          </div>
          <button 
            onClick={() => {
              if (showAddForm) {
                setShowAddForm(false);
                setEditingHabitId(null);
                setNewHabit({ title: "", category: "Fajr", timing: "before", offsetMinutes: 30, targetMinutes: 15, icon: "fa-book-quran" });
              } else {
                setShowAddForm(true);
              }
            }}
            className="px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-bold font-tajawal hover:bg-[var(--accent-hover)] transition-colors shadow-sm whitespace-nowrap"
          >
            {showAddForm ? "إلغاء" : "إضافة عادة جديدة"}
          </button>
        </div>

        {/* Add Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleAddHabit} className="card-glass p-6 sm:p-8 flex flex-col gap-6">
                
                {/* Icon Selection */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold font-tajawal text-[var(--text-main)]">اختر أيقونة معبرة</label>
                  <div className="flex flex-wrap gap-3">
                    {ICONS.map(icon => (
                      <button 
                        key={icon}
                        type="button"
                        onClick={() => setNewHabit({...newHabit, icon})}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${newHabit.icon === icon ? 'bg-[var(--accent)] text-white shadow-md scale-110' : 'bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--accent)] border border-[var(--border-subtle)]'}`}
                      >
                        <i className={`fa-solid ${icon}`}></i>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-bold font-tajawal text-[var(--text-main)]">اسم العادة</label>
                    <input 
                      type="text" 
                      placeholder="مثال: قراءة ورد قرآني، أذكار، شرب ماء، مشي..."
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] focus:border-[var(--accent)] outline-none text-[var(--text-main)] font-tajawal transition-colors"
                      value={newHabit.title}
                      onChange={(e) => setNewHabit({...newHabit, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold font-tajawal text-[var(--text-main)]">ارتباط العادة بالصلاة</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] focus:border-[var(--accent)] outline-none text-[var(--text-main)] font-tajawal transition-colors cursor-pointer"
                      value={newHabit.category}
                      onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name} {prayerTimings && `(${formatTime(prayerTimings[cat.id])})`}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold font-tajawal text-[var(--text-main)]">توقيت العادة بالنسبة للصلاة</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] focus:border-[var(--accent)] outline-none text-[var(--text-main)] font-tajawal transition-colors cursor-pointer"
                      value={newHabit.timing}
                      onChange={(e) => setNewHabit({...newHabit, timing: e.target.value})}
                    >
                      {TIMINGS.map(time => (
                        <option key={time.id} value={time.id}>{time.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold font-tajawal text-[var(--text-main)]">وقت التنفيذ (قبل/بعد بـ كم دقيقة؟)</label>
                    <input 
                      type="number" 
                      min="1"
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] focus:border-[var(--accent)] outline-none text-[var(--text-main)] font-tajawal transition-colors"
                      value={newHabit.offsetMinutes}
                      onChange={(e) => setNewHabit({...newHabit, offsetMinutes: parseInt(e.target.value) || 0})}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold font-tajawal text-[var(--text-main)]">مدة العادة نفسها المستهدفة (بالدقائق)</label>
                    <input 
                      type="number" 
                      min="1"
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] focus:border-[var(--accent)] outline-none text-[var(--text-main)] font-tajawal transition-colors"
                      value={newHabit.targetMinutes}
                      onChange={(e) => setNewHabit({...newHabit, targetMinutes: parseInt(e.target.value) || 0})}
                      required
                    />
                  </div>
                </div>

                {/* Status Indicator */}
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-tajawal text-sm font-bold transition-colors ${timeStatusColor}`}>
                  <div className="flex items-center gap-3">
                    <i className={`fa-solid ${timeStatusIcon} text-lg`}></i>
                    <p className="leading-relaxed">{timeStatusText}</p>
                  </div>
                  {autoFixAction && (
                    <button 
                      type="button"
                      onClick={autoFixAction}
                      className="px-4 py-2 rounded-lg bg-[var(--bg-card)] border border-current hover:bg-black/5 dark:hover:bg-white/5 transition-colors whitespace-nowrap shrink-0"
                    >
                      <i className="fa-solid fa-wand-magic-sparkles ml-2"></i>
                      {autoFixText}
                    </button>
                  )}
                </div>

                <div className="flex justify-end pt-4 border-t border-[var(--border-subtle)]">
                  <button 
                    type="submit" 
                    disabled={timeStatusType === "collision"}
                    className={`px-8 py-3 rounded-xl text-white font-bold font-tajawal transition-colors shadow-sm ${timeStatusType === "collision" ? "bg-gray-400 cursor-not-allowed opacity-70" : "bg-[var(--accent)] hover:bg-[var(--accent-hover)]"}`}
                  >
                    {editingHabitId ? "حفظ التعديل" : "حفظ العادة"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Habits List */}
        {habits.length === 0 && !showAddForm ? (
          <div className="card-glass p-12 flex flex-col items-center justify-center text-center">
            <i className="fa-solid fa-clipboard-list text-6xl text-[var(--border-subtle)] mb-4"></i>
            <h3 className="text-2xl font-bold font-amiri text-[var(--text-main)] mb-2">لا توجد عادات مسجلة</h3>
            <p className="text-[var(--text-muted)] font-tajawal">ابدأ بإضافة أول عادة يومية لك لتحافظ على استمراريتك.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {groupedHabits.map(group => (
              <div key={group.id} className="flex flex-col gap-4">
                <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-2">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] text-sm">
                    <i className="fa-solid fa-mosque"></i>
                  </div>
                  <h2 className="text-xl font-bold font-tajawal text-[var(--text-main)]">{group.name} {prayerTimings && `- ${formatTime(prayerTimings[group.id])}`}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {group.items.map(habit => {
                      const isCompleted = habit.completedMinutes >= habit.targetMinutes;
                      const progressPercentage = Math.round((habit.completedMinutes / habit.targetMinutes) * 100);
                      const timingName = TIMINGS.find(t => t.id === habit.timing)?.name;
                      
                      return (
                        <motion.div
                          key={habit.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`card-glass p-5 flex flex-col gap-4 transition-colors ${isCompleted ? 'border-[var(--accent)] bg-[var(--accent-light)]/10' : ''}`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${isCompleted ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-main)] text-[var(--accent)] border border-[var(--border-subtle)]'}`}>
                                <i className={`fa-solid ${habit.icon || 'fa-star'}`}></i>
                              </div>
                              <div>
                                <h3 className={`text-lg font-bold font-tajawal mb-1 ${isCompleted ? 'text-[var(--accent)]' : 'text-[var(--text-main)]'}`}>
                                  {habit.title}
                                </h3>
                                <span className="text-xs font-bold text-[var(--text-muted)] bg-[var(--bg-main)] px-2 py-1 rounded-md border border-[var(--border-subtle)]">
                                  {timingName} بـ {habit.offsetMinutes} دقيقة
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => handleEditClick(habit)} className="text-[var(--text-muted)] hover:text-blue-500 transition-colors px-2">
                                <i className="fa-solid fa-pen"></i>
                              </button>
                              <button onClick={() => deleteHabit(habit.id)} className="text-[var(--text-muted)] hover:text-red-500 transition-colors px-2">
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="flex flex-col gap-1.5 mt-2">
                            <div className="flex justify-between text-xs font-tajawal font-bold text-[var(--text-muted)]">
                              <span>{progressPercentage}%</span>
                              <span>{habit.completedMinutes} / {habit.targetMinutes} دقيقة</span>
                            </div>
                            <div className="w-full h-2.5 bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-full overflow-hidden">
                              <motion.div 
                                className={`h-full ${isCompleted ? 'bg-[var(--accent)]' : 'bg-[var(--accent)]'}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercentage}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          </div>
                          
                          {/* Actions */}
                          {!isCompleted ? (
                            <div className="flex flex-col gap-3 mt-auto pt-4 border-t border-[var(--border-subtle)]">
                              <div className="flex gap-2">
                                <input 
                                  type="number"
                                  min="1"
                                  placeholder="دقائق..."
                                  className="w-20 px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] focus:border-[var(--accent)] outline-none text-[var(--text-main)] text-sm font-tajawal"
                                  value={manualInputs[habit.id] || ""}
                                  onChange={(e) => setManualInputs({...manualInputs, [habit.id]: e.target.value})}
                                />
                                <button 
                                  onClick={() => addManualTime(habit.id)} 
                                  className="flex-1 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] hover:border-[var(--accent)] text-[var(--text-main)] text-sm font-bold font-tajawal transition-colors"
                                >
                                  إضافة إنجاز
                                </button>
                              </div>
                              <button 
                                onClick={() => markComplete(habit.id)} 
                                className="w-full py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-bold font-tajawal hover:bg-[var(--accent-hover)] transition-colors flex items-center justify-center gap-2"
                              >
                                <i className="fa-solid fa-check"></i> إكمال العادة كلياً
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2 mt-auto pt-4 text-[var(--accent)] font-bold font-tajawal text-sm">
                              <i className="fa-solid fa-circle-check text-xl"></i>
                              تم إنجاز العادة بنجاح
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Habits;

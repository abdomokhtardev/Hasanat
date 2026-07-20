import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import EmptyState from "../Components/EmptyState.jsx";
import HabitForm from "../Components/Habits/HabitForm.jsx";
import HabitList from "../Components/Habits/HabitList.jsx";

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
    let intervalId;

    async function fetchTimingsAndCheckReset() {
      let fajrHour = 4;
      let fajrMinute = 0;

      try {
        const res = await fetch(`https://api.aladhan.com/v1/timingsByAddress?address=القاهرة&method=5`);
        const data = await res.json();
        const timings = data.data.timings;
        setPrayerTimings(timings);
        
        [fajrHour, fajrMinute] = timings.Fajr.split(":").map(Number);
      } catch (err) {
        console.error("Failed to fetch timings, using fallback Fajr time", err);
      }

      let savedHabits = JSON.parse(localStorage.getItem("hasanat_habits")) || [];
      
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
      const checkReset = () => {
        const lastReset = localStorage.getItem("hasanat_habits_last_reset");
        const currentHabits = JSON.parse(localStorage.getItem("hasanat_habits")) || savedHabits;
        
        const now = new Date();
        const fajrDate = new Date();
        fajrDate.setHours(fajrHour, fajrMinute, 0, 0);

        const activeDate = new Date(now);
        if (now < fajrDate) {
          activeDate.setDate(activeDate.getDate() - 1);
        }
        // Use YYYY-MM-DD to avoid locale issues
        const activeCycle = `${activeDate.getFullYear()}-${activeDate.getMonth() + 1}-${activeDate.getDate()}-after-fajr`;

        if (lastReset !== activeCycle) {
          // Clear all habits completely
          const resetHabits = [];
          setHabits(resetHabits);
          localStorage.setItem("hasanat_habits", JSON.stringify(resetHabits));
          localStorage.setItem("hasanat_habits_last_reset", activeCycle);
          if (user) {
            setDoc(doc(db, "users", user.uid), { habits: resetHabits }, { merge: true }).catch(console.error);
          }
        } else if (!intervalId) { // Only set state initially if no reset needed
          setHabits(currentHabits);
        }
      };

      checkReset();
      // Check every minute if Fajr time has passed
      intervalId = setInterval(checkReset, 60000);
    }
    
    fetchTimingsAndCheckReset();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
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
  
  if (newHabit.title.trim()) {
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
        
        {/* Notice Message */}
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-500 p-4 rounded-xl flex items-start gap-3 font-tajawal shadow-sm">
          <i className="fa-solid fa-circle-info text-xl mt-0.5"></i>
          <div>
            <h4 className="font-bold text-lg mb-1">تنبيه هام حول العادات</h4>
            <p className="text-sm font-medium leading-relaxed">
              لتحفيزك على التجديد اليومي، يتم <strong>مسح جميع العادات بشكل كامل</strong> تلقائياً مع دخول وقت صلاة الفجر كل يوم لتبدأ صفحة جديدة مع الله.
            </p>
          </div>
        </div>

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
            <HabitForm 
              handleAddHabit={handleAddHabit}
              newHabit={newHabit}
              setNewHabit={setNewHabit}
              editingHabitId={editingHabitId}
              ICONS={ICONS}
              CATEGORIES={CATEGORIES}
              TIMINGS={TIMINGS}
              prayerTimings={prayerTimings}
              formatTime={formatTime}
              timeStatusColor={timeStatusColor}
              timeStatusIcon={timeStatusIcon}
              timeStatusText={timeStatusText}
              timeStatusType={timeStatusType}
              autoFixAction={autoFixAction}
              autoFixText={autoFixText}
            />
          )}
        </AnimatePresence>

        {/* Habits List */}
        {habits.length === 0 && !showAddForm ? (
          <div className="w-full">
            <EmptyState 
              icon="fa-clipboard-list"
              title="لا توجد عادات مسجلة"
              description="ابدأ بإضافة أول عادة يومية لك لتحافظ على استمراريتك."
              buttonText="إضافة عادة جديدة"
              onButtonClick={() => setShowAddForm(true)}
            />
          </div>
        ) : (
          <HabitList 
            groupedHabits={groupedHabits}
            TIMINGS={TIMINGS}
            prayerTimings={prayerTimings}
            formatTime={formatTime}
            handleEditClick={handleEditClick}
            deleteHabit={deleteHabit}
            addManualTime={addManualTime}
            markComplete={markComplete}
            manualInputs={manualInputs}
            setManualInputs={setManualInputs}
          />
        )}
      </div>
    </main>
  );
};

export default Habits;

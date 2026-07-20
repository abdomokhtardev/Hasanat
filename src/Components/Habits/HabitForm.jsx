import { motion } from "framer-motion";

const HabitForm = ({
  handleAddHabit,
  newHabit,
  setNewHabit,
  editingHabitId,
  ICONS,
  CATEGORIES,
  TIMINGS,
  prayerTimings,
  formatTime,
  timeStatusColor,
  timeStatusIcon,
  timeStatusText,
  timeStatusType,
  autoFixAction,
  autoFixText
}) => {
  return (
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
                aria-label={`اختيار أيقونة ${icon}`}
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
              onInvalid={(e) => e.target.setCustomValidity('يرجى كتابة اسم العادة')}
              onInput={(e) => e.target.setCustomValidity('')}
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
              onInvalid={(e) => e.target.setCustomValidity('يرجى كتابة الدقائق بشكل صحيح')}
              onInput={(e) => e.target.setCustomValidity('')}
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
              onInvalid={(e) => e.target.setCustomValidity('يرجى كتابة الدقائق بشكل صحيح')}
              onInput={(e) => e.target.setCustomValidity('')}
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
  );
};

export default HabitForm;

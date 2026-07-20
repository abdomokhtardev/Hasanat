import { motion, AnimatePresence } from "framer-motion";

const HabitList = ({
  groupedHabits,
  TIMINGS,
  prayerTimings,
  formatTime,
  handleEditClick,
  deleteHabit,
  addManualTime,
  markComplete,
  manualInputs,
  setManualInputs
}) => {
  return (
    <div className="flex flex-col gap-8">
      {groupedHabits.map(group => (
        <div key={group.id} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-2">
            <div className="w-8 h-8 rounded-full bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] text-sm">
              <i className="fa-solid fa-mosque"></i>
            </div>
            <h2 className="text-xl font-bold font-tajawal text-[var(--text-main)]">
              {group.name} {prayerTimings && `- ${formatTime(prayerTimings[group.id])}`}
            </h2>
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
                        <button onClick={() => handleEditClick(habit)} className="text-[var(--text-muted)] hover:text-blue-500 transition-colors px-2" aria-label="تعديل العادة">
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button onClick={() => deleteHabit(habit.id)} className="text-[var(--text-muted)] hover:text-red-500 transition-colors px-2" aria-label="حذف العادة">
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
                            onChange={(e) => setManualInputs({ ...manualInputs, [habit.id]: e.target.value })}
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
  );
};

export default HabitList;

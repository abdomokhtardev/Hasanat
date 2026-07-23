import { motion, AnimatePresence } from "framer-motion";

// Shared input styling
const inputCls =
  "w-full py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all outline-none";

const FieldWrapper = ({ label, children }) => (
  <div className="relative">
    <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">{label}</label>
    <div className="relative flex items-center">{children}</div>
  </div>
);

const LessonForm = ({ lessonForm, setLessonForm, handleSaveLesson, seriesList }) => {
  const update = (field) => (e) => setLessonForm({ ...lessonForm, [field]: e.target.value });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-5 sm:p-8 shadow-sm w-full max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-7">
        <h2 className="text-xl sm:text-2xl font-bold font-tajawal text-[var(--text-main)]">
          {lessonForm.id ? "تعديل حلقة" : "إضافة حلقات جديدة"}
        </h2>
        {lessonForm.id && (
          <button
            type="button"
            onClick={() => setLessonForm({ seriesId: lessonForm.seriesId, id: null, title: "", link: "", isBulk: false, bulkData: "" })}
            className="text-sm font-bold text-red-500 hover:bg-red-500/10 px-3 py-1 rounded-lg transition-colors"
          >
            إلغاء التعديل
          </button>
        )}
      </div>

      <form onSubmit={handleSaveLesson} className="space-y-5 font-tajawal">
        {/* Series selector */}
        <FieldWrapper label="اختر السلسلة">
          <i className="fa-solid fa-list absolute right-4 text-[var(--text-muted)]"></i>
          <select
            required
            value={lessonForm.seriesId}
            onChange={update("seriesId")}
            onInvalid={(e) => e.target.setCustomValidity("يرجى اختيار سلسلة")}
            onInput={(e) => e.target.setCustomValidity("")}
            className={`${inputCls} pr-10 pl-4 appearance-none cursor-pointer`}
          >
            <option value="">-- اختر السلسلة --</option>
            {seriesList.filter((s) => s.type !== "single").map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
          <i className="fa-solid fa-chevron-down absolute left-4 text-[var(--text-muted)] pointer-events-none text-xs"></i>
        </FieldWrapper>

        {/* Bulk / Single toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[var(--bg-main)] p-3 rounded-xl border border-[var(--border-subtle)]">
          <span className="text-sm font-bold text-[var(--text-muted)]">طريقة الإضافة:</span>
          <div className="flex gap-2 w-full sm:w-auto">
            {[
              { bulk: false, icon: "fa-file-video", label: "حلقة مفردة" },
              { bulk: true, icon: "fa-layer-group", label: "مجموعة (JSON)" },
            ].map(({ bulk, icon, label }) => (
              <button
                key={label}
                type="button"
                onClick={() => setLessonForm({ ...lessonForm, isBulk: bulk })}
                className={`flex-1 sm:flex-none px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${lessonForm.isBulk === bulk
                    ? "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/30"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-card)] border border-[var(--border-subtle)]"
                  }`}
              >
                <i className={`fa-solid ${icon}`}></i>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic fields */}
        <AnimatePresence mode="wait">
          {lessonForm.isBulk ? (
            <motion.div key="bulk" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <FieldWrapper label="بيانات الحلقات (JSON Array)">
                <textarea
                  required
                  placeholder={'[\n  {"title": "حلقة 1", "url": "https://..."}\n]'}
                  value={lessonForm.bulkData}
                  onChange={update("bulkData")}
                  className="w-full p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all outline-none min-h-[160px] font-mono text-sm leading-relaxed"
                  dir="ltr"
                />
              </FieldWrapper>
            </motion.div>
          ) : (
            <motion.div key="single" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
              <FieldWrapper label="عنوان الحلقة">
                <i className="fa-solid fa-play absolute right-4 text-[var(--text-muted)]"></i>
                <input
                  required={!lessonForm.isBulk}
                  value={lessonForm.title}
                  onChange={update("title")}
                  onInvalid={(e) => e.target.setCustomValidity("يرجى ملء هذا الحقل")}
                  onInput={(e) => e.target.setCustomValidity("")}
                  placeholder="اكتب اسم الحلقة..."
                  className={`${inputCls} pr-10 pl-4`}
                />
              </FieldWrapper>

              <FieldWrapper label="الرابط">
                <i className="fa-solid fa-link absolute left-4 text-[var(--text-muted)]"></i>
                <input
                  required={!lessonForm.isBulk}
                  value={lessonForm.link}
                  onChange={update("link")}
                  onInvalid={(e) => e.target.setCustomValidity("يرجى ملء هذا الحقل")}
                  onInput={(e) => e.target.setCustomValidity("")}
                  placeholder="https://youtube.com/..."
                  dir="ltr"
                  className={`${inputCls} pl-10 pr-4 text-left`}
                />
              </FieldWrapper>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          className="w-full py-3 sm:py-4 mt-4 bg-[var(--accent)] text-white font-bold text-base sm:text-lg rounded-xl shadow-lg shadow-[var(--accent)]/30 hover:bg-[var(--accent-hover)] hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center gap-3"
        >
          <i className="fa-solid fa-paper-plane"></i>
          {lessonForm.id ? "حفظ التعديلات" : "إضافة الحلقات"}
        </button>
      </form>
    </motion.div>
  );
};

export default LessonForm;

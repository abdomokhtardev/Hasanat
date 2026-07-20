import { motion, AnimatePresence } from "framer-motion";

const LessonForm = ({ lessonForm, setLessonForm, handleSaveLesson, seriesList }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold font-tajawal text-[var(--text-main)]">
          {lessonForm.id ? "تعديل حلقة" : "إضافة حلقات جديدة"}
        </h2>
        {lessonForm.id && (
          <button type="button" onClick={() => setLessonForm({ seriesId: lessonForm.seriesId, id: null, title: "", link: "", isBulk: false, bulkData: "" })} className="text-sm font-bold text-red-500 hover:bg-red-500/10 px-3 py-1 rounded-lg transition-colors">إلغاء التعديل</button>
        )}
      </div>

      <form onSubmit={handleSaveLesson} className="space-y-5 font-tajawal">
        <div className="relative">
          <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">اختر السلسلة</label>
          <div className="relative flex items-center">
             <i className="fa-solid fa-list absolute right-4 text-[var(--text-muted)]"></i>
             <select required onInvalid={(e) => e.target.setCustomValidity('يرجى اختيار سلسلة')} onInput={(e) => e.target.setCustomValidity('')} value={lessonForm.seriesId} onChange={e => setLessonForm({...lessonForm, seriesId: e.target.value})} className="w-full pr-10 pl-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all outline-none appearance-none cursor-pointer">
               <option value="">-- اختر السلسلة --</option>
               {seriesList.filter(s => s.type !== "single").map(s => (
                 <option key={s.id} value={s.id}>{s.title}</option>
               ))}
             </select>
             <i className="fa-solid fa-chevron-down absolute left-4 text-[var(--text-muted)] pointer-events-none text-xs"></i>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6 bg-[var(--bg-main)] p-2 rounded-xl border border-[var(--border-subtle)]">
          <label className="text-sm font-bold text-[var(--text-muted)] pr-2">طريقة الإضافة:</label>
          <div className="flex gap-2">
            <button type="button" onClick={() => setLessonForm({...lessonForm, isBulk: false})} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${!lessonForm.isBulk ? "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/30" : "text-[var(--text-muted)] hover:bg-[var(--bg-card)]"}`}>
               <i className="fa-solid fa-file-video"></i>
               حلقة مفردة
            </button>
            <button type="button" onClick={() => setLessonForm({...lessonForm, isBulk: true})} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-2 ${lessonForm.isBulk ? "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/30" : "text-[var(--text-muted)] hover:bg-[var(--bg-card)]"}`}>
               <i className="fa-solid fa-layer-group"></i>
               مجموعة (JSON)
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {lessonForm.isBulk ? (
            <motion.div
              key="bulk"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative mt-4"
            >
              <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">بيانات الحلقات (JSON Array)</label>
              <textarea required placeholder='[\n  {"title": "حلقة 1", "url": "https://..."}\n]' value={lessonForm.bulkData} onChange={e => setLessonForm({...lessonForm, bulkData: e.target.value})} className="w-full p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all outline-none min-h-[160px] font-mono text-sm leading-relaxed" dir="ltr" />
            </motion.div>
          ) : (
            <motion.div
              key="single"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5 mt-4"
            >
              <div className="relative">
                <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">عنوان الحلقة</label>
                <div className="relative flex items-center">
                   <i className="fa-solid fa-play absolute right-4 text-[var(--text-muted)]"></i>
                   <input required={!lessonForm.isBulk} onInvalid={(e) => e.target.setCustomValidity('يرجى ملء هذا الحقل')} onInput={(e) => e.target.setCustomValidity('')} value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title: e.target.value})} className="w-full pr-10 pl-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all outline-none" placeholder="اكتب اسم الحلقة..." />
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">الرابط</label>
                <div className="relative flex items-center">
                   <i className="fa-solid fa-link absolute left-4 text-[var(--text-muted)]"></i>
                   <input required={!lessonForm.isBulk} onInvalid={(e) => e.target.setCustomValidity('يرجى ملء هذا الحقل')} onInput={(e) => e.target.setCustomValidity('')} value={lessonForm.link} onChange={e => setLessonForm({...lessonForm, link: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all outline-none text-left" dir="ltr" placeholder="https://youtube.com/..." />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button type="submit" className="w-full py-4 mt-6 bg-[var(--accent)] text-white font-bold text-lg rounded-xl shadow-lg shadow-[var(--accent)]/30 hover:bg-[var(--accent-hover)] hover:-translate-y-1 transition-all duration-300 flex justify-center items-center gap-3">
          <i className="fa-solid fa-paper-plane text-xl"></i>
          {lessonForm.id ? "حفظ التعديلات" : "إضافة الحلقات"}
        </button>
      </form>
    </motion.div>
  );
};

export default LessonForm;

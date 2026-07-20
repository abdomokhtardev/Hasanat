import { motion, AnimatePresence } from "framer-motion";

const SeriesForm = ({ seriesForm, setSeriesForm, handleSaveSeries }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold font-tajawal text-[var(--text-main)]">
          {seriesForm.id ? "تعديل محتوى" : "إضافة محتوى جديد"}
        </h2>
        {seriesForm.id && (
          <button type="button" onClick={() => setSeriesForm({ id: null, title: "", teacher: "", category: "ديني", type: "series", link: "" })} className="text-sm font-bold text-red-500 hover:bg-red-500/10 px-3 py-1 rounded-lg transition-colors">إلغاء التعديل</button>
        )}
      </div>
      <form onSubmit={handleSaveSeries} className="space-y-5 font-tajawal">
        <div className="flex flex-wrap gap-6 mb-6">
          <label className="flex items-center gap-3 cursor-pointer text-sm font-bold text-[var(--text-main)]">
            <input type="radio" name="type" value="series" checked={seriesForm.type === "series"} onChange={() => setSeriesForm({...seriesForm, type: "series"})} className="w-5 h-5 accent-[var(--accent)]" />
            <span>سلسلة علمية</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer text-sm font-bold text-[var(--text-main)]">
            <input type="radio" name="type" value="single" checked={seriesForm.type === "single"} onChange={() => setSeriesForm({...seriesForm, type: "single"})} className="w-5 h-5 accent-[var(--accent)]" />
            <span>حلقة منفردة</span>
          </label>
        </div>

        <div className="relative">
          <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">العنوان</label>
          <div className="relative flex items-center">
             <i className="fa-solid fa-heading absolute right-4 text-[var(--text-muted)]"></i>
             <input required onInvalid={(e) => e.target.setCustomValidity('يرجى ملء هذا الحقل')} onInput={(e) => e.target.setCustomValidity('')} value={seriesForm.title} onChange={e => setSeriesForm({...seriesForm, title: e.target.value})} className="w-full pr-10 pl-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all outline-none" placeholder="اكتب العنوان هنا..." />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">الشيخ / المحاضر</label>
          <div className="relative flex items-center">
             <i className="fa-solid fa-user-tie absolute right-4 text-[var(--text-muted)]"></i>
             <input required onInvalid={(e) => e.target.setCustomValidity('يرجى ملء هذا الحقل')} onInput={(e) => e.target.setCustomValidity('')} value={seriesForm.teacher} onChange={e => setSeriesForm({...seriesForm, teacher: e.target.value})} className="w-full pr-10 pl-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all outline-none" placeholder="اسم الشيخ..." />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">التصنيف</label>
          <div className="relative flex items-center">
             <i className="fa-solid fa-tags absolute right-4 text-[var(--text-muted)]"></i>
             <input required onInvalid={(e) => e.target.setCustomValidity('يرجى ملء هذا الحقل')} onInput={(e) => e.target.setCustomValidity('')} placeholder="مثال: ديني، تاريخ..." value={seriesForm.category} onChange={e => setSeriesForm({...seriesForm, category: e.target.value})} className="w-full pr-10 pl-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all outline-none" />
          </div>
        </div>
        
        <AnimatePresence>
          {seriesForm.type === "single" && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="relative overflow-hidden"
            >
              <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">رابط الفيديو (يوتيوب)</label>
              <div className="relative flex items-center">
                 <i className="fa-solid fa-link absolute left-4 text-[var(--text-muted)]"></i>
                 <input required onInvalid={(e) => e.target.setCustomValidity('يرجى ملء هذا الحقل')} onInput={(e) => e.target.setCustomValidity('')} value={seriesForm.link} onChange={e => setSeriesForm({...seriesForm, link: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all outline-none text-left" dir="ltr" placeholder="https://youtube.com/..." />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button type="submit" className="w-full py-4 mt-6 bg-[var(--accent)] text-white font-bold text-lg rounded-xl shadow-lg shadow-[var(--accent)]/30 hover:bg-[var(--accent-hover)] hover:-translate-y-1 transition-all duration-300 flex justify-center items-center gap-3">
          <i className="fa-solid fa-cloud-arrow-up text-xl"></i>
          {seriesForm.id ? "حفظ التعديلات" : "إضافة المحتوى"}
        </button>
      </form>
    </motion.div>
  );
};

export default SeriesForm;

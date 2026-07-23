import { motion, AnimatePresence } from "framer-motion";

// Shared input class — avoids repetition across all fields
const inputCls =
  "w-full py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all outline-none";

const FieldWrapper = ({ label, children }) => (
  <div className="relative">
    <label className="block text-sm font-bold text-[var(--text-muted)] mb-2">{label}</label>
    <div className="relative flex items-center">{children}</div>
  </div>
);

const IconInput = ({ icon, iconSide = "right", ...props }) => (
  <>
    <i className={`fa-solid ${icon} absolute ${iconSide}-4 text-[var(--text-muted)]`}></i>
    <input
      {...props}
      onInvalid={(e) => e.target.setCustomValidity("يرجى ملء هذا الحقل")}
      onInput={(e) => e.target.setCustomValidity("")}
      className={`${inputCls} ${iconSide === "right" ? "pr-10 pl-4" : "pl-10 pr-4"} ${props.className ?? ""}`}
    />
  </>
);

const SeriesForm = ({ seriesForm, setSeriesForm, handleSaveSeries }) => {
  const update = (field) => (e) => setSeriesForm({ ...seriesForm, [field]: e.target.value });

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
          {seriesForm.id ? "تعديل محتوى" : "إضافة محتوى جديد"}
        </h2>
        {seriesForm.id && (
          <button
            type="button"
            onClick={() => setSeriesForm({ id: null, title: "", teacher: "", category: "ديني", type: "series", link: "" })}
            className="text-sm font-bold text-red-500 hover:bg-red-500/10 px-3 py-1 rounded-lg transition-colors"
          >
            إلغاء التعديل
          </button>
        )}
      </div>

      <form onSubmit={handleSaveSeries} className="space-y-5 font-tajawal">
        {/* Type toggle */}
        <div className="flex gap-6 flex-wrap mb-2">
          {[
            { value: "series", label: "سلسلة علمية" },
            { value: "single", label: "حلقة منفردة" },
          ].map(({ value, label }) => (
            <label key={value} className="flex items-center gap-3 cursor-pointer text-sm font-bold text-[var(--text-main)]">
              <input
                type="radio"
                name="type"
                value={value}
                checked={seriesForm.type === value}
                onChange={() => setSeriesForm({ ...seriesForm, type: value })}
                className="w-5 h-5 accent-[var(--accent)]"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <FieldWrapper label="العنوان">
          <IconInput icon="fa-heading" value={seriesForm.title} onChange={update("title")} placeholder="اكتب العنوان هنا..." required />
        </FieldWrapper>

        <FieldWrapper label="الشيخ / المحاضر">
          <IconInput icon="fa-user-tie" value={seriesForm.teacher} onChange={update("teacher")} placeholder="اسم الشيخ..." required />
        </FieldWrapper>

        <FieldWrapper label="التصنيف">
          <IconInput icon="fa-tags" value={seriesForm.category} onChange={update("category")} placeholder="مثال: ديني، تاريخ..." required />
        </FieldWrapper>

        <AnimatePresence>
          {seriesForm.type === "single" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <FieldWrapper label="رابط الفيديو (يوتيوب)">
                <IconInput
                  icon="fa-link"
                  iconSide="left"
                  value={seriesForm.link}
                  onChange={update("link")}
                  placeholder="https://youtube.com/..."
                  dir="ltr"
                  required
                />
              </FieldWrapper>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          className="w-full py-3 sm:py-4 mt-4 bg-[var(--accent)] text-white font-bold text-base sm:text-lg rounded-xl shadow-lg shadow-[var(--accent)]/30 hover:bg-[var(--accent-hover)] hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center gap-3"
        >
          <i className="fa-solid fa-cloud-arrow-up"></i>
          {seriesForm.id ? "حفظ التعديلات" : "إضافة المحتوى"}
        </button>
      </form>
    </motion.div>
  );
};

export default SeriesForm;

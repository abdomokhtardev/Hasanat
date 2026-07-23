import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";

// Shared small action button
const ActionBtn = ({ onClick, colorClass, icon, label }) => (
  <button
    onClick={onClick}
    className={`${label ? "px-3 py-2 w-full sm:w-auto" : "p-2"} ${colorClass} text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2`}
  >
    <i className={`fa-solid ${icon}`}></i>
    {label && label}
  </button>
);

const SeriesList = ({
  seriesList,
  expandedSeries,
  setExpandedSeries,
  setSeriesForm,
  handleDeleteSeries,
  handleReorderEpisodes,
  setLessonForm,
  handleDeleteLesson,
  handleBulkDeleteDone,
  setActiveTab,
}) => {
  // Map of seriesId → Set of selected episode IDs
  const [selectedEps, setSelectedEps] = useState({});

  const getSelected = (seriesId) => selectedEps[seriesId] || new Set();

  const toggleEp = (seriesId, epId) => {
    setSelectedEps((prev) => {
      const next = new Set(prev[seriesId] || []);
      next.has(epId) ? next.delete(epId) : next.add(epId);
      return { ...prev, [seriesId]: next };
    });
  };

  const toggleAll = (seriesId, episodes) => {
    setSelectedEps((prev) => {
      const current = prev[seriesId] || new Set();
      const allSelected = current.size === episodes.length;
      return { ...prev, [seriesId]: allSelected ? new Set() : new Set(episodes.map((e) => e.id)) };
    });
  };

  const clearSelection = (seriesId) =>
    setSelectedEps((prev) => ({ ...prev, [seriesId]: new Set() }));

  const handleBulkDelete = async (seriesId, episodes) => {
    const ids = getSelected(seriesId);
    if (!ids.size) return;
    if (!window.confirm(`هل أنت متأكد من حذف ${ids.size} حلقة؟`)) return;
    for (const epId of ids) {
      await handleDeleteLesson(seriesId, epId, true);
    }
    clearSelection(seriesId);
    handleBulkDeleteDone(); // single Firestore refresh + toast after all done
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-4 sm:p-8 shadow-sm min-h-[400px] w-full"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold font-tajawal text-[var(--text-main)]">المحتوى الحالي</h2>
        <span className="text-xs sm:text-sm font-bold text-[var(--text-muted)] bg-[var(--bg-main)] px-3 py-1 rounded-full border border-[var(--border-subtle)]">
          الإجمالي: {seriesList.length}
        </span>
      </div>

      <div className="space-y-4">
        {seriesList.length === 0 ? (
          <div className="text-center text-[var(--text-muted)] font-tajawal py-16">لا يوجد محتوى حالياً</div>
        ) : (
          seriesList.map((series) => {
            const selected = getSelected(series.id);
            const episodes = series.episodes || [];
            const allChecked = episodes.length > 0 && selected.size === episodes.length;
            const someChecked = selected.size > 0 && !allChecked;

            return (
              <motion.div
                layout
                key={series.id}
                className="border border-[var(--border-subtle)] rounded-xl overflow-hidden hover:border-[var(--accent)] transition-colors duration-300"
              >
                {/* Series row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[var(--bg-main)] gap-3">
                  {/* Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] shrink-0 shadow-sm">
                      <i className={`fa-solid ${series.type === "single" ? "fa-play" : "fa-list"}`}></i>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-[var(--text-main)] font-tajawal text-sm sm:text-base flex flex-wrap items-center gap-2">
                        <span className="truncate">{series.title}</span>
                        <span className="text-[10px] font-medium bg-[var(--bg-card)] px-2 py-0.5 rounded border border-[var(--border-subtle)] text-[var(--text-muted)] shrink-0">
                          {series.category}
                        </span>
                      </h3>
                      <p className="text-[10px] sm:text-xs text-[var(--text-muted)] mt-0.5 font-bold">
                        <i className="fa-solid fa-microphone-lines ml-1"></i>
                        {series.teacher}
                        <span className="mx-2">•</span>
                        {series.type === "single" ? (
                          <span className="text-[var(--accent)]">حلقة منفردة</span>
                        ) : (
                          <span>{episodes.length} حلقات</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                    {series.type !== "single" && (
                      <ActionBtn
                        onClick={() => setExpandedSeries(expandedSeries === series.id ? null : series.id)}
                        colorClass="bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
                        icon={expandedSeries === series.id ? "fa-eye-slash" : "fa-eye"}
                        label={expandedSeries === series.id ? "إخفاء" : "عرض الحلقات"}
                      />
                    )}
                    <ActionBtn
                      onClick={() => {
                        setSeriesForm({ id: series.id, title: series.title, teacher: series.teacher, category: series.category || "ديني", type: series.type || "series", link: series.episodes?.[0]?.link || "" });
                        setActiveTab("series");
                      }}
                      colorClass="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                      icon="fa-pen"
                      label="تعديل"
                    />
                    <ActionBtn
                      onClick={() => handleDeleteSeries(series.id)}
                      colorClass="bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      icon="fa-trash"
                      label="حذف"
                    />
                  </div>
                </div>

                {/* Episodes list (expandable) */}
                {expandedSeries === series.id && series.type !== "single" && (
                  <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-main)]/50">
                    {episodes.length > 0 ? (
                      <>
                        {/* Bulk-action toolbar */}
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-subtle)] gap-3 flex-wrap">
                          {/* Select-all checkbox */}
                          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold font-tajawal text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                            <input
                              type="checkbox"
                              checked={allChecked}
                              ref={(el) => { if (el) el.indeterminate = someChecked; }}
                              onChange={() => toggleAll(series.id, episodes)}
                              className="w-4 h-4 accent-[var(--accent)] cursor-pointer"
                            />
                            {allChecked ? "إلغاء تحديد الكل" : "تحديد الكل"}
                          </label>

                          {/* Bulk delete button — only visible when something is selected */}
                          <AnimatePresence>
                            {selected.size > 0 && (
                              <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.15 }}
                                onClick={() => handleBulkDelete(series.id, episodes)}
                                className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors shadow-sm"
                              >
                                <i className="fa-solid fa-trash"></i>
                                حذف {selected.size} حلقة
                              </motion.button>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Episode rows */}
                        <Reorder.Group
                          axis="y"
                          values={episodes}
                          onReorder={(newOrder) => handleReorderEpisodes(series.id, newOrder)}
                          className="space-y-0 p-3 sm:p-4"
                        >
                          {episodes.map((ep, index) => {
                            const isChecked = selected.has(ep.id);
                            return (
                              <Reorder.Item
                                key={ep.id}
                                value={ep}
                                className={`flex justify-between items-center p-3 rounded-lg cursor-grab active:cursor-grabbing gap-3 transition-all mb-2 border ${
                                  isChecked
                                    ? "bg-red-500/5 border-red-500/30"
                                    : "bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-[var(--accent)]"
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  {/* Checkbox */}
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleEp(series.id, ep.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-4 h-4 accent-[var(--accent)] cursor-pointer shrink-0"
                                  />
                                  <i className="fa-solid fa-grip-lines text-[var(--text-muted)] text-sm shrink-0"></i>
                                  <span className="w-5 h-5 rounded-full bg-[var(--bg-main)] border border-[var(--border-subtle)] flex items-center justify-center text-[10px] font-bold text-[var(--text-muted)] shrink-0">
                                    {index + 1}
                                  </span>
                                  <p className="font-tajawal text-sm font-bold text-[var(--text-main)] truncate">{ep.title}</p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                  <ActionBtn
                                    onClick={() => { setLessonForm({ seriesId: series.id, id: ep.id, title: ep.title, link: ep.link, isBulk: false, bulkData: "" }); setActiveTab("lessons"); }}
                                    colorClass="bg-blue-500/5 text-blue-500 hover:bg-blue-500/10"
                                    icon="fa-pen"
                                  />
                                  <ActionBtn
                                    onClick={() => handleDeleteLesson(series.id, ep.id)}
                                    colorClass="bg-red-500/5 text-red-500 hover:bg-red-500/10"
                                    icon="fa-trash"
                                  />
                                </div>
                              </Reorder.Item>
                            );
                          })}
                        </Reorder.Group>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-[var(--text-muted)] p-4">
                        <i className="fa-regular fa-folder-open text-3xl mb-2"></i>
                        <p className="text-sm font-tajawal">لا يوجد حلقات، يمكنك إضافتها الآن!</p>
                        <button
                          onClick={() => { setLessonForm({ seriesId: series.id, id: null, title: "", link: "", isBulk: false, bulkData: "" }); setActiveTab("lessons"); }}
                          className="mt-3 text-xs font-bold text-[var(--accent)] hover:underline"
                        >
                          إضافة حلقة
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default SeriesList;

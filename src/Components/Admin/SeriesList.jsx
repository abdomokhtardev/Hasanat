import { motion, Reorder } from "framer-motion";

const SeriesList = ({
  seriesList,
  expandedSeries,
  setExpandedSeries,
  setSeriesForm,
  handleDeleteSeries,
  handleReorderEpisodes,
  setLessonForm,
  handleDeleteLesson,
  setActiveTab
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 shadow-sm min-h-[600px] max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-tajawal text-[var(--text-main)]">المحتوى الحالي</h2>
        <span className="text-sm font-bold text-[var(--text-muted)] bg-[var(--bg-main)] px-3 py-1 rounded-full border border-[var(--border-subtle)]">
          الإجمالي: {seriesList.length}
        </span>
      </div>

      <div className="space-y-4">
        {seriesList.length === 0 ? (
          <div className="text-center text-[var(--text-muted)] font-tajawal py-10">لا يوجد محتوى حالياً</div>
        ) : (
          seriesList.map(series => (
            <motion.div layout key={series.id} className="border border-[var(--border-subtle)] rounded-xl overflow-hidden hover:border-[var(--accent)] transition-colors duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[var(--bg-main)] gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] text-xl shrink-0 shadow-sm">
                    <i className={`fa-solid ${series.type === "single" ? "fa-play" : "fa-list"}`}></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-main)] font-tajawal text-lg flex items-center gap-2">
                      {series.title}
                      <span className="text-xs font-medium bg-[var(--bg-card)] px-2 py-0.5 rounded border border-[var(--border-subtle)] text-[var(--text-muted)]">
                        {series.category}
                      </span>
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1 font-bold">
                      <i className="fa-solid fa-microphone-lines ml-1"></i> {series.teacher}
                      <span className="mx-2">•</span>
                      {series.type === "single" ? (
                        <span className="text-[var(--accent)]">حلقة منفردة</span>
                      ) : (
                        <span>{series.episodes?.length || 0} حلقات</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto shrink-0">
                  {series.type !== "single" && (
                    <button
                      onClick={() => setExpandedSeries(expandedSeries === series.id ? null : series.id)}
                      className="flex-1 sm:flex-none px-3 py-2 bg-gray-500/10 text-gray-500 text-xs font-bold rounded-lg hover:bg-gray-500/20 transition-colors flex items-center justify-center gap-2"
                    >
                      <i className={`fa-solid ${expandedSeries === series.id ? "fa-eye-slash" : "fa-eye"}`}></i>
                      {expandedSeries === series.id ? "إخفاء" : "عرض الحلقات"}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSeriesForm({ id: series.id, title: series.title, teacher: series.teacher, category: series.category || "ديني", type: series.type || "series", link: series.episodes?.[0]?.link || "" });
                      setActiveTab("series");
                    }}
                    className="flex-1 sm:flex-none px-3 py-2 bg-blue-500/10 text-blue-500 text-xs font-bold rounded-lg hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-pen"></i> تعديل
                  </button>
                  <button
                    onClick={() => handleDeleteSeries(series.id)}
                    className="flex-1 sm:flex-none px-3 py-2 bg-red-500/10 text-red-500 text-xs font-bold rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-trash"></i> حذف
                  </button>
                </div>
              </div>

              {expandedSeries === series.id && series.type !== "single" && (
                <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-main)]/50">
                  {series.episodes?.length > 0 ? (
                    <Reorder.Group axis="y" values={series.episodes} onReorder={(newOrder) => handleReorderEpisodes(series.id, newOrder)} className="space-y-2">
                      {series.episodes.map((ep, index) => (
                        <Reorder.Item key={ep.id} value={ep} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg cursor-grab active:cursor-grabbing gap-3 hover:border-[var(--accent)] transition-colors">
                          <div className="flex items-center gap-4 w-full sm:w-auto">
                            <i className="fa-solid fa-grip-lines text-[var(--text-muted)] text-sm cursor-grab active:cursor-grabbing"></i>
                            <span className="w-6 h-6 rounded-full bg-[var(--bg-main)] border border-[var(--border-subtle)] flex items-center justify-center text-xs font-bold text-[var(--text-muted)] shrink-0">
                              {index + 1}
                            </span>
                            <p className="font-tajawal text-sm font-bold text-[var(--text-main)] truncate max-w-[200px]">{ep.title}</p>
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto justify-end">
                            <button
                              onClick={() => {
                                setLessonForm({ seriesId: series.id, id: ep.id, title: ep.title, link: ep.link, isBulk: false, bulkData: "" });
                                setActiveTab("lessons");
                              }}
                              className="p-2 text-blue-500 bg-blue-500/5 hover:bg-blue-500/10 rounded-lg text-xs transition-colors"
                            >
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(series.id, ep.id)}
                              className="p-2 text-red-500 bg-red-500/5 hover:bg-red-500/10 rounded-lg text-xs transition-colors"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-[var(--text-muted)]">
                      <i className="fa-regular fa-folder-open text-3xl mb-2"></i>
                      <p className="text-sm font-tajawal">لا يوجد حلقات، يمكنك إضافتها الآن!</p>
                      <button onClick={() => { setLessonForm({ seriesId: series.id, id: null, title: "", link: "", isBulk: false, bulkData: "" }); setActiveTab("lessons"); }} className="mt-3 text-xs font-bold text-[var(--accent)] hover:underline">
                        إضافة حلقة
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default SeriesList;

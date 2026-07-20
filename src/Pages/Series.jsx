import { useData } from "../hooks/UseData.js";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const extractVideoId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
  return match ? match[1] : null;
};

const Series = () => {
  const { lessons, loading, Spinner } = useData();
  const { seriesId } = useParams();
  const [currentSeries, setCurrentSeries] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [watchedEpisodes, setWatchedEpisodes] = useState([]);

  useEffect(() => {
    if (!loading && lessons.length > 0) {
      const foundSeries = lessons.find((e) => e.id === seriesId);
      if (foundSeries) {
        setCurrentSeries(foundSeries);
        setCurrentEpisode(foundSeries.episodes[0]);
      }
    }

    const savedProgress = JSON.parse(localStorage.getItem("hasanat_progress")) || {};
    if (savedProgress[seriesId]) {
      setWatchedEpisodes(savedProgress[seriesId]);
    }
  }, [lessons, seriesId, loading]);

  const toggleWatched = (epId) => {
    let updatedWatched = [...watchedEpisodes];
    if (updatedWatched.includes(epId)) {
      updatedWatched = updatedWatched.filter(id => id !== epId);
    } else {
      updatedWatched.push(epId);
    }
    setWatchedEpisodes(updatedWatched);

    const savedProgress = JSON.parse(localStorage.getItem("hasanat_progress")) || {};
    savedProgress[seriesId] = updatedWatched;
    localStorage.setItem("hasanat_progress", JSON.stringify(savedProgress));
  };

  if (loading || !currentSeries) {
    return (
      <div className="pt-32 min-h-screen flex justify-center items-center bg-[var(--bg-main)]">
        {loading ? Spinner() : <p className="text-[var(--text-muted)] text-lg font-tajawal">لم يتم العثور على السلسلة</p>}
      </div>
    );
  }

  const progressPercentage = Math.round((watchedEpisodes.length / currentSeries.episodes.length) * 100) || 0;

  const currentEpisodeIndex = currentSeries.episodes.findIndex(ep => ep.id === currentEpisode?.id);
  const hasNext = currentEpisodeIndex !== -1 && currentEpisodeIndex < currentSeries.episodes.length - 1;
  const hasPrev = currentEpisodeIndex > 0;

  const goToNext = () => {
    if (hasNext) setCurrentEpisode(currentSeries.episodes[currentEpisodeIndex + 1]);
  };

  const goToPrev = () => {
    if (hasPrev) setCurrentEpisode(currentSeries.episodes[currentEpisodeIndex - 1]);
  };

  return (
    <main className="pt-28 pb-24 px-4 bg-[var(--bg-main)] min-h-screen">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-10">

        {/* Apple-style Typographic Header (No Image) */}
        <div className="card-glass p-8 md:p-12 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-[1.5rem] bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] mb-8 shadow-sm">
            <i className="fa-solid fa-book-open text-3xl"></i>
          </div>
          <span className="pill-glass px-5 py-1.5 inline-block text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">
            {currentSeries.type === 'single' ? 'حلقة منفردة' : 'سلسلة علمية'}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-amiri text-[var(--text-main)] mb-6 leading-tight max-w-3xl">
            {currentSeries.title}
          </h1>
          <div className="flex items-center justify-center gap-3 text-[var(--text-muted)] font-tajawal text-xl font-medium">
            <i className="fa-solid fa-microphone-lines text-[var(--accent)]"></i>
            <span> {currentSeries.teacher}</span>
          </div>
        </div>

        {/* Video Player */}
        <AnimatePresence mode="wait">
          {currentEpisode && (
            <motion.div
              key={currentEpisode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full card-glass overflow-hidden flex flex-col"
            >
              <div className="relative w-full aspect-video bg-black rounded-t-[1.5rem] overflow-hidden">
                {extractVideoId(currentEpisode.link) ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${extractVideoId(currentEpisode.link)}?autoplay=0&rel=0&modestbranding=1`}
                    title={currentEpisode.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-500 font-tajawal">
                    رابط الفيديو غير صالح
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                <h2 className="text-2xl font-bold text-[var(--text-main)] font-amiri text-center sm:text-right">
                  {currentEpisode.title}
                </h2>

                <button
                  onClick={() => toggleWatched(currentEpisode.id)}
                  className={`px-6 py-3 rounded-full font-tajawal font-bold text-sm transition-all flex items-center gap-2 ${watchedEpisodes.includes(currentEpisode.id)
                      ? "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/30"
                      : "bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-subtle)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    }`}
                >
                  {watchedEpisodes.includes(currentEpisode.id) ? (
                    <>
                      <i className="fa-solid fa-check"></i> اكتملت الإستماع
                    </>
                  ) : (
                    <>
                      تحديد كمستمع
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {currentSeries.type !== 'single' && currentSeries.episodes.length > 1 && (
          <div className="flex justify-between items-center gap-4 mt-[-1rem]">
            <button
              onClick={goToNext}
              disabled={!hasNext}
              className={`flex-1 py-3 px-4 rounded-xl font-bold font-tajawal flex items-center justify-center gap-2 transition-all ${
                hasNext 
                ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-md" 
                : "bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-subtle)] opacity-50 cursor-not-allowed"
              }`}
            >
              <i className="fa-solid fa-forward"></i> الحلقة التالية
            </button>
            <button
              onClick={goToPrev}
              disabled={!hasPrev}
              className={`flex-1 py-3 px-4 rounded-xl font-bold font-tajawal flex items-center justify-center gap-2 transition-all ${
                hasPrev 
                ? "bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-subtle)] hover:border-[var(--accent)] hover:text-[var(--accent)]" 
                : "bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-subtle)] opacity-50 cursor-not-allowed"
              }`}
            >
              الحلقة السابقة <i className="fa-solid fa-backward"></i>
            </button>
          </div>
        )}


        {/* Apple Style Playlist */}
        {currentSeries.type !== 'single' && (
          <div className="w-full card-glass p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <h3 className="text-2xl font-bold text-[var(--text-main)] font-amiri">الحلقات</h3>
            <div className="flex items-center gap-4">
              <span className="text-sm font-tajawal text-[var(--text-muted)] font-medium">
                إنجاز: {progressPercentage}%
              </span>
              <div className="w-24 h-2 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)]"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {currentSeries.episodes.map((item, index) => {
              const isWatched = watchedEpisodes.includes(item.id);
              const isCurrent = currentEpisode?.id === item.id;

              return (
                <div key={item.id} className="w-full">
                  <button
                    onClick={() => setCurrentEpisode(item)}
                    className={`w-full text-right px-4 py-4 rounded-xl flex items-center justify-between transition-all ${isCurrent
                        ? "bg-[var(--accent-light)] text-[var(--accent)]"
                        : "hover:bg-[var(--bg-card)] hover:shadow-sm text-[var(--text-main)]"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-sm w-6 text-center font-tajawal font-bold ${isCurrent ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`}>
                        {index + 1}
                      </span>
                      <span className={`text-base font-tajawal font-medium line-clamp-1 ${isCurrent ? "font-bold" : ""}`}>
                        {item.title}
                      </span>
                    </div>

                    <div className="shrink-0 flex items-center gap-4">
                      {isCurrent && (
                        <div className="flex items-center gap-1">
                          <span className="w-1 h-3 bg-[var(--accent)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-1 h-4 bg-[var(--accent)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-1 h-2 bg-[var(--accent)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      )}
                      {isWatched && !isCurrent && (
                        <i className="fa-solid fa-check text-[var(--accent)] opacity-80 text-sm"></i>
                      )}
                    </div>
                  </button>
                  {/* Simple line between episodes */}
                  {index < currentSeries.episodes.length - 1 && (
                    <div className="w-[calc(100%-2rem)] mx-auto h-px bg-[var(--border-subtle)] opacity-60 my-1"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        )}

      </div>
    </main>
  );
};

export default Series;

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { motion, AnimatePresence } from "framer-motion";
import SeriesForm from "../Components/Admin/SeriesForm";
import LessonForm from "../Components/Admin/LessonForm";
import SeriesList from "../Components/Admin/SeriesList";
import { useToast } from "../Context/ToastContext";

const AdminDashboard = () => {
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // UI State
  const [activeTab, setActiveTab] = useState("list"); // "list" | "series" | "lessons"
  const [expandedSeries, setExpandedSeries] = useState(null);

  // Form states
  const [seriesForm, setSeriesForm] = useState({ id: null, title: "", teacher: "", category: "ديني", type: "series", link: "" });
  const [lessonForm, setLessonForm] = useState({ seriesId: "", id: null, title: "", link: "", isBulk: false, bulkData: "" });

  const fetchSeries = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "series"));
      const seriesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSeriesList(seriesData);
    } catch (err) {
      console.error("Error fetching series", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  // --- Series Operations ---
  const handleSaveSeries = async (e) => {
    e.preventDefault();
    try {
      if (seriesForm.id) {
        const updateData = {
          title: seriesForm.title,
          teacher: seriesForm.teacher,
          category: seriesForm.category || "ديني",
          type: seriesForm.type
        };
        if (seriesForm.type === "single") {
          const targetSeries = seriesList.find(s => s.id === seriesForm.id);
          const existingEpisode = targetSeries?.episodes?.[0];
          updateData.episodes = [{
            id: existingEpisode ? existingEpisode.id : `ep_${Date.now()}`,
            title: seriesForm.title,
            link: seriesForm.link
          }];
        }
        await updateDoc(doc(db, "series", seriesForm.id), updateData);
        showToast("تم التحديث بنجاح!");
      } else {
        const newData = {
          title: seriesForm.title,
          teacher: seriesForm.teacher,
          category: seriesForm.category || "ديني",
          type: seriesForm.type,
          episodes: []
        };
        if (seriesForm.type === "single") {
          newData.episodes = [{
            id: `ep_${Date.now()}`,
            title: seriesForm.title,
            link: seriesForm.link
          }];
        }
        await addDoc(collection(db, "series"), newData);
        showToast("تم الإضافة بنجاح!");
      }
      setSeriesForm({ id: null, title: "", teacher: "", category: "ديني", type: "series", link: "" });
      fetchSeries();
      setActiveTab("list");
    } catch (err) {
      showToast("حدث خطأ أثناء الحفظ.", "error");
      console.error(err);
    }
  };

  const handleDeleteSeries = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المحتوى بالكامل؟")) return;
    try {
      await deleteDoc(doc(db, "series", id));
      showToast("تم حذف المحتوى.");
      fetchSeries();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Episode Operations ---
  const handleSaveLesson = async (e) => {
    e.preventDefault();
    if (!lessonForm.seriesId) return showToast("اختر السلسلة أولاً!", "error");
    try {
      const seriesRef = doc(db, "series", lessonForm.seriesId);
      const targetSeries = seriesList.find(s => s.id === lessonForm.seriesId);
      let newEpisodes = [...(targetSeries.episodes || [])];

      if (lessonForm.isBulk) {
        let parsedData = [];
        try {
          parsedData = JSON.parse(lessonForm.bulkData);
          if (!Array.isArray(parsedData)) throw new Error("Not an array");
        } catch (e) {
          return showToast("صيغة JSON غير صحيحة. يجب أن تكون مصفوفة صحيحة.", "error");
        }
        parsedData.forEach((item, index) => {
          const episodeLink = item.link || item.url;
          if (item.title && episodeLink) {
            newEpisodes.push({ id: `ep_${Date.now()}_${index}`, title: item.title, link: episodeLink });
          }
        });
        showToast("تمت الإضافة الجماعية بنجاح!");
      } else {
        if (lessonForm.id) {
          newEpisodes = newEpisodes.map(ep => ep.id === lessonForm.id ? { ...ep, title: lessonForm.title, link: lessonForm.link } : ep);
          showToast("تم تحديث الحلقة بنجاح!");
        } else {
          const epId = `ep_${Date.now()}`;
          newEpisodes.push({ id: epId, title: lessonForm.title, link: lessonForm.link });
          showToast("تم إضافة الحلقة بنجاح!");
        }
      }

      await updateDoc(seriesRef, { episodes: newEpisodes });
      setLessonForm({ seriesId: lessonForm.seriesId, id: null, title: "", link: "", isBulk: false, bulkData: "" });
      fetchSeries();
      setActiveTab("list");
    } catch (err) {
      showToast("حدث خطأ أثناء حفظ الحلقات.", "error");
      console.error(err);
    }
  };

  // silent=true skips the confirm dialog — used when bulk-deleting multiple episodes
  const handleDeleteLesson = async (seriesId, lessonId, silent = false) => {
    if (!silent && !window.confirm("هل أنت متأكد من حذف هذه الحلقة؟")) return;
    try {
      const seriesRef = doc(db, "series", seriesId);
      // Always read from the freshest local state to handle sequential bulk deletes
      const targetSeries = seriesList.find(s => s.id === seriesId);
      const newEpisodes = targetSeries.episodes.filter(ep => ep.id !== lessonId);
      await updateDoc(seriesRef, { episodes: newEpisodes });
      // Optimistic UI update for bulk mode (avoids multiple re-fetches mid-loop)
      setSeriesList(prev => prev.map(s => s.id === seriesId ? { ...s, episodes: newEpisodes } : s));
      if (!silent) {
        showToast("تم حذف الحلقة.");
        fetchSeries();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Called after bulk delete finishes to refresh from Firestore once
  const handleBulkDeleteDone = () => {
    showToast("تم حذف الحلقات المحددة.");
    fetchSeries();
  };


  const handleReorderEpisodes = async (seriesId, newOrder) => {
    setSeriesList(prev => prev.map(s => s.id === seriesId ? { ...s, episodes: newOrder } : s));
    try {
      await updateDoc(doc(db, "series", seriesId), { episodes: newOrder });
    } catch (err) {
      console.error("Reorder failed", err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center font-tajawal text-[var(--text-muted)]">
      جاري تحميل البيانات...
    </div>
  );

  const tabs = [
    { id: "list",    icon: "fa-list-ul",     label: "المحتوى" },
    { id: "series",  icon: "fa-folder-plus", label: "إضافة/تعديل" },
    { id: "lessons", icon: "fa-video",        label: "الحلقات" },
  ];

  return (
    <main className="min-h-screen pt-32 pb-20 bg-[var(--bg-main)]">
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-6">

        {/* Header */}
        <div className="mb-6 pb-5 border-b border-[var(--border-subtle)]">
          <h1 className="text-2xl sm:text-4xl font-bold font-amiri text-[var(--text-main)] mb-1">
            لوحة تحكم الإدارة
          </h1>
          <p className="text-[var(--text-muted)] font-tajawal text-xs sm:text-sm">
            إدارة السلاسل والحلقات الخاصة بالمنصة
          </p>
        </div>

        {/* Tabs — flex-1 on mobile (fills width), sm:w-auto on larger screens (natural width) */}
        <div className="flex sm:inline-flex w-full sm:w-auto bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-subtle)] gap-1 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                "flex-1 sm:flex-none min-w-0 py-2 sm:py-2.5 sm:px-5 rounded-lg font-bold font-tajawal",
                "text-[11px] sm:text-sm transition-all duration-200",
                "flex items-center justify-center gap-1 sm:gap-2",
                activeTab === tab.id
                  ? "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/20"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-main)]"
              ].join(" ")}
            >
              <i className={`fa-solid ${tab.icon} shrink-0`}></i>
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <AnimatePresence mode="wait">
          {activeTab === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SeriesList
                seriesList={seriesList}
                expandedSeries={expandedSeries}
                setExpandedSeries={setExpandedSeries}
                setSeriesForm={setSeriesForm}
                handleDeleteSeries={handleDeleteSeries}
                handleReorderEpisodes={handleReorderEpisodes}
                setLessonForm={setLessonForm}
                handleDeleteLesson={handleDeleteLesson}
                handleBulkDeleteDone={handleBulkDeleteDone}
                setActiveTab={setActiveTab}
              />
            </motion.div>
          )}

          {activeTab === "series" && (
            <motion.div
              key="series"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SeriesForm
                seriesForm={seriesForm}
                setSeriesForm={setSeriesForm}
                handleSaveSeries={handleSaveSeries}
              />
            </motion.div>
          )}

          {activeTab === "lessons" && (
            <motion.div
              key="lessons"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <LessonForm
                lessonForm={lessonForm}
                setLessonForm={setLessonForm}
                handleSaveLesson={handleSaveLesson}
                seriesList={seriesList}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
};

export default AdminDashboard;

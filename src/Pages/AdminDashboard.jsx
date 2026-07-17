import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { motion, Reorder } from "framer-motion";

const AdminDashboard = () => {
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // UI State
  const [expandedSeries, setExpandedSeries] = useState(null);

  // Form states
  const [seriesForm, setSeriesForm] = useState({ id: null, title: "", teacher: "", category: "ديني" });
  const [lessonForm, setLessonForm] = useState({ seriesId: "", id: null, title: "", link: "" });

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
        // Edit
        await updateDoc(doc(db, "series", seriesForm.id), {
          title: seriesForm.title,
          teacher: seriesForm.teacher,
          category: seriesForm.category || "ديني"
        });
        setMessage("تم تحديث السلسلة بنجاح!");
      } else {
        // Add
        await addDoc(collection(db, "series"), {
          title: seriesForm.title,
          teacher: seriesForm.teacher,
          category: seriesForm.category || "ديني",
          episodes: []
        });
        setMessage("تم إضافة السلسلة بنجاح!");
      }
      setSeriesForm({ id: null, title: "", teacher: "", category: "ديني" });
      fetchSeries();
    } catch (err) {
      setMessage("حدث خطأ أثناء حفظ السلسلة.");
      console.error(err);
    }
  };

  const handleDeleteSeries = async (id) => {
    if(!window.confirm("هل أنت متأكد من حذف هذه السلسلة بالكامل؟")) return;
    try {
      await deleteDoc(doc(db, "series", id));
      setMessage("تم حذف السلسلة.");
      fetchSeries();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Episode Operations ---
  const handleSaveLesson = async (e) => {
    e.preventDefault();
    if (!lessonForm.seriesId) return setMessage("اختر السلسلة أولاً!");
    
    try {
      const seriesRef = doc(db, "series", lessonForm.seriesId);
      const targetSeries = seriesList.find(s => s.id === lessonForm.seriesId);
      let newEpisodes = [...(targetSeries.episodes || [])];

      if (lessonForm.id) {
        // Edit
        newEpisodes = newEpisodes.map(ep => ep.id === lessonForm.id ? { ...ep, title: lessonForm.title, link: lessonForm.link } : ep);
        setMessage("تم تحديث الحلقة بنجاح!");
      } else {
        // Add
        const epId = `ep_${Date.now()}`;
        newEpisodes.push({ id: epId, title: lessonForm.title, link: lessonForm.link });
        setMessage("تم إضافة الحلقة بنجاح!");
      }
      
      await updateDoc(seriesRef, { episodes: newEpisodes });
      setLessonForm({ seriesId: lessonForm.seriesId, id: null, title: "", link: "" });
      fetchSeries();
    } catch (err) {
      setMessage("حدث خطأ أثناء حفظ الحلقة.");
      console.error(err);
    }
  };

  const handleDeleteLesson = async (seriesId, lessonId) => {
    if(!window.confirm("هل أنت متأكد من حذف هذه الحلقة؟")) return;
    try {
      const seriesRef = doc(db, "series", seriesId);
      const targetSeries = seriesList.find(s => s.id === seriesId);
      const newEpisodes = targetSeries.episodes.filter(ep => ep.id !== lessonId);
      await updateDoc(seriesRef, { episodes: newEpisodes });
      setMessage("تم حذف الحلقة.");
      fetchSeries();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReorderEpisodes = async (seriesId, newOrder) => {
    setSeriesList(prev => prev.map(s => s.id === seriesId ? { ...s, episodes: newOrder } : s));
    try {
      await updateDoc(doc(db, "series", seriesId), { episodes: newOrder });
    } catch(err) {
      console.error("Reorder failed", err);
    }
  };

  if (loading) return <div className="min-h-screen flex justify-center items-center">جاري التحميل...</div>;

  return (
    <main className="min-h-screen pt-32 pb-20 bg-[var(--bg-main)]">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold font-amiri text-[var(--text-main)] mb-8 border-b border-[var(--border-subtle)] pb-4">لوحة تحكم الإدارة</h1>
        
        {message && (
          <div className="mb-6 p-4 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 font-tajawal text-center font-bold">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Forms Section */}
          <div className="lg:col-span-1 space-y-8">
            {/* Series Form */}
            <motion.div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold font-tajawal text-[var(--text-main)]">
                  {seriesForm.id ? "تعديل سلسلة" : "إضافة سلسلة"}
                </h2>
                {seriesForm.id && (
                  <button onClick={() => setSeriesForm({ id: null, title: "", teacher: "", category: "ديني" })} className="text-sm text-red-500 hover:underline">إلغاء</button>
                )}
              </div>
              <form onSubmit={handleSaveSeries} className="space-y-4 font-tajawal">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">الاسم</label>
                  <input required onInvalid={(e) => e.target.setCustomValidity('يرجى ملء هذا الحقل')} onInput={(e) => e.target.setCustomValidity('')} value={seriesForm.title} onChange={e => setSeriesForm({...seriesForm, title: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">الشيخ</label>
                  <input required onInvalid={(e) => e.target.setCustomValidity('يرجى ملء هذا الحقل')} onInput={(e) => e.target.setCustomValidity('')} value={seriesForm.teacher} onChange={e => setSeriesForm({...seriesForm, teacher: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)]" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">التصنيف (الجديد يظهر تلقائياً)</label>
                  <input required onInvalid={(e) => e.target.setCustomValidity('يرجى ملء هذا الحقل')} onInput={(e) => e.target.setCustomValidity('')} placeholder="مثال: ديني، تاريخ..." value={seriesForm.category} onChange={e => setSeriesForm({...seriesForm, category: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)]" />
                </div>
                <button type="submit" className="w-full py-2 bg-[var(--accent)] text-white font-bold rounded-lg hover:bg-[var(--accent-hover)] transition">
                  {seriesForm.id ? "حفظ التعديل" : "إضافة السلسلة"}
                </button>
              </form>
            </motion.div>

            {/* Lesson Form */}
            <motion.div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold font-tajawal text-[var(--text-main)]">
                  {lessonForm.id ? "تعديل حلقة" : "إضافة حلقة"}
                </h2>
                {lessonForm.id && (
                  <button onClick={() => setLessonForm({ seriesId: lessonForm.seriesId, id: null, title: "", link: "" })} className="text-sm text-red-500 hover:underline">إلغاء</button>
                )}
              </div>
              <form onSubmit={handleSaveLesson} className="space-y-4 font-tajawal">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">اختر السلسلة</label>
                  <select required onInvalid={(e) => e.target.setCustomValidity('يرجى اختيار سلسلة')} onInput={(e) => e.target.setCustomValidity('')} value={lessonForm.seriesId} onChange={e => setLessonForm({...lessonForm, seriesId: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)]">
                    <option value="">-- اختر --</option>
                    {seriesList.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">عنوان الحلقة</label>
                  <input required onInvalid={(e) => e.target.setCustomValidity('يرجى ملء هذا الحقل')} onInput={(e) => e.target.setCustomValidity('')} value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-muted)] mb-1">الرابط</label>
                  <input required onInvalid={(e) => e.target.setCustomValidity('يرجى ملء هذا الحقل')} onInput={(e) => e.target.setCustomValidity('')} value={lessonForm.link} onChange={e => setLessonForm({...lessonForm, link: e.target.value})} className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)]" dir="ltr" />
                </div>
                <button type="submit" className="w-full py-2 bg-[var(--accent)] text-white font-bold rounded-lg hover:bg-[var(--accent-hover)] transition">
                  {lessonForm.id ? "حفظ التعديل" : "إضافة الحلقة"}
                </button>
              </form>
            </motion.div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl p-6 shadow-sm min-h-[600px]">
              <h2 className="text-2xl font-bold font-tajawal text-[var(--text-main)] mb-6">السلاسل الحالية</h2>
              
              <div className="space-y-4">
                {seriesList.map(series => (
                  <div key={series.id} className="border border-[var(--border-subtle)] rounded-xl overflow-hidden">
                    <div className="flex justify-between items-center p-4 bg-[var(--bg-main)]">
                      <div>
                        <h3 className="font-bold text-[var(--text-main)] font-tajawal">{series.title} <span className="text-xs text-[var(--text-muted)]">({series.category})</span></h3>
                        <p className="text-xs text-[var(--text-muted)]">{series.episodes?.length || 0} حلقة</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setExpandedSeries(expandedSeries === series.id ? null : series.id)}
                          className="px-3 py-1 bg-gray-500/10 text-gray-500 text-xs font-bold rounded-lg hover:bg-gray-500/20"
                        >
                          {expandedSeries === series.id ? "إخفاء" : "عرض الحلقات"}
                        </button>
                        <button 
                          onClick={() => {
                            setSeriesForm({ id: series.id, title: series.title, teacher: series.teacher, category: series.category || "ديني" });
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-bold rounded-lg hover:bg-blue-500/20"
                        >
                          تعديل
                        </button>
                        <button 
                          onClick={() => handleDeleteSeries(series.id)}
                          className="px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded-lg hover:bg-red-500/20"
                        >
                          حذف
                        </button>
                      </div>
                    </div>

                    {expandedSeries === series.id && (
                      <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-main)]/50">
                        {series.episodes?.length > 0 ? (
                          <Reorder.Group axis="y" values={series.episodes} onReorder={(newOrder) => handleReorderEpisodes(series.id, newOrder)} className="space-y-2">
                            {series.episodes.map(ep => (
                              <Reorder.Item key={ep.id} value={ep} className="flex justify-between items-center p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg cursor-grab active:cursor-grabbing">
                                <div className="flex items-center gap-3">
                                  <i className="fa-solid fa-grip-lines text-[var(--text-muted)] text-sm"></i>
                                  <p className="font-tajawal text-sm text-[var(--text-main)] truncate max-w-[200px]">{ep.title}</p>
                                </div>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => {
                                      setLessonForm({ seriesId: series.id, id: ep.id, title: ep.title, link: ep.link });
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg text-xs"
                                  >
                                    <i className="fa-solid fa-pen"></i>
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteLesson(series.id, ep.id)}
                                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg text-xs"
                                  >
                                    <i className="fa-solid fa-trash"></i>
                                  </button>
                                </div>
                              </Reorder.Item>
                            ))}
                          </Reorder.Group>
                        ) : (
                          <p className="text-center text-sm text-[var(--text-muted)] py-4">لا يوجد حلقات، أضف حلقة جديدة!</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;

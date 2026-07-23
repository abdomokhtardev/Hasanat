import { useData } from "../hooks/UseData.js";
import LessonCard from "../Components/LessonCard.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import EmptyState from "../Components/EmptyState.jsx";
import { LessonCardSkeleton } from "../Components/Skeleton.jsx";

const Lessons = () => {
  const { lessons, loading } = useData();
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

  // Dynamically extract unique categories from lessons
  const dynamicCategories = ["الكل", ...new Set(lessons.map(lesson => lesson.category || "أخرى"))];

  // Filter lessons based on category and search query
  const filteredLessons = lessons.filter(lesson => {
    const matchesCategory = selectedCategory === "الكل" ? true : lesson.category === selectedCategory;
    const matchesSearch = lesson.title?.includes(searchQuery) || lesson.teacher?.includes(searchQuery) || false;
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen pt-32 pb-20 bg-[var(--bg-main)]">
      <div className="max-w-6xl mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 border-b border-[var(--border-subtle)] pb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl text-[var(--text-main)] font-bold font-amiri mb-4">
            الدروس والسلاسل العلمية
          </h1>
          <p className="text-[var(--text-muted)] text-lg font-tajawal font-medium mb-8">
            مكتبة مرئية وصوتية للدروس في مختلف العلوم والمجالات
          </p>

          <div className="max-w-2xl mx-auto relative">
            <i className="fa-solid fa-search absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"></i>
            <input 
              type="text" 
              placeholder="ابحث عن سلسلة أو شيخ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:border-[var(--accent)] outline-none transition-colors shadow-sm font-tajawal"
            />
          </div>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {dynamicCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-bold font-tajawal transition-all duration-300 ${
                selectedCategory === cat 
                ? "bg-[var(--accent)] text-white shadow-md scale-105" 
                : "bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {loading ? (
            <>
              {Array.from({ length: 6 }, (_, i) => <LessonCardSkeleton key={i} />)}
            </>
          ) : (
            <AnimatePresence>
              {filteredLessons.length > 0 ? (
                filteredLessons.map((lesson) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={lesson.id}
                  >
                    <LessonCard lesson={lesson} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full w-full">
                  <EmptyState 
                    icon="fa-magnifying-glass"
                    title="لم يتم العثور على نتائج"
                    description="لا توجد دروس تطابق بحثك أو تصنيفك الحالي. حاول البحث بكلمات مختلفة أو تغيير التصنيف."
                  />
                </div>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </main>
  );
};

export default Lessons;

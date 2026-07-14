import { useData } from "../hooks/UseData.js";
import LessonCard from "../Components/LessonCard.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Lessons = () => {
  const { lessons, loading, Spinner } = useData();
  const [selectedCategory, setSelectedCategory] = useState("الكل");

  // Dynamically extract unique categories from lessons
  const dynamicCategories = ["الكل", ...new Set(lessons.map(lesson => lesson.category || "أخرى"))];

  // Filter lessons based on category
  const filteredLessons = lessons.filter(lesson => 
    selectedCategory === "الكل" ? true : lesson.category === selectedCategory
  );

  return (
    <main className="min-h-screen pt-32 pb-20 bg-[var(--bg-main)]">
      <div className="max-w-6xl mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 border-b border-[var(--gold-main)]/20 pb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl text-[var(--text-main)] font-bold font-amiri mb-4">
            الدروس والسلاسل العلمية
          </h1>
          <p className="text-[var(--text-muted)] text-lg font-tajawal font-medium">
            مكتبة مرئية وصوتية للدروس في مختلف العلوم والمجالات
          </p>
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

        {loading ? (
          <div className="flex justify-center items-center min-h-[40vh]">
            {Spinner()}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
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
                <div className="col-span-full py-12 text-center text-[var(--text-muted)] font-tajawal font-bold text-lg">
                  لا توجد سلاسل في هذا التصنيف حتى الآن.
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default Lessons;

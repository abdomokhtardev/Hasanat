import { useData } from "../hooks/UseData";
import { useAuth } from "../Context/AuthContext";
import LessonCard from "../Components/LessonCard";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import EmptyState from "../Components/EmptyState.jsx";
import { LessonCardSkeleton } from "../Components/Skeleton.jsx";

const Favorites = () => {
  const { lessons, loading: dataLoading } = useData();
  const { favorites, loading: authLoading } = useAuth();

  if (dataLoading || authLoading) {
    return (
      <main className="min-h-screen pt-32 pb-20 bg-[var(--bg-main)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-12 border-b border-[var(--border-subtle)] pb-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 text-3xl">
              <i className="fa-solid fa-heart"></i>
            </div>
            <h1 className="text-4xl md:text-5xl text-[var(--text-main)] font-bold font-amiri mb-4">
              المفضلة
            </h1>
            <p className="text-[var(--text-muted)] text-lg font-tajawal font-medium">
              السلاسل والدروس التي قمت بحفظها للرجوع إليها لاحقاً
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            <LessonCardSkeleton />
            <LessonCardSkeleton />
            <LessonCardSkeleton />
          </div>
        </div>
      </main>
    );
  }

  const favoriteLessons = lessons.filter(lesson => favorites.includes(lesson.id));

  return (
    <main className="min-h-screen pt-32 pb-20 bg-[var(--bg-main)]">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-b border-[var(--border-subtle)] pb-8 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 text-3xl">
            <i className="fa-solid fa-heart"></i>
          </div>
          <h1 className="text-4xl md:text-5xl text-[var(--text-main)] font-bold font-amiri mb-4">
            المفضلة
          </h1>
          <p className="text-[var(--text-muted)] text-lg font-tajawal font-medium">
            السلاسل والدروس التي قمت بحفظها للرجوع إليها لاحقاً
          </p>
        </motion.div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          <AnimatePresence>
            {favoriteLessons.length > 0 ? (
              favoriteLessons.map((lesson) => (
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
                  icon="fa-heart-crack"
                  title="لا توجد سلاسل في المفضلة"
                  description="قم بتصفح الدروس وأضف ما يعجبك إلى المفضلة للرجوع إليها لاحقاً."
                  buttonText="تصفح الدروس"
                  buttonPath="/lessons"
                />
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
};

export default Favorites;

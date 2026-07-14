import { useData } from "../hooks/UseData";
import { useAuth } from "../Context/AuthContext";
import LessonCard from "../Components/LessonCard";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Favorites = () => {
  const { lessons, loading: dataLoading } = useData();
  const { favorites, loading: authLoading } = useAuth();

  if (dataLoading || authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[var(--bg-main)]">
        <div className="w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const favoriteLessons = lessons.filter(lesson => favorites.includes(lesson.id));

  return (
    <main className="min-h-screen pt-32 pb-20 bg-[var(--bg-main)]">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-b border-[var(--gold-main)]/20 pb-8 text-center"
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
              <div className="col-span-full py-16 text-center">
                <i className="fa-regular fa-folder-open text-6xl text-[var(--text-muted)] opacity-50 mb-4"></i>
                <h3 className="text-2xl font-bold font-tajawal text-[var(--text-main)] mb-2">لا توجد سلاسل في المفضلة</h3>
                <p className="text-[var(--text-muted)] font-tajawal mb-6">قم بتصفح الدروس وأضف ما يعجبك إلى المفضلة</p>
                <Link to="/lessons">
                  <button className="px-6 py-2 bg-[var(--accent)] text-white font-bold rounded-lg hover:bg-[var(--accent-hover)] transition-colors">
                    تصفح الدروس
                  </button>
                </Link>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
};

export default Favorites;

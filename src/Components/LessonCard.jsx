import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const LessonCard = ({ lesson }) => {
  const { user, favorites, toggleFavorite } = useAuth();
  const navigate = useNavigate();

  const isFav = favorites.includes(lesson.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault(); // Prevent link navigation
    if (!user) {
      alert("يرجى تسجيل الدخول أولاً لإضافة الدروس إلى المفضلة.");
      navigate("/login");
      return;
    }
    toggleFavorite(lesson.id);
  };

  return (
    <li className="w-full max-w-[320px] list-none relative">
      {/* Favorite Button */}
      <button 
        onClick={handleFavoriteClick}
        className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl hover:scale-110 transition-transform shadow-sm"
      >
        <i className={`${isFav ? "fa-solid text-red-500" : "fa-regular text-[var(--text-muted)]"} fa-heart`}></i>
      </button>

      <Link to={`/lessons/series/${lesson.id}`} className="block w-full h-full">
        <div className="card-glass p-8 flex flex-col h-full group justify-between min-h-[280px]">

          {/* Top Decorative Area (Icon instead of image) */}
          <div className="flex justify-between items-start mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-500 shadow-sm">
              <i className="fa-solid fa-book-open text-2xl"></i>
            </div>
            <div className="pill-glass px-3 py-1 text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">
              سلسلة
            </div>
          </div>

          {/* Typography */}
          <div className="flex flex-col flex-grow text-right mt-auto">
            <h2 className="text-2xl font-bold text-[var(--text-main)] font-amiri mb-3 leading-tight group-hover:text-[var(--accent)] transition-colors duration-300">
              {lesson.title}
            </h2>

            <div className="flex items-center gap-2 mb-6">
              <i className="fa-solid fa-microphone-lines text-xs text-[var(--text-muted)]"></i>
              <p className="text-[var(--text-muted)] text-sm font-tajawal font-medium">
                {lesson.teacher}
              </p>
            </div>

            {/* Minimalist Button */}
            <div className="mt-auto w-full flex items-center gap-2 text-sm font-bold font-tajawal text-[var(--accent)] group-hover:text-[var(--accent-hover)] transition-colors">
              <span>استمع الآن</span>
              <i className="fa-solid fa-arrow-left text-[10px] rtl:-scale-x-100 transition-transform group-hover:-translate-x-1"></i>
            </div>
          </div>

        </div>
      </Link>
    </li>
  );
};

export default LessonCard;

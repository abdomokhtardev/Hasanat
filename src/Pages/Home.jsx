import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DailyChallenge from "../Components/DailyChallenge";

const Home = () => {
  const features = [
    {
      icon: "fa-solid fa-book-open",
      title: "الدروس العلمية",
      description: "استمع لسلاسل علمية ماتعة في العقيدة، السيرة، الفقه، وغيرها من العلوم الشرعية الميسرة.",
      path: "/lessons",
    },
    {
      icon: "fa-solid fa-hands-praying",
      title: "الأذكار اليومية",
      description: "حصن يومك بأذكار الصباح والمساء، وعدّاد بسيط لمساعدتك على المتابعة براحة وسكينة.",
      path: "/azkar",
    },
    {
      icon: "fa-solid fa-clock",
      title: "مواقيت الصلاة",
      description: "تابع مواقيت الصلاة اليومية لمدينتك بدقة، حتى لا تفوتك صلاة وتكون على تواصل دائم بربك.",
      path: "/salat",
    },
    {
      title: "العادات وتتبعها",
      description: "حافظ على عاداتك الإسلامية واليومية مع نظام تتبع متقدم وإحصائيات لضمان الاستمرارية",
      icon: "fa-solid fa-list-check",
      path: "/habits"
    }
  ];

  return (
    <main className="flex flex-col items-center px-4 pt-32 pb-20 min-h-screen bg-[var(--bg-main)]">
      {/* Calm Hero Section */}
      <section className="w-full max-w-5xl text-center py-16 md:py-24 border-b border-[var(--border-glass)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="w-16 h-16 mx-auto mb-8 bg-[var(--bg-card)] border border-[var(--border-glass)] rounded-full flex items-center justify-center text-[var(--accent)] shadow-sm">
            <i className="fa-solid fa-kaaba text-2xl"></i>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-amiri text-[var(--text-main)] leading-tight">
            موقع حسنات
          </h1>

          <p className="text-xl md:text-2xl text-[var(--text-muted)] leading-relaxed font-light mb-12 max-w-2xl mx-auto">
            طريقك نحو السكينة. نقدم لك دروساً نافعة، أذكاراً حصينة، ومواقيت دقيقة لتكون عوناً لك في يومك.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/lessons">
              <button className="w-full sm:w-auto px-8 py-3 rounded-md bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors">
                استمع للدروس
              </button>
            </Link>
            <Link to="/azkar">
              <button className="w-full sm:w-auto px-8 py-3 rounded-md bg-[var(--bg-card)] text-[var(--text-main)] font-medium border border-[var(--border-glass)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                أذكار اليوم
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Daily Challenge Section */}
      <section className="w-full max-w-2xl mt-12">
        <DailyChallenge />
      </section>

      {/* Elegant Features Section */}
      <section className="w-full max-w-5xl mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link to={feature.path} key={index}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="h-full card-glass p-8 flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[var(--accent-light)] flex items-center justify-center mb-6 text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-400 shadow-sm">
                  <i className={`${feature.icon} text-2xl`}></i>
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-main)] mb-3 font-amiri">
                  {feature.title}
                </h3>
                <p className="text-[var(--text-muted)] leading-relaxed text-sm font-tajawal">
                  {feature.description}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;

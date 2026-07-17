import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../Context/AuthContext";

const Nav = () => {
  const navLinks = [
    { path: "/", label: "الرئيسية" },
    { path: "/salat", label: "مواقيت الصلاة" },
    { path: "/lessons", label: "الدروس" },
    { path: "/azkar", label: "الأذكار" },
    { path: "/habits", label: "العادات" },
  ];

  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAdmin, logout } = useAuth();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-subtle)] rounded-full shadow-[var(--shadow-float)] transition-colors duration-400">
        <div className="px-6 py-3 flex justify-between items-center">

          {/* Brand */}
          <Link
            to="/"
            className="text-xl font-bold font-amiri text-[var(--text-main)] hover:text-[var(--accent)] transition-colors"
          >
            حسنات
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.path ||
                (link.path !== "/" && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={index}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-300 ${isActive ? "text-[var(--accent)] font-bold" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex gap-4 items-center">
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="hidden md:flex text-sm font-bold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors" title="لوحة التحكم" aria-label="لوحة التحكم">
                    <i className="fa-solid fa-gauge-high"></i>
                  </Link>
                )}
                <Link to="/favorites" className="text-[var(--text-muted)] hover:text-red-500 transition-colors" title="المفضلة" aria-label="المفضلة">
                  <i className="fa-solid fa-heart"></i>
                </Link>
                <Link to="/profile" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors" title="حسابي" aria-label="حسابي">
                  <i className="fa-solid fa-user"></i>
                </Link>
                <button onClick={logout} className="hidden md:flex text-sm font-bold text-red-500 hover:text-red-600 transition-colors">
                  خروج
                </button>
              </>
            ) : (
              <Link to="/login" className="hidden md:flex text-sm font-bold text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
                تسجيل الدخول
              </Link>
            )}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--accent)] border border-[var(--border-subtle)] transition-colors"
              title={theme === "light" ? "الوضع الليلي" : "الوضع النهاري"}
              aria-label={theme === "light" ? "تفعيل الوضع الليلي" : "تفعيل الوضع النهاري"}
            >
              {theme === "light" ? (
                <i className="fa-solid fa-moon text-xs"></i>
              ) : (
                <i className="fa-solid fa-sun text-xs"></i>
              )}
            </button>

            {/* Mobile Toggle */}
            <button onClick={toggleMobileMenu} className="md:hidden text-[var(--text-main)]" aria-label="فتح قائمة التنقل">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 mt-4 w-full bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-subtle)] rounded-2xl p-4 flex flex-col gap-4 shadow-lg">
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.path ||
                (link.path !== "/" && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={index}
                  to={link.path}
                  className={`text-center py-2 ${isActive ? "text-[var(--accent)] font-bold" : "text-[var(--text-main)]"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            
            <hr className="border-[var(--border-subtle)]" />
            
            {isAdmin && (
              <Link 
                to="/admin" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center py-2 text-[var(--accent)] font-bold"
              >
                لوحة التحكم
              </Link>
            )}

            {user ? (
              <button 
                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                className="w-full py-2 bg-red-500/10 text-red-500 font-bold rounded-lg"
              >
                تسجيل الخروج
              </button>
            ) : (
              <Link 
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center py-2 bg-[var(--accent)]/10 text-[var(--accent)] font-bold rounded-lg"
              >
                تسجيل الدخول
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;

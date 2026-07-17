import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("فشل تسجيل الدخول، تأكد من الإيميل وكلمة المرور.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      setError("فشل تسجيل الدخول بواسطة جوجل.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 bg-[var(--bg-main)] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-xl p-8 mx-4"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-amiri text-[var(--text-main)] mb-2">تسجيل الدخول</h1>
          <p className="text-[var(--text-muted)] font-tajawal">مرحباً بك مجدداً في حسنات</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm font-tajawal p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 font-tajawal">
          <div>
            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">البريد الإلكتروني</label>
            <input 
              type="email" 
              required 
              onInvalid={(e) => e.target.setCustomValidity('يرجى كتابة البريد الإلكتروني')}
              onInput={(e) => e.target.setCustomValidity('')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              dir="ltr"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">كلمة المرور</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                onInvalid={(e) => e.target.setCustomValidity('يرجى كتابة كلمة المرور')}
                onInput={(e) => e.target.setCustomValidity('')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent)] transition-colors pr-12"
                dir="ltr"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
              >
                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
          </div>
          <motion.button 
            type="submit" 
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-hover)] transition-colors shadow-md flex items-center justify-center"
          >
            {loading ? "جاري الدخول..." : "تسجيل الدخول"}
          </motion.button>
        </form>

        <div className="mt-6 font-tajawal">
          <div className="relative flex items-center justify-center mb-6">
            <span className="absolute inset-x-0 h-px bg-[var(--border-subtle)]"></span>
            <span className="relative bg-[var(--bg-card)] px-4 text-sm text-[var(--text-muted)]">أو</span>
          </div>
          
          <motion.button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mb-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm flex items-center justify-center gap-3"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            <span>تسجيل الدخول بواسطة Google</span>
          </motion.button>

          <p className="text-center text-[var(--text-muted)] text-sm">
            ليس لديك حساب؟ {" "}
            <Link to="/register" className="text-[var(--accent)] font-bold hover:underline">
              سجل الآن
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default Login;

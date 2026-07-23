import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { motion } from "framer-motion";
import { cardCls, inputCls, submitBtnCls, PasswordInput, OrDivider, GoogleButton, ErrorBanner } from "../Components/ui/AuthFormShared";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const withAuth = (fn) => async () => {
    setError("");
    setLoading(true);
    try {
      await fn();
      navigate("/");
    } catch {
      setError("فشل إنشاء الحساب، قد يكون الإيميل مستخدماً أو كلمة المرور ضعيفة.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("كلمات المرور غير متطابقة!");
    withAuth(() => register(email, password))();
  };

  return (
    <main className="min-h-screen pt-32 pb-20 bg-[var(--bg-main)] flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={cardCls}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-amiri text-[var(--text-main)] mb-2">إنشاء حساب</h1>
          <p className="text-[var(--text-muted)] font-tajawal">انضم إلينا لحفظ عاداتك وتقدمك</p>
        </div>

        <ErrorBanner message={error} />

        <form onSubmit={handleSubmit} className="space-y-5 font-tajawal">
          <div>
            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onInvalid={(e) => e.target.setCustomValidity("يرجى كتابة البريد الإلكتروني")}
              onInput={(e) => e.target.setCustomValidity("")}
              className={`${inputCls} px-4`}
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">كلمة المرور</label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              show={showPassword}
              onToggle={() => setShowPassword((p) => !p)}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--text-main)] mb-2">تأكيد كلمة المرور</label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              show={showPassword}
              onToggle={() => setShowPassword((p) => !p)}
              validationMsg="يرجى تأكيد كلمة المرور"
              autoComplete="new-password"
            />
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={submitBtnCls}
          >
            {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
          </motion.button>
        </form>

        <div className="mt-2 font-tajawal">
          <OrDivider />
          <GoogleButton onClick={withAuth(loginWithGoogle)} disabled={loading} label="التسجيل بواسطة Google" />
          <p className="text-center text-[var(--text-muted)] text-sm">
            لديك حساب بالفعل؟{" "}
            <Link to="/login" className="text-[var(--accent)] font-bold hover:underline">تسجيل الدخول</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default Register;

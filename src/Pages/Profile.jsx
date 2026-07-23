import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { motion } from "framer-motion";

const Profile = () => {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      return setMessage({ text: "كلمات المرور الجديدة غير متطابقة!", type: "error" });
    }

    if (newPassword.length < 6) {
      return setMessage({ text: "كلمة المرور يجب أن تكون 6 أحرف على الأقل.", type: "error" });
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Re-authenticate user first (required by Firebase before changing password)
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      setMessage({ text: "تم تغيير كلمة المرور بنجاح! 🔒", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

    } catch (err) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        setMessage({ text: "كلمة المرور الحالية غير صحيحة.", type: "error" });
      } else {
        setMessage({ text: "حدث خطأ أثناء تغيير كلمة المرور.", type: "error" });
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 bg-[var(--bg-main)]">
      <div className="max-w-3xl mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-8 shadow-sm mb-8 flex items-center gap-6"
        >
          <div className="w-20 h-20 bg-[var(--accent)]/10 rounded-full border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] text-3xl">
            <i className="fa-solid fa-user"></i>
          </div>
          <div>
            <h1 className="text-3xl font-bold font-tajawal text-[var(--text-main)] mb-1">حسابي</h1>
            <p className="text-[var(--text-muted)] font-tajawal" dir="ltr">{user?.email}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-8 shadow-sm"
        >
          <h2 className="text-2xl font-bold font-tajawal text-[var(--text-main)] mb-6 border-b border-[var(--border-subtle)] pb-4">
            تغيير كلمة المرور
          </h2>

          {message.text && (
            <div className={`p-4 rounded-xl mb-6 text-center font-bold font-tajawal ${message.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-5 font-tajawal max-w-lg mx-auto">
            <div className="relative">
              <label className="block text-sm font-bold text-[var(--text-main)] mb-2">كلمة المرور الحالية</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  onInvalid={(e) => e.target.setCustomValidity('يرجى كتابة كلمة المرور الحالية')}
                  onInput={(e) => e.target.setCustomValidity('')}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent)] transition-colors pr-12"
                  dir="ltr"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-bold text-[var(--text-main)] mb-2">كلمة المرور الجديدة</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                onInvalid={(e) => e.target.setCustomValidity('يرجى كتابة كلمة المرور الجديدة')}
                onInput={(e) => e.target.setCustomValidity('')}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent)] transition-colors pr-12"
                dir="ltr"
                autoComplete="new-password"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-bold text-[var(--text-main)] mb-2">تأكيد كلمة المرور الجديدة</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                onInvalid={(e) => e.target.setCustomValidity('يرجى تأكيد كلمة المرور')}
                onInput={(e) => e.target.setCustomValidity('')}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent)] transition-colors pr-12"
                dir="ltr"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-4 text-white font-bold rounded-xl transition-all ${loading ? 'bg-[var(--accent)]/50 cursor-not-allowed' : 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] shadow-md'}`}
            >
              {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
            </button>
          </form>
        </motion.div>

      </div>
    </main>
  );
};

export default Profile;

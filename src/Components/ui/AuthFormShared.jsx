// Shared UI atoms for auth pages (Login & Register)
// Centralises repeated class strings and tiny presentational patterns

export const cardCls =
  "w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-xl p-8 mx-4";

export const inputCls =
  "w-full px-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-subtle)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent)] transition-colors";

export const submitBtnCls =
  "w-full py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-hover)] transition-colors shadow-md flex items-center justify-center";

/** Password input with show/hide toggle */
export const PasswordInput = ({ value, onChange, show, onToggle, placeholder, validationMsg, autoComplete }) => (
  <div className="relative">
    <input
      type={show ? "text" : "password"}
      required
      value={value}
      onChange={onChange}
      onInvalid={(e) => e.target.setCustomValidity(validationMsg || "يرجى كتابة كلمة المرور")}
      onInput={(e) => e.target.setCustomValidity("")}
      autoComplete={autoComplete}
      placeholder={placeholder}
      className={`${inputCls} pr-12`}
      dir="ltr"
    />
    <button
      type="button"
      onClick={onToggle}
      className="absolute inset-y-0 right-4 flex items-center text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
    >
      <i className={`fa-solid ${show ? "fa-eye-slash" : "fa-eye"}`}></i>
    </button>
  </div>
);

/** "أو" divider */
export const OrDivider = () => (
  <div className="relative flex items-center justify-center my-6">
    <span className="absolute inset-x-0 h-px bg-[var(--border-subtle)]"></span>
    <span className="relative bg-[var(--bg-card)] px-4 text-sm text-[var(--text-muted)]">أو</span>
  </div>
);

/** Google sign-in/up button */
export const GoogleButton = ({ onClick, disabled, label = "المتابعة بواسطة Google" }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="w-full mb-4 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm flex items-center justify-center gap-3"
  >
    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
    <span>{label}</span>
  </button>
);

/** Error / feedback banner */
export const ErrorBanner = ({ message }) =>
  message ? (
    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm font-tajawal p-3 rounded-lg mb-6 text-center">
      {message}
    </div>
  ) : null;

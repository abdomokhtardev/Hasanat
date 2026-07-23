import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const EmptyState = ({ icon = "fa-folder-open", title, description, buttonText, buttonPath, onButtonClick }) => {
  const btnCls = "px-8 py-3 bg-[var(--accent)] text-white font-bold font-tajawal rounded-full hover:bg-[var(--accent-hover)] hover:-translate-y-1 transition-all shadow-md shadow-[var(--accent)]/20";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center w-full"
    >
      <div className="w-24 h-24 bg-[var(--bg-card)] rounded-full flex items-center justify-center shadow-sm border border-[var(--border-subtle)] mb-6 text-[var(--accent)]">
        <i className={`fa-solid ${icon} text-4xl opacity-80`}></i>
      </div>
      <h3 className="text-2xl font-bold font-amiri text-[var(--text-main)] mb-3">{title}</h3>
      <p className="text-[var(--text-muted)] font-tajawal max-w-md mb-8 leading-relaxed">{description}</p>
      {buttonText && (buttonPath || onButtonClick) && (
        buttonPath
          ? <Link to={buttonPath} className={btnCls}>{buttonText}</Link>
          : <button onClick={onButtonClick} className={btnCls}>{buttonText}</button>
      )}
    </motion.div>
  );
};

export default EmptyState;

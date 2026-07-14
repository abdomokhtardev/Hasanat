const CountZkr = ({ choice, setCounter, index, isCompleted, currentCount, req }) => {
  const incrementCount = () => {
    if (isCompleted) return;
    const key = choice === "masaa" ? "countEvening" : "countMorning";
    setCounter((prev) => {
      const newArr = [...prev];
      if (!newArr[index]) {
        newArr[index] = { countMorning: 0, countEvening: 0 };
      }

      newArr[index] = {
        ...newArr[index],
        [key]: Math.min(newArr[index][key] + 1, req)
      };
      return newArr;
    });
  };

  const resetCount = (e) => {
    e.stopPropagation();
    const key = choice === "masaa" ? "countEvening" : "countMorning";
    setCounter((prev) => {
      const newArr = [...prev];
      if (newArr[index]) {
        newArr[index] = {
          ...newArr[index],
          [key]: 0
        };
      }
      return newArr;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <button
        onClick={incrementCount}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${isCompleted
            ? "bg-[var(--accent)] border-[var(--accent)] text-[var(--gold-main)] shadow-md"
            : "bg-[var(--bg-card)] text-[var(--text-main)] border-[var(--gold-main)]/50 hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-[var(--gold-main)] shadow-sm"
          }`}
      >
        {isCompleted ? (
          <i className="fa-solid fa-check text-xl"></i>
        ) : (
          <span className="text-xl font-bold font-tajawal">{currentCount}</span>
        )}
      </button>

      {!isCompleted && (
        <span className="text-xs text-[var(--text-muted)] font-medium font-tajawal">من {req}</span>
      )}

      {currentCount > 0 && !isCompleted && (
        <button
          onClick={resetCount}
          className="text-[10px] text-[var(--text-muted)] hover:text-[var(--gold-main)] transition-colors mt-1 underline underline-offset-2"
        >
          تصفير
        </button>
      )}
    </div>
  );
};

export default CountZkr;

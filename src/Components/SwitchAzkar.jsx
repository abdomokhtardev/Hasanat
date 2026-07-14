const SwitchAzkar = ({ setChoice, choice }) => {
  const ButtonInfo = [
    { label: "أذكار الصباح", value: "sabah" },
    { label: "أذكار المساء", value: "masaa" },
  ];
  
  return (
    <div className="flex gap-4 border-b border-[var(--border-glass)] pb-4 w-full max-w-sm mx-auto justify-center">
      {ButtonInfo.map((button) => {
        const isActive = choice === button.value;
        return (
          <button
            key={button.value}
            onClick={() => setChoice(button.value)}
            className={`px-6 py-2 text-lg font-tajawal transition-colors duration-300 relative ${
              isActive ? "text-[var(--text-main)] font-bold" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
            }`}
          >
            {button.label}
            {isActive && (
              <div className="absolute -bottom-4 left-0 w-full h-[2px] bg-[var(--accent)]"></div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SwitchAzkar;

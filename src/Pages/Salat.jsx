import { useEffect, useState } from "react";

const Salat = () => {
  const [city, setCity] = useState("القاهرة");
  const [displayCity, setDisplayCity] = useState("القاهرة");
  const [searchInput, setSearchInput] = useState("");
  const [date, setDate] = useState({ hijri: "", readable: "" });
  const [timings, setTimings] = useState({});
  const [nextPrayer, setNextPrayer] = useState(null);
  const [error, setError] = useState("");

  const prayerData = [
    { id: "Fajr", name: "الفجر" },
    { id: "Dhuhr", name: "الظهر" },
    { id: "Asr", name: "العصر" },
    { id: "Maghrib", name: "المغرب" },
    { id: "Isha", name: "العشاء" },
  ];

  const convertTo12Hour = (time24) => {
    if (!time24) return "";
    const [hour, minute] = time24.split(":").map(Number);
    const period = hour >= 12 ? "م" : "ص";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`https://api.aladhan.com/v1/timingsByAddress?address=${city}&method=5`);
        const data = await res.json();

        if (data.code !== 200 || !data.data || !data.data.timings) {
          setError("لم يتم العثور على المدينة، تأكد من الاسم");
          return;
        }

        setError("");
        setDisplayCity(city);
        const { Fajr, Dhuhr, Asr, Maghrib, Isha } = data.data.timings;
        setTimings({ Fajr, Dhuhr, Asr, Maghrib, Isha });
        setDate({
          hijri: data.data.date.hijri.date,
          readable: data.data.date.readable
        });

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const prayers = [
          { id: "Fajr", time: Fajr },
          { id: "Dhuhr", time: Dhuhr },
          { id: "Asr", time: Asr },
          { id: "Maghrib", time: Maghrib },
          { id: "Isha", time: Isha }
        ];

        let next = prayers[0];
        for (let p of prayers) {
          if (!p.time) continue;
          const [h, m] = p.time.split(":").map(Number);
          const pMins = h * 60 + m;
          if (pMins > currentMinutes) {
            next = p;
            break;
          }
        }
        setNextPrayer(next?.id || "Fajr");

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("حدث خطأ أثناء الاتصال بالخادم");
      }
    }
    fetchData();
  }, [city]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput);
      setSearchInput("");
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-24 bg-[var(--bg-main)]">
      <div className="w-full max-w-5xl mx-auto px-4 flex flex-col">

        <div className="mb-12 border-b border-[var(--border-subtle)] pb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-amiri text-[var(--text-main)] mb-4 border-r-4 border-[var(--accent)] pr-6">
            مواقيت الصلاة
          </h1>
          <p className="text-[var(--text-muted)] font-tajawal text-lg font-medium pr-6">إن الصلاة كانت على المؤمنين كتاباً موقوتاً</p>
        </div>

        <div className="card-soft p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-right">
            <h2 className="text-3xl font-bold text-[var(--accent)] font-amiri mb-3">{displayCity.toUpperCase()}</h2>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-[var(--text-muted)] font-medium text-sm font-tajawal">
              <span>{date.hijri}</span>
              <span className="hidden sm:inline-block w-1 h-1 bg-[var(--text-muted)] rounded-full"></span>
              <span dir="ltr">{date.readable}</span>
            </div>
          </div>

          <form onSubmit={handleSearch} className="w-full md:w-auto flex">
            <input
              type="text"
              placeholder="ابحث عن مدينة أخرى..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full md:w-64 px-4 py-3 bg-[var(--bg-main)] border border-[var(--border-subtle)] outline-none focus:border-[var(--accent)] transition-colors text-[var(--text-main)] font-tajawal rounded-r-xl"
            />
            <button type="submit" className="px-6 py-3 bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors font-tajawal rounded-l-xl">
              بحث
            </button>
          </form>
        </div>

        {error && (
          <div className="w-full text-center p-6 mb-12 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl font-tajawal font-bold text-lg">
            {error}
          </div>
        )}

        {Object.keys(timings).length > 0 && (
          <div className="w-full grid grid-cols-2 md:grid-cols-5 gap-4">
            {prayerData.map((prayer) => {
              const time = timings[prayer.id];
              const isNext = nextPrayer === prayer.id;

              return (
                <div
                  key={prayer.id}
                  className={`relative flex flex-col items-center justify-center p-6 card-glass transition-all border ${isNext
                    ? "bg-[var(--accent-light)] border-[var(--accent)]"
                    : "border-[var(--border-subtle)]"
                    }`}
                >
                  {isNext && (
                    <div className="absolute -top-3 bg-[var(--accent)] text-white px-3 py-1 rounded-full text-xs font-tajawal font-bold tracking-wide">
                      القادمة
                    </div>
                  )}

                  <h3 className={`text-xl font-amiri mb-3 ${isNext ? "text-[var(--accent)] font-bold" : "text-[var(--text-muted)]"}`}>
                    {prayer.name}
                  </h3>
                  <div className={`text-2xl font-tajawal ${isNext ? "text-[var(--text-main)] font-bold" : "text-[var(--text-main)]"}`}>
                    {time ? convertTo12Hour(time) : "--:--"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default Salat;

import { useEffect, useState, createContext, memo } from "react";

// Import JSON directly to avoid fetch path errors
import localData from "../../public/data.json";

export const DataContext = createContext();



const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-40">
      <div className="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
      <p className="font-medium font-tajawal mt-3 text-[var(--text-muted)]">لحظة، نستدعي البيانات...</p>
    </div>
  );
};
const DataProvider = ({ children }) => {
  const [lessons, setLessons] = useState(() => {
    return JSON.parse(localStorage.getItem("hasanat_lessons")) || [];
  });
  const [azkar, setAzkar] = useState(localData.azkar || []);
  const [loading, setLoading] = useState(lessons.length === 0);

  useEffect(() => {
    async function fetchData() {
      try {
        const { collection, getDocs } = await import("firebase/firestore");
        const { db } = await import("../firebase");

        const querySnapshot = await getDocs(collection(db, "series"));
        const firestoreLessons = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setLessons(firestoreLessons);
        localStorage.setItem("hasanat_lessons", JSON.stringify(firestoreLessons));
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ lessons, azkar, loading, Spinner }}>
      {children}
    </DataContext.Provider>
  );
};

export default memo(DataProvider);

/* eslint-disable no-unused-vars */
import { useEffect, useState, createContext, useContext, memo } from "react";

// Import JSON directly to avoid fetch path errors
import localData from "../../public/data.json";

export const DataContext = createContext();

const initialVal = localStorage.getItem("data")
  ? JSON.parse(localStorage.getItem("data"))
  : [];

const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-40">
      <div className="w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-medium ">دقيقه نستدعي البيانات</p>
    </div>
  );
};
const DataProvider = ({ children }) => {
  const [lessons, setLessons] = useState([]);
  const [azkar, setAzkar] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check Updeate LocalStorage And Set Data In States

  useEffect(() => {
    const localAzkar = JSON.parse(localStorage.getItem("hasanat_azkar")) || null;
    const localLessons = JSON.parse(localStorage.getItem("hasanat_lessons")) || null;

    if (localAzkar) setAzkar(localAzkar);
    if (localLessons) setLessons(localLessons);

    async function fetchData() {
      try {
        // Load Azkar from local JSON directly
        setAzkar(localData.azkar || []);
        localStorage.setItem("hasanat_azkar", JSON.stringify(localData.azkar || []));
        
        // Fetch Lessons from Firestore
        const { collection, getDocs } = await import("firebase/firestore");
        const { db } = await import("../firebase");
        
        const querySnapshot = await getDocs(collection(db, "series"));
        const firestoreLessons = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setLessons(firestoreLessons);
        localStorage.setItem("hasanat_lessons", JSON.stringify(firestoreLessons));
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
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

// export function useData() {
//   return useContext(DataContext);
// }

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Register User
  const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Login User
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Login with Google
  const loginWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Logout User
  const logout = () => {
    return signOut(auth);
  };

  // Toggle Favorite Series
  const toggleFavorite = async (seriesId) => {
    if (!user) return;
    const isFav = favorites.includes(seriesId);

    // Optimistic UI Update
    setFavorites(prev => isFav ? prev.filter(id => id !== seriesId) : [...prev, seriesId]);

    const userRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userRef, {
        favorites: isFav ? arrayRemove(seriesId) : arrayUnion(seriesId)
      });
    } catch (err) {
      if (err.code === "not-found") {
        await setDoc(userRef, { favorites: [seriesId] }, { merge: true });
      } else {
        console.error("Error updating favorites", err);
        // Revert on error
        setFavorites(prev => isFav ? [...prev, seriesId] : prev.filter(id => id !== seriesId));
      }
    }
  };

  // Check Admin Role
  const isAdmin = user && user.email === "abdomokhtardev@gmail.com";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setFavorites(userDoc.data().favorites || []);
          } else {
            setFavorites([]);
          }
        } catch (err) {
          console.error("Error fetching user data", err);
        }
      } else {
        setFavorites([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, register, login, loginWithGoogle, logout, isAdmin, loading, favorites, toggleFavorite }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

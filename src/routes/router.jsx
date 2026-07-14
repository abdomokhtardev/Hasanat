// import { createBrowserRouter } from "react-router-dom";
import { createHashRouter } from "react-router-dom";
import Layout from "../Layout/Layout.jsx";
import Home from "../Pages/Home.jsx";
import Lessons from "../Pages/Lessons.jsx";
import Series from "../Pages/Series.jsx";
import Azkar from "../Pages/Azkar.jsx";
import Salat from "../Pages/Salat.jsx";
import Habits from "../Pages/Habits.jsx";
import Login from "../Pages/Login.jsx";
import Register from "../Pages/Register.jsx";
import AdminDashboard from "../Pages/AdminDashboard.jsx";
import Profile from "../Pages/Profile.jsx";
import Favorites from "../Pages/Favorites.jsx";
import ProtectedRoute from "../Components/ProtectedRoute.jsx";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "lessons", element: <Lessons /> },
      { path: "salat", element: <Salat /> },
      { path: "habits", element: <Habits /> },
      { path: "azkar", element: <Azkar /> },
      { path: "lessons/series/:seriesId", element: <Series /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { 
        path: "admin", 
        element: (
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "profile", 
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "favorites", 
        element: (
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        ) 
      },
    ],
  },
]);

export default router;

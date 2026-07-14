import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout/Layout.jsx";
import ProtectedRoute from "../Components/ProtectedRoute.jsx";

const Home = lazy(() => import("../Pages/Home.jsx"));
const Lessons = lazy(() => import("../Pages/Lessons.jsx"));
const Series = lazy(() => import("../Pages/Series.jsx"));
const Azkar = lazy(() => import("../Pages/Azkar.jsx"));
const Salat = lazy(() => import("../Pages/Salat.jsx"));
const Habits = lazy(() => import("../Pages/Habits.jsx"));
const Login = lazy(() => import("../Pages/Login.jsx"));
const Register = lazy(() => import("../Pages/Register.jsx"));
const AdminDashboard = lazy(() => import("../Pages/AdminDashboard.jsx"));
const Profile = lazy(() => import("../Pages/Profile.jsx"));
const Favorites = lazy(() => import("../Pages/Favorites.jsx"));

const router = createBrowserRouter([
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
      }
    ],
  },
]);

export default router;

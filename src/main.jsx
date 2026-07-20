import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router.jsx";
import DataProvider from "./Context/DataProvider.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { ToastProvider } from "./Context/ToastContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <RouterProvider router={router} />
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  </StrictMode>
);

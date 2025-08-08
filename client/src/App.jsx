import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import RouteWrapper from "./pages/RouteWrapper";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import DesignEditor from "./pages/DesignEditor";

function App() {
  const location = useLocation();
 // const isAdminRoute = location.pathname.startsWith("/admin");
  const user = useSelector((state) => state.user.user);
  //const admin = useSelector((state) => state.admin.currentAdmin);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);  //Jab bhi path change hoga URL ka tab Jo bhi page khulega uske top pe 
                           // chala jayega automatically bcz react doesn't provide this by default

  return (
    <>
      {/* <div className="min-h-screen px-4 py-6"> */}
        <Routes>
          {/* Public routes (no sidebar) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Home />} />
          
          <Route element={<RouteWrapper requireAuth={true} isAdmin={false} />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard/>} />
              <Route path="/editor" element={<DesignEditor />} />
              <Route path="/editor/:id" element={<DesignEditor />} />
            </Route>
          </Route>
         
          {/* Fallback for unknown paths */}
          <Route path="*" element={<Navigate to="/" />} /> 
        </Routes>
      {/* </div> */}
      {/* <Footer />  */}
    </>
  )
}

export default App

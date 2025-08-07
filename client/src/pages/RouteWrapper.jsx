import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
//import useAdminAuth from '../hooks/useAdminAuth.js';

export default function RouteWrapper({ requireAuth, isAdmin = false }) {
  const location = useLocation();
  const { isLoggedIn: isUserLoggedIn } = useAuth();
  //const { isLoggedIn: isAdminLoggedIn } = useAdminAuth();  

  if (requireAuth) {
   // if (isAdmin && !isAdminLoggedIn) return <Navigate to="/admin/login" state={{ from: location }} replace />;
   if (!isAdmin && !isUserLoggedIn) return <Navigate to="/login" state={{ from: location }} replace />;
  }
 
  return <Outlet />; 
}

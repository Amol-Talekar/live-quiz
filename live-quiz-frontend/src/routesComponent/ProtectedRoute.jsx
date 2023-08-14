import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { token } = useSelector((state) => state.auth);
  //console.log("token in protectedRoute ", token);

  const currentToken = token || localStorage.getItem("livequizAuthToken");

  return currentToken ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;

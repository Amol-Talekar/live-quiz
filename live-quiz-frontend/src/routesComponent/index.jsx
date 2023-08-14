import React from "react";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import Login from "../components/Login/Login";
import Lobby from "../components/Lobby/Lobby";
import NoRouteFound from "./NoRouteFound";
import Room from "../components/Room/Room";

const RoutesComponent = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route exact path="/lobby" element={<Lobby />} />
        <Route exact path="/room/:roomId" element={<Room />} />
      </Route>

      <Route path="*" element={<NoRouteFound />} />
    </Routes>
  );
};

export default RoutesComponent;

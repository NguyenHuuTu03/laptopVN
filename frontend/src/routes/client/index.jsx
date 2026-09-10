import { Routes, Route } from "react-router-dom";

import ClientLayout from "../../layouts/client/ClientLayout";
import Home from "../../pages/client/Home/Home";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;

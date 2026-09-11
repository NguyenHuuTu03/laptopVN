import { Routes, Route } from "react-router-dom";

import ClientLayout from "../../layouts/client/ClientLayout";
import Home from "../../pages/client/Home/Home";
import ProductList from "../../pages/client/Products/ProductList/ProductList";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/collections/:slug" element={<ProductList />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;

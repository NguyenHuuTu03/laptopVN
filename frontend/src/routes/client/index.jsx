import { Routes, Route } from "react-router-dom";

import ClientLayout from "../../layouts/client/ClientLayout";
import Home from "../../pages/client/Home/Home";
import ProductList from "../../pages/client/Products/ProductList/ProductList";
import Login from "../../pages/client/Users/Login/Login";
import Register from "../../pages/client/Users/Register/Register";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/collections/:slug" element={<ProductList />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/users">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;

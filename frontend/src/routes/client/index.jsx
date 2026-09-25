import { Routes, Route } from "react-router-dom";

import ClientLayout from "../../layouts/client/ClientLayout";
import Home from "../../pages/client/Home/Home";
import ProductList from "../../pages/client/Products/ProductList/ProductList";
import Login from "../../pages/client/Users/Login/Login";
import Register from "../../pages/client/Users/Register/Register";
import ProductDetail from "../../pages/client/Products/ProductDetail/ProductDetail";
import Cart from "../../pages/client/Cart/Cart";
import Checkout from "../../pages/client/Checkout/Checkout";
import PaymentResult from "../../pages/client/PaymentResult/PaymentResult";
import OrderDetail from "../../pages/client/Orders/OrderDetail/OrderDetail";
import MyOrder from "../../pages/client/Orders/MyOrders/MyOrders";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/collections/:slug" element={<ProductList />} />
        <Route path="/products">
          <Route path="" element={<ProductList />} />
          <Route path=":slugProduct" element={<ProductDetail />} />
        </Route>
        <Route path="/users">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/checkout" element={<Checkout />}></Route>
        <Route path="/orders">
          <Route path="success/:orderCode" element={<PaymentResult />}></Route>
          <Route
            path="payment-result/:orderCode"
            element={<PaymentResult />}
          ></Route>
          <Route path=":orderCode" element={<OrderDetail />}></Route>
          <Route path="" element={<MyOrder />}></Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;

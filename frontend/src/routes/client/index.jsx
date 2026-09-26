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
import Profile from "../../pages/client/Users/Profile/Profile";
import ForgotPassword from "../../pages/client/Users/ForgotPassword/ForgotPassword";
import VerifyOTP from "../../pages/client/Users/VerifyOTP/VerifyOTP";
import ResetPassword from "../../pages/client/Users/ResetPassword/ResetPassword";

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
          <Route path="" element={<Profile />}></Route>
        </Route>
        <Route path="users">
          <Route path="profile" element={<Profile />}></Route>
          <Route path="change-password" element={<Profile />}></Route>
          <Route path="forgot-password" element={<ForgotPassword />}></Route>
          <Route path="verify-otp" element={<VerifyOTP />}></Route>
          <Route path="reset-password" element={<ResetPassword />}></Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;

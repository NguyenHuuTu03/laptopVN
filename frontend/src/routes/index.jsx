import ClientLayout from "../layouts/client/ClientLayout";
import Cart from "../pages/client/Cart/Cart";
import Checkout from "../pages/client/Checkout/Checkout";
import Home from "../pages/client/Home/Home";
import OrderDetail from "../pages/client/Orders/OrderDetail/OrderDetail";
import PaymentResult from "../pages/client/PaymentResult/PaymentResult";
import ProductDetail from "../pages/client/Products/ProductDetail/ProductDetail";
import ProductList from "../pages/client/Products/ProductList/ProductList";
import ForgotPassword from "../pages/client/Users/ForgotPassword/ForgotPassword";
import Login from "../pages/client/Users/Login/Login";
import Profile from "../pages/client/Users/Profile/Profile";
import Register from "../pages/client/Users/Register/Register";
import ResetPassword from "../pages/client/Users/ResetPassword/ResetPassword";
import VerifyOTP from "../pages/client/Users/VerifyOTP/VerifyOTP";

export const routes = [
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/collections/:slug", element: <ProductList /> },
      {
        path: "/products",
        children: [
          { path: "", element: <ProductList /> },
          { path: ":slugProduct", element: <ProductDetail /> },
        ],
      },
      {
        path: "/users",
        children: [
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
          { path: "profile", element: <Profile /> },
          { path: "change-password", element: <Profile /> },
          { path: "forgot-password", element: <ForgotPassword /> },
          { path: "verify-otp", element: <VerifyOTP /> },
          { path: "reset-password", element: <ResetPassword /> },
        ],
      },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout", element: <Checkout /> },
      {
        path: "/orders",
        children: [
          { path: "", element: <Profile /> },
          { path: "success/:orderCode", element: <PaymentResult /> },
          { path: "payment-result/:orderCode", element: <PaymentResult /> },
          { path: ":orderCode", element: <OrderDetail /> },
        ],
      },
    ],
  },
];

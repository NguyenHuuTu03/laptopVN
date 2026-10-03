import ClientLayout from "../layouts/client/ClientLayout";
import AdminLayout from "../layouts/admin/AdminLayout";
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
import PrivateRoute from "./PrivateRoute";
import LoginAdmin from "../pages/admin/Auth/LoginAdmin/LoginAdmin";
import Products from "../pages/admin/Products/Products";
import CategoryList from "../pages/admin/Categories/CategoryList/CategoryList";
import Dashboard from "../pages/admin/Dashboard/Dashboard";
import BrandList from "../pages/admin/Brands/BrandList/BrandList";
import OrderList from "../pages/admin/Orders/OrderList/OrderList";
import UserList from "../pages/admin/Users/UserList/UserList";
import OrderShip from "../pages/admin/Shipper/OrderShip/OrderShip";
import RoleList from "../pages/admin/Roles/RoleList/RoleList";
import Permission from "../pages/admin/Roles/Permission/Permission";
import Setting from "../pages/admin/Setting/Setting";

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

          { path: "forgot-password", element: <ForgotPassword /> },
          { path: "verify-otp", element: <VerifyOTP /> },
          { path: "reset-password", element: <ResetPassword /> },
        ],
      },
      { path: "/cart", element: <Cart /> },
      {
        element: <PrivateRoute />,
        children: [
          { path: "/users/profile", element: <Profile /> },
          { path: "/users/change-password", element: <Profile /> },
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
    ],
  },
  {
    path: "/admin",
    children: [
      {
        path: "auth",
        children: [
          {
            path: "login",
            element: <LoginAdmin />,
          },
        ],
      },
      {
        element: <AdminLayout />,
        children: [
          {
            path: "",
            element: <Dashboard />,
          },
          {
            path: "products",
            element: <Products />,
          },
          {
            path: "categories",
            element: <CategoryList />,
          },
          {
            path: "brands",
            element: <BrandList />,
          },
          {
            path: "orders",
            element: <OrderList />,
          },
          {
            path: "users",
            element: <UserList />,
          },
          {
            path: "shipper",
            element: <OrderShip />,
          },
          {
            path: "roles",
            children: [
              { path: "", element: <RoleList /> },
              { path: "permission", element: <Permission /> },
            ],
          },
          {
            path: "settings",
            element: <Setting />,
          },
        ],
      },
    ],
  },
];

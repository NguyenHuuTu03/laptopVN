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
import ProductView from "../pages/admin/Products/ProductView/ProductView";
import Dashboard from "../pages/admin/Dashboard/Dashboard";
import OrderView from "../pages/admin/Orders/OrderView/OrderView";
import OrderShip from "../pages/admin/Shipper/OrderShip/OrderShip";
import RoleList from "../pages/admin/Roles/RoleView/RoleView";
import Permission from "../pages/admin/Roles/Permission/Permission";
import Setting from "../pages/admin/Setting/Setting";
import CategoryView from "../pages/admin/Categories/CategoryView/CategoryView";
import BrandView from "../pages/admin/Brands/BrandView/BrandView";
import UserView from "../pages/admin/Users/UserView/UserView";
import CouponView from "../pages/admin/Coupons/CouponView/CouponView";
import RoleCreate from "../pages/admin/Roles/RoleCreate/RoleCreate";
import RoleEdit from "../pages/admin/Roles/RoleEdit/RoleEdit";
import RoleDetail from "../pages/admin/Roles/RoleDetail/RoleDetail";
import ReceivedOrder from "../pages/admin/Shipper/ReceivedOrder/ReceivedOrder";
import OrderShipDetail from "../pages/admin/Shipper/OrderShipDetail/OrderShipDetail";
import OrderAdminDetail from "../pages/admin/Orders/OrderDetail/OrderDetail";
import UserCreate from "../pages/admin/Users/UserCreate/UserCreate";

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
            element: <ProductView />,
          },
          {
            path: "categories",
            element: <CategoryView />,
          },
          {
            path: "brands",
            element: <BrandView />,
          },
          {
            path: "orders",

            children: [
              {
                path: "",
                element: <OrderView />,
              },
              {
                path: ":orderId",
                element: <OrderAdminDetail />,
              },
            ],
          },
          {
            path: "users",
            children: [
              {
                path: "",
                element: <UserView />,
              },
              {
                path: "create",
                element: <UserCreate />,
              },
            ],
          },
          {
            path: "coupons",
            element: <CouponView />,
          },
          {
            path: "shipper",
            children: [
              {
                path: "",
                element: <OrderShip />,
              },
              {
                path: "orders/:orderId",
                element: <OrderShipDetail />,
              },
              {
                path: "orders/received",
                element: <ReceivedOrder />,
              },
            ],
          },
          {
            path: "roles",
            children: [
              {
                path: "",
                element: <RoleList />,
              },
              {
                path: "create",
                element: <RoleCreate />,
              },
              {
                path: "edit/:roleId",
                element: <RoleEdit />,
              },
              {
                path: "detail/:roleId",
                element: <RoleDetail />,
              },
            ],
          },
          { path: "permissions", element: <Permission /> },

          {
            path: "settings",
            element: <Setting />,
          },
        ],
      },
    ],
  },
];

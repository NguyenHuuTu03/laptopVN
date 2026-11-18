import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spin } from "antd";

function PrivateRoute() {
  const { isLoggedIn, checked } = useSelector(
    (state) => state.authReducer.client,
  );
  if (!checked) {
    return <Spin fullscreen size="large" description="Đang tải dữ liệu..." />;
  }
  if (!isLoggedIn) {
    return <Navigate to="/users/login" replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spin } from "antd";

function PrivateRoute() {
  const { isLoggedIn, checked } = useSelector(
    (state) => state.authReducer.client,
  );
  if (!checked) {
    return <Spin fullscreen={true}></Spin>;
  }
  if (!isLoggedIn) {
    return <Navigate to="/users/login" replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute() {
  const { isLoggedIn } = useSelector((state) => state.authReducer.client);

  if (!isLoggedIn) {
    return <Navigate to="/users/login" replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;

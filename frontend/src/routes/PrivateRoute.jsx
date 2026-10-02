import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function PrivateRoute() {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  const auth = useSelector((state) =>
    isAdmin ? state.authReducer.admin : state.authReducer.client,
  );

  if (!auth.checked) {
    return <div>Loading...</div>;
  }

  if (!auth.isLoggedIn) {
    return <Navigate to={isAdmin ? "/admin/login" : "/users/login"} replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;

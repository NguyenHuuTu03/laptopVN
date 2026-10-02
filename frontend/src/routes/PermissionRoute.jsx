import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function PermissionRoute({ permission }) {
  const { user } = useSelector((state) => state.authReducer);

  if (user?.role.permissions?.includes(permission)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}

export default PermissionRoute;

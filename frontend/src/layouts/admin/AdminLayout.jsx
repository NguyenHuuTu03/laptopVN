import { Layout } from "antd";
import Header from "../../components/admin/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProfile } from "../../services/admin/auth.services";
import { setAdminAuth } from "../../actions/authActions";
import { Navigate, Outlet } from "react-router-dom";
import "./AdminLayout.scss";
// import { useState } from "react";
import SideBar from "../../components/admin/SideBar/SideBar";

const { Sider, Content } = Layout;
function AdminLayout() {
  const dispatch = useDispatch();
  const { isLoggedIn, checked } = useSelector(
    (state) => state.authReducer.admin,
  );

  // const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const profile = await getProfile();
        if (profile.code === 200) {
          dispatch(
            setAdminAuth({
              isLoggedIn: true,
              user: profile.data.user,
            }),
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkAuthStatus();
  }, [dispatch]);

  if (!checked) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/admin/auth/login" replace />;
  }
  return (
    <>
      <Layout className="admin-layout">
        <header className="admin-header">
          <Header />
        </header>

        <Layout>
          <Sider className="admin-layout__sider">
            <SideBar />
          </Sider>
          <Content className="admin-layout__content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
export default AdminLayout;

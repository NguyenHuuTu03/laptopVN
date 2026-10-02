import { Layout } from "antd";
import Header from "../../components/admin/Header/Header";

const { Sider, Content } = Layout;
function AdminLayout() {
  return (
    <>
      <Layout className="admin-layout">
        <header className="header">
          <Header />
        </header>

        <Layout>
          <Sider></Sider>
          <Content></Content>
        </Layout>
      </Layout>
    </>
  );
}
export default AdminLayout;

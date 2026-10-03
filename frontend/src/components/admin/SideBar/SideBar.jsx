import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItem = [
    {
      key: "/admin",
      icon: <i className="fa-solid fa-gauge"></i>,
      label: "Tổng quan",
    },
    {
      key: "/admin/products",
      icon: <i className="fa-solid fa-layer-group"></i>,
      label: "Sản phẩm",
    },
    {
      key: "/admin/categories",
      icon: <i className="fa-solid fa-tags"></i>,
      label: "Danh mục",
    },
    {
      key: "/admin/brands",
      icon: <i className="fa-solid fa-shop"></i>,
      label: "Thương hiệu",
    },
    {
      key: "/admin/orders",
      icon: <i className="fa-solid fa-box-open"></i>,
      label: "Đơn hàng",
    },
    {
      key: "/admin/users",
      icon: <i className="fa-solid fa-users"></i>,
      label: "Người dùng",
    },
    {
      key: "/admin/shipper",
      icon: <i className="fa-solid fa-truck-fast"></i>,
      label: "Giao hàng",
    },
    {
      icon: <i className="fa-solid fa-users-gear"></i>,
      label: "Vai trò",
      children: [
        {
          key: "/admin/roles",
          icon: <i className="fa-solid fa-user-shield"></i>,
          label: "Nhóm quyền",
        },
        {
          key: "/admin/roles/permission",
          icon: <i className="fa-solid fa-key"></i>,
          label: "Phân quyền",
        },
      ],
    },
    {
      key: "/admin/settings",
      icon: <i className="fa-solid fa-gear"></i>,
      label: "Cài đặt",
    },
  ];
  return (
    <>
      <Menu
        mode="inline"
        items={menuItem}
        selectedKeys={[location.pathname]}
        onClick={({ key }) => navigate(key)}
        // theme={"dark"}
      />
    </>
  );
}
export default SideBar;

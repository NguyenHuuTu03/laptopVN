import { Menu } from "antd";

import {
  HomeOutlined,
  LaptopOutlined,
  DesktopOutlined,
  AppstoreOutlined,
  ToolOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";

import { Link } from "react-router-dom";

import "./Navigation.scss";

function Navigation() {
  const menuItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: <Link to="/">Trang chủ</Link>,
    },
    {
      key: "laptop",
      icon: <LaptopOutlined />,
      label: <Link to="/collections/laptop">Laptop</Link>,
    },
    {
      key: "pc",
      icon: <DesktopOutlined />,
      label: <Link to="/collections/pc">PC</Link>,
    },
    {
      key: "monitor",
      icon: <DesktopOutlined />,
      label: <Link to="/collections/monitor">Màn hình</Link>,
    },
    {
      key: "accessories",
      icon: <AppstoreOutlined />,
      label: <Link to="/collections/accessories">Phụ kiện</Link>,
    },
    {
      key: "components",
      icon: <ToolOutlined />,
      label: <Link to="/collections/components">Linh kiện</Link>,
    },
    {
      key: "audio",
      icon: <CustomerServiceOutlined />,
      label: <Link to="/collections/audio">Âm thanh</Link>,
    },
  ];

  return (
    <nav className="navigation">
      <div className="container">
        <Menu mode="horizontal" items={menuItems} selectable={false} />
      </div>
    </nav>
  );
}

export default Navigation;

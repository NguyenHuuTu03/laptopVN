import { Input, Badge, Space } from "antd";

import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";

import { Link } from "react-router-dom";

import "./Header.scss";

const { Search } = Input;

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header__top">
          {/* LOGO */}
          <div className="header__logo">
            <Link to="/">
              <img src="/logo.png" alt="LaptopVN" />
            </Link>
          </div>

          {/* SEARCH */}
          <div className="header__search">
            <Search placeholder="Tìm kiếm sản phẩm..." enterButton />

            <div className="search-suggest">
              <div className="suggest-list">
                {/* Sau này render sản phẩm gợi ý */}
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="header__actions">
            {/* CART */}
            <div className="header__actions-cart">
              <Link to="/cart">
                <Space>
                  <Badge count={0} showZero>
                    <ShoppingCartOutlined />
                  </Badge>
                </Space>
              </Link>
            </div>

            {/* LOGIN */}
            <div className="header__actions-login">
              <Link to="/users/login">
                <Space>
                  <UserOutlined />
                  <span>Đăng nhập</span>
                </Space>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

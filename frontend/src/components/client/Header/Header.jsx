import { Input, Badge, Space } from "antd";

import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";

import { Link, useNavigate } from "react-router-dom";

import "./Header.scss";
import { useEffect, useRef, useState } from "react";
import Suggest from "../Suggest/Suggest";

const { Search } = Input;

function Header() {
  const [keyword, setKeyword] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const searchRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggest(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (keyword) => {
    const value = keyword.trim();

    if (!value) return;

    navigate(`/products?keyword=${value}`);

    setShowSuggest(false);
  };

  const handleSelectSuggest = () => {
    setShowSuggest(false);
  };

  const handleChange = (e) => {
    const value = e.target.value;

    setKeyword(value);

    // Có keyword thì hiện Suggest
    if (value.trim()) {
      setShowSuggest(true);
    } else {
      setShowSuggest(false);
    }
  };

  const handleFocus = () => {
    if (keyword.trim()) {
      setShowSuggest(true);
    }
  };
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
          <div className="header__search" ref={searchRef}>
            <Search
              placeholder="Tìm kiếm sản phẩm..."
              enterButton
              value={keyword}
              onChange={handleChange}
              onSearch={handleSearch}
              onFocus={handleFocus}
            />

            {showSuggest && (
              <Suggest keyword={keyword} onSelect={handleSelectSuggest} />
            )}
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

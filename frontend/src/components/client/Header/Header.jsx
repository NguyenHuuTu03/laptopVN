import { Input, Badge, Space, Dropdown, message, notification } from "antd";

import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";

import { Link, useLocation, useNavigate } from "react-router-dom";

import "./Header.scss";
import { useEffect, useRef, useState } from "react";
import Suggest from "../Suggest/Suggest";
import { logout } from "../../../services/client/user.services";
import { useDispatch, useSelector } from "react-redux";
import { setClientAuth } from "../../../actions/authActions";
import { clearCart } from "../../../actions/cartActions";

const { Search } = Input;

function Header() {
  const [keyword, setKeyword] = useState("");

  const [showSuggest, setShowSuggest] = useState(false);

  const searchRef = useRef(null);

  const navigate = useNavigate();

  const location = useLocation();

  const dispatch = useDispatch();

  const { isLoggedIn, user } = useSelector((state) => state.authReducer.client);
  const cartItems = useSelector((state) => state.cartReducer);
  const setting = useSelector((state) => state.settingReducer);

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

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
  }, [location.pathname]);

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

  const userMenu = {
    items: [
      {
        key: "profile",
        label: "Tài khoản của tôi",
        icon: <i className="fa-solid fa-user"></i>,
      },
      {
        key: "orders",
        label: "Đơn hàng của tôi",
        icon: <i className="fa-solid fa-box-open"></i>,
      },
      {
        key: "logout",
        label: "Đăng xuất",
        icon: <i className="fa-solid fa-right-from-bracket"></i>,
      },
    ],
  };

  const handleLogout = async () => {
    try {
      const result = await logout();

      if (result.code === 200) {
        dispatch(clearCart());
        notification.success({
          title: result.message,
        });

        dispatch(
          setClientAuth({
            isLoggedIn: false,
            user: null,
          }),
        );

        navigate("/");
      } else {
        notification.error({
          title: result.message,
        });
      }
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);

      message.error(error.response?.data?.message || "Đăng xuất thất bại!");
    }
  };

  const handleMenuClick = ({ key }) => {
    if (key === "profile") {
      navigate("/users/profile");
    }

    if (key === "orders") {
      navigate("/orders");
    }

    if (key === "cart") {
      navigate("/cart");
    }

    if (key === "logout") {
      handleLogout();
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__top">
          {/* LOGO */}
          <div className="header__logo">
            <Link to="/">
              <img src={setting.logo} alt={setting.title} />
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
                  <Badge count={totalQuantity} showZero>
                    <ShoppingCartOutlined />
                  </Badge>
                </Space>
              </Link>
            </div>

            {/* LOGIN */}
            {isLoggedIn && user ? (
              <Dropdown
                menu={{
                  items: userMenu.items,
                  onClick: handleMenuClick,
                }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <div className="header__user">
                  <Space>
                    <UserOutlined />
                    <span>{user.fullName}</span>
                  </Space>
                </div>
              </Dropdown>
            ) : (
              <div className="header__actions-login">
                <Link to="/users/login">
                  <Space>
                    <UserOutlined />
                    <span>Đăng nhập</span>
                  </Space>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

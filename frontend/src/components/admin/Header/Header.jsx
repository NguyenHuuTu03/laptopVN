import { Dropdown, notification } from "antd";
import { DownOutlined } from "@ant-design/icons";
import "./Header.scss";
import { logout } from "../../../services/admin/auth.services";
import { useDispatch, useSelector } from "react-redux";
import { setAdminAuth } from "../../../actions/authActions";
import { useNavigate } from "react-router-dom";
function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.authReducer.admin);

  const setting = useSelector((state) => state.settingReducer);

  const userMenu = {
    items: [
      {
        key: "profile",
        label: "Tài khoản của tôi",
        icon: <i className="fa-solid fa-user"></i>,
      },
      {
        key: "logout",
        label: "Đăng xuất",
        icon: <i className="fa-solid fa-right-from-bracket"></i>,
      },
    ],
  };

  const handleLogout = async () => {
    const result = await logout();

    if (result.code === 200) {
      dispatch(
        setAdminAuth({
          isLoggedIn: false,
          user: null,
        }),
      );
      navigate("/admin/auth/login");
      notification.success({
        title: result.message,
      });
    } else {
      notification.error({
        title: result.message,
      });
    }
  };

  const handleMenuClick = ({ key }) => {
    if (key === "profile") {
      navigate("/admin/auth/profile");
    }

    if (key === "logout") {
      handleLogout();
    }
  };
  return (
    <>
      {user && (
        <div className="admin-header__container">
          <div className="admin-header__logo">
            <img src={setting.logo} alt={setting.title} />
          </div>
          <div className="admin-header__nav">
            <Dropdown
              className="admin-header-dropdown"
              menu={{ items: userMenu.items, onClick: handleMenuClick }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div className="admin-header__user">
                <div className="admin-header__avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.fullName} />
                  ) : (
                    <i className="fa-solid fa-user"></i>
                  )}
                </div>
                <div className="admin-header__info">
                  <span>{user.fullName}</span>
                </div>

                <DownOutlined className="admin-header__arrow" />
              </div>
            </Dropdown>
          </div>
        </div>
      )}
    </>
  );
}
export default Header;

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Profile.scss";
import {
  changePassword,
  getProfile,
  logout,
  updateProfile,
} from "../../../../services/client/user.services";
import { message } from "antd";
import { clearCart } from "../../../../actions/cartActions";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../../actions/authActions";
import MyOrders from "../../Orders/MyOrders/MyOrders";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const location = useLocation();

  const isProfile = location.pathname.includes("/users/profile");
  const isChangePassword = location.pathname.includes("/users/change-password");
  const isOrders = location.pathname.includes("/orders");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
  });

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const result = await getProfile();
      if (result.code === 200) {
        setUser(result.data?.user);
        setLoading(false);
        setFormData({
          fullName: result.data?.user.fullName || "",
          email: result.data?.user.email || "",
          phone: result.data?.user.phone || "",
          address: result.data?.user.address || "",
          avatar: result.data?.user.avatar || "",
        });
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleLogout = async () => {
    try {
      const result = await logout();

      if (result.code === 200) {
        dispatch(clearCart());
        message.success(result.message || "Đăng xuất thành công!");

        dispatch(
          setAuth({
            isLoggedIn: false,
            user: null,
          }),
        );

        navigate("/");
      } else {
        message.error(result.message || "Đăng xuất thất bại!");
      }
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);

      message.error(error.response?.data?.message || "Đăng xuất thất bại!");
    }
  };

  const handleSubmitInfo = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    if (avatar) data.append("avatar", avatar);

    const result = await updateProfile(data);

    if (result.code === 200) {
      const profile = await getProfile();
      if (profile.code === 200) {
        setUser(profile.data.user);
        message.success("Cập nhật thông tin thành công!");
      } else {
        message.warning(profile.message);
      }
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    const data = {
      oldPassword: e.target.elements.oldPassword.value,
      newPassword: e.target.elements.newPassword.value,
      confirmPassword: e.target.elements.confirmPassword.value,
    };
    const result = await changePassword(data);
    if (result.code === 200) {
      message.success(result.message);
      handleLogout();
    } else {
      message.warning(result.message);
    }
  };
  return (
    <>
      {loading ? (
        "Đang tải dữ liệu"
      ) : (
        <>
          <div className="account-page">
            <div className="account-page__container">
              <div className="account-page__breadcrumb">
                <Link to="/">Trang chủ</Link>
                <span>/</span>
                {isProfile && <span>Thông tin cá nhân</span>}
                {isOrders && <span>Đơn hàng của tôi</span>}
                {isChangePassword && <span>Đổi mật khẩu</span>}
              </div>
              {user && (
                <>
                  <div className="account-page__main">
                    <div className="account-page__left">
                      <div className="account-box">
                        <div className="account-box__user">
                          <div className="account-box__avatar">
                            {user.avatar ? (
                              <>
                                <img src={user.avatar} alt={user.fullName} />
                              </>
                            ) : (
                              <>
                                <i className="fa-regular fa-circle-user"></i>
                              </>
                            )}
                          </div>
                          <div className="account-box__name">
                            {user.fullName}
                          </div>
                        </div>

                        <div className="account-box-nav">
                          <Link
                            to="/users/profile"
                            className={`data-tab ${isProfile ? "active" : ""}`}
                          >
                            <i className="fa-regular fa-user"></i>Thông tin cá
                            nhân
                          </Link>
                          <Link
                            to="/orders"
                            className={`data-tab ${isOrders ? "active" : ""}`}
                          >
                            <i className="fa-solid fa-box-open"></i>Đơn hàng của
                            tôi
                          </Link>
                          <Link
                            to="/users/change-password"
                            className={`data-tab ${isChangePassword ? "active" : ""}`}
                          >
                            <i className="fa-solid fa-key"></i>Đổi mật khẩu
                          </Link>
                          <button
                            type="button"
                            className="data-tab"
                            onClick={handleLogout}
                          >
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                            Đăng xuất
                          </button>
                        </div>
                      </div>
                    </div>

                    {isProfile && (
                      <div className="account-page__right">
                        <div className="account-box">
                          <h3>Thông tin cá nhân</h3>
                          <div className="account-box__info">
                            <form onSubmit={handleSubmitInfo}>
                              <div>
                                <label htmlFor="fullName">Họ và tên</label>
                                <input
                                  type="text"
                                  name="fullName"
                                  id="fullName"
                                  value={formData.fullName}
                                  onChange={handleChange}
                                />
                              </div>
                              <div>
                                <label htmlFor="email">Email</label>
                                <input
                                  type="email"
                                  name="email"
                                  id="email"
                                  value={formData.email}
                                  disabled={true}
                                />
                              </div>
                              <div>
                                <label htmlFor="phone">Số điện thoại</label>
                                <input
                                  type="phone"
                                  name="phone"
                                  id="phone"
                                  value={formData.phone}
                                  onChange={handleChange}
                                />
                              </div>
                              <div>
                                <label htmlFor="address">Địa chỉ</label>
                                <textarea
                                  name="address"
                                  id="address"
                                  rows={3}
                                  value={formData.address}
                                  onChange={handleChange}
                                />
                              </div>
                              <div className="account-avatar-upload">
                                <label
                                  htmlFor="avatar"
                                  className="account-avatar-upload__box"
                                >
                                  {avatarPreview ? (
                                    <img
                                      src={avatarPreview}
                                      alt="Avatar preview"
                                    />
                                  ) : user?.avatar ? (
                                    <img
                                      src={user.avatar}
                                      alt={user.fullName}
                                    />
                                  ) : (
                                    <span className="account-avatar-upload__icon">
                                      <i className="fa-solid fa-upload"></i>
                                    </span>
                                  )}
                                </label>

                                <input
                                  type="file"
                                  id="avatar"
                                  accept="image/jpeg,image/png,image/webp"
                                  onChange={handleAvatarChange}
                                />
                              </div>
                              <button>Cập nhật</button>
                            </form>
                          </div>
                        </div>
                      </div>
                    )}

                    {isChangePassword && (
                      <div className="account-page__right">
                        <div className="account-box">
                          <h3>Đổi mật khẩu</h3>
                          <div className="account-box__info">
                            <form onSubmit={handleSubmitPassword}>
                              <div>
                                <label htmlFor="oldPassword">
                                  Mật khẩu hiện tại
                                </label>
                                <input
                                  type="password"
                                  name="oldPassword"
                                  id="oldPassword"
                                />
                              </div>
                              <div>
                                <label htmlFor="newPassword">
                                  Mật khẩu mới
                                </label>
                                <input
                                  type="password"
                                  name="newPassword"
                                  id="newPassword"
                                />
                              </div>
                              <div>
                                <label htmlFor="confirmPassword">
                                  Xác nhận mật khẩu
                                </label>
                                <input
                                  type="password"
                                  name="confirmPassword"
                                  id="confirmPassword"
                                />
                              </div>
                              <button>Cập nhật</button>
                            </form>
                          </div>
                        </div>
                      </div>
                    )}

                    {isOrders && (
                      <div className="account-page__right">
                        <div className="account-box">
                          <MyOrders />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
export default Profile;

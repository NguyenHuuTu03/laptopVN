import { Link, useNavigate } from "react-router-dom";
import "./LoginAdmin.scss";
import { getProfile, login } from "../../../../services/admin/auth.services";
import { notification } from "antd";
import { useDispatch } from "react-redux";
import { setAdminAuth } from "../../../../actions/authActions";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { getSettings } from "../../../../services/admin/setting.services";
import { setSettings } from "../../../../actions/settingActions";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const setting = useSelector((state) => state.settingReducer);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const result = await getSettings();

        if (result.code === 200) {
          dispatch(setSettings(result.data.setting));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSettings();
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        email: e.target.elements.email.value,
        password: e.target.elements.password.value,
      };
      const result = await login(data);
      if (result.code === 200) {
        const profile = await getProfile();
        if (profile.code === 200) {
          dispatch(
            setAdminAuth({
              isLoggedIn: true,
              user: profile.data.user,
            }),
          );
          notification.success({
            title: result.message,
          });
          navigate("/admin");
        } else {
          notification.error({
            title: profile.message,
          });
        }
      } else {
        notification.error({
          title: result.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="admin-login">
        <div className="admin-login__container">
          <div className="admin-login__left">
            <span>
              <i className="fa-solid fa-shield-halved"></i>
            </span>
            <div className="admin-login__content">
              <h1>{setting.title}</h1>
              <p>Hệ thống quản trị</p>
            </div>
          </div>
          <div className="admin-login__right">
            <div className="admin-login__logo">
              <img src={setting.logo} alt={setting.title} />
            </div>
            <div className="admin-login__header">
              <h1>Chào mừng trở lại</h1>
              <p>Đăng nhập vào hệ thống quản trị {setting.title}</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-login__field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Nhập email"
                  required
                />
              </div>
              <div className="admin-login__field">
                <label htmlFor="password">Mật khẩu</label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>
              <div className="admin-login__forgot">
                <Link to="/admin/auth/forgot-password">Quên mật khẩu?</Link>
              </div>

              <button type="submit" className="admin-login__submit">
                {/* {loading ? "Đang đăng nhập..." : "Đăng nhập"} */}
                Đăng nhập
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;

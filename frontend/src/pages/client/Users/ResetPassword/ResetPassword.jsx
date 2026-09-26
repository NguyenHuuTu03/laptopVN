import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../../../../services/client/user.services";
import { message } from "antd";

import "./ResetPassword.scss";

function ResetPassword() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = sessionStorage.getItem("forgotPasswordEmail");
    const data = {
      email: email,
      password: e.target.password.value,
      confirmPassword: e.target.confirmPassword.value,
    };

    const result = await resetPassword(data);
    if (result.code === 200) {
      message.success(result.message);
      sessionStorage.removeItem("forgotPasswordEmail");
      navigate(`/users/login`);
    } else {
      message.error(result.message);
    }
  };
  return (
    <>
      <div className="reset-password">
        <div className="reset-password__container">
          <div className="reset-password__header">
            <h1>Đặt lại mật khẩu</h1>
            <p>Nhập mật khẩu mới cho tài khoản của bạn.</p>
          </div>
          <form className="reset-password__form" onSubmit={handleSubmit}>
            <div className="reset-password__field">
              <label htmlFor="password">Mật khẩu mới</label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Nhập mật khẩu mới..."
                required
              />
            </div>

            <div className="reset-password__field">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Nhập lại mật khẩu mới..."
                required
              />
            </div>

            <button type="submit" className="reset-password__submit">
              Đặt lại mật khẩu
            </button>
          </form>

          <div className="reset-password__footer">
            <Link to="/users/login">
              <i className="fa-solid fa-arrow-left"></i>Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
export default ResetPassword;

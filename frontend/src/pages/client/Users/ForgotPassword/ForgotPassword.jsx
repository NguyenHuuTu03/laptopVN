import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.scss";
import { forgotPassword } from "../../../../services/client/user.services";
import { message } from "antd";

function ForgotPassword() {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    const result = await forgotPassword(email);
    if (result.code === 200) {
      message.success(result.message);
      sessionStorage.setItem("forgotPasswordEmail", email);
      navigate(`/users/verify-otp`);
    } else {
      message.error(result.message);
    }
  };
  return (
    <>
      <div className="forgot-password">
        <div className="forgot-password__container">
          <div className="forgot-password__header">
            <h1>Quên mật khẩu</h1>
            <p>
              Nhập email đăng ký, chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="forgot-password__field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Nhập email..."
                // onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="forgot-password__submit">
              Gửi mã OTP
            </button>
          </form>
          <div className="forgot-password__footer">
            <Link to="/users/login">
              <i className="fa-solid fa-arrow-left"></i>Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
export default ForgotPassword;

import { Link, useNavigate } from "react-router-dom";
import "./VerifyOTP.scss";
import { verifyOtp } from "../../../../services/client/user.services";
import { message } from "antd";

function VerifyOTP() {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = sessionStorage.getItem("forgotPasswordEmail");
    const data = {
      email: email,
      otp: e.target.otp.value,
    };
    const result = await verifyOtp(data);

    if (result.code === 200) {
      message.success(result.message);

      navigate(`/users/reset-password`);
    } else {
      message.error(result.message);
    }
  };
  return (
    <>
      <div className="verify-otp">
        <div className="verify-otp__container">
          <div className="verify-otp__header">
            <h1>Xác thực OTP</h1>
            <p>Nhập mã OTP đã được gửi đến email của bạn.</p>
          </div>

          <form className="verify-otp__form" onSubmit={handleSubmit}>
            <div className="verify-otp__field">
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Nhập mã OTP..."
                // onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="verify-otp__submit">
              Xác nhận
            </button>
          </form>

          <div className="verify-otp__footer">
            <Link to="/users/forgot-password">
              <i className="fa-solid fa-arrow-left"></i>Quay lại
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default VerifyOTP;

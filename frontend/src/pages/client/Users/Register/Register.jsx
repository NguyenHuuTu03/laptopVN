import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notification } from "antd";

import "./Register.scss";
import { register } from "../../../../services/client/user.services";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      notification.error({
        title: "Mật khẩu phải có ít nhất 6 ký tự!",
      });
      return;
    }

    try {
      setLoading(true);

      const result = await register(formData);

      console.log("REGISTER RESPONSE:", result);

      if (result.code === 200) {
        notification.success({
          title: result.message,
        });

        navigate("/users/login");
      } else {
        notification.error({
          title: result.message,
        });
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);

      notification.error({
        title: "Đăng ký thất bại!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register__container">
        <div className="register__form">
          {/* Header */}
          <div className="register__header">
            <h1>Tạo tài khoản</h1>
            <p>Đăng ký tài khoản để bắt đầu mua sắm</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Full name */}
            <div className="register__field">
              <label htmlFor="fullName">Họ và tên</label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Nhập họ và tên"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="register__field">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Nhập email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="register__field">
              <label htmlFor="password">Mật khẩu</label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="register__submit"
              disabled={loading}
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </form>

          {/* Login */}
          <div className="register__login">
            <span>Đã có tài khoản?</span>

            <Link to="/users/login">Đăng nhập</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

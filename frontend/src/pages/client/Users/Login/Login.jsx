import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notification } from "antd";

import { getProfile, login } from "../../../../services/client/user.services";

import "./Login.scss";
import { useDispatch } from "react-redux";
import { setClientAuth } from "../../../../actions/authActions";
import { getCart, mergeCart } from "../../../../services/client/cart.services";
import { setCart } from "../../../../actions/cartActions";

function Login() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
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

    try {
      setLoading(true);

      const result = await login(formData);

      if (result.code === 200) {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        if (cart.length > 0) {
          const mergeResult = await mergeCart(cart);

          if (mergeResult.code !== 200) {
            notification.error({
              title: "Đồng bộ giỏ hàng thất bại!",
            });
            return;
          } else {
            localStorage.removeItem("cart");
          }
        }

        const profileResult = await getProfile();
        if (profileResult.code === 200) {
          dispatch(
            setClientAuth({
              isLoggedIn: true,
              user: profileResult.data.user,
            }),
          );
        }

        const cartResult = await getCart();

        if (cartResult.code === 200) {
          dispatch(setCart(cartResult.data.items));
        }

        notification.success({
          title: result.message,
        });

        navigate("/");
      } else {
        notification.error({
          title: result.message,
        });
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      notification.error({
        title: "Email hoặc mật khẩu không chính xác!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-form">
          <div className="login-header">
            <h1>Đăng nhập</h1>
            <p>Đăng nhập để tiếp tục mua sắm</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="login-field">
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

            <div className="login-field">
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

            <div className="login-forgot">
              <Link to="/users/forgot-password">Quên mật khẩu?</Link>
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="login-register">
            <span>Chưa có tài khoản?</span>

            <Link to="/users/register">Đăng ký ngay</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

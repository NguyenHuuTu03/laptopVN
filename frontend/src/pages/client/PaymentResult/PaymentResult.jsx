import {
  Link,
  useSearchParams,
  useParams,
  useLocation,
} from "react-router-dom";
import "./PaymentResult.scss";

function PaymentResult() {
  const { orderCode } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isCOD = location.pathname.includes("/orders/success/");
  const isVNPay = location.pathname.includes("/orders/payment-result/");
  const status = searchParams.get("status");

  if (isCOD) {
    return (
      <div className="order-success">
        <div className="order-success__icon">
          <i className="fa-solid fa-circle-check"></i>
        </div>

        <h1 className="order-success__title">Đặt hàng thành công</h1>

        <p className="order-success__message">Cảm ơn bạn đã đặt hàng.</p>

        <p className="order-success__message">
          Mã đơn hàng: <strong>{orderCode}</strong>
        </p>

        <p className="order-success__note">
          Đơn hàng của bạn đã được tiếp nhận và đang chờ xử lý.
        </p>

        <div className="order-success__actions">
          <Link to={`/orders/${orderCode}`}>Xem đơn hàng</Link>

          <Link to="/">Tiếp tục mua sắm</Link>
        </div>
      </div>
    );
  }

  if (isVNPay && status === "success") {
    return (
      <div className="payment-result">
        <div className="payment-result__icon">
          <i className="fa-solid fa-circle-check"></i>
        </div>

        <h1>Thanh toán thành công</h1>

        <p>
          Đơn hàng <strong>{orderCode}</strong> đã được thanh toán thành công.
        </p>

        <div className="payment-result__actions">
          <Link to={`/orders/${orderCode}`}>Xem đơn hàng</Link>

          <Link to="/">Tiếp tục mua sắm</Link>
        </div>
      </div>
    );
  }

  if (isVNPay && status === "failed") {
    return (
      <div className="payment-result">
        <div className="payment-result__icon">
          <i className="fa-solid fa-circle-xmark"></i>
        </div>

        <h1>Thanh toán thất bại</h1>

        <p>
          Đơn hàng <strong>{orderCode}</strong> chưa được thanh toán.
        </p>

        <div className="payment-result__actions">
          <Link to="/cart">Quay lại giỏ hàng</Link>
        </div>
      </div>
    );
  }

  // return (
  //   <div className="payment-result">
  //     <h1>Không xác định được kết quả thanh toán</h1>

  //     <Link to="/">Về trang chủ</Link>
  //   </div>
  // );
}

export default PaymentResult;

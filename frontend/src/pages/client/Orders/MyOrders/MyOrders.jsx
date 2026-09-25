import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../../../../services/client/order.services";

import "./MyOrders.scss";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await getMyOrders();

        if (result.code === 200) {
          setOrders(result.data.result);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatPrice = (price) => {
    return `${new Intl.NumberFormat("vi-VN").format(price || 0)}đ`;
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getOrderStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "SHIPPING":
        return "Đang giao hàng";
      case "DELIVERED":
        return "Đã giao hàng";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chưa thanh toán";
      case "WAITING_PAYMENT":
        return "Chờ thanh toán";
      case "PAID":
        return "Đã thanh toán";
      case "FAILED":
        return "Thanh toán thất bại";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="my-order">
        <div className="my-order__container">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="my-order">
      <div className="my-order__container">
        <div className="my-order__breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span>/</span>
          <span>Đơn hàng của tôi</span>
        </div>

        <h1>Đơn hàng của tôi</h1>

        {orders.length === 0 ? (
          <div className="my-order__empty">
            <p>Bạn chưa có đơn hàng nào.</p>

            <Link to="/">Tiếp tục mua sắm</Link>
          </div>
        ) : (
          <div className="my-order__list">
            {orders.map((order) => (
              <div className="my-order__item" key={order.orderId}>
                <div className="my-order__header">
                  <div>
                    <strong>#{order.orderCode}</strong>

                    <span>{formatDate(order.createdAt)}</span>
                  </div>

                  <span
                    className={`order-status order-status--${order.orderStatus?.toLowerCase()}`}
                  >
                    {getOrderStatusText(order.orderStatus)}
                  </span>
                </div>

                <div className="my-order__products">
                  {order.items.map((item) => (
                    <div
                      className="my-order__product"
                      key={`${item.productId}-${item.variantId}`}
                    >
                      <img src={item.thumbnail} alt={item.title} />

                      <div className="my-order__product-info">
                        <h3>{item.title}</h3>

                        {item.attributes?.map((attribute) => (
                          <span key={`${attribute.key}-${attribute.value}`}>
                            {attribute.key}: {attribute.value}
                          </span>
                        ))}

                        <p>Số lượng: {item.quantity}</p>
                      </div>

                      <div className="my-order-price">
                        <div className="my-order__priceNew">
                          {formatPrice(item.priceNew)}
                        </div>
                        <div className="my-order__price">
                          {formatPrice(item.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="my-order__footer">
                  <div>
                    <span>Thanh toán:</span>

                    <strong>{getPaymentStatusText(order.paymentStatus)}</strong>
                  </div>

                  <div>
                    <span>Tổng tiền:</span>

                    <strong>{formatPrice(order.totalPrice)}</strong>
                  </div>

                  <Link to={`/orders/${order.orderCode}`}>Xem chi tiết</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;

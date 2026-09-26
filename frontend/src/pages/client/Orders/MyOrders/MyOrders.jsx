import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getMyOrders } from "../../../../services/client/order.services";

import "./MyOrders.scss";
import Pagination from "../../../../components/client/Pagination/Pagination";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 2,
    totalOrders: 0,
    totalPages: 0,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await getMyOrders(page, 2);

        if (result.code === 200) {
          setOrders(result.data.result);
          setPagination(result.data.pagination);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page]);

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

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", page);

    setSearchParams(params);
  };

  if (loading) {
    return (
      <div className="my-order">
        <div className="my-order__container">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <>
      <h3>Đơn hàng của tôi</h3>

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
          <div className="my-order__pagination">
            <Pagination
              currentPage={pagination.currentPage}
              pageSize={pagination.limit}
              total={pagination.totalOrders}
              onChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default MyOrders;

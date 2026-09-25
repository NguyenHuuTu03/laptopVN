import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "./OrderDetail.scss";
import {
  getOrderDetail,
  patchOrderCancel,
} from "../../../../services/client/order.services";
import { message } from "antd";

function OrderDetail() {
  const { orderCode } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const result = await getOrderDetail(orderCode);
        console.log(result.data.order);

        if (result.code === 200) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Lỗi lấy chi tiết đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderCode]);
  console.log(data);

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
  // const { order, items } = data?;
  const handleCancelOrder = async () => {
    const result = await patchOrderCancel(data?.order.orderCode);

    if (result.code === 200) {
      const result = await getOrderDetail(orderCode);
      console.log(result.data.order);

      if (result.code === 200) {
        setData(result.data);
        message.success("Huỷ đơn hàng thành công!");
      }
    }
  };
  return (
    <>
      {loading ? (
        "Đang tải dữ liệu"
      ) : (
        <div className="order-detail">
          <div className="order-detail__container">
            <div className="order-detail__breadcrumb">
              <Link to="/">Trang chủ</Link>
              <span>/</span>
              <span>Chi tiết đơn hàng</span>
            </div>

            <div className="order-detail__header">
              <div>
                <h1>Chi tiết đơn hàng</h1>
                <span>
                  Đơn hàng: <strong>#{data?.order.orderCode}</strong>
                </span>
                <span>
                  Ngày đặt hàng:
                  <strong>{formatDate(data?.order.createdAt)}</strong>
                </span>
              </div>

              <span
                className={`order-status order-status--${data?.order.orderStatus?.toLowerCase()}`}
              >
                {getOrderStatusText(data?.order.orderStatus)}
              </span>
            </div>

            <div className="order-detail__main">
              <div className="order-detail__section">
                <h3>Thông tin khách hàng</h3>

                <div className="order-info">
                  <div>
                    <span>Họ và tên:</span>
                    <strong>{data?.order.shippingName}</strong>
                  </div>

                  <div>
                    <span>Số điện thoại:</span>
                    <strong>{data?.order.shippingPhone}</strong>
                  </div>

                  <div>
                    <span>Địa chỉ:</span>
                    <strong>{data?.order.shippingAddress}</strong>
                  </div>

                  <div>
                    <span>Ghi chú:</span>
                    <strong>{data?.order.note || "-"}</strong>
                  </div>
                </div>
              </div>

              <div className="order-detail__section">
                <h3>Sản phẩm</h3>

                <div className="order-items">
                  {data?.items.map((item) => (
                    <div className="order-item" key={item._id}>
                      <img src={item.thumbnail} alt={item.title} />

                      <div className="order-item__info">
                        <div>{item.title}</div>

                        {item.attributes?.map((attribute) => (
                          <span key={`${attribute.key}-${attribute.value}`}>
                            {attribute.key}: {attribute.value}
                          </span>
                        ))}

                        <p>Số lượng: {item.quantity}</p>
                      </div>
                      <div className="order-price">
                        <div className="order-item__priceNew">
                          {formatPrice(item.priceNew)}
                        </div>
                        <div className="order-item__price">
                          {formatPrice(item.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-detail__section">
                <h3>Thông tin thanh toán</h3>

                <div className="order-summary">
                  <div>
                    <span>Số lượng sản phẩm:</span>
                    <span>{data?.order.totalQuantity}</span>
                  </div>
                  <div>
                    <span>Tổng tiền hàng:</span>
                    <span>{formatPrice(data?.order.subtotal)}</span>
                  </div>
                  <div>
                    <span>Giảm giá:</span>
                    <span>-{formatPrice(data?.order.voucherDiscount)}</span>
                  </div>

                  <p>
                    <span>Phương thức:</span>
                    <strong>{data?.order.paymentMethod}</strong>
                  </p>

                  <p>
                    <span>Trạng thái thanh toán:</span>
                    <strong>
                      {getPaymentStatusText(data?.order.paymentStatus)}
                    </strong>
                  </p>

                  <p className="order-summary__total">
                    <span>Tổng tiền:</span>
                    <strong>{formatPrice(data?.order.totalPrice)}</strong>
                  </p>
                </div>
                <div className="order-detail__actions">
                  {["PENDING", "CONFIRMED"].includes(
                    data?.order.orderStatus,
                  ) && (
                    <button className="btn-cancel" onClick={handleCancelOrder}>
                      Hủy đơn hàng
                    </button>
                  )}
                  <Link to="/">Tiếp tục mua sắm</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderDetail;

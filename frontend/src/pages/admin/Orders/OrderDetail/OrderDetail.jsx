import { Col, notification, Row, Spin, Steps } from "antd";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  changeStatus,
  getOrder,
} from "../../../../services/admin/order.services";

function OrderDetail() {
  const items = [
    {
      title: "Đặt hàng",
      content: "Đơn hàng đã được tạo",
    },
    {
      title: "Xác nhận",
      content: "Đơn hàng đã xác nhận",
    },
    {
      title: "Đang giao",
      content: "Đơn hàng đang được vận chuyển",
    },
    {
      title: "Hoàn tất",
      content: "Giao hàng thành công",
    },
  ];

  const handleProgress = (status) => {
    switch (status) {
      case "PENDING":
        return { current: 0, status: "process" };

      case "CONFIRMED":
        return { current: 1, status: "process" };

      case "COMPLETED":
        return { current: 2, status: "process" };

      case "SHIPPING":
        return { current: 3, status: "process" };

      case "DELIVERED":
        return { current: 4, status: "finish" };

      case "FAILED":
        return { current: 2, status: "error" };

      case "CANCELLED":
        return { current: 0, status: "error" };

      default:
        return { current: 0, status: "wait" };
    }
  };

  const handleConfirm = async () => {
    const result = await changeStatus(orderId, "CONFIRMED");

    if (result.code === 200) {
      setOrder(result.data.order);
      notification.success({
        title: result.message,
      });
    } else {
      notification.error({
        title: result.message,
      });
    }
  };
  const handleCancelled = async () => {
    const result = await changeStatus(orderId, "CANCELLED");

    if (result.code === 200) {
      setOrder(result.data.order);
      notification.success({
        title: result.message,
      });
    } else {
      notification.error({
        title: result.message,
      });
    }
  };

  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const { orderId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getOrder(orderId);
        if (result.code === 200) {
          setOrder(result.data.order);
          setOrderItems(result.data.orderItems);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orderId]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const formatPaymentStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "Chưa thanh toán";
      case "PAID":
        return "Đã thanh toán";

      default:
        return "Không xác định";
    }
  };

  const formatPaymentMethod = (value) => {
    switch (value) {
      case "COD":
        return "Thanh toán khi nhận hàng (COD)";
      case "VNPay":
        return "Thanh toán trực tuyến (VNPay)";

      default:
        return "Không xác định";
    }
  };

  const handleVersion = () => {
    orderItems.forEach((item) => {
      let ram = "";
      let storage = "";
      let color = "";
      item.variant.attributes.forEach((v) => {
        const key = v.key?.toLowerCase();
        if (key === "ram") {
          ram = v.value;
        }

        if (key === "storage" || key === "ssd") {
          storage = v.value;
        }

        if (key === "color") {
          color = v.value;
        }
      });
      item.version = `${ram ? ram + "/" : ""}${storage ? `${storage}` : ""}`;
      item.color = color;
    });
  };
  handleVersion();

  console.log(order);

  return (
    <>
      <div className="admin-order__detail">
        <div className="admin-order__detail__header">
          <div className="admin-order__detail-title">
            <h1>Chi tiết đơn hàng</h1>
          </div>

          <div className="admin-order__detail-nav">
            {order?.orderStatus == "PENDING" && (
              <>
                <button
                  className="section-action__success"
                  onClick={handleConfirm}
                >
                  <i className="fa-solid fa-check"></i>
                  Xác nhận đơn
                </button>
                <button
                  className="section-action__failed"
                  onClick={handleCancelled}
                >
                  <i className="fa-solid fa-xmark"></i>
                  Huỷ đơn
                </button>
              </>
            )}

            <Link to="/admin/orders" className="admin-order__detail-back">
              <i className="fa-solid fa-arrow-left"></i>
              Quay lại
            </Link>
          </div>
        </div>

        <Spin spinning={loading}>
          <div className="admin-order__detail__main">
            <Row gutter={[16, 16]}>
              <Col xs={24} xl={12}>
                <div className="order-section">
                  <h3>Thông tin giao hàng</h3>
                  <div className="section-info">
                    <div className="section-info__item">
                      <i className="fa-solid fa-user"></i>
                      <div className="section-info__name">
                        <span>Họ tên</span>
                        <span>{order?.shippingName}</span>
                      </div>
                    </div>

                    <div className="section-info__item">
                      <i className="fa-solid fa-phone"></i>
                      <div className="section-info__phone">
                        <span>Số điện thoại</span>
                        <span>{order?.shippingPhone}</span>
                      </div>
                    </div>

                    <div className="section-info__item">
                      <i className="fa-solid fa-location-dot"></i>
                      <div className="section-info__address">
                        <span>Địa chỉ nhận hàng</span>
                        <span>{order?.shippingAddress}</span>
                      </div>
                    </div>

                    <div className="section-info__item">
                      <i className="fa-regular fa-calendar-days"></i>
                      <div className="section-info__date">
                        <span>Ngày đặt hàng</span>
                        <span>{formatDate(order?.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={24} xl={12}>
                <div className="order-section">
                  <div className="order-section__payment">
                    <h3>Thanh toán</h3>
                    <div className="section-payment">
                      <span>Phương thức thanh toán</span>
                      <span>{formatPaymentMethod(order?.paymentMethod)}</span>
                    </div>
                    <div className="section-paymentStatus">
                      <span>Trạng thái thanh toán</span>
                      <span>{formatPaymentStatus(order?.paymentStatus)}</span>
                    </div>
                  </div>

                  <div className="order-section__note">
                    <h3>Ghi chú đơn hàng</h3>
                    <div className="section-description">
                      {order?.note ? order?.note : "Không có yêu cầu"}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} xl={16}>
                <div className="order-section">
                  <h3>Sản phẩm cần giao</h3>
                  <div className="section-products">
                    {orderItems.length > 0 && (
                      <>
                        {orderItems.map((item, index) => (
                          <div className="section-product" key={index}>
                            <div className="section-product-image">
                              <img
                                src={item.variant.thumbnail}
                                alt={item.product.title}
                              />
                            </div>

                            <div className="section-product__content">
                              <div className="section-product__content-title">
                                <span>{item.product.title}</span>
                              </div>
                              <div className="section-product__content-variant">
                                <span>
                                  {item.version ? item.version + " - " : ""}
                                  {item.color ? item.color : ""}
                                </span>
                                <span>Số lượng: {item.quantity}</span>
                              </div>
                            </div>
                            <div className="section-product__price">
                              <span>{item.priceNew.toLocaleString()}đ</span>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  <div className="section-summary">
                    <span>Tổng thanh toán</span>
                    <span>{order?.totalPrice.toLocaleString()}đ</span>
                  </div>
                </div>
              </Col>

              <Col xs={24} xl={8}>
                <div className="order-section">
                  <h3>Tiến trình giao hàng</h3>

                  <Steps
                    orientation="vertical"
                    items={items}
                    current={handleProgress(order?.orderStatus).current}
                    status={handleProgress(order?.orderStatus).status}
                  ></Steps>
                </div>
              </Col>
            </Row>
          </div>
        </Spin>
      </div>
    </>
  );
}

export default OrderDetail;

import { Link } from "react-router-dom";
import vnpay from "../../../assets/images/vnpay.webp";

import "./Checkout.scss";
import { useEffect, useState } from "react";
import {
  applyCoupon,
  getCheckout,
  postOrder,
} from "../../../services/client/order.services";
import { useNavigate } from "react-router-dom";
import { paymentVNPay } from "../../../services/client/payment.services";
import { useDispatch } from "react-redux";
import { setCart } from "../../../actions/cartActions";

function Checkout() {
  const [data, setData] = useState(null);

  const [activeVoucher, setActiveVoucher] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [voucherMessage, setVoucherMessage] = useState("");
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const result = await getCheckout();
      if (result.code === 200) {
        setData(result.data);
        setSummary(result.data.summary);
      }
    };

    fetchData();
  }, []);

  const handleApplyVoucher = async () => {
    const code = couponCode.trim();

    if (!code) {
      setVoucherMessage("Vui lòng nhập mã giảm giá!");
      return;
    }

    const result = await applyCoupon(code);

    if (result.code === 200) {
      setSummary(result.data.summary);
      setActiveVoucher(code);
      setVoucherMessage("");
    } else {
      setVoucherMessage("Mã giảm giá không hợp lệ!");
    }
  };

  const handleRemoveVoucher = async () => {
    const result = await getCheckout();
    if (result.code === 200) {
      setSummary(result.data.summary);
      setActiveVoucher("");
      setCouponCode("");
      setVoucherMessage("");
    }
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "Liên hệ";
    }
    return `${new Intl.NumberFormat("vi-VN").format(price)}đ`;
  };

  const handleVersion = () => {
    data?.items?.forEach((item) => {
      let ram = "";
      let storage = "";
      let color = "";
      item.attributes.forEach((v) => {
        const key = v.key?.toLowerCase();
        if (key === "ram") {
          ram = v.value;
        }

        if (key === "storage") {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const data = {
      shippingName: form.elements.shippingName.value,
      shippingPhone: form.elements.shippingPhone.value,
      shippingAddress: form.elements.shippingAddress.value,
      note: form.elements.note.value,
      paymentMethod: form.elements.paymentMethod.value,
      couponCode: activeVoucher,
    };
    const result = await postOrder(data);

    if (result.code === 200) {
      if (result.data.paymentMethod === "COD") {
        dispatch(setCart([]));
        navigate(`/orders/success/${result.data.orderCode}`);

        return;
      }

      if (result.data.paymentMethod === "VNPay") {
        const paymentResult = await paymentVNPay(result.data.orderId);

        if (paymentResult.code === 200) {
          window.location.href = paymentResult.data.paymentUrl;
        } else {
          console.log(paymentResult.message);
        }
      }
    } else {
      console.log(result.message);
    }
  };

  return (
    <>
      <div className="checkout-page">
        <div className="checkout-page__container">
          <div className="checkout-page__breadcrumb">
            <Link to="/">Trang chủ</Link>
            <span>/</span>
            <span>Đặt hàng</span>
          </div>
          <h1 className="checkout-page__title"> Thông tin đặt hàng </h1>

          <form onSubmit={handleSubmit}>
            <div className="checkout-page__main">
              <div className="checkout-page__left">
                <div className="checkout-box">
                  <h3 className="checkout-box__header">Thông tin nhận hàng</h3>
                  <div className="checkout-box__body">
                    <input
                      type="text"
                      name="shippingName"
                      placeholder="Họ và tên"
                      required
                    />
                    <input
                      type="tel"
                      name="shippingPhone"
                      placeholder="Số điện thoại"
                      required
                    />
                    <textarea
                      name="shippingAddress"
                      placeholder="Địa chỉ nhận hàng"
                      required
                      rows="3"
                    />
                    <textarea
                      name="note"
                      placeholder="Ghi chú cho đơn hàng"
                      rows="3"
                    />
                  </div>
                </div>

                <div className="checkout-box">
                  <h3 className="checkout-box__header">
                    Phương thức thanh toán
                  </h3>
                  <div className="checkout-box__body">
                    <label>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        required
                      />
                      <span>
                        <i className="fa-solid fa-money-bill-1-wave"></i>Thanh
                        toán khi nhận hàng (COD)
                      </span>
                    </label>
                    <label>
                      <input type="radio" name="paymentMethod" value="VNPay" />
                      <span>
                        <img src={vnpay} alt="VNPay" />
                        Thanh toán online qua VNPay
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {data?.items?.length > 0 && (
                <>
                  <div className="checkout-page__right">
                    <div className="checkout-box checkout-summary">
                      <h3 className="checkout-box__header"> Đơn hàng </h3>

                      <div className="checkout-summary__products">
                        {data.items.map((item, index) => (
                          <div className="checkout-product" key={index}>
                            <div className="checkout-product__image">
                              <img src={item.thumbnail} alt={item.title} />
                              <span>
                                <i className="fa-solid fa-xmark"></i>
                                {item.quantity}
                              </span>
                            </div>
                            <div className="checkout-product__info">
                              <strong>{item.title}</strong>
                              <span>{item.version}</span>
                              <span>{item.color}</span>
                            </div>

                            <div className="checkout-product__price">
                              {formatPrice(item.priceNew)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="checkout-voucher">
                        {activeVoucher ? (
                          <div className="checkout-voucher__applied">
                            <span className="checkout-voucher__icon">
                              <i className="fa-solid fa-ticket"></i>
                            </span>
                            <span className="checkout-voucher__info">
                              <strong>{activeVoucher}</strong>
                              <span>Mã giảm giá đã áp dụng</span>
                            </span>
                            <button
                              type="button"
                              className="cart-voucher__remove"
                              aria-label="Bỏ mã giảm giá"
                              onClick={handleRemoveVoucher}
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="cart-voucher__form">
                              <input
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleApplyVoucher();
                                  }
                                }}
                                placeholder="Nhập mã giảm giá"
                                autoComplete="off"
                                aria-label="Mã giảm giá"
                              />
                              <button
                                type="button"
                                className="btn-outline"
                                onClick={handleApplyVoucher}
                              >
                                Áp dụng
                              </button>
                            </div>
                            {voucherMessage && (
                              <p className="cart-voucher__message">
                                {voucherMessage}
                              </p>
                            )}
                          </>
                        )}

                        {/* {appliedVoucher && !activeVoucher && (
                        <p className="cart-voucher__note">
                          Mã {appliedVoucher.code} cần đơn từ{" "}
                          {formatPrice(appliedVoucher.minOrder)}. Thêm{" "}
                          {formatPrice(appliedVoucher.minOrder - summary.total)}{" "}
                          để dùng lại mã này.
                        </p>
                      )} */}
                      </div>

                      <div className="checkout-summary__body">
                        <div className="checkout-summary__row">
                          <span>
                            Tạm tính ({summary.totalQuantity} sản phẩm)
                          </span>
                          <span> {formatPrice(summary.subtotal)} </span>
                        </div>
                        {summary?.voucherDiscount > 0 && (
                          <div className="checkout-summary__row">
                            <span>
                              <i className="fa-solid fa-tag"></i>
                              {activeVoucher}
                            </span>
                            <span>
                              - {formatPrice(summary.voucherDiscount)}
                            </span>
                          </div>
                        )}

                        <div className="checkout-summary__row checkout-summary__row--total">
                          <span>Tổng tiền</span>
                          <strong> {formatPrice(summary?.total)} </strong>
                        </div>
                      </div>

                      <div className="checkout-summary__footer">
                        <button
                          type="submit"
                          className="btn-primary btn-block"
                          disabled={false}
                        >
                          Đặt hàng
                        </button>
                        <Link to="/cart" className="checkout-summary__back">
                          <i className="fa-solid fa-arrow-left"></i> Quay lại
                          giỏ hàng{" "}
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Checkout;

import { useEffect, useState } from "react";
import { getCart, previewCart } from "../../../services/client/cart.services";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import "./Cart.scss";

function Cart() {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);

  const [summary, setSummary] = useState(null);
  const [activeVoucher, setActiveVoucher] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [voucherMessage, setVoucherMessage] = useState("");

  const { isLoggedIn } = useSelector((state) => state.authReducer);
  const cartItems = useSelector((state) => state.cartReducer.items);
  console.log(cartItems);

  const updateCartData = (result) => {
    if (result.code === 200) {
      setData(result.data.items);
      setSummary(result.data.summary);
    }
  };
  useEffect(() => {
    const fetchCart = async () => {
      try {
        let result;
        if (isLoggedIn) {
          result = await getCart();
        } else {
          result = await previewCart(cartItems);
        }
        if (result.code === 200) {
          updateCartData(result);
        }
      } catch (error) {
        console.log("FETCH CART ERROR:", error);
        setData([]);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isLoggedIn, cartItems]);

  const handleApplyVoucher = async () => {
    const code = couponCode.trim();

    try {
      const result = await previewCart(cartItems, code);

      if (result.code === 200) {
        updateCartData(result);
        setActiveVoucher(code);
        setVoucherMessage("");
      } else {
        setVoucherMessage("Mã giảm giá không hợp lệ!");
      }
    } catch (error) {
      console.log("APPLY VOUCHER ERROR:", error);
      setVoucherMessage("Mã giảm giá không hợp lệ!");
    }
  };

  const handleRemoveVoucher = async () => {
    try {
      const result = await previewCart(cartItems);

      updateCartData(result);

      setActiveVoucher("");
      setCouponCode("");
    } catch (error) {
      console.log("REMOVE VOUCHER ERROR:", error);
    }
  };
  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "Liên hệ";
    }
    return `${new Intl.NumberFormat("vi-VN").format(price)}đ`;
  };
  return (
    <>
      {loading ? (
        "Đang tải dữ liệu"
      ) : (
        <>
          {data && (
            <div className="cart-page">
              <div className="cart-page__container">
                <div className="cart-page__breadcrumb">
                  <Link to="/">Trang chủ</Link>
                  <span>/</span>
                  <span>Giỏ hàng</span>
                </div>

                <div className="cart-page__main">
                  <div className="cart-page__list">
                    {data.map((item, index) => (
                      <div className="cart-item" key={index}>
                        <div className="cart-item__image">
                          <img src={item.thumbnail} alt="Ảnh sản phẩm" />
                        </div>

                        <div className="cart-item__content">
                          <div className="cart-item__name">
                            <a href="">{item.title}</a>
                            <span className="version">12GB/256GB</span>
                            <span className="color">Blue</span>
                          </div>

                          <div className="cart-item__block">
                            <div className="cart-item__price">
                              <span className="price-new">
                                {formatPrice(item.priceNew)}
                              </span>
                              <span className="price-old">
                                {formatPrice(item.price)}
                              </span>
                            </div>

                            <div className="cart-item__action">
                              <div className="change-quantity">
                                <span>
                                  <button className="down-quantity">
                                    <i className="fa-solid fa-minus"></i>
                                  </button>
                                </span>

                                <span>{item.quantity}</span>
                                <span>
                                  <button className="up-quantity">
                                    <i className="fa-solid fa-plus"></i>
                                  </button>
                                </span>
                              </div>
                              <button className="remove-item">
                                <i className="fa-regular fa-trash-can"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-page__summary">
                    <div className="cart-summary__header">
                      Thông tin đơn hàng
                    </div>

                    <div className="cart-voucher">
                      {activeVoucher ? (
                        <div className="cart-voucher__applied">
                          <span className="cart-voucher__icon">
                            <i className="fa-solid fa-ticket"></i>
                          </span>
                          <span className="cart-voucher__info">
                            <strong>{activeVoucher}</strong>
                            <span>Mã giảm giá đã áp dụng</span>
                          </span>
                          <button
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
                                  handleApplyVoucher();
                                }
                              }}
                              placeholder="Nhập mã giảm giá"
                              autoComplete="off"
                              aria-label="Mã giảm giá"
                            />
                            <button
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

                    <div className="cart-summary__body">
                      <div className="cart-summary__row">
                        <span>
                          Tạm tính ({summary?.totalQuantity || 0 || 0} sản phẩm)
                        </span>
                        <span>{formatPrice(summary?.subtotal || 0)}</span>
                      </div>
                      <div className="cart-summary__row">
                        <span>Giảm giá trực tiếp</span>
                        <span>
                          - {formatPrice(summary?.productDiscount || 0)}
                        </span>
                      </div>
                      {summary?.voucherDiscount > 0 && (
                        <div className="cart-summary__row cart-summary__row--voucher">
                          <span>Mã {activeVoucher}</span>
                          <span>- {formatPrice(summary.voucherDiscount)}</span>
                        </div>
                      )}
                      <div className="cart-summary__row cart-summary__row--total">
                        <span>Tổng tiền</span>
                        <span className="cart-summary__total">
                          {formatPrice(summary?.total || 0)}
                        </span>
                      </div>

                      <div className="cart-summary__row">
                        <span>Bạn đã tiết kiệm được</span>
                        <span>- {formatPrice(summary?.saving || 0)}</span>
                      </div>
                    </div>

                    <div className="cart-summary__footer">
                      <Link to="/checkout" className="btn-primary btn-block">
                        Đặt hàng
                      </Link>
                      <Link to="/" className="cart-summary__continue">
                        <i className="fa-solid fa-arrow-left"></i>
                        Tiếp tục mua sắm
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
export default Cart;

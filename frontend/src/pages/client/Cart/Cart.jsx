import { useEffect, useState } from "react";
import {
  deleteCartItem,
  getCart,
  previewCart,
  updateQuantityCart,
} from "../../../services/client/cart.services";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./Cart.scss";
import {
  deletedItem,
  setCart,
  updateQuantity,
} from "../../../actions/cartActions";

function Cart() {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);

  const [summary, setSummary] = useState(null);

  const { isLoggedIn } = useSelector((state) => state.authReducer);
  const cartItems = useSelector((state) => state.cartReducer);

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

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "Liên hệ";
    }
    return `${new Intl.NumberFormat("vi-VN").format(price)}đ`;
  };

  const dispatch = useDispatch();
  const handleUpQuantity = async (index) => {
    if (data[index].quantity < data[index].stock) {
      if (!isLoggedIn) {
        dispatch(
          updateQuantity({
            productId: data[index].productId,
            variantId: data[index].variantId,
            quantity: data[index].quantity + 1,
          }),
        );
      } else {
        const result = await updateQuantityCart(
          data[index].cartItemId,
          data[index].quantity + 1,
        );
        if (result.code === 200) {
          const cartResult = await getCart();

          if (cartResult.code === 200) {
            dispatch(setCart(cartResult.data.items));
            setData(cartResult.data.items);
            setSummary(cartResult.data.summary);
          }
        }
      }
    }
  };
  const handleDownQuantity = async (index) => {
    if (data[index].quantity > 1) {
      if (!isLoggedIn) {
        dispatch(
          updateQuantity({
            productId: data[index].productId,
            variantId: data[index].variantId,
            quantity: data[index].quantity - 1,
          }),
        );
      } else {
        const result = await updateQuantityCart(
          data[index].cartItemId,
          data[index].quantity - 1,
        );
        if (result.code === 200) {
          const cartResult = await getCart();

          if (cartResult.code === 200) {
            dispatch(setCart(cartResult.data.items));
            setData(cartResult.data.items);
            setSummary(cartResult.data.summary);
          }
        }
      }
    }
  };

  const handleDeleteItem = async (index) => {
    if (!isLoggedIn) {
      dispatch(
        deletedItem({
          productId: data[index].productId,
          variantId: data[index].variantId,
        }),
      );
      setData((prev) => prev.filter((_, i) => i !== index));
    } else {
      const result = await deleteCartItem(data[index].cartItemId);
      if (result.code === 200) {
        const cartResult = await getCart();

        if (cartResult.code === 200) {
          dispatch(setCart(cartResult.data.items));
          setData(cartResult.data.items);
          setSummary(cartResult.data.summary);
        }
      }
    }
  };

  const navigate = useNavigate();
  const handleSubmit = () => {
    if (!isLoggedIn) {
      navigate("/users/login");
    } else navigate("/checkout");
  };

  const handleVersion = () => {
    data.forEach((item) => {
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

                {data.length > 0 ? (
                  <>
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
                                {item.version && (
                                  <span className="version">
                                    {item.version}
                                  </span>
                                )}
                                {item.color && (
                                  <span className="color">{item.color}</span>
                                )}
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
                                      <button
                                        className="down-quantity"
                                        onClick={() =>
                                          handleDownQuantity(index)
                                        }
                                      >
                                        <i className="fa-solid fa-minus"></i>
                                      </button>
                                    </span>

                                    <span>{item.quantity}</span>
                                    <span>
                                      <button
                                        className="up-quantity"
                                        onClick={() => handleUpQuantity(index)}
                                      >
                                        <i className="fa-solid fa-plus"></i>
                                      </button>
                                    </span>
                                  </div>
                                  <button
                                    className="remove-item"
                                    onClick={() => handleDeleteItem(index)}
                                  >
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

                        <div className="cart-summary__body">
                          <div className="cart-summary__row">
                            <span>
                              Tạm tính ({summary?.totalQuantity || 0 || 0} sản
                              phẩm)
                            </span>
                            <span>{formatPrice(summary?.subtotal || 0)}</span>
                          </div>
                          <div className="cart-summary__row">
                            <span>Giảm giá trực tiếp</span>
                            <span>
                              - {formatPrice(summary?.productDiscount || 0)}
                            </span>
                          </div>

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
                          <button
                            onClick={() => handleSubmit()}
                            className="btn-primary btn-block"
                          >
                            Đặt hàng
                          </button>
                          <Link to="/" className="cart-summary__continue">
                            <i className="fa-solid fa-arrow-left"></i>
                            Tiếp tục mua sắm
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="cart-empty">
                      <p>Giỏ hàng đang trống</p>
                      <Link to="/">Tiếp tục mua sắm</Link>
                    </div>{" "}
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
export default Cart;

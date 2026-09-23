import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductDetail } from "../../../../services/client/product.services";
import Gallery from "../../../../components/client/Gallery/Gallery";
import "./ProductDetail.scss";
import ProductSpecifications from "../../../../components/client/ProductSpecifications/ProductSpecifications";
import ProductDescription from "../../../../components/client/ProductSpecifications/ProductDescription";
import ProductRelated from "../../../../components/client/ProductRelated/ProductRelated";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setCart } from "../../../../actions/cartActions";
import { addCart, getCart } from "../../../../services/client/cart.services";
import { message } from "antd";

function ProductDetail() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const { slugProduct } = useParams();

  const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);

  const getVariantAttributes = (variant) => {
    let ram = "";
    let storage = "";
    let color = "";

    variant?.attributes?.forEach((attribute) => {
      const key = attribute.key?.toLowerCase();
      if (key === "ram") ram = attribute.value;
      if (key === "storage") storage = attribute.value;
      if (key === "color") color = attribute.value;
    });

    const version = `${ram ? `${ram}/` : ""}${storage}`;
    return { version, color };
  };

  const isVariantInStock = (variant) => {
    if (!variant) return false;
    if (variant.stock !== undefined) return variant.stock > 0;
    return true;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const result = await getProductDetail(slugProduct);

        if (result?.code === 200 && result?.data) {
          setData(result.data);

          const variants = result.data.variants || [];
          if (variants.length > 0) {
            const firstAvailableVariant =
              variants.find((v) => isVariantInStock(v)) || variants[0];

            const { version, color } = getVariantAttributes(
              firstAvailableVariant,
            );
            setSelectedVersion(version);
            setSelectedColor(color);
          }
        } else {
          setData(null);
          setSelectedVersion("");
          setSelectedColor("");
        }
      } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);
        setData(null);
        setSelectedVersion("");
        setSelectedColor("");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slugProduct]);

  const versions = [];
  const colors = [];

  if (data?.variants) {
    data.variants.forEach((variant) => {
      const { version, color } = getVariantAttributes(variant);
      if (version && !versions.some((item) => item.version === version)) {
        versions.push({
          version: version,
          price: variant.priceNew,
        });
      }

      if (color && !colors.includes(color)) {
        colors.push(color);
      }
    });
  }

  const selectedVariant =
    data?.variants?.find((variant) => {
      const { version, color } = getVariantAttributes(variant);
      return (
        (!selectedVersion || version === selectedVersion) &&
        (!selectedColor || color === selectedColor)
      );
    }) ||
    data?.variants?.[0] ||
    null;

  const isCurrentInStock = isVariantInStock(selectedVariant); // kiểm tra phiên bản lựa chọn còn hàng k

  const handleVersionChange = (newVersion) => {
    setSelectedVersion(newVersion);

    const availableVariants = data?.variants?.filter((v) => {
      const { version } = getVariantAttributes(v);
      return version === newVersion && isVariantInStock(v);
    });

    const isColorStillAvailable = availableVariants?.some((v) => {
      const { color } = getVariantAttributes(v);
      return color === selectedColor;
    });

    // Nếu màu đang chọn KHÔNG thuộc version mới -> Tự nhảy sang màu khả dụng đầu tiên
    if (!isColorStillAvailable && availableVariants?.length > 0) {
      const firstAvailableColor = getVariantAttributes(
        availableVariants[0],
      ).color;
      setSelectedColor(firstAvailableColor);
    }
  };

  // Khi chọn lại Màu sắc
  const handleColorChange = (newColor) => {
    setSelectedColor(newColor);
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "Liên hệ";
    }
    return `${new Intl.NumberFormat("vi-VN").format(price)}đ`;
  };

  const dispatch = useDispatch();
  const handleAddToCart = async () => {
    try {
      const item = {
        productId: data.product._id,
        variantId: selectedVariant._id,
        quantity: 1,
      };
      if (!isLoggedIn) {
        dispatch(addToCart(item));
      } else {
        const result = await addCart(item);
        if (result?.code === 200) {
          const cartResult = await getCart();

          if (cartResult.code === 200) {
            dispatch(setCart(cartResult.data.items));
          }
          message.success("Thêm sản phẩm vào giỏ hàng thành công!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : (
        <>
          {data && (
            <div className="product-detail">
              <div className="product-detail__container">
                <div className="product-detail__breadcrumb">
                  <Link to="/">Trang chủ</Link>
                  <span>/</span>
                  <span>{data.product?.title}</span>
                </div>

                <div className="product-detail__main">
                  <div className="product-detail__gallery">
                    <Gallery
                      images={data.product?.images}
                      selectedVariant={selectedVariant}
                    />
                  </div>
                  <div className="product-detail__info">
                    <div className="product-detail__header">
                      <div className="product-detail__title">
                        {data.product?.title}
                      </div>
                      <div className="product-detail__sku">
                        <span>SKU: </span>
                        <strong>{selectedVariant?.sku}</strong>
                      </div>
                    </div>

                    {selectedVariant && (
                      <div className="product-detail__price">
                        <div className="product-detail__priceNew">
                          {formatPrice(selectedVariant.priceNew)}
                        </div>

                        <div className="product-detail__priceOld">
                          {formatPrice(selectedVariant.price)}
                        </div>

                        {selectedVariant.discount > 0 && (
                          <div className="product-detail__discount">
                            -{selectedVariant.discount}%
                          </div>
                        )}
                      </div>
                    )}

                    {/* Danh sách Phiên bản */}
                    {versions.length > 0 && (
                      <div className="product-detail__option">
                        <strong className="label">Lựa chọn phiên bản</strong>
                        <div className="product-detail__version">
                          {versions.map((verItem, index) => {
                            const isAvailable = data?.variants?.some((v) => {
                              const { version } = getVariantAttributes(v);
                              return (
                                version === verItem.version &&
                                isVariantInStock(v)
                              );
                            });

                            return (
                              <button
                                type="button"
                                key={index}
                                disabled={!isAvailable}
                                className={`item-option ${
                                  selectedVersion === verItem.version
                                    ? "active"
                                    : ""
                                } ${!isAvailable ? "disabled" : ""}`}
                                onClick={() =>
                                  handleVersionChange(verItem.version)
                                }
                              >
                                <span>{verItem.version}</span>
                                <p>{formatPrice(verItem.price)}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Danh sách Màu sắc */}
                    {colors.length > 0 && (
                      <div className="product-detail__option">
                        <strong className="label">Lựa chọn màu</strong>
                        <div className="product-detail__version">
                          {colors.map((color) => {
                            const isAvailable = data?.variants?.some((v) => {
                              const { version: vVer, color: vColor } =
                                getVariantAttributes(v);
                              return (
                                vVer === selectedVersion &&
                                vColor === color &&
                                isVariantInStock(v)
                              );
                            });

                            return (
                              <button
                                type="button"
                                key={color}
                                className={`item-option ${
                                  selectedColor === color ? "active" : ""
                                } ${!isAvailable ? "disabled" : ""}`}
                                disabled={!isAvailable}
                                onClick={() => handleColorChange(color)}
                              >
                                <p>{color}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="product-detail__order">
                      <div className="add-to__cart">
                        <button
                          type="button"
                          title={isCurrentInStock ? "Thêm vào giỏ" : "Hết hàng"}
                          disabled={!isCurrentInStock}
                          onClick={() => handleAddToCart()}
                        >
                          <i className="fa-solid fa-cart-plus"></i>
                          {isCurrentInStock ? "Thêm vào giỏ" : "Hết hàng"}
                        </button>
                      </div>

                      <div className="add-buy">
                        <button
                          type="button"
                          title={isCurrentInStock ? "Mua ngay" : "Hết hàng"}
                          disabled={!isCurrentInStock}
                        >
                          {isCurrentInStock ? "Mua ngay" : "Hết hàng"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="product-detail__content">
                  <ProductDescription data={data} />
                  <ProductSpecifications data={data} />
                </div>
              </div>

              <ProductRelated />
            </div>
          )}
        </>
      )}
    </>
  );
}

export default ProductDetail;

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductDetail } from "../../../../services/client/product.services";
import Gallery from "../../../../components/client/Gallery/Gallery";
import "./ProductDetail.scss";
import ProductSpecifications from "../../../../components/client/ProductSpecifications/ProductSpecifications";
import ProductDescription from "../../../../components/client/ProductSpecifications/ProductDescription";
import ProductRelated from "../../../../components/client/ProductRelated/ProductRelated";

function ProductDetail() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const { slugProduct } = useParams();

  // Hàm hỗ trợ bóc tách thuộc tính từ variant (xử lý không phân biệt hoa/thường)
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

  // Hàm kiểm tra variant có còn hàng hay không
  const isVariantInStock = (variant) => {
    if (!variant) return false;
    if (variant.stock !== undefined) return variant.stock > 0;
    if (variant.quantity !== undefined) return variant.quantity > 0;
    return true; // Mặc định là còn hàng nếu API chưa có trường stock/quantity
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
            // Mặc định chọn variant đầu tiên còn hàng
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

  // Lấy danh sách các phiên bản (RAM/Storage) và Màu sắc duy nhất từ data
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

  // Tìm variant khớp chính xác nhất với Version và Color đang chọn
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

  const isCurrentInStock = isVariantInStock(selectedVariant);

  // Khi chọn lại Phiên bản -> TỰ ĐỘNG chọn màu hợp lệ đầu tiên của phiên bản đó
  const handleVersionChange = (newVersion) => {
    setSelectedVersion(newVersion);

    // Lấy tất cả variant thuộc version mới này CÒN HÀNG
    const availableVariants = data?.variants?.filter((v) => {
      const { version } = getVariantAttributes(v);
      return version === newVersion && isVariantInStock(v);
    });

    // Kiểm tra xem màu đang chọn có thuộc version mới này không
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
                    <Gallery images={data.product?.images} />
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
                            // Phiên bản bấm được nếu có BẤT KỲ variant nào thuộc version này còn hàng
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
                            // Màu bấm được NẾU VÀ CHỈ NẾU màu đó có tồn tại trong Phiên bản đang được chọn (selectedVersion)
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

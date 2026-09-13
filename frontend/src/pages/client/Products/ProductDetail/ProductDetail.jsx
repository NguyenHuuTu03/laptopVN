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
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [quantity, setQuantity] = useState(1);
  const { slugProduct } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await getProductDetail(slugProduct);

        if (result.code === 200) {
          setData(result.data);

          const variants = result.data.variants;

          if (variants.length > 0) {
            const firstVariant = variants[0];

            setSelectedVariant(firstVariant);

            const defaultAttributes = {};

            let ram = "";
            let storage = "";
            let color = "";

            firstVariant.attributes.forEach((attribute) => {
              if (attribute.key === "Ram") {
                ram = attribute.value;
              }

              if (attribute.key === "Storage") {
                storage = attribute.value;
              }

              if (attribute.key === "Color") {
                color = attribute.value;
              }
            });

            defaultAttributes.version = `${ram ? ram + "/" : ""}${storage}`;
            defaultAttributes.color = color;

            setSelectedAttributes(defaultAttributes);
          }
        }
      } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);
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
      let ram = "";
      let storage = "";

      variant.attributes.forEach((attribute) => {
        if (attribute.key === "Ram") {
          ram = attribute.value;
        }

        if (attribute.key === "Storage") {
          storage = attribute.value;
        }

        if (attribute.key === "Color" && !colors.includes(attribute.value)) {
          colors.push(attribute.value);
        }
      });

      const version = `${ram ? ram + "/" : ""}${storage}`;

      if (!versions.includes(version)) {
        versions.push({
          version: version,
          price: variant.priceNew,
        });
      }
    });
  }

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
            <div className="product-detail">
              <div className="product-detail__container">
                <div className="product-detail__breadcrumb">
                  <Link to={`/`}>Trang chủ</Link>
                  <span>/</span>
                  <span>{data.product.title}</span>
                </div>

                <div className="product-detail__main">
                  <div className="product-detail__gallery">
                    <Gallery images={data.product.images} />
                  </div>
                  <div className="product-detail__info">
                    <div className="product-detail__header">
                      <div className="product-detail__title">
                        {data.product.title}
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

                    {versions.length > 0 && (
                      <div className="product-detail__option">
                        <strong className="label">Lựa chọn phiên bản</strong>
                        <div className="product-detail__version">
                          {versions.map((version, index) => (
                            <div className="item-option" key={index}>
                              <a href="#">
                                <span>{version.version}</span>
                                <p>{formatPrice(version.price)}</p>
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {colors.length > 0 && (
                      <div className="product-detail__option">
                        <strong className="label">Lựa chọn màu</strong>
                        <div className="product-detail__version">
                          {colors.map((color) => (
                            <div className="item-option">
                              <a href="#">
                                <p>{color}</p>
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="product-detail__order">
                      <div className="add-to__cart">
                        <a href="#" title="Thêm vào giỏ">
                          <i className="fa-solid fa-cart-plus"></i>
                          Thêm vào giỏ
                        </a>
                      </div>
                      <div className="add-buy">
                        <a href="#" title="Mua ngay">
                          Mua ngay
                        </a>
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

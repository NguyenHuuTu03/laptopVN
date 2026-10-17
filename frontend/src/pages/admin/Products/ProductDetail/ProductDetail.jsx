import { Col, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SwiperImage from "../../../../components/admin/SwiperImage/SwiperImage";
import { getProduct } from "../../../../services/admin/product.services";
import ProductSpe from "../../../../components/admin/ProductSpe/ProductSpe";
import VariantTable from "../../../../components/admin/VariantTable/VariantTable";

import "./ProductDetail.scss";

function ProductDetail() {
  const [loading, setLoading] = useState(false);
  const { productId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getProduct(productId);
        if (result.code === 200) {
          setData(result.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  console.log(data);
  return (
    <>
      <div className="admin-product__detail">
        <div className="admin-product__detail-header">
          <div className="admin-product__detail-title">
            <h1>Chi tiết sản phẩm</h1>
          </div>

          <div className="admin-product__detail-nav">
            <Link to="/admin/products" className="product-detail__back">
              <i className="fa-solid fa-arrow-left"></i>
              Quay lại
            </Link>
            <Link
              to={`/admin/products/edit/${data?.product._id}`}
              className="product-detail__save"
            >
              <i className="fa-solid fa-pen-to-square"></i>
              Chỉnh sửa
            </Link>
          </div>
        </div>

        <div className="admin-product__detail-main">
          <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
              <Col xs={24} xl={10}>
                <div className="section-info">
                  <div className="section-info__header">
                    <h3>Hình ảnh sản phẩm</h3>
                  </div>
                  <div className="section-info__main">
                    <div className="section-info__main-image">
                      <SwiperImage images={data?.product.images} />
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={24} xl={14}>
                <div className="section-info">
                  <div className="section-info__header">
                    <h3>Thông tin chung</h3>
                  </div>

                  <div className="section-info__main">
                    <div className="section-info__name">
                      <span>Tên sản phẩm</span>
                      <span>{data?.product.title}</span>
                    </div>
                    <div className="section-info__category">
                      <span>Danh mục</span>
                      <span>{data?.product.categoryName}</span>
                    </div>
                    <div className="section-info__brand">
                      <span>Thương hiệu</span>
                      <span>{data?.product.brandName}</span>
                    </div>
                    <div className="section-info__warranty">
                      <span>Bảo hành</span>
                      <span>{data?.product.warranty}</span>
                    </div>
                    <div className="section-info__featured">
                      <span>Nổi bật</span>
                      <span>
                        {data?.product.featured ? "Nổi bật" : "Không nổi bật"}
                      </span>
                    </div>
                    <div className="section-info__status">
                      <span>Trạng thái</span>
                      <span>
                        {data?.product.status === "active"
                          ? "Hoạt động"
                          : "Dừng hoạt động"}
                      </span>
                    </div>
                    <div className="section-info__stock">
                      <span>Tổng tồn kho</span>
                      <span>{data?.product.stock}</span>
                    </div>
                    <div className="section-info__sold">
                      <span>Tổng đã bán</span>
                      <span>{data?.product.sold}</span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <div className="section-info">
                  <div className="section-info__header">
                    <h3>Mô tả sản phẩm</h3>
                  </div>
                  <div className="section-info__main">
                    <div className="section-info__main-description">
                      {data?.product.description}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {data?.variants.length > 0 && (
              <>
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <div className="section-info">
                      <div className="section-info__header">
                        <h3>Phiên bản sản phẩm</h3>
                      </div>

                      <div className="section-info__main">
                        <VariantTable data={data?.variants} />
                      </div>
                    </div>
                  </Col>
                </Row>
              </>
            )}

            {data?.product && (
              <>
                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <div className="section-info">
                      <div className="section-info__header">
                        <h3>Thông số kỹ thuật</h3>
                      </div>

                      <div className="section-info__main">
                        <ProductSpe data={data?.product} />
                      </div>
                    </div>
                  </Col>
                </Row>
              </>
            )}
          </Spin>
        </div>
      </div>
    </>
  );
}
export default ProductDetail;

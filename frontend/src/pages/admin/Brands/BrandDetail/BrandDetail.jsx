import { Spin, Row, Col } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "./BrandDetail.scss";
import { getBrand } from "../../../../services/admin/brand.services";

function BrandDetail() {
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState(null);

  const { brandId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getBrand(brandId);
        if (result.code === 200) {
          const data = result.data.brand;
          setBrand(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [brandId]);
  return (
    <>
      <div className="brand-detail">
        <div className="brand-detail__header">
          <div className="brand-detail__title">
            <h1>Chi tiết thương hiệu</h1>
          </div>

          <div className="brand-detail__nav">
            <Link to="/admin/brands" className="brand-detail__back">
              <i className="fa-solid fa-arrow-left"></i>
              Quay lại
            </Link>
            <Link
              to={`/admin/brands/edit/${brand?._id}`}
              className="brand-detail__save"
            >
              <i className="fa-solid fa-pen-to-square"></i>
              Chỉnh sửa
            </Link>
          </div>
        </div>

        <div className="brand-detail__main">
          <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
              <Col xs={24} xl={8}>
                <div className="section-info">
                  <div className="section-info__image">
                    <img src={brand?.thumbnail} alt={brand?.title} />
                  </div>
                  <div className="section-info__title">
                    <h3>Logo thương hiệu Asus</h3>
                  </div>

                  <div className="section-info__status">
                    <span>Trạng thái</span>
                    <span
                      className={
                        brand?.status === "active" ? "active" : "inactive"
                      }
                    >
                      {brand?.status === "active"
                        ? "Hoạt động"
                        : "Dừng hoạt động"}
                    </span>
                  </div>
                </div>
              </Col>

              <Col xs={24} xl={16}>
                <div className="section-info">
                  <div className="section-info__header">
                    <h3>Thông tin thương hiệu</h3>
                  </div>

                  <div className="section-info__main">
                    <div className="section-info__nav">
                      <div className="section-info__nav-icon">
                        <i className="fa-solid fa-award"></i>
                      </div>
                      <div className="section-info__nav-content">
                        <span>Tên thương hiệu</span>
                        <span>{brand?.title}</span>
                      </div>
                    </div>
                    <div className="section-info__nav">
                      <div className="section-info__nav-icon">
                        <i className="fa-solid fa-earth-europe"></i>
                      </div>
                      <div className="section-info__nav-content">
                        <span>Quốc gia</span>
                        <span>{brand?.country}</span>
                      </div>
                    </div>
                    <div className="section-info__nav">
                      <div className="section-info__nav-icon">
                        <i className="fa-solid fa-link"></i>
                      </div>
                      <div className="section-info__nav-content">
                        <span>Website</span>
                        <span>{brand?.website}</span>
                      </div>
                    </div>
                    <div className="section-info__nav">
                      <div className="section-info__nav-icon">
                        <i className="fa-solid fa-list"></i>
                      </div>
                      <div className="section-info__nav-content">
                        <span>Mô tả thương hiệu</span>
                        <span>{brand?.description}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Spin>
        </div>
      </div>
    </>
  );
}
export default BrandDetail;

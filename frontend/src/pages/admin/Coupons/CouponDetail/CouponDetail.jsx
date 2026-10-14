import { Col, Progress, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "./CouponDetail.scss";
import { getCoupon } from "../../../../services/admin/coupon.services";

function CouponDetail() {
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const { couponId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getCoupon(couponId);

        if (result.code === 200) {
          setCoupon(result.data.coupon);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [couponId]);

  const formatType = (type) => {
    switch (type) {
      case "percent":
        return "Phần trăm (%)";
      case "fixed":
        return "Cố định";
      default:
        return "Không xác định";
    }
  };

  const formatDate = (date) => {
    if (!date) return "Chưa cập nhật";

    return new Date(date).toLocaleDateString("vi-VN");
  };

  const percent = (coupon) => {
    return Math.min(
      Math.round((coupon?.usedCount / coupon?.quantity) * 100),
      100,
    );
  };
  return (
    <>
      <div className="coupon-detail">
        <div className="coupon-detail__header">
          <div className="coupon-detail__title">
            <h1>Chi tiết mã giảm giá</h1>
          </div>

          <div className="coupon-detail__nav">
            <Link to="/admin/coupons" className="coupon-detail__back">
              <i className="fa-solid fa-arrow-left"></i>
              Quay lại
            </Link>
            <Link
              to={`/admin/coupons/edit/${coupon?._id}`}
              className="coupon-detail__save"
            >
              <i className="fa-solid fa-pen-to-square"></i>
              Chỉnh sửa
            </Link>
          </div>
        </div>

        <div className="coupon-detail__main">
          <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
              <Col xs={24} xl={8}>
                <div className="section-info">
                  <div className="section-info__header">
                    <h3>Thông tin chung</h3>
                  </div>
                  <div className="section-info__main">
                    <div className="section-info__nav">
                      <div className="section-info__nav-icon">
                        <i className="fa-solid fa-ticket"></i>
                      </div>

                      <div className="section-info__nav-content">
                        <span>Mã giảm giá</span>
                        <span>{coupon?.code}</span>
                      </div>
                    </div>
                    <div className="section-info__nav">
                      <div className="section-info__nav-icon">
                        <i className="fa-regular fa-circle-dot"></i>
                      </div>

                      <div className="section-info__nav-content">
                        <span>Trạng thái</span>
                        <span>
                          {coupon?.status ? "Hoạt động" : "Dừng hoạt động"}
                        </span>
                      </div>
                    </div>
                    <div className="section-info__nav">
                      <div className="section-info__nav-icon">
                        <i className="fa-solid fa-list-ul"></i>
                      </div>

                      <div className="section-info__nav-content">
                        <span>Mô tả</span>
                        <span>{coupon?.description}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={24} xl={8}>
                <div className="section-info">
                  <div className="section-info__header">
                    <h3>Thông tin giảm giá</h3>
                  </div>
                  <div className="section-info__main">
                    <div className="section-info__nav">
                      <div className="section-info__nav-icon">
                        <i className="fa-solid fa-ticket-simple"></i>
                      </div>

                      <div className="section-info__nav-content">
                        <span>Loại giảm giá</span>
                        <span>{formatType(coupon?.discountType)}</span>
                      </div>
                    </div>
                    <div className="section-info__nav">
                      <div className="section-info__nav-icon">
                        <i className="fa-solid fa-percent"></i>
                      </div>

                      <div className="section-info__nav-content">
                        <span>Giá trị giảm</span>
                        <span>{coupon?.discountValue}</span>
                      </div>
                    </div>
                    <div className="section-info__nav">
                      <div className="section-info__nav-icon">
                        <i className="fa-brands fa-stubber"></i>
                      </div>

                      <div className="section-info__nav-content">
                        <span>Đơn tối thiểu</span>
                        <span>{coupon?.minOrderValue}</span>
                      </div>
                    </div>
                    <div className="section-info__nav">
                      <div className="section-info__nav-icon">
                        <i className="fa-solid fa-money-bill-trend-up"></i>
                      </div>

                      <div className="section-info__nav-content">
                        <span>Giảm tối đa</span>
                        <span>{coupon?.maxDiscount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={24} xl={8}>
                <div className="section-info">
                  <div className="section-info__header">
                    <h3>Thời gian và lượt sử dụng</h3>
                  </div>
                  <div className="section-info__main">
                    <div className="section-info__nav">
                      <div className="section-info__nav-icon">
                        <i className="fa-regular fa-calendar-days"></i>
                      </div>

                      <div className="section-info__nav-content">
                        <span>Ngày bắt đầu</span>
                        <span>{formatDate(coupon?.startDate)}</span>
                      </div>
                    </div>
                    <div className="section-info__nav">
                      <div className="section-info__nav-icon">
                        <i className="fa-regular fa-calendar-days"></i>
                      </div>

                      <div className="section-info__nav-content">
                        <span>Ngày kết thúc</span>
                        <span>{formatDate(coupon?.endDate)}</span>
                      </div>
                    </div>
                    <div className="section-info__nav">
                      <div className="section-info__nav-icon">
                        <i className="fa-solid fa-bars-progress"></i>
                      </div>

                      <div className="section-info__nav-content">
                        <span>Tiến độ sử dụng</span>
                        <span>
                          <Progress
                            percent={percent(coupon)}
                            format={() =>
                              `${coupon?.usedCount} / ${coupon?.quantity} lượt`
                            }
                          />
                        </span>
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
export default CouponDetail;

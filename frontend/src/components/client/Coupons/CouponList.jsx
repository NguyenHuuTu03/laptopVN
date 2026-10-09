import { useEffect, useState } from "react";
import "./CouponList.scss";
import { getCoupons } from "../../../services/client/coupon.services";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";

import { Modal, notification } from "antd";

function CouponList() {
  const [coupons, setCoupons] = useState([]);

  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isModal, setIsModal] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      const result = await getCoupons();
      if (result.code === 200) {
        setCoupons(result.data.coupons);
      }
    };
    fetchCoupons();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const handleCondition = (coupon) => {
    setSelectedCoupon(coupon);
    setIsModal(true);
  };

  const handleCloseCondition = () => {
    setSelectedCoupon(null);
    setIsModal(false);
  };

  const handleCopyCoupon = async (coupon) => {
    if (!coupon.code) return;
    try {
      await navigator.clipboard.writeText(coupon.code);
      notification.success({
        title: "Đã sao chép mã giảm giá!",
      });
    } catch {
      notification.success({
        title: "Không thể sao chép mã giảm giá!",
      });
    }
  };
  return (
    <>
      {/* {coupons.length > 0 && (
        <>
          <div className="coupon-card">
            {coupons.map((coupon, index) => (
              <div className="coupon-box" key={index}>
                <div className="coupon-box__header">
                  <span>Mã: {coupon.code}</span>
                  <span>HSD: {formatDate(coupon.endDate)}</span>
                </div>
                <div className="coupon-box__content">
                  <span>{coupon.description}</span>
                </div>
                <div className="coupon-box__action">
                  <button>Điều kiện</button>
                  <button>Sao chép</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )} */}
      <div className="coupon-card">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={16}
          slidesPerView={5}
          loop={false}
          className="coupon__swiper"
          breakpoints={{
            0: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            576: {
              slidesPerView: 2,
              spaceBetween: 12,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 14,
            },
            992: {
              slidesPerView: 4,
              spaceBetween: 16,
            },
          }}
        >
          {coupons.map((coupon, index) => (
            <SwiperSlide key={index}>
              <div className="coupon-box__header">
                <span>Mã: {coupon.code}</span>
                <span>HSD: {formatDate(coupon.endDate)}</span>
              </div>
              <div className="coupon-box__content">
                <span>{coupon.description}</span>
              </div>
              <div className="coupon-box__action">
                <button onClick={() => handleCondition(coupon)}>
                  Điều kiện
                </button>
                <button onClick={() => handleCopyCoupon(coupon)}>
                  Sao chép
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <Modal
          open={isModal}
          footer={null}
          onCancel={handleCloseCondition}
          closable={true}
          className="coupon-condition-modal"
        >
          {selectedCoupon && (
            <div className="coupon-condition">
              <h3 className="coupon-condition__code">
                Mã: {selectedCoupon.code}
              </h3>

              <div className="coupon-condition__description">
                {selectedCoupon.description}
              </div>

              <div className="coupon-condition__requirement">
                Giá trị đơn hàng ≥
                {Number(selectedCoupon.minOrderValue).toLocaleString()}đ
              </div>

              <div className="coupon-condition__actions">
                <button
                  className="coupon-condition__close"
                  onClick={handleCloseCondition}
                >
                  Đóng
                </button>

                <button
                  className="coupon-condition__copy"
                  onClick={() => handleCopyCoupon(selectedCoupon)}
                >
                  Sao chép
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
export default CouponList;

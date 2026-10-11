import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import { useSelector } from "react-redux";

import "./Banner.scss";

function Banner() {
  const setting = useSelector((state) => state.settingReducer);
  const banners = setting.sideBar.map((item, index) => ({
    id: index,
    image: item,
    title: `Banner-${index}`,
  }));

  return (
    <div className="banner">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="banner__item">
              <img src={banner.image} alt={banner.title} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Banner;

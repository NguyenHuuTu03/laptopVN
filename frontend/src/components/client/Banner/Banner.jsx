import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import banner1 from "../../../assets/images/banner4.jpg";
import banner2 from "../../../assets/images/banner2.png";
import banner3 from "../../../assets/images/banner7.webp";
import banner4 from "../../../assets/images/banner8.webp";
import banner5 from "../../../assets/images/banner9.webp";

import "./Banner.scss";

const banners = [
  {
    id: 1,
    image: banner1,
    title: "Quảng cáo",
  },
  {
    id: 2,
    image: banner2,
    title: "Quảng cáo",
  },
  {
    id: 3,
    image: banner3,
    title: "Quảng cáo",
  },
  {
    id: 4,
    image: banner4,
    title: "Quảng cáo",
  },
  {
    id: 5,
    image: banner5,
    title: "Quảng cáo",
  },
];

function Banner() {
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

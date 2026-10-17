import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./SwiperImage.scss";

import { FreeMode, Navigation, Thumbs } from "swiper/modules";

function SwiperImage({ images = [] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <>
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
        loop={images.length > 1}
        spaceBetween={10}
        navigation={true}
        thumbs={{
          swiper: thumbsSwiper,
        }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="images__main"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image} alt={`Ảnh sản phẩm ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>

      {images.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          loop={images.length > 4}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="images__thumbs"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} alt={`Image-${index + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
}

export default SwiperImage;

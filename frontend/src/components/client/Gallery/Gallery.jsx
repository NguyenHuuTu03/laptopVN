import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./Gallery.scss";

import { FreeMode, Navigation, Thumbs } from "swiper/modules";

function Gallery({ images = [], selectedVariant }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const mainSwiperRef = useRef(null);

  useEffect(() => {
    if (!selectedVariant || !mainSwiperRef.current) return;

    const variantImage = selectedVariant.thumbnail;

    if (!variantImage) return;

    const index = images.findIndex((img) => {
      return img === variantImage;
    });

    if (index !== -1) {
      mainSwiperRef.current.slideTo(index);
    }
  }, [selectedVariant, images]);

  return (
    <>
      <Swiper
        onSwiper={(swiper) => {
          mainSwiperRef.current = swiper;
        }}
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
        loop={false}
        spaceBetween={10}
        navigation={true}
        thumbs={{
          swiper: thumbsSwiper,
        }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="gallery__main"
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
          loop={false}
          spaceBetween={10}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="gallery__thumbs"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} alt={`Thumbnail ${index + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
}

export default Gallery;

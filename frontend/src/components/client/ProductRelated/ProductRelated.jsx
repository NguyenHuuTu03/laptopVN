import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";

import { useParams } from "react-router-dom";
import { getProductRelated } from "../../../services/client/product.services";
import ProductCard from "../ProductCard/ProductCard";

import "./ProductRelated.scss";

function ProductRelated() {
  const [related, setRelated] = useState([]);
  const { slugProduct } = useParams();

  useEffect(() => {
    const fetchProductRelated = async () => {
      try {
        const result = await getProductRelated(slugProduct);

        if (result.code === 200) {
          setRelated(result.data.products);
        }
      } catch (error) {
        console.error("Lỗi lấy sản phẩm liên quan:", error);
      }
    };

    if (slugProduct) {
      fetchProductRelated();
    }
  }, [slugProduct]);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="product-related">
      <div className="product-related__header">
        <h2 className="product-related__title">Sản phẩm liên quan</h2>
      </div>

      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={16}
        slidesPerView={5}
        loop={false}
        className="product-related__swiper"
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
            slidesPerView: 5,
            spaceBetween: 16,
          },
        }}
      >
        {related.map((item) => (
          <SwiperSlide key={item._id}>
            <ProductCard product={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default ProductRelated;

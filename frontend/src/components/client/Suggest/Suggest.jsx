import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { suggestProducts } from "../../../services/client/product.services";

import "./Suggest.scss";

function Suggest({ keyword, onSelect }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const value = keyword.trim();

    if (!value) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const data = await suggestProducts(value);
        setProducts(data);
      } catch (error) {
        console.error("Lỗi suggest:", error);
        setProducts([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  if (!keyword.trim() || products.length === 0) {
    return null;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  return (
    <div className="search-suggest">
      {/* TITLE */}
      <div className="search-suggest__title">Kết quả tìm kiếm</div>

      {/* LIST */}
      <div className="search-suggest__list">
        {products.slice(0, 5).map((product) => (
          <Link
            key={product._id}
            to={`/products/${product.slug}`}
            className="suggest-item"
            onClick={onSelect}
          >
            {/* IMAGE */}
            <div className="suggest-item__image">
              <img src={product.thumbnail} alt={product.title} />
            </div>

            {/* INFO */}
            <div className="suggest-item__info">
              <div className="suggest-item__title">{product.title}</div>

              <div className="suggest-item__price">
                {product.newPrice
                  ? formatPrice(product.newPrice)
                  : formatPrice(product.price)}

                {product.discount > 0 && product.price && (
                  <span className="suggest-item__old-price">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* VIEW ALL */}
      <Link
        to={`/products?keyword=${keyword}`}
        className="search-suggest__view-all"
        onClick={onSelect}
      >
        <span>
          <i className="fa-solid fa-arrow-right-long"></i>
        </span>
        Xem tất cả kết quả cho "{keyword}"
      </Link>
    </div>
  );
}

export default Suggest;

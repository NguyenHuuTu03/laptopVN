import { Link } from "react-router-dom";
import { Tag } from "antd";
import "./ProductCard.scss";

function ProductCard(props) {
  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "Liên hệ";
    }

    return `${new Intl.NumberFormat("vi-VN").format(price)}đ`;
  };

  const hasDiscount = props.product.discount > 0;

  return (
    <Link to={`/products/${props.product.slug}`} className="product-card">
      <div className="product-card__image">
        <img src={props.product.thumbnail} alt={props.product.title} />

        {hasDiscount && (
          <Tag color="red" className="product-card__discount">
            -{props.product.discount}%
          </Tag>
        )}
      </div>

      <div className="product-card__content">
        <h3 className="product-card__title">{props.product.title}</h3>

        <div className="product-card__price">
          <span className="product-card__price-current">
            {formatPrice(props.product.newPrice)}
          </span>

          {hasDiscount && (
            <span className="product-card__price-old">
              {formatPrice(props.product.price)}
            </span>
          )}
        </div>

        <div className="product-card__bottom">
          {props.product.warranty && (
            <span className="product-card__info">
              Bảo hành {props.product.warranty}
            </span>
          )}

          <span className="product-card__info">Chính hãng</span>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;

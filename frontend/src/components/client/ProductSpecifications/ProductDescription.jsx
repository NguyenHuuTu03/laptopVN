import "./ProductDescription.scss";
function ProductDescription({ data }) {
  return (
    <>
      <div className="product-detail__description">
        <div className="product-description__header">
          <i className="fa-solid fa-bars"></i>
          <div className="description">
            <span>Thông tin sản phẩm</span>
          </div>
        </div>

        <div className="product-description__content">
          <p>{data.product.description}</p>
        </div>
      </div>
    </>
  );
}
export default ProductDescription;

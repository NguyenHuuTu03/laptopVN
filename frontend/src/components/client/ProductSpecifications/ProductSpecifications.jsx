import { Collapse } from "antd";

import "./ProductSpecifications.scss";

function ProductSpecifications({ data }) {
  const specifications = data.product.specifications;
  const items = specifications.map((spec, index) => ({
    key: String(index + 1),
    label: spec.group,
    children: (
      <div className="specs-list">
        {spec.items.map((item, itemIndex) => (
          <div className="specs-item" key={itemIndex}>
            <div className="specs-label">{item.key}</div>
            <div className="specs-value">{item.value}</div>
          </div>
        ))}
      </div>
    ),
  }));

  return (
    <div className="product-detail__technical">
      <div className="product-technical__header">
        <i className="fa-solid fa-gear"></i>
        <div className="description">
          <span>Thông số kỹ thuật</span>
        </div>
      </div>
      <div className="product-technical__content">
        <Collapse items={items} defaultActiveKey={["1"]} />
      </div>
    </div>
  );
}
export default ProductSpecifications;

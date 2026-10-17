import { Collapse } from "antd";

import "./ProductSpe.scss";

function ProductSpe({ data }) {
  const specifications = data?.specifications;
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

  return <Collapse items={items} defaultActiveKey={["1"]} />;
}
export default ProductSpe;

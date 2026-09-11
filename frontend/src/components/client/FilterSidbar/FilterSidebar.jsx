import { Checkbox, Collapse, Radio } from "antd";

import "./FilterSidebar.scss";
import { useEffect, useState } from "react";
import { getAllBrands } from "../../../services/client/brand.services";

function FilterSidebar({
  selectedBrandIds,
  selectedPrice,
  onBrandChange,
  onPriceChange,
}) {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const brandData = await getAllBrands();
      setBrands(brandData);
    };
    fetchBrands();
  }, []);
  const options = brands.map((brand) => ({
    label: brand.title,
    value: brand.slug,
  }));

  // Chọn hãng
  const handleBrandChange = (brandIds) => {
    onBrandChange(brandIds);
  };
  // Chọn khoảng giá
  const handlePriceChange = (e) => {
    const value = e.target.value;

    const [minPrice, maxPrice] = value.split("-");

    onPriceChange(Number(minPrice), Number(maxPrice));
  };

  const items = [
    {
      key: "brand",
      label: "Hãng sản xuất",
      children: (
        <div className="filter-group">
          <Checkbox.Group
            className="filter-checkbox"
            value={selectedBrandIds}
            options={options}
            onChange={handleBrandChange}
          />
        </div>
      ),
    },
    {
      key: "price",
      label: "Khoảng giá",
      children: (
        <div className="filter-group">
          <Radio.Group
            onChange={handlePriceChange}
            value={selectedPrice}
            className="filter-radio"
            options={[
              { label: "Từ 10 triệu - 20 triệu", value: "10000000-20000000" },
              { label: "Từ 20 triệu - 30 triệu", value: "20000000-30000000" },
              { label: "Từ 30 triệu - 40 triệu", value: "30000000-40000000" },
              { label: "Từ 40 triệu - 60 triệu", value: "40000000-60000000" },
              { label: "Từ 60 triệu - 250 triệu", value: "60000000-250000000" },
            ]}
          />
        </div>
      ),
    },
  ];
  return (
    <aside className="filter-sidebar">
      {/* Header */}
      <div className="filter-sidebar__header">
        <div className="filter-sidebar__title">
          <i className="fa-solid fa-sliders"></i>
          <span>Bộ lọc tìm kiếm</span>
        </div>
      </div>

      <Collapse items={items} defaultActiveKey={["brand", "price"]} />
    </aside>
  );
}

export default FilterSidebar;

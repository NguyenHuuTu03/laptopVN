import { Checkbox, Collapse, Radio } from "antd";
import "./FilterSidebar.scss";
import { useEffect, useState } from "react";
import {
  getAllBrands,
  getBrands,
  getCategoryBySlug,
} from "../../../services/client/brand.services";
import { useLocation, useParams } from "react-router-dom";
import { getCategories } from "../../../services/client/category.services";

function FilterSidebar({
  selectedBrand,
  selectedPrice,
  selectedCategory,
  onBrandChange,
  onPriceChange,
  onCategoryChange,
}) {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const { slug } = useParams();
  const location = useLocation();
  const isAllProductsPage = location.pathname === "/products";

  useEffect(() => {
    const fetchBrandsAndCategories = async () => {
      try {
        let brandData = [];
        let categoryData = [];

        // Nếu đang ở /collections/:slug
        if (slug) {
          const category = await getCategoryBySlug(slug);
          if (category) {
            brandData = await getBrands(category._id);
          }
        }
        // Nếu đang ở /products
        else {
          brandData = await getAllBrands();
          categoryData = await getCategories();
        }

        setBrands(brandData);
        setCategories(categoryData);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu sidebar:", error);
        setBrands([]);
        setCategories([]);
      }
    };

    fetchBrandsAndCategories();
  }, [slug]);

  const options = brands.map((brand) => ({
    label: brand.title,
    value: brand.slug,
  }));

  const optionCategories = categories.map((category) => ({
    label: category.title,
    value: category.slug,
  }));

  // Chọn hãng
  const handleBrandChange = (brandSlugs) => {
    onBrandChange(brandSlugs);
  };

  // Chọn khoảng giá
  const handlePriceChange = (e) => {
    const value = e.target.value;
    const [minPrice, maxPrice] = value.split("-");
    onPriceChange(Number(minPrice), Number(maxPrice));
  };

  // Tạo danh sách items cho Collapse
  const items = [
    ...(isAllProductsPage
      ? [
          {
            key: "category",
            label: "Danh mục",
            children: (
              <div className="filter-group">
                <Checkbox.Group
                  className="filter-checkbox"
                  value={selectedCategory}
                  options={optionCategories}
                  onChange={onCategoryChange}
                />
              </div>
            ),
          },
        ]
      : []),

    {
      key: "brand",
      label: "Hãng sản xuất",
      children: (
        <div className="filter-group">
          <Checkbox.Group
            className="filter-checkbox"
            value={selectedBrand}
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
              {
                label: "Từ 1 triệu - 10 triệu",
                value: "1000000-10000000",
              },
              {
                label: "Từ 10 triệu - 20 triệu",
                value: "10000000-20000000",
              },
              {
                label: "Từ 20 triệu - 30 triệu",
                value: "20000000-30000000",
              },
              {
                label: "Từ 30 triệu - 40 triệu",
                value: "30000000-40000000",
              },
              {
                label: "Từ 40 triệu - 60 triệu",
                value: "40000000-60000000",
              },
              {
                label: "Từ 60 triệu - 250 triệu",
                value: "60000000-250000000",
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar__header">
        <div className="filter-sidebar__title">
          <i className="fa-solid fa-sliders"></i>
          <span>Bộ lọc tìm kiếm</span>
        </div>
      </div>

      <Collapse
        items={items}
        defaultActiveKey={["category", "brand", "price"]}
      />
    </aside>
  );
}

export default FilterSidebar;

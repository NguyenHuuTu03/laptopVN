// import { Menu } from "antd";
import {
  LaptopOutlined,
  DesktopOutlined,
  AppstoreOutlined,
  ToolOutlined,
  CustomerServiceOutlined,
  RightOutlined,
  GiftOutlined,
} from "@ant-design/icons";

import { Mouse, Keyboard, Speaker, Smartphone } from "lucide-react";
import "./CategoryMenu.scss";
import { useEffect, useState } from "react";
import { getCategories } from "../../../services/client/category.services";
import { Link } from "react-router-dom";
import { getBrands } from "../../../services/client/brand.services";

function CategoryMenu() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();

        setCategories(data);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryIcon = (category) => {
    switch (category.slug) {
      case "laptop":
        return <LaptopOutlined />;

      case "pc":
        return <DesktopOutlined />;

      case "man-hinh":
        return <DesktopOutlined />;
      case "dien-thoai":
        return <Smartphone />;

      case "ban-phim":
        return <Keyboard size={18} />;

      case "chuot-may-tinh":
        return <Mouse size={18} />;

      case "tai-nghe":
        return <CustomerServiceOutlined />;

      case "phu-kien-may-tinh":
        return <GiftOutlined />;

      case "linh-kien-may-tinh":
        return <ToolOutlined />;
      case "loa-may-tinh":
        return <Speaker />;

      default:
        return <AppstoreOutlined />;
    }
  };

  const handleMouseEnter = async (category) => {
    setActiveCategory(category);
    setBrands([]);
    setLoading(true);

    try {
      const data = await getBrands(category._id);

      setBrands(data);
    } catch (error) {
      console.error("Lỗi lấy thương hiệu:", error);

      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="category-menu"
      onMouseLeave={() => {
        setActiveCategory(null);
        setBrands([]);
      }}
    >
      {/* CATEGORY */}
      <div className="category-menu__list">
        {categories.map((category) => (
          <Link
            to={`/collections/${category.slug}`}
            key={category._id}
            className={`category-menu__item ${
              activeCategory?._id === category._id ? "is-active" : ""
            }`}
            onMouseEnter={() => handleMouseEnter(category)}
          >
            <div className="category-menu__item-left">
              {getCategoryIcon(category)}

              <span>{category.title}</span>
            </div>

            <RightOutlined />
          </Link>
        ))}
      </div>

      {/* BRAND */}
      {activeCategory && (
        <div className="category-menu__brands">
          <h3>Thương hiệu {activeCategory.title}</h3>

          {loading ? (
            <div className="category-menu__loading">
              Đang tải thương hiệu...
            </div>
          ) : brands.length > 0 ? (
            <div className="category-menu__brand-list">
              {brands.map((brand) => (
                <Link
                  key={brand._id}
                  to={`/collections/${activeCategory.slug}?brand=${brand.slug}`}
                >
                  {brand.title}
                </Link>
              ))}
            </div>
          ) : (
            <div className="category-menu__empty">Chưa có thương hiệu</div>
          )}
        </div>
      )}
    </div>
  );
}

export default CategoryMenu;

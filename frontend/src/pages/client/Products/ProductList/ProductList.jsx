import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { getCollectionProducts } from "../../../../services/client/product.services";
import ProductCard from "../../../../components/client/ProductCard/ProductCard";
import banner from "../../../../assets/images/banner10.webp";
import "./ProductList.scss";
import FilterSidebar from "../../../../components/client/FilterSidbar/FilterSidebar";

function ProductList() {
  const { slug } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    brands: [],
    minPrice: undefined,
    maxPrice: undefined,
  });

  const brandIds = searchParams.get("brand")?.split(",").filter(Boolean) || [];

  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = {
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
        };

        // Nếu có chọn hãng
        if (filters.brands.length > 0) {
          params.brand = filters.brands.join(",");
        }

        console.log("params:", params);

        const data = await getCollectionProducts(slug, params);

        setProducts(data);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug, filters]);

  const selectedPrice =
    minPrice && maxPrice ? `${minPrice}-${maxPrice}` : undefined;

  const handleBrandChange = (brand) => {
    setFilters((prev) => ({
      ...prev,
      brands: brand,
    }));

    const params = new URLSearchParams(searchParams);

    if (brand.length > 0) {
      params.set("brand", brand.join(","));
    } else {
      params.delete("brand");
    }

    setSearchParams(params);
  };

  // Khi chọn giá
  const handlePriceChange = (minPrice, maxPrice) => {
    setFilters((prev) => ({
      ...prev,
      minPrice,
      maxPrice,
    }));

    const params = new URLSearchParams(searchParams);

    params.set("minPrice", minPrice);
    params.set("maxPrice", maxPrice);

    setSearchParams(params);
  };

  return (
    <div className="product-list">
      <div className="product-list__container">
        {/* Breadcrumb */}
        <div className="product-list__breadcrumb">
          <span>Trang chủ</span>
          <span>/</span>
          <span>{slug}</span>
        </div>

        {/* Title */}
        <h1 className="product-list__title">
          {slug.charAt(0).toUpperCase() + slug.slice(1)}
        </h1>

        {/* Banner */}
        <div className="product-list__banner">
          <img src={banner} alt="Banner" />
        </div>

        {/* Main */}
        <div className="product-list__main">
          {/* Sidebar */}
          <FilterSidebar
            selectedBrandIds={brandIds}
            selectedPrice={selectedPrice}
            onBrandChange={handleBrandChange}
            onPriceChange={handlePriceChange}
          />

          {/* Products */}
          <section className="product-list__content">
            {/* Toolbar */}
            <div className="product-list__toolbar">
              <div className="product-list__result">
                Tìm thấy <strong>{products.length}</strong> kết quả
              </div>

              <div className="product-list__sort">
                <button className="active">Mới nhất</button>

                <span>•</span>

                <button>Giá tăng dần</button>

                <span>•</span>

                <button>Giá giảm dần</button>

                <span>•</span>

                <button>Tên A-Z</button>
              </div>
            </div>

            {/* Product grid */}
            {loading ? (
              <div className="product-list__loading">Đang tải sản phẩm...</div>
            ) : (
              <div className="product-list__products">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProductList;

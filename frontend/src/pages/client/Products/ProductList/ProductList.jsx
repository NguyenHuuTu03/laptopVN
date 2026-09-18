import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  getAllProducts,
  getCollectionProducts,
} from "../../../../services/client/product.services";
import ProductCard from "../../../../components/client/ProductCard/ProductCard";
import banner from "../../../../assets/images/banner4.jpg";
import "./ProductList.scss";
import FilterSidebar from "../../../../components/client/FilterSidebar/FilterSidebar";
import Pagination from "../../../../components/client/Pagination/Pagination";

function ProductList() {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 12,
    totalProducts: 0,
    totalPages: 0,
  });

  const location = useLocation();
  const isAllProductsPage = location.pathname === "/products";

  // Lấy dữ liệu filter trực tiếp từ URL
  const brandSlugs =
    searchParams.get("brand")?.split(",").filter(Boolean) || [];
  const categorySlugs =
    searchParams.get("category")?.split(",").filter(Boolean) || [];
  const keyword = searchParams.get("keyword") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const selectedPrice =
    minPrice && maxPrice ? `${minPrice}-${maxPrice}` : undefined;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = {};

        if (keyword) {
          params.keyword = keyword;
        }

        if (brandSlugs.length > 0) {
          params.brand = brandSlugs.join(",");
        }
        if (isAllProductsPage && categorySlugs.length > 0) {
          params.category = categorySlugs.join(",");
        }
        if (minPrice) {
          params.minPrice = minPrice;
        }
        if (maxPrice) {
          params.maxPrice = maxPrice;
        }
        params.page = Number(searchParams.get("page")) || 1;
        params.limit = 12;
        // BẮT BUỘC có AWAIT ở đây
        const data = isAllProductsPage
          ? await getAllProducts(params)
          : await getCollectionProducts(slug, params);

        setProducts(data.products || []);
        setCollection(data.collection || null);

        setPagination(
          data.pagination || {
            currentPage: 1,
            limit: 12,
            totalProducts: 0,
            totalPages: 0,
          },
        );
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug, searchParams, isAllProductsPage]);

  // Chọn Hãng
  const handleBrandChange = (brands) => {
    const params = new URLSearchParams(searchParams);
    if (brands.length > 0) {
      params.set("brand", brands.join(","));
    } else {
      params.delete("brand");
    }
    setSearchParams(params);
  };

  // Chọn Danh mục
  const handleCategoryChange = (categories) => {
    const params = new URLSearchParams(searchParams);
    if (categories.length > 0) {
      params.set("category", categories.join(","));
    } else {
      params.delete("category");
    }
    setSearchParams(params);
  };

  // Chọn Khoảng giá
  const handlePriceChange = (minPrice, maxPrice) => {
    const params = new URLSearchParams(searchParams);
    if (minPrice !== undefined && maxPrice !== undefined) {
      params.set("minPrice", minPrice);
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("minPrice");
      params.delete("maxPrice");
    }
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", page);

    setSearchParams(params);
  };

  return (
    <div className="product-list">
      <div className="product-list__container">
        {/* Breadcrumb */}
        <div className="product-list__breadcrumb">
          <Link to={`/`}>Trang chủ</Link>
          <span>/</span>
          <span>{collection?.title || "Danh sách sản phẩm"}</span>
        </div>

        {/* Title */}
        <h1 className="product-list__title">
          {collection?.title || "Danh sách sản phẩm"}
        </h1>

        {/* Banner */}
        <div className="product-list__banner">
          <img src={banner} alt="Banner" />
        </div>

        {/* Main */}
        <div className="product-list__main">
          {/* Sidebar */}
          <FilterSidebar
            selectedBrand={brandSlugs}
            selectedPrice={selectedPrice}
            selectedCategory={categorySlugs}
            onBrandChange={handleBrandChange}
            onPriceChange={handlePriceChange}
            onCategoryChange={handleCategoryChange}
          />

          {/* Products */}
          <section className="product-list__content">
            {/* Toolbar */}
            <div className="product-list__toolbar">
              <div className="product-list__result">
                Tìm thấy <strong>{pagination.totalProducts}</strong> kết quả
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
              <>
                <div className="product-list__products">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                <Pagination
                  currentPage={pagination.currentPage}
                  pageSize={pagination.limit}
                  total={pagination.totalProducts}
                  onChange={handlePageChange}
                />
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProductList;

import { Input } from "antd";
const { Search } = Input;
import { Select } from "antd";
import { useEffect, useState } from "react";
import { getProducts } from "../../../../services/admin/product.services";
import ProductTable from "../../../../components/admin/ProductTable/ProductTable";
import { useSearchParams } from "react-router-dom";

import "./Products.scss";

function Products() {
  const [data, setData] = useState({
    products: [],
    categories: [],
    brands: [],
    pagination: {
      currentPage: 1,
      limit: 10,
      totalProducts: 0,
      totalPages: 0,
    },
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let params = Object.fromEntries([...searchParams]);
      const result = await getProducts(params);
      if (result.code === 200) {
        setData(result.data);
      }
    };
    fetchData();
  }, [searchParams, reload]);

  const handleFilterChange = (key, value) => {
    const currentParams = Object.fromEntries([...searchParams]);

    if (value !== undefined && value !== "") {
      currentParams[key] = value;
    } else {
      delete currentParams[key];
    }
    if (key !== "page") {
      currentParams.page = 1;
    }

    setSearchParams(currentParams);
  };
  const handleChangePage = (page) => {
    handleFilterChange("page", page);
  };

  const handleSearch = (value) => {
    handleFilterChange("keyword", value);
  };

  const handleSort = (value) => {
    handleFilterChange("sort", value);
  };

  const handleCategoryChange = (value) => {
    handleFilterChange("categoryId", value);
  };

  const handleStatusChange = (value) => {
    handleFilterChange("status", value);
  };
  const handleBrandChange = (value) => {
    handleFilterChange("brandId", value);
  };
  const handleFeaturedChange = (value) => {
    handleFilterChange("featured", value);
  };

  const optionStatus = [
    {
      value: "active",
      label: "Hoạt động",
    },
    {
      value: "inactive",
      label: "Dừng hoạt động",
    },
  ];

  const optionFeatured = [
    {
      value: "true",
      label: "Nổi bật",
    },
    {
      value: "false",
      label: "Không nổi bật",
    },
  ];

  const optionSort = [
    {
      value: "position-asc",
      label: "Vị trí tăng dần",
    },
    {
      value: "position-desc",
      label: "Vị trí giảm dần",
    },
    { value: "price-asc", label: "Giá tăng dần" },
    { value: "price-desc", label: "Giá giảm dần" },
    {
      value: "title-asc",
      label: "Tên A-Z",
    },
    {
      value: "title-desc",
      label: "Tên Z-A",
    },
  ];

  const optionCategory = data?.categories.map((item) => {
    return {
      value: item._id,
      label: item.title,
    };
  });
  const optionBrands = data?.brands.map((item) => {
    return {
      value: item._id,
      label: item.title,
    };
  });

  return (
    <>
      <div className="admin-products">
        <div className="admin-products__header">
          <div className="admin-products__title">
            <h1>Quản lý sản phẩm</h1>
          </div>

          <div className="admin-products__nav">
            <div className="admin-products__search">
              <Search
                placeholder="Tìm kiếm theo tên sản phẩm..."
                onSearch={handleSearch}
              />
            </div>
            <div className="admin-products__add">
              <i className="fa-solid fa-plus"></i>
              <p>Thêm sản phẩm</p>
            </div>
          </div>
        </div>

        <div className="admin-products__main">
          <div className="admin-products__filter">
            <div className="admin-products__filter-status">
              <Select
                placeholder="Chọn trạng thái"
                options={optionStatus}
                onChange={handleStatusChange}
                value={searchParams.get("status")}
              />
            </div>
            <div className="admin-products__filter-featured">
              <Select
                placeholder="Chọn sản phẩm nổi bật"
                options={optionFeatured}
                onChange={handleFeaturedChange}
                value={searchParams.get("featured")}
              />
            </div>
            <div className="admin-products__filter-categories">
              <Select
                placeholder="Chọn danh mục"
                options={optionCategory}
                onChange={handleCategoryChange}
                value={searchParams.get("categoryId")}
              />
            </div>
            <div className="admin-products__filter-brands">
              <Select
                placeholder="Chọn thương hiệu"
                options={optionBrands}
                onChange={handleBrandChange}
                value={searchParams.get("brandId")}
              />
            </div>
            <div className="admin-products__filter-sort">
              <Select
                placeholder="Sắp xếp"
                options={optionSort}
                onChange={handleSort}
                value={searchParams.get("sort")}
              />
            </div>
          </div>

          <div className="admin-products__table">
            <ProductTable
              data={data?.products}
              pagination={data?.pagination}
              onPageChange={handleChangePage}
              onReload={() => setReload(!reload)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default Products;

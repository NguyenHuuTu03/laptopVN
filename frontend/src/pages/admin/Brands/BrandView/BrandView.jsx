import { Input } from "antd";
const { Search } = Input;
import { Select } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import "./BrandView.scss";
import { getBrands } from "../../../../services/admin/brand.services";
import BrandTable from "../../../../components/admin/BrandTable/BrandTable";

function BrandView() {
  const [data, setData] = useState({
    brands: [],
    countries: [],
    pagination: {
      currentPage: 1,
      limit: 10,
      totalBrands: 0,
      totalPages: 0,
    },
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let params = Object.fromEntries([...searchParams]);
      const result = await getBrands(params);
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

  const handleStatusChange = (value) => {
    handleFilterChange("status", value);
  };

  const handleCountryChange = (value) => {
    handleFilterChange("country", value);
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

  const optionCountry = data?.countries.map((item) => {
    return {
      value: item,
      label: item,
    };
  });

  const optionSort = [
    {
      value: "position-asc",
      label: "Vị trí tăng dần",
    },
    {
      value: "position-desc",
      label: "Vị trí giảm dần",
    },
    {
      value: "title-asc",
      label: "Tên A-Z",
    },
    {
      value: "title-desc",
      label: "Tên Z-A",
    },
  ];

  console.log(data);

  return (
    <>
      <div className="admin-brands">
        <div className="admin-brands__header">
          <div className="admin-brands__title">
            <h1>Quản lý thương hiệu</h1>
          </div>

          <div className="admin-brands__nav">
            <div className="admin-brands__search">
              <Search
                placeholder="Tìm kiếm theo tên thương hiệu..."
                onSearch={handleSearch}
              />
            </div>
            <div className="admin-brands__add">
              <i className="fa-solid fa-plus"></i>
              <p>Thêm danh mục</p>
            </div>
          </div>
        </div>

        <div className="admin-brands__main">
          <div className="admin-brands__filter">
            <div className="admin-brands__filter-status">
              <Select
                placeholder="Chọn trạng thái"
                options={optionStatus}
                onChange={handleStatusChange}
                value={searchParams.get("status")}
              />
            </div>
            <div className="admin-brands__filter-status">
              <Select
                placeholder="Chọn quốc gia"
                options={optionCountry}
                onChange={handleCountryChange}
                value={searchParams.get("country")}
              />
            </div>

            <div className="admin-brands__filter-sort">
              <Select
                placeholder="Sắp xếp"
                options={optionSort}
                onChange={handleSort}
                value={searchParams.get("sort")}
              />
            </div>
          </div>

          <div className="admin-brands__table">
            <BrandTable
              data={data?.brands}
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
export default BrandView;

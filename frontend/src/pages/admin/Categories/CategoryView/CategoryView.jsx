import { Input } from "antd";
const { Search } = Input;
import { Select } from "antd";
import { useEffect, useState } from "react";
import CategoryTable from "../../../../components/admin/CategoryTable/CategoryTable";
import { useSearchParams } from "react-router-dom";

import { getCategories } from "../../../../services/admin/category.services";

import "./CategoryView.scss";

function CategoryView() {
  const [data, setData] = useState({
    categories: [],
    pagination: {
      currentPage: 1,
      limit: 10,
      totalCategories: 0,
      totalPages: 0,
    },
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let params = Object.fromEntries([...searchParams]);
      const result = await getCategories(params);
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

  return (
    <>
      <div className="admin-categories">
        <div className="admin-categories__header">
          <div className="admin-categories__title">
            <h1>Quản lý danh mục</h1>
          </div>

          <div className="admin-categories__nav">
            <div className="admin-categories__search">
              <Search
                placeholder="Tìm kiếm theo tên danh mục..."
                onSearch={handleSearch}
              />
            </div>
            <div className="admin-categories__add">
              <i className="fa-solid fa-plus"></i>
              <p>Thêm danh mục</p>
            </div>
          </div>
        </div>

        <div className="admin-categories__main">
          <div className="admin-categories__filter">
            <div className="admin-categories__filter-status">
              <Select
                placeholder="Trạng thái"
                options={optionStatus}
                onChange={handleStatusChange}
                value={searchParams.get("status")}
              />
            </div>

            <div className="admin-categories__filter-sort">
              <Select
                placeholder="Sắp xếp"
                options={optionSort}
                onChange={handleSort}
                value={searchParams.get("sort")}
              />
            </div>
          </div>

          <div className="admin-categories__table">
            <CategoryTable
              data={data?.categories}
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
export default CategoryView;

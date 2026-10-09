import { Input } from "antd";
const { Search } = Input;
import { Select } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import "./CouponView.scss";
import { getCoupons } from "../../../../services/admin/coupon.services";
import CouponTable from "../../../../components/admin/CouponTable/CouponTable";

function CouponView() {
  const [data, setData] = useState({
    coupons: [],
    pagination: {
      currentPage: 1,
      limit: 10,
      totalCoupons: 0,
      totalPages: 0,
    },
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let params = Object.fromEntries([...searchParams]);
      const result = await getCoupons(params);
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
      value: "endDate-asc",
      label: "Hạn sử dụng",
    },
    {
      value: "usedCount-desc",
      label: "Sử dụng nhiều nhất",
    },
  ];

  console.log(data);

  return (
    <>
      <div className="admin-coupons">
        <div className="admin-coupons__header">
          <div className="admin-coupons__title">
            <h1>Quản lý mã giảm</h1>
          </div>

          <div className="admin-coupons__nav">
            <div className="admin-coupons__search">
              <Search
                placeholder="Tìm kiếm theo mã giảm..."
                onSearch={handleSearch}
              />
            </div>
            <button className="admin-coupons__add">
              <i className="fa-solid fa-plus"></i>
              <p>Thêm mã giảm</p>
            </button>
          </div>
        </div>

        <div className="admin-coupons__main">
          <div className="admin-coupons__filter">
            <div className="admin-coupons__filter-status">
              <Select
                placeholder="Trạng thái"
                options={optionStatus}
                onChange={handleStatusChange}
                value={searchParams.get("status")}
              />
            </div>

            <div className="admin-coupons__filter-sort">
              <Select
                placeholder="Sắp xếp"
                options={optionSort}
                onChange={handleSort}
                value={searchParams.get("sort")}
              />
            </div>
          </div>

          <div className="admin-coupons__table">
            <CouponTable
              data={data?.coupons}
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
export default CouponView;

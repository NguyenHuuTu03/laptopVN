import { Input } from "antd";
const { Search } = Input;
import { Select } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import "./OrderView.scss";
import { getOrders } from "../../../../services/admin/order.services";
import OrderTable from "../../../../components/admin/OrderTable/OrderTable";

function OrderView() {
  const [data, setData] = useState({
    orders: [],
    countries: [],
    pagination: {
      currentPage: 1,
      limit: 10,
      totalOrders: 0,
      totalPages: 0,
    },
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let params = Object.fromEntries([...searchParams]);
      const result = await getOrders(params);
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
    handleFilterChange("orderStatus", value);
  };

  const handleMethodChange = (value) => {
    handleFilterChange("paymentMethod", value);
  };

  const optionStatus = [
    {
      value: "PENDING",
      label: "Chờ xác nhận",
    },
    {
      value: "CONFIRMED",
      label: "Đã xác nhận",
    },
    {
      value: "SHIPPING",
      label: "Đang giao",
    },
    {
      value: "DELIVERED",
      label: "Đã giao",
    },
    {
      value: "CANCELLED",
      label: "Đã huỷ",
    },
  ];

  const optionMethod = [
    {
      value: "COD",
      label: "COD",
    },
    {
      value: "VNPay",
      label: "VNPay",
    },
  ];

  const optionSort = [
    { value: "createdAt-desc", label: "Mới nhất" },
    { value: "createdAt-asc", label: "Cũ nhất" },
    { value: "totalPrice-desc", label: "Giá trị cao → thấp" },
    { value: "totalPrice-asc", label: "Giá trị thấp → cao" },
  ];

  return (
    <>
      <div className="admin-orders">
        <div className="admin-orders__header">
          <div className="admin-orders__title">
            <h1>Quản lý đơn hàng</h1>
          </div>

          <div className="admin-orders__nav">
            <div className="admin-orders__search">
              <Search
                placeholder="Tìm kiếm theo số điện thoại..."
                onSearch={handleSearch}
              />
            </div>
          </div>
        </div>

        <div className="admin-orders__main">
          <div className="admin-orders__filter">
            <div className="admin-orders__filter-status">
              <Select
                placeholder="Trạng thái"
                options={optionStatus}
                onChange={handleStatusChange}
                value={searchParams.get("orderStatus")}
              />
            </div>

            <div className="admin-orders__filter-method">
              <Select
                placeholder="Thanh toán"
                options={optionMethod}
                onChange={handleMethodChange}
                value={searchParams.get("paymentMethod")}
              />
            </div>

            <div className="admin-orders__filter-sort">
              <Select
                placeholder="Sắp xếp"
                options={optionSort}
                onChange={handleSort}
                value={searchParams.get("sort")}
              />
            </div>
          </div>

          <div className="admin-brands__table">
            <OrderTable
              data={data?.orders}
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
export default OrderView;

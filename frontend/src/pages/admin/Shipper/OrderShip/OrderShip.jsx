import { Input, Select } from "antd";
const { Search } = Input;
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getOrderShip } from "../../../../services/admin/shipper.services";
import OrderShipTable from "../../../../components/admin/OrderShipTable/OrderShipTable";

function OrderShip() {
  const [data, setData] = useState({
    orders: [],
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
      const result = await getOrderShip(params);
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

  const handleStatusChange = (value) => {
    handleFilterChange("orderStatus", value);
  };

  const optionStatus = [
    {
      value: "CONFIRMED",
      label: "Chờ giao",
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
    {
      value: "FAILED",
      label: "Thất bại",
    },
  ];

  return (
    <>
      <div className="admin-orders">
        <div className="admin-orders__header">
          <div className="admin-orders__title">
            <h1>Đơn hàng cần giao</h1>
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
          </div>

          <div className="admin-orders__table">
            <OrderShipTable
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
export default OrderShip;

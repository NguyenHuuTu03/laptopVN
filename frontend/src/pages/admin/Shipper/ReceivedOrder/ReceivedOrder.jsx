import { Input } from "antd";
const { Search } = Input;
import { Select } from "antd";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import "./ReceivedOrder.scss";
import ReceivedTable from "../../../../components/admin/ReceivedTable/ReceivedTable";
import { getReceivedOrder } from "../../../../services/admin/shipper.services";

function ReceivedOrder() {
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
      const result = await getReceivedOrder(params);
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

  return (
    <>
      <div className="admin-received">
        <div className="admin-received__header">
          <div className="admin-received__title">
            <h1>Đơn hàng đã nhận</h1>
          </div>

          <div className="admin-received__nav">
            <div className="admin-received__search">
              <Search
                placeholder="Tìm kiếm theo số điện thoại..."
                onSearch={handleSearch}
              />
            </div>

            <Link to="/admin/shipper" className="admin-received__back">
              <i className="fa-solid fa-arrow-left"></i>
              Quay lại
            </Link>
          </div>
        </div>

        <div className="admin-received__main">
          <div className="admin-received__filter">
            <div className="admin-received__filter-status">
              <Select
                placeholder="Trạng thái"
                options={optionStatus}
                onChange={handleStatusChange}
                value={searchParams.get("orderStatus")}
              />
            </div>
          </div>

          <div className="admin-received__table">
            <ReceivedTable
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
export default ReceivedOrder;

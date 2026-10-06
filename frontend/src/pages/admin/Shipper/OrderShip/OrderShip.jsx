import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import "./OrderShip.scss";
import OrderShipTable from "../../../../components/admin/OrderShipTable/OrderShipTable";
import { getOrderShip } from "../../../../services/admin/shipper.services";

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

  console.log(data);

  return (
    <>
      <div className="admin-ship">
        <div className="admin-ship__header">
          <div className="admin-ship__title">
            <h1>Quản lý giao hàng</h1>
          </div>

          <div className="admin-ship__nav">
            <div className="admin-ship__add">
              <i className="fa-solid fa-clipboard-check"></i>
              <p>Đơn hàng đã nhận</p>
            </div>
          </div>
        </div>

        <div className="admin-ship__main">
          <div className="admin-ship__table">
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

import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { getDashboard } from "../../../services/admin/dashboard.services";
import { Line, Pie } from "@ant-design/plots";
function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const result = await getDashboard();
      if (result.code === 200) {
        setData(result.data);
      }
    };
    fetchData();
  }, []);
  const orderData = [
    {
      status: "Chờ xác nhận",
      count: data?.orders?.pending || 0,
    },
    {
      status: "Đã xác nhận",
      count: data?.orders?.confirmed || 0,
    },
    {
      status: "Đang giao",
      count: data?.orders?.shipping || 0,
    },
    {
      status: "Đã giao",
      count: data?.orders?.delivered || 0,
    },
    {
      status: "Đã hủy",
      count: data?.orders?.cancelled || 0,
    },
  ];

  const revenueConfig = {
    data: data?.revenueByMonth || [],
    xField: "month",
    yField: "revenue",

    point: {
      shapeField: "circle",
    },

    tooltip: {
      items: [
        {
          field: "revenue",
          name: "Doanh thu",
        },
      ],
    },
  };
  const orderConfig = {
    data: orderData,
    angleField: "count",
    colorField: "status",

    innerRadius: 0.6,

    legend: {
      color: {
        position: "bottom",
      },
    },

    tooltip: {
      items: [
        {
          field: "count",
          name: "Số lượng",
        },
      ],
    },
  };
  console.log(data);

  return (
    <>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Tổng quan</h1>
        </div>
        <div className="dashboard-main">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} xl={6}>
              <div className="dashboard-box">
                <div className="dashboard-box__left">
                  <i className="fa-solid fa-dollar-sign"></i>
                </div>
                <div className="dashboard-box__right">
                  <div className="dashboard-box__content">
                    <span>Tổng doanh thu</span>
                    <strong>
                      {data?.overview.totalRevenue.toLocaleString()}đ
                    </strong>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <div className="dashboard-box">
                <div className="dashboard-box__left">
                  <i className="fa-solid fa-user"></i>
                </div>
                <div className="dashboard-box__right">
                  <div className="dashboard-box__content">
                    <span>Tổng người dùng</span>
                    <strong>{data?.overview.totalUser}</strong>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <div className="dashboard-box">
                <div className="dashboard-box__left">
                  <i className="fa-solid fa-box-open"></i>
                </div>
                <div className="dashboard-box__right">
                  <div className="dashboard-box__content">
                    <span>Tổng đơn hàng</span>
                    <strong>{data?.overview.totalOrder}</strong>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <div className="dashboard-box">
                <div className="dashboard-box__left">
                  <i className="fa-solid fa-box"></i>
                </div>
                <div className="dashboard-box__right">
                  <div className="dashboard-box__content">
                    <span>Tổng sản phẩm</span>
                    <strong>{data?.overview.totalProduct}</strong>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} xl={16}>
              <div className="dashboard-chart__revenue">
                <h3>Doanh thu theo tháng</h3>
                <Line {...revenueConfig} />
              </div>
            </Col>
            <Col xs={24} xl={8}>
              <div className="dashboard-chart__orders">
                <h3>Đơn hàng theo trạng thái</h3>
                <Pie {...orderConfig} />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
export default Dashboard;

import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { getDashboard } from "../../../services/admin/dashboard.services";
import { Line, Pie } from "@ant-design/plots";
import FeatureProduct from "../../../components/admin/FeatureProduct/FeatureProduct";
import RecentOrder from "../../../components/admin/RecentOrder/RecentOrder";

import "./Dashboard.scss";
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

  const revenueData =
    data?.revenueByMonth.map((item) => {
      return {
        month: `T${item.month}`,
        revenue: item.revenue,
      };
    }) || [];

  const revenueConfig = {
    data: revenueData,
    xField: "month",
    yField: "revenue",

    point: {
      shapeField: "circle",
    },
    axis: {
      y: {
        labelFormatter: (v) => v.toLocaleString("vi-VN"),
      },
    },

    tooltip: {
      items: [
        {
          field: "revenue",
          name: "Doanh thu",
          valueFormatter: (v) => `${v.toLocaleString("vi-VN")}đ`,
        },
      ],
    },
  };
  const orderConfig = {
    data: orderData,
    angleField: "count",
    colorField: "status",
    scale: {
      color: {
        range: [
          "#faad14", // Chờ xác nhận
          "#1677ff", // Đã xác nhận
          "#722ed1", // Đang giao
          "#52c41a", // Đã giao
          "#ff4d4f", // Đã hủy
        ],
      },
    },
    innerRadius: 0.6,
    legend: { color: { position: "bottom" } },
    tooltip: { items: [{ field: "count", name: "Số lượng" }] },
  };
  console.log(data);
  console.log(data?.featuredProducts);

  return (
    <>
      <div className="dashboard">
        {/* <div className="dashboard-header">
          <h1>Tổng quan</h1>
        </div> */}
        <div className="dashboard-main">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} xl={6}>
              <div className="dashboard-cart">
                <div className="dashboard-cart__left">
                  <i className="fa-solid fa-sun"></i>
                </div>
                <div className="dashboard-cart__right">
                  <div className="dashboard-cart__content">
                    <span>Doanh thu hôm nay</span>
                    <strong>{data?.revenue.today.toLocaleString()}đ</strong>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <div className="dashboard-cart">
                <div className="dashboard-cart__left">
                  <i className="fa-solid fa-calendar"></i>
                </div>
                <div className="dashboard-cart__right">
                  <div className="dashboard-cart__content">
                    <span>Doanh thu tháng này</span>
                    <strong>
                      {data?.revenue.currentMonth.toLocaleString()}đ
                    </strong>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <div className="dashboard-cart">
                <div className="dashboard-cart__left">
                  <i className="fa-solid fa-dollar-sign"></i>
                </div>
                <div className="dashboard-cart__right">
                  <div className="dashboard-cart__content">
                    <span>Tổng doanh thu</span>
                    <strong>
                      {data?.overview.totalRevenue.toLocaleString()}đ
                    </strong>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <div className="dashboard-cart">
                <div className="dashboard-cart__left">
                  <i className="fa-solid fa-user"></i>
                </div>
                <div className="dashboard-cart__right">
                  <div className="dashboard-cart__content">
                    <span>Tổng khách hàng</span>
                    <strong>{data?.overview.totalUser}</strong>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <div className="dashboard-cart">
                <div className="dashboard-cart__left">
                  <i className="fa-solid fa-receipt"></i>
                </div>
                <div className="dashboard-cart__right">
                  <div className="dashboard-cart__content">
                    <span>Tổng đơn hàng</span>
                    <strong>{data?.overview.totalOrder}</strong>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <div className="dashboard-cart">
                <div className="dashboard-cart__left">
                  <i className="fa-solid fa-box"></i>
                </div>
                <div className="dashboard-cart__right">
                  <div className="dashboard-cart__content">
                    <span>Sản phẩm đã bán</span>
                    <strong>{data?.overview.totalProduct}</strong>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} xl={16}>
              <div className="dashboard-card">
                <h3>Doanh thu theo tháng</h3>
                <Line {...revenueConfig} />
              </div>
            </Col>
            <Col xs={24} xl={8}>
              <div className="dashboard-card">
                <h3>Đơn hàng theo trạng thái</h3>
                <Pie {...orderConfig} />
              </div>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} xl={10}>
              <div className="dashboard-cart">
                <h3>Sản phẩm nổi bật</h3>
                <FeatureProduct data={data?.featuredProducts} />
              </div>
            </Col>
            <Col xs={24} xl={14}>
              <div className="dashboard-cart">
                <h3>Đơn hàng gần đây</h3>
                <RecentOrder data={data?.recentOrders} />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
export default Dashboard;

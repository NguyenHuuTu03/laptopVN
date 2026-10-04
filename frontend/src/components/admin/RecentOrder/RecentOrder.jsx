import { Table } from "antd";
import "./RecentOrder.scss";

function RecentOrder({ data = [] }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const formatStatus = (status) => {
    switch (status) {
      case "PENDING":
        return {
          text: "Chờ xác nhận",
          className: "pending",
        };

      case "CONFIRMED":
        return {
          text: "Đã xác nhận",
          className: "confirmed",
        };

      case "SHIPPING":
        return {
          text: "Đang giao",
          className: "shipping",
        };

      case "DELIVERED":
        return {
          text: "Đã giao",
          className: "delivered",
        };

      case "CANCELLED":
        return {
          text: "Đã huỷ",
          className: "cancelled",
        };

      default:
        return {
          text: status,
          className: "",
        };
    }
  };
  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "orderCode",
      key: "orderCode",
      render: (text) => <span className="order-code">{text}</span>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => (
        <span className="order-price">
          {Number(price).toLocaleString("vi-VN")} ₫
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => (
        <span className={`order-status ${status.className}`}>
          {status.text}
        </span>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => <span className="order-date">{date}</span>,
    },
  ];

  const dataTable = data.map((item, index) => {
    const status = formatStatus(item.orderStatus);

    return {
      key: index,
      orderCode: `#${item.orderCode}`,
      totalPrice: item.totalPrice,
      orderStatus: status,
      createdAt: formatDate(item.createdAt),
    };
  });

  return (
    <div className="recent-order">
      <Table columns={columns} dataSource={dataTable} pagination={false} />
    </div>
  );
}
export default RecentOrder;

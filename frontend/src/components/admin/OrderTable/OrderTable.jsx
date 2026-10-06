import { notification, Table } from "antd";
import "./OrderTable.scss";

import { changeStatus } from "../../../services/admin/order.services";

function OrderTable({ data = [], pagination, onPageChange, onReload }) {
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

  const handleChangeStatus = async (record) => {
    const status = record.orderStatus;
    if (status === "CANCELLED") {
      return;
    }
    let newStatus;
    switch (status) {
      case "PENDING":
        newStatus = "CONFIRMED";
        break;
      case "CONFIRMED":
        newStatus = "SHIPPING";
        break;
      case "SHIPPING":
        newStatus = "DELIVERED";
        break;

      default:
        break;
    }

    const result = await changeStatus(record._id, newStatus);

    if (result.code === 200) {
      notification.success({
        title: result.message,
      });

      onReload();
    } else {
      notification.error({
        title: result.message,
      });
    }
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderCode",
      key: "orderCode",
      align: "left",
      render: (text) => <span className="order-code">{text}</span>,
    },
    {
      title: "Khách hàng",
      dataIndex: "shippingName",
      align: "left",
      key: "shippingName",
      render: (text) => <span className="order-name">{text}</span>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "shippingPhone",
      align: "left",
      key: "shippingPhone",
      render: (text) => <span className="order-phone">{text}</span>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "center",
      render: (text) => (
        <span className="order-price">
          {Number(text).toLocaleString("vi-VN")}₫
        </span>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      align: "center",
      render: (text) => <span className="order-method">{text}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      align: "center",
      render: (status, record) => {
        const statusData = formatStatus(status);

        return (
          <span
            className={`order-status ${statusData.className}`}
            onClick={
              status === "CANCELLED"
                ? undefined
                : () => handleChangeStatus(record)
            }
          >
            {statusData.text}
          </span>
        );
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (date) => <span className="order-date">{date}</span>,
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="order-action">
          <button className="order-action__view" title="Xem chi tiết">
            <i className="fa-solid fa-eye"></i>
          </button>
        </div>
      ),
    },
  ];

  const dataTable = data.map((item) => ({
    key: item._id,
    _id: item._id,
    orderCode: `#${item.orderCode}`,
    shippingName: item.shippingName,
    shippingPhone: item.shippingPhone,
    totalPrice: item.totalPrice,
    paymentMethod: item.paymentMethod,
    orderStatus: item.orderStatus,
    createdAt: formatDate(item.createdAt),
  }));

  return (
    <>
      <div className="order-table">
        <Table
          columns={columns}
          dataSource={dataTable}
          pagination={{
            current: pagination.currentPage,
            pageSize: pagination.limit,
            total: pagination.totalOrders,
            onChange: onPageChange,
          }}
        />
      </div>
    </>
  );
}
export default OrderTable;

import { notification, Table } from "antd";
import "./OrderShipTable.scss";
import { acceptOrder } from "../../../services/admin/shipper.services";

function OrderShipTable({ data = [], pagination, onPageChange, onReload }) {
  const formatStatus = (status) => {
    switch (status) {
      case "PENDING":
        return {
          text: "Chưa thanh toán",
          className: "pending",
        };

      case "PAID":
        return {
          text: "Đã thanh toán",
          className: "paid",
        };
    }
  };

  const handleAcceptOrder = async (record) => {
    const result = await acceptOrder(record._id);
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
      title: "Khách hàng",
      dataIndex: "shippingName",
      align: "left",
      key: "shippingName",
      render: (text) => <span className="ship-name">{text}</span>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "shippingPhone",
      align: "left",
      key: "shippingPhone",
      render: (text) => <span className="ship-phone">{text}</span>,
    },
    {
      title: "Địa chỉ",
      dataIndex: "shippingAddress",
      align: "left",
      key: "shippingAddress",
      render: (text) => <span className="ship-address">{text}</span>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "center",
      render: (text) => (
        <span className="ship-price">
          {Number(text).toLocaleString("vi-VN")}₫
        </span>
      ),
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      align: "center",
      render: (status) => {
        const statusData = formatStatus(status);

        return (
          <span className={`ship-status ${statusData.className}`}>
            {statusData.text}
          </span>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="ship-action">
          <button
            className="ship-action__view"
            title="Nhận đơn"
            onClick={() => handleAcceptOrder(record)}
          >
            <i className="fa-regular fa-square-check"></i>
          </button>
        </div>
      ),
    },
  ];

  const dataTable = data.map((item) => ({
    key: item._id,
    _id: item._id,
    shippingName: item.shippingName,
    shippingPhone: item.shippingPhone,
    shippingAddress: item.shippingAddress,
    totalPrice: item.totalPrice,
    paymentStatus: item.paymentStatus,
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
export default OrderShipTable;

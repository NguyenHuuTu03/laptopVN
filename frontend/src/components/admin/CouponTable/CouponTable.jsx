import { notification, Table } from "antd";
import "./CouponTable.scss";
import {
  changeStatus,
  removeCoupon,
} from "../../../services/admin/coupon.services";

function CouponTable({ data = [], pagination, onPageChange, onReload }) {
  const formatStatus = (status) => {
    switch (status) {
      case "active":
        return {
          text: "Hoạt động",
          className: "active",
        };
      case "inactive":
        return {
          text: "Dừng hoạt động",
          className: "inactive",
        };
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const handleChangeStatus = async (record) => {
    const newStatus = record.status === "active" ? "inactive" : "active";

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

  const handleRemove = async (record) => {
    const result = await removeCoupon(record._id);
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
      title: "Mã giảm",
      dataIndex: "code",
      key: "code",
      align: "center",
      render: (text) => <span className="coupon-code">{text}</span>,
    },
    {
      title: "Giảm giá",
      dataIndex: "discountValue",
      align: "center",
      key: "discountValue",
      render: (text, record) => {
        return record.discountType === "percent" ? (
          <span className="coupon-value">{text}%</span>
        ) : (
          <span className="coupon-value">
            {Number(text).toLocaleString("vi-VN")}₫
          </span>
        );
      },
    },
    {
      title: "Lượt dùng",
      dataIndex: "usedCount",
      align: "center",
      key: "usedCount",
      render: (text, record) => (
        <span className="coupon-used">
          {text}/{record.quantity}
        </span>
      ),
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "endDate",
      align: "center",
      key: "endDate",
      render: (text) => <span className="coupon-used">{formatDate(text)}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, record) => {
        const statusData = formatStatus(status);

        return (
          <span
            className={`coupon-status ${statusData.className}`}
            onClick={() => handleChangeStatus(record)}
          >
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
        <div className="coupon-action">
          <button className="coupon-action__view" title="Xem chi tiết">
            <i className="fa-solid fa-eye"></i>
          </button>

          <button className="coupon-action__edit" title="Chỉnh sửa">
            <i className="fa-solid fa-pen-to-square"></i>
          </button>

          <button
            className="coupon-action__delete"
            title="Xóa"
            onClick={() => {
              handleRemove(record);
            }}
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  const dataTable = data.map((item) => ({
    key: item._id,
    _id: item._id,
    code: item.code,
    discountValue: item.discountValue,
    discountType: item.discountType,
    usedCount: item.usedCount,
    quantity: item.quantity,
    endDate: item.endDate,
    status: item.status,
  }));

  return (
    <>
      <div className="coupon-table">
        <Table
          columns={columns}
          dataSource={dataTable}
          pagination={{
            current: pagination.currentPage,
            pageSize: pagination.limit,
            total: pagination.totalCoupons,
            onChange: onPageChange,
          }}
        />
      </div>
    </>
  );
}
export default CouponTable;

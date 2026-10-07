import { notification, Table } from "antd";

import "./RoleTable.scss";
import {
  changeStatus,
  removeRole,
} from "../../../services/admin/role.services";

function RoleTable({ data = [], pagination, onPageChange, onReload }) {
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
    const result = await removeRole(record._id);
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
      title: "Tên vai trò",
      dataIndex: "title",
      key: "title",
      align: "left",
      render: (text) => <span className="role-name">{text}</span>,
    },

    {
      title: "Số người dùng",
      dataIndex: "userCount",
      align: "center",
      key: "userCount",
      render: (text) => <span className="role-count">{text}</span>,
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
            className={`role-status ${statusData.className}`}
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
        <div className="role-action">
          <button className="role-action__view" title="Xem chi tiết">
            <i className="fa-solid fa-eye"></i>
          </button>

          <button className="role-action__edit" title="Chỉnh sửa">
            <i className="fa-solid fa-pen-to-square"></i>
          </button>

          <button
            className="role-action__delete"
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
    title: item.title,
    userCount: item.userCount,
    status: item.status,
  }));

  return (
    <>
      <div className="role-table">
        <Table
          columns={columns}
          dataSource={dataTable}
          pagination={{
            current: pagination.currentPage,
            pageSize: pagination.limit,
            total: pagination.totalUsers,
            onChange: onPageChange,
          }}
        />
      </div>
    </>
  );
}
export default RoleTable;

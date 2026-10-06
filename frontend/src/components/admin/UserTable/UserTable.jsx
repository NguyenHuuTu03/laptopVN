import { notification, Table } from "antd";
import "./UserTable.scss";
import {
  changeStatus,
  removeUser,
} from "../../../services/admin/user.services";

import "./UserTable.scss";

function UserTable({ data = [], pagination, onPageChange, onReload }) {
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
    const result = await removeUser(record._id);
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
      title: "Ảnh",
      dataIndex: "avatar",
      key: "avatar",
      align: "center",
      render: (text, item) => (
        <img className="user-avatar" src={text} alt={item.avatar} />
      ),
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      align: "left",
      key: "fullName",
      render: (text) => <span className="user-fullName">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "left",
      key: "email",
      render: (text) => <span className="user-email">{text}</span>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      align: "center",
      key: "phone",
      render: (text) => <span className="user-phone">{text}</span>,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (text) => <span className="user-role">{text}</span>,
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
            className={`user-status ${statusData.className}`}
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
        <div className="user-action">
          <button className="user-action__view" title="Xem chi tiết">
            <i className="fa-solid fa-eye"></i>
          </button>

          <button className="user-action__edit" title="Chỉnh sửa">
            <i className="fa-solid fa-pen-to-square"></i>
          </button>

          <button
            className="user-action__delete"
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
    avatar: item.avatar,
    fullName: item.fullName,
    email: item.email,
    phone: item.phone,
    role: item.role,
    status: item.status,
  }));

  return (
    <>
      <div className="user-table">
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
export default UserTable;

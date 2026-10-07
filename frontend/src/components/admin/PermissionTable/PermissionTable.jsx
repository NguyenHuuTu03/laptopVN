import { Table, Checkbox } from "antd";
import "./PermissionTable.scss";

function PermissionTable({ data = [], permissions = [], onChange }) {
  const handlePermissionChange = (permission, checked) => {
    let newPermissions;

    if (checked) {
      newPermissions = [...permissions, permission];
    } else {
      newPermissions = permissions.filter((item) => item !== permission);
    }

    onChange(newPermissions);
  };

  const columns = [
    {
      title: "Chức năng",
      key: "function",
      dataIndex: "name",
      align: "left",
      render: (text) => <span className="permission-function">{text}</span>,
    },
    {
      title: "Xem",
      key: "view",
      align: "center",
      render: (_, record) => {
        const permission = `${record.key}-view`;

        return (
          <Checkbox
            checked={permissions.includes(permission)}
            onChange={(e) =>
              handlePermissionChange(permission, e.target.checked)
            }
          />
        );
      },
    },
    {
      title: "Thêm",
      key: "create",
      align: "center",
      render: (_, record) => {
        const permission = `${record.key}-create`;

        return (
          <Checkbox
            checked={permissions.includes(permission)}
            onChange={(e) =>
              handlePermissionChange(permission, e.target.checked)
            }
          />
        );
      },
    },
    {
      title: "Sửa",
      key: "edit",
      align: "center",
      render: (_, record) => {
        const permission = `${record.key}-edit`;

        return (
          <Checkbox
            checked={permissions.includes(permission)}
            onChange={(e) =>
              handlePermissionChange(permission, e.target.checked)
            }
          />
        );
      },
    },
    {
      title: "Xóa",
      key: "delete",
      align: "center",
      render: (_, record) => {
        const permission = `${record.key}-delete`;

        return (
          <Checkbox
            checked={permissions.includes(permission)}
            onChange={(e) =>
              handlePermissionChange(permission, e.target.checked)
            }
          />
        );
      },
    },
    {
      title: "Phân quyền",
      key: "permission",
      align: "center",
      render: (_, record) => {
        const permission = `${record.key}-permission`;

        return (
          <Checkbox
            checked={permissions.includes(permission)}
            onChange={(e) =>
              handlePermissionChange(permission, e.target.checked)
            }
          />
        );
      },
    },
    {
      title: "Nhận đơn",
      key: "accept",
      align: "center",
      render: (_, record) => {
        const permission = `${record.key}-accept`;

        return (
          <Checkbox
            checked={permissions.includes(permission)}
            onChange={(e) =>
              handlePermissionChange(permission, e.target.checked)
            }
          />
        );
      },
    },
    {
      title: "Cập nhật trạng thái",
      key: "update-status",
      align: "center",
      render: (_, record) => {
        const permission = `${record.key}-update`;

        return (
          <Checkbox
            checked={permissions.includes(permission)}
            onChange={(e) =>
              handlePermissionChange(permission, e.target.checked)
            }
          />
        );
      },
    },
  ];

  return (
    <div className="permission-table">
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="key"
      />
    </div>
  );
}

export default PermissionTable;

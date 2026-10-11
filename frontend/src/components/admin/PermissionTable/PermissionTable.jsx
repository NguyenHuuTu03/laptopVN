import { Table, Checkbox } from "antd";
import "./PermissionTable.scss";

function PermissionTable({ permissions = [], onChange }) {
  const handlePermissionChange = (permission, checked) => {
    let newPermissions;

    if (checked) {
      newPermissions = [...permissions, permission];
    } else {
      newPermissions = permissions.filter((item) => item !== permission);
    }

    onChange(newPermissions);
  };

  const data = [
    {
      key: "dashboard",
      name: "Tổng quan",
      actions: ["view"],
    },
    {
      key: "product",
      name: "Sản phẩm",
      actions: ["view", "create", "edit", "delete", "update"],
    },
    {
      key: "category",
      name: "Danh mục",
      actions: ["view", "create", "edit", "delete", "update"],
    },
    {
      key: "brand",
      name: "Thương hiệu",
      actions: ["view", "create", "edit", "delete", "update"],
    },
    {
      key: "order",
      name: "Đơn hàng",
      actions: ["view", "update"],
    },
    {
      key: "shipper",
      name: "Giao hàng",
      actions: ["view", "accept", "update"],
    },
    {
      key: "user",
      name: "Người dùng",
      actions: ["view", "create", "edit", "delete", "update"],
    },
    {
      key: "coupon",
      name: "Mã giảm",
      actions: ["view", "create", "edit", "delete", "update"],
    },
    {
      key: "role",
      name: "Nhóm quyền",
      actions: ["view", "create", "edit", "delete", "update", "permission"],
    },
    {
      key: "setting",
      name: "Cài đặt chung",
      actions: ["view", "edit"],
    },
  ];

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
        if (!record.actions.includes("view")) return null;
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
        if (!record.actions.includes("create")) return null;
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
        if (!record.actions.includes("edit")) return null;
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
        if (!record.actions.includes("delete")) return null;
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
        if (!record.actions.includes("permission")) return null;
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
        if (!record.actions.includes("accept")) return null;
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
      key: "update",
      align: "center",
      render: (_, record) => {
        if (!record.actions.includes("update")) return null;
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

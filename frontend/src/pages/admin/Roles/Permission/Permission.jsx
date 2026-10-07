import { useEffect, useState } from "react";

import "./Permission.scss";
import {
  getRoles,
  updatePermission,
} from "../../../../services/admin/role.services";
import PermissionTable from "../../../../components/admin/PermissionTable/PermissionTable";
import { notification } from "antd";

function Permission() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  // const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getRoles();

      if (result.code === 200) {
        const rolesData = result.data.roles;

        setRoles(rolesData);

        if (rolesData.length > 0) {
          setSelectedRole(rolesData[0]);
          setPermissions(rolesData[0].permissions || []);
        }
      }
    };

    fetchData();
  }, []);

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setPermissions(role.permissions || []);
  };

  const handleSave = async () => {
    const data = {
      roleId: selectedRole._id,
      permissions: permissions,
    };

    const result = await updatePermission(data);
    if (result.code === 200) {
      notification.success({
        title: result.message,
      });
    } else {
      notification.error({
        title: result.message,
      });
    }
  };

  const data = [
    {
      key: "product",
      name: "Sản phẩm",
    },
    {
      key: "category",
      name: "Danh mục",
    },
    {
      key: "brand",
      name: "Thương hiệu",
    },
    {
      key: "order",
      name: "Đơn hàng",
    },
    {
      key: "shipper",
      name: "Giao hàng",
    },
    {
      key: "user",
      name: "Người dùng",
    },
    {
      key: "role",
      name: "Nhóm quyền",
    },
    {
      key: "setting",
      name: "Cài đặt chung",
    },
  ];
  console.log(permissions);

  return (
    <div className="admin-permissions">
      <div className="admin-permissions__header">
        <div className="admin-permissions__title">
          <h1>Phân quyền</h1>
        </div>
      </div>

      <div className="admin-permissions__main">
        <div className="admin-permissions__roles">
          {roles.map((role) => (
            <div
              key={role._id}
              className={selectedRole?._id === role._id ? "active" : ""}
              onClick={() => handleRoleChange(role)}
            >
              {role.title}
            </div>
          ))}
        </div>
        <div className="admin-permissions__nav">
          <div className="admin-permissions__left">
            <h3>Quyền của: {selectedRole?.title} </h3>
          </div>
          <div className="admin-permissions__right">
            <button className="admin-permissions__add" onClick={handleSave}>
              <i className="fa-solid fa-floppy-disk"></i>
              <p>Lưu thay đổi</p>
            </button>
          </div>
        </div>
        <div className="admin-permissions__table">
          <PermissionTable
            data={data}
            permissions={permissions}
            onChange={setPermissions}
          />
        </div>
      </div>
    </div>
  );
}

export default Permission;

import { Button, Spin } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRole } from "../../../../services/admin/role.services";
import "./RoleDetail.scss";
import PermissionTable from "../../../../components/admin/PermissionTable/PermissionTable";

function RoleDetail() {
  const { roleId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const result = await getRole(roleId);

        if (result.code === 200) {
          setRole(result.data.role);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [roleId]);

  const formatDate = (date) => {
    if (!date) return "Chưa cập nhật";

    return new Date(date).toLocaleDateString("vi-VN");
  };

  return (
    <div className="role-detail">
      <div className="role-detail__header">
        <div className="role-detail__title">
          <h1>Chi tiết vai trò</h1>
        </div>

        <div className="role-detail__nav">
          <Link to="/admin/roles" className="role-detail__back">
            <i className="fa-solid fa-arrow-left"></i>
            Quay lại
          </Link>

          <Button
            className="role-detail__edit"
            type="primary"
            onClick={() => navigate(`/admin/roles/edit/${roleId}`)}
          >
            <i className="fa-solid fa-pen-to-square"></i>
            <span>Chỉnh sửa</span>
          </Button>
        </div>
      </div>

      <Spin spinning={loading}>
        <div className="role-detail__main">
          {/* THÔNG TIN CƠ BẢN */}
          <div className="role-detail__section">
            <div className="role-detail__section-header">
              <h3>Thông tin cơ bản</h3>
            </div>

            <div className="role-detail__info">
              <div className="role-detail__info-item">
                <p className="role-detail__label">Tên vai trò</p>
                <p className="role-detail__value">
                  {role?.title || "Chưa cập nhật"}
                </p>
              </div>

              <div className="role-detail__info-item">
                <p className="role-detail__label">Trạng thái</p>
                <p className="role-detail__value">
                  <span
                    className={`role-detail__status ${
                      role?.status === "active"
                        ? "role-detail__status--active"
                        : "role-detail__status--inactive"
                    }`}
                  >
                    <span className="role-detail__status-dot"></span>
                    {role?.status === "active"
                      ? "Hoạt động"
                      : "Ngừng hoạt động"}
                  </span>
                </p>
              </div>

              <div className="role-detail__info-item">
                <p className="role-detail__label">Ngày tạo</p>
                <p className="role-detail__value">
                  {formatDate(role?.createdAt)}
                </p>
              </div>

              <div className="role-detail__info-item">
                <p className="role-detail__label">Cập nhật lần cuối</p>
                <p className="role-detail__value">
                  {formatDate(role?.updatedAt)}
                </p>
              </div>

              <div className="role-detail__info-item role-detail__info-item--full">
                <p className="role-detail__label">Mô tả</p>
                <p className="role-detail__value">
                  {role?.description || "Chưa có mô tả cho vai trò này."}
                </p>
              </div>
            </div>
          </div>

          {/* PHÂN QUYỀN */}
          <div className="role-detail__section">
            <div className="role-detail__section-header">
              <h3>Phân quyền</h3>

              <span className="role-detail__permission-count">
                {role?.permissions.length || 0} quyền
              </span>
            </div>

            {role?.permissions.length > 0 ? (
              <PermissionTable
                permissions={role?.permissions}
              ></PermissionTable>
            ) : (
              <div className="role-detail__permission-empty">
                <i className="fa-solid fa-shield-halved"></i>
                <p>Chưa có thông tin phân quyền.</p>
                <span>Vai trò này chưa được gán quyền nào trong hệ thống.</span>
              </div>
            )}
          </div>
        </div>
      </Spin>
    </div>
  );
}

export default RoleDetail;

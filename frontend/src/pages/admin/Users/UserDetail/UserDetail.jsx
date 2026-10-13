import { Button, Col, Input, Modal, Row, Spin, Form, notification } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  gethUser,
  resetPassword,
} from "../../../../services/admin/user.services";

import "./UserDetail.scss";

function UserDetail() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const { userId } = useParams();

  const [form] = Form.useForm();
  const [loadingChange, setLoadingChange] = useState(false);

  const [isModal, setIsModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await gethUser(userId);
        if (result.code === 200) {
          setUser(result.data.user);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const formatDate = (date) => {
    if (!date) return "Chưa cập nhật";

    return new Date(date).toLocaleDateString("vi-VN");
  };

  const handleShow = async () => {
    setIsModal(true);
  };

  const handleCancel = () => {
    setIsModal(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      setLoadingChange(true);
      const result = await resetPassword(userId, values);

      if (result.code === 200) {
        notification.success({ title: result.message });
        handleCancel();
      } else {
        notification.error({ title: result.message });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingChange(false);
    }
  };
  return (
    <>
      <div className="user-detail">
        <div className="user-detail__header">
          <div className="user-detail__title">
            <h1>Chi tiết thông tin người dùng</h1>
          </div>

          <div className="user-detail__nav">
            <Link to="/admin/users" className="user-edit__back">
              <i className="fa-solid fa-arrow-left"></i>
              Quay lại
            </Link>
            <Link
              to={`/admin/users/edit/${userId}`}
              className="user-edit__save"
            >
              <i className="fa-solid fa-pen-to-square"></i>
              Chỉnh sửa
            </Link>
          </div>
        </div>

        <div className="user-detail__main">
          <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <div className="user-section">
                  <div className="section-nav">
                    <div className="section-header">
                      <div className="section-avatar">
                        <img src={user?.avatar} alt={user?.fullName} />
                      </div>

                      <div className="section-content">
                        <div className="section-content__name">
                          {user?.fullName}
                        </div>
                        <div className="section-content__email">
                          {user?.email}
                        </div>
                      </div>
                    </div>

                    <div className="user-section__action">
                      <Button onClick={handleShow}>Đặt lại mật khẩu</Button>
                    </div>
                  </div>

                  <div className="user-section__nav">
                    <div className="user-section__date">
                      <div className="user-section__date-icon">
                        <i className="fa-regular fa-calendar-days"></i>
                      </div>
                      <div className="user-section__date-content">
                        <span>Ngày tạo tài khoản</span>
                        <span>{formatDate(user?.createdAt)}</span>
                      </div>
                    </div>
                    <div className="user-section__roles">
                      <div className="user-section__roles-icon">
                        <i className="fa-solid fa-shield-halved"></i>
                      </div>
                      <div className="user-section__roles-content">
                        <span>Vai trò</span>
                        <span>{user?.role.title}</span>
                      </div>
                    </div>
                  </div>

                  <Modal
                    open={isModal}
                    title={
                      <div className="user-password__title">
                        <h3>Đặt lại mật khẩu</h3>
                        <span>Cập nhật mật khẩu cho tài khoản người dùng</span>
                      </div>
                    }
                    okText="Đặt lại"
                    cancelText="Hủy"
                    onCancel={handleCancel}
                    onOk={() => form.submit()}
                    confirmLoading={loadingChange}
                  >
                    <div className="user-password">
                      <div className="user-password__notice">
                        <i className="fa-solid fa-shield-halved"></i>
                        <span>
                          Vui lòng nhập đầy đủ thông tin để thiết lập mật khẩu
                          mới.
                        </span>
                      </div>
                    </div>
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                      <Form.Item
                        label="Mật khẩu "
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập mật khẩu!",
                          },
                          {
                            min: 6,
                            message: "Mật khẩu phải có ít nhất 6 ký tự!",
                          },
                        ]}
                      >
                        <Input.Password
                          prefix={
                            <i className="fa-solid fa-key user-password__input-icon"></i>
                          }
                          placeholder="Nhập mật khẩu mới"
                        />
                      </Form.Item>
                      <Form.Item
                        label="Xác nhận mật khẩu"
                        name="confirmPassword"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập mật khẩu!",
                          },
                          {
                            min: 6,
                            message: "Mật khẩu phải có ít nhất 6 ký tự!",
                          },
                        ]}
                      >
                        <Input.Password
                          prefix={
                            <i className="fa-solid fa-check-double user-password__input-icon"></i>
                          }
                          placeholder="Xác nhận lại mật khẩu"
                        />
                      </Form.Item>
                    </Form>
                  </Modal>
                </div>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={12}>
                <div className="user-section">
                  <h3>Thông tin cá nhân</h3>
                  <div className="section-info">
                    <div className="section-info__name">
                      <div className="section-info__name-icon">
                        <i className="fa-solid fa-user"></i>
                      </div>
                      <div className="section-info__name-content">
                        <span>Họ và tên</span>
                        <span>{user?.fullName}</span>
                      </div>
                    </div>
                    <div className="section-info__email">
                      <div className="section-info__email-icon">
                        <i className="fa-regular fa-envelope"></i>
                      </div>
                      <div className="section-info__email-content">
                        <span>Email</span>
                        <span>{user?.email}</span>
                      </div>
                    </div>
                    <div className="section-info__phone">
                      <div className="section-info__phone-icon">
                        <i className="fa-solid fa-phone"></i>
                      </div>
                      <div className="section-info__phone-content">
                        <span>Số điện thoại</span>
                        <span>{user?.phone}</span>
                      </div>
                    </div>
                    <div className="section-info__address">
                      <div className="section-info__address-icon">
                        <i className="fa-solid fa-location-dot"></i>
                      </div>
                      <div className="section-info__address-content">
                        <span>Địa chỉ</span>
                        <span>
                          {user?.address ? user?.address : "Chưa cập nhật"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={12}>
                <div className="user-section">
                  <h3>Thông tin tài khoản</h3>
                  <div className="section-info">
                    <div className="section-info__role">
                      <div className="section-info__role-icon">
                        <i className="fa-solid fa-shield"></i>
                      </div>
                      <div className="section-info__role-content">
                        <span>Vai trò</span>
                        <span>{user?.role.title}</span>
                      </div>
                    </div>
                    <div className="section-info__status">
                      <div className="section-info__status-icon">
                        <i className="fa-solid fa-circle"></i>
                      </div>
                      <div className="section-info__status-content">
                        <span>Trạng thái</span>
                        <span>
                          {user?.status === "active"
                            ? "Đang hoạt động"
                            : "Dừng hoạt động"}
                        </span>
                      </div>
                    </div>
                    <div className="section-info__updated">
                      <div className="section-info__updated-icon">
                        <i className="fa-regular fa-calendar-days"></i>
                      </div>
                      <div className="section-info__updated-content">
                        <span>Cập nhật lần cuối</span>
                        <span>{formatDate(user?.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Spin>
        </div>
      </div>
    </>
  );
}

export default UserDetail;

import {
  Col,
  Row,
  Spin,
  Tabs,
  Form,
  Input,
  Button,
  Upload,
  notification,
} from "antd";
import { useState } from "react";

import "./Profile.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  changePassword,
  patchUser,
} from "../../../../services/admin/user.services";
import { setAdminAuth } from "../../../../actions/authActions";

function Profile() {
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.authReducer.admin);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const dispatch = useDispatch();

  form.setFieldsValue({
    fullName: user.fullName,
    phone: user.phone,
    email: user.email,
    avatar: user.avatar
      ? [
          {
            uid: "-1",
            name: `${user.fullName}`,
            status: "done",
            url: user.avatar,
          },
        ]
      : [],
  });

  const handleUpdateUser = async (values) => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("fullName", values.fullName);
      data.append("phone", values.phone);
      data.append("email", values.email);
      const avatar = values?.avatar?.[0]?.originFileObj;
      if (avatar) {
        data.append("avatar", avatar);
      }
      const result = await patchUser(user._id, data);
      if (result.code === 200) {
        notification.success({
          title: result.message,
        });
        dispatch(
          setAdminAuth({
            isLoggedIn: true,
            user: result.data.user,
          }),
        );
      } else {
        notification.error({
          title: result.message,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    try {
      setLoading(true);
      const result = await changePassword(user._id, values);
      if (result.code === 200) {
        notification.success({
          title: result.message,
        });

        passwordForm.resetFields();
      } else {
        notification.error({
          title: result.message,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const items = [
    {
      key: "1",
      label: "Thông tin cá nhân",
      children: (
        <>
          <Form layout="vertical" form={form} onFinish={handleUpdateUser}>
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập họ tên!",
                    },
                  ]}
                >
                  <Input placeholder="VD: Nguyễn Văn A" />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item label="Số điện thoại" name="phone">
                  <Input placeholder="VD: 0123456789" />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item label="Email" name="email">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  label="Ảnh đại diện"
                  name="avatar"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => e?.fileList}
                >
                  <Upload
                    listType="picture-card"
                    maxCount={1}
                    accept="image/png,image/jpeg,image/webp"
                    beforeUpload={() => false}
                  >
                    <div>
                      <i className="fa-solid fa-arrow-up-from-bracket"></i>
                      <div>Chọn ảnh</div>
                    </div>
                  </Upload>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Lưu thay đổi
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      ),
    },
    {
      key: "2",
      label: "Đổi mật khẩu",
      children: (
        <>
          <Form
            layout="vertical"
            form={passwordForm}
            onFinish={handleChangePassword}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  label="Mật khẩu hiện tại"
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
                    prefix={<i className="fa-solid fa-lock"></i>}
                    placeholder="Nhập mật khẩu"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} xl={12}>
                <Form.Item
                  label="Mật khẩu mới"
                  name="newPassword"
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
                    prefix={<i className="fa-solid fa-key"></i>}
                    placeholder="Nhập mật khẩu mới"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} xl={12}>
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
              </Col>

              <Col xs={24}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Đổi mật khẩu
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      ),
    },
  ];

  const formatDate = (date) => {
    if (!date) return "Chưa cập nhật";

    return new Date(date).toLocaleDateString("vi-VN");
  };

  return (
    <>
      <div className="account-profile">
        <div className="account-profile__header">
          <div className="account-profile__title">
            <h1>Tài khoản của tôi</h1>
          </div>
        </div>

        <div className="account-profile__main">
          <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
              <Col xs={24} xl={8}>
                <div className="section-info">
                  <div className="section-info__header">
                    <div className="section-info__image">
                      <img src={user.avatar} alt={user.fullName} />
                    </div>
                    <div className="section-info__name">
                      <span>{user.fullName}</span>
                    </div>
                    <div className="section-info__email">
                      <span>{user.email}</span>
                    </div>
                    <div className="section-info__role">
                      <span>{user.role.title}</span>
                    </div>
                  </div>

                  <div className="section-info__content">
                    <div className="section-info__content-role">
                      <span>Vai trò</span>
                      <span>{user.role.title}</span>
                    </div>
                    <div className="section-info__content-role">
                      <span>Trạng thái</span>
                      <span>
                        {user.status === "active"
                          ? "Hoạt động"
                          : "Dừng hoạt động"}
                      </span>
                    </div>
                    <div className="section-info__content-date">
                      <span>Ngày tạo</span>
                      <span>{formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={24} xl={16}>
                <div className="section-info">
                  <Tabs
                    defaultActiveKey="1"
                    items={items}
                    // onChange={onChange}
                  />
                </div>
              </Col>
            </Row>
          </Spin>
        </div>
      </div>
    </>
  );
}
export default Profile;

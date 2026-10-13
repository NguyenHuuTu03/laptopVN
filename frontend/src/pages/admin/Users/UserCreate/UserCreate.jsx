import {
  Button,
  Spin,
  Form,
  Input,
  Select,
  Upload,
  Row,
  Col,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRoles } from "../../../../services/admin/role.services";
import { UploadOutlined } from "@ant-design/icons";

import "./UserCreate.scss";
import { postUser } from "../../../../services/admin/user.services";

function UserCreate() {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        setLoading(true);
        const roleData = await getRoles();
        if (roleData.code === 200) {
          setRoles(roleData.data.roles);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, []);

  const handleSubmit = async (values) => {
    const data = new FormData();
    data.append("fullName", values.fullName || "");
    data.append("email", values.email || "");
    data.append("password", values.password || "");
    data.append("phone", values.phone || "");
    data.append("address", values.address || "");
    data.append("roleId", values.roleId || "");
    const avatar = values.avatar?.[0]?.originFileObj;
    if (avatar) {
      data.append("avatar", avatar);
    }
    const result = await postUser(data);
    if (result.code === 200) {
      notification.success({
        title: result.message,
      });
      navigate("/admin/users");
    } else {
      notification.error({
        title: result.message,
      });
    }
  };
  const optionRole = roles?.map((role) => ({
    value: role._id,
    label: role.title,
  }));
  return (
    <>
      <div className="user-create">
        <div className="user-create__header">
          <div className="user-create__title">
            <h1>Thêm người dùng</h1>
          </div>
          <div className="user-create__nav">
            <Link to="/admin/users" className="user-create__back">
              <i className="fa-solid fa-arrow-left"></i>
              Quay lại
            </Link>
            <Button
              loading={loading}
              className="user-create__save"
              type="primary"
              htmlType="submit"
              form="user-create__form"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <p>Lưu thay đổi</p>
            </Button>
          </div>
        </div>

        <div className="user-create__main">
          <div className="user-create__main-title">
            <h3>Thông tin người dùng</h3>
          </div>

          <Spin spinning={loading}>
            <Form
              id="user-create__form"
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} xl={12}>
                  <Form.Item
                    label="Họ tên"
                    name="fullName"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập họ tên!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập họ tên" />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập email!",
                      },
                      {
                        type: "email",
                        message: "Email không đúng định dạng!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập email" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} xl={12}>
                  <Form.Item
                    label="Mật khẩu"
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
                    <Input.Password placeholder="Nhập mật khẩu" />
                  </Form.Item>
                  <Form.Item label="Số điện thoại" name="phone">
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Form.Item label="Địa chỉ" name="address">
                    <Input.TextArea placeholder="Nhập địa chỉ" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} xl={6}>
                  <Form.Item
                    label="Vai trò"
                    name="roleId"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn vai trò!",
                      },
                    ]}
                  >
                    <Select
                      options={optionRole}
                      placeholder="Chọn vai trò"
                    ></Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} xl={6}>
                  <div></div>
                </Col>

                <Col xs={24} sm={12} xl={12}>
                  <Form.Item
                    label="Ảnh"
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
                        <UploadOutlined />
                        <div>Chọn ảnh</div>
                      </div>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Spin>
        </div>
      </div>
    </>
  );
}

export default UserCreate;

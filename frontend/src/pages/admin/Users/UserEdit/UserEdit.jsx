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
import { Link, useParams } from "react-router-dom";
import { getRoles } from "../../../../services/admin/role.services";
import { UploadOutlined } from "@ant-design/icons";

import "./UserEdit.scss";
import { gethUser, patchUser } from "../../../../services/admin/user.services";
import { useDispatch } from "react-redux";
import { setAdminAuth } from "../../../../actions/authActions";

function UserEdit() {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState(null);

  const [form] = Form.useForm();

  const { userId } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        setLoading(true);
        const roleData = await getRoles();
        if (roleData.code === 200) {
          setRoles(roleData.data.roles);
        }

        const result = await gethUser(userId);

        if (result.code === 200) {
          const data = result.data.user;
          form.setFieldsValue({
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            roleId: data.roleId,
            avatar: data.avatar
              ? [
                  {
                    uid: "-1",
                    name: "avatar.png",
                    status: "done",
                    url: data.avatar,
                  },
                ]
              : [],
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [form, userId]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("address", values.address);
      formData.append("roleId", values.roleId);

      const avatar = values.avatar?.[0]?.originFileObj;
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const result = await patchUser(userId, formData);

      if (result.code === 200) {
        dispatch(
          setAdminAuth({
            isLoggedIn: true,
            user: result.data.user,
          }),
        );
        notification.success({
          title: result.message,
        });
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
  const optionRole = roles?.map((role) => ({
    value: role._id,
    label: role.title,
  }));
  return (
    <>
      <div className="user-edit">
        <div className="user-edit__header">
          <div className="user-edit__title">
            <h1>Chỉnh sửa người dùng</h1>
          </div>
          <div className="user-edit__nav">
            <Link to="/admin/users" className="user-edit__back">
              <i className="fa-solid fa-arrow-left"></i>
              Quay lại
            </Link>
            <Button
              loading={loading}
              className="user-edit__save"
              type="primary"
              htmlType="submit"
              form="user-edit__form"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <p>Lưu thay đổi</p>
            </Button>
          </div>
        </div>

        <div className="user-edit__main">
          <div className="user-edit__main-title">
            <h3>Thông tin người dùng</h3>
          </div>

          <Spin spinning={loading}>
            <Form
              id="user-edit__form"
              layout="vertical"
              form={form}
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

                  <Form.Item label="Số điện thoại" name="phone">
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} xl={12}>
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
                    <Input placeholder="Nhập email" disabled />
                  </Form.Item>

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
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  <Form.Item label="Địa chỉ" name="address">
                    <Input.TextArea placeholder="Nhập địa chỉ" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
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

export default UserEdit;

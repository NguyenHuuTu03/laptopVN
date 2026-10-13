import { Button, Form, Input, notification, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import "./RoleCreate.scss";
import { useState } from "react";
import { postRole } from "../../../../services/admin/role.services";
import { Link, useNavigate } from "react-router-dom";

function RoleCreate() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const result = await postRole(values);
      if (result.code === 200) {
        notification.success({
          title: result.message,
        });
        navigate("/admin/roles");
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
  return (
    <>
      <div className="role-create">
        <div className="role-create__header">
          <div className="role-create__title">
            <h1>Thêm vai trò</h1>
          </div>
          <div className="role-create__nav">
            <Link to="/admin/roles" className="role-create__back">
              <i className="fa-solid fa-arrow-left"></i>
              Quay lại
            </Link>
            <Button
              loading={loading}
              className="role-create__save"
              type="primary"
              htmlType="submit"
              form="role-create__form"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <p>Lưu thay đổi</p>
            </Button>
          </div>
        </div>

        <div className="role-create__main">
          <div className="role-create__main-title">
            <h3>Thông tin vai trò</h3>
          </div>

          <Spin spinning={loading}>
            <Form
              id="role-create__form"
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Form.Item
                label="Tên vai trò"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên vai trò!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên vai trò" />
              </Form.Item>
              <Form.Item label="Mô tả" name="description">
                <TextArea rows={3} />
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </div>
    </>
  );
}
export default RoleCreate;

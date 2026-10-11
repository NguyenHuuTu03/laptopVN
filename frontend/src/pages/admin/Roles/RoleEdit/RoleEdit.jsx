import { Button, Form, Input, notification, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import "./RoleEdit.scss";
import { useState } from "react";
import { getRole, patchRole } from "../../../../services/admin/role.services";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";

function RoleEdit() {
  const [loading, setLoading] = useState(false);
  const { roleId } = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const result = await getRole(roleId);
        if (result.code === 200) {
          const data = result.data.role;
          form.setFieldsValue({
            title: data.title,
            description: data.description,
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [form, roleId]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const result = await patchRole(roleId, values);
      if (result.code === 200) {
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
  return (
    <>
      <div className="role-edit">
        <div className="role-edit__header">
          <div className="role-edit__title">
            <h1>Chỉnh sửa vai trò</h1>
          </div>
          <div className="role-edit__nav">
            <Link to="/admin/roles" className="role-edit__back">
              <i className="fa-solid fa-arrow-left"></i>
              Quay lại
            </Link>

            <Button
              loading={loading}
              className="role-edit__save"
              type="primary"
              htmlType="submit"
              form="role-edit__form"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <p>Lưu thay đổi</p>
            </Button>
          </div>
        </div>

        <div className="role-edit__main">
          <div className="role-edit__main-title">
            <h3>Thông tin vai trò</h3>
          </div>

          <Spin spinning={loading}>
            <Form
              id="role-edit__form"
              layout="vertical"
              onFinish={handleSubmit}
              form={form}
            >
              <Form.Item label="Tên vai trò" name="title">
                <Input />
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
export default RoleEdit;

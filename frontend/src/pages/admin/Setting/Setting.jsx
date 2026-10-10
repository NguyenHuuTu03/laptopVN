import { Button, Form, Input, notification, Spin, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./Settings.scss";
import {
  getSettings,
  patchSettings,
} from "../../../services/admin/setting.services";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import { useDispatch } from "react-redux";
import { setSettings } from "../../../actions/settingActions";
function Setting() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const result = await getSettings();

      if (result.code === 200) {
        const data = result.data.setting;
        dispatch(setSettings(data));
        form.setFieldsValue({
          title: data.title,
          email: data.email,
          hotline: data.hotline,
          address: data.address,
          description: data.description,
          footer: data.footer,
          logo: data.logo
            ? [
                {
                  uid: "-1",
                  name: "logo.png",
                  status: "done",
                  url: data.logo,
                },
              ]
            : [],

          sideBar: data.sideBar.map((item, index) => ({
            uid: `${index}`,
            name: `banner-${index}`,
            status: "done",
            url: item,
          })),
        });
      }
    };
    fetchData();
  }, [form, dispatch]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("email", values.email);
      formData.append("hotline", values.hotline);
      formData.append("address", values.address);
      formData.append("description", values.description);
      formData.append("footer", values.footer);

      const logo = values.logo?.[0];

      if (logo?.originFileObj) {
        formData.append("logo", logo.originFileObj);
      }

      const oldBanners = values.sideBar
        .filter((item) => !item.originFileObj && item.url)
        .map((item) => item.url);

      formData.append("oldSidebar", JSON.stringify(oldBanners));

      values.sideBar.forEach((item) => {
        if (item.originFileObj) {
          formData.append("sideBar", item.originFileObj);
        }
      });

      const result = await patchSettings(formData);

      if (result.code === 200) {
        dispatch(setSettings(result.data.setting));
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
      <div className="admin-settings">
        <div className="admin-settings__header">
          <div className="admin-settings__title">
            <h1>Cài đặt chung</h1>
          </div>
          <div className="admin-settings__nav">
            <Button
              loading={loading}
              className="admin-settings__save"
              type="primary"
              htmlType="submit"
              form="settings-form"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <p>Lưu thay đổi</p>
            </Button>
          </div>
        </div>

        <div className="admin-settings__main">
          <div className="admin-settings__main-title">
            <h3>Thông tin cài đặt</h3>
          </div>
          <Spin spinning={loading}>
            <Form
              id="settings-form"
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
            >
              <Form.Item label="Tên website" name="title">
                <Input />
              </Form.Item>
              <Form.Item label="Email liên hệ" name="email">
                <Input />
              </Form.Item>
              <Form.Item label="Số điện thoại" name="hotline">
                <Input />
              </Form.Item>
              <Form.Item label="Địa chỉ cửa hàng" name="address">
                <Input />
              </Form.Item>
              <Form.Item label="Mô tả" name="description">
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item label="Footer" name="footer">
                <TextArea rows={3} />
              </Form.Item>
              <Form.Item
                label="Logo website"
                name="logo"
                valuePropName="fileList"
                getValueFromEvent={(e) => e.fileList}
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
              <Form.Item
                label="Banner"
                name="sideBar"
                valuePropName="fileList"
                getValueFromEvent={(e) => e.fileList}
              >
                <Upload
                  listType="picture-card"
                  multiple
                  maxCount={5}
                  accept="image/png,image/jpeg,image/webp"
                  beforeUpload={() => false}
                >
                  <div>
                    <UploadOutlined />
                    <div>Chọn ảnh</div>
                  </div>
                </Upload>
              </Form.Item>
            </Form>
          </Spin>
        </div>
      </div>
    </>
  );
}
export default Setting;

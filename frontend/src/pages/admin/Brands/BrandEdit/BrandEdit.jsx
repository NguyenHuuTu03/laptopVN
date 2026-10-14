import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Row,
  Spin,
  Form,
  Input,
  Upload,
  notification,
  Switch,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "./BrandEdit.scss";
import {
  getBrand,
  patchBrand,
} from "../../../../services/admin/brand.services";

function BrandEdit() {
  const [loading, setLoading] = useState(false);
  const { brandId } = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getBrand(brandId);
        if (result.code === 200) {
          const data = result.data.brand;
          form.setFieldsValue({
            title: data.title,
            description: data.description,
            country: data.country,
            website: data.website,
            status: data.status === "active",
            thumbnail: data.thumbnail
              ? [
                  {
                    uid: "-1",
                    name: "thumbnail.png",
                    status: "done",
                    url: data.thumbnail,
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
    fetchData();
  }, [form, brandId]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", values.title);
      data.append("country", values.country || "");
      data.append("website", values.website || "");
      data.append("description", values.description || "");
      data.append("status", values.status === true ? "active" : "inactive");
      const thumbnail = values?.thumbnail?.[0]?.originFileObj;
      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      }
      const result = await patchBrand(brandId, data);
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
      <div className="brand-edit">
        <div className="brand-edit__header">
          <div className="brand-edit__title">
            <h1>Chỉnh sửa thương hiệu</h1>
          </div>

          <div className="brand-edit__nav">
            <Link to="/admin/brands" className="brand-edit__back">
              <i className="fa-solid fa-arrow-left"></i>
              Quay lại
            </Link>
            <Button
              loading={loading}
              className="brand-edit__save"
              type="primary"
              htmlType="submit"
              form="brand-edit__form"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <p>Lưu thay đổi</p>
            </Button>
          </div>
        </div>

        <div className="brand-edit__form">
          <Spin spinning={loading}>
            <Form
              form={form}
              layout="vertical"
              id="brand-edit__form"
              onFinish={handleSubmit}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} xl={16}>
                  <div className="section-info">
                    <div className="section-info__header">
                      <h3>Thông tin thương hiệu</h3>
                    </div>
                    <div className="section-info__main">
                      <Form.Item
                        label="Tên thương hiệu"
                        name="title"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên thương hiệu!",
                          },
                        ]}
                      >
                        <Input placeholder="Ví dụ: ASUS, Acer, Dell..." />
                      </Form.Item>
                      <Form.Item
                        label="Quốc gia"
                        name="country"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập quốc gia xuất xứ!",
                          },
                        ]}
                      >
                        <Input placeholder="Nhập quốc gia xuất xứ" />
                      </Form.Item>

                      <Form.Item label="Website" name="website">
                        <Input placeholder="https://example.com" />
                      </Form.Item>
                      <Form.Item label="Mô tả" name="description">
                        <Input.TextArea
                          placeholder="Nhập mô tả về thương hiệu..."
                          rows={3}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </Col>

                <Col xs={24} xl={8}>
                  <div className="section-info">
                    <div className="section-info__header">
                      <h3>Ảnh thương hiệu</h3>
                    </div>
                    <div className="section-info__main">
                      <Form.Item
                        label="Ảnh"
                        name="thumbnail"
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
                      <Form.Item
                        label="Trạng thái"
                        name="status"
                        valuePropName="checked"
                      >
                        <Switch
                          checkedChildren="Hoạt động"
                          unCheckedChildren="Dừng hoạt động"
                        ></Switch>
                      </Form.Item>
                    </div>
                  </div>
                </Col>
              </Row>
            </Form>
          </Spin>
        </div>
      </div>
    </>
  );
}
export default BrandEdit;

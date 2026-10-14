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
} from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./BrandCreate.scss";
import { postBrand } from "../../../../services/admin/brand.services";

function BrandCreate() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", values.title);
      data.append("country", values.country || "");
      data.append("website", values.website || "");
      data.append("description", values.description || "");

      const thumbnail = values?.thumbnail?.[0]?.originFileObj;
      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      }
      const result = await postBrand(data);
      if (result.code === 200) {
        notification.success({
          title: result.message,
        });
        navigate("/admin/brands");
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
      <div className="brand-create">
        <div className="brand-create__header">
          <div className="brand-create__title">
            <h1>Thêm thương hiệu</h1>
          </div>

          <div className="brand-create__nav">
            <Link to="/admin/brands" className="brand-create__back">
              <i className="fa-solid fa-arrow-left"></i>
              Quay lại
            </Link>
            <Button
              loading={loading}
              className="brand-create__save"
              type="primary"
              htmlType="submit"
              form="brand-create__form"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <p>Lưu thay đổi</p>
            </Button>
          </div>
        </div>

        <div className="brand-create__form">
          <Spin spinning={loading}>
            <Form
              layout="vertical"
              id="brand-create__form"
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
export default BrandCreate;

import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Spin,
  Form,
  Row,
  Col,
  Input,
  Upload,
  Select,
  Switch,
} from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../../../services/admin/category.services";
import { getBrands } from "../../../../services/admin/brand.services";

import "./ProductCreate.scss";

function ProductCreate() {
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState(null);
  const [brands, setBrands] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getCategories();
        if (result.code === 200) {
          const data = result.data.categories;
          setCategories(data);
        }

        const record = await getBrands();
        if (record.code === 200) {
          setBrands(record.data.brands);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const setLevel = (category, categories) => {
    let level = 0;
    let parentId = category.parentId;

    while (parentId) {
      const parent = categories.find((item) => item._id === parentId);
      if (!parent) break;
      level += 1;
      parentId = parent.parentId;
    }
    return level;
  };

  const optionCategories = categories?.map((item) => {
    const level = setLevel(item, categories);
    return {
      value: item._id,
      label: `${"--".repeat(level + 1)} ${item.title}`,
    };
  });
  const optionBrands = brands?.map((item) => {
    return {
      value: item._id,
      label: item.title,
    };
  });
  return (
    <>
      <div className="product-create">
        <div className="product-create__header">
          <div className="product-create__title">
            <h1>Thêm sản phẩm</h1>
          </div>
          <div className="product-create__nav">
            <Link to="/admin/products" className="product-create__back">
              <i className="fa-solid fa-arrow-left"></i>
              Quay lại
            </Link>
            <Button
              loading={loading}
              className="product-create__save"
              type="primary"
              htmlType="submit"
              form="product-create__form"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <p>Lưu thay đổi</p>
            </Button>
          </div>
        </div>

        <div className="product-create__main">
          <Spin spinning={loading}>
            <Form layout="vertical" id="product-create__form" form={form}>
              <Row gutter={[16, 16]} className="product-create__row">
                <Col xs={24} xl={12}>
                  <div className="section-info">
                    <div className="section-info__header">
                      <h3>Thông tin chung</h3>
                    </div>

                    <div className="section-info__main">
                      <Form.Item
                        label="Tên sản phẩm"
                        name="title"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên sản phẩm!",
                          },
                        ]}
                      >
                        <Input placeholder="Ví dụ: Laptop ASUS Vivobook 15" />
                      </Form.Item>
                      <Form.Item label="Danh mục " name="categoryId">
                        <Select
                          options={optionCategories}
                          placeholder="Chọn danh mục "
                        />
                      </Form.Item>
                      <Form.Item label="Thương hiệu" name="brandId">
                        <Select
                          options={optionBrands}
                          placeholder="Chọn danh thương hiệu"
                        />
                      </Form.Item>

                      <Form.Item label="Mô tả" name="description">
                        <Input.TextArea
                          placeholder="Mô tả chi tiết sản phẩm..."
                          rows={3}
                        />
                      </Form.Item>

                      <Form.Item label="Bảo hành" name="warranty">
                        <Input placeholder="VD: 24 tháng chính hãng" />
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

                <Col xs={24} xl={12}>
                  <div className="section-info">
                    <div className="section-info__header">
                      <h3>Thông số kỹ thuật</h3>
                      <div className="section-info__header-action">
                        <span>
                          <i className="fa-solid fa-plus"></i>
                        </span>
                        <span>Thêm</span>
                      </div>
                    </div>
                    <div className="section-info__main">
                      <Row gutter={[16, 16]}>
                        <Col xs={24} xl={10}>
                          <Form.Item name="key">
                            <Input placeholder="VD: CPU, RAM" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} xl={10}>
                          <Form.Item name="value">
                            <Input placeholder="Giá trị (VD: Intel Core i5-1335U)" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} xl={4}>
                          <Button>Xoá</Button>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row gutter={[16, 16]} className="product-create__row">
                <Col xs={24}>
                  <div className="section-info">
                    <div className="section-info__header">
                      <h3>Ảnh sản phẩm</h3>
                    </div>
                    <div className="section-info__main">
                      <Form.Item
                        label="Ảnh đại diện"
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
                        label="Ảnh phụ"
                        name="images"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e.fileList}
                      >
                        <Upload
                          listType="picture-card"
                          multiple
                          // maxCount={5}
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
export default ProductCreate;

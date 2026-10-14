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
  Select,
  Switch,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "./CategoryEdit.scss";
import {
  getCategories,
  getCategory,
  patchCategory,
} from "../../../../services/admin/category.services";

function CategoryEdit() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState(null);
  const { categoryId } = useParams();
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

        const getData = await getCategory(categoryId);
        if (getData.code === 200) {
          const record = getData.data.category;
          form.setFieldsValue({
            title: record.title,
            description: record.description,
            parentId: record.parentId,
            status: record.status === "active",
            thumbnail: record.thumbnail
              ? [
                  {
                    uid: "-1",
                    name: "thumbnail.png",
                    status: "done",
                    url: record.thumbnail,
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
  }, [categoryId, form]);

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

  const option = categories?.map((item) => {
    const level = setLevel(item, categories);
    return {
      value: item._id,
      label: `${"--".repeat(level + 1)} ${item.title}`,
    };
  });

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", values.title);
      data.append("parentId", values.parentId || "");
      data.append("description", values.description || "");
      data.append("status", values.status === true ? "active" : "inactive");

      const thumbnail = values?.thumbnail?.[0]?.originFileObj;
      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      }
      const result = await patchCategory(categoryId, data);
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
      <div className="category-edit">
        <div className="category-edit__header">
          <div className="category-edit__title">
            <h1>Chỉnh sửa danh mục</h1>
          </div>

          <div className="category-edit__nav">
            <Link to="/admin/categories" className="category-edit__back">
              <i className="fa-solid fa-arrow-left"></i>
              Quay lại
            </Link>
            <Button
              loading={loading}
              className="category-edit__save"
              type="primary"
              htmlType="submit"
              form="category-edit__form"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <p>Lưu thay đổi</p>
            </Button>
          </div>
        </div>

        <div className="category-edit__main">
          <Spin spinning={loading}>
            <Form
              layout="vertical"
              form={form}
              id="category-edit__form"
              onFinish={handleSubmit}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} xl={16}>
                  <div className="section-info">
                    <div className="section-info__header">
                      <h3>Thông tin danh mục</h3>
                    </div>
                    <div className="section-info__main">
                      <Form.Item
                        label="Tên danh mục"
                        name="title"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên danh mục!",
                          },
                        ]}
                      >
                        <Input placeholder="Ví dụ: Laptop, Điện thoại, Pc..." />
                      </Form.Item>
                      <Form.Item label="Danh mục cha" name="parentId">
                        <Select
                          options={option}
                          placeholder="Chọn danh mục cha"
                        />
                      </Form.Item>

                      <Form.Item label="Mô tả" name="description">
                        <Input.TextArea
                          placeholder="Nhập mô tả danh mục..."
                          rows={3}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </Col>

                <Col xs={24} xl={8}>
                  <div className="section-info">
                    <div className="section-info__header">
                      <h3>Ảnh danh mục</h3>
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
export default CategoryEdit;

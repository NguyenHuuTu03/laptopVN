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
  InputNumber,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCategories } from "../../../../services/admin/category.services";
import { getBrands } from "../../../../services/admin/brand.services";

import "./ProductCreate.scss";
import { postProduct } from "../../../../services/admin/product.services";

function ProductCreate() {
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState(null);
  const [brands, setBrands] = useState(null);

  const navigate = useNavigate();

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

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", values.title);
      data.append("brandId", values.brandId || "");
      data.append("categoryId", values.categoryId || "");
      data.append("description", values.description || "");
      data.append("featured", values.featured || "");
      data.append(
        "specifications",
        JSON.stringify(values.specifications || []),
      );
      data.append("warranty", values.warranty || "");
      data.append("variants", JSON.stringify(values.variants || []));

      const thumbnail = values?.thumbnail?.[0]?.originFileObj;
      if (thumbnail) {
        data.append("thumbnail", thumbnail);
      }

      values.images.forEach((item) => {
        if (item.originFileObj) {
          data.append("images", item.originFileObj);
        }
      });

      const result = await postProduct(data);
      if (result.code === 200) {
        notification.success({
          title: result.message,
        });
        navigate("/admin/products");
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
            <Form
              layout="vertical"
              id="product-create__form"
              onFinish={handleSubmit}
            >
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
                        label="Sản phẩm nổi bật"
                        name="featured"
                        valuePropName="checked"
                      >
                        <Switch
                          checkedChildren="Nôi bật"
                          unCheckedChildren="Không nổi bật"
                        ></Switch>
                      </Form.Item>
                    </div>
                  </div>
                </Col>
                <Col xs={24} xl={12}>
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

              <Row gutter={[16, 16]} className="product-create__row">
                <Col xs={12}>
                  <div className="section-info">
                    <div className="section-info__header">
                      <h3>Thông số kỹ thuật</h3>
                    </div>
                    <div className="section-info__main">
                      <Form.List name="specifications">
                        {(groups, { add: addGroup, remove: removeGroup }) => (
                          <>
                            {groups.map((group) => (
                              <div key={group.key} className="spec-group">
                                <div className="spec-group__header">
                                  <Form.Item
                                    name={[group.name, "group"]}
                                    className="spec-group__name"
                                    rules={[
                                      {
                                        required: true,
                                        message: "Vui lòng nhập tên nhóm!",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="Tên nhóm (VD: Bộ xử lý, Màn hình)" />
                                  </Form.Item>
                                  <Button
                                    danger
                                    onClick={() => removeGroup(group.name)}
                                  >
                                    <i className="fa-solid fa-trash"></i>
                                  </Button>
                                </div>

                                {/* Danh sách con: các cặp key-value của nhóm */}
                                <Form.List name={[group.name, "items"]}>
                                  {(
                                    items,
                                    { add: addItem, remove: removeItem },
                                  ) => (
                                    <>
                                      {items.map((item) => (
                                        <Row key={item.key} gutter={8}>
                                          <Col xs={24} sm={9}>
                                            <Form.Item
                                              name={[item.name, "key"]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Nhập tên thông số",
                                                },
                                              ]}
                                            >
                                              <Input placeholder="VD: CPU, RAM" />
                                            </Form.Item>
                                          </Col>
                                          <Col xs={24} sm={12}>
                                            <Form.Item
                                              name={[item.name, "value"]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Nhập giá trị",
                                                },
                                              ]}
                                            >
                                              <Input placeholder="VD: Intel Core i5-1335U" />
                                            </Form.Item>
                                          </Col>
                                          <Col xs={24} sm={3}>
                                            <Button
                                              danger
                                              onClick={() =>
                                                removeItem(item.name)
                                              }
                                            >
                                              <i className="fa-solid fa-xmark"></i>
                                            </Button>
                                          </Col>
                                        </Row>
                                      ))}
                                      <Button
                                        type="dashed"
                                        block
                                        onClick={() =>
                                          addItem({ key: "", value: "" })
                                        }
                                      >
                                        <i className="fa-solid fa-plus"></i>{" "}
                                        Thêm thông số
                                      </Button>
                                    </>
                                  )}
                                </Form.List>
                              </div>
                            ))}

                            <Button
                              type="primary"
                              block
                              onClick={() =>
                                addGroup({
                                  group: "",
                                  items: [{ key: "", value: "" }],
                                })
                              }
                            >
                              <i className="fa-solid fa-plus"></i> Thêm nhóm
                              thông số
                            </Button>
                          </>
                        )}
                      </Form.List>
                    </div>
                  </div>
                </Col>

                <Col xs={12}>
                  <div className="section-info">
                    <div className="section-info__header">
                      <h3>Phiên bản sản phẩm</h3>
                    </div>
                    <div className="section-info__main">
                      <Form.List name="variants">
                        {(
                          variants,
                          { add: addVariant, remove: removeVariant },
                        ) => (
                          <>
                            {variants.map((variant, index) => (
                              <div key={variant.key} className="variant-item">
                                <div className="variant-item__header">
                                  <strong>Phiên bản {index + 1}</strong>
                                  <Button
                                    danger
                                    onClick={() => removeVariant(variant.name)}
                                  >
                                    <i className="fa-solid fa-trash"></i> Xóa
                                  </Button>
                                </div>

                                <Row gutter={[16, 16]}>
                                  <Col xs={24} sm={12} xl={8}>
                                    <Form.Item
                                      label="Giá (đ)"
                                      name={[variant.name, "price"]}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Vui lòng nhập giá sản phẩm!",
                                        },
                                      ]}
                                    >
                                      <InputNumber
                                        formatter={(v) =>
                                          `${v}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ".",
                                          )
                                        }
                                        parser={(v) => v?.replace(/\./g, "")}
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={12} sm={8} xl={8}>
                                    <Form.Item
                                      label="Giảm giá (%)"
                                      name={[variant.name, "discount"]}
                                    >
                                      <InputNumber min={0} max={100} />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={12} sm={8} xl={8}>
                                    <Form.Item
                                      label="Tồn kho"
                                      name={[variant.name, "stock"]}
                                      rules={[
                                        {
                                          required: true,
                                          message:
                                            "Vui lòng nhập số lượng tồn kho!",
                                        },
                                      ]}
                                    >
                                      <InputNumber min={0} />
                                    </Form.Item>
                                  </Col>
                                  {/* <Col xs={24} sm={8} xl={4}>
                                    <Form.Item
                                      label="Trạng thái"
                                      name={[variant.name, "status"]}
                                    >
                                      <Select
                                        options={[
                                          {
                                            value: "active",
                                            label: "Đang bán",
                                          },
                                          { value: "inactive", label: "Ẩn" },
                                        ]}
                                      />
                                    </Form.Item>
                                  </Col> */}
                                </Row>

                                <Form.List name={[variant.name, "attributes"]}>
                                  {(
                                    attrs,
                                    { add: addAttr, remove: removeAttr },
                                  ) => (
                                    <>
                                      {attrs.map((attr) => (
                                        <Row key={attr.key} gutter={8}>
                                          <Col xs={24} sm={9}>
                                            <Form.Item
                                              name={[attr.name, "key"]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message:
                                                    "Vui lòng nhập tên thuộc tính",
                                                },
                                              ]}
                                            >
                                              <Input placeholder="Thuộc tính (VD: Màu sắc, RAM)" />
                                            </Form.Item>
                                          </Col>
                                          <Col xs={24} sm={11}>
                                            <Form.Item
                                              name={[attr.name, "value"]}
                                              rules={[
                                                {
                                                  required: true,
                                                  message:
                                                    "Vui lòng nhập giá trị",
                                                },
                                              ]}
                                            >
                                              <Input placeholder="Giá trị (VD: Bạc, 16GB)" />
                                            </Form.Item>
                                          </Col>
                                          <Col xs={24} sm={4}>
                                            <Button
                                              danger
                                              onClick={() =>
                                                removeAttr(attr.name)
                                              }
                                            >
                                              <i className="fa-solid fa-xmark"></i>
                                            </Button>
                                          </Col>
                                        </Row>
                                      ))}
                                      <Button
                                        type="dashed"
                                        block
                                        onClick={() => addAttr()}
                                      >
                                        <i className="fa-solid fa-plus"></i>
                                        Thêm thuộc tính
                                      </Button>
                                    </>
                                  )}
                                </Form.List>
                              </div>
                            ))}
                            <Button
                              type="primary"
                              block
                              onClick={() => addVariant()}
                            >
                              <i className="fa-solid fa-plus"></i> Thêm phiên
                              bản
                            </Button>
                          </>
                        )}
                      </Form.List>
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

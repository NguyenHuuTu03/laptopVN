import {
  Button,
  Spin,
  Form,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  InputNumber,
  notification,
  Switch,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "./CouponEdit.scss";
import {
  getCoupon,
  patchCoupon,
} from "../../../../services/admin/coupon.services";

import dayjs from "dayjs";

function CouponEdit() {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const { couponId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getCoupon(couponId);

        if (result.code === 200) {
          const data = result.data.coupon;
          form.setFieldsValue({
            code: data.code,
            description: data.description,
            discountType: data.discountType,
            discountValue: data.discountValue,
            minOrderValue: data.minOrderValue,
            maxDiscount: data.maxDiscount,
            quantity: data.quantity,
            usedCount: data.usedCount,
            startDate: dayjs(data.startDate),
            endDate: dayjs(data.endDate),
            status: data.status === "active",
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [couponId, form]);

  const optionType = [
    {
      value: "percent",
      label: "Phần trăm (%)",
    },
    {
      value: "fixed",
      label: "Cố định",
    },
  ];

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const data = {
        ...values,
        status: values.status ? "active" : "inactive",
        startDate: values.startDate.toDate(),
        endDate: values.endDate.toDate(),
      };
      const result = await patchCoupon(couponId, data);
      if (result.code === 200) {
        notification.success({
          title: result.message,
        });
      } else {
        notification.error({
          title: result.message,
        });
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="coupon-create">
        <div className="coupon-create__header">
          <div className="coupon-create__title">
            <h1>Chỉnh sửa mã giảm giá</h1>
          </div>

          <div className="coupon-create__nav">
            <Link to="/admin/coupons" className="coupon-create__back">
              <i className="fa-solid fa-arrow-left"></i>
              Quay lại
            </Link>
            <Button
              loading={loading}
              className="coupon-create__save"
              type="primary"
              htmlType="submit"
              form="coupon-create__form"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <p>Lưu thay đổi</p>
            </Button>
          </div>
        </div>

        <div className="coupon-create__main">
          <Spin spinning={loading}>
            <Form
              id="coupon-create__form"
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
            >
              <div className="section-info">
                <div className="section-info__header">
                  <div className="section-info__header-icon">
                    <i className="fa-solid fa-ticket-simple"></i>
                  </div>
                  <div className="section-info__header-content">
                    <h3>Thông tin mã giảm giá</h3>
                    <span>Mã ưu đãi và nội dung hiển thị</span>
                  </div>
                  <div className="section-info__header-action">
                    <Form.Item name="status" valuePropName="checked" noStyle>
                      <Switch
                        checkedChildren="Hoạt động"
                        unCheckedChildren="Dừng hoạt động"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="section-info__main">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} xl={12}>
                      <Form.Item
                        label="Mã giảm giá"
                        name="code"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập mã giảm giá!",
                          },
                        ]}
                      >
                        <Input placeholder="Nhập mã giảm giá" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} xl={12}>
                      <Form.Item
                        label="Tổng số lượng sử dụng"
                        name="quantity"
                        initialValue={10}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập số lượng sử dụng!",
                          },
                        ]}
                      >
                        <InputNumber placeholder="Nhập số lượng sử dụng" />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item label="Mô tả" name="description">
                        <Input.TextArea placeholder="Nhập mô tả chương trình ưu đãi..." />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </div>

              <div className="section-info">
                <div className="section-info__header">
                  <div className="section-info__header-icon">
                    <i className="fa-solid fa-percent"></i>
                  </div>
                  <div className="section-info__header-content">
                    <h3>Thiết lập ưu đãi</h3>
                    <span>Loại giảm giá và điều kiện áp dụng</span>
                  </div>
                </div>

                <div className="section-info__main">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} xl={12}>
                      <Form.Item
                        label="Loại giảm giá"
                        name="discountType"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn loại giảm giá!",
                          },
                        ]}
                      >
                        <Select
                          options={optionType}
                          placeholder="Chọn loại giảm giá"
                        ></Select>
                      </Form.Item>
                      <Form.Item
                        label="Đơn tối thiểu (VNĐ)"
                        name="minOrderValue"
                        initialValue={0}
                      >
                        <InputNumber placeholder="Nhập đơn tối thiểu" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} xl={12}>
                      <Form.Item
                        label="Giá trị giảm"
                        name="discountValue"
                        initialValue={0}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập giá trị giảm giá!",
                          },
                        ]}
                      >
                        <InputNumber placeholder="Nhập giá trị giảm giá" />
                      </Form.Item>

                      <Form.Item
                        label="Giảm tối đa (VNĐ)"
                        name="maxDiscount"
                        initialValue={0}
                      >
                        <InputNumber placeholder="Nhập giảm tối đa" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </div>

              <div className="section-info">
                <div className="section-info__header">
                  <div className="section-info__header-icon">
                    <i className="fa-solid fa-business-time"></i>
                  </div>
                  <div className="section-info__header-content">
                    <h3>Thời hạn và số lượng</h3>
                    <span>Thời gian sử dụng và giới hạn lượt áp dụng</span>
                  </div>
                </div>

                <div className="section-info__main">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} xl={12}>
                      <Form.Item
                        label="Ngày bắt đầu"
                        name="startDate"
                        format="DD/MM/YYYY"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn ngày bắt đầu!",
                          },
                        ]}
                      >
                        <DatePicker placeholder="Chọn ngày bắt đầu" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} xl={12}>
                      <Form.Item
                        label="Ngày kết thúc"
                        name="endDate"
                        format="DD/MM/YYYY"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn ngày kết thúc!",
                          },
                        ]}
                      >
                        <DatePicker placeholder="Chọn ngày kết thúc" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </div>
            </Form>
          </Spin>
        </div>
      </div>
    </>
  );
}
export default CouponEdit;

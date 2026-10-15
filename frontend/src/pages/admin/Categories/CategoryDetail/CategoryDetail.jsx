import { Col, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import "./CategoryDetail.scss";
import { getCategory } from "../../../../services/admin/category.services";

function CategoryDetail() {
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState(null);

  const { categoryId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getCategory(categoryId);
        if (result.code === 200) {
          const data = result.data.category;
          setCategory(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryId]);

  const formatDate = (date) => {
    if (!date) return "Chưa cập nhật";

    return new Date(date).toLocaleDateString("vi-VN");
  };

  console.log(category);
  return (
    <>
      <div className="category-detail">
        <div className="category-detail__header">
          <div className="category-detail__title">
            <h1>Chi tiết danh mục</h1>
          </div>

          <div className="category-detail__nav">
            <Link to="/admin/categories" className="category-detail__back">
              <i className="fa-solid fa-arrow-left"></i>
              Quay lại
            </Link>
            <Link
              to={`/admin/categories/edit/${category?._id}`}
              className="category-detail__save"
            >
              <i className="fa-solid fa-pen-to-square"></i>
              Chỉnh sửa
            </Link>
          </div>
        </div>

        <div className="category-detail__main">
          <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
              <Col xs={24} xl={16}>
                <div className="section-info">
                  <div className="section-info__header">
                    <h3>Thông tin danh mục</h3>
                  </div>

                  <div className="section-info__main">
                    <div className="section-info__nav">
                      <div className="section-info__nav-icon">
                        <i className="fa-solid fa-layer-group"></i>
                      </div>
                      <div className="section-info__nav-content">
                        <span>Tên danh mục</span>
                        <span>{category?.title}</span>
                      </div>
                    </div>
                    <div className="section-info__nav">
                      <div className="section-info__nav-icon">
                        <i className="fa-solid fa-sitemap"></i>
                      </div>
                      <div className="section-info__nav-content">
                        <span>Danh mục cha</span>
                        <span>
                          {category?.parent
                            ? category?.parent
                            : "Không có danh mục cha"}
                        </span>
                      </div>
                    </div>
                    <div className="section-info__nav">
                      <div className="section-info__nav-icon">
                        <i className="fa-solid fa-list"></i>
                      </div>
                      <div className="section-info__nav-content">
                        <span>Mô tả</span>
                        <span>{category?.description}</span>
                      </div>
                    </div>
                    <div className="section-info__nav">
                      <div className="section-info__nav-icon">
                        <i className="fa-regular fa-calendar-days"></i>
                      </div>
                      <div className="section-info__nav-content">
                        <span>Ngày tạo</span>
                        <span>{formatDate(category?.createdAt)}</span>
                      </div>
                    </div>
                    <div className="section-info__nav">
                      <div className="section-info__nav-icon">
                        <i className="fa-regular fa-calendar-days"></i>
                      </div>
                      <div className="section-info__nav-content">
                        <span>Ngày cập nhật</span>
                        <span>{formatDate(category?.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={24} xl={8}>
                <div className="section-info">
                  <div className="section-info__header">
                    <h3>Ảnh danh mục</h3>
                  </div>
                  <div className="section-info__main">
                    <div className="section-info__image">
                      <img src={category?.thumbnail} alt={category?.title} />
                    </div>
                  </div>
                </div>
                <div className="section-info">
                  <div className="section-info__header">
                    <h3>Trạng thái</h3>
                  </div>
                  <div className="section-info__main">
                    <div className="section-info__nav">
                      <div className="section-info__nav-icon">
                        <i className="fa-solid fa-circle"></i>
                      </div>
                      <div className="section-info__nav-content">
                        <span>Trạng thái</span>
                        <span>
                          {category?.status == "active"
                            ? "Hoạt động"
                            : "Dừng hoạt động"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Spin>
        </div>
      </div>
    </>
  );
}
export default CategoryDetail;

import { notification, Table } from "antd";
import "./ProductTable.scss";
import {
  changeStatus,
  removeProduct,
} from "../../../services/admin/product.services";
import { Link } from "react-router-dom";

function ProductTable({ data = [], pagination, onPageChange, onReload }) {
  const formatStatus = (status) => {
    switch (status) {
      case "active":
        return {
          text: "Hoạt động",
          className: "active",
        };
      case "inactive":
        return {
          text: "Dừng hoạt động",
          className: "inactive",
        };
    }
  };

  const handleChangeStatus = async (record) => {
    const newStatus = record.status === "active" ? "inactive" : "active";

    const result = await changeStatus(record._id, newStatus);

    if (result.code === 200) {
      notification.success({
        title: result.message,
      });

      onReload();
    } else {
      notification.error({
        title: result.message,
      });
    }
  };

  const handleRemove = async (record) => {
    const result = await removeProduct(record._id);
    if (result.code === 200) {
      notification.success({
        title: result.message,
      });
      onReload();
    } else {
      notification.error({
        title: result.message,
      });
    }
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      align: "center",
      render: (text, item) => (
        <img className="product-thumbnail" src={text} alt={item.title} />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="product-title">{text}</span>,
    },
    {
      title: "Giá bán",
      dataIndex: "newPrice",
      key: "newPrice",
      align: "center",
      render: (text) => (
        <span className="product-price">
          {Number(text).toLocaleString("vi-VN")}₫
        </span>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
      align: "center",
      render: (text) => <span className="product-category">{text}</span>,
    },
    {
      title: "Thương hiệu",
      dataIndex: "brandName",
      key: "brandName",
      align: "center",
      render: (text) => <span className="product-brand">{text}</span>,
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      align: "center",
      render: (text) => <span className="product-stock">{text}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status, record) => {
        const statusData = formatStatus(status);

        return (
          <span
            className={`product-status ${statusData.className}`}
            onClick={() => handleChangeStatus(record)}
          >
            {statusData.text}
          </span>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="product-action">
          <Link
            to={`/admin/products/${record._id}`}
            className="product-action__view"
            title="Xem chi tiết"
          >
            <i className="fa-solid fa-eye"></i>
          </Link>

          <Link
            to={`/admin/products/edit/${record._id}`}
            className="product-action__edit"
            title="Chỉnh sửa"
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </Link>

          <button
            className="product-action__delete"
            title="Xóa"
            onClick={() => {
              handleRemove(record);
            }}
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  const dataTable = data.map((item) => ({
    key: item._id,
    _id: item._id,
    thumbnail: item.thumbnail,
    title: item.title,
    newPrice: item.newPrice,
    categoryName: item.categoryName,
    brandName: item.brandName,
    stock: item.stock,
    status: item.status,
  }));

  return (
    <>
      <div className="product-table">
        <Table
          columns={columns}
          dataSource={dataTable}
          pagination={{
            current: pagination.currentPage,
            pageSize: pagination.limit,
            total: pagination.totalProducts,
            onChange: onPageChange,
          }}
        />
      </div>
    </>
  );
}
export default ProductTable;

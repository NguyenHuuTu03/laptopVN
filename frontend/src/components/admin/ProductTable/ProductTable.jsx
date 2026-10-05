import { Table } from "antd";
import "./ProductTable.scss";

function ProductTable({ data = [], pagination, onPageChange }) {
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
      render: (text) => <span> {Number(text).toLocaleString("vi-VN")}₫</span>,
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
      align: "center",
      key: "status",
      render: (status) => (
        <span className={`product-status ${status.className}`}>
          {status.text}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_) => (
        <div className="product-action">
          <button className="product-action__view" title="Xem chi tiết">
            <i className="fa-solid fa-eye"></i>
          </button>

          <button className="product-action__edit" title="Chỉnh sửa">
            <i className="fa-solid fa-pen-to-square"></i>
          </button>

          <button className="product-action__delete" title="Xóa">
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  const dataTable = data.map((item) => {
    const status = formatStatus(item.status);

    return {
      key: item._id,
      thumbnail: item.thumbnail,
      title: item.title,
      newPrice: item.newPrice,
      categoryName: item.categoryName,
      brandName: item.brandName,
      stock: item.stock,
      status: status,
    };
  });

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

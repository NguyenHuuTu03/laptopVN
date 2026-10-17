import { Table } from "antd";
import "./VariantTable.scss";

function VariantTable({ data = [] }) {
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
        <img className="variant-thumbnail" src={text} alt={item.title} />
      ),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      align: "center",
      key: "sku",
      render: (text) => <span className="variant-sku">{text}</span>,
    },
    {
      title: "Giá gốc",
      dataIndex: "price",
      align: "center",
      key: "price",
      render: (text) => (
        <span className="variant-price">{text.toLocaleString()}đ</span>
      ),
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      align: "center",
      key: "discount",
      render: (text) => <span className="variant-discount">{text}</span>,
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      align: "center",
      key: "stock",
      render: (text) => <span className="variant-stock">{text}</span>,
    },
    {
      title: "Đã bán",
      dataIndex: "sold",
      align: "center",
      key: "sold",
      render: (text) => <span className="variant-sold">{text}</span>,
    },
    {
      title: "Thuộc tính",
      dataIndex: "attributes",
      align: "center",
      key: "attributes",
      render: (_, record) => (
        <>
          {record.attributes.map((item, index) => (
            <span className="variant-attributes" key={index}>
              {item.key}: {item.value}
            </span>
          ))}
        </>
      ),
    },
  ];

  const dataTable = data.map((item) => ({
    key: item._id,
    _id: item._id,
    thumbnail: item.thumbnail,
    sku: item.sku,
    price: item.price,
    discount: item.discount,
    stock: item.stock,
    sold: item.sold,
    attributes: item.attributes,
  }));

  return (
    <>
      <div className="variant-table">
        <Table columns={columns} dataSource={dataTable} />
      </div>
    </>
  );
}
export default VariantTable;

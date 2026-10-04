import { Table } from "antd";
import "./FeatureProduct.scss";

function FeatureProduct({ data = [] }) {
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (text) => <img className="product-thumbnail" src={text} alt="" />,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="product-title">{text}</span>,
    },
    {
      title: "Đã bán",
      dataIndex: "sold",
      key: "sold",
      render: (sold) => <span className="product-sold">{sold}</span>,
    },
  ];

  const dataTable = data.map((item, index) => ({
    key: index,
    thumbnail: item.thumbnail,
    title: item.title,
    sold: item.sold,
  }));

  return (
    <div className="feature-product">
      <Table columns={columns} dataSource={dataTable} pagination={false}/>
    </div>
  );
}

export default FeatureProduct;

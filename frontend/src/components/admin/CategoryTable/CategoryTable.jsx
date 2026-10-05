import { notification, Table } from "antd";
import "./CategoryTable.scss";
import {
  changeStatus,
  removeCategory,
} from "../../../services/admin/category.services";

function CategoryTable({ data = [], pagination, onPageChange, onReload }) {
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
    const result = await removeCategory(record._id);
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
        <img className="category-thumbnail" src={text} alt={item.title} />
      ),
    },
    {
      title: "Tên danh mục",
      dataIndex: "title",
      key: "title",
      render: (text) => <span className="category-title">{text}</span>,
    },
    {
      title: "Vị trí",
      dataIndex: "position",
      key: "position",
      align: "center",
      render: (text) => <span className="category-position">{text}</span>,
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
            className={`category-status ${statusData.className}`}
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
        <div className="category-action">
          <button className="category-action__view" title="Xem chi tiết">
            <i className="fa-solid fa-eye"></i>
          </button>

          <button className="category-action__edit" title="Chỉnh sửa">
            <i className="fa-solid fa-pen-to-square"></i>
          </button>

          <button
            className="category-action__delete"
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
    position: item.position,
    status: item.status,
  }));

  return (
    <>
      <div className="category-table">
        <Table
          columns={columns}
          dataSource={dataTable}
          pagination={{
            current: pagination.currentPage,
            pageSize: pagination.limit,
            total: pagination.totalCategories,
            onChange: onPageChange,
          }}
        />
      </div>
    </>
  );
}
export default CategoryTable;

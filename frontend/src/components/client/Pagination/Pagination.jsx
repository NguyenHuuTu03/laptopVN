// src/components/client/Pagination/Pagination.jsx
import { Pagination as AntPagination } from "antd";
import "./Pagination.scss";

function Pagination({ currentPage = 1, pageSize = 12, total = 0, onChange }) {
  const itemRender = (_, type, originalElement) => {
    if (type === "prev") {
      return <a>Trang trước</a>;
    }
    if (type === "next") {
      return <a>Trang sau</a>;
    }
    return originalElement;
  };
  return (
    <div className="pagination-wrapper">
      <AntPagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        itemRender={itemRender}
        showSizeChanger={false}
      />
    </div>
  );
}

export default Pagination;

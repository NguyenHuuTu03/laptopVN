import { Input } from "antd";
const { Search } = Input;
import { Select } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import "./UserView.scss";
import { getUsers } from "../../../../services/admin/user.services";
import UserTable from "../../../../components/admin/UserTable/UserTable";

function UserView() {
  const [data, setData] = useState({
    users: [],
    pagination: {
      currentPage: 1,
      limit: 10,
      totalUsers: 0,
      totalPages: 0,
    },
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let params = Object.fromEntries([...searchParams]);
      const result = await getUsers(params);
      if (result.code === 200) {
        setData(result.data);
      }
    };
    fetchData();
  }, [searchParams, reload]);

  const handleFilterChange = (key, value) => {
    const currentParams = Object.fromEntries([...searchParams]);

    if (value !== undefined && value !== "") {
      currentParams[key] = value;
    } else {
      delete currentParams[key];
    }
    if (key !== "page") {
      currentParams.page = 1;
    }

    setSearchParams(currentParams);
  };
  const handleChangePage = (page) => {
    handleFilterChange("page", page);
  };

  const handleSearch = (value) => {
    handleFilterChange("keyword", value);
  };

  const handleSort = (value) => {
    handleFilterChange("sort", value);
  };

  const handleStatusChange = (value) => {
    handleFilterChange("status", value);
  };

  const optionStatus = [
    {
      value: "active",
      label: "Hoạt động",
    },
    {
      value: "inactive",
      label: "Dừng hoạt động",
    },
  ];

  const optionSort = [
    { value: "createdAt-desc", label: "Mới nhất" },
    { value: "createdAt-asc", label: "Cũ nhất" },
    {
      value: "fullName-asc",
      label: "Tên A-Z",
    },
    {
      value: "fullName-desc",
      label: "Tên Z-A",
    },
  ];

  console.log(data);

  return (
    <>
      <div className="admin-users">
        <div className="admin-users__header">
          <div className="admin-users__title">
            <h1>Quản lý người dùng</h1>
          </div>

          <div className="admin-users__nav">
            <div className="admin-users__search">
              <Search
                placeholder="Tìm kiếm theo tên hoặc email..."
                onSearch={handleSearch}
              />
            </div>
            <div className="admin-users__add">
              <i className="fa-solid fa-plus"></i>
              <p>Thêm người dùng</p>
            </div>
          </div>
        </div>

        <div className="admin-users__main">
          <div className="admin-users__filter">
            <div className="admin-users__filter-status">
              <Select
                placeholder="Trạng thái"
                options={optionStatus}
                onChange={handleStatusChange}
                value={searchParams.get("status")}
              />
            </div>

            <div className="admin-users__filter-sort">
              <Select
                placeholder="Sắp xếp"
                options={optionSort}
                onChange={handleSort}
                value={searchParams.get("sort")}
              />
            </div>
          </div>

          <div className="admin-users__table">
            <UserTable
              data={data?.users}
              pagination={data?.pagination}
              onPageChange={handleChangePage}
              onReload={() => setReload(!reload)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
export default UserView;

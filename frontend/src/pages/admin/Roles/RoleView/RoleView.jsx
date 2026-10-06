import { Input } from "antd";
const { Search } = Input;
import { Select } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import "./RoleView.scss";
import { getRoles } from "../../../../services/admin/role.services";
import RoleTable from "../../../../components/admin/RoleTable/RoleTable";

function RoleView() {
  const [data, setData] = useState({
    roles: [],
    pagination: {
      currentPage: 1,
      limit: 10,
      totalRoles: 0,
      totalPages: 0,
    },
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let params = Object.fromEntries([...searchParams]);
      const result = await getRoles(params);
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

  console.log(data);

  return (
    <>
      <div className="admin-roles">
        <div className="admin-roles__header">
          <div className="admin-roles__title">
            <h1>Quản lý vai trò</h1>
          </div>

          <div className="admin-roles__nav">
            <div className="admin-roles__search">
              <Search
                placeholder="Tìm kiếm theo tên..."
                onSearch={handleSearch}
              />
            </div>
            <div className="admin-roles__add">
              <i className="fa-solid fa-plus"></i>
              <p>Thêm vai trò</p>
            </div>
          </div>
        </div>

        <div className="admin-roles__main">
          <div className="admin-roles__filter">
            <div className="admin-roles__filter-status">
              <Select
                placeholder="Trạng thái"
                options={optionStatus}
                onChange={handleStatusChange}
                value={searchParams.get("status")}
              />
            </div>
          </div>

          <div className="admin-roles__table">
            <RoleTable
              data={data?.roles}
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
export default RoleView;

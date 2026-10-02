import { Dropdown } from "antd";
import logo from "../../../assets/images/logo.png";
import { DownOutlined } from "@ant-design/icons";
function Header() {
  return (
    <>
      <div className="container">
        <div className="header-left__logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="header-nav">
          <div className="header-nav__left">
            <div className="header-collapse"></div>
          </div>
          <div className="header-right">
            <Dropdown
              // menu={userMenu}
              trigger={["click"]}
              placement="bottomRight"
            >
              <div className="header-user">
                <div className="header-user__avatar">
                  <img src="" alt="" />
                </div>
                <div className="header-user__info">
                  <span className="header-user__name">Nguyễn Văn A</span>
                </div>

                <DownOutlined className="header-arrow" />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
}
export default Header;

import {
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

import "./Footer.scss";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          {/* ABOUT */}
          <div className="footer__column">
            <h3 className="footer__title">Về LaptopVN</h3>

            <p className="footer__description">
              LaptopVN là website bán laptop, máy tính và các thiết bị công
              nghệ, cung cấp sản phẩm chính hãng với giá tốt.
            </p>

            <div className="footer__social">
              <a href="#" aria-label="Facebook">
                <FacebookOutlined />
              </a>

              <a href="#" aria-label="Instagram">
                <InstagramOutlined />
              </a>

              <a href="#" aria-label="Youtube">
                <YoutubeOutlined />
              </a>
            </div>
          </div>

          {/* SUPPORT */}
          <div className="footer__column">
            <h3 className="footer__title">Hỗ trợ khách hàng</h3>

            <ul className="footer__links">
              <li>
                <a href="#">Hướng dẫn mua hàng</a>
              </li>

              <li>
                <a href="#">Hướng dẫn thanh toán</a>
              </li>

              <li>
                <a href="#">Chính sách giao hàng</a>
              </li>

              <li>
                <a href="#">Câu hỏi thường gặp</a>
              </li>

              <li>
                <a href="#">Liên hệ với chúng tôi</a>
              </li>
            </ul>
          </div>

          {/* POLICY */}
          <div className="footer__column">
            <h3 className="footer__title">Chính sách</h3>

            <ul className="footer__links">
              <li>
                <a href="#">Chính sách bảo hành</a>
              </li>

              <li>
                <a href="#">Chính sách đổi trả</a>
              </li>

              <li>
                <a href="#">Chính sách bảo mật</a>
              </li>

              <li>
                <a href="#">Điều khoản sử dụng</a>
              </li>

              <li>
                <a href="#">Chính sách vận chuyển</a>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="footer__column">
            <h3 className="footer__title">Thông tin liên hệ</h3>

            <ul className="footer__contact">
              <li>
                <PhoneOutlined />
                <span>Hotline: 1900 1234</span>
              </li>

              <li>
                <MailOutlined />
                <span>Email: support@laptopvn.com</span>
              </li>

              <li>
                <EnvironmentOutlined />
                <span>Hà Nội, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="footer__bottom">
        <div className="container">
          <p>© 2026 LaptopVN. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import { Link } from "react-router-dom";
import Banner from "../../../components/client/Banner/Banner";
import CategoryMenu from "../../../components/client/CategoryMenu/CategoryMenu";
import ProductCard from "../../../components/client/ProductCard/ProductCard";
import "./Home.scss";
import { useEffect, useState } from "react";
import {
  getFeaturedProducts,
  getCollectionProducts,
} from "../../../services/client/product.services";
import CouponList from "../../../components/client/Coupons/CouponList";
import { Spin } from "antd";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [laptopProducts, setLaptopProducts] = useState([]);
  const [pcProducts, setPCProducts] = useState([]);
  const [mouseProducts, setMouseProducts] = useState([]);
  const [keyboardProducts, setKeyboardProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);

        const data = await getFeaturedProducts();
        setFeaturedProducts(data);

        const laptopData = await getCollectionProducts("laptop", {
          sort: "sold-desc",
          limit: 5,
        });
        setLaptopProducts(laptopData.products);

        const pcData = await getCollectionProducts("pc", {
          sort: "sold-desc",
          limit: 5,
        });
        setPCProducts(pcData.products);

        const mouseData = await getCollectionProducts("chuot-may-tinh", {
          sort: "sold-desc",
          limit: 5,
        });
        setMouseProducts(mouseData.products);

        const keyboardData = await getCollectionProducts("ban-phim", {
          sort: "sold-desc",
          limit: 5,
        });
        setKeyboardProducts(keyboardData.products);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);
  return (
    <div className="home">
      {loading ? (
        <div className="home__loading">
          <Spin size="large" description="Đang tải dữ liệu..." />
        </div>
      ) : (
        <div className="container">
          <div className="home__top">
            <CategoryMenu />
            <Banner />
          </div>

          <div className="home-coupons">
            <CouponList />
          </div>

          {featuredProducts.length > 0 && (
            <section className="home__section">
              <div className="home__section-header">
                <h2>Sản phẩm nổi bật</h2>
                <Link to={`/products`}>Xem tất cả</Link>
              </div>

              <div className="home__product-list">
                {featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </section>
          )}

          {laptopProducts.length > 0 && (
            <section className="home__section">
              <div className="home__section-header">
                <h2>Laptop bán chạy</h2>
                <Link to={`/collections/laptop`}>Xem tất cả</Link>
              </div>

              <div className="home__product-list">
                {laptopProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </section>
          )}

          {pcProducts.length > 0 && (
            <section className="home__section">
              <div className="home__section-header">
                <h2>PC bán chạy</h2>

                <Link to="/collections/pc">Xem tất cả</Link>
              </div>

              <div className="home__product-list">
                {pcProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </section>
          )}

          {mouseProducts.length > 0 && (
            <section className="home__section">
              <div className="home__section-header">
                <h2>Chuột bán chạy</h2>

                <Link to="/collections/chuot-may-tinh">Xem tất cả</Link>
              </div>

              <div className="home__product-list">
                {mouseProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </section>
          )}

          {keyboardProducts.length > 0 && (
            <section className="home__section">
              <div className="home__section-header">
                <h2>Bàn phím bán chạy</h2>

                <Link to="/collections/ban-phim">Xem tất cả</Link>
              </div>

              <div className="home__product-list">
                {keyboardProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;

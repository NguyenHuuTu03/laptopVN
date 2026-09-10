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

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [laptopProducts, setLaptopProducts] = useState([]);
  const [pcProducts, setPCProducts] = useState([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const data = await getFeaturedProducts();
        setFeaturedProducts(data);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm nổi bật:", error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const laptopData = await getCollectionProducts("laptop");
        setLaptopProducts(laptopData);

        const pcData = await getCollectionProducts("pc");
        setPCProducts(pcData);
        console.log(pcData);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm bán chạy:", error);
      }
    };

    getProducts();
  }, []);
  return (
    <div className="home">
      <div className="container">
        <div className="home__top">
          <CategoryMenu />
          <Banner />
        </div>

        {/* Sản phẩm nổi bật */}
        {featuredProducts.length > 0 && (
          <section className="home__section">
            <div className="home__section-header">
              <h2>Sản phẩm nổi bật</h2>
              <Link to={`/products?featured=true`}>Xem tất cả</Link>
            </div>

            <div className="home__product-list">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Laptop */}
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

        {/* PC */}
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
      </div>
    </div>
  );
}

export default Home;

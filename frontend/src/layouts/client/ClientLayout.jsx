import { Outlet } from "react-router-dom";

import Header from "../../components/client/Header/Header";
// import Navigation from "../../components/client/Navigation/Navigation";
import Footer from "../../components/client/Footer/Footer";

import "./ClientLayout.scss";
import { getProfile } from "../../services/client/user.services";
import { setAuth } from "../../actions/authActions";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../../services/client/cart.services";
import { setCart } from "../../actions/cartActions";

function ClientLayout() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartReducer);
  const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await getProfile();
        if (res.code === 200 && res.data.user) {
          dispatch(
            setAuth({
              isLoggedIn: true,
              user: res.data.user,
            }),
          );
          const cartResult = await getCart();

          if (cartResult.code === 200) {
            dispatch(setCart(cartResult.data.items));
          }
        } else {
          dispatch(
            setAuth({
              isLoggedIn: false,
              user: null,
            }),
          );
        }
      } catch (error) {
        dispatch(
          setAuth({
            isLoggedIn: false,
            user: null,
          }),
        );
        console.log(error);
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isLoggedIn]);
  return (
    <div className="client-layout">
      <Header />

      {/* <Navigation /> */}

      <main className="client-layout__main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default ClientLayout;

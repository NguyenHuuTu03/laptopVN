import { Outlet } from "react-router-dom";

import Header from "../../components/client/Header/Header";
import Footer from "../../components/client/Footer/Footer";

import "./ClientLayout.scss";
import { getProfile } from "../../services/client/user.services";
import { setClientAuth } from "../../actions/authActions";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../../services/client/cart.services";
import { setCart } from "../../actions/cartActions";
import { getSettings } from "../../services/client/setting.services";
import { setSettings } from "../../actions/settingActions";

function ClientLayout() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartReducer);
  const isLoggedIn = useSelector(
    (state) => state.authReducer.client.isLoggedIn,
  );

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await getProfile();
        if (res.code === 200 && res.data.user) {
          dispatch(
            setClientAuth({
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
            setClientAuth({
              isLoggedIn: false,
              user: null,
            }),
          );
        }
      } catch (error) {
        dispatch(
          setClientAuth({
            isLoggedIn: false,
            user: null,
          }),
        );
        console.log(error);
      }
    };

    checkAuthStatus();

    const fetchSettings = async () => {
      try {
        const result = await getSettings();

        if (result.code === 200) {
          dispatch(setSettings(result.data.setting));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSettings();
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

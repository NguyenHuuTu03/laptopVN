import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import AppRoutes from "./routes/client/index";
import { getProfile } from "./services/client/user.services";
import { setAuth } from "./actions/authActions";

function App() {
  const dispatch = useDispatch();

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

  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;

import { Outlet } from "react-router-dom";

import Header from "../../components/client/Header/Header";
import Navigation from "../../components/client/Navigation/Navigation";
import Footer from "../../components/client/Footer/Footer";

import "./ClientLayout.scss";

function ClientLayout() {
  return (
    <div className="client-layout">
      <Header />

      <Navigation />

      <main className="client-layout__main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default ClientLayout;

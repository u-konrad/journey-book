import Navigation from "./Navigation/Navigation";
import { Container } from "react-bootstrap";
import Footer from "./Footer";
import Notification from "./Notification";

const Layout = (props) => {

  return (
    <div
      className="d-flex flex-column justify-content-between min-vh-100 bg-basic position-relative"
      style={{  overflow: "hidden" }}
    >
      <Navigation />
      <main className="">
        <Container fluid="xl"  className="px-lg-5 px-sm-3  ">{props.children}</Container>
      </main>
      <Footer/>
      <Notification/>
    </div>
  );
};

export default Layout;

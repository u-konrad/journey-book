import Navigation from "./Navigation/Navigation";
import { Container } from "react-bootstrap";
import Footer from "./Footer";

const Layout = (props) => {

  return (
    <div
      className="d-flex flex-column min-vh-100 bg-basic position-relative"
      style={{  overflow: "hidden",paddingBottom:'100px' }}
    >
      <Navigation />
      <main className="">
        <Container fluid="xl"  className="px-lg-5 px-sm-3  ">{props.children}</Container>
      </main>
      <Footer/>
    </div>
  );
};

export default Layout;

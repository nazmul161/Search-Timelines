import { Container } from "@mui/material";
import Header from "../components/header";
import Footer from "../components/footer";

const Home = ({ userobj }) => {
  
  localStorage.setItem("searchTerm", "");

  return (
    <div className="pagelayout">
      {/* Header Component
                - For having consistency in your different pages layout, you have to add this component to each new page */}
      <Header userobj={userobj}/>

      <div
        style={{ backgroundColor: "rgb(0, 75, 128)", height: "350px" }}
      ></div>

      {/* // Page content */}
      <Container disableGutters className="content"></Container>

      {/* Footer Component
                - For having consistency in your different pages layout, you have to add this component to each new page */}
      <Footer userobj={userobj} />
    </div>
  );
};

export default Home;

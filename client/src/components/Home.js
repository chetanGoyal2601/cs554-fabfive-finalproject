import { useOutletContext } from "react-router-dom";
const Home = () => {
  const userDetails = useOutletContext();
  return (
    <div className="Home-Page-Image">
      <div className="row d-flex p-4 ">
        <div className="col flex-col">
          {!userDetails && (
            <h1 style={{ color: "black" }}>
              <b>Please signup/login to access the events!</b>
            </h1>
          )}
          <img
            alt="MakeEventHappen"
            src={require("../img/logo_transparent.png")}
            className="img-size"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;

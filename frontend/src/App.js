import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import CreateEvent from "./components/CreateEvent";
import Home from "./components/Home";

// import Jeff_Passport_Photo from ".../Backend/images";

function App() {
  // let path = "http://localhost:3001/";
  // const [file, setFile] = useState();
  // const [image, setImage] = useState();

  // const submit = async (event) => {
  //   event.preventDefault();

  //   const formData = new FormData();
  //   formData.append("image", file);

  //   const result = await axios.post("http://localhost:3001/event", formData, {
  //     headers: { "Content-Type": "multipart/form-data" },
  //   });

  //   setImage(result.data.image);
  // };

  return (
    <Router>
      <div className="App">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h1 className="App-title">Welcome to the React.js Pokemon API</h1>
        <nav>
          <NavLink className="showlink" to="/">
            Home
          </NavLink>{" "}
          |{" "}
          <NavLink className="showlink" to="/event">
            New Events
          </NavLink>
        </nav>
        <br />
        <br />
        <div className="App-body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route exact path="/event" element={<CreateEvent />} />
          </Routes>
        </div>
      </div>
    </Router>
  );

  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //       <form onSubmit={submit}>
  //         <input
  //           filename={file}
  //           onChange={(e) => setFile(e.target.files[0])}
  //           type="file"
  //           accept="image/*"
  //           alt="Jeff"
  //         ></input>
  //         <button type="submit">Submit</button>
  //       </form>
  //       {image && (
  //         <img
  //           alt="Jeff"
  //           src={path + image}
  //           // src={Jeff_Passport_Photo}
  //         />
  //       )}
  //     </header>
  //   </div>
  // );
}

export default App;

import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
  Link
} from "react-router-dom";
import CreateEvent from "./components/CreateEvent";
import Events from "./components/Events";
import Event from "./components/Event";
import Home from "./components/Home";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      <Navbar  variant="dark" className="Nav-bar-background">
        <Container>
          <Navbar.Brand href="https://www.stevens.edu/" target="_blank">
         <img
                alt="Stevens"
                src={require('../src/img/Stevens-Logo.png')}
                width="35"
                height="35"
                className="d-inline-block align-top"
              />
             {' '}Stevens Institute of Technology
          </Navbar.Brand>
          <Navbar.Brand href="/">Make Event Happen</Navbar.Brand>{' '}
          <Nav>
              {/* <div className="mb-2">
                <Button variant="outline-light" size="md">Login</Button>{' '}
                <Button variant="primary" size="md" >SignUp</Button>
              </div> */}
              <Nav.Link as={Link}  to="/createevent">Create Event</Nav.Link>
              <Nav.Link as={Link}  to="/events/page/0">Events</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
        <div className="App-body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route exact path="/createevent" element={<CreateEvent />} />
            <Route exact path="/events/page/:page" element={<Events />} />
            <Route exact path="/event/:id" element={<Event />} />
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

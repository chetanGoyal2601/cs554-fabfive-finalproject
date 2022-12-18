import "./App.css";
import logo from './logo.svg';
import {BrowserRouter as Router, Route, Routes, Navigate, Link} from 'react-router-dom';
import Chat from './components/Chat';
import Form from './components/Form';
import Login from './components/Login';
import User_profile from './components/profile';
import Logout from './components/Logout';
import Forgot_Password from './components/Forgot_Password';
import New_Password from './components/New_Password';
import CreateEvent from "./components/CreateEvent";
import Events from "./components/Events";
import Event from "./components/Event";
import Home from "./components/Home";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import Validate from './components/Validate';
import Button from 'react-bootstrap/Button';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <div className="App-body">
          <Navbar collapseOnSelect expand='lg'  variant="dark" className="Nav-bar-background" >
          <Container fluid>
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
            <Navbar.Brand href="/">
            <img
                  alt="Stevens"
                  src={require('../src/img/logo_transparent.png')}
                  width="35"
                  height="35"
                  className="d-inline-block align-top"
                />{' '}
              Make Event Happen</Navbar.Brand>
            <Nav>
                <div className="p-2">
                  <Button variant="outline-light" as={Link} to="/signin" size="sm">Login</Button>{' '}
                  <Button variant="primary" as={Link} to="/signup" size="sm" >SignUp</Button>
                </div>
                {/* <Nav.Link as={Link}  to="/createevent">Create Event</Nav.Link>
                <Nav.Link as={Link}  to="/events/page/0">Events</Nav.Link> */}
            </Nav>
          </Container>
        </Navbar>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route exact path="/createevent" element={<CreateEvent />} />
            <Route exact path="/events/page/:page" element={<Events />} />
            <Route exact path="/event/:id" element={<Event />} />
            <Route exact path="/validate" element={<Validate />} />
            <Route exact path="/signup" element={<Form />} />
            <Route exact path="/signin" element={<Login />} />
            <Route exact path="/forgot_password" element={<Forgot_Password />} />
            <Route path="/new_password/:id/:hash" element={<New_Password />} />
            <Route exact path="/profile" element={<User_profile />} />
            <Route exact path="/logout" element={<Logout />} />
            <Route path='/chat/:eventId/:userId' element={<Chat />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

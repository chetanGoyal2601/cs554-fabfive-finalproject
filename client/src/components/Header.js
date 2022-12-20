import {Link} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';


const Header = ({logout}) => {
    return (
        <Navbar collapseOnSelect expand='lg'  variant="dark" className="Nav-bar-background" >
            <Container fluid>
              <Navbar.Brand href="https://www.stevens.edu/" target="_blank">
            <img 
                    alt="Stevens"
                    src={require('../img/Stevens-Logo.png')}
                    width="35"
                    height="35"
                    className="d-inline-block align-top"
                  />
                {' '}Stevens Institute of Technology
              </Navbar.Brand>
              <Navbar.Brand href="/">
              <img
                    alt="Stevens"
                    src={require('../img/logo_transparent.png')}
                    width="35"
                    height="35"
                    className="d-inline-block align-top"
                  />{' '}
                Make Event Happen</Navbar.Brand>
                  {/* <div className="mb-2">
                    <Button variant="outline-light" size="md">Login</Button>{' '}
                    <Button variant="primary" size="md" >SignUp</Button>
                  </div> */}
                  {logout ? (
                    <Nav>
                        <Nav.Link as={Link}  to="/createevent">Create Event</Nav.Link>
                        <Nav.Link as={Link}  to="/events/page/0">All Events</Nav.Link>
                        <Nav.Link as={Link}  to="/profile">My Profile</Nav.Link>
                        <Nav.Link as={Link} onClick={logout} to="/">Logout</Nav.Link>
                    </Nav>
                    ) : (
                    // <Nav>
                    //     <Nav.Link  as={Link} to="/signin">Log In</Nav.Link>
                    //     <Nav.Link as={Link}  to="/validate">Sign Up</Nav.Link>
                    // </Nav>
                    <div className="mb-2">
                    <Button  as={Link} to="/signin" variant="outline-light" size="sm">Login</Button>{' '}
                    <Button as={Link}  to="/validate" variant="primary" size="sm" >SignUp</Button>
                  </div>
                    )}
            </Container>
          </Navbar>
    );
};

export default Header;
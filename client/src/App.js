import "./App.css";
import logo from './logo.svg';
import {BrowserRouter as Router, Route, Routes, Navigate, Link, Outlet} from 'react-router-dom';
import { useCookies } from 'react-cookie';
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
import Validate from './components/Validate';
import Header from "./components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';


const PrivateRoute = ({auth, redirectPath = '/', logout, children}) => {
  if (!auth || !auth.userId) {
    return <Navigate to={redirectPath} replace/>;
  }
  return (
    <div>
      <Header logout={logout}/>
      <Outlet context={auth}/>
    </div>
  );
};

const PublicRoute = ({auth, redirectPath = '/events/page/0', children}) => {
  if (auth && auth.userId && auth.userId.length !== 0) {
    return <Navigate to={redirectPath} replace/>;
  }
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}

const App = () => {
  const cookieName = 'user';
  const [cookies, setCookie, removeCookie] = useCookies([cookieName]);
  
  const setAuthData = (authData) => {
    console.log('all cookies', cookies)
    console.log('authData', authData);
    setCookie(cookieName, authData, { path: '/' });
  };
  
  const removeAuthData = () => {
    console.log('all cookies', cookies);
    console.log(cookieName);
    removeCookie(cookieName);
    console.log('cookies after delete', cookies)
  };

  
  return (
    <Router>
      <div className='App'>
        <div className="App-body">
          <Routes>
            <Route element={<PublicRoute auth={cookies.user} />}>
              <Route path="/" element={<Home />} />
              <Route exact path="/signup" element={<Form />} />
              <Route exact path="/signin" element={<Login login={setAuthData} />} />
              <Route exact path="/validate" element={<Validate />} />
              <Route exact path="/forgot_password" element={<Forgot_Password />} />
              <Route path="/new_password/:id/:hash" element={<New_Password />} />
            </Route>
            <Route element={<PrivateRoute auth={cookies.user} logout={removeAuthData} />}>
              <Route exact path="/createevent" element={<CreateEvent />} />
              <Route exact path="/events/page/:page" element={<Events />} />
              <Route exact path="/event/:id" element={<Event />} />
              <Route exact path="/profile" element={<User_profile />} />
              <Route path='/chat/:eventId' element={<Chat />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

import './App.css';
import Form from './components/Form';
import Login from './components/Login';
import User_profile from './components/profile';
import Forgot_Password from './components/Forgot_Password';
import New_Password from './components/New_Password';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to='/signin' />} />
          <Route exact path="/signup" element={<Form />} />
          <Route exact path="/signin" element={<Login />} />
          <Route exact path="/forgot_password" element={<Forgot_Password />} />
          <Route path="/new_password/:id/:hash" element={<New_Password />} />
          <Route exact path="/profile" element={<User_profile />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
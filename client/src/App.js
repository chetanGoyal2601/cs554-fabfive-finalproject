import logo from './logo.svg';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Chat from './components/Chat';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <div>
          <Routes>
            <Route path='/chat/:eventId/:userId' element={<Chat />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

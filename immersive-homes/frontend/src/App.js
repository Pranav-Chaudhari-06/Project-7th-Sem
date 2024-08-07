import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from './Login';
import Navbar from './Navbar';
import Registration from './Registration';
import Home from './Home';
import Upload from './Upload';
import Explore from './Explore';
import Otp from './Otp';
import Profile from './Profile';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            exact
            path="/explore"
            element={<Explore />}
          />
          <Route
            path="/upload"
            element={<Upload />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/register"
            element={<Registration />}
          />
          <Route
            path="/otp_verification"
            element={<Otp />}
          />
          <Route
            path="/profile"
            element={<Profile />}
          />
          <Route
            path="*"
            element={<Navigate to="/" />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;

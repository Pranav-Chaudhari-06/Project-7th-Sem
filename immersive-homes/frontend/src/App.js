import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from './components/User/Login';
import Navbar from './components/Layouts/Navbar';
import Registration from './components/User/Registration';
import Home from './components/Pages/Home';
import Upload from './components/Pages/Upload';
import Explore from './components/Pages/Explore';
import Otp from './components/User/Otp';
import Profile from './components/User/Profile';
import ForgotPassword from './components/User/ForgotPassword';
import ResetPassword from './components/User/ResetPassword';

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
            path="/forgot-password"
            element={<ForgotPassword />}
          />
          <Route 
            path="/reset-password/:token" 
            element={<ResetPassword />} 
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

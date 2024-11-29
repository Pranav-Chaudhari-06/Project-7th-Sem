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
import Dashboard from './components/Admin/Dashboard';
import ModelRequest from './components/User/ModelRequest';
import ModelUpload from './components/Admin/ModelUpload';
import ViewRequests from './components/Admin/ViewRequest';

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
            path="/admin/dashboard"
            element={<Dashboard />}
          />
          <Route
            path="/upload/new"
            element={<ModelRequest />}
          />
          <Route
            path="/admin/uploadmodel"
            element={<ModelUpload />}
          />
          <Route
            path="/admin/viewrequest"
            element={<ViewRequests />}
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

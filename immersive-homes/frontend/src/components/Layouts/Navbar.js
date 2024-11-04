import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import "./Navbar.css";

function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user details from the session
        const fetchUser = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/users/session', { withCredentials: true });
                if (res.data.user) {
                    setUser(res.data.user);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/users/logout', {}, { withCredentials: true });
            setUser(null);
            navigate('/');
            window.location.reload(); // Reload the page to reflect changes
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <header>
            <div className="container-fluid">
                <nav className="navbar navbar-expand-lg bg-body-tertiary">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/">Immersive Homes</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link text-bold" aria-current="page" to="/">Explore</Link>
                                </li>
                                <li className="nav-item">
                                    {/* <Link className="nav-link text-bold" to="/explore">Explore</Link> */}
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-bold" to="/upload">Upload</Link>
                                </li>
                            </ul>
                            <ul className="navbar-nav ms-auto">
                                {user ? (
                                    <li className="nav-item dropdown me-5">
                                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            {user.firstName}
                                        </a>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                                            <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                                        </ul>
                                    </li>
                                ) : (
                                    <li className="nav-item me-4">
                                        <Link className="nav-link" to="/login">Login</Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;

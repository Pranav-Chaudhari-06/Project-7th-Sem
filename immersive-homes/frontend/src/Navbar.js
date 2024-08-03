// Filename - Navbar.js

import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    return (
        <header>
        <div class="container-fluid">
            <nav class="navbar navbar-expand-lg bg-custom">
                <Link className="navbar-brand ms-2" to="/">Immersive Homes</Link>
                <button class="navbar-toggler me-4" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav">
                        <li class="nav-item active">
                            <Link class="nav-link text-bold" to="/">Home</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link text-bold" to="/explore">Explore</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link text-bold" to="/upload">Upload</Link>
                        </li>
                    </ul>
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item me-4">
                            <Link class="nav-link" to="/login">Login</Link>
                        </li>
                        {/* <li class="nav-item me-4">
                            <Link class="nav-link" to="/register">Register</Link>
                        </li> */}
                    </ul>
                </div>
            </nav>
        </div>
    </header>
    );
}

export default Navbar;

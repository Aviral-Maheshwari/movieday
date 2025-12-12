import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";

const App = () => {
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const logOut = (e) => {
        e.preventDefault();
        AuthService.logout().then(() => {
            setCurrentUser(undefined);
            window.location.href = "/login";
        });
    };

    return (
        <Router>
            <div>
                <nav className="navbar navbar-expand navbar-dark bg-dark">
                    <Link to={"/"} className="navbar-brand ms-3">
                        MovieApp
                    </Link>
                    <div className="navbar-nav mr-auto">
                        {currentUser && (
                            <li className="nav-item">
                                <Link to={`/dashboard/${currentUser.username}`} className="nav-link">
                                    Dashboard
                                </Link>
                            </li>
                        )}
                    </div>

                    <div className="navbar-nav ms-auto me-3">
                        {currentUser ? (
                            <div className="navbar-nav">
                                <li className="nav-item">
                                    <div className="nav-link disabled">
                                        {currentUser.username}
                                    </div>
                                </li>
                                <li className="nav-item">
                                    <a href="/login" className="nav-link" onClick={logOut}>
                                        LogOut
                                    </a>
                                </li>
                            </div>
                        ) : (
                            <div className="navbar-nav">
                                <li className="nav-item">
                                    <Link to={"/login"} className="nav-link">
                                        Login
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to={"/register"} className="nav-link">
                                        Sign Up
                                    </Link>
                                </li>
                            </div>
                        )}
                    </div>
                </nav>

                <div className="container mt-3">
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<Home />} />
                        <Route path="/dashboard/:username" element={<Home />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;

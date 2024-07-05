import { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'remixicon/fonts/remixicon.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './App.css';
import Header from './components/header/Header';
import SignInPage from "./components/signin/Signin";
import MainDashboard from "./components/mainDashboard/MainDashboard";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const storedLoginStatus = localStorage.getItem('isLoggedIn');
        return storedLoginStatus === 'true';
    });

    useEffect(() => {
        localStorage.setItem('isLoggedIn', isLoggedIn);
    }, [isLoggedIn]);

    const handleLogin = (status) => {
        setIsLoggedIn(status);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
    };

    return (
        <Router>
            <div className="app">
                {isLoggedIn ? (
                    <>
                        <Header onLogout={handleLogout} />
                        <div className="main-content">
                            <Routes>
                                <Route path="/" element={<MainDashboard />} />
                            </Routes>
                        </div>
                    </>
                ) : (
                    <SignInPage onLogin={handleLogin} />
                )}
            </div>
        </Router>
    );
}

export default App;

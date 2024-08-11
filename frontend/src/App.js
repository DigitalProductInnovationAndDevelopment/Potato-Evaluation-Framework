import { useEffect, useState } from "react";
import SignInPage from "./components/signin/Signin";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from "./components/dashboard/Dashboard";

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
        localStorage.removeItem('token');
    };

    return (
        <Router>
            <div>
                {isLoggedIn ? (
                    <>
                        <div className="main-content">
                            <Routes>
                                <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
                                <Route path="/adminView" element={<Dashboard onLogout={handleLogout} view="admin" />} />
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

import {useEffect, useState} from "react";

//import Icons
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'remixicon/fonts/remixicon.css'

//Import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js'

import './App.css';
import Header from './components/header/Header';
import SideBar from './components/sidebar/SideBar';
import SignInPage from "./components/signin/signin";
import MainDashboard from "./components/mainDashboard/mainDashboard";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        // Check if the user is already logged in by reading from local storage
        const storedLoginStatus = localStorage.getItem('isLoggedIn');
        return storedLoginStatus === 'true';
    });

    useEffect(() => {
        // Save login status to local storage whenever it changes
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
      <>
        {isLoggedIn ? (
            <div className="app">
                <Header onLogout={handleLogout} />
                <div className="main-content">
                    <SideBar />
                    <MainDashboard/>
              </div>
            </div>
        ) : (
            <SignInPage onLogin={handleLogin} />
        )}
      </>
  );
}

export default App;

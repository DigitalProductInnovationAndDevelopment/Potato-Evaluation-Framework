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
import ParameterSelection from "./components/parameterSelection/parameterSelection";

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

  return (
      <>
        {isLoggedIn ? (
            <>
              <Header />
              <ParameterSelection/>
              <SideBar />
            </>
        ) : (
            <SignInPage onLogin={handleLogin} />
        )}
      </>
  );
}

export default App;

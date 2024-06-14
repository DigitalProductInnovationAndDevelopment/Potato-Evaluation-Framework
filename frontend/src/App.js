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
import {useState} from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = (status) => {
        setIsLoggedIn(status);
    };

  return (
      <>
        {true ? (
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

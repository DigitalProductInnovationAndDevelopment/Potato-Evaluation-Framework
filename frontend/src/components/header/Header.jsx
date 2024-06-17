import React from 'react';
import './header.css';
import Logo from '../logo/Logo';
import Nav from '../navigator/Nav'

const Header = ({ onLogout }) => {
  return (
      <header id='header' className='header fixed-top d-flex align-items-center'>
          {/* {logo} */}
          <Logo/>
          {/* {search bar} */}
          {/* {nav} */}
          <Nav/>
          <button className="logout-button" onClick={onLogout}>Logout</button>
      </header>
  )
}

export default Header
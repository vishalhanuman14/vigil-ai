import React from 'react';
import { FaCog, FaHome } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

function Nav() {
  return (
    <nav className="nav-bar">
      <div className="nav-logo">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12L12 4L20 12L12 20L4 12Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M12 15L9 12L12 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Vigil</span>
      </div>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <FaHome />
          <span>Home</span>
        </NavLink>
        <NavLink to="/configure" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          <FaCog />
          <span>Configure Zone</span>
        </NavLink>
      </div>
    </nav>
  );
}

export default Nav;
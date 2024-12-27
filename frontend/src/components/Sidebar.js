import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="brand">🎵 Musicify</h2>
      <ul>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-item active-nav' : 'nav-item')}
          >
            <i className="bi bi-house-door"></i> Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-item active-nav' : 'nav-item')}
          >
            <i className="bi bi-search"></i> Search
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-item active-nav' : 'nav-item')}
          >
            <i className="bi bi-music-note-list"></i> Your Library
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;

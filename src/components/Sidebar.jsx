import React from 'react';
import { NavLink } from 'react-router-dom';

const sidebarStyle = {
  width: '220px',
  padding: '20px',
  background: '#f4f4f4',
  height: '100vh',
  borderRight: '1px solid #ddd',
  flexShrink: 0,
};

const navLinkStyle = {
  display: 'block',
  padding: '10px 15px',
  marginBottom: '8px',
  textDecoration: 'none',
  color: '#333',
  borderRadius: '4px',
  transition: 'background-color 0.2s',
};

const Sidebar = () => {
  // The `end` prop is important for the parent route to not stay active for all child routes
  return (
    <div style={sidebarStyle}>
      <h3>Admin Menu</h3>
      <nav>
        <NavLink
          to="/admin"
          end
          style={({ isActive }) => ({
            ...navLinkStyle,
            ...(isActive && { backgroundColor: '#e0e0e0', fontWeight: 'bold' }),
          })}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/users"
          style={({ isActive }) => ({
            ...navLinkStyle,
            ...(isActive && { backgroundColor: '#e0e0e0', fontWeight: 'bold' }),
          })}
        >
          Manage Users
        </NavLink>
        <NavLink
          to="/admin/settings"
          style={({ isActive }) => ({
            ...navLinkStyle,
            ...(isActive && { backgroundColor: '#e0e0e0', fontWeight: 'bold' }),
          })}
        >
          Settings
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;

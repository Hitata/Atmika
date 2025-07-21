import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Notification from './Notification.jsx';

const adminDashboardStyle = {
  display: 'flex',
  height: 'calc(100vh - 60px)', // Adjust height for header
};

const mainContentStyle = {
  flexGrow: 1,
  padding: '20px',
  overflowY: 'auto',
};

const AdminDashboard = () => {
  return (
    <div style={adminDashboardStyle}>
      <Sidebar />
      <main style={mainContentStyle}>
        <Notification message="Welcome to the admin panel!" type="success" />
        {/* The Outlet component renders the matched child route */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminDashboard;

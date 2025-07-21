import React from 'react';

const placeholderStyle = {
  padding: '20px',
  border: '2px dashed #ccc',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
};

const ManageUsers = () => {
  return (
    <div style={placeholderStyle}>
      <h3>Manage Users</h3>
      <p>This is where you would add UI for creating, editing, and deleting users.</p>
      <p>A table of users with action buttons would go here.</p>
    </div>
  );
};

export default ManageUsers;

import React, { useState } from 'react';

const notificationStyle = {
  position: 'fixed',
  top: '20px',
  right: '20px',
  padding: '15px 20px',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minWidth: '300px',
};

const successStyle = {
  ...notificationStyle,
  backgroundColor: '#4CAF50', // Green
};

const errorStyle = {
  ...notificationStyle,
  backgroundColor: '#f44336', // Red
};

const closeButtonStyle = {
  marginLeft: '15px',
  background: 'none',
  border: 'none',
  color: '#fff',
  fontSize: '20px',
  cursor: 'pointer',
  lineHeight: '1',
};

const Notification = ({ message, type = 'success' }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  const style = type === 'success' ? successStyle : errorStyle;

  return (
    <div style={style}>
      <span>{message}</span>
      <button style={closeButtonStyle} onClick={() => setIsVisible(false)}>
        &times;
      </button>
    </div>
  );
};

export default Notification;

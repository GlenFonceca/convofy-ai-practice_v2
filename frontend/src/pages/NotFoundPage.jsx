// NotFoundPage.js
import React from 'react';

function NotFoundPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <p style={styles.message}>Page Not Found</p>
      <p style={styles.subMessage}>The page you are looking for does not exist.</p>
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    color: '#343a40',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '20px',
  },
  code: {
    fontSize: '96px',
    fontWeight: 'bold',
    margin: 0,
  },
  message: {
    fontSize: '32px',
    margin: '10px 0',
  },
  subMessage: {
    fontSize: '18px',
    color: '#6c757d',
  },
};

export default NotFoundPage;

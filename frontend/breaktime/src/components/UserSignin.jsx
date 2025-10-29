import { useState } from 'react';
import { Tagline } from './Tagline';


// ==================== Style ====================
export const Styles = () => (
  <style>{
    `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

    body {
      margin: 0;
      padding: 0;
      background-color: #262445;
    }

    /* Tagline Styles */
    .tagline-container {
      text-align: left;
    }

    .tagline-heading {
      font-family: 'Poppins', sans-serif;
      font-weight: 500;
      line-height: 0.85;
      letter-spacing: -0.02em;
      margin: 0;
    }

    .tagline-text {
      display: block;
      color: #b9ff00;
      font-size: 140px;
    }

    .tagline-asterisk {
      display: inline-block;
    }

    .tagline-description {
      color: #8b9dc3;
      font-size: 16px;
      margin-top: 24px;
      font-family: 'Poppins', sans-serif;
      font-weight: 300;
      line-height: 1.6;
    }

    /* Sign In Container */
    .signin-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 128px;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
      padding: 48px;
      min-height: calc(100vh - 120px);
    }

    .signin-tagline-section {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .signin-form-section {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .signin-form {
      width: 100%;
      max-width: 420px;
    }

    /* Header */
    .signin-header {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-bottom: 32px;
    }

    .signin-logo {
      margin-right: 8px;
    }

    .signin-brand {
      color: #a8b5d1;
      font-size: 20px;
      font-family: 'Poppins', sans-serif;
      font-weight: 500;
    }

    /* Welcome */
    .signin-welcome {
      color: white;
      font-size: 28px;
      font-family: 'Poppins', sans-serif;
      font-weight: 400;
      margin-bottom: 24px;
      margin-top: 0;
    }

    /* Tabs */
    .signin-tabs {
      display: inline-flex;
      border: 1px solid #4a5578;
      border-radius: 9999px;
      overflow: hidden;
      margin-bottom: 32px;
    }

    .signin-tab {
      padding: 10px 24px;
      font-size: 12px;
      font-weight: 600;
      font-family: 'Poppins', sans-serif;
      border: none;
      background: transparent;
      color: #6b7599;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .signin-tab:first-child {
      border-right: 1px solid #4a5578;
    }

    .signin-tab-active {
      background: #b9ff00;
      color: black;
    }

    .signin-tab:hover:not(.signin-tab-active) {
      color: #8b95b9;
    }

    /* Input Fields */
    .signin-inputs {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-bottom: 24px;
    }

    .signin-input-group {
      display: flex;
      flex-direction: column;
    }

    .signin-label {
      color: white;
      font-size: 14px;
      font-family: 'Poppins', sans-serif;
      font-weight: 400;
      margin-bottom: 8px;
    }

    .signin-input {
      width: 100%;
      background: transparent;
      color: white;
      font-size: 14px;
      font-family: 'Poppins', sans-serif;
      padding-bottom: 8px;
      border: none;
      border-bottom: 1px solid #4a5578;
      outline: none;
      transition: border-color 0.3s ease;
    }

    .signin-input:focus {
      border-bottom-color: #b9ff00;
    }

    .signin-input::placeholder {
      color: #6b7599;
    }

    /* Description */
    .signin-description {
      color: #6b7599;
      font-size: 12px;
      font-family: 'Poppins', sans-serif;
      font-weight: 300;
      line-height: 1.5;
      margin-bottom: 32px;
    }

    /* Button */
    .signin-button {
      width: 100%;
      padding: 14px 0;
      background: #b9ff00;
      color: black;
      font-size: 14px;
      font-weight: 600;
      font-family: 'Poppins', sans-serif;
      border: none;
      border-radius: 9999px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .signin-button:hover {
      background: #a8ef00;
    }

    /* Links */
    .signin-links {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }

    .signin-link {
      color: #7b88ab;
      font-size: 12px;
      font-family: 'Poppins', sans-serif;
      background: none;
      border: none;
      text-decoration: underline;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .signin-link:hover {
      color: white;
    }

    /* Background Container */
    .page-background {
      min-height: 100vh;
      background: #2c2f48;
      position: relative;
      overflow: hidden;
    }

    .bg-wave-1 {
      position: absolute;
      top: 0;
      left: 0;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(155, 111, 216, 0.3) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(80px);
      transform: translate(-33%, -33%);
    }

    .bg-wave-2 {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, rgba(123, 92, 184, 0.3) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(80px);
      transform: translate(33%, 33%);
    }

    .bg-wave-3 {
      position: absolute;
      bottom: 80px;
      right: 160px;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(185, 141, 216, 0.2) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(80px);
    }

    .view-toggle {
      text-align: center;
      padding: 20px;
      position: relative;
      z-index: 10;
    }

    .toggle-button {
      padding: 10px 24px;
      margin: 0 8px;
      border-radius: 9999px;
      border: none;
      cursor: pointer;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .toggle-button-active {
      background: #b9ff00;
      color: #000;
    }

    .toggle-button-inactive {
      background: rgba(255,255,255,0.1);
      color: #fff;
    }

    .content-wrapper {
      position: relative;
      z-index: 10;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .signin-container {
        grid-template-columns: 1fr;
        gap: 64px;
      }

      .tagline-text {
        font-size: 80px;
      }
    }
  `}</style>
);

// User Signin Component
export const UserSignin = () => {
  const [id, setId] = useState('');
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  return (
    <>
    <Styles />
    <div className="signin-container">
      
      {/* Tagline Component */}
      <div className="signin-tagline-section">
        <Tagline />
      </div>

      {/* Sign In Form */}
      <div className="signin-form-section">
        <div className="signin-form">

          {/* Header with Logo */}
          <div className="signin-header">
            <img className="signin-logo"></img>
            <span className="signin">

            </span>
          </div>

          {/* Welcome Text */}
          <h3 className="signin-welcome">Welcome Back!</h3>

          {/* Tab Buttons */}
          <div className="signin-tabs">
            <button 
              className={`signin-tab ${activeTab === 'users' ? 'signin-tab-active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              USERS
            </button>
            <button 
              className={`signin-tab ${activeTab === 'staff' ? 'signin-tab-active' : ''}`}
              onClick={() => setActiveTab('staff')}
            >
              STAFF
            </button>
          </div>

          {/* Input Fields */}
          <div className="signin-inputs">
            <div className="signin-input-group">
              <label className="signin-label">ID</label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="signin-input"
              />
            </div>

            <div className="signin-input-group">
              <label className="signin-label">Pin</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="signin-input"
              />
            </div>
          </div>

          {/* Description */}
          <p className="signin-description">
          Sign in to access your bookings,<br />
            schedules, and tools
          </p>

          {/* Log In Button */}
          <button className="signin-button">
            LOG IN
          </button>

          {/* Links */}
          <div className="signin-links">
            <button className="signin-link">SIGN UP</button>
            <button className="signin-link">FORGOT PASSWORD</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

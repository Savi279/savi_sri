import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styleSheets/profile.css';

const Profile = () => {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userExists, setUserExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
      setStep('profile');
    }
  }, []);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/request-otp', { email });
      setUserExists(response.data.userExists);
      setStep('otp');
      setSuccess('OTP sent to your email!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      if (userExists) {
        setStep('password');
      } else {
        setStep('createPassword');
      }
      setSuccess('OTP verified successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const user = response.data.user;
      localStorage.setItem('user', JSON.stringify(user));
      setUserData(user);
      setStep('profile');
      setSuccess('Login successful!');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        email,
        password,
        name,
        mobile,
        gender,
        address
      });
      const user = response.data.user;
      localStorage.setItem('user', JSON.stringify(user));
      setUserData(user);
      setStep('profile');
      setSuccess('Profile created successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUserData(null);
    setStep('email');
    setEmail('');
    setOtp('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setMobile('');
    setGender('');
    setAddress('');
  };

  const renderEmailStep = () => (
    <div className="auth-container">
      <h2>Welcome to Profile</h2>
      <form onSubmit={handleRequestOTP}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <button className= "ContinueButton"type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Continue'} 
        </button>
      </form>
    </div>
  );

  const renderOTPStep = () => (
    <div className="auth-container">
      <h2>Enter OTP</h2>
      <p>We've sent a 4-digit OTP to {email}</p>
      <form onSubmit={handleVerifyOTP}>
        <div className="form-group">
          <label>OTP Code</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="4"
            required
            placeholder="Enter 4-digit OTP"
          />
        </div>
        <button type="submit" className="SubmitButton"disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    </div>
  );

  const renderPasswordStep = () => (
    <div className="auth-container">
      <h2>Enter Password</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );

  const renderCreatePasswordStep = () => (
    <div className="auth-container">
      <h2>Create Password</h2>
      <form onSubmit={(e) => { e.preventDefault(); setStep('profileForm'); }}>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Create a password"
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your password"
          />
        </div>
        <button type="submit">
          Continue to Profile Setup
        </button>
      </form>
    </div>
  );

  const renderProfileForm = () => (
    <div className="auth-container">
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleCreateUser}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your full name"
          />
        </div>
        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            placeholder="Enter your mobile number"
          />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Enter your complete address"
            rows="3"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Profile...' : 'Complete Profile'}
        </button>
      </form>
    </div>
  );

  const renderUserProfile = () => (
    <div className="profile-container">
      <h2>My Profile</h2>
      <div className="profile-info">
        <div className="info-item">
          <strong>Name:</strong> {userData.name}
        </div>
        <div className="info-item">
          <strong>Email:</strong> {userData.email}
        </div>
        <div className="info-item">
          <strong>Mobile:</strong> {userData.mobile}
        </div>
        <div className="info-item">
          <strong>Gender:</strong> {userData.gender}
        </div>
        <div className="info-item">
          <strong>Address:</strong> {userData.address}
        </div>
      </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
    </div>
  );

  return (
    <div className="profile-page">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {step === 'email' && renderEmailStep()}
      {step === 'otp' && renderOTPStep()}
      {step === 'password' && renderPasswordStep()}
      {step === 'createPassword' && renderCreatePasswordStep()}
      {step === 'profileForm' && renderProfileForm()}
      {step === 'profile' && renderUserProfile()}
    </div>
  );
};

export default Profile;

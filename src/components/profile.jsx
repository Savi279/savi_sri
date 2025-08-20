import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styleSheets/profile.css';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';


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
        <button type="submit" class="LoginButton" disabled={loading}>
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

 

  const renderUserProfile = () => {
  if (!userData) return null;
  const orders = [
      { id: 'SS2024001', name: 'Floral Bloom Essence', price: 1299, status: 'Delivered', date: 'March 10, 2024' },
      { id: 'SS2024002', name: 'Elegant Evening Kurti', price: 1899, status: 'Shipped', date: 'March 12, 2024' },
    ];

  return (
    <div className="user-profile">
      <div className="user-info">
        <FaUserCircle size={100} className="user-avatar" />
        <h2>{userData.name}</h2>
        <h3>Fashion Enthusiast</h3>
        <div className="user-stats">
        <div className="stat">
          <h3>{userData.orders || 5}</h3>
          <p>Orders</p>
        </div>
        
        <div className="stat">
          <h3>{userData.membershipDuration || 1.5} Years</h3>
          <p>Member Since</p>
        </div>
      </div>
      </div>
      
      <div className="personal-info">
        <div className= "info-stats">
        <h3>Personal Information</h3>
        <button className="edit-button">Edit</button>
        </div>
        <p><strong>Full Name:</strong> {userData.name}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Phone:</strong> {userData.mobile}</p>
      </div>
      <div className="shipping-address">
        <div className="info-stats">
           <h3>Shipping Address</h3>
                <button className="edit-button">Edit</button>

        </div>
       
        <p><strong>Home Address:</strong></p>
        <p>{userData.address}</p>
      </div>
      <div className="recent-orders">
        <h3>Recent Orders</h3>
        {orders.map(order => (
          <div key={order.id} className="order-item">
            <div className="order-details">
              <span>{order.name}</span>
              <p>Order #{order.id}</p>
              <p>Delivered on {order.date}</p>
            </div>
            <div className="order-price">
              <span className="order-profile-price">₹{order.price}</span>
              <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
            </div>
          </div>
        ))}
        <button className="view-all-orders">View All Orders</button>
      </div>
      <div className="favorites-section">
        <h3>Your Favorites</h3>
        <div className="favorites-list">
          {/* Render favorite items here */}
          <p>No favorites added yet.</p>
          <button>
          <Link to="/favorites" className="view-favorites-btn">
            View Favorites
          </Link>
        </button>
        </div>
      </div>

      <div className="browser-Buttons">
        <p style={{fontSize:"20px",fontWeight:"bold"}}>Quick Actions</p>
        <Link to="/collections" className="browse-btn">
          Track Orders
        </Link>
        <Link to="/collections" className="browse-btn">
          Payment Methods
        </Link>
        <Link to="/collections" className="browse-btn">
          Rewards & Offers
        </Link>
        <Link to="/collections" className="browse-btn">
          Customer Support
        </Link>
       </div>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};


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

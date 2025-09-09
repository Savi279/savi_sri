import React, { useState, useEffect } from 'react';
import '../styleSheets/profile.css';
import { Link, useNavigate} from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { authApi, orderApi } from '../api/customer_api.js';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, setCurrentUser, fetchUser, loginUser, registerUser } from '../store/userSlice';
const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser, isAuthenticated } = useSelector(state => state.user);

  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [orders, setOrders] = useState([]);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedMobile, setUpdatedMobile] = useState('');
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [isEditingAddresses, setIsEditingAddresses] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setStep('profile');
    } else {
      // The main App component now handles fetching the user on load.
      // If not authenticated, we default to the email step.
      setStep('email');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (step === 'profile' && isAuthenticated) {
      const fetchData = async () => {
        try {
          const userOrders = await orderApi.getUserOrders();
          setOrders(userOrders);
        } catch (err) {
          console.error("Failed to fetch profile data:", err);
        }
      };
      fetchData();
    }
  }, [step, isAuthenticated]);

  useEffect(() => {
    if (currentUser && currentUser.addresses) {
      setAddresses(currentUser.addresses);
    }
  }, [currentUser]);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await authApi.checkUser(email);
      setStep('otp');
      setSuccess('OTP sent to your email!');
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await authApi.verifyOtp({ email, otp });
      setSuccess('OTP verified successfully!');

      if (response.userExists) {
        setStep('password'); // Go to login
      } else {
        setStep('register'); // Go to registration
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP or failed to check user status');
    } finally {
      setLoading(false);
    }
  };



  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(resultAction)) {
        setSuccess('Login successful!');
        // Fetch full user data to ensure profile is complete
        await dispatch(fetchUser());
        // The useEffect hook will handle setting the step to 'profile'
        // when 'isAuthenticated' becomes true.
      } else {
        setError(resultAction.payload || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    try {
      const registrationData = {
        username: email,
        email,
        password,
        name,
        mobile,
        gender,
        addresses
      };
      const resultAction = await dispatch(registerUser(registrationData));
      if (registerUser.fulfilled.match(resultAction)) {
        setSuccess('Profile created successfully!');
        // Fetch full user data to ensure profile is complete
        await dispatch(fetchUser());
        // The useEffect hook will handle setting the step to 'profile'
        // when 'isAuthenticated' becomes true.
      } else {
        setError(resultAction.payload || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setStep('email');
    setEmail('');
    setOtp('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setMobile('');
    setGender('');
    setAddress('');
    setSuccess('Logged out successfully.');
    navigate('/profile');
  };

  const handleEditPersonal = () => {
    setIsEditingPersonal(true);
    setUpdatedName(currentUser.name);
    setUpdatedEmail(currentUser.email);
    setUpdatedMobile(currentUser.mobile);
  };

  const handleEditPassword = () => {
    setIsEditingPassword(true);
  };

  const handleEditAddresses = () => {
    setIsEditingAddresses(true);
  };

  const handleUpdatePersonal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const updatedData = { name: updatedName, email: updatedEmail, mobile: updatedMobile };
      const updatedUser = await authApi.updateUser(updatedData);
      dispatch(setCurrentUser(updatedUser));
      setIsEditingPersonal(false);
      setSuccess('Personal information updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update personal information');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (!oldPassword || !newPassword) {
      setError('Both old and new passwords are required');
      setLoading(false);
      return;
    }
    try {
      const updatedData = { oldPassword, newPassword };
      const updatedUser = await authApi.updateUser(updatedData);
      dispatch(setCurrentUser(updatedUser));
      setIsEditingPassword(false);
      setOldPassword('');
      setNewPassword('');
      setSuccess('Password updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddresses = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const updatedData = { addresses };
      const updatedUser = await authApi.updateUser(updatedData);
      dispatch(setCurrentUser(updatedUser));
      setIsEditingAddresses(false);
      setSuccess('Addresses updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update addresses');
    } finally {
      setLoading(false);
    }
  };

  /*** ---- AUTH STEPS ---- ***/

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
        <button className="ContinueButton" type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Continue'}
        </button>
      </form>
    </div>
  );

  const renderOTPStep = () => (
    <div className="auth-container">
      <h2>Enter OTP</h2>
      <p>We've sent a 6-digit OTP to {email}</p>
      <form onSubmit={handleVerifyOTP}>
        <div className="form-group">
          <label>OTP Code</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            required
            placeholder="Enter 6-digit OTP"
          />
        </div>
        <button type="submit" className="SubmitButton" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
      <button
        type="button"
        className="resend-otp-btn"
        onClick={() => handleRequestOTP({ preventDefault: () => {} })}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Resend OTP'}
      </button>
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
        <button type="submit" className="LoginButton" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );

  const renderRegisterStep = () => (
    <div className="auth-container">
      <h2>Create Your Profile</h2>
      <form onSubmit={handleRegister}>
        {/* Email is fixed, show for info */}
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" value={email} disabled />
        </div>
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
          <label>House/Flat Number</label>
          <input
            type="text"
            value={addresses.length > 0 ? addresses[0].houseFlatNo : ''}
            onChange={(e) => {
              const newAddresses = [...addresses];
              if (newAddresses.length === 0) {
                newAddresses.push({
                  label: 'Home',
                  houseFlatNo: '',
                  building: '',
                  area: '',
                  city: '',
                  state: '',
                  pin: '',
                  country: '',
                  isDefault: true,
                });
              }
              newAddresses[0].houseFlatNo = e.target.value;
              setAddresses(newAddresses);
            }}
            required
            placeholder="Enter house/flat number"
          />
        </div>
        <div className="form-group">
          <label>Building</label>
          <input
            type="text"
            value={addresses.length > 0 ? addresses[0].building : ''}
            onChange={(e) => {
              const newAddresses = [...addresses];
              if (newAddresses.length === 0) {
                newAddresses.push({
                  label: 'Home',
                  houseFlatNo: '',
                  building: '',
                  area: '',
                  city: '',
                  state: '',
                  pin: '',
                  country: '',
                  isDefault: true,
                });
              }
              newAddresses[0].building = e.target.value;
              setAddresses(newAddresses);
            }}
            placeholder="Enter building name"
          />
        </div>
        <div className="form-group">
          <label>Area</label>
          <input
            type="text"
            value={addresses.length > 0 ? addresses[0].area : ''}
            onChange={(e) => {
              const newAddresses = [...addresses];
              if (newAddresses.length === 0) {
                newAddresses.push({
                  label: 'Home',
                  houseFlatNo: '',
                  building: '',
                  area: '',
                  city: '',
                  state: '',
                  pin: '',
                  country: '',
                  isDefault: true,
                });
              }
              newAddresses[0].area = e.target.value;
              setAddresses(newAddresses);
            }}
            required
            placeholder="Enter area"
          />
        </div>
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            value={addresses.length > 0 ? addresses[0].city : ''}
            onChange={(e) => {
              const newAddresses = [...addresses];
              if (newAddresses.length === 0) {
                newAddresses.push({
                  label: 'Home',
                  houseFlatNo: '',
                  building: '',
                  area: '',
                  city: '',
                  state: '',
                  pin: '',
                  country: '',
                  isDefault: true,
                });
              }
              newAddresses[0].city = e.target.value;
              setAddresses(newAddresses);
            }}
            required
            placeholder="Enter city"
          />
        </div>
        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            value={addresses.length > 0 ? addresses[0].state : ''}
            onChange={(e) => {
              const newAddresses = [...addresses];
              if (newAddresses.length === 0) {
                newAddresses.push({
                  label: 'Home',
                  houseFlatNo: '',
                  building: '',
                  area: '',
                  city: '',
                  state: '',
                  pin: '',
                  country: '',
                  isDefault: true,
                });
              }
              newAddresses[0].state = e.target.value;
              setAddresses(newAddresses);
            }}
            required
            placeholder="Enter state"
          />
        </div>
        <div className="form-group">
          <label>Pin</label>
          <input
            type="text"
            value={addresses.length > 0 ? addresses[0].pin : ''}
            onChange={(e) => {
              const newAddresses = [...addresses];
              if (newAddresses.length === 0) {
                newAddresses.push({
                  label: 'Home',
                  houseFlatNo: '',
                  building: '',
                  area: '',
                  city: '',
                  state: '',
                  pin: '',
                  country: '',
                  isDefault: true,
                });
              }
              newAddresses[0].pin = e.target.value;
              setAddresses(newAddresses);
            }}
            required
            placeholder="Enter pin code"
          />
        </div>
        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            value={addresses.length > 0 ? addresses[0].country : ''}
            onChange={(e) => {
              const newAddresses = [...addresses];
              if (newAddresses.length === 0) {
                newAddresses.push({
                  label: 'Home',
                  houseFlatNo: '',
                  building: '',
                  area: '',
                  city: '',
                  state: '',
                  pin: '',
                  country: '',
                  isDefault: true,
                });
              }
              newAddresses[0].country = e.target.value;
              setAddresses(newAddresses);
            }}
            required
            placeholder="Enter country"
          />
        </div>
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
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Profile...' : 'Complete Profile'}
        </button>
      </form>
    </div>
  );

  /*** ---- PROFILE ---- ***/



  const renderUserProfile = () => {
    if (!currentUser) return null;

    const calculateMembershipYears = (isoDate) => {
      if (!isoDate) return 'New';
      const memberSince = new Date(isoDate);
      const today = new Date();
      const diffTime = Math.abs(today - memberSince);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        if (months < 1) return 'New Member';
        return `${months} month${months > 1 ? 's' : ''}`;
      }
      const diffYears = (diffTime / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
      return `${diffYears} Years`;
    };

    return (
      <div className="user-profile">
        <div className="user-info">
          <FaUserCircle size={100} className="user-avatar" />
          <h2>{currentUser.name}</h2>
          <div className="user-stats">
            <div className="stat">
              <h3>{orders.length}</h3>
              <p>Orders</p>
            </div>
            <div className="stat">
              <h3>{calculateMembershipYears(currentUser.createdAt)}</h3>
              <p>Member For</p>
            </div>
          </div>
        </div>

        <div className="personal-info">
          <div className="info-stats">
            <h3>Personal Information</h3>
            <button className="edit-button" onClick={handleEditPersonal}>Edit</button>
          </div>
          {isEditingPersonal ? (
            <form onSubmit={handleUpdatePersonal}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={updatedEmail}
                  onChange={(e) => setUpdatedEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-group">
                <label>Mobile</label>
                <input
                  type="tel"
                  value={updatedMobile}
                  onChange={(e) => setUpdatedMobile(e.target.value)}
                  required
                  placeholder="Enter your mobile number"
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => setIsEditingPersonal(false)} disabled={loading}>
                Cancel
              </button>
            </form>
          ) : (
            <>
              <p><strong>Full Name:</strong> {currentUser.name}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Phone:</strong> {currentUser.mobile}</p>
            </>
          )}
          
           <div className="password-section">
          <button className="edit-button" onClick={handleEditPassword}>Change Password</button>
          {isEditingPassword ? (
            <form onSubmit={handleUpdatePassword}>
              <div className="form-group">
                <label>Old Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  placeholder="Enter old password"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
              <button onClick={() => setIsEditingPassword(false)} disabled={loading}>
                Cancel
              </button>
            </form>
          ) : (
            <span style={{ left: "20px", position: "relative"}}>Password is set. Click "Change Password" to update.</span>
          )}
        </div>
        </div>

       

        <div className="shipping-address">
          <div className="info-stats">
            <h3>Shipping Addresses</h3>
            <button className="edit-button" onClick={handleEditAddresses}>Manage Addresses</button>
          </div>
          {isEditingAddresses ? (
            <form onSubmit={handleUpdateAddresses}>
              {addresses.map((addr, index) => (
                <div key={index} className="address-form">
                  <h4>Address {index + 1}</h4>
                  <div className="form-group">
                    <label>Label</label>
                    <input
                      type="text"
                      value={addr.label || ''}
                      onChange={(e) => {
                        const newAddresses = [...addresses];
                        newAddresses[index].label = e.target.value;
                        setAddresses(newAddresses);
                      }}
                      placeholder="Label (e.g., Home, Work)"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>House/Flat Number</label>
                    <input
                      type="text"
                      value={addr.houseFlatNo || ''}
                      onChange={(e) => {
                        const newAddresses = [...addresses];
                        newAddresses[index].houseFlatNo = e.target.value;
                        setAddresses(newAddresses);
                      }}
                      placeholder="Enter house/flat number"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Building</label>
                    <input
                      type="text"
                      value={addr.building || ''}
                      onChange={(e) => {
                        const newAddresses = [...addresses];
                        newAddresses[index].building = e.target.value;
                        setAddresses(newAddresses);
                      }}
                      placeholder="Enter building name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Area</label>
                    <input
                      type="text"
                      value={addr.area || ''}
                      onChange={(e) => {
                        const newAddresses = [...addresses];
                        newAddresses[index].area = e.target.value;
                        setAddresses(newAddresses);
                      }}
                      placeholder="Enter area"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={addr.city || ''}
                      onChange={(e) => {
                        const newAddresses = [...addresses];
                        newAddresses[index].city = e.target.value;
                        setAddresses(newAddresses);
                      }}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      value={addr.state || ''}
                      onChange={(e) => {
                        const newAddresses = [...addresses];
                        newAddresses[index].state = e.target.value;
                        setAddresses(newAddresses);
                      }}
                      placeholder="Enter state"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Pin</label>
                    <input
                      type="text"
                      value={addr.pin || ''}
                      onChange={(e) => {
                        const newAddresses = [...addresses];
                        newAddresses[index].pin = e.target.value;
                        setAddresses(newAddresses);
                      }}
                      placeholder="Enter pin code"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      value={addr.country || ''}
                      onChange={(e) => {
                        const newAddresses = [...addresses];
                        newAddresses[index].country = e.target.value;
                        setAddresses(newAddresses);
                      }}
                      placeholder="Enter country"
                      required
                    />
                  </div>
                  <hr />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setAddresses([
                    ...addresses,
                    {
                      label: '',
                      houseFlatNo: '',
                      building: '',
                      area: '',
                      city: '',
                      state: '',
                      pin: '',
                      country: '',
                      isDefault: false,
                    },
                  ]);
                }}
                disabled={loading}
              >
                Add New Address
              </button>
              <br />
              <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Addresses'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditingAddresses(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </form>
          ) : (
            <>
              {addresses.length > 0 ? (
                addresses.map((addr, index) => (
                  <div key={index}>
                    <p>
                      <strong>{addr.label}:</strong>{' '}
                      {`${addr.houseFlatNo || ''}${
                        addr.building ? ', ' + addr.building : ''
                      }${addr.area ? ', ' + addr.area : ''}${
                        addr.city ? ', ' + addr.city : ''
                      }${addr.state ? ', ' + addr.state : ''}${
                        addr.pin ? ', ' + addr.pin : ''
                      }${addr.country ? ', ' + addr.country : ''}`}
                    </p>
                  </div>
                ))
              ) : (
                <p>No addresses saved.</p>
              )}
            </>
          )}
        </div>

        <div className="recent-orders">
          <h3>Recent Orders</h3>
          {orders.length > 0 ? (
            orders.map(order => (
              <div key={order._id} className="order-item">
                <div className="order-details">
                  <span>{order.products.map(p => p.product.name).join(', ')}</span>
                  <p>Order #{order._id}</p>
                  <p>Delivered on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="order-price">
                  <span className="order-profile-price">₹{order.totalAmount.toFixed(2)}</span>
                  <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No recent orders.</p>
          )}
          <Link to="/orders" className="view-all-orders">View All Orders</Link>
        </div>


        <div className="browser-Buttons">
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>Quick Actions</p>
          <Link to="/collections" className="browse-btn">
            Track Orders
          </Link>
          <Link to="/collections" className="browse-btn">
            Payment Methods
          </Link>
          <Link to="/collections" className="browse-btn">
            Rewards & Offers
          </Link>
          <Link to="/contactUs" className="browse-btn">
            Customer Support
          </Link>
        </div>
        <button className="logout-button" onClick={handleLogout} disabled={loading}>
          {loading ? 'Logging Out...' : 'Logout'}
        </button>
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
      {step === 'register' && renderRegisterStep()}
      {step === 'profile' && renderUserProfile()}
    </div>
  );
};

export default Profile;

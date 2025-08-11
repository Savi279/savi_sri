const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

require('dotenv').config();

// Configure nodemailer with better error handling and security
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    secure: true,
    port: 465,
    tls: {
        rejectUnauthorized: false
    }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('SMTP configuration error:', error);
    } else {
        console.log('SMTP server is ready to take messages');
    }
});

// Generate 4-digit OTP
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

// Request OTP
const requestOTP = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        
        // Generate 4-digit OTP
        const otp = generateOTP();
        
        // Set OTP expiration to 10 minutes
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        
        // Delete any existing OTP for this email
        await OTP.deleteMany({ email });
        
        // Save new OTP
        const newOTP = new OTP({
            email,
            otp,
            expiresAt
        });
        await newOTP.save();
        
        // Send OTP via email
        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: email,
            subject: 'Your OTP Code',
            html: `
                <h2>Your OTP Code</h2>
                <p>Your 4-digit OTP code is: <strong>${otp}</strong></p>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        
        res.status(200).json({ 
            message: 'OTP sent successfully',
            userExists: !!userExists 
        });
        
    } catch (error) {
        console.error('Error in requestOTP:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
};

// Verify OTP
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }
        
        // Find OTP record
        const otpRecord = await OTP.findOne({ email, otp });
        
        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        
        // Check if OTP is expired
        if (new Date() > otpRecord.expiresAt) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({ message: 'OTP has expired' });
        }
        
        // OTP is valid, delete it
        await OTP.deleteOne({ _id: otpRecord._id });
        
        res.status(200).json({ message: 'OTP verified successfully' });
        
    } catch (error) {
        console.error('Error in verifyOTP:', error);
        res.status(500).json({ message: 'Failed to verify OTP' });
    }
};

// Create new user (registration)
const createUser = async (req, res) => {
    try {
        const { email, password, name, mobile, gender, address } = req.body;
        
        // Validate required fields
        if (!email || !password || !name || !mobile || !gender || !address) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            mobile,
            gender,
            address
        });
        
        await newUser.save();
        
        // Return user data without password
        const userResponse = {
            _id: newUser._id,
            email: newUser.email,
            name: newUser.name,
            mobile: newUser.mobile,
            gender: newUser.gender,
            address: newUser.address
        };
        
        res.status(201).json({ 
            message: 'User created successfully',
            user: userResponse 
        });
        
    } catch (error) {
        console.error('Error in createUser:', error);
        res.status(500).json({ message: 'Failed to create user' });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Return user data without password
        const userResponse = {
            _id: user._id,
            email: user.email,
            name: user.name,
            mobile: user.mobile,
            gender: user.gender,
            address: user.address
        };
        
        res.status(200).json({ 
            message: 'Login successful',
            user: userResponse 
        });
        
    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ message: 'Login failed' });
    }
};

module.exports = {
    requestOTP,
    verifyOTP,
    createUser,
    loginUser
};

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
    },
});

// @desc    Register a new user with OTP
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { role, name, username, email, password, enrollmentNumber, mobile, semester } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }, { enrollmentNumber }] });

    if (userExists) {
        return res.status(400).send({
            success: false,
            message: 'User already exists !!'
        });
    }

    // Generate OTP and set expiration time
    const otp = crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP is valid for 10 minutes

    // Send OTP via email
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Registration',
            text: `Hey ${name}! Your OTP is ${otp}. Please enter this OTP to complete your registration.`,
        });

        console.log('Email sent successfully.');

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Failed to send OTP !',
            error
        });
    }

    // Create new user with OTP and expiration time
    const user = await User.create({
        role,
        name,
        username,
        email,
        password,
        enrollmentNumber,
        mobile,
        semester,
        otp, // Store the OTP temporarily
        otpExpires, // Store the OTP expiration time
        isApproved: false, // User registration is incomplete
    });

    if (user) {
        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please verify the OTP sent to your email.',
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    } else {
        return res.status(400).send({
            success: false,
            message: 'Invalid user data !'
        });
    }
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).send({
            success: false,
            message: "User not found",
        });
    }

    // Check if OTP has expired
    if (user.otpExpires <= Date.now()) {
        return res.status(400).send({
            success: false,
            message: 'OTP has expired. Please request a new OTP',
        });
    }

    // Check if OTP is correct
    if (user.otp === otp) {
        // OTP is correct
        user.otp = undefined; // Remove OTP after verification
        user.otpExpires = undefined; // Remove OTP expiration after verification
        user.otpAttempts = 0; // Reset attempts
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Registration Success! Wait for admin to verify it !!',
        });
    } else {
        // OTP is incorrect
        user.otpAttempts += 1; // Increment attempts
        if (user.otpAttempts >= 4) {
            // If attempts exceed 4, delete the user
            await User.deleteOne({ email });
            return res.status(400).send({
                success: false,
                message: 'Too many failed attempts. Registration data deleted. Please register again.',
            });
        }

        await user.save(); // Save updated attempt count

        return res.status(400).send({
            success: false,
            message: "Invalid OTP. Please try again.",
        });
    }
});


// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, username, enrollmentNumber, password } = req.body;

    // Check for user by email, username, or enrollment number
    const user = await User.findOne({ $or: [{ email }, { username }, { enrollmentNumber }] });

    if (user && (await user.matchPassword(password))) {
        // Check if the user is approved by admin
        if (!user.isApproved) {
            return res.status(403).send({
                success: false,
                message: "'Your account is not approved yet. Please verify your OTP and wait for admin approval !"
            });
        }

        res.status(200).send({
            success: true,
            message: 'Logged in successfully',
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).send({
            success: false,
            message: "Invalid email or password",
        });
    }
});

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = {
    registerUser,
    loginUser,
    verifyOtp,
};

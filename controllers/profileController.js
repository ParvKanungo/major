const User = require('../models/User');
const path= require('path');
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
        
            res.status(200).json({
                success: true,
                message: 'User profile retrieved successfully',
                data: {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    dob: user.dob,
                    address: user.address,
                    city: user.city,
                    bio: user.bio,
                    role: user.role,
                    course: user.course,
                    branch: user.branch,
                    semester: user.semester,
                    mobile: user.mobile,
                    connections: user.connections,
                    isApproved: user.isApproved,
                }
            });
        } else {
            res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server error',
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            //const profilePicture = req.files['profilePicture'] ? req.files['profilePicture'][0] : null;
            // Update fields
            user.mobile = req.body.mobile || user.mobile;
            user.profilePicture = req.body.profilePicture || user.profilePicture;
            user.bio = req.body.bio || user.bio;
            user.dob = req.body.dob || user.dob;
            user.address = req.body.address || user.address;
            user.city = req.body.city || user.city;
            user.course = req.body.course || user.course;
            user.branch = req.body.branch || user.branch;
            user.semester = req.body.semester || user.semester;
            user.updatedAt =  Date.now();

            // if (profilePicture) {
            //     user.profilePicture = profilePicture.path; // Save the path of the uploaded profile picture
            // }
            // Save the updated user
            const updatedUser = await user.save();

            res.status(200).json({
                success: true,
                message: 'User profile updated successfully',
                data: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    profilePicture: updatedUser.profilePicture,
                    dob: updatedUser.dob,
                    address: updatedUser.address,
                    city: updatedUser.city,
                    bio: updatedUser.bio,
                    role: updatedUser.role,
                    course: updatedUser.course,
                    branch: updatedUser.branch,
                    semester: updatedUser.semester,
                    mobile: updatedUser.mobile,
                    connections: updatedUser.connections,
                    isApproved: updatedUser.isApproved,
                    updatedAt: updatedUser.updatedAt, // Include updatedAt field in response
                }
            });
        } else {
            res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Server error',
            error
        });
    }
};


module.exports = {
    getUserProfile,
    updateUserProfile,
};

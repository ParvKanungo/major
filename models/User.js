const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
    {
        role: {
            type: String,
            required: true,
            enum: ['student', 'faculty'],
        },
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        enrollmentNumber: {
            type: String,
            unique: true,
            required: true,
        },
        mobile: {
            type: String,
            required: true,
        },
        semester: {
            type: String,
            required: function () {
                return this.role === 'student';
            },
        },
        course: {
            type: String,
            required:false,
        },
        branch: {
            type: String,
            reqiured : false,
        },
        profilePicture: {
            type: String, // URL or path to the profile picture
            required: false,
        },
        bio: {
            type: String,
            required: false,
        },
        dob: {
            type: Date,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: false,
        },
        connections: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        otp: {
            type: String,
            required: false,
        },
        otpExpires: {
            type: Date,
            required: false,
        },
        otpAttempts: {
            type: Number,
            default: 0,
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Encrypt the password before saving the user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password with hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

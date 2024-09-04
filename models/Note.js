const mongoose = require('mongoose');

const noteSchema = mongoose.Schema(
    {
        course: {
            type: String,
            required: true,
        },
        semester: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        file: {
            type: String, // Store the file path or URL
            required: true,
        },
        fileType: {
            type: String, // Store file type (pdf, jpg, pptx, doc, etc.)
            required: true,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the user who uploaded the note
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;

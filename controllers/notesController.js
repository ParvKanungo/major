const asyncHandler = require('express-async-handler');
const upload = require('../config/uploadConfig');
const Note = require('../models/Note');

// @desc    Upload a new note
// @route   POST /api/notes/upload
// @access  Private
const uploadNote = asyncHandler((req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err });
        } else {
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'No file selected!' });
            }

            const { course, semester, subject, title } = req.body;

            if (!course || !semester || !subject || !title) {
                return res.status(400).json({ success: false, message: 'Please provide course, semester, subject and Title!' });
            }

            try {
                // Create a new note entry
                const newNote = new Note({
                    course,
                    semester,
                    subject,
                    title, // File name as title
                    file: req.file.path, // File path for the uploaded note
                    fileType: req.file.mimetype, // Store the file type
                    uploadedBy: req.user._id, // The user who uploaded the note
                });

                // Save the note to the database
                const note = await newNote.save();

                // Send success response
                return res.status(201).json({ success: true, note });
            } catch (saveError) {
                console.error(saveError);
                return res.status(500).json({ success: false, message: 'Server error while saving the note.' });
            }
        }
    });
});


// @desc    Get all courses with notes
// @route   GET /api/notes/courses
// @access  Private
const getCoursesWithNotes = asyncHandler(async (req, res) => {
    try {
        const courses = await Note.distinct('course');
        if (courses.length === 0) {
            return res.status(404).json({ success: false, message: 'No courses found with notes' });
        }
        res.status(200).json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @desc    Get all semesters with notes under a specific course
// @route   GET /api/notes/courses/:course/semesters
// @access  Private
const getSemestersWithNotes = asyncHandler(async (req, res) => {
    const { course } = req.params;

    try {
        const semesters = await Note.distinct('semester', { course });
        if (semesters.length === 0) {
            return res.status(404).json({ success: false, message: `No semesters found with notes for course ${course}` });
        }
        res.status(200).json({ success: true, semesters });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @desc    Get all subjects with notes under a specific semester and course
// @route   GET /api/notes/courses/:course/semesters/:semester/subjects
// @access  Private
const getSubjectsWithNotes = asyncHandler(async (req, res) => {
    const { course, semester } = req.params;

    try {
        const subjects = await Note.distinct('subject', { course, semester });
        if (subjects.length === 0) {
            return res.status(404).json({ success: false, message: `No subjects found with notes for course ${course} and semester ${semester}` });
        }
        res.status(200).json({ success: true, subjects });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @desc    Get all notes files under a specific subject, semester, and course
// @route   GET /api/notes/courses/:course/semesters/:semester/subjects/:subject
// @access  Private
const getNotesBySubject = asyncHandler(async (req, res) => {
    const { course, semester, subject } = req.params;

    try {
        const notes = await Note.find({ course, semester, subject });
        if (notes.length === 0) {
            return res.status(404).json({ success: false, message: `No notes found for course ${course}, semester ${semester}, and subject ${subject}` });
        }
        res.status(200).json({ success: true, notes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = {
    uploadNote,
    getCoursesWithNotes,
    getSemestersWithNotes,
    getSubjectsWithNotes,
    getNotesBySubject,
};

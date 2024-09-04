const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { uploadNote,
    getCoursesWithNotes,
    getSemestersWithNotes,
    getSubjectsWithNotes,
    getNotesBySubject
} = require('../controllers/notesController');

const router = express.Router();

router.post('/upload', protect, uploadNote);
router.get('/courses', protect, getCoursesWithNotes);
router.get('/courses/:course/semesters', protect, getSemestersWithNotes);
router.get('/courses/:course/semesters/:semester/subjects', protect, getSubjectsWithNotes);
router.get('/courses/:course/semesters/:semester/subjects/:subject', protect, getNotesBySubject);

module.exports = router;

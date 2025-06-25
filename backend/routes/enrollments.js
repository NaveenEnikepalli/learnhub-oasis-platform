
const express = require('express');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get student's enrolled courses
router.get('/my-courses', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'firstName lastName'
        }
      })
      .sort({ enrollmentDate: -1 });

    res.json(enrollments);
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enroll in a course
router.post('/:courseId/enroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = new Enrollment({
      student: req.user._id,
      course: req.params.courseId
    });

    await enrollment.save();

    // Add student to course
    course.students.push(req.user._id);
    await course.save();

    const populatedEnrollment = await Enrollment.findById(enrollment._id)
      .populate('course')
      .populate('student', 'firstName lastName email');

    res.status(201).json({
      message: 'Enrolled successfully',
      enrollment: populatedEnrollment
    });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update progress
router.put('/:id/progress', auth, async (req, res) => {
  try {
    const { progress } = req.body;
    
    const enrollment = await Enrollment.findById(req.params.id);
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (enrollment.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    enrollment.progress = progress;
    enrollment.lastAccessed = new Date();

    if (progress >= 100) {
      enrollment.status = 'completed';
      enrollment.completionDate = new Date();
    } else if (progress > 0) {
      enrollment.status = 'in-progress';
    }

    await enrollment.save();

    res.json({
      message: 'Progress updated successfully',
      enrollment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

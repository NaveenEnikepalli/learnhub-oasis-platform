
const express = require('express');
const multer = require('multer');
const path = require('path');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { auth, roleAuth } = require('../middleware/auth');

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all courses with search and filter
router.get('/', async (req, res) => {
  try {
    const { search, category, level, priceRange, sort } = req.query;
    let query = { isPublished: true };

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructorName: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by level
    if (level && level !== 'All') {
      query.level = level;
    }

    // Filter by price range
    if (priceRange && priceRange !== 'All') {
      switch (priceRange) {
        case 'Free':
          query.price = 0;
          break;
        case '$0-$50':
          query.price = { $lte: 50 };
          break;
        case '$50-$100':
          query.price = { $gt: 50, $lte: 100 };
          break;
        case '$100-$200':
          query.price = { $gt: 100, $lte: 200 };
          break;
        case '$200+':
          query.price = { $gt: 200 };
          break;
      }
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { 'rating.average': -1 };

    const courses = await Course.find(query)
      .populate('instructor', 'firstName lastName')
      .sort(sortOption);

    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get courses by teacher
router.get('/my-courses', auth, roleAuth(['teacher']), async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate('instructor', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    console.error('Get teacher courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'firstName lastName bio');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create course
router.post('/', auth, roleAuth(['teacher']), upload.single('thumbnail'), async (req, res) => {
  try {
    const { title, description, category, level, price, duration, language } = req.body;

    const course = new Course({
      title,
      description,
      category,
      level,
      price: Number(price),
      duration: Number(duration),
      language: language || 'English',
      instructor: req.user._id,
      instructorName: `${req.user.firstName} ${req.user.lastName}`,
      thumbnail: req.file ? req.file.filename : '',
      isPublished: false
    });

    await course.save();
    
    const populatedCourse = await Course.findById(course._id)
      .populate('instructor', 'firstName lastName');

    res.status(201).json({
      message: 'Course created successfully',
      course: populatedCourse
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update course
router.put('/:id', auth, roleAuth(['teacher']), upload.single('thumbnail'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the instructor
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updateData = { ...req.body };
    if (req.file) {
      updateData.thumbnail = req.file.filename;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('instructor', 'firstName lastName');

    res.json({
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete course
router.delete('/:id', auth, roleAuth(['teacher']), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the instructor
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete all enrollments for this course
    await Enrollment.deleteMany({ course: req.params.id });

    // Delete the course
    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Publish/Unpublish course
router.patch('/:id/publish', auth, roleAuth(['teacher']), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    res.json({
      message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`,
      course
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

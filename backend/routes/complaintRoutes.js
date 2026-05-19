const express = require('express');
const { 
    createComplaint, 
    getComplaints, 
    getComplaint, 
    updateComplaint, 
    deleteComplaint,
    searchComplaints,
    filterComplaints
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createComplaint);
router.get('/', protect, getComplaints);
router.get('/search', protect, searchComplaints);
router.get('/filter', protect, filterComplaints);
router.get('/:id', protect, getComplaint);
router.put('/:id', protect, updateComplaint);
router.delete('/:id', protect, authorize('admin'), deleteComplaint);

module.exports = router;

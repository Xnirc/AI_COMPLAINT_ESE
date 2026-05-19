const Complaint = require('../models/Complaint');

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
exports.createComplaint = async (req, res) => {
    try {
        req.body.user = req.user.id;
        const complaint = await Complaint.create(req.body);
        res.status(201).json({ success: true, data: complaint });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private
exports.getComplaints = async (req, res) => {
    try {
        let query;
        if (req.user.role === 'admin') {
            query = Complaint.find().populate('user', 'name email');
        } else {
            query = Complaint.find({ user: req.user.id });
        }
        
        const complaints = await query;
        res.status(200).json({ success: true, count: complaints.length, data: complaints });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id).populate('user', 'name email');
        if (!complaint) {
            return res.status(404).json({ success: false, error: 'Complaint not found' });
        }
        
        // Make sure user owns complaint or is admin
        if (complaint.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized to access this complaint' });
        }
        
        res.status(200).json({ success: true, data: complaint });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Private
exports.updateComplaint = async (req, res) => {
    try {
        let complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ success: false, error: 'Complaint not found' });
        }

        // Make sure user owns complaint or is admin
        if (complaint.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized to update this complaint' });
        }

        complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: complaint });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private/Admin
exports.deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ success: false, error: 'Complaint not found' });
        }
        
        await complaint.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Search complaints by location
// @route   GET /api/complaints/search?location=
// @access  Private
exports.searchComplaints = async (req, res) => {
    try {
        const { location } = req.query;
        let queryStr = {};
        
        if (location) {
            queryStr.location = { $regex: location, $options: 'i' };
        }
        
        if (req.user.role !== 'admin') {
            queryStr.user = req.user.id;
        }

        const complaints = await Complaint.find(queryStr);
        res.status(200).json({ success: true, count: complaints.length, data: complaints });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Filter complaints by category
// @route   GET /api/complaints/filter?category=
// @access  Private
exports.filterComplaints = async (req, res) => {
    try {
        const { category } = req.query;
        let queryStr = {};
        
        if (category) {
            queryStr.category = category;
        }
        
        if (req.user.role !== 'admin') {
            queryStr.user = req.user.id;
        }

        const complaints = await Complaint.find(queryStr);
        res.status(200).json({ success: true, count: complaints.length, data: complaints });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

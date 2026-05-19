import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

const ComplaintForm = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        title: '',
        description: '',
        category: 'General',
        location: ''
    });

    const categories = ['General', 'Maintenance', 'IT Support', 'HR', 'Sanitation', 'Security'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.post('/complaints', formData);
            
            // Trigger AI analysis in background
            try {
                await api.post('/ai/analyze', { complaintId: res.data.data._id });
                toast.success('Complaint submitted and analyzed by AI!');
            } catch (aiError) {
                console.error('AI Analysis failed:', aiError);
                toast.success('Complaint submitted successfully!');
            }
            
            navigate('/complaints');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to submit complaint');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
        >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
                    <h2 className="text-2xl font-bold mb-2">Register New Complaint</h2>
                    <p className="text-blue-100">Our AI will automatically categorize and prioritize your issue.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field bg-gray-50"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field bg-gray-50"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Complaint Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="input-field bg-gray-50"
                            placeholder="Brief summary of the issue"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="input-field bg-gray-50"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="input-field bg-gray-50"
                                placeholder="e.g. Building A, Room 101"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="5"
                            className="input-field bg-gray-50 resize-none"
                            placeholder="Please provide as much detail as possible..."
                            required
                        ></textarea>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full md:w-auto btn-primary flex justify-center items-center py-3 px-8 ml-auto"
                        >
                            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Send className="mr-2" size={20} />}
                            {isLoading ? 'Submitting & Analyzing...' : 'Submit Complaint'}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default ComplaintForm;

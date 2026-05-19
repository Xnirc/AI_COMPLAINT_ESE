import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Search, Filter, Eye, Trash2, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ComplaintList = () => {
    const { user } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            let url = '/complaints';
            
            if (searchTerm && filterCategory) {
                // simple frontend filter for now, or use complex backend queries
                const res = await api.get(url);
                let filtered = res.data.data.filter(c => 
                    c.location.toLowerCase().includes(searchTerm.toLowerCase()) && 
                    c.category === filterCategory
                );
                setComplaints(filtered);
            } else if (searchTerm) {
                const res = await api.get(`/complaints/search?location=${searchTerm}`);
                setComplaints(res.data.data);
            } else if (filterCategory) {
                const res = await api.get(`/complaints/filter?category=${filterCategory}`);
                setComplaints(res.data.data);
            } else {
                const res = await api.get(url);
                setComplaints(res.data.data);
            }
        } catch (error) {
            toast.error('Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, [searchTerm, filterCategory]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this complaint?')) {
            try {
                await api.delete(`/complaints/${id}`);
                setComplaints(complaints.filter(c => c._id !== id));
                toast.success('Complaint deleted successfully');
            } catch (error) {
                toast.error('Failed to delete complaint');
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
            case 'In Progress': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Progress</span>;
            case 'Resolved': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Resolved</span>;
            default: return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'High':
            case 'Critical': return <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">{priority}</span>;
            case 'Medium': return <span className="px-2 py-1 rounded text-xs font-semibold bg-orange-100 text-orange-700">Medium</span>;
            case 'Low': return <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">Low</span>;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">
                    {user?.role === 'admin' ? 'All Complaints' : 'My Complaints'}
                </h1>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by location..." 
                            className="input-field pl-10 py-2 w-full sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <select 
                            className="input-field pl-10 py-2 w-full sm:w-48 appearance-none"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            <option value="General">General</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="IT Support">IT Support</option>
                            <option value="HR">HR</option>
                            <option value="Sanitation">Sanitation</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            ) : complaints.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No complaints found</h3>
                    <p className="text-gray-500 mt-2">Get started by registering a new complaint.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 text-sm">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Title & ID</th>
                                    <th className="px-6 py-4 font-semibold">Category</th>
                                    <th className="px-6 py-4 font-semibold">Location</th>
                                    <th className="px-6 py-4 font-semibold">AI Analysis</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {complaints.map((complaint, idx) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={complaint._id} 
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900 truncate max-w-xs">{complaint.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">ID: {complaint._id.substring(0, 8)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-700 text-sm">{complaint.category}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-700 text-sm">{complaint.location}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 items-start">
                                                {getPriorityBadge(complaint.priority)}
                                                {complaint.aiSummary && <Cpu size={14} className="text-blue-500 mt-1" title="AI Analyzed" />}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(complaint.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Link 
                                                    to={`/complaints/${complaint._id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                {user?.role === 'admin' && (
                                                    <button 
                                                        onClick={() => handleDelete(complaint._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintList;

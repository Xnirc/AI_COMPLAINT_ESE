import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { ArrowLeft, Cpu, Clock, MapPin, Tag, User, Briefcase, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ComplaintDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const res = await api.get(`/complaints/${id}`);
                setComplaint(res.data.data);
                setStatus(res.data.data.status);
            } catch (error) {
                toast.error('Failed to fetch complaint details');
                navigate('/complaints');
            } finally {
                setLoading(false);
            }
        };
        fetchComplaint();
    }, [id, navigate]);

    const handleStatusUpdate = async () => {
        try {
            setUpdating(true);
            await api.put(`/complaints/${id}`, { status });
            toast.success('Status updated successfully');
        } catch (error) {
            toast.error('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!complaint) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto space-y-6"
        >
            <button 
                onClick={() => navigate('/complaints')}
                className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" /> Back to list
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">{complaint.title}</h1>
                                <p className="text-sm text-gray-500 flex items-center">
                                    <Clock size={16} className="mr-1" /> 
                                    Submitted on {new Date(complaint.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                                complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                                {complaint.status}
                            </span>
                        </div>

                        <div className="prose max-w-none text-gray-700 mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                            <p className="whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-gray-100">
                                {complaint.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-500 font-medium uppercase mb-1">Category</p>
                                <p className="font-semibold text-gray-800 flex items-center">
                                    <Tag size={16} className="mr-2 text-blue-500" /> {complaint.category}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-500 font-medium uppercase mb-1">Location</p>
                                <p className="font-semibold text-gray-800 flex items-center">
                                    <MapPin size={16} className="mr-2 text-red-500" /> {complaint.location}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-500 font-medium uppercase mb-1">User</p>
                                <p className="font-semibold text-gray-800 flex items-center truncate">
                                    <User size={16} className="mr-2 text-green-500" /> {complaint.name}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-500 font-medium uppercase mb-1">Email</p>
                                <p className="font-semibold text-gray-800 truncate" title={complaint.email}>
                                    {complaint.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {user?.role === 'admin' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Admin Actions</h3>
                            <div className="flex items-end gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                                    <select 
                                        className="input-field"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </div>
                                <button 
                                    onClick={handleStatusUpdate}
                                    disabled={updating || status === complaint.status}
                                    className="btn-primary py-2.5 px-6 whitespace-nowrap disabled:opacity-50"
                                >
                                    {updating ? 'Updating...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* AI Analysis Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl shadow-lg border border-indigo-800 p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Cpu size={100} />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Cpu size={24} className="text-blue-200" />
                                </div>
                                <h3 className="text-xl font-bold">AI Analysis</h3>
                            </div>

                            {complaint.aiSummary ? (
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-indigo-200 text-sm uppercase tracking-wider font-semibold mb-1">Priority Level</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                                complaint.priority === 'Critical' || complaint.priority === 'High' ? 'bg-red-500 text-white' :
                                                complaint.priority === 'Medium' ? 'bg-orange-500 text-white' :
                                                'bg-green-500 text-white'
                                            }`}>
                                                {complaint.priority}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-indigo-200 text-sm uppercase tracking-wider font-semibold mb-1 flex items-center">
                                            <Briefcase size={14} className="mr-1" /> Department
                                        </p>
                                        <p className="font-medium text-lg">{complaint.department}</p>
                                    </div>

                                    <div>
                                        <p className="text-indigo-200 text-sm uppercase tracking-wider font-semibold mb-2 flex items-center">
                                            <Bot size={14} className="mr-1" /> AI Summary
                                        </p>
                                        <p className="bg-white/10 p-3 rounded-lg border border-white/10 text-sm leading-relaxed">
                                            {complaint.aiSummary}
                                        </p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-indigo-200 text-sm uppercase tracking-wider font-semibold mb-2">Suggested Response</p>
                                        <p className="bg-white/10 p-3 rounded-lg border border-white/10 text-sm leading-relaxed italic">
                                            "{complaint.aiResponse}"
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-indigo-200 mb-4">AI Analysis pending or failed.</p>
                                    <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                                        Request Analysis
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ComplaintDetail;

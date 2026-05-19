import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { BarChart, Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        resolved: 0,
        highPriority: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/complaints');
                const complaints = res.data.data;
                
                const pending = complaints.filter(c => c.status === 'Pending').length;
                const resolved = complaints.filter(c => c.status === 'Resolved').length;
                const highPriority = complaints.filter(c => c.priority === 'High' || c.priority === 'Critical').length;
                
                setStats({
                    total: complaints.length,
                    pending,
                    resolved,
                    highPriority
                });
            } catch (error) {
                console.error("Error fetching stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon, color, delay }) => (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between"
        >
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
            </div>
            <div className={`p-4 rounded-full ${color} text-white`}>
                {icon}
            </div>
        </motion.div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}! 👋</h1>
                    <p className="text-gray-500 mt-1">Here's an overview of your complaints</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Complaints" 
                    value={stats.total} 
                    icon={<Activity size={24} />} 
                    color="bg-blue-500"
                    delay={0.1}
                />
                <StatCard 
                    title="Pending" 
                    value={stats.pending} 
                    icon={<Clock size={24} />} 
                    color="bg-yellow-500"
                    delay={0.2}
                />
                <StatCard 
                    title="Resolved" 
                    value={stats.resolved} 
                    icon={<CheckCircle size={24} />} 
                    color="bg-green-500"
                    delay={0.3}
                />
                <StatCard 
                    title="High Priority" 
                    value={stats.highPriority} 
                    icon={<AlertTriangle size={24} />} 
                    color="bg-red-500"
                    delay={0.4}
                />
            </div>
            
            <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChart className="text-blue-500" />
                    AI System Analytics
                </h2>
                <div className="h-64 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center">
                    <p className="text-gray-400">Charts & detailed analytics module ready for integration</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

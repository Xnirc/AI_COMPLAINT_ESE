import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, PlusCircle, List, LogOut, Menu } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Register Complaint', path: '/register-complaint', icon: <PlusCircle size={20} /> },
        { name: 'My Complaints', path: '/complaints', icon: <List size={20} /> },
    ];

    if (user?.role === 'admin') {
        navItems[2].name = 'All Complaints';
    }

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
            
            <aside className={`fixed top-0 left-0 h-screen w-64 glass-card bg-white/90 z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-center h-20 border-b border-gray-200">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        AI Smart CMS
                    </h1>
                </div>
                
                <div className="flex flex-col h-[calc(100vh-5rem)] justify-between py-6">
                    <ul className="space-y-2 px-4">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        location.pathname === item.path
                                            ? 'bg-blue-50 text-blue-600 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    
                    <div className="px-4">
                        <div className="mb-4 px-4 py-3 rounded-lg bg-gray-50 border border-gray-100">
                            <p className="text-sm text-gray-500">Logged in as</p>
                            <p className="font-semibold text-gray-800 truncate">{user?.name}</p>
                            <p className="text-xs text-blue-600 capitalize">{user?.role}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

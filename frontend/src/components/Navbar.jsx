import React, { useState } from 'react';
import { Menu, Bell, User } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleSidebar}
                    className="p-2 rounded-md hover:bg-gray-100 lg:hidden text-gray-600"
                >
                    <Menu size={24} />
                </button>
                <div className="lg:hidden text-lg font-bold text-blue-600">CMS</div>
            </div>
            
            <div className="flex items-center gap-4">
                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                    <User size={16} />
                </div>
            </div>
        </header>
    );
};

export default Navbar;

import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Plane, LogOut, User, Menu, X, Shield, BookOpen } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <div className="bg-blue-600 rounded-lg p-1.5 mr-2 group-hover:bg-blue-700 transition-colors">
                                <Plane className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                AiTravel
                            </span>
                        </Link>
                        <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                            <Link to="/destinations" className="text-gray-600 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500 hover:text-gray-900 text-sm font-medium transition-colors">
                                Destinations
                            </Link>
                            {user && (
                                <>
                                    <Link to="/dashboard" className="text-gray-600 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500 hover:text-gray-900 text-sm font-medium transition-colors">
                                        Dashboard
                                    </Link>
                                    <Link to="/create-trip" className="text-gray-600 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500 hover:text-gray-900 text-sm font-medium transition-colors">
                                        Plan Trip
                                    </Link>
                                    <Link to="/bookings" className="text-gray-600 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500 hover:text-gray-900 text-sm font-medium transition-colors">
                                        My Bookings
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link to="/admin" className="text-gray-600 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500 hover:text-gray-900 text-sm font-medium transition-colors">
                                            <Shield className="w-4 h-4 mr-1" />
                                            Admin
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex flex-col items-end mr-2">
                                    <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                                    <span className="text-xs text-gray-500">{user.email}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="space-x-3">
                                <Link to="/login" className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="sm:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            to="/destinations"
                            onClick={() => setIsOpen(false)}
                            className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                        >
                            Destinations
                        </Link>
                        {user && (
                            <>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/create-trip"
                                    onClick={() => setIsOpen(false)}
                                    className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                                >
                                    Plan Trip
                                </Link>
                                <Link
                                    to="/bookings"
                                    onClick={() => setIsOpen(false)}
                                    className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                                >
                                    My Bookings
                                </Link>
                                {user.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        onClick={() => setIsOpen(false)}
                                        className="block pl-3 pr-4 py-3 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                    <div className="pt-4 pb-4 border-t border-gray-200 bg-gray-50">
                        {user ? (
                            <div className="flex items-center px-4">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                                    <button
                                        onClick={() => { handleLogout(); setIsOpen(false); }}
                                        className="mt-3 block w-full text-left text-sm font-medium text-red-600 hover:text-red-800"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-3 space-y-2 px-4 pb-2">
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

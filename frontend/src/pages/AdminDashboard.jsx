import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { BarChart3, Users, MapPin, DollarSign, Trash2, Calendar, LayoutDashboard } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentItineraries, setRecentItineraries] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/admin/analytics');
                setStats(res.data.data.stats);
                setRecentItineraries(res.data.data.recentItineraries);

                const bookingsRes = await api.get('/bookings/all');
                setBookings(bookingsRes.data.data);
            } catch (err) {
                setError('Failed to load data: ' + (err.response?.data?.error || err.message));
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === 'admin') {
            fetchAnalytics();
        }
    }, [user]);

    const handleDeleteItinerary = async (id) => {
        if (!window.confirm("Are you sure you want to delete this trip for moderation purposes?")) return;

        try {
            await api.delete(`/itineraries/${id}`);
            // Refresh list
            setRecentItineraries(prev => prev.filter(i => i._id !== id));
            setStats(prev => ({ ...prev, itineraries: Math.max(0, prev.itineraries - 1) }));
        } catch (err) {
            alert('Failed to delete itinerary');
        }
    };

    const handleDeleteBooking = async (id) => {
        if (!window.confirm("Are you sure you want to cancel and delete this booking?")) return;
        try {
            await api.delete(`/bookings/${id}`);
            setBookings(prev => prev.filter(b => b._id !== id));
            setStats(prev => ({
                ...prev,
                bookings: Math.max(0, prev.bookings - 1),
                revenue: Math.max(0, prev.revenue - (bookings.find(b => b._id === id)?.cost || 0))
            }));
        } catch (err) {
            alert('Failed to delete booking');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Admin Dashboard...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
    if (!user || user.role !== 'admin') return <div className="p-10 text-center text-red-500">Access Denied</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <Link to="/admin/add-destination" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center">
                    + Add Destination
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                                    <dd className="text-3xl font-semibold text-gray-900">{stats?.users || 0}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                <MapPin className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Itineraries</dt>
                                    <dd className="text-3xl font-semibold text-gray-900">{stats?.itineraries || 0}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                                <BarChart3 className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Destinations</dt>
                                    <dd className="text-3xl font-semibold text-gray-900">{stats?.destinations || 0}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                                <DollarSign className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Revenue (Simulated)</dt>
                                    <dd className="text-3xl font-semibold text-gray-900">${stats?.revenue || 0}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                <LayoutDashboard className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">AI Usage Cost</dt>
                                    <dd className="text-3xl font-semibold text-gray-900">${stats?.aiUsage?.totalCost?.toFixed(4) || '0.0000'}</dd>
                                    <dt className="text-xs text-gray-400">Tokens: {stats?.aiUsage?.totalTokens || 0}</dt>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            {/* Recent Itineraries */}
            <div className="bg-white shadow rounded-lg mb-10">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Itineraries</h3>
                </div>
                {/* ... existing itinerary list items ... */}
                <ul className="divide-y divide-gray-200">
                    {recentItineraries.map((itinerary) => (
                        <li key={itinerary._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-blue-600 truncate">
                                    {itinerary.destination}
                                </div>
                                <div className="ml-2 flex-shrink-0 flex">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${itinerary.aiGenerated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {itinerary.aiGenerated ? 'AI Generated' : 'Manual'}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                    <p className="flex items-center text-sm text-gray-500">
                                        User: {itinerary.user?.email || 'Unknown'}
                                    </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                    <p>
                                        Created on <time dateTime={itinerary.createdAt}>{new Date(itinerary.createdAt).toLocaleDateString()}</time>
                                    </p>
                                </div>
                                <div className="mt-2 text-right">
                                    <button
                                        onClick={() => handleDeleteItinerary(itinerary._id)}
                                        className="text-red-600 hover:text-red-900 text-sm font-medium flex items-center float-right"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                    {recentItineraries.length === 0 && (
                        <li className="px-4 py-4 text-center text-gray-500">No itineraries found.</li>
                    )}
                </ul>
            </div>

            {/* All Bookings */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">All Bookings</h3>
                </div>
                <ul className="divide-y divide-gray-200">
                    {bookings.map((booking) => (
                        <li key={booking._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-purple-600 truncate">
                                    {booking.activity}
                                </div>
                                <div className="ml-2 flex-shrink-0 flex">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {booking.status}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                    <p className="flex items-center text-sm text-gray-500 mr-6">
                                        User: {booking.user?.name || booking.user?.email || 'Unknown'} ({booking.user?.email})
                                    </p>
                                    <p className="flex items-center text-sm text-gray-500 mr-6">
                                        <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                        {booking.itinerary?.destination || 'Unknown Destination'}
                                    </p>
                                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                        {new Date(booking.date).toLocaleDateString()}
                                    </p>
                                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                        <DollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                        {booking.cost}
                                    </p>
                                </div>
                                <div className="mt-2 text-right">
                                    <button
                                        onClick={() => handleDeleteBooking(booking._id)}
                                        className="text-red-600 hover:text-red-900 text-sm font-medium flex items-center float-right"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                    {bookings.length === 0 && (
                        <li className="px-4 py-4 text-center text-gray-500">No bookings found.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;

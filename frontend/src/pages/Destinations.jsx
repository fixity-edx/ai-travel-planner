import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Search, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Destinations = () => {
    const { user } = useAuth();
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await api.get('/destinations');
                setDestinations(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    const filteredDestinations = destinations.filter(dest =>
        dest.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this destination?")) return;
        try {
            await api.delete(`/destinations/${id}`);
            setDestinations(prev => prev.filter(d => d._id !== id));
        } catch (err) {
            alert('Failed to delete destination');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Popular Destinations</h1>

            <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-300 focus:shadow-outline-blue sm:text-sm transition duration-150 ease-in-out"
                    placeholder="Search destinations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-20">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDestinations.map(destination => (
                        <div key={destination._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <img
                                src={destination.images[0] || `https://source.unsplash.com/800x600/?${destination.name}`}
                                alt={destination.name}
                                className="w-full h-48 object-cover"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80' }}
                            />
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{destination.name}</h3>
                                    <div className="flex flex-col items-end">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded mb-1">
                                            {destination.category}
                                        </span>
                                        {user && user.role === 'admin' && (
                                            <button
                                                onClick={() => handleDelete(destination._id)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Delete Destination"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{destination.description}</p>
                                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                    <span>Avg Budget: ${destination.averageBudget}/day</span>
                                    <span>Best Time: {destination.bestTimeToVisit}</span>
                                </div>
                                <Link
                                    to={`/create-trip?destination=${destination.name}`}
                                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-300"
                                >
                                    Plan a Trip Here
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Destinations;

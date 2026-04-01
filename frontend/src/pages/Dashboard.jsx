import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';

const Dashboard = () => {
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItineraries = async () => {
            try {
                const res = await api.get('/itineraries');
                setItineraries(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchItineraries();
    }, []);

    if (loading) {
        return <div className="flex justify-center py-20">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Your Trips</h1>
                <Link to="/create-trip" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium">
                    + New Trip
                </Link>
            </div>

            {itineraries.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <h3 className="text-lg font-medium text-gray-900">No trips yet</h3>
                    <p className="mt-1 text-gray-500">Get started by creating your first itinerary.</p>
                    <div className="mt-6">
                        <Link to="/create-trip" className="text-blue-600 hover:text-blue-500 font-medium">
                            Create a new trip &rarr;
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {itineraries.map((itinerary) => (
                        <Link key={itinerary._id} to={`/trips/${itinerary._id}`} className="block hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden bg-white border border-gray-200">
                            <div className="h-48 bg-gray-200 relative">
                                <img
                                    src={`https://source.unsplash.com/800x600/?${itinerary.destination}`}
                                    alt={itinerary.destination}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80' }}
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-700">
                                    {itinerary.duration} Days
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {itinerary.destination}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{itinerary.destination} Adventure</h3>
                                <div className="flex items-center text-sm text-gray-500 mb-4">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
                                </div>
                                <div className="flex justify-between items-center border-t pt-4">
                                    <span className="text-sm font-medium text-gray-900">Budget: ${itinerary.budget}</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${itinerary.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                            itinerary.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {itinerary.status}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;

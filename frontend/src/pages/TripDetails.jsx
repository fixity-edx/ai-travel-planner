import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Calendar, MapPin, DollarSign, Clock } from 'lucide-react';
import ActivityItem from '../components/ActivityItem';

const TripDetails = () => {
    const { id } = useParams();
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItinerary = async () => {
            try {
                const res = await api.get(`/itineraries/${id}`);
                setItinerary(res.data.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load itinerary');
            } finally {
                setLoading(false);
            }
        };

        fetchItinerary();
    }, [id]);

    const handleBook = async (activity, dayIndex) => {
        try {
            // Calculate date based on start date + day index
            const date = new Date(new Date(itinerary.startDate).getTime() + (dayIndex * 24 * 60 * 60 * 1000));

            await api.post('/bookings', {
                itineraryId: itinerary._id,
                activity: activity.activity,
                date: date,
                cost: activity.cost || 0
            });
            alert('Activity booked successfully!');
        } catch (err) {
            alert('Failed to book activity: ' + (err.response?.data?.error || err.message));
        }
    };

    if (loading) return <div className="flex justify-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="relative h-64 bg-gray-200">
                    <img
                        src={`https://source.unsplash.com/1600x900/?${itinerary.destination}`}
                        alt={itinerary.destination}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1600&q=80' }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <div className="text-center text-white">
                            <h1 className="text-4xl font-bold">{itinerary.destination}</h1>
                            <p className="mt-2 text-xl font-medium">
                                {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex flex-wrap gap-4 mb-8">
                        <div className="flex items-center text-gray-700">
                            <Clock className="w-5 h-5 mr-2" />
                            <span className="font-semibold">{itinerary.duration} Days</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <DollarSign className="w-5 h-5 mr-2" />
                            <span className="font-semibold">${itinerary.budget} Budget</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${itinerary.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                itinerary.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                {itinerary.status}
                            </span>
                        </div>
                    </div>

                    {itinerary.summary && (
                        <div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Trip Summary</h3>
                            <p className="text-gray-700 mb-4">{itinerary.summary}</p>

                            {itinerary.weather && (
                                <div className="mb-4">
                                    <h4 className="font-semibold text-gray-900">Weather Forecast</h4>
                                    <p className="text-gray-600">{itinerary.weather}</p>
                                </div>
                            )}

                            {itinerary.packingTips && itinerary.packingTips.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Packing Tips</h4>
                                    <ul className="list-disc list-inside text-gray-600 pl-2">
                                        {itinerary.packingTips.map((tip, idx) => (
                                            <li key={idx}>{tip}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-8">
                        {itinerary.days.map((day) => (
                            <div key={day.day} className="border-l-4 border-blue-500 pl-6 pb-2">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Day {day.day}</h3>
                                <div className="space-y-6">
                                    {day.activities.map((activity, index) => (
                                        <ActivityItem
                                            key={index}
                                            activity={activity}
                                            dayIndex={day.day - 1}
                                            onBook={handleBook}
                                            destination={itinerary.destination}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripDetails;

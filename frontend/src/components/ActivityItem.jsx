import { useState } from 'react';
import { MapPin, DollarSign, Info, Loader2 } from 'lucide-react';
import api from '../services/api';

const ActivityItem = ({ activity, dayIndex, onBook, destination }) => {
    const [summary, setSummary] = useState(null);
    const [loadingSummary, setLoadingSummary] = useState(false);

    const handleSummarize = async () => {
        if (summary) return; // Already loaded

        setLoadingSummary(true);
        try {
            const res = await api.post('/itineraries/summarize', {
                attraction: activity.activity,
                destination: destination
            });
            setSummary(res.data.data);
        } catch (err) {
            console.error(err);
            setSummary("Failed to load summary.");
        } finally {
            setLoadingSummary(false);
        }
    };

    return (
        <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-gray-900">{activity.activity}</h4>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">{activity.time}</span>
            </div>
            <p className="text-gray-600 mb-3">{activity.description}</p>

            <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
                <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {activity.location}
                </div>
                <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {activity.cost}
                </div>
            </div>

            {summary && (
                <div className="mb-3 p-3 bg-blue-50 text-sm text-gray-700 rounded-md border border-blue-100 italic">
                    <p><strong>AI Summary:</strong> {summary}</p>
                </div>
            )}

            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end space-x-3">
                <button
                    onClick={handleSummarize}
                    disabled={loadingSummary}
                    className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors flex items-center"
                >
                    {loadingSummary ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Info className="w-4 h-4 mr-1" />}
                    {loadingSummary ? 'Loading...' : (summary ? 'Refresh Info' : 'Get Stats')}
                </button>
                <button
                    onClick={() => onBook(activity, dayIndex)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                    Book Activity →
                </button>
            </div>
        </div>
    );
};

export default ActivityItem;

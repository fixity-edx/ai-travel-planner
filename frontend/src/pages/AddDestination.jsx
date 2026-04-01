import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';

const AddDestination = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        category: 'City',
        averageBudget: '',
        bestTimeToVisit: '',
        imageUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/destinations', {
                ...formData,
                images: [formData.imageUrl]
            });
            navigate('/destinations');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add destination');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8">Add New Destination</h1>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow rounded-lg">
                <Input
                    label="Destination Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Location (Country/Region)"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                />
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            name="category"
                            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="City">City</option>
                            <option value="Beach">Beach</option>
                            <option value="Mountain">Mountain</option>
                            <option value="Nature">Nature</option>
                            <option value="Historical">Historical</option>
                            <option value="Adventure">Adventure</option>
                        </select>
                    </div>
                    <Input
                        label="Avg Budget ($/day)"
                        name="averageBudget"
                        type="number"
                        value={formData.averageBudget}
                        onChange={handleChange}
                        required
                    />
                </div>
                <Input
                    label="Best Time to Visit"
                    name="bestTimeToVisit"
                    placeholder="e.g., June - August"
                    value={formData.bestTimeToVisit}
                    onChange={handleChange}
                />
                <Input
                    label="Image URL"
                    name="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    value={formData.imageUrl}
                    onChange={handleChange}
                />

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Adding...' : 'Add Destination'}
                </Button>
            </form>
        </div>
    );
};

export default AddDestination;

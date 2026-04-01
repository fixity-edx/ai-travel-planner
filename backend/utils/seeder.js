const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Destination = require('../models/Destination');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const destinations = [
    {
        name: "Paris",
        description: "The city of light, famous for its culture, art, and romantic atmosphere.",
        location: "France",
        category: "City",
        averageBudget: 150,
        bestTimeToVisit: "April to June",
        popularAttractions: [
            { name: "Eiffel Tower", description: "Iconic iron lattice tower on the Champ de Mars." },
            { name: "Louvre Museum", description: "World's largest art museum and a historic monument." }
        ],
        images: ["https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=60"]
    },
    {
        name: "Bali",
        description: "Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.",
        location: "Indonesia",
        category: "Beach",
        averageBudget: 50,
        bestTimeToVisit: "April to October",
        popularAttractions: [
            { name: "Uluwatu Temple", description: "Balinese Hindu sea temple located in Uluwatu." },
            { name: "Tegallalang Rice Terrace", description: "Famous for its beautiful scenes of rice paddies." }
        ],
        images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=60"]
    }
];

// Import into DB
const importData = async () => {
    try {
        await User.deleteMany();
        await Destination.deleteMany();

        // Create Admin User
        await User.create({
            name: 'Admin User',
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: 'admin'
        });

        await Destination.create(destinations);

        console.log('Data Imported...');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

// Delete data
const deleteData = async () => {
    try {
        await User.deleteMany();
        await Destination.deleteMany();
        console.log('Data Destroyed...');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}

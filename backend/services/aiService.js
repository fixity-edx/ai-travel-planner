const axios = require('axios');

exports.generateAIItinerary = async (destination, duration, budget, preferences) => {
    try {
        const prompt = `Generate a detailed ${duration}-day travel itinerary for ${destination} with a total budget of $${budget}. 
    Preferences: ${preferences.join(', ')}. 
    IMPORTANT: Provide specific weather forecasts for the travel dates (assume upcoming season if dates not specified) and ensure daily activities are appropriate for that weather (e.g., indoor activities for rainy days).
    Please format the response as a JSON object with:
    1. "summary": A brief overview of the trip.
    2. "weather": Expected weather conditions for the trip and how it influenced the plan.
    3. "packingTips": List of items to pack based on weather and activities.
    4. "days": An array where each day has a "day" number and an "activities" array. 
    Each activity should have "time", "activity", "location", "description", and "cost".
    Make it realistic and optimized for time and budget.`;

        const response = await axios.post(
            process.env.GROK_ENDPOINT,
            {
                model: process.env.GROK_MODEL,
                messages: [
                    { role: "system", content: "You are a smart travel assistant. Respond only with valid JSON." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
                response_format: { type: "json_object" }
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return JSON.parse(response.data.choices[0].message.content);
    } catch (err) {
        console.error('AI Generation Error:', err.response?.data || err.message);
        throw new Error('Failed to generate AI itinerary');
    }
};

exports.summarizeAttraction = async (attractionName, destination) => {
    try {
        const prompt = `Provide a brief, engaging 2-3 sentence summary of the attraction "${attractionName}" in ${destination}.`;

        const response = await axios.post(
            process.env.GROK_ENDPOINT,
            {
                model: process.env.GROK_MODEL,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.5
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.choices[0].message.content.trim();
    } catch (err) {
        console.error('AI Summarization Error:', err.response?.data || err.message);
        throw new Error('Failed to summarize attraction');
    }
};

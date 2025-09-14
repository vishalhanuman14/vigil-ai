require('dotenv').config({ path: require('path').resolve(__dirname, '..', '..', '.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

async function generateMonitoringContext(userGoal) {
    const prompt = `Based on the user's monitoring goal: "${userGoal}", create a concise, comma-separated list of potential dangers or important events to watch for. This list will be used as context for an AI. For example, for "monitor my baby", a good list would be: "crying, falling, struggling to breathe, stranger in room, blanket over face". Just output the list. MAXIMUM OF 10`;

    try {
        const result = await fetch("http://localhost:3001/api/v1/workspace/vigil-safety-monitor/chat", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${process.env.API_KEY}`
            },
            body: JSON.stringify({
                message: prompt,
                mode: "chat",
                attachments: [],
                reset: true
            })
        });

        const text = await result.json();
        const jsonResponse = JSON.parse(text.textResponse);

        console.log("Parsed response:", jsonResponse.alert, jsonResponse.message);

        return jsonResponse;
    } catch (error) {
        console.error("Error parsing AI monitoring context:", error);
        return { alert: false, message: "Could not get AI monitoring context." };
    }
}

async function decideOnAlert(context, activities) {


    try {
        const result = await fetch("http://localhost:3001/api/v1/workspace/vigil-safety-monitor/chat", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${process.env.API_KEY}`
            },
            body: JSON.stringify({
                "message": `situation: ${context} activities: ${activities}`,
                "mode": "chat",
                "attachments": [],
                "reset": true
            })
        });
        const text = await result.json();
        const jsonResponse = JSON.parse(text.textResponse);
        console.log("Parsed response:", jsonResponse.alert, jsonResponse.message);
        // Clean and parse the JSON response
        // const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return jsonResponse;
    } catch (error) {
        console.error("Error parsing Gemini's decision response:", error);
        return { alert: false, message: "Could not get AI decision." };
    }
}

module.exports = { generateMonitoringContext, decideOnAlert };
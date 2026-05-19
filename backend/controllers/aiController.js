const axios = require('axios');
const Complaint = require('../models/Complaint');

exports.analyzeComplaint = async (req, res) => {
    try {
        const { complaintId } = req.body;
        
        const complaint = await Complaint.findById(complaintId);
        if (!complaint) {
            return res.status(404).json({ success: false, error: 'Complaint not found' });
        }

        const prompt = `Analyze the following complaint and provide:
        1. Urgency/Priority (Low, Medium, High, Critical)
        2. Responsible Department (e.g., Water Department, Sanitation, IT, HR, Maintenance)
        3. A brief summary (1-2 sentences)
        4. An automatic professional response message acknowledging the issue.
        
        Complaint Title: ${complaint.title}
        Complaint Description: ${complaint.description}
        Category: ${complaint.category}
        Location: ${complaint.location}
        
        Format the output in JSON exactly like this:
        {
            "priority": "High",
            "department": "Water Department",
            "summary": "...",
            "response": "..."
        }`;

        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: "google/gemini-2.5-flash",
            max_tokens: 800,
            messages: [{ role: "user", content: prompt }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const content = response.data.choices[0].message.content;
        
        // Try to parse JSON from the response
        let aiResult;
        try {
            // Find JSON block if it's wrapped in markdown
            const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/{[\s\S]*}/);
            const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
            aiResult = JSON.parse(jsonStr);
        } catch (e) {
            console.error("Failed to parse AI response as JSON", e);
            return res.status(500).json({ success: false, error: 'AI response parsing failed' });
        }

        // Update complaint with AI data
        complaint.priority = aiResult.priority;
        complaint.department = aiResult.department;
        complaint.aiSummary = aiResult.summary;
        complaint.aiResponse = aiResult.response;
        
        await complaint.save();

        res.status(200).json({ success: true, data: complaint });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, error: 'AI analysis failed' });
    }
};

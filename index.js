const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '/custom/path/.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3001;


const allowedOrigins = ['https://ai-summerizer-5vgx.vercel.app/', 'http://localhost:5173']; // Add your frontend URL here

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // Allow requests from the defined origin and non-browser requests (like Postman)
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
// CORS middleware
app.use(cors(corsOptions));
app.use(express.json());

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// API Endpoint to generate summary
app.post('/api/summarize', async (req, res) => {
    try {
        const { transcript, prompt } = req.body;

        if (!transcript || !prompt) {
            return res.status(400).json({ error: 'Transcript and prompt are required.' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const fullPrompt = `${prompt}:\n\n${transcript}`;
        
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const summary = response.text();

        res.json({ summary });
    } catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).json({ error: 'Failed to generate summary.' });
    }
});

// API Endpoint to share summary via email
app.post('/api/share', async (req, res) => {
    const { summary, recipients } = req.body;

    if (!summary || !recipients || recipients.length === 0) {
        return res.status(400).json({ error: 'Summary and at least one recipient are required.' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, // Use a Gmail App Password here
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipients.join(','),
        subject: 'Your Meeting Summary',
        html: summary, // Send as HTML to preserve rich-text formatting
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Summary sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
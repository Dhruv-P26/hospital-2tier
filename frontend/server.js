const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Proxy GET endpoints to backend container
app.get('/api/appointments', async (req, res) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/appointments`);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Backend service unreachable" });
    }
});

app.get('/api/stats', async (req, res) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/stats`);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Backend service unreachable" });
    }
});

// Proxy POST endpoints to backend container
app.post('/api/appointments', async (req, res) => {
    try {
        const response = await fetch(`${BACKEND_URL}/api/appointments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Backend service unreachable" });
    }
});

app.listen(PORT, () => console.log(`Frontend running on port ${PORT}`));
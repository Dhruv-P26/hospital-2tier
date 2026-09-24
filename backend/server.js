const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbFile = path.join(__dirname, 'hospital.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) console.error('Database connection error:', err.message);
    else {
        console.log('Connected to SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patientName TEXT NOT NULL,
            doctor TEXT NOT NULL,
            department TEXT NOT NULL,
            date TEXT NOT NULL,
            status TEXT DEFAULT 'Confirmed'
        )`);
    }
});

// API Endpoint: Get all appointments
app.get('/api/appointments', (req, res) => {
    db.all(`SELECT * FROM appointments ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ appointments: rows });
    });
});

// API Endpoint: Create a new appointment
app.post('/api/appointments', (req, res) => {
    const { patientName, doctor, department, date } = req.body;
    if (!patientName || !doctor || !department || !date) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    const query = `INSERT INTO appointments (patientName, doctor, department, date) VALUES (?, ?, ?, ?)`;
    db.run(query, [patientName, doctor, department, date], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, patientName, doctor, department, date, status: 'Confirmed' });
    });
});

// API Endpoint: Hospital Stats overview
app.get('/api/stats', (req, res) => {
    db.get(`SELECT COUNT(*) as count FROM appointments`, [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ totalAppointments: row.count, activeDoctors: 14, availableRooms: 42 });
    });
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Measurement = require('./models/measurement');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = "mongodb://localhost:27017/anal-plat";

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.connect(MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

function validateField(field) {
    return ['temperature', 'wind_speed', 'visibility'].includes(field);
}

function isValidDateInRange(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;

    const startRange = new Date('2024-01-01');
    const endRange = new Date('2024-12-28');
    return date >= startRange && date <= endRange;
}

app.get('/api/measurements', async (req, res) => {
    const { start_date, end_date, field } = req.query;

    if (field && !validateField(field)) {
        return res.status(400).json({ message: 'Invalid field. Please choose one of: temperature, wind_speed, visibility' });
    }

    if ((start_date && isNaN(Date.parse(start_date))) || (end_date && isNaN(Date.parse(end_date)))) {
        return res.status(400).json({ message: 'Invalid date format' });
    }

    if ((start_date && !isValidDateInRange(start_date)) || (end_date && !isValidDateInRange(end_date))) {
        return res.status(400).json({ message: 'Date must be within the range of 2024-01-01 and 2024-12-28' });
    }

    try {
        const query = {};
        if (start_date && end_date) {
            query.timestamp = { $gte: new Date(start_date), $lte: new Date(end_date) };
        }

        const measurements = await Measurement.find(query).select(field ? { timestamp: 1, [field]: 1 } : {});

        if (measurements.length === 0) {
            return res.status(404).json({ message: 'No data for the specified range' });
        }

        res.json(measurements);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving data', error });
    }
});

app.get('/api/measurements/metrics', async (req, res) => {
    const { field } = req.query;

    if (!validateField(field)) {
        return res.status(400).json({ message: 'Invalid field. Please choose one of: temperature, wind_speed, visibility' });
    }

    try {
        const metrics = await Measurement.aggregate([
            {
                $group: {
                    _id: null,
                    average: { $avg: `$${field}` },
                    min: { $min: `$${field}` },
                    max: { $max: `$${field}` },
                    stdDev: { $stdDevPop: `$${field}` }
                }
            }
        ]);

        if (metrics.length === 0) {
            return res.status(404).json({ message: 'No data to calculate metrics' });
        }

        res.json(metrics[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving metrics', error });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

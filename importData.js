const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Measurement = require('./models/measurement');

async function importData(filePath) {
    try {
        await mongoose.connect('mongodb://localhost:27017/anal-plat');

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', async (row) => {
                const timestamp = new Date(`${row.Date}T${row.Time}:00Z`);
                const wind_speed = parseFloat(row.Wind_Speed_knots);
                const temperature = parseFloat(row.Temperature_Celsius);
                const visibility = parseFloat(row.Visibility_km);

                if (!isNaN(temperature) && !isNaN(wind_speed) && !isNaN(visibility)) {
                    const data = {
                        timestamp: timestamp,
                        temperature: temperature,
                        wind_speed: wind_speed,
                        visibility: visibility,
                    };

                    try {
                        await Measurement.create(data);
                        console.log('Data saved successfully:', data);
                    } catch (error) {
                        console.error('Error saving data to MongoDB:', error.message);
                    }
                } else {
                    console.error('Invalid data:', row);
                }
            })
            .on('end', () => {
                console.log('Data imported successfully');
                setTimeout(() => {
                    mongoose.disconnect();
                    console.log('Connection to MongoDB closed');
                }, 30000);
            })
            .on('error', (error) => {
                console.error('Error reading CSV file:', error);
            });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

importData('C:/Users/AdelS/Downloads/archive/flight_data.csv').catch(error => console.error(error));

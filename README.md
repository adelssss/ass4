# Analytical Platform 
# Description
This analytical platform enables users to retrieve, analyze, and visualize time-series data stored in a MongoDB database. Users can select specific data fields to visualize and access various visualization types (such as line and bar charts). The platform provides a flexible interface for data exploration, allowing users to specify custom time ranges and data fields for analysis.

# Features
Backend built using Node.js and Express.js for interacting with a MongoDB database.
Data visualization on the frontend with Chart.js, allowing users to select fields and time ranges for analysis.
Basic statistical summaries, including average, minimum, maximum, and standard deviation for selected data fields.
Error handling and input validation for robust functionality.
# Technologies Used
Node.js
Express.js
MongoDB (with Mongoose)
Chart.js
javascript
html/css

# Requirements
Backend (Node.js/Express)
-Install Node.js, MongoDB, and Express.js.
-Create MongoDB schema in the measurements collection, supporting:
timestamp (Date): Date and time of the measurement.
field1, field2, field3 (Number): Customizable numerical fields.
-Fetch time-series data with filters by date range and field.
-Retrieve metrics for a field (average, min, max, standard deviation).

Frontend
-Create user interface to input time range and field, generating time-series graphs.
-Install Chart.js library for visualization.

# Data sources
-Kaggle for finding dataset.

# Installation
Steps to Set Up:
1.Initialize project.
2.Install npm packages: npm init -y npm i mongoose npm i body-parser.
3.Create folder structure: inside folder models/measurement.js, inside folder public create index.html, style.css and script.js, create file server.js, importData.js.
4.Configure MongoDB connection:MONGODB_URL=<your_mongo_uri>.
5.Import or add time-series data into your MongoDB database under a collection named measurements. The document structure should be as follows:
{
    "timestamp": "Date",
    "field1": "Number",
    "field2": "Number",
    "field3": "Number"
}
6.Start the server :npm start.
7.Import data using script into your code ,using Kaggle will help find needed dataset.
Analytical Platform will be available at:http://localhost:3000.

# API Endpoints
Fetch Measurements.
Endpoint: /api/measurements.
Method: GET.
Description: Fetch time-series data from the measurements collection.
Parameters:
field: The field to visualize (e.g., temperature, visibility, or wind_speed).
start_date: Start date for data filtering .
end_date: End date for data filtering .
GET /api/measurements?field=field1&start_date=2024-10-01&end_date=2024-10-20.
2. Fetch Metrics.
Endpoint: /api/measurements/metrics.
Method: GET.
Description: Fetch average, minimum, maximum, and standard deviation for the specified field.
Parameters:.
field: The field to analyze.
GET /api/measurements/metrics?field=field2.
# Error Handling & Validation
Invalid fields and date formats are handled and logged to the console.
Nonexistent data within the specified range displays a message.
# Testing 
-You can manually test the API using Postman.

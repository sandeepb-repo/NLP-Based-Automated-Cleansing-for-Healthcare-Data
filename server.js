const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const app = express();
const port = 3000; // Local server on port 3000

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Sample metrics and prediction data (still hardcoded)
const metrics = {
  qualityMetric: 'High',
  predictions: [50, 30, 20], // Percentages for Normal, Inconclusive, and Abnormal test results
};

// Function to load CSV data
function loadHealthcareDataFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        data.push(row);  // Push each row of the CSV into the array
      })
      .on('end', () => {
        resolve(data);  // Resolve the promise with the data array
      })
      .on('error', (err) => {
        reject(err);  // Reject the promise on error
      });
  });
}

// Define the /api/metrics endpoint
app.get('/api/metrics', async (req, res) => {
  try {
    // Load healthcare data from CSV file
    const healthcareData = await loadHealthcareDataFromCSV(path.join(__dirname, 'cleaned_healthcare_dataset.csv'));

    // Send the healthcare data and metrics as JSON
    res.json({ ...metrics, data: healthcareData });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    res.status(500).json({ error: 'Error reading CSV file' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

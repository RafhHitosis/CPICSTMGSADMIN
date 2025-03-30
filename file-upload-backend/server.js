const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');

// Define the port number
const PORT = 3000;  // You can set this to any desired port

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint for testing the server
app.get('/', (req, res) => {
    res.send('Server is running and reachable!');
});

// Endpoint to list all files in the 'uploads' folder
app.get('/files', (req, res) => {
    fs.readdir('./uploads', (err, files) => {
        if (err) {
            res.status(500).send({ message: 'Unable to scan files.' });
        } else {
            res.status(200).send({ files: files });
        }
    });
});

// Start server
app.listen(3000, '0.0.0.0', () => {
  console.log('Server is running on http://0.0.0.0:3000');
});


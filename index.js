const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const ipAddress = "0.0.0.0";
const SHARED_FOLDER = path.join(__dirname, 'shared'); // Replace 'shared' with your actual folder

// Ensure shared folder exists
if (!fs.existsSync(SHARED_FOLDER)) {
    fs.mkdirSync(SHARED_FOLDER);
}

// Configure file upload storage
const storage = multer.diskStorage({
    destination: SHARED_FOLDER,
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// List files at root
app.get('/', (req, res) => {
    fs.readdir(SHARED_FOLDER, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to list files' });
        }
        res.json({ files });
    });
});

// Serve static files at root
app.use('/', express.static(SHARED_FOLDER));

// Upload files to shared folder
app.post('/', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ message: 'File uploaded successfully', filename: req.file.originalname });
});

app.listen(PORT, ipAddress, () => {
    console.log(`Server running on http://${ipAddress}:${PORT}`);
});

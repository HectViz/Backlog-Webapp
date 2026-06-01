const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MULTER CONFIG
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// FILTRO: png, jpg, jpeg, webp
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Formato de archivo no soportado. Sube una imagen con una extensión válida.'));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

app.use('/uploads', express.static(uploadsDir));

app.set('upload', upload);

// TEST ENDPOINT
app.get('/api/test', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({
      status: 'success',
      message: 'Servidor Express up.',
      dbTime: result.rows[0].now
    });
  } catch (err) {
    console.error('Error de conexión a Postgres:', err);
    res.status(500).json({
      status: 'error',
      message: 'Servidor up, pero la conexión a Postgres no funcionó.',
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor up: ${PORT}`);
  console.log(`Carpeta de subidas lista /uploads`);
});

module.exports = app;

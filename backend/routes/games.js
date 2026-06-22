const express = require('express');
const router = express.Router();
const db = require('../db');
const fs = require('fs');
const path = require('path');

const deletePhysicalImage = (coverPath) => {
  if (coverPath) {
    const absolutePath = path.join(__dirname, '..', coverPath);
    if (fs.existsSync(absolutePath)) {
      try {
        fs.unlinkSync(absolutePath);
        console.log(`Portada eliminada: ${absolutePath}`);
      } catch (err) {
        console.error(`No se pudo eliminar: ${absolutePath}:`, err);
      }
    }
  }
};

router.get('/', async (req, res) => {
  const { search, status, platformId, genreId, sortBy } = req.query;

  let queryText = `
    SELECT g.*, 
           p.name AS platform_name, p.manufacturer AS platform_manufacturer,
           gn.name AS genre_name
    FROM games g
    LEFT JOIN platforms p ON g.platform_id = p.id
    LEFT JOIN genres gn ON g.genre_id = gn.id
    WHERE 1=1
  `;
  const queryParams = [];
  let paramCount = 1;

  if (search && search.trim() !== '') {
    queryText += ` AND LOWER(g.title) LIKE LOWER($${paramCount})`;
    queryParams.push(`%${search.trim()}%`);
    paramCount++;
  }

  if (status && status.trim() !== '') {
    queryText += ` AND g.status = $${paramCount}`;
    queryParams.push(status.trim());
    paramCount++;
  }

  if (platformId) {
    queryText += ` AND g.platform_id = $${paramCount}`;
    queryParams.push(parseInt(platformId));
    paramCount++;
  }

  if (genreId) {
    queryText += ` AND g.genre_id = $${paramCount}`;
    queryParams.push(parseInt(genreId));
    paramCount++;
  }

  if (sortBy === 'title') {
    queryText += ` ORDER BY g.title ASC`;
  } else if (sortBy === 'priority_asc') {
    queryText += ` ORDER BY g.priority ASC, g.title ASC`;
  } else {
    // Por defecto: prioridad más alta primero
    queryText += ` ORDER BY g.priority DESC, g.title ASC`;
  }

  try {
    const result = await db.query(queryText, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener juegos:', err);
    res.status(500).json({ error: 'Error del servidor al obtener juegos.' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(`
      SELECT g.*, p.name AS platform_name, gn.name AS genre_name 
      FROM games g
      LEFT JOIN platforms p ON g.platform_id = p.id
      LEFT JOIN genres gn ON g.genre_id = gn.id
      WHERE g.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Juego no encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error al obtener juego ${id}:`, err);
    res.status(500).json({ error: 'Error del servidor al obtener juego.' });
  }
});

router.post('/', (req, res) => {
  const upload = req.app.get('upload');

  // multer
  upload.single('cover')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { title, platform_id, genre_id, status, priority, review } = req.body;

    if (!title || title.trim() === '') {
      // para no acumular basura
      if (req.file) deletePhysicalImage(`/uploads/${req.file.filename}`);
      return res.status(400).json({ error: 'Título es obligatorio.' });
    }

    const platformId = platform_id && platform_id !== '' ? parseInt(platform_id) : null;
    const genreId = genre_id && genre_id !== '' ? parseInt(genre_id) : null;

    const priorityVal = priority ? parseInt(priority) : 3;
    if (priorityVal < 1 || priorityVal > 5) {
      if (req.file) deletePhysicalImage(`/uploads/${req.file.filename}`);
      return res.status(400).json({ error: 'La prioridad debe ser un número entre 1 y 5.' });
    }

    const statusVal = status || 'En cola';
    if (!['En cola', 'Jugando', 'Completado'].includes(statusVal)) {
      if (req.file) deletePhysicalImage(`/uploads/${req.file.filename}`);
      return res.status(400).json({ error: 'El estado no es válido.' });
    }

    const coverPath = req.file ? `/uploads/${req.file.filename}` : null;

    try {

      const nameCheck = await db.query(
        'SELECT id FROM games WHERE LOWER(title) = LOWER($1)',
        [title.trim()]
      );

      if (nameCheck.rows.length > 0) {
        if (req.file) deletePhysicalImage(coverPath);
        return res.status(400).json({ error: 'Ya existe un juego registrado con este nombre.' });
      }

      if (platformId) {
        const platformCheck = await db.query('SELECT id FROM platforms WHERE id = $1', [platformId]);
        if (platformCheck.rows.length === 0) {
          if (req.file) deletePhysicalImage(coverPath);
          return res.status(400).json({ error: 'La plataforma seleccionada no existe.' });
        }
      }

      if (genreId) {
        const genreCheck = await db.query('SELECT id FROM genres WHERE id = $1', [genreId]);
        if (genreCheck.rows.length === 0) {
          if (req.file) deletePhysicalImage(coverPath);
          return res.status(400).json({ error: 'El género seleccionado no existe.' });
        }
      }

      const result = await db.query(`
        INSERT INTO games (title, platform_id, genre_id, status, priority, cover_path, review)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [title.trim(), platformId, genreId, statusVal, priorityVal, coverPath, review ? review.trim() : '']);

      res.status(201).json(result.rows[0]);
    } catch (dbErr) {
      console.error('Error al guardar juego:', dbErr);
      if (req.file) deletePhysicalImage(coverPath);
      res.status(500).json({ error: 'Error del servidor al crear juego.' });
    }
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const upload = req.app.get('upload');

  upload.single('cover')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { title, platform_id, genre_id, status, priority, review, remove_cover } = req.body;

    if (!title || title.trim() === '') {
      if (req.file) deletePhysicalImage(`/uploads/${req.file.filename}`);
      return res.status(400).json({ error: 'Título es obligatorio.' });
    }

    const platformId = platform_id && platform_id !== '' ? parseInt(platform_id) : null;
    const genreId = genre_id && genre_id !== '' ? parseInt(genre_id) : null;
    const priorityVal = priority ? parseInt(priority) : 3;
    if (priorityVal < 1 || priorityVal > 5) {
      if (req.file) deletePhysicalImage(`/uploads/${req.file.filename}`);
      return res.status(400).json({ error: 'La prioridad debe ser un número entre 1 y 5.' });
    }

    const statusVal = status || 'En cola';
    if (!['En cola', 'Jugando', 'Completado'].includes(statusVal)) {
      if (req.file) deletePhysicalImage(`/uploads/${req.file.filename}`);
      return res.status(400).json({ error: 'El estado no es válido.' });
    }

    try {
      const checkExist = await db.query('SELECT * FROM games WHERE id = $1', [id]);
      if (checkExist.rows.length === 0) {
        if (req.file) deletePhysicalImage(`/uploads/${req.file.filename}`);
        return res.status(404).json({ error: 'Juego no encontrado.' });
      }

      const existingGame = checkExist.rows[0];

      const nameCheck = await db.query(
        'SELECT id FROM games WHERE LOWER(title) = LOWER($1) AND id <> $2',
        [title.trim(), id]
      );

      if (nameCheck.rows.length > 0) {
        if (req.file) deletePhysicalImage(`/uploads/${req.file.filename}`);
        return res.status(400).json({ error: 'Ese juego ya existe.' });
      }

      if (platformId) {
        const platformCheck = await db.query('SELECT id FROM platforms WHERE id = $1', [platformId]);
        if (platformCheck.rows.length === 0) {
          if (req.file) deletePhysicalImage(`/uploads/${req.file.filename}`);
          return res.status(400).json({ error: 'La plataforma seleccionada no existe.' });
        }
      }

      if (genreId) {
        const genreCheck = await db.query('SELECT id FROM genres WHERE id = $1', [genreId]);
        if (genreCheck.rows.length === 0) {
          if (req.file) deletePhysicalImage(`/uploads/${req.file.filename}`);
          return res.status(400).json({ error: 'El género seleccionado no existe.' });
        }
      }

      let coverPath = existingGame.cover_path;

      if (req.file) {
        deletePhysicalImage(existingGame.cover_path);
        coverPath = `/uploads/${req.file.filename}`;
      } else if (remove_cover === 'true' || remove_cover === true) {
        deletePhysicalImage(existingGame.cover_path);
        coverPath = null;
      }

      const result = await db.query(`
        UPDATE games
        SET title = $1, platform_id = $2, genre_id = $3, status = $4, priority = $5, cover_path = $6, review = $7
        WHERE id = $8
        RETURNING *
      `, [title.trim(), platformId, genreId, statusVal, priorityVal, coverPath, review ? review.trim() : '', id]);

      res.json(result.rows[0]);
    } catch (dbErr) {
      console.error(`Error al actualizar juego ${id}:`, dbErr);
      if (req.file) deletePhysicalImage(`/uploads/${req.file.filename}`);
      res.status(500).json({ error: 'Error del servidor al actualizar juego.' });
    }
  });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('SELECT * FROM games WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Juego no encontrado.' });
    }

    const game = result.rows[0];

    await db.query('DELETE FROM games WHERE id = $1', [id]);

    deletePhysicalImage(game.cover_path);

    res.json({ message: 'Juego eliminado.' });
  } catch (err) {
    console.error(`Error al eliminar juego ${id}:`, err);
    res.status(500).json({ error: 'Error del servidor al eliminar juego.' });
  }
});

module.exports = router;

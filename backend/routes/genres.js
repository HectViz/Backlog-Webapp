const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los géneros
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM genres ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener géneros:', err);
    res.status(500).json({ error: 'Error del servidor al obtener géneros.' });
  }
});

// Obtener un género por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM genres WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Género no encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error al obtener género ${id}:`, err);
    res.status(500).json({ error: 'Error del servidor al obtener género.' });
  }
});

// Crear un nuevo género
router.post('/', async (req, res) => {
  const { name, description } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'El nombre es obligatorio.' });
  }

  try {
    const checkDuplicate = await db.query(
      'SELECT * FROM genres WHERE LOWER(name) = LOWER($1)',
      [name.trim()]
    );
    if (checkDuplicate.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe un género con ese nombre.' });
    }

    const result = await db.query(
      'INSERT INTO genres (name, description) VALUES ($1, $2) RETURNING *',
      [name.trim(), description ? description.trim() : '']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al registrar género:', err);
    res.status(500).json({ error: 'Error del servidor al crear género.' });
  }
});

// Actualizar un género
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'El nombre es obligatorio.' });
  }

  try {
    const checkExist = await db.query('SELECT * FROM genres WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: 'Género no encontrado.' });
    }

    const checkDuplicate = await db.query(
      'SELECT * FROM genres WHERE LOWER(name) = LOWER($1) AND id != $2',
      [name.trim(), id]
    );
    if (checkDuplicate.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe un género con ese nombre.' });
    }

    const result = await db.query(
      'UPDATE genres SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name.trim(), description ? description.trim() : '', id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error al actualizar género ${id}:`, err);
    res.status(500).json({ error: 'Error del servidor al actualizar género.' });
  }
});

// Eliminar un género
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const checkExist = await db.query('SELECT * FROM genres WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: 'Género no encontrado.' });
    }

    // Verificar si existen videojuegos asociados a este género
    const checkGames = await db.query('SELECT id FROM games WHERE genre_id = $1 LIMIT 1', [id]);
    if (checkGames.rows.length > 0) {
      return res.status(400).json({ error: 'No se puede eliminar el género porque tiene videojuegos asociados.' });
    }

    await db.query('DELETE FROM genres WHERE id = $1', [id]);
    res.json({ message: 'Género eliminado correctamente.' });
  } catch (err) {
    console.error(`Error al eliminar género ${id}:`, err);

    if (err.code === '23503') {
      return res.status(400).json({
        error: 'No se puede eliminar el género porque tiene videojuegos asociados.'
      });
    }
    res.status(500).json({ error: 'Error del servidor al eliminar género.' });
  }
});

module.exports = router;

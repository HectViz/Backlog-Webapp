const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM platforms ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener plataformas:', err);
    res.status(500).json({ error: 'Error del servidor al obtener plataformas.' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM platforms WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plataforma no encontrada.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error al obtener plataforma ${id}:`, err);
    res.status(500).json({ error: 'Error del servidor al obtener plataforma.' });
  }
});

router.post('/', async (req, res) => {
  const { name, manufacturer, description } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Nombre es obligatorio.' });
  }
  if (!manufacturer || manufacturer.trim() === '') {
    return res.status(400).json({ error: 'Fabricante es obligatorio.' });
  }

  try {
    const checkDuplicate = await db.query(
      'SELECT * FROM platforms WHERE LOWER(name) = LOWER($1)',
      [name.trim()]
    );
    if (checkDuplicate.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe una plataforma con ese nombre.' });
    }

    const result = await db.query(
      'INSERT INTO platforms (name, manufacturer, description) VALUES ($1, $2, $3) RETURNING *',
      [name.trim(), manufacturer.trim(), description ? description.trim() : '']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al registrar plataforma:', err);
    res.status(500).json({ error: 'Error del servidor al crear plataforma.' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, manufacturer, description } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Nombre es obligatorio.' });
  }
  if (!manufacturer || manufacturer.trim() === '') {
    return res.status(400).json({ error: 'Fabricante es obligatorio.' });
  }

  try {
    const checkExist = await db.query('SELECT * FROM platforms WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: 'Plataforma no encontrada.' });
    }
    const checkDuplicate = await db.query(
      'SELECT * FROM platforms WHERE LOWER(name) = LOWER($1) AND id != $2',
      [name.trim(), id]
    );
    if (checkDuplicate.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe una plataforma con ese nombre.' });
    }

    const result = await db.query(
      'UPDATE platforms SET name = $1, manufacturer = $2, description = $3 WHERE id = $4 RETURNING *',
      [name.trim(), manufacturer.trim(), description ? description.trim() : '', id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error al actualizar plataforma ${id}:`, err);
    res.status(500).json({ error: 'Error del servidor al actualizar plataforma.' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const checkExist = await db.query('SELECT * FROM platforms WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: 'Plataforma no encontrada.' });
    }

    const checkGames = await db.query('SELECT id FROM games WHERE platform_id = $1 LIMIT 1', [id]);
    if (checkGames.rows.length > 0) {
      return res.status(400).json({ error: 'No se puede eliminar la plataforma porque tiene videojuegos asociados.' });
    }

    await db.query('DELETE FROM platforms WHERE id = $1', [id]);
    res.json({ message: 'Plataforma eliminada correctamente.' });
  } catch (err) {
    console.error(`Error al eliminar plataforma ${id}:`, err);

    if (err.code === '23503') {
      return res.status(400).json({
        error: 'No se puede eliminar la plataforma porque tiene videojuegos asociados.'
      });
    }
    res.status(500).json({ error: 'Error del servidor al eliminar plataforma.' });
  }
});

module.exports = router;

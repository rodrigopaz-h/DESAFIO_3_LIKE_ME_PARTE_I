const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { pool, createTable, insertPost } = require('./db/config');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Crea la tabla al iniciar el servidor
createTable();

app.get('/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener posts' });
    }
});

app.post('/posts', async (req, res) => {
    const { titulo, url, descripcion } = req.body;
    try {
        await insertPost(titulo, url, descripcion);
        res.status(201).json({ message: 'Post creado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el post' });
    }
});

app.listen(3000, () => {
    console.log('Servidor ejecutándose en http://localhost:3000');
});

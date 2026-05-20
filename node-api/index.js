const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.NODE_PORT || 3000;

// Configuración de la conexión a la Base de Datos usando variables de entorno
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

app.get('/', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW()');
    res.json({ 
      estado: "Conectado exitosamente a PostgreSQL", 
      hora_servidor_db: dbRes.rows[0].now,
      mensaje: "Hola desde el nodo de aplicaciones administrado por el Kernel de Linux"
    });
  } catch (err) {
    res.status(500).json({ estado: "Error de conexión", error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Aplicación escuchando en el puerto ${port}`);
});

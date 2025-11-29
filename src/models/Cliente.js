import db from '../config/db.js';

const listar = async (q='') => {
  const [rows] = await db.query(
    `SELECT u.id_usuario, u.nombre, u.correo, u.telefono, u.estado
     FROM usuario u
     WHERE u.nombre LIKE ? OR u.correo LIKE ?
     ORDER BY u.nombre`,
    [`%${q}%`, `%${q}%`]
  );
  return rows;
};

const crear = async ({ nombre, correo, telefono }) => {
  // guarda usuario y asigna rol cliente en usuario_rol
  const [result] = await db.query(
    `INSERT INTO usuario (nombre, correo, contrasena, telefono) VALUES (?, ?, ?, ?)`,
    [nombre, correo, '123456', telefono]
  );
  const id = result.insertId;
  // suponer rol cliente = 1 o buscarlo dinámicamente si quieres
  await db.query(`INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (?, ?)`, [id, 1]);
  return id;
};

const obtenerPorId = async (id) => {
  const [rows] = await db.query(`SELECT * FROM usuario WHERE id_usuario = ?`, [id]);
  return rows[0];
};

const actualizar = async (id, { nombre, correo, telefono, estado }) => {
  await db.query(
    `UPDATE usuario SET nombre = ?, correo = ?, telefono = ?, estado = ? WHERE id_usuario = ?`,
    [nombre, correo, telefono, estado, id]
  );
};

const eliminar = async (id) => {
  await db.query(`DELETE FROM usuario WHERE id_usuario = ?`, [id]);
  // opcional: eliminar en usuario_rol etc.
};

export default { listar, crear, obtenerPorId, actualizar, eliminar };

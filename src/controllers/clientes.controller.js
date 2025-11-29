import db from "../config/db.js"; // ajusta la ruta si la tienes en otro sitio

// Mostrar listado de clientes
export const mostrarVistaClientes = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id_usuario, u.nombre, u.correo, u.telefono, u.fecha_registro, u.estado
       FROM usuario u
       JOIN usuario_rol ur ON ur.id_usuario = u.id_usuario
       JOIN rol r ON r.id_rol = ur.id_rol
       WHERE r.nombre_rol = 'cliente'`
    );

    res.render("clientes/index", { clientes: rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error obteniendo clientes");
  }
};

// Mostrar formulario crear
export const mostrarFormularioCrear = (req, res) => {
  res.render("clientes/crear");
};

// Crear cliente
export const crearCliente = async (req, res) => {
  try {
    const { nombre, correo, telefono, contrasena } = req.body;

    // Insert usuario
    const [result] = await db.query(
      `INSERT INTO usuario (nombre, correo, contrasena, telefono) VALUES (?, ?, ?, ?)`,
      [nombre, correo, contrasena || "123456", telefono]
    );
    const id_usuario = result.insertId;

    // Asignar rol cliente (asumimos id_rol = 1 para 'cliente'; si no, busca id con SELECT)
    // Mejor: buscar el id del rol 'cliente'
    const [role] = await db.query(`SELECT id_rol FROM rol WHERE nombre_rol = 'cliente' LIMIT 1`);
    let id_rol = role.length ? role[0].id_rol : 1;

    await db.query(`INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (?, ?)`, [id_usuario, id_rol]);

    res.redirect("/clientes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creando cliente");
  }
};

// Mostrar formulario editar
export const mostrarFormularioEditar = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`SELECT * FROM usuario WHERE id_usuario = ?`, [id]);
    if (!rows.length) return res.status(404).send("Cliente no encontrado");
    res.render("clientes/editar", { cliente: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error obteniendo datos del cliente");
  }
};

// Actualizar cliente
export const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, telefono, estado } = req.body;

    await db.query(
      `UPDATE usuario SET nombre = ?, correo = ?, telefono = ?, estado = ? WHERE id_usuario = ?`,
      [nombre, correo, telefono, estado, id]
    );

    res.redirect("/clientes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error actualizando cliente");
  }
};

// Eliminar cliente (o marcar como inactivo)
export const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    // Por seguridad, marcamos como inactivo en lugar de borrar
    await db.query(`UPDATE usuario SET estado = 'inactivo' WHERE id_usuario = ?`, [id]);
    res.redirect("/clientes");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error eliminando cliente");
  }
};

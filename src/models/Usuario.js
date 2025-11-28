import db from '../config/db.js';

class Usuario {
    static async findByEmail(email) {
        try {
            const query = 'SELECT * FROM usuario WHERE correo = ?';
            const [rows] = await db.query(query, [email]);
            
            if (rows.length > 0) {
                console.log('Usuario encontrado:', rows[0].nombre);
            }
            
            return rows[0] || null;
        } catch (error) {
            throw new Error("Error al buscar usuario: " + error.message);
        }
    }

    static async findById(id) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM usuario WHERE id_usuario = ?', 
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            throw new Error("Error al buscar usuario: " + error.message);
        }
    }

    static async create(data) {
        try {
            const { nombre, cedula, correo, contrasena, telefono, rol } = data;
            const [result] = await db.query(
                'INSERT INTO usuario (nombre, cedula, correo, contrasena, telefono, rol) VALUES (?, ?, ?, ?, ?, ?)',
                [nombre, cedula, correo, contrasena, telefono, rol || 1]
            );
            return result.insertId;
        } catch (error) {
            throw new Error("Error al crear usuario: " + error.message);
        }
    }

    static async findAll(filtros = {}) {
        try {
            let query = 'SELECT id_usuario, nombre, cedula, correo, telefono, rol, estado, fecha_registro FROM usuario WHERE 1=1';
            const params = [];

            if (filtros.rol) {
                query += ' AND rol = ?';
                params.push(filtros.rol);
            }

            if (filtros.estado) {
                query += ' AND estado = ?';
                params.push(filtros.estado);
            }

            if (filtros.busqueda) {
                query += ' AND (nombre LIKE ? OR correo LIKE ? OR cedula LIKE ?)';
                const searchTerm = `%${filtros.busqueda}%`;
                params.push(searchTerm, searchTerm, searchTerm);
            }

            query += ' ORDER BY fecha_registro DESC';

            const [rows] = await db.query(query, params);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener usuarios: ' + error.message);
        }
    }

    static async update(id, data) {
        try {
            const campos = [];
            const valores = [];

            if (data.nombre !== undefined) {
                campos.push('nombre = ?');
                valores.push(data.nombre);
            }
            if (data.cedula !== undefined) {
                campos.push('cedula = ?');
                valores.push(data.cedula);
            }
            if (data.correo !== undefined) {
                campos.push('correo = ?');
                valores.push(data.correo);
            }
            if (data.telefono !== undefined) {
                campos.push('telefono = ?');
                valores.push(data.telefono);
            }
            if (data.estado !== undefined) {
                campos.push('estado = ?');
                valores.push(data.estado);
            }

            if (campos.length === 0) {
                throw new Error('No hay campos para actualizar');
            }

            valores.push(id);

            const [result] = await db.query(
                `UPDATE usuario SET ${campos.join(', ')} WHERE id_usuario = ?`,
                valores
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw new Error('Error al actualizar usuario: ' + error.message);
        }
    }

    static async updatePassword(idUsuario, nuevaContrasena) {
        try {
            await db.query(
                'UPDATE usuario SET contrasena = ? WHERE id_usuario = ?',
                [nuevaContrasena, idUsuario]
            );
            return true;
        } catch (error) {
            throw new Error("Error al actualizar contraseña: " + error.message);
        }
    }

    static async cambiarEstado(id, estado) {
        try {
            const [result] = await db.query(
                'UPDATE usuario SET estado = ? WHERE id_usuario = ?',
                [estado, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error('Error al cambiar estado: ' + error.message);
        }
    }

    static async countDocuments(filtros = {}) {
        try {
            let query = 'SELECT COUNT(*) as total FROM usuario WHERE 1=1';
            const params = [];

            if (filtros.rol) {
                query += ' AND rol = ?';
                params.push(filtros.rol);
            }

            if (filtros.estado) {
                query += ' AND estado = ?';
                params.push(filtros.estado);
            }

            const [rows] = await db.query(query, params);
            return rows[0].total;
        } catch (error) {
            throw new Error('Error al contar usuarios: ' + error.message);
        }
    }

    static async findByCedula(cedula) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM usuario WHERE cedula = ?',
                [cedula]
            );
            return rows[0] || null;
        } catch (error) {
            throw new Error('Error al buscar usuario por cédula: ' + error.message);
        }
    }

    static async getConductoresActivos() {
        try {
            const [rows] = await db.query(
                'SELECT id_usuario, nombre, cedula, telefono FROM usuario WHERE rol = 3 AND estado = "activo"'
            );
            return rows;
        } catch (error) {
            throw new Error('Error al obtener conductores: ' + error.message);
        }
    }

    static async verificarDisponibilidad(idConductor, fecha) {
        try {
            const [rows] = await db.query(`
                SELECT COUNT(*) as viajes_activos
                FROM viaje
                WHERE id_conductor = ?
                AND fecha = ?
                AND estado IN ('programado', 'en_curso')
            `, [idConductor, fecha]);

            return rows[0].viajes_activos === 0;
        } catch (error) {
            throw new Error('Error al verificar disponibilidad: ' + error.message);
        }
    }
}

export default Usuario;
// models/User.js
import db from '../config/db.js';

class User {
    static async query(sql, params = []) {
        return await db.query(sql, params);
    }

    static async findByEmail(correo) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM usuario WHERE correo = ?',
                [correo]
            );
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error('Error al buscar usuario: ' + error.message);
        }
    }

    static async create(userData) {
        try {
            const { nombre, cedula, correo, contrasena, telefono, rol, estado } = userData;
            
            const [result] = await db.query(
                'INSERT INTO usuario (nombre, cedula, correo, contrasena, telefono, rol, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [nombre, cedula, correo, contrasena, telefono, rol || 1, estado || 'activo']
            );
            
            return result.insertId;
        } catch (error) {
            throw new Error('Error al crear usuario: ' + error.message);
        }
    }

    static async updatePassword(id, nuevaContrasena) {
        try {
            const [result] = await db.query(
                'UPDATE usuario SET contrasena = ? WHERE id_usuario = ?',
                [nuevaContrasena, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error('Error al actualizar contraseña: ' + error.message);
        }
    }
}

export default User;
import db from '../config/db.js';

class User {
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

    static async findById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM usuario WHERE id_usuario = ?', [id]);
            return rows[0] || null;
        } catch (error) {
            throw new Error("Error al buscar usuario: " + error.message);
        }
    }
}

export default User;
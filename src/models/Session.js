import db from '../config/db.js';

class Session {
    static async create(sessionData) {
        try {
            const [result] = await db.query(
                `INSERT INTO sesion (id_usuario, token, fecha_expiracion, ip_address, user_agent) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    sessionData.id_usuario,
                    sessionData.token,
                    sessionData.fecha_expiracion,
                    sessionData.ip_address,
                    sessionData.user_agent
                ]
            );
            return result.insertId;
        } catch (error) {
            throw new Error('Error al crear sesión: ' + error.message);
        }
    }

    static async findByToken(token) {
        try {
            const [rows] = await db.query(
                `SELECT * FROM sesion 
                 WHERE token = ? AND activa = TRUE AND fecha_expiracion > NOW()`,
                [token]
            );
            return rows[0] || null;
        } catch (error) {
            throw new Error('Error al buscar sesión: ' + error.message);
        }
    }

    static async invalidate(token) {
        try {
            const [result] = await db.query(
                `UPDATE sesion SET activa = FALSE WHERE token = ?`,
                [token]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error('Error al invalidar sesión: ' + error.message);
        }
    }

    static async findByUserId(userId) {
        try {
            const [rows] = await db.query(
                `SELECT * FROM sesion 
                 WHERE id_usuario = ? AND activa = TRUE AND fecha_expiracion > NOW()
                 ORDER BY fecha_expiracion DESC`,
                [userId]
            );
            return rows;
        } catch (error) {
            throw new Error('Error al buscar sesiones: ' + error.message);
        }
    }
}

export default Session;
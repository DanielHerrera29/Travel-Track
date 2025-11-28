import db from '../config/db.js';

class Costo {
    static async findAll(filtros = {}) {
        try {
            let query = `
                SELECT g.*, v.fecha, r.nombre as ruta_nombre
                FROM gasto_operativo g
                INNER JOIN viaje v ON g.id_viaje = v.id_viaje
                INNER JOIN ruta r ON v.id_ruta = r.id_ruta
                WHERE 1=1
            `;
            const params = [];

            if (filtros.id_viaje) {
                query += ' AND g.id_viaje = ?';
                params.push(filtros.id_viaje);
            }

            if (filtros.fechaInicio && filtros.fechaFin) {
                query += ' AND v.fecha BETWEEN ? AND ?';
                params.push(filtros.fechaInicio, filtros.fechaFin);
            }

            query += ' ORDER BY g.fecha DESC';

            const [rows] = await db.query(query, params);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener costos: ' + error.message);
        }
    }

    static async create(data) {
        try {
            const { id_viaje, descripcion, monto } = data;
            const [result] = await db.query(`
                INSERT INTO gasto_operativo (id_viaje, descripcion, monto)
                VALUES (?, ?, ?)
            `, [id_viaje, descripcion, monto]);

            return result.insertId;
        } catch (error) {
            throw new Error('Error al crear costo: ' + error.message);
        }
    }

    static async findById(id) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM gasto_operativo WHERE id_gasto = ?',
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            throw new Error('Error al buscar costo: ' + error.message);
        }
    }
}

export default Costo;
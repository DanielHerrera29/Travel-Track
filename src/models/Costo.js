import db from '../config/db.js';

class Costo {
    static async query(sql, params = []) {
        return await db.query(sql, params);
    }

    static async findAll(filtros = {}) {
        try {
            let query = `
                SELECT 
                    g.id_gasto,
                    g.id_viaje,
                    g.descripcion,
                    g.monto,
                    g.fecha,
                    v.fecha as fecha_viaje,
                    r.nombre as ruta_nombre,
                    u.nombre as conductor_nombre
                FROM gasto_operativo g
                INNER JOIN viaje v ON g.id_viaje = v.id_viaje
                INNER JOIN ruta r ON v.id_ruta = r.id_ruta
                LEFT JOIN usuario u ON v.id_conductor = u.id_usuario
                WHERE 1=1
            `;
            const params = [];

            if (filtros.id_viaje) {
                query += ' AND g.id_viaje = ?';
                params.push(filtros.id_viaje);
            }

            if (filtros.fechaInicio) {
                query += ' AND g.fecha >= ?';
                params.push(filtros.fechaInicio);
            }

            if (filtros.fechaFin) {
                query += ' AND g.fecha <= ?';
                params.push(filtros.fechaFin);
            }

            query += ' ORDER BY g.fecha DESC, g.id_gasto DESC';

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
                INSERT INTO gasto_operativo (id_viaje, descripcion, monto, fecha)
                VALUES (?, ?, ?, CURDATE())
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

    static async update(id, datos) {
        try {
            const fields = [];
            const values = [];

            if (datos.descripcion !== undefined) {
                fields.push('descripcion = ?');
                values.push(datos.descripcion);
            }
            if (datos.monto !== undefined) {
                fields.push('monto = ?');
                values.push(datos.monto);
            }

            if (fields.length === 0) {
                return false;
            }

            values.push(id);
            const query = `UPDATE gasto_operativo SET ${fields.join(', ')} WHERE id_gasto = ?`;
            
            const [result] = await db.query(query, values);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error('Error al actualizar costo: ' + error.message);
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.query('DELETE FROM gasto_operativo WHERE id_gasto = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error('Error al eliminar costo: ' + error.message);
        }
    }

    static async getResumen(filtros = {}) {
        try {
            let query = `
                SELECT 
                    COUNT(*) as cantidad,
                    COALESCE(SUM(g.monto), 0) as total,
                    COALESCE(AVG(g.monto), 0) as promedio
                FROM gasto_operativo g
                INNER JOIN viaje v ON g.id_viaje = v.id_viaje
                WHERE 1=1
            `;
            const params = [];

            if (filtros.fechaInicio) {
                query += ' AND g.fecha >= ?';
                params.push(filtros.fechaInicio);
            }

            if (filtros.fechaFin) {
                query += ' AND g.fecha <= ?';
                params.push(filtros.fechaFin);
            }

            const [rows] = await db.query(query, params);
            return rows[0];
        } catch (error) {
            throw new Error('Error al obtener resumen: ' + error.message);
        }
    }

    static async getCostosPorViaje(idViaje) {
        try {
            const [rows] = await db.query(`
                SELECT 
                    g.*,
                    v.fecha as fecha_viaje,
                    r.nombre as ruta_nombre
                FROM gasto_operativo g
                INNER JOIN viaje v ON g.id_viaje = v.id_viaje
                INNER JOIN ruta r ON v.id_ruta = r.id_ruta
                WHERE g.id_viaje = ?
                ORDER BY g.fecha DESC
            `, [idViaje]);
            
            return rows;
        } catch (error) {
            throw new Error('Error al obtener costos del viaje: ' + error.message);
        }
    }

    static async getCostosPorTipo(fechaInicio, fechaFin) {
        try {
            const [rows] = await db.query(`
                SELECT 
                    g.descripcion,
                    COUNT(*) as cantidad,
                    SUM(g.monto) as total
                FROM gasto_operativo g
                WHERE g.fecha BETWEEN ? AND ?
                GROUP BY g.descripcion
                ORDER BY total DESC
            `, [fechaInicio, fechaFin]);
            
            return rows;
        } catch (error) {
            throw new Error('Error al obtener costos por tipo: ' + error.message);
        }
    }
}

export default Costo;
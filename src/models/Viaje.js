import db from '../config/db.js';

class Viaje {
    static async query(sql, params = []) {
        return await db.query(sql, params);
    }

    static async findAll(filtros = {}) {
        try {
            let query = `
                SELECT 
                    v.id_viaje,
                    v.id_conductor,
                    v.id_ruta,
                    v.fecha,
                    v.hora_salida,
                    v.hora_llegada,
                    v.estado,
                    v.pasajeros_totales,
                    r.nombre as ruta_nombre,
                    r.distancia_km,
                    r.duracion_estimada,
                    u.nombre as conductor_nombre,
                    u.telefono as conductor_telefono
                FROM viaje v
                INNER JOIN ruta r ON v.id_ruta = r.id_ruta
                LEFT JOIN usuario u ON v.id_conductor = u.id_usuario
                WHERE 1=1
            `;
            const params = [];

            // Aplicar filtros
            if (filtros.estado) {
                query += ' AND v.estado = ?';
                params.push(filtros.estado);
            }

            if (filtros.fechaInicio) {
                query += ' AND v.fecha >= ?';
                params.push(filtros.fechaInicio);
            }

            if (filtros.fechaFin) {
                query += ' AND v.fecha <= ?';
                params.push(filtros.fechaFin);
            }

            if (filtros.conductor) {
                query += ' AND v.id_conductor = ?';
                params.push(filtros.conductor);
            }

            query += ' ORDER BY v.fecha DESC, v.hora_salida DESC';

            const [rows] = await db.query(query, params);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener viajes: ' + error.message);
        }
    }

    static async findById(id) {
        try {
            const [rows] = await db.query(`
                SELECT 
                    v.*,
                    r.nombre as ruta_nombre,
                    r.distancia_km,
                    u.nombre as conductor_nombre,
                    u.telefono as conductor_telefono
                FROM viaje v
                INNER JOIN ruta r ON v.id_ruta = r.id_ruta
                LEFT JOIN usuario u ON v.id_conductor = u.id_usuario
                WHERE v.id_viaje = ?
            `, [id]);
            
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error('Error al obtener viaje: ' + error.message);
        }
    }

    static async create(viajeData) {
        try {
            const { id_conductor, id_ruta, fecha, hora_salida, hora_llegada } = viajeData;
            
            const [result] = await db.query(
                `INSERT INTO viaje (id_conductor, id_ruta, fecha, hora_salida, hora_llegada, estado, pasajeros_totales) 
                 VALUES (?, ?, ?, ?, ?, 'programado', 0)`,
                [id_conductor, id_ruta, fecha, hora_salida, hora_llegada]
            );
            
            return result.insertId;
        } catch (error) {
            throw new Error('Error al crear viaje: ' + error.message);
        }
    }

    static async update(id, datos) {
        try {
            const fields = [];
            const values = [];

            if (datos.id_conductor !== undefined) {
                fields.push('id_conductor = ?');
                values.push(datos.id_conductor);
            }
            if (datos.id_ruta !== undefined) {
                fields.push('id_ruta = ?');
                values.push(datos.id_ruta);
            }
            if (datos.fecha !== undefined) {
                fields.push('fecha = ?');
                values.push(datos.fecha);
            }
            if (datos.hora_salida !== undefined) {
                fields.push('hora_salida = ?');
                values.push(datos.hora_salida);
            }
            if (datos.hora_llegada !== undefined) {
                fields.push('hora_llegada = ?');
                values.push(datos.hora_llegada);
            }
            if (datos.estado !== undefined) {
                fields.push('estado = ?');
                values.push(datos.estado);
            }
            if (datos.pasajeros_totales !== undefined) {
                fields.push('pasajeros_totales = ?');
                values.push(datos.pasajeros_totales);
            }

            if (fields.length === 0) {
                return false;
            }

            values.push(id);
            const query = `UPDATE viaje SET ${fields.join(', ')} WHERE id_viaje = ?`;
            
            const [result] = await db.query(query, values);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error('Error al actualizar viaje: ' + error.message);
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.query('DELETE FROM viaje WHERE id_viaje = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error('Error al eliminar viaje: ' + error.message);
        }
    }

    static async verificarDisponibilidadConductor(idConductor, fecha) {
        try {
            const [rows] = await db.query(
                `SELECT COUNT(*) as count 
                 FROM viaje 
                 WHERE id_conductor = ? 
                 AND fecha = ? 
                 AND estado IN ('programado', 'en_curso')`,
                [idConductor, fecha]
            );
            
            return rows[0].count === 0;
        } catch (error) {
            throw new Error('Error al verificar disponibilidad: ' + error.message);
        }
    }

    static async getConductoresDisponibles(fecha = null) {
        try {
            let query = `
                SELECT u.id_usuario, u.nombre, u.telefono
                FROM usuario u
                WHERE u.rol = 3 
                AND u.estado = 'activo'
            `;
            const params = [];

            if (fecha) {
                query += `
                    AND u.id_usuario NOT IN (
                        SELECT id_conductor 
                        FROM viaje 
                        WHERE fecha = ? 
                        AND estado IN ('programado', 'en_curso')
                    )
                `;
                params.push(fecha);
            }

            query += ' ORDER BY u.nombre';

            const [rows] = await db.query(query, params);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener conductores disponibles: ' + error.message);
        }
    }

    static async getEstadisticas(fechaInicio, fechaFin) {
        try {
            const [rows] = await db.query(`
                SELECT 
                    COUNT(*) as total_viajes,
                    SUM(CASE WHEN estado = 'programado' THEN 1 ELSE 0 END) as programados,
                    SUM(CASE WHEN estado = 'en_curso' THEN 1 ELSE 0 END) as en_curso,
                    SUM(CASE WHEN estado = 'finalizado' THEN 1 ELSE 0 END) as finalizados,
                    SUM(CASE WHEN estado = 'cancelado' THEN 1 ELSE 0 END) as cancelados,
                    COALESCE(SUM(pasajeros_totales), 0) as total_pasajeros
                FROM viaje
                WHERE fecha BETWEEN ? AND ?
            `, [fechaInicio, fechaFin]);
            
            return rows[0];
        } catch (error) {
            throw new Error('Error al obtener estadísticas: ' + error.message);
        }
    }
}

export default Viaje;
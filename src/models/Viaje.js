import db from '../config/db.js';

class Viaje {
    static async findAll(filtros = {}) {
        try {
            let query = `
                SELECT v.*, 
                       r.nombre as ruta_nombre,
                       u.nombre as conductor_nombre
                FROM viaje v
                LEFT JOIN ruta r ON v.id_ruta = r.id_ruta
                LEFT JOIN usuario u ON v.id_conductor = u.id_usuario
                WHERE 1=1
            `;
            const params = [];

            if (filtros.estado) {
                query += ' AND v.estado = ?';
                params.push(filtros.estado);
            }

            if (filtros.fechaInicio && filtros.fechaFin) {
                query += ' AND v.fecha BETWEEN ? AND ?';
                params.push(filtros.fechaInicio, filtros.fechaFin);
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
                SELECT v.*, 
                       r.nombre as ruta_nombre,
                       u.nombre as conductor_nombre
                FROM viaje v
                LEFT JOIN ruta r ON v.id_ruta = r.id_ruta
                LEFT JOIN usuario u ON v.id_conductor = u.id_usuario
                WHERE v.id_viaje = ?
            `, [id]);
            return rows[0] || null;
        } catch (error) {
            throw new Error('Error al buscar viaje: ' + error.message);
        }
    }

    static async create(data) {
        try {
            const { id_conductor, id_ruta, fecha, hora_salida, hora_llegada } = data;
            const [result] = await db.query(`
                INSERT INTO viaje (id_conductor, id_ruta, fecha, hora_salida, hora_llegada, estado)
                VALUES (?, ?, ?, ?, ?, 'programado')
            `, [id_conductor, id_ruta, fecha, hora_salida, hora_llegada]);

            return result.insertId;
        } catch (error) {
            throw new Error('Error al crear viaje: ' + error.message);
        }
    }

    static async getViajesByFechas(fechaInicio, fechaFin) {
        return this.findAll({ fechaInicio, fechaFin });
    }
}

export default Viaje;
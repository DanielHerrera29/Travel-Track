import db from "../config/db.js";

class Incidencia {

    static async findAll(filtros = {}) {
        try {
            let query = `
                SELECT i.*, 
                       v.fecha,
                       v.id_ruta,
                       r.nombre AS ruta_nombre
                FROM incidencia i
                INNER JOIN viaje v ON i.id_viaje = v.id_viaje
                INNER JOIN ruta r ON v.id_ruta = r.id_ruta
                WHERE 1=1
            `;
            const params = [];

            if (filtros.id_viaje) {
                query += " AND i.id_viaje = ?";
                params.push(filtros.id_viaje);
            }

            if (filtros.fechaInicio && filtros.fechaFin) {
                query += " AND v.fecha BETWEEN ? AND ?";
                params.push(filtros.fechaInicio, filtros.fechaFin);
            }

            const [rows] = await db.query(query, params);
            return rows;
        } catch (error) {
            throw new Error("Error al obtener incidencias: " + error.message);
        }
    }

    static async create(data) {
        try {
            const { id_viaje, descripcion } = data;

            const [result] = await db.query(`
                INSERT INTO incidencia (id_viaje, descripcion)
                VALUES (?, ?)
            `, [id_viaje, descripcion]);

            return result.insertId;
        } catch (error) {
            throw new Error("Error al registrar incidencia: " + error.message);
        }
    }
}

export default Incidencia;

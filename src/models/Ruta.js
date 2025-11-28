import db from '../config/db.js';

class Ruta {
    static async findAll() {
        try {
            const [rows] = await db.query(`
                SELECT r.*, 
                       GROUP_CONCAT(p.nombre ORDER BY rp.orden SEPARATOR ' -> ') as paradas
                FROM ruta r
                LEFT JOIN ruta_parada rp ON r.id_ruta = rp.id_ruta
                LEFT JOIN parada p ON rp.id_parada = p.id_parada
                GROUP BY r.id_ruta
                ORDER BY r.nombre
            `);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener rutas: ' + error.message);
        }
    }

    static async findById(id) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM ruta WHERE id_ruta = ?',
                [id]
            );
            
            if (rows.length === 0) return null;

            // Obtener paradas de la ruta
            const [paradas] = await db.query(`
                SELECT p.*, rp.orden
                FROM parada p
                INNER JOIN ruta_parada rp ON p.id_parada = rp.id_parada
                WHERE rp.id_ruta = ?
                ORDER BY rp.orden
            `, [id]);

            return {
                ...rows[0],
                paradas
            };
        } catch (error) {
            throw new Error('Error al buscar ruta: ' + error.message);
        }
    }

    static async create(data) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const { nombre, distancia_km, duracion_estimada, paradas } = data;

            // Crear la ruta
            const [result] = await connection.query(
                'INSERT INTO ruta (nombre, distancia_km, duracion_estimada) VALUES (?, ?, ?)',
                [nombre, distancia_km, duracion_estimada]
            );

            const idRuta = result.insertId;

            // Si hay paradas, asociarlas
            if (paradas && paradas.length > 0) {
                for (let i = 0; i < paradas.length; i++) {
                    await connection.query(
                        'INSERT INTO ruta_parada (id_ruta, id_parada, orden) VALUES (?, ?, ?)',
                        [idRuta, paradas[i].id_parada, i + 1]
                    );
                }
            }

            await connection.commit();
            return idRuta;
        } catch (error) {
            await connection.rollback();
            throw new Error('Error al crear ruta: ' + error.message);
        } finally {
            connection.release();
        }
    }

    static async update(id, data) {
        try {
            const { nombre, distancia_km, duracion_estimada } = data;
            
            const [result] = await db.query(
                'UPDATE ruta SET nombre = ?, distancia_km = ?, duracion_estimada = ? WHERE id_ruta = ?',
                [nombre, distancia_km, duracion_estimada, id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw new Error('Error al actualizar ruta: ' + error.message);
        }
    }

    static async delete(id) {
        try {
            const [result] = await db.query(
                'DELETE FROM ruta WHERE id_ruta = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error('Error al eliminar ruta: ' + error.message);
        }
    }

    static async updateParadas(idRuta, paradas) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Eliminar paradas anteriores
            await connection.query(
                'DELETE FROM ruta_parada WHERE id_ruta = ?',
                [idRuta]
            );

            // Insertar nuevas paradas
            if (paradas && paradas.length > 0) {
                for (let i = 0; i < paradas.length; i++) {
                    await connection.query(
                        'INSERT INTO ruta_parada (id_ruta, id_parada, orden) VALUES (?, ?, ?)',
                        [idRuta, paradas[i].id_parada, i + 1]
                    );
                }
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw new Error('Error al actualizar paradas: ' + error.message);
        } finally {
            connection.release();
        }
    }
}

export default Ruta;
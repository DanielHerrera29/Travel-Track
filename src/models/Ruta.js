import db from "../config/db.js";

class Ruta {
    static async crear({ nombre_ruta, ciudad_origen, ciudad_destino, distancia_km }) {
        const [result] = await db.query(`
            INSERT INTO ruta (nombre_ruta, ciudad_origen, ciudad_destino, distancia_km)
            VALUES (?, ?, ?, ?)
        `, [nombre_ruta, ciudad_origen, ciudad_destino, distancia_km]);

        return result.insertId;
    }

    static async listar() {
        const [rows] = await db.query("SELECT * FROM ruta WHERE estado='activa' ORDER BY id_ruta DESC");
        return rows;
    }
}

export default Ruta;

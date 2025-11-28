import mysql from "mysql2/promise";

const db = mysql.createPool({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "",
    database: "transporte_sistema",
});

try {
    await db.getConnection();
    console.log("📌 Conectado a MySQL correctamente");
} catch (err) {
    console.error("❌ Error conectando a MySQL:", err);
}

export default db;

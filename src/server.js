import app from "./app.js";
import "./config/db.js";

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

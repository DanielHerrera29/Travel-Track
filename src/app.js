import express from "express";
import rutasRoutes from "./routes/rutas.routes.js";
import clientesRoutes from "./routes/clientes.routes.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/rutas", rutasRoutes);
app.use("/clientes", clientesRoutes);

app.use(express.static(join(__dirname, "public")));

export default app;

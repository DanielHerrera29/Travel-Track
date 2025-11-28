import { Router } from "express";
import {
    mostrarVistaRutas,
    obtenerRutaOSRM,
    registrarRuta
} from "../controllers/rutas.controller.js";

const router = Router();

// Vista principal de rutas
router.get("/", mostrarVistaRutas);

// API para obtener ruta real
router.get("/api/osrm", obtenerRutaOSRM);

// Guardar ruta en BD
router.post("/api/registrar", registrarRuta);

export default router;

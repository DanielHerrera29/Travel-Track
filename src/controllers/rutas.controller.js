import axios from "axios";
import Ruta from "../models/Ruta.js";

export const mostrarVistaRutas = async (req, res) => {
    try {
        const rutas = await Ruta.listar();
        res.render("rutas/index", { rutas });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error cargando rutas");
    }
};

// API externa OSRM para obtener ruta real
export const obtenerRutaOSRM = async (req, res) => {
    try {
        const { origenLon, origenLat, destinoLon, destinoLat } = req.query;

        const url = `https://router.project-osrm.org/route/v1/driving/${origenLon},${origenLat};${destinoLon},${destinoLat}?overview=full&geometries=geojson`;

        const { data } = await axios.get(url);

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error consultando ruta real" });
    }
};

// Registrar ruta en BD
export const registrarRuta = async (req, res) => {
    try {
        const id = await Ruta.crear(req.body);
        res.json({ id, mensaje: "Ruta registrada exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error registrando ruta" });
    }
};

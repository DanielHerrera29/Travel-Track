import RutaService from '../services/RutaService.js';

class RutaController {
    async getAllRutas(req, res) {
        try {
            const result = await RutaService.getAllRutas();
            
            if (!result.success) {
                return res.status(500).json(result);
            }

            const rutasFormateadas = result.rutas.map(ruta => ({
                ...ruta,
                duracion_formateada: RutaService.formatDuration(ruta.duracion),
                precio_formateado: RutaService.formatPrice(ruta.precio)
            }));

            return res.json({
                success: true,
                rutas: rutasFormateadas
            });
        } catch (error) {
            console.error('Error al obtener rutas:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener las rutas'
            });
        }
    }

    async getRutaById(req, res) {
        try {
            const { id } = req.params;
            const result = await RutaService.getRutaById(id);

            if (!result.success) {
                return res.status(404).json(result);
            }

            const rutaFormateada = {
                ...result.ruta,
                duracion_formateada: RutaService.formatDuration(result.ruta.duracion),
                precio_formateado: RutaService.formatPrice(result.ruta.precio)
            };

            return res.json({
                success: true,
                ruta: rutaFormateada
            });
        } catch (error) {
            console.error('Error al obtener ruta:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener la ruta'
            });
        }
    }

    async createRuta(req, res) {
        try {
            const { nombre, ciudad_origen, ciudad_destino, distancia, duracion, precio } = req.body;

            if (!nombre || !ciudad_origen || !ciudad_destino || !distancia || !duracion || !precio) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son requeridos'
                });
            }

            const result = await RutaService.createRuta({
                nombre,
                ciudad_origen,
                ciudad_destino,
                distancia,
                duracion,
                precio
            });

            if (!result.success) {
                return res.status(500).json(result);
            }

            return res.json(result);
        } catch (error) {
            console.error('Error al crear ruta:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al crear la ruta'
            });
        }
    }

    async updateRuta(req, res) {
        try {
            const { id } = req.params;
            const { nombre, ciudad_origen, ciudad_destino, distancia, duracion, precio, estado } = req.body;

            if (!nombre || !ciudad_origen || !ciudad_destino || !distancia || !duracion || !precio) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son requeridos'
                });
            }

            const result = await RutaService.updateRuta(id, {
                nombre,
                ciudad_origen,
                ciudad_destino,
                distancia,
                duracion,
                precio,
                estado: estado || 'activo'
            });

            if (!result.success) {
                return res.status(500).json(result);
            }

            return res.json(result);
        } catch (error) {
            console.error('Error al actualizar ruta:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar la ruta'
            });
        }
    }

    async deactivateRuta(req, res) {
        try {
            const { id } = req.params;
            const result = await RutaService.deactivateRuta(id);

            if (!result.success) {
                return res.status(500).json(result);
            }

            return res.json(result);
        } catch (error) {
            console.error('Error al desactivar ruta:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al desactivar la ruta'
            });
        }
    }
}

export default new RutaController();
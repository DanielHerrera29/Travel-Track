import Ruta from '../models/Ruta.js';

class RutaService {
    // Obtener todas las rutas activas
    async getAllRutas() {
        try {
            const rutas = await Ruta.findAll();
            return {
                success: true,
                rutas: rutas
            };
        } catch (error) {
            console.error('Error al obtener rutas:', error);
            return {
                success: false,
                message: 'Error al cargar las rutas',
                rutas: []
            };
        }
    }

    // Obtener una ruta por ID
    async getRutaById(id_ruta) {
        try {
            const ruta = await Ruta.findById(id_ruta);

            if (!ruta) {
                return {
                    success: false,
                    message: 'Ruta no encontrada'
                };
            }

            return {
                success: true,
                ruta: ruta
            };
        } catch (error) {
            console.error('Error al obtener ruta:', error);
            return {
                success: false,
                message: 'Error al cargar la ruta'
            };
        }
    }

    // Crear nueva ruta
    async createRuta(data) {
        try {
            const id = await Ruta.create(data);
            return {
                success: true,
                message: 'Ruta creada exitosamente',
                id_ruta: id
            };
        } catch (error) {
            console.error('Error al crear ruta:', error);
            return {
                success: false,
                message: 'Error al crear la ruta'
            };
        }
    }

    // Actualizar ruta
    async updateRuta(id_ruta, data) {
        try {
            await Ruta.update(id_ruta, data);
            return {
                success: true,
                message: 'Ruta actualizada exitosamente'
            };
        } catch (error) {
            console.error('Error al actualizar ruta:', error);
            return {
                success: false,
                message: 'Error al actualizar la ruta'
            };
        }
    }

    // Desactivar ruta
    async deactivateRuta(id_ruta) {
        try {
            await Ruta.deactivate(id_ruta);
            return {
                success: true,
                message: 'Ruta desactivada exitosamente'
            };
        } catch (error) {
            console.error('Error al desactivar ruta:', error);
            return {
                success: false,
                message: 'Error al desactivar la ruta'
            };
        }
    }

    // Formatear duración para mostrar (ej: "4 horas 30 minutos")
    formatDuration(duration) {
        if (!duration) return 'N/A';
        
        const [hours, minutes] = duration.split(':');
        const h = parseInt(hours);
        const m = parseInt(minutes);
        
        let result = '';
        if (h > 0) {
            result += `${h} ${h === 1 ? 'hora' : 'horas'}`;
        }
        if (m > 0) {
            if (result) result += ' ';
            result += `${m} minutos`;
        }
        
        return result || 'N/A';
    }

    // Formatear precio (ej: "$35.000")
    formatPrice(price) {
        if (!price) return '$0';
        return `$${parseFloat(price).toLocaleString('es-CO')}`;
    }
}

export default new RutaService();
// controllers/AdminController.js
import Ruta from '../models/Ruta.js';
import User from '../models/User.js';
import Viaje from '../models/Viaje.js';
import Costo from '../models/Costo.js'; // ⬅️ AGREGADO: Importar modelo Costo

class AdminController {
    // ============ GESTIÓN DE RUTAS ============
    
    async getAllRutas(req, res) {
        try {
            const rutas = await Ruta.findAll();
            res.json({
                success: true,
                data: rutas
            });
        } catch (error) {
            console.error('Error al obtener rutas:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async createRuta(req, res) {
        try {
            const { nombre, distancia_km, duracion_estimada } = req.body;
            const idRuta = await Ruta.create({ nombre, distancia_km, duracion_estimada });
            res.json({
                success: true,
                message: 'Ruta creada exitosamente',
                data: { id: idRuta }
            });
        } catch (error) {
            console.error('Error al crear ruta:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateRuta(req, res) {
        try {
            const { id } = req.params;
            const datos = req.body;
            const updated = await Ruta.update(id, datos);
            
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Ruta no encontrada'
                });
            }

            res.json({
                success: true,
                message: 'Ruta actualizada exitosamente'
            });
        } catch (error) {
            console.error('Error al actualizar ruta:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteRuta(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Ruta.delete(id);
            
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Ruta no encontrada'
                });
            }

            res.json({
                success: true,
                message: 'Ruta eliminada exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar ruta:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // ============ GESTIÓN DE USUARIOS ============

    async getAllUsuarios(req, res) {
        try {
            const { rol, estado, busqueda } = req.query;
            
            let query = 'SELECT id_usuario, nombre, cedula, correo, telefono, rol, estado FROM usuario WHERE 1=1';
            const params = [];

            if (rol) {
                const rolMap = { 'cliente': 1, 'admin': 2, 'conductor': 3 };
                query += ' AND rol = ?';
                params.push(rolMap[rol] || 1);
            }

            if (estado) {
                query += ' AND estado = ?';
                params.push(estado);
            }

            if (busqueda) {
                query += ' AND (nombre LIKE ? OR cedula LIKE ?)';
                params.push(`%${busqueda}%`, `%${busqueda}%`);
            }

            query += ' ORDER BY nombre';

            const [rows] = await User.query(query, params);

            const usuarios = rows.map(user => ({
                ...user,
                rol_texto: this.getRoleText(user.rol)
            }));

            res.json({
                success: true,
                data: usuarios
            });
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async createConductor(req, res) {
        try {
            const { nombre, cedula, correo, telefono } = req.body;

            if (!nombre || !cedula || !correo || !telefono) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son requeridos'
                });
            }

            const existingUser = await User.findByEmail(correo);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'El correo ya está registrado'
                });
            }

            const [existingCedula] = await User.query(
                'SELECT id_usuario FROM usuario WHERE cedula = ?',
                [cedula]
            );

            if (existingCedula.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'La cédula ya está registrada'
                });
            }

            const userId = await User.create({
                nombre,
                cedula,
                correo,
                contrasena: '123456',
                telefono,
                rol: 3,
                estado: 'activo'
            });

            res.json({
                success: true,
                message: 'Conductor creado exitosamente. Contraseña por defecto: 123456',
                data: { id: userId }
            });
        } catch (error) {
            console.error('Error al crear conductor:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateUsuario(req, res) {
        try {
            const { id } = req.params;
            const { nombre, telefono } = req.body;

            const [result] = await User.query(
                'UPDATE usuario SET nombre = ?, telefono = ? WHERE id_usuario = ?',
                [nombre, telefono, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Usuario actualizado exitosamente'
            });
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async cambiarEstadoUsuario(req, res) {
        try {
            const { id } = req.params;
            const { estado } = req.body;

            if (!['activo', 'inactivo'].includes(estado)) {
                return res.status(400).json({
                    success: false,
                    message: 'Estado inválido'
                });
            }

            const [result] = await User.query(
                'UPDATE usuario SET estado = ? WHERE id_usuario = ? AND rol = 3',
                [estado, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Conductor no encontrado'
                });
            }

            res.json({
                success: true,
                message: `Usuario ${estado === 'activo' ? 'activado' : 'desactivado'} exitosamente`
            });
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // ============ GESTIÓN DE VIAJES ============

    async getAllViajes(req, res) {
        try {
            const { estado, fechaInicio, fechaFin, conductor } = req.query;
            
            const filtros = {};
            if (estado) filtros.estado = estado;
            if (fechaInicio) filtros.fechaInicio = fechaInicio;
            if (fechaFin) filtros.fechaFin = fechaFin;
            if (conductor) filtros.conductor = conductor;

            const viajes = await Viaje.findAll(filtros);
            
            res.json({
                success: true,
                data: viajes
            });
        } catch (error) {
            console.error('Error al obtener viajes:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getViajeById(req, res) {
        try {
            const { id } = req.params;
            const viaje = await Viaje.findById(id);
            
            if (!viaje) {
                return res.status(404).json({
                    success: false,
                    message: 'Viaje no encontrado'
                });
            }

            res.json({
                success: true,
                data: viaje
            });
        } catch (error) {
            console.error('Error al obtener viaje:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async createViaje(req, res) {
        try {
            const { id_conductor, id_ruta, fecha, hora_salida, hora_llegada } = req.body;

            if (!id_conductor || !id_ruta || !fecha || !hora_salida || !hora_llegada) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son requeridos'
                });
            }

            const disponible = await Viaje.verificarDisponibilidadConductor(id_conductor, fecha);
            if (!disponible) {
                return res.status(400).json({
                    success: false,
                    message: 'El conductor ya tiene un viaje asignado para esta fecha'
                });
            }

            if (hora_llegada <= hora_salida) {
                return res.status(400).json({
                    success: false,
                    message: 'La hora de llegada debe ser posterior a la hora de salida'
                });
            }

            const idViaje = await Viaje.create({
                id_conductor,
                id_ruta,
                fecha,
                hora_salida,
                hora_llegada
            });

            res.json({
                success: true,
                message: 'Viaje creado exitosamente',
                data: { id: idViaje }
            });
        } catch (error) {
            console.error('Error al crear viaje:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateViaje(req, res) {
        try {
            const { id } = req.params;
            const datos = req.body;

            if (datos.hora_salida && datos.hora_llegada && datos.hora_llegada <= datos.hora_salida) {
                return res.status(400).json({
                    success: false,
                    message: 'La hora de llegada debe ser posterior a la hora de salida'
                });
            }

            if (datos.id_conductor || datos.fecha) {
                const viajeActual = await Viaje.findById(id);
                const conductorId = datos.id_conductor || viajeActual.id_conductor;
                const fecha = datos.fecha || viajeActual.fecha;

                const disponible = await Viaje.verificarDisponibilidadConductor(conductorId, fecha);
                if (!disponible) {
                    return res.status(400).json({
                        success: false,
                        message: 'El conductor ya tiene un viaje asignado para esta fecha'
                    });
                }
            }

            const updated = await Viaje.update(id, datos);
            
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Viaje no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Viaje actualizado exitosamente'
            });
        } catch (error) {
            console.error('Error al actualizar viaje:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteViaje(req, res) {
        try {
            const { id } = req.params;
            
            const viaje = await Viaje.findById(id);
            if (!viaje) {
                return res.status(404).json({
                    success: false,
                    message: 'Viaje no encontrado'
                });
            }

            if (viaje.estado === 'en_curso' || viaje.estado === 'finalizado') {
                return res.status(400).json({
                    success: false,
                    message: 'No se puede eliminar un viaje en curso o finalizado'
                });
            }

            const deleted = await Viaje.delete(id);
            
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Viaje no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Viaje eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar viaje:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async cambiarEstadoViaje(req, res) {
        try {
            const { id } = req.params;
            const { estado } = req.body;

            const estadosValidos = ['programado', 'en_curso', 'finalizado', 'cancelado'];
            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({
                    success: false,
                    message: 'Estado inválido'
                });
            }

            const updated = await Viaje.update(id, { estado });
            
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Viaje no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Estado del viaje actualizado exitosamente'
            });
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getConductoresDisponibles(req, res) {
        try {
            const { fecha } = req.query;
            const conductores = await Viaje.getConductoresDisponibles(fecha);
            
            res.json({
                success: true,
                data: conductores
            });
        } catch (error) {
            console.error('Error al obtener conductores disponibles:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getEstadisticasViajes(req, res) {
        try {
            const { fechaInicio, fechaFin } = req.query;
            
            const inicio = fechaInicio || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
            const fin = fechaFin || new Date().toISOString().split('T')[0];

            const estadisticas = await Viaje.getEstadisticas(inicio, fin);
            
            res.json({
                success: true,
                data: estadisticas
            });
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // ============ GESTIÓN DE COSTOS OPERATIVOS ============

    async getAllCostos(req, res) {
        try {
            const { fechaInicio, fechaFin, id_viaje } = req.query;
            
            const filtros = {};
            if (fechaInicio) filtros.fechaInicio = fechaInicio;
            if (fechaFin) filtros.fechaFin = fechaFin;
            if (id_viaje) filtros.id_viaje = id_viaje;

            const costos = await Costo.findAll(filtros);
            const resumen = await Costo.getResumen(filtros);
            
            res.json({
                success: true,
                data: costos,
                resumen: resumen
            });
        } catch (error) {
            console.error('Error al obtener costos:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getCostoById(req, res) {
        try {
            const { id } = req.params;
            const costo = await Costo.findById(id);
            
            if (!costo) {
                return res.status(404).json({
                    success: false,
                    message: 'Costo no encontrado'
                });
            }

            res.json({
                success: true,
                data: costo
            });
        } catch (error) {
            console.error('Error al obtener costo:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async createCosto(req, res) {
        try {
            const { id_viaje, descripcion, monto } = req.body;

            if (!id_viaje || !descripcion || !monto) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos son requeridos'
                });
            }

            if (monto <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El monto debe ser mayor a cero'
                });
            }

            const viaje = await Viaje.findById(id_viaje);
            if (!viaje) {
                return res.status(404).json({
                    success: false,
                    message: 'Viaje no encontrado'
                });
            }

            const idCosto = await Costo.create({
                id_viaje,
                descripcion,
                monto
            });

            res.json({
                success: true,
                message: 'Costo registrado exitosamente',
                data: { id: idCosto }
            });
        } catch (error) {
            console.error('Error al crear costo:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateCosto(req, res) {
        try {
            const { id } = req.params;
            const datos = req.body;

            if (datos.monto && datos.monto <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El monto debe ser mayor a cero'
                });
            }

            const updated = await Costo.update(id, datos);
            
            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Costo no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Costo actualizado exitosamente'
            });
        } catch (error) {
            console.error('Error al actualizar costo:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async deleteCosto(req, res) {
        try {
            const { id } = req.params;
            
            const deleted = await Costo.delete(id);
            
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Costo no encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Costo eliminado exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar costo:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getCostosPorViaje(req, res) {
        try {
            const { id } = req.params;
            const costos = await Costo.getCostosPorViaje(id);
            
            res.json({
                success: true,
                data: costos
            });
        } catch (error) {
            console.error('Error al obtener costos del viaje:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getCostosPorTipo(req, res) {
        try {
            const { fechaInicio, fechaFin } = req.query;
            
            const inicio = fechaInicio || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
            const fin = fechaFin || new Date().toISOString().split('T')[0];

            const costosPorTipo = await Costo.getCostosPorTipo(inicio, fin);
            
            res.json({
                success: true,
                data: costosPorTipo
            });
        } catch (error) {
            console.error('Error al obtener costos por tipo:', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // ============ DASHBOARD ============

    async getStats(req, res) {
        try {
            const [[statsViajes]] = await User.query(`
                SELECT COUNT(*) as viajesHoy 
                FROM viaje 
                WHERE DATE(fecha) = CURDATE()
            `);

            const [[statsConductores]] = await User.query(`
                SELECT COUNT(*) as conductoresActivos 
                FROM usuario 
                WHERE rol = 3 AND estado = 'activo'
            `);

            const [[statsClientes]] = await User.query(`
                SELECT COUNT(*) as clientesRegistrados 
                FROM usuario 
                WHERE rol = 1
            `);

            const [[statsIngresos]] = await User.query(`
                SELECT COALESCE(SUM(precio), 0) as ingresosDelMes
                FROM pasaje 
                WHERE MONTH(fecha_compra) = MONTH(CURDATE())
                AND YEAR(fecha_compra) = YEAR(CURDATE())
            `);

            res.json({
                success: true,
                data: {
                    viajesHoy: statsViajes.viajesHoy || 0,
                    conductoresActivos: statsConductores.conductoresActivos || 0,
                    clientesRegistrados: statsClientes.clientesRegistrados || 0,
                    ingresosDelMes: statsIngresos.ingresosDelMes || 0
                }
            });
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.json({
                success: true,
                data: {
                    viajesHoy: 0,
                    conductoresActivos: 0,
                    clientesRegistrados: 0,
                    ingresosDelMes: 0
                }
            });
        }
    }

    // ============ UTILIDADES ============

    getRoleText(roleNumber) {
        const roles = {
            1: 'Cliente',
            2: 'Administrador',
            3: 'Conductor'
        };
        return roles[roleNumber] || 'Desconocido';
    }
}

export default new AdminController();
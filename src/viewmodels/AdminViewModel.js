class AdminViewModel {

    constructor() {
        this.usuarios = [];
        this.rutas = [];
        this.viajes = [];
        this.costos = [];
        this.stats = {};
        this.isLoading = false;
        this.error = null;
        this.filtros = {
            usuarios: { rol: '', estado: '', busqueda: '' },
            viajes: { estado: '', fechaInicio: '', fechaFin: '' },
            costos: { tipo: '', fechaInicio: '', fechaFin: '' }
        };
    }

    // ============ GESTIÓN DE USUARIOS ============
    
    async cargarUsuarios(filtros = {}) {
        this.isLoading = true;
        this.error = null;

        try {
            const queryParams = new URLSearchParams(filtros).toString();
            const response = await fetch(`/api/admin/usuarios?${queryParams}`, {
                credentials: 'include'
            });

            const result = await response.json();

            if (result.success) {
                this.usuarios = result.data;
                return { success: true, data: result.data };
            } else {
                this.error = result.message;
                return { success: false, message: result.message };
            }
        } catch (error) {
            this.error = 'Error al cargar usuarios';
            return { success: false, message: error.message };
        } finally {
            this.isLoading = false;
        }
    }

    async crearConductor(datosForm) {
        const errores = this.validarConductor(datosForm);
        if (Object.keys(errores).length > 0) {
            return { success: false, errors: errores };
        }

        this.isLoading = true;

        try {
            const response = await fetch('/api/admin/usuarios/conductor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(datosForm)
            });

            const result = await response.json();

            if (result.success) {
                await this.cargarUsuarios({ rol: 'conductor' });
            }

            return result;
        } catch (error) {
            return { success: false, message: 'Error al crear conductor' };
        } finally {
            this.isLoading = false;
        }
    }

    async actualizarUsuario(id, datos) {
        this.isLoading = true;

        try {
            const response = await fetch(`/api/admin/usuarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(datos)
            });

            const result = await response.json();

            if (result.success) {
                await this.cargarUsuarios();
            }

            return result;
        } catch (error) {
            return { success: false, message: 'Error al actualizar usuario' };
        } finally {
            this.isLoading = false;
        }
    }

    async cambiarEstadoUsuario(id, estado) {
        try {
            const response = await fetch(`/api/admin/usuarios/${id}/estado`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ estado })
            });

            const result = await response.json();

            if (result.success) {
                await this.cargarUsuarios();
            }

            return result;
        } catch (error) {
            return { success: false, message: 'Error al cambiar estado' };
        }
    }

    // ============ GESTIÓN DE RUTAS ============
    
    async cargarRutas() {
        this.isLoading = true;

        try {
            const response = await fetch('/api/admin/rutas', {
                credentials: 'include'
            });

            const result = await response.json();

            if (result.success) {
                this.rutas = result.data;
            }

            return result;
        } catch (error) {
            return { success: false, message: 'Error al cargar rutas' };
        } finally {
            this.isLoading = false;
        }
    }

    async crearRuta(datosForm) {
        const errores = this.validarRuta(datosForm);
        if (Object.keys(errores).length > 0) {
            return { success: false, errors: errores };
        }

        try {
            const response = await fetch('/api/admin/rutas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(datosForm)
            });

            const result = await response.json();

            if (result.success) {
                await this.cargarRutas();
            }

            return result;
        } catch (error) {
            return { success: false, message: 'Error al crear ruta' };
        }
    }

    async actualizarRuta(id, datos) {
        try {
            const response = await fetch(`/api/admin/rutas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(datos)
            });

            const result = await response.json();

            if (result.success) {
                await this.cargarRutas();
            }

            return result;
        } catch (error) {
            return { success: false, message: 'Error al actualizar ruta' };
        }
    }

    async eliminarRuta(id) {
        try {
            const response = await fetch(`/api/admin/rutas/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const result = await response.json();

            if (result.success) {
                await this.cargarRutas();
            }

            return result;
        } catch (error) {
            return { success: false, message: 'Error al eliminar ruta' };
        }
    }

    // ============ GESTIÓN DE VIAJES ============
    
    async cargarViajes(filtros = {}) {
        this.isLoading = true;

        try {
            const queryParams = new URLSearchParams(filtros).toString();
            const response = await fetch(`/api/admin/viajes?${queryParams}`, {
                credentials: 'include'
            });

            const result = await response.json();

            if (result.success) {
                this.viajes = result.data;
            }

            return result;
        } catch (error) {
            return { success: false, message: 'Error al cargar viajes' };
        } finally {
            this.isLoading = false;
        }
    }

    async asignarConductor(viajeId, conductorId, vehiculoId) {
        try {
            const response = await fetch('/api/admin/viajes/asignar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ viajeId, conductorId, vehiculoId })
            });

            const result = await response.json();

            if (result.success) {
                await this.cargarViajes();
            }

            return result;
        } catch (error) {
            return { success: false, message: 'Error al asignar conductor' };
        }
    }

    // ============ GESTIÓN DE COSTOS ============
    
    async registrarCosto(datosForm) {
        const errores = this.validarCosto(datosForm);
        if (Object.keys(errores).length > 0) {
            return { success: false, errors: errores };
        }

        try {
            const response = await fetch('/api/admin/costos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(datosForm)
            });

            const result = await response.json();

            if (result.success) {
                await this.cargarCostosHistoricos();
            }

            return result;
        } catch (error) {
            return { success: false, message: 'Error al registrar costo' };
        }
    }

    async cargarCostosHistoricos(filtros = {}) {
        this.isLoading = true;

        try {
            const queryParams = new URLSearchParams(filtros).toString();
            const response = await fetch(`/api/admin/costos/historico?${queryParams}`, {
                credentials: 'include'
            });

            const result = await response.json();

            if (result.success) {
                this.costos = result.data;
            }

            return result;
        } catch (error) {
            return { success: false, message: 'Error al cargar costos' };
        } finally {
            this.isLoading = false;
        }
    }

    // ============ REPORTES ============
    
    async generarReporteOperacion(fechaInicio, fechaFin, formato = 'json') {
        this.isLoading = true;

        try {
            const response = await fetch(
                `/api/admin/reportes/operacion?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&formato=${formato}`,
                {
                    credentials: 'include'
                }
            );

            if (formato === 'pdf') {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `reporte_operacion_${fechaInicio}_${fechaFin}.pdf`;
                a.click();
                return { success: true };
            }

            return await response.json();
        } catch (error) {
            return { success: false, message: 'Error al generar reporte' };
        } finally {
            this.isLoading = false;
        }
    }

    async generarReporteCostos(fechaInicio, fechaFin) {
        try {
            const response = await fetch(
                `/api/admin/reportes/costos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
                {
                    credentials: 'include'
                }
            );

            return await response.json();
        } catch (error) {
            return { success: false, message: 'Error al generar reporte de costos' };
        }
    }

    // ============ DASHBOARD ============
    
    async cargarEstadisticas() {
        try {
            const response = await fetch('/api/admin/dashboard/stats', {
                credentials: 'include'
            });

            const result = await response.json();

            if (result.success) {
                this.stats = result.data;
            }

            return result;
        } catch (error) {
            return { success: false, message: 'Error al cargar estadísticas' };
        }
    }

    // ============ VALIDACIONES ============
    
    validarConductor(datos) {
        const errores = {};

        if (!datos.nombre || datos.nombre.trim() === '') {
            errores.nombre = 'El nombre es requerido';
        }

        if (!datos.cedula || datos.cedula.trim() === '') {
            errores.cedula = 'La cédula es requerida';
        }

        if (!datos.email || !/\S+@\S+\.\S+/.test(datos.email)) {
            errores.email = 'El correo no es válido';
        }

        if (!datos.licencia || datos.licencia.trim() === '') {
            errores.licencia = 'La licencia es requerida';
        }

        return errores;
    }

    validarRuta(datos) {
        const errores = {};

        if (!datos.origen || datos.origen.trim() === '') {
            errores.origen = 'El origen es requerido';
        }

        if (!datos.destino || datos.destino.trim() === '') {
            errores.destino = 'El destino es requerido';
        }

        if (!datos.precio || datos.precio <= 0) {
            errores.precio = 'El precio debe ser mayor a 0';
        }

        if (!datos.duracionEstimada || datos.duracionEstimada <= 0) {
            errores.duracionEstimada = 'La duración es requerida';
        }

        return errores;
    }

    validarCosto(datos) {
        const errores = {};

        if (!datos.viaje) {
            errores.viaje = 'Debe seleccionar un viaje';
        }

        if (!datos.tipo) {
            errores.tipo = 'El tipo de costo es requerido';
        }

        if (!datos.monto || datos.monto <= 0) {
            errores.monto = 'El monto debe ser mayor a 0';
        }

        return errores;
    }

    // ============ UTILIDADES ============
    
    limpiar() {
        this.usuarios = [];
        this.rutas = [];
        this.viajes = [];
        this.costos = [];
        this.stats = {};
        this.error = null;
    }
}

export default AdminViewModel;
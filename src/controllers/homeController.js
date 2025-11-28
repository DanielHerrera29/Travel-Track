import RutaService from '../services/RutaService.js';

class HomeController {
    async showHome(req, res) {
        try {
            
            const result = await RutaService.getAllRutas();
            const rutasFormateadas = result.rutas.map(ruta => {
                const formateada = {
                    ...ruta,
                    duracion_formateada: RutaService.formatDuration(ruta.duracion),
                    precio_formateado: RutaService.formatPrice(ruta.precio)
                };
                return formateada;
            });


            res.render('index', {
                title: 'Travel Track - Sistema de Transporte',
                user: req.session?.userId ? req.user : null,
                rutas: rutasFormateadas
            });
        } catch (error) {
            res.render('index', {
                title: 'Travel Track - Sistema de Transporte',
                user: req.session?.userId ? req.user : null,
                rutas: []
            });
        }
    }

    async showRutaDetails(req, res) {
        if (!req.session || !req.session.userId) {
            return res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
        }

        try {
            const { id } = req.params;
            
            const result = await RutaService.getRutaById(id);
            if (!result.success) {
                return res.redirect('/');
            }

            const rutaFormateada = {
                ...result.ruta,
                duracion_formateada: RutaService.formatDuration(result.ruta.duracion),
                precio_formateado: RutaService.formatPrice(result.ruta.precio)
            };


            res.render('ruta-details', {
                title: result.ruta.nombre,
                user: req.user,
                ruta: rutaFormateada
            });
        } catch (error) {
            res.redirect('/');
        }
    }
}

export default new HomeController();
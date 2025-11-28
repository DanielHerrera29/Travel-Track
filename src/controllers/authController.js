import AuthService from '../services/AuthService.js';

function getRedirectByRole(role) {
    const roleRedirects = {
        'admin': '/admin/dashboard',
        'conductor': '/conductor/dashboard',
        'cliente': '/cliente/dashboard'
    };
    return roleRedirects[role] || '/dashboard';
}

class AuthController {
    showLoginForm(req, res) {
        if (req.session && req.session.userId) {
            const redirectUrl = getRedirectByRole(req.session.userRole);
            return res.redirect(redirectUrl);
        }
        
        res.render('login', {
            title: 'Iniciar Sesión',
            error: null
        });
    }

    showRegisterForm(req, res) {
        res.render('register', {
            title: 'Registrarse',
            error: null
        });
    }

    showForgotPasswordForm(req, res) {
        res.render('forgot-password', {
            title: 'Recuperar Contraseña',
            error: null,
            success: null
        });
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const ipAddress = req.ip || req.connection.remoteAddress;
            const userAgent = req.headers['user-agent'];

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email y contraseña son requeridos'
                });
            }

            const result = await AuthService.login(email, password, ipAddress, userAgent);

            if (!result.success) {
                return res.status(401).json(result);
            }

            req.session.userId = result.user.id_usuario;
            req.session.userEmail = result.user.correo;
            req.session.userName = result.user.nombre;
            req.session.userRole = result.user.rol;
            req.session.userRoleNumber = result.user.rolNumber;
            req.session.token = result.token;

            const redirectUrl = getRedirectByRole(result.user.rol);

            return res.json({
                success: true,
                message: 'Login exitoso',
                user: {
                    id: result.user.id_usuario,
                    nombre: result.user.nombre,
                    correo: result.user.correo,
                    rol: result.user.rol,
                    rolNumber: result.user.rolNumber
                },
                redirectUrl: redirectUrl
            });

        } catch (error) {
            console.error('Error en login:', error);
            return res.status(500).json({
                success: false,
                message: 'Error en el servidor al procesar el login'
            });
        }
    }

    async register(req, res) {
        try {
            const { nombre, cedula, correo, contrasena, telefono } = req.body;

            if (!nombre || !correo || !contrasena) {
                return res.status(400).json({
                    success: false,
                    message: 'Nombre, correo y contraseña son requeridos'
                });
            }

            const result = await AuthService.register({
                nombre,
                cedula,
                correo,
                contrasena,
                telefono,
                rol: 1 
            });

            if (!result.success) {
                return res.status(400).json(result);
            }

            return res.json({
                success: true,
                message: 'Usuario registrado exitosamente. Ahora puede iniciar sesión',
                redirectUrl: '/login'
            });

        } catch (error) {
            console.error('Error en register:', error);
            return res.status(500).json({
                success: false,
                message: 'Error en el servidor al registrar usuario'
            });
        }
    }

    async forgotPassword(req, res) {
        try {
            const { correo, nuevaContrasena } = req.body;

            if (!correo || !nuevaContrasena) {
                return res.status(400).json({
                    success: false,
                    message: 'Correo y nueva contraseña son requeridos'
                });
            }

            const result = await AuthService.changePassword(correo, nuevaContrasena);

            return res.json(result);

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error en el servidor al cambiar contraseña'
            });
        }
    }
    async logout(req, res) {
        try {
            const token = req.session.token;

            if (token) {
                await AuthService.logout(token);
            }

            req.session.destroy((err) => {
                if (err) {
                    console.error('Error al destruir sesión:', err);
                }
                res.json({
                    success: true,
                    message: 'Sesión cerrada exitosamente'
                });
            });

        } catch (error) {
            console.error('Error en logout:', error);
            res.status(500).json({
                success: false,
                message: 'Error al cerrar sesión'
            });
        }
    }

    async verifySession(req, res) {
        try {
            if (!req.session || !req.session.userId) {
                return res.json({
                    success: false,
                    authenticated: false,
                    message: 'No hay sesión activa'
                });
            }

            const token = req.session.token;
            const isValid = await AuthService.verifyToken(token);

            if (!isValid) {
                req.session.destroy();
                return res.json({
                    success: false,
                    authenticated: false,
                    message: 'Sesión expirada o inválida'
                });
            }

            return res.json({
                success: true,
                authenticated: true,
                user: {
                    id: req.session.userId,
                    nombre: req.session.userName,
                    correo: req.session.userEmail,
                    rol: req.session.userRole,
                    rolNumber: req.session.userRoleNumber
                }
            });

        } catch (error) {
            console.error('Error al verificar sesión:', error);
            res.status(500).json({
                success: false,
                message: 'Error al verificar sesión'
            });
        }
    }
}

export default new AuthController();
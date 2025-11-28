import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Session from '../models/Session.js';

class AuthService {
    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || 'secret_key_default';
        this.JWT_EXPIRES_IN = '24h';
    }

    // Convertir rol numérico a string
    getRoleName(rolNumber) {
        const roles = {
            1: 'cliente',
            2: 'admin',
            3: 'conductor'
        };
        return roles[rolNumber] || 'cliente';
    }

    // Login de usuario (SIN bcrypt)
    async login(correo, contrasena, ipAddress, userAgent) {
        try {
            // 1. Buscar usuario por correo
            const user = await User.findByEmail(correo);

            if (!user) {
                return {
                    success: false,
                    message: 'Correo o contraseña incorrectos'
                };
            }

            // 2. Verificar estado
            if (user.estado !== 'activo') {
                return {
                    success: false,
                    message: 'Usuario inactivo. Contacte al administrador'
                };
            }

            // 3. Comparar contraseña directa
            if (contrasena !== user.contrasena) {
                return {
                    success: false,
                    message: 'Correo o contraseña incorrectos'
                };
            }

            // 4. Obtener rol como texto
            const rolName = this.getRoleName(user.rol);

            // 5. Generar JWT
            const token = jwt.sign(
                {
                    id: user.id_usuario,
                    correo: user.correo,
                    rol: rolName,
                    rolNumber: user.rol
                },
                this.JWT_SECRET,
                { expiresIn: this.JWT_EXPIRES_IN }
            );

            // 6. Registrar sesión
            const fechaExpiracion = new Date();
            fechaExpiracion.setHours(fechaExpiracion.getHours() + 24);

            await Session.create({
                id_usuario: user.id_usuario,
                token: token,
                fecha_expiracion: fechaExpiracion,
                ip_address: ipAddress,
                user_agent: userAgent
            });

            // 7. Retornar usuario sin contraseña
            return {
                success: true,
                message: 'Login exitoso',
                token: token,
                user: {
                    id_usuario: user.id_usuario,
                    nombre: user.nombre,
                    cedula: user.cedula,
                    correo: user.correo,
                    telefono: user.telefono,
                    rol: rolName,
                    rolNumber: user.rol
                }
            };

        } catch (error) {
            console.error('Error en AuthService.login:', error);
            return {
                success: false,
                message: 'Error en el servidor'
            };
        }
    }

    // Logout
    async logout(token) {
        try {
            await Session.invalidate(token);

            return {
                success: true,
                message: 'Sesión cerrada exitosamente'
            };

        } catch (error) {
            console.error('Error en AuthService.logout:', error);

            return {
                success: false,
                message: 'Error al cerrar sesión'
            };
        }
    }

    // Verificar token
    async verifyToken(token) {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET);

            const session = await Session.findByToken(token);
            if (!session) return false;

            return true;
        } catch (error) {
            return false;
        }
    }

    // Registro (rol por defecto = cliente = 1)
    async register(userData) {
        try {
            // Verificar correo
            const existingUser = await User.findByEmail(userData.correo);

            if (existingUser) {
                return {
                    success: false,
                    message: 'El correo ya está registrado'
                };
            }

            // Crear usuario
            const userId = await User.create({
                ...userData,
                rol: userData.rol || 1
            });

            return {
                success: true,
                message: 'Usuario registrado exitosamente',
                data: { id: userId }
            };

        } catch (error) {
            console.error('Error en AuthService.register:', error);
            return {
                success: false,
                message: 'Error al registrar usuario'
            };
        }
    }

    // Cambiar contraseña
    async changePassword(correo, nuevaContrasena) {
        try {
            const user = await User.findByEmail(correo);

            if (!user) {
                return {
                    success: false,
                    message: 'Usuario no encontrado'
                };
            }

            await User.updatePassword(user.id_usuario, nuevaContrasena);

            return {
                success: true,
                message: 'Contraseña actualizada exitosamente'
            };

        } catch (error) {
            console.error('Error en AuthService.changePassword:', error);

            return {
                success: false,
                message: 'Error al cambiar contraseña'
            };
        }
    }
}

export default new AuthService();

import AuthService from '../services/AuthService.js';

class LoginViewModel {
    constructor() {
        this.email = '';
        this.password = '';
        this.errors = {};
        this.isLoading = false;
    }

    // Validar datos de entrada
    validate() {
        this.errors = {};

        if (!this.email || this.email.trim() === '') {
            this.errors.email = 'El correo es requerido';
        } else if (!/\S+@\S+\.\S+/.test(this.email)) {
            this.errors.email = 'El correo no es válido';
        }

        if (!this.password || this.password.trim() === '') {
            this.errors.password = 'La contraseña es requerida';
        } else if (this.password.length < 6) {
            this.errors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        return Object.keys(this.errors).length === 0;
    }

    // Realizar login
    async login(ipAddress, userAgent) {
        if (!this.validate()) {
            return {
                success: false,
                errors: this.errors
            };
        }

        this.isLoading = true;

        try {
            const result = await AuthService.login(
                this.email, 
                this.password,
                ipAddress,
                userAgent
            );

            this.isLoading = false;
            return result;

        } catch (error) {
            this.isLoading = false;
            return {
                success: false,
                message: 'Error en el servidor'
            };
        }
    }

    // Limpiar formulario
    reset() {
        this.email = '';
        this.password = '';
        this.errors = {};
        this.isLoading = false;
    }
}

export default LoginViewModel;
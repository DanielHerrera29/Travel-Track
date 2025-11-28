export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = {};

    if (!email || email.trim() === '') {
        errors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'El correo no es válido';
    }

    if (!password || password.trim() === '') {
        errors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors
        });
    }

    next();
};

export const validateRegister = (req, res, next) => {
    const { nombre, cedula, correo, contrasena, telefono } = req.body;
    const errors = {};

    if (!nombre || nombre.trim() === '') {
        errors.nombre = 'El nombre es requerido';
    }

    if (!cedula || cedula.trim() === '') {
        errors.cedula = 'La cédula es requerida';
    }

    if (!correo || correo.trim() === '') {
        errors.correo = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(correo)) {
        errors.correo = 'El correo no es válido';
    }

    if (!contrasena || contrasena.trim() === '') {
        errors.contrasena = 'La contraseña es requerida';
    } else if (contrasena.length < 6) {
        errors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!telefono || telefono.trim() === '') {
        errors.telefono = 'El teléfono es requerido';
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors
        });
    }

    next();
};

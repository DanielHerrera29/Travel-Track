import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { testConnection } from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// ⚠️ ORDEN CRÍTICO DE MIDDLEWARES
// ============================================

// 1️⃣ Parsers de body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2️⃣ Cookie parser (ANTES de session)
app.use(cookieParser());

// 3️⃣ Configuración de sesiones (ANTES de las rutas)
app.use(session({
    secret: process.env.SESSION_SECRET || 'mi_session_secret_key_2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // false en desarrollo, true en producción con HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        sameSite: 'lax'
    }
}));

// 4️⃣ Archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// 5️⃣ Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 6️⃣ Logging middleware (opcional, para debug)
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
});

// ============================================
// 🛣️ RUTAS (DESPUÉS de configurar sesiones)
// ============================================

// Rutas principales (incluye auth)
app.use('/', routes);

// Rutas de administración
app.use('/api/admin', adminRoutes);

// ============================================
// ⚠️ MANEJO DE ERRORES
// ============================================

// 404 - Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.method} ${req.path}`
    });
});

// Error handler general
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// ============================================
// 🚀 INICIAR SERVIDOR
// ============================================

const startServer = async () => {
    try {
        await testConnection();

        app.listen(PORT, () => {
            console.log('\n╔═══════════════════════════════════════╗');
            console.log(`║  🚀 Servidor corriendo en puerto ${PORT} ║`);
            console.log('╚═══════════════════════════════════════╝');
            console.log(`📍 Web: http://localhost:${PORT}`);
            console.log(`📍 API: http://localhost:${PORT}/api/auth/login`);
            console.log('');
            console.log('🔑 Rutas disponibles:');
            console.log('   POST /api/auth/login   - Iniciar sesión');
            console.log('   POST /api/auth/logout  - Cerrar sesión');
            console.log('   GET  /api/auth/verify  - Verificar sesión');
            console.log('   GET  /api/admin/rutas  - Gestión de rutas (requiere auth)');
            console.log('\n✅ Sesiones configuradas correctamente\n');
        });
    } catch (error) {
        console.error('❌ Error al iniciar servidor:', error);
        process.exit(1);
    }
};

startServer();

export default app;
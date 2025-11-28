import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import rutasRoutes from './routes/rutasRoutes.js';
// ... otras rutas

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ============ CONFIGURACIÓN DE MIDDLEWARES ============
// ⚠️ ORDEN IMPORTANTE: Estos deben ir ANTES de las rutas

// 1. Parser de JSON y URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Cookie parser (necesario para sesiones)
app.use(cookieParser());

// 3. ✅ CONFIGURACIÓN DE SESIONES (CRÍTICO)
app.use(session({
    secret: process.env.SESSION_SECRET || 'tu-secreto-super-seguro-cambiar-en-produccion',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // ⚠️ false en desarrollo (HTTP), true en producción (HTTPS)
        httpOnly: true, // Protección contra XSS
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        sameSite: 'lax' // Protección CSRF
    },
    name: 'sessionId' // Nombre de la cookie (opcional, por defecto 'connect.sid')
}));

// 4. Middleware de logging para debug (temporal)
app.use((req, res, next) => {
    console.log(`📍 ${req.method} ${req.path}`);
    console.log('🍪 Cookies:', req.cookies);
    console.log('📦 Session:', req.session);
    console.log('---');
    next();
});

// 5. Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// 6. Motor de vistas (si usas EJS o similar)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ============ RUTAS API ============
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rutas', rutasRoutes);
// ... otras rutas API

// ============ RUTAS WEB (vistas HTML) ============
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'dashboard.html'));
});

app.get('/admin/rutas', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin', 'rutas.html'));
});

// ... otras rutas web

// ============ MANEJO DE ERRORES ============
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

// ============ INICIAR SERVIDOR ============
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📦 Sesiones configuradas correctamente`);
});

export default app;
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => res.render('index'));
router.get('/about', (req, res) => res.render('about'));
router.get('/contact', (req, res) => res.render('contact'));
router.get('/check-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        res.send(`BD funcionando. Resultado: ${rows[0].result}`);
    } catch (err) {
        res.send('Error conectando a MySQL: ' + err.message);
    }
});

export default router;

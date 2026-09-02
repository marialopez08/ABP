var _a, _b;
import express from 'express';
import cors from 'cors';
import { productsRouter } from './routes/products.routes.js';
import { ordersRouter } from './routes/orders.routes.js';
export const app = express();
app.use(cors({ origin: process.env.NODE_ENV === 'production' ? ((_b = (_a = process.env.FRONTEND_URL) === null || _a === void 0 ? void 0 : _a.split(',')) !== null && _b !== void 0 ? _b : []) : true, credentials: true }));
app.use(express.json({ limit: '100kb' }));
app.get('/health', (_req, res) => res.json({ ok: true, service: 'abp-backend' }));
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
app.use((error, _req, res, _next) => {
    console.error('[ABP backend]', error);
    res.status(500).json({ error: 'Error interno del servidor' });
});

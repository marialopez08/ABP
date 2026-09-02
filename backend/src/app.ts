import express, { type NextFunction, type Request, type Response } from 'express'
import cors from 'cors'
import { productsRouter } from './routes/products.routes.js'
import { ordersRouter } from './routes/orders.routes.js'
import { requireAuth } from './middleware/auth.js'

export const app = express()
app.use(cors({ origin: process.env.NODE_ENV === 'production' ? (process.env.FRONTEND_URL?.split(',') ?? []) : true, credentials: true }))
app.use(express.json({ limit: '100kb' }))
app.get('/health', (_req, res) => res.json({ ok: true, service: 'abp-backend' }))
// Rutas administrativas explícitas: deben montarse antes de las rutas públicas
// para que todas las operaciones del backoffice pasen por requireAuth.
app.use('/api/admin/products', requireAuth, productsRouter)
app.use('/api/admin/orders', requireAuth, ordersRouter)
app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)
app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }))
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ABP backend]', error)
  res.status(500).json({ error: 'Error interno del servidor' })
})

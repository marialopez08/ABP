import type { NextFunction, Request, Response } from 'express'
import { supabase } from '../lib/supabase.js'

export type AuthenticatedRequest = Request & { userId?: string; userEmail?: string }

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Autenticación requerida' })
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return res.status(401).json({ error: 'Sesión inválida o expirada' })
  req.userId = data.user.id
  req.userEmail = data.user.email
  next()
}

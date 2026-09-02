import { Router } from 'express'
import { z } from 'zod'
import { supabase } from '../lib/supabase.js'

const router = Router()
const productSchema = z.object({ name: z.string().trim().min(2).max(120), description: z.string().trim().max(500).default(''), price: z.coerce.number().nonnegative(), category: z.string().trim().min(2).max(60), stock: z.coerce.number().int().nonnegative(), image_url: z.string().trim().max(500).nullable().optional(), active: z.boolean().default(true) })
router.get('/', async (_req, res, next) => { try { const { data, error } = await supabase.from('products').select('id,name,description,price,category,image_url,stock,active').eq('active', true).order('created_at', { ascending: false }); if (error) throw error; res.json({ data: data ?? [] }) } catch (e) { next(e) } })
router.post('/', async (req, res, next) => { try { const parsed = productSchema.parse(req.body); const { data, error } = await supabase.from('products').insert(parsed).select().single(); if (error) throw error; res.status(201).json({ data }) } catch (e) { next(e) } })
router.patch('/:id', async (req, res, next) => { try { const parsed = productSchema.partial().parse(req.body); const { data, error } = await supabase.from('products').update({ ...parsed, updated_at: new Date().toISOString() }).eq('id', req.params.id).select().single(); if (error) throw error; res.json({ data }) } catch (e) { next(e) } })
router.delete('/:id', async (req, res, next) => { try { const { error } = await supabase.from('products').update({ active: false, updated_at: new Date().toISOString() }).eq('id', req.params.id); if (error) throw error; res.status(204).end() } catch (e) { next(e) } })
export { router as productsRouter }

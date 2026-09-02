var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
const productSchema = z.object({ name: z.string().trim().min(2).max(120), description: z.string().trim().max(500).default(''), price: z.coerce.number().nonnegative(), category: z.string().trim().min(2).max(60), stock: z.coerce.number().int().nonnegative(), image_url: z.string().trim().max(500).nullable().optional(), active: z.boolean().default(true) });
router.get('/', (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () { try {
    const { data, error } = yield supabase.from('products').select('id,name,description,price,category,image_url,stock,active').eq('active', true).order('created_at', { ascending: false });
    if (error)
        throw error;
    res.json({ data: data !== null && data !== void 0 ? data : [] });
}
catch (e) {
    next(e);
} }));
router.post('/', requireAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { try {
    const parsed = productSchema.parse(req.body);
    const { data, error } = yield supabase.from('products').insert(parsed).select().single();
    if (error)
        throw error;
    res.status(201).json({ data });
}
catch (e) {
    next(e);
} }));
router.patch('/:id', requireAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { try {
    const parsed = productSchema.partial().parse(req.body);
    const { data, error } = yield supabase.from('products').update(Object.assign(Object.assign({}, parsed), { updated_at: new Date().toISOString() })).eq('id', req.params.id).select().single();
    if (error)
        throw error;
    res.json({ data });
}
catch (e) {
    next(e);
} }));
router.delete('/:id', requireAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { try {
    const { error } = yield supabase.from('products').update({ active: false, updated_at: new Date().toISOString() }).eq('id', req.params.id);
    if (error)
        throw error;
    res.status(204).end();
}
catch (e) {
    next(e);
} }));
export { router as productsRouter };

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
const orderSchema = z.object({ customer_name: z.string().trim().min(2).max(120), customer_email: z.string().email().max(160), customer_phone: z.string().trim().max(30).optional(), delivery_address: z.string().trim().min(5).max(300), notes: z.string().trim().max(500).optional(), items: z.array(z.object({ product_id: z.string().uuid(), quantity: z.number().int().min(1).max(20) })).min(1).max(30) });
router.get('/', requireAuth, (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () { try {
    const { data, error } = yield supabase.from('orders').select('id,customer_name,customer_email,delivery_address,status,total,created_at,order_items(product_name,quantity,subtotal)').order('created_at', { ascending: false });
    if (error)
        throw error;
    res.json({ data: data !== null && data !== void 0 ? data : [] });
}
catch (e) {
    next(e);
} }));
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { try {
    const body = orderSchema.parse(req.body);
    const ids = [...new Set(body.items.map(i => i.product_id))];
    const { data: products, error: productError } = yield supabase.from('products').select('id,name,price,stock').in('id', ids).eq('active', true);
    if (productError)
        throw productError;
    if (!products || products.length !== ids.length)
        return res.status(400).json({ error: 'Uno o más productos no están disponibles' });
    const items = body.items.map(item => { const product = products.find(p => p.id === item.product_id); if (item.quantity > product.stock)
        throw new Error(`Stock insuficiente para ${product.name}`); return { product_id: product.id, product_name: product.name, unit_price: product.price, quantity: item.quantity, subtotal: Number(product.price) * item.quantity }; });
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const { items: _ } = body, order = __rest(body, ["items"]);
    const orderId = randomUUID();
    const { error } = yield supabase.from('orders').insert(Object.assign(Object.assign({ id: orderId }, order), { total, status: 'pending' }));
    if (error)
        throw error;
    const { error: itemsError } = yield supabase.from('order_items').insert(items.map(item => (Object.assign(Object.assign({}, item), { order_id: orderId }))));
    if (itemsError)
        throw itemsError;
    res.status(201).json({ data: Object.assign(Object.assign({ id: orderId }, order), { total, status: 'pending', created_at: new Date().toISOString() }) });
}
catch (e) {
    next(e);
} }));
router.patch('/:id/status', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { try {
    const status = z.enum(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']).parse(req.body.status);
    const { data, error } = yield supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', req.params.id).select().single();
    if (error)
        throw error;
    res.json({ data });
}
catch (e) {
    next(e);
} }));
export { router as ordersRouter };

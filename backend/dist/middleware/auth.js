var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { supabase } from '../lib/supabase.js';
export function requireAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const header = req.headers.authorization;
        const token = (header === null || header === void 0 ? void 0 : header.startsWith('Bearer ')) ? header.slice(7) : null;
        if (!token)
            return res.status(401).json({ error: 'Autenticación requerida' });
        const { data, error } = yield supabase.auth.getUser(token);
        if (error || !data.user)
            return res.status(401).json({ error: 'Sesión inválida o expirada' });
        req.userId = data.user.id;
        req.userEmail = data.user.email;
        next();
    });
}

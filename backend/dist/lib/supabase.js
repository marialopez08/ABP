var _a, _b, _c;
import { createClient } from '@supabase/supabase-js';
const url = (_a = process.env.SUPABASE_URL) !== null && _a !== void 0 ? _a : process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = (_c = (_b = process.env.SUPABASE_SERVICE_ROLE_KEY) !== null && _b !== void 0 ? _b : process.env.SUPABASE_SECRET_KEY) !== null && _c !== void 0 ? _c : process.env.SUPABASE_PUBLISHABLE_KEY;
if (!url || !key)
    throw new Error('Faltan variables de Supabase');
export const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

var _a;
import { app } from './app.js';
const port = Number((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 4000);
app.listen(port, () => console.log(`[ABP backend] API listening on ${port}`));

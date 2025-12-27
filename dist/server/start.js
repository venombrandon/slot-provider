"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const PORT = Number(process.env.PORT ?? 8787);
const app = (0, api_1.buildApi)();
app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`);
});

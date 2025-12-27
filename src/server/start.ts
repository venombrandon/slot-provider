import { buildApi } from "./api";

const PORT = Number(process.env.PORT ?? 8787);

const app = buildApi();
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});

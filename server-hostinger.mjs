import http from "node:http";
import { Readable } from "node:stream";
import worker from "./server/index.js";
const env = { SUPABASE_DB_URL: process.env.SUPABASE_DB_URL };

const port = Number(process.env.PORT || 3000);
const server = http.createServer(async (request, response) => {
  try {
    const origin = `http://${request.headers.host || "127.0.0.1"}`;
    const body = request.method === "GET" || request.method === "HEAD" ? undefined : Readable.toWeb(request);
    const webRequest = new Request(new URL(request.url || "/", origin), { method: request.method, headers: request.headers, body, duplex: body ? "half" : undefined });
    const result = await worker.fetch(webRequest, env, { waitUntil() {}, passThroughOnException() {} });
    response.statusCode = result.status;
    result.headers.forEach((value, key) => response.setHeader(key, value));
    if (result.body) Readable.fromWeb(result.body).pipe(response); else response.end();
  } catch (error) {
    console.error(error);
    response.statusCode = 500;
    response.end("Internal Server Error");
  }
});
server.listen(port, "0.0.0.0", () => console.log(`Hostinger Node server listening on ${port}`));

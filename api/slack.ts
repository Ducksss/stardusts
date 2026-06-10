import { handleSlackCommandRequest } from "../apps/slack-bot/src/http.js";

async function readRawBody(request: AsyncIterable<Buffer>): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

export default async function handler(request: any, response: any) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ error: "Method not allowed", ok: false });
    return;
  }

  const rawBody = await readRawBody(request);
  const result = handleSlackCommandRequest({
    headers: request.headers,
    rawBody,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
  });

  response.status(result.status).json(result.body);
}

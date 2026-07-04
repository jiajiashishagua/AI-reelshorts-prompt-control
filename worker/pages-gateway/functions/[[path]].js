import { handleRequest } from "../../src/index.mjs";

export function onRequest(context) {
  return handleRequest(context.request, context.env);
}

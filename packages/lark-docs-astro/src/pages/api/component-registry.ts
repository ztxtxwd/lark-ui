import type { APIRoute } from "astro";
import componentRegistry from "@lark-ui/core/ai/component-registry.json";

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(componentRegistry), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

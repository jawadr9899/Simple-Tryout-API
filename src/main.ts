/*
    [Un-optimized]
    A simple user CRUD REST API written in HONO 🔥
    With (Deno 2,Hono,SQLite)
*/

import { Hono } from "hono";
import { api } from "./routes/user.ts";

const app = new Hono();
const port = +(Deno.env.get("PORT")! || 3000);

// register route for api
app.route("/api", api);

// serve
Deno.serve({ port }, app.fetch);

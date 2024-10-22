import { type Context, Hono } from "hono";
import { db } from "../db/db.ts";
import type { User } from "../types/types.d.ts";

const api = new Hono();

api.get("/user", (ctx: Context) => {
    try {
        const users = db.query("SELECT * FROM users");
        return ctx.json(users, 200);
    } catch (error) {
        console.log(error);
        return ctx.json({ error: "Internal Server Error" }, 500);
    }
});

api.post("/user", async (ctx: Context) => {
    try {
        const { name, email, phone }: User = await ctx.req.json();
        db.query(
            `INSERT INTO users (name,email,phone) VALUES ('${name}','${email}',${phone});`,
        );
        return ctx.json({ success: true }, 201);
    } catch (error) {
        console.log(error);
        return ctx.json({ error: "Internal Server Error" }, 500);
    }
});

api.get("/user/:id", (ctx: Context) => {
    const id = ctx.req.param("id");
    const result = db.query(`SELECT * FROM users WHERE id = ${id}`);
    return ctx.json({ success: true, result }, 201);
});
api.put("/user/:id", async (ctx: Context) => {
    const id = ctx.req.param("id");
    const result = db.queryEntries(`SELECT * FROM users WHERE id = ${id}`)[0];
    const body: User = await ctx.req.json();
    const toBeUpdated: string[] = [];
   /*brute force approach: */ delete result?.id;
    for (const k in result) {
        // altenate syntax for id removal: if (k === "id") continue; 
        if (result[k as keyof User] !== body[k as keyof User]) { 
            console.log(result[k as keyof User], body[k as keyof User]);
            toBeUpdated.push(`${k} = '${body[k as keyof User]}'`);
        }
    }
    db.query(`UPDATE users SET ${toBeUpdated.join(",")} WHERE id = ${id};`);
    return ctx.json({ success: true, result: { id, ...body } }, 201);
});

api.delete("/user/:id", (ctx: Context) => {
    const id = ctx.req.param("id");
    db.query(`DELETE FROM users WHERE id = ${id};`);
    return ctx.json({ success: true }, 200);
});

export { api };

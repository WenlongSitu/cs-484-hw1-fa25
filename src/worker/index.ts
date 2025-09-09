import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { users } from "../../db/schema";
import { desc } from "drizzle-orm";

const app = new Hono<{ Bindings: Env }>();

// TODO: change "Cloudflare" to your NetID
app.get("/api/name", (c) => c.json({ name: String("wsitu2") }));

app.get("/api/highScore", async (c) => {
  const db = drizzle(c.env.DB);
  // TODO: Get the maximum score from the users table
  const highScore = await db
    .select({
      score: users.score,
    })
    .from(users)
    .orderBy(desc(users.score));
  return c.json({ highScore: highScore[0] ? highScore[0].score : 0 });
});

app.post("/api/highScore", async (c) => {
  const db = drizzle(c.env.DB);
  const { score } = await c.req.json<{ score: number }>();

  // TODO: Validate the score and if invalid, return 400 status code
  if (score < 0 || score == null || !Number.isInteger(score)) {
    return c.json({ message: "Invalid Score" }, 400);
  }

  //TODO: Insert the score into the users table
  const result = await db.insert(users).values({ score: score });
  [{ score }];
  //TODO: Return the inserted score with a success message
  return c.json({
    score: result,
    message: "score sucessfully inserted",
  });
});

export default app;

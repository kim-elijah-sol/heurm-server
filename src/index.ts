import { PrismaClient } from "@prisma/client";
import { Elysia } from "elysia";

const app = new Elysia();

const prisma = new PrismaClient();

app.get("/", () => "Hello Elysia");
app.get("/users", async () => {
  const users = await prisma.user.findMany();
  return users;
});
app.listen(3000, () => {
  console.log("[Win Yourself]:: Server Start 3000 port");
});

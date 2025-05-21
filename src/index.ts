import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello Elysia").listen(3000, () => {
  console.log("[Win Yourself]:: Server Start 3000 port")
});

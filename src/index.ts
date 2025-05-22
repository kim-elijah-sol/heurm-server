import { Elysia } from "elysia";

const app = new Elysia();

app.get("/", () => "Hello Elysia");
app.listen(3000, () => {
  console.log("[Win Yourself]:: Server Start 3000 port");
});

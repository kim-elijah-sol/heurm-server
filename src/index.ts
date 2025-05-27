import { PrismaClient } from "@prisma/client";
import { Elysia, t } from "elysia";
import { v } from "./lib/validator";

const app = new Elysia();

const prisma = new PrismaClient();

app.group('/user', (app) => 
  app.get('/check-email', async ({ query: { email }, set }) => {
    const 이미_가입된_계정 =  await prisma.user.findUnique({
      select: {
        id: true,
      },
      where: {
        email
      }
    })

    if (이미_가입된_계정 !== null) {
      set.status = 409

      throw new Error('Already joined email address.')
    }

    return {}
    
  }, {
    query: t.Object({
      email: v.isEmail
    })
  })
)
app.listen(3000, () => {
  console.log("[Win Yourself]:: Server Start 3000 port");
});

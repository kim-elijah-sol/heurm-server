import { t } from "elysia";

export const isEmail = t.String({
    format: 'email'
})
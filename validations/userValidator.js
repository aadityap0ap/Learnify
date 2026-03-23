const { z } = require("zod");

const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(2),
    lastName: z.string().min(2)
}).strict();


module.exports = {
    userSchema
};
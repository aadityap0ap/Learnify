const { z } = require("zod");

const adminSchema = z.object({
    email : z.string().email(),
    password : z.string().min(6),
    firstName : z.string().min(4),
    lastName : z.string().min(2)
})

module.exports = {
    adminSchema
}
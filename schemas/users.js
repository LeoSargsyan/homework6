import joi from "joi";

export default {
    register: joi.object({
        login: joi.string().min(3).max(50).required(),
        password: joi.string().min(3).max(50).required(),
    }),
    login: joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    })
}

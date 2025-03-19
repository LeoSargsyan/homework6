import db from "auth-project/clients/db.mysql.js"
export default {
    async findAll(){

    },
    async create(login, password, dob){
        const data = await db.query(`
            INSERT INTO users (login, password, dob) 
            VALUES (?, ?, ?)
        `, [login, password, dob])

        console.log(data)
        return data;
    }
}
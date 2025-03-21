import db from '../auth-project/clients/db.mysql.js';



(async () => {
    try{
    await db.query(`
        CREATE TABLE IF NOT EXISTS users 
        (
            id          int        not null auto_increment primary key,
            login      VARCHAR(100) not null unique,
            password   VARCHAR(100) not null,
            dob        date
        )
    `);
        await db.query(`
        CREATE TABLE IF NOT EXISTS tasks 
        (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            date DATE NOT NULL
        )
    `);
        console.log("Successfully created tasks");
        } catch (error) {
        console.error("Error creating tables", error);
    }

})();
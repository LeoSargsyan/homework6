import mysql from 'mysql2';
const {
    DB_HOST,
    DB_USER,
    DB_USER_PASSWORD,
    DB_NAME
} = process.env;


const dbConfig = {
    host: DB_HOST,
    user: DB_USER,
    password: DB_USER_PASSWORD,
    database: DB_NAME
};

const connection = mysql.createConnection(dbConfig);

export default connection.promise();

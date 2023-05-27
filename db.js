const Pool = require("pg").Pool;

const pool = new Pool({
    user : "postgres",
    password : "postgres",
    host : "localhost",
    port : 5432,
    database : "airline_ticket_booking"
}); 


module.exports = pool;
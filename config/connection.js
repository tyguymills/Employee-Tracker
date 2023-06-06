const mysql = require('mysql');

// const connection = mysql.createConnection({
//   host: 'localhost',
//   port: 3001,
//   user: 'root',
//   password: 'Tyler12345',
//   database: 'employees'
// });
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "employeeTracker",
    waitForConnections: true,
    connectionLimit: 10,
  });

module.exports = connection;
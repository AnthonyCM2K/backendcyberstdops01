const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'wolfteam158',
    database: 'db_cyberstdops'
});

db.connect(function(err) {
    if (err) throw err;
    console.log('DATABASE CONNECTED!');
});

module.exports = db; //exportar objeto db y usarlo en cuaquier parte 
const mysql = require("mysql")
const Database = new mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "Mad Bot"
})

Database.connect(function(err) {

    if(err) throw err;

    console.log("La base de données a été connectée avec succès !")
})

module.exports = Database;
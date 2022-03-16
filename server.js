const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql");
const cors = require("cors");

const port = 2500;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "video club-db",
});

db.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }

    console.log("concetado al servidor con el id" + db.threadId);
});

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("vista", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/paginita", (req, res) => {
    let sql = `SELECT * FROM peliculas`;
    db.query(sql, (err, data, fields) => {
        if (err) throw err;
        let send = {
            status: 200,
            data,
            message: "lista de peliculas",
        };
        let largo = data.length;
        res.render("index", { data: data, largo: largo });
    });
});

app.get("/formulario", (req, res) => {
    res.render("formulario");
});

app.listen(port, () => {
    console.log("el puerto anda mortal ");
});

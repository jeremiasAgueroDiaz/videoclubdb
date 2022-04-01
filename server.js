const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql");
const cors = require("cors");
const Swal = require("sweetalert2");

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

app.get("/Login", (req, res) => {
    res.render("Login");
});
app.post("/newuser", (req, res) => {
    let sql = `INSERT INTO usuarios(usuario,contraseña) VALUES (?)`;
    let values = [req.body.usuario, req.body.contraseña];
    db.query(sql, [values], function (err, data, fields) {
        if (err) throw err;
        res.render("formulario", { isAdded: true });
    });
});

app.post("/new", (req, res) => {
    let sql = `INSERT INTO peliculas(nombre, director, isan, recaudacion, genero, estreno, premios) VALUES (?)`;
    let values = [
        req.body.nombre,
        req.body.director,
        req.body.isan,
        req.body.recaudacion,
        req.body.genero,
        req.body.estreno,
        req.body.premios,
    ];
    db.query(sql, [values], function (err, data, fields) {
        if (err) throw err;
        res.render("formulario", { isAdded: true });
    });
});

app.listen(port, () => {
    console.log("el puerto anda mortal ");
});

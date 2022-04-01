const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql");
const cors = require("cors");
const Swal = require("sweetalert2");
const bcrypt = require("bcrypt");
const session = require("express-session");
const port = 2070;
let creado = false;

app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
    })
);

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

app.get("/videoclub", (req, res) => {
    Swal.fire("Esta es una alerta");
    let sql = `SELECT * FROM peliculas`;
    db.query(sql, (err, data, fields) => {
        if (err) throw err;
        let send = {
            status: 200,
            data,
            message: "lista de peliculas",
        };

        res.render("index", { data: data, creado: creado });
    });
});

app.get("/formulario", (req, res) => {
    res.render("formulario");
});

app.get("/login", (req, res) => {
    res.render("Login");
});

app.post("/user", (req, res) => {
    let sql = `SELECT contraseña FROM usuarios WHERE usuario = ?`;
    let contraseña = req.body.contraseña;
    db.query(sql, [req.body.usuario], (err, data, fields) => {
        if (err) throw err;
        bcrypt.compare(contraseña, data[0].contraseña, function (err, result) {
            if (err) throw err;
            if (result == true) {
                creado = true;
                res.redirect("/videoclub");
            } else {
                creado = false;
                console.log("que carajos intentas?");
                res.redirect("/login");
            }
        });
    });
});

app.get("/SingOut", (req, res) => {
    req.session.destroy(function (err) {
        console.log("Destruido pete");
    });
    res.redirect("login");
});

app.get("/SingUp", (req, res) => {
    res.render("SingUp");
});

app.post("/newuser", (req, res) => {
    let sql = `INSERT INTO usuarios(usuario, contraseña) VALUES (?)`;
    let sql2 = `SELECT * FROM usuarios`;
    db.query(sql2, function (err, data, fields) {
        if (err) throw err;
        let exsiste = false;
        data.forEach((x) => {
            if (x.usuario == req.body.usuario) {
                exsiste = true;
                res.render("NuevoUsuario");
            }
        });
        if (exsiste == false) {
            let encriptado = 0;
            bcrypt.hash(req.body.contraseña, 10, function (err, encriptado) {
                let values = [req.body.usuario, encriptado];
                db.query(sql, [values], function (err, data, fields) {
                    if (err) throw err;
                    res.redirect("/videoclub");
                });
            });
        }
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
        res.render("formulario");
    });
});

app.listen(port, () => {
    console.log("el puerto anda mortal ");
});

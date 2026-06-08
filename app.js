import 'dotenv/config';
import express from "express";
const app = express();

//Contantes
const PORT = process.env.PORT;
const HOST = process.env.HOST || "localhost";

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Motor de plantillas
app.set("view engine", "pug");
app.set("views", "./views");

//Rutas
app.get("/", (req, res) => {
    res.render("app", { title: "Fotaza", message: "Bienvenido a Fotaza!" });
});

//Servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

import express from "express";
import apiRouter from "./routes/index.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

//este archivo SOLO configura express. No levanta el server ni define rutas sueltas,
//de eso se encargan server.js y los routers
const app = express();

//sin esto req.body llega undefined en los POST y PUT
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

//los dos ultimos, y en este orden: primero el 404, despues el manejador de errores
app.use(notFound);
app.use(errorHandler);

export default app;

import mongoose from "mongoose";
import { env } from "./env.js";

//la conexion va aca y no adentro de una ruta, asi la reutilizo y server.js queda limpio
export async function connectDB() {
    await mongoose.connect(env.MONGO_URL);
}

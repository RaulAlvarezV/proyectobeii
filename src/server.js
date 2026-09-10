import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

//conecto la base ANTES de escuchar. Si la base no responde no quiero un server
//levantado que le conteste 500 a todo el mundo
try {
    await connectDB();
    console.log("Conectado a MongoDB");

    app.listen(env.PORT, () => {
        console.log(`Servidor activo en http://localhost:${env.PORT} (${env.NODE_ENV})`);
    });
} catch (error) {
    console.error("No se pudo iniciar el servidor:", error.message);
    process.exit(1);
}

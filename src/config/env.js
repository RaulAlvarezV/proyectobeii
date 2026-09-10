import { config } from "dotenv";

//el quiet es para que dotenv no me imprima su banner de publicidad en cada arranque
config({ quiet: true });

//si falta alguna de estas no tiene sentido arrancar, prefiero que reviente aca
//con un mensaje claro y no despues contra la base
const required = ["MONGO_URL"];
const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno: ${missing.join(", ")}. Revisar el archivo .env`);
}

export const env = {
    PORT: Number(process.env.PORT) || 8080,
    NODE_ENV: process.env.NODE_ENV || "development",
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET
};

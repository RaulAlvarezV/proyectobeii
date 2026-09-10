import { Schema, model } from "mongoose";

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        //el unique arma un indice en mongo, es la red de seguridad por si se me escapa
        //la validacion del service (por ejemplo si dos registros entran al mismo tiempo)
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    //los roles del curso son admin/organizer/user, los adapto al club:
    //coach es el organizer (cuerpo tecnico) y player es el user (la jugadora).
    //el default es player, nadie se registra siendo otra cosa
    role: {
        type: String,
        enum: ["admin", "coach", "player"],
        default: "player"
    }
}, { timestamps: true });

export const userModel = model("User", userSchema);

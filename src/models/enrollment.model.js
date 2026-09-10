import { Schema, model, Types } from "mongoose";

const enrollmentSchema = new Schema({
    user: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    event: {
        type: Types.ObjectId,
        ref: "Event",
        required: true
    },
    status: {
        type: String,
        enum: ["confirmada", "cancelada"],
        default: "confirmada"
    }
}, { timestamps: true });

//indice unico sobre los dos campos juntos: una jugadora no puede estar
//anotada dos veces en la misma actividad
enrollmentSchema.index({ user: 1, event: 1 }, { unique: true });

export const enrollmentModel = model("Enrollment", enrollmentSchema);

import { Schema, model, Types } from "mongoose";

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        enum: ["entrenamiento", "amistoso", "clinica", "torneo"],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    place: {
        type: String,
        required: true,
        trim: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    category: {
        type: Types.ObjectId,
        ref: "Category"
    },
    organizer: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["programado", "cancelado", "finalizado"],
        default: "programado"
    }
}, { timestamps: true });

export const eventModel = model("Event", eventSchema);

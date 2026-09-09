function translate(error) {
    if (error.status) {
        return { status: error.status, message: error.message };
    }

    if (error.name === "ValidationError") {
        return { status: 400, message: Object.values(error.errors).map(e => e.message).join(", ") };
    }

    if (error.name === "CastError") {
        return { status: 400, message: `El valor de ${error.path} no es válido` };
    }

    if (error.code === 11000) {
        return { status: 409, message: `Ya existe un registro con ${Object.keys(error.keyValue).join(", ")}` };
    }

    return { status: 500, message: "Error interno del servidor" };
}

export function errorHandler(error, req, res, next) {
    const { status, message } = translate(error);

    if (status === 500) {
        console.error(error);
    }

    res.status(status).json({ status: "error", error: message });
}

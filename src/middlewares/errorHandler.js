//aca traduzco cualquier error que me llegue de los services a un codigo http.
//la idea es que los controllers no tengan que pensar en status, solo hacen next(error)
function translate(error) {
    //los HttpError son los que tiro yo a mano desde los services, ya vienen con el status
    if (error.status) {
        return { status: error.status, message: error.message };
    }

    //estos tres los tira mongoose solo
    if (error.name === "ValidationError") {
        return { status: 400, message: Object.values(error.errors).map(e => e.message).join(", ") };
    }

    if (error.name === "CastError") {
        return { status: 400, message: `El valor de ${error.path} no es válido` };
    }

    //11000 es el error de indice unico repetido, va como conflicto
    if (error.code === 11000) {
        return { status: 409, message: `Ya existe un registro con ${Object.keys(error.keyValue).join(", ")}` };
    }

    return { status: 500, message: "Error interno del servidor" };
}

//los 4 parametros son obligatorios, es la forma en que express reconoce
//que este middleware es el de errores y no uno comun
export function errorHandler(error, req, res, next) {
    const { status, message } = translate(error);

    //si es un 500 es un error mio que no previne, lo quiero ver entero en la consola.
    //hacia afuera igual mando un mensaje generico para no filtrar datos del server
    if (status === 500) {
        console.error(error);
    }

    res.status(status).json({ status: "error", message });
}

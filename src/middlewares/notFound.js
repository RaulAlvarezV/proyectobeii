//este va ultimo en app.js: si la peticion llego hasta aca es porque ningun router la agarro
export function notFound(req, res) {
    res.status(404).json({
        status: "error",
        message: `No existe la ruta ${req.method} ${req.originalUrl}`
    });
}

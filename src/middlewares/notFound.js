export function notFound(req, res) {
    res.status(404).json({
        status: "error",
        error: `No existe la ruta ${req.method} ${req.originalUrl}`
    });
}

const pending = {
    status: "error",
    error: "La autenticación se implementa en la próxima entrega"
};

export function register(req, res) {
    res.status(501).json(pending);
}

export function login(req, res) {
    res.status(501).json(pending);
}

export function current(req, res) {
    res.status(501).json(pending);
}

export function logout(req, res) {
    res.status(501).json(pending);
}

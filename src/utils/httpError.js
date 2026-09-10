//un Error comun pero con el codigo http adentro, asi el service dice "esto es un 409"
//y el errorHandler no tiene que adivinar
export class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

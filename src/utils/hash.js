import bcrypt from "bcryptjs";

//el salt es un texto random que bcrypt le suma al password antes de hashear
//gracias a eso dos passwords iguales quedan guardados distinto en la base
const SALT_ROUNDS = 10;

export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);

    return bcrypt.hash(password, salt);
}

//esta la voy a necesitar en el login de la proxima entrega
export async function isValidPassword(password, hash) {
    return bcrypt.compare(password, hash);
}

# Field Vision API

Proyecto de Backend II (Coderhouse). API REST para gestionar las actividades de un club de hockey
sobre césped y las inscripciones de las jugadoras.

## Temática elegida

La consigna del curso plantea una plataforma de eventos e inscripciones. Acá está aplicada al club:
los "eventos" son las actividades que organiza el cuerpo técnico (entrenamientos, amistosos,
clínicas y torneos) y las "inscripciones" son las jugadoras que se anotan a cada una.

Esto sale de Field Vision, un SaaS de gestión para clubes de hockey que vengo desarrollando aparte.
La API de esta cursada es el módulo de eventos de ese sistema, resuelto en Node en vez de Firebase,
que es lo que usa la app actual.

Dos decisiones que vienen de la temática:

- La entidad de la consigna se llama `Enrollment` (inscripción) y no `Ticket`. En un club las
  jugadoras se anotan a una actividad, no compran una entrada, así que el evento no tiene precio.
- Los roles llevan el nombre que se usa en el club. La equivalencia con los del curso es directa:

| Rol del curso | Rol acá | Quién es |
|---|---|---|
| `admin` | `admin` | Dirigencia del club |
| `organizer` | `coach` | Cuerpo técnico: crea y administra las actividades |
| `user` | `player` | Jugadora: consulta actividades y se anota |

Estado actual: la base por capas está armada y el registro de usuarias funciona con validaciones,
normalización de email y hash con bcrypt. Falta el login con JWT, las cookies, Passport y el
control de permisos por rol.

## Tecnologías

- Node.js 20 o superior (usa top level await y `node --watch`)
- Express 5
- MongoDB + Mongoose 9
- bcryptjs para el hash de contraseñas
- dotenv
- Módulos ESM (`import` / `export`)

## Instalación

```bash
git clone https://github.com/RaulAlvarezV/proyectobeii.git
cd proyectobeii
npm install
```

## Variables de entorno

Copiar `.env.example` a `.env` y completar los valores. El archivo `.env` no se sube al repositorio.

```bash
cp .env.example .env
```

| Variable | Descripción | Obligatoria |
|---|---|---|
| `PORT` | Puerto del servidor. Si no se define, usa 8080 | No |
| `NODE_ENV` | `development` o `production` | No |
| `MONGO_URL` | Cadena de conexión de MongoDB, local o Atlas | Sí |
| `JWT_SECRET` | Clave para firmar los tokens. Se empieza a usar en la entrega 2 | No |

En desarrollo se puede usar una instancia local:

```
MONGO_URL=mongodb://localhost:27017/FieldVision
```

`src/config/env.js` valida al arrancar que estén las variables obligatorias. Si falta alguna, el
proceso corta con un mensaje claro en vez de fallar más adelante contra la base.

## Cómo ejecutar

```bash
npm run dev     # modo desarrollo, reinicia ante cambios
npm start       # modo normal
```

Si conecta bien, la consola muestra:

```
Conectado a MongoDB
Servidor activo en http://localhost:8080 (development)
```

Prueba rápida:

```bash
curl http://localhost:8080/api/health
```

```json
{ "status": "ok", "message": "Servidor activo" }
```

## Estructura de carpetas

```
proyectoBEII/
├── src/
│   ├── app.js                      configura Express y monta los routers
│   ├── server.js                   conecta la base y levanta el servidor
│   ├── config/
│   │   ├── env.js                  carga y valida variables de entorno
│   │   └── db.js                   conexión a MongoDB
│   ├── routes/
│   │   ├── index.js                agrupa los routers bajo /api
│   │   ├── health.router.js
│   │   ├── sessions.router.js
│   │   ├── users.router.js
│   │   ├── events.router.js
│   │   └── enrollments.router.js
│   ├── controllers/
│   │   ├── health.controller.js
│   │   ├── sessions.controller.js
│   │   ├── users.controller.js
│   │   ├── events.controller.js
│   │   └── enrollments.controller.js
│   ├── services/
│   │   ├── index.js                arma las dependencias e inyecta
│   │   ├── sessions.service.js     registro: validación, normalización y hash
│   │   ├── users.service.js
│   │   ├── events.service.js
│   │   └── enrollments.service.js
│   ├── repositories/
│   │   ├── users.repository.js
│   │   ├── events.repository.js
│   │   └── enrollments.repository.js
│   ├── dao/
│   │   ├── mongo.dao.js            CRUD genérico contra un modelo de Mongoose
│   │   └── users.dao.js            agrega las búsquedas por email
│   ├── models/
│   │   ├── user.model.js
│   │   ├── category.model.js
│   │   ├── event.model.js
│   │   └── enrollment.model.js
│   ├── middlewares/
│   │   ├── notFound.js
│   │   └── errorHandler.js
│   └── utils/
│       ├── hash.js                 bcrypt reutilizable
│       ├── httpError.js
│       └── validators.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Arquitectura por capas

El flujo de una petición es:

```
cliente -> router -> controller -> service -> repository -> dao -> modelo -> MongoDB
```

Qué hace cada capa:

- **Router**: define la URL y el método, y apunta al controlador. No tiene lógica.
- **Controller**: lee `req`, llama al servicio y arma la respuesta. Los errores no se imprimen
  con `console.log`, se pasan con `next(error)` al middleware central.
- **Service**: reglas de negocio y validaciones. Lanza `HttpError` con el código que corresponde.
- **Repository**: coordina los accesos a datos y decide qué forma tiene lo que sale de la capa de
  persistencia. `UserRepository` hace de DTO: arma a mano el objeto que sale de la API, así el
  `password` no puede escaparse por descuido en ninguna respuesta.
- **DAO**: habla con Mongoose. Es lo único que cambiaría si mañana la persistencia fuera otra.
- **Modelo**: el schema de la colección.

Las dependencias no se importan dentro de cada clase, se pasan por constructor. El armado está
todo junto en `src/services/index.js`, que es el único archivo que sabe qué modelo va con qué DAO:

```js
const eventRepository = new EventRepository(new MongoDao(eventModel));
export const eventService = new EventService(eventRepository);
```

Gracias a eso, para testear un servicio alcanza con pasarle un repositorio falso, sin levantar
Mongo.

`app.js` solamente configura Express. No define rutas ni levanta el servidor: de eso se encarga
`server.js`.

## Formato de las respuestas

Todas las respuestas usan el mismo envoltorio.

```json
{ "status": "success", "payload": [] }
```

```json
{ "status": "error", "message": "Evento no encontrado" }
```

Códigos que devuelve la API:

| Código | Cuándo |
|---|---|
| 200 | Operación correcta |
| 201 | Recurso creado |
| 400 | Datos o ids inválidos |
| 404 | Recurso o ruta inexistente |
| 409 | Conflicto (email ya registrado, inscripción duplicada, evento sin cupo) |
| 500 | Error interno |
| 501 | Endpoint todavía no implementado (login, current, logout) |

El middleware `errorHandler` también traduce los errores propios de Mongoose: `ValidationError` y
`CastError` salen como 400 y el error de índice duplicado como 409.

## Rutas disponibles

Base: `/api`

### Health

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Confirma que el servidor está activo |

### Events

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/events` | Lista actividades. Filtros opcionales: `?type=`, `?status=`, `?category=` |
| GET | `/api/events/:eid` | Devuelve una actividad |
| POST | `/api/events` | Crea una actividad |
| PUT | `/api/events/:eid` | Edita una actividad |
| DELETE | `/api/events/:eid` | Elimina una actividad |

### Enrollments

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/enrollments` | Lista inscripciones. Filtros opcionales: `?event=`, `?user=` |
| GET | `/api/enrollments/:enid` | Devuelve una inscripción |
| POST | `/api/enrollments/:uid/:eid` | Inscribe a una jugadora en una actividad |

### Users

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/users` | Lista usuarios sin la contraseña |
| GET | `/api/users/:email` | Busca un usuario por email |
| PUT | `/api/users/:email` | Edita `first_name`, `last_name` o `role` |

### Sessions

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/sessions/register` | Registra una usuaria nueva |
| POST | `/api/sessions/login` | Todavía responde 501 |
| GET | `/api/sessions/current` | Todavía responde 501 |
| POST | `/api/sessions/logout` | Todavía responde 501 |

#### POST /api/sessions/register

Campos que espera, los cuatro obligatorios:

| Campo | Tipo | Validación |
|---|---|---|
| `first_name` | string | Requerido |
| `last_name` | string | Requerido |
| `email` | string | Requerido, formato válido, único. Se guarda con trim y en minúsculas |
| `password` | string | Requerido, mínimo 6 caracteres. Se guarda hasheado con bcrypt |

El campo `role` **se ignora si viene en el body**. Toda usuaria que se registra queda como
`player`; los roles `coach` y `admin` se asignan aparte. Si no fuera así, cualquiera podría
registrarse como administradora del club.

Cómo probarlo:

```bash
curl -X POST http://localhost:8080/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Ana","last_name":"Pérez","email":"Ana@Mail.com ","password":"Secreta123"}'
```

Respuesta `201`, con el email ya normalizado y sin el campo `password`:

```json
{
  "status": "success",
  "payload": {
    "id": "6aa2c31b45e4276af5134f05",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@mail.com",
    "role": "player"
  }
}
```

Errores posibles:

```json
{ "status": "error", "message": "Faltan campos obligatorios" }
{ "status": "error", "message": "El email no tiene un formato válido" }
{ "status": "error", "message": "El password debe tener al menos 6 caracteres" }
{ "status": "error", "message": "El email ya está registrado" }
```

Los tres primeros son `400`, el último `409`.

Un detalle del orden: el email se normaliza **antes** de validarlo y antes de buscarlo en la base.
Si se valida primero, un email como `"Ana@Mail.com "` lo rechaza el regex por el espacio del final;
y si se busca sin normalizar, no coincide con el `ana@mail.com` que ya está guardado y termina
entrando duplicado.

| Método | Ruta |
|---|---|
| POST | `/api/sessions/register` |
| POST | `/api/sessions/login` |
| GET | `/api/sessions/current` |
| POST | `/api/sessions/logout` |

## Ejemplos de uso

Crear una actividad:

```bash
curl -X POST http://localhost:8080/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Entrenamiento Sub-16",
    "type": "entrenamiento",
    "date": "2026-09-15T19:00:00.000Z",
    "place": "Cancha 1",
    "capacity": 22,
    "organizer": "68b0f1c2a4e5d6f7a8b9c0d1"
  }'
```

Listar solo los amistosos programados:

```bash
curl "http://localhost:8080/api/events?type=amistoso&status=programado"
```

Inscribir a una jugadora:

```bash
curl -X POST http://localhost:8080/api/enrollments/68b0f1c2a4e5d6f7a8b9c0d1/68b0f2aa4e5d6f7a8b9c0d22
```

Si el evento ya está completo, responde 409:

```json
{ "status": "error", "message": "El evento no tiene cupo disponible" }
```

## Modelo de datos

**User**: `first_name`, `last_name`, `email` (único, guardado en minúsculas), `password` (hasheado
con bcrypt, nunca en texto plano), `role` (`admin` | `coach` | `player`, por defecto `player`).

**Category**: `name` (único), `description`. Representa la categoría del club: Sub-14, Sub-16,
Primera.

**Event**: `title`, `description`, `type` (`entrenamiento` | `amistoso` | `clinica` | `torneo`),
`date`, `place`, `capacity`, `category`, `organizer`, `status` (`programado` | `cancelado` |
`finalizado`).

**Enrollment**: `user`, `event`, `status` (`confirmada` | `cancelada`). Tiene un índice único sobre
`user` + `event` para que una jugadora no quede anotada dos veces en la misma actividad.

## Reglas de negocio implementadas

Están en la capa de servicios, no en los controladores ni en las rutas.

- No se puede registrar dos veces el mismo email, aunque venga con otras mayúsculas o con espacios.
- La contraseña se guarda hasheada con bcrypt, nunca en texto plano.
- El `role` no se puede elegir desde el body del registro.
- No se puede inscribir a una jugadora en un evento que no está `programado`.
- No se puede inscribir dos veces a la misma jugadora en el mismo evento.
- No se puede inscribir si ya se llegó a `capacity`.
- La API nunca devuelve el campo `password`.

## Pendiente para las próximas entregas

- Login con JWT y cookies.
- Passport y estrategia `current`.
- Middlewares de autorización por rol.
- DTOs propios para cada respuesta.
- CRUD de categorías.
- Recuperación de contraseña por mail.

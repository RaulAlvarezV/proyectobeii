import { userModel } from "../models/user.model.js";
import { eventModel } from "../models/event.model.js";
import { enrollmentModel } from "../models/enrollment.model.js";

import { MongoDao } from "../dao/mongo.dao.js";
import { UserDao } from "../dao/users.dao.js";

import { UserRepository } from "../repositories/users.repository.js";
import { EventRepository } from "../repositories/events.repository.js";
import { EnrollmentRepository } from "../repositories/enrollments.repository.js";

import { UserService } from "./users.service.js";
import { SessionsService } from "./sessions.service.js";
import { EventService } from "./events.service.js";
import { EnrollmentService } from "./enrollments.service.js";

//este es el unico archivo que sabe que modelo va con que DAO y que DAO va con que repository.
//las clases de arriba no importan nada entre ellas, reciben todo por el constructor.
//asi despues puedo testear un service pasandole un repository de mentira, sin levantar mongo
const userRepository = new UserRepository(new UserDao(userModel));
const eventRepository = new EventRepository(new MongoDao(eventModel));
const enrollmentRepository = new EnrollmentRepository(new MongoDao(enrollmentModel));

export const userService = new UserService(userRepository);
export const sessionsService = new SessionsService(userRepository);
export const eventService = new EventService(eventRepository);
export const enrollmentService = new EnrollmentService(enrollmentRepository, eventService, userRepository);

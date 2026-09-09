import { userModel } from "../models/user.model.js";
import { eventModel } from "../models/event.model.js";
import { enrollmentModel } from "../models/enrollment.model.js";

import { MongoDao } from "../dao/mongo.dao.js";
import { UserDao } from "../dao/user.dao.js";

import { UserRepository } from "../repositories/user.repository.js";
import { EventRepository } from "../repositories/event.repository.js";
import { EnrollmentRepository } from "../repositories/enrollment.repository.js";

import { UserService } from "./user.service.js";
import { EventService } from "./event.service.js";
import { EnrollmentService } from "./enrollment.service.js";

const userRepository = new UserRepository(new UserDao(userModel));
const eventRepository = new EventRepository(new MongoDao(eventModel));
const enrollmentRepository = new EnrollmentRepository(new MongoDao(enrollmentModel));

export const userService = new UserService(userRepository);
export const eventService = new EventService(eventRepository);
export const enrollmentService = new EnrollmentService(enrollmentRepository, eventService, userRepository);

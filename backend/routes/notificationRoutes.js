import Router from 'express'
import { passport } from "../authUtils.js"
import { checkUser } from '../utils.js';
import { getMyNotifications, getMyNotificationsCount, markNotificationsAsRead } from '../controllers/notificationController.js';


const notificationRouter = Router();

notificationRouter.get("/count", passport.authenticate('jwt', { session: false }), checkUser, getMyNotificationsCount);
notificationRouter.get("/", passport.authenticate('jwt', { session: false }), checkUser, getMyNotifications);
notificationRouter.patch("/", passport.authenticate('jwt', { session: false }), checkUser, markNotificationsAsRead);


export default notificationRouter;
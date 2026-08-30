import Router from 'express'
import { passport } from "../authUtils.js"
import { checkUser } from '../utils.js';
import { getMyNotifications } from '../controllers/notificationController.js';


const notificationRouter = Router();

notificationRouter.get("/", passport.authenticate('jwt', { session: false }), checkUser, getMyNotifications);


export default notificationRouter;
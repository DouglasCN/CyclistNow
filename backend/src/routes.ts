import express from 'express';

import multer from 'multer';
import multerConfig from './config/multer'

import CyclistController from './controllers/CyclistController';
import MeetingPoint from './controllers/MeetingPointController';
import MyMeetingPoints from './controllers/MyMeetingPointsController';

const myMeetingPoints = new MyMeetingPoints();
const cyclistController = new CyclistController();
const meetingPoint = new MeetingPoint();

const routes = express.Router();
const upload = multer(multerConfig);

routes.post('/logon', cyclistController.index);

routes.post('/cyclist', cyclistController.create);
routes.delete('/cyclist/:id', cyclistController.delete);
routes.put('/cyclist', cyclistController.update);

routes.post('/meetingPoint', upload.single('image'), meetingPoint.create);
routes.get('/meetingPoint', meetingPoint.index);
routes.get('/meetingPoint/:id', meetingPoint.show);
routes.put('/meetingPoint', meetingPoint.update);
routes.delete('/meetingPoint/:id', meetingPoint.delete);

routes.get('/mymeetingpoints/:id', myMeetingPoints.index);
routes.get('/mymeetingpoints/', myMeetingPoints.show);
routes.post('/mymeetingpoints', myMeetingPoints.create);
routes.delete('/mymeetingpoints/:id', myMeetingPoints.delete);

export default routes;
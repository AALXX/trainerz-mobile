import express from 'express';
import { body, param } from 'express-validator';
import AccountVideoServices from '../../Services/VideoServices/AccountVideosServiceManager';

const router = express.Router();

router.post('/upload-video', body('VideoTitle').not().isEmpty().trim(), AccountVideoServices.UploadVideoFileToServer);


export = router;

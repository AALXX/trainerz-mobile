import express from 'express';
import { body, param } from 'express-validator';
import AccountVideoServices from '../../Services/VideoServices/AccountVideosServiceManager';

const router = express.Router();

router.post('/upload-video', body('VideoTitle').not().isEmpty().trim(), AccountVideoServices.UploadVideoFileToServer);
router.get('/get-account-videos/:UserPublicToken', param('UserPublicToken').not().isEmpty().trim(), AccountVideoServices.GetAccountVideos);

router.get('/get-video-data/:VideoToken', param('VideoToken').not().isEmpty().trim(), AccountVideoServices.GetVideoData);

router.post(
    '/update-video-data',
    body('UserPrivateToken').not().isEmpty().trim(),
    body('VideoToken').not().isEmpty().trim(),
    body('VideoTitle').not().isEmpty().trim(),
    body('VideoDescription').not().isEmpty().trim(),
    body('VideoPrice').not().isEmpty().trim(),
    body('Visibility').not().isEmpty().trim(),
    AccountVideoServices.UpdateVideoData,
);

export = router;

import express from 'express';
import { body, param } from 'express-validator';
import AccountVideoServices from '../../Services/VideoServices/AccountVideosServiceManager';
import ClientVideosServices from '../../Services/VideoServices/ClientVideosServiceManager';

const router = express.Router();

router.post('/upload-video', body('VideoTitle').not().isEmpty().trim(), AccountVideoServices.UploadVideoFileToServer);
router.get('/get-account-videos/:UserPublicToken', param('UserPublicToken').not().isEmpty().trim(), AccountVideoServices.GetAccountVideos);
router.post('/delete-video', body('UserPrivateToken').not().isEmpty(), body('VideoToken').not().isEmpty(), AccountVideoServices.DeleteVideo);

router.get('/get-video-data/:VideoToken', param('VideoToken').not().isEmpty().trim(), ClientVideosServices.GetVideoData);

router.post(
    '/update-video-data',
    body('UserPrivateToken').not().isEmpty().trim(),
    body('VideoToken').not().isEmpty().trim(),
    body('VideoTitle').not().isEmpty().trim(),
    body('VideoDescription'),
    body('VideoSport').not().isEmpty().trim(),
    body('VideoPrice').not().isEmpty().trim(),
    body('Visibility').not().isEmpty().trim(),
    AccountVideoServices.UpdateVideoData,
);

// *comment related
router.get('/get-video-comments/:videoToken', param('videoToken').not().isEmpty(), ClientVideosServices.GetVideoComments);
router.post('/update-video-analytics', body('WatchTime').not().isEmpty(), body('UserPrivateToken').not().isEmpty(), body('VideoToken').not().isEmpty(), ClientVideosServices.UpdateVideoAnalytics);

router.post('/post-comment', body('UserPrivateToken').not().isEmpty(), body('VideoToken').not().isEmpty(), body('Comment').not().isEmpty(), ClientVideosServices.PostCommentToVideo);
router.post('/delete-comment', body('UserPrivateToken').not().isEmpty(), body('VideoToken').not().isEmpty(), body('CommentID').not().isEmpty(), ClientVideosServices.DeleteComment);

export = router;

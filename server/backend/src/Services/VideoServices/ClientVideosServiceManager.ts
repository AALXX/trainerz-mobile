import { Response } from 'express';
import { validationResult } from 'express-validator';
import logging from '../../config/logging';
import { CustomRequest, query } from '../../config/mysql';
import utilFunctions from '../../util/utilFunctions';

/**
 * Validates and cleans the CustomRequest form
 */
const CustomRequestValidationResult = validationResult.withDefaults({
    formatter: (error) => {
        return {
            errorMsg: error.msg,
        };
    },
});

const GetVideoData = async (req: any, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('GET_VIDEO_DATA_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    const GetVideoDataQueryString = `SELECT v.VideoTitle, v.VideoDescription, v.OwnerToken, v.PublishDate, v.VideoPrice, v.VideoToken, v.Visibility, v.Views, u.UserName as OwnerName, a.SportName
    FROM videos AS v
    JOIN users AS u ON v.OwnerToken = u.UserPublicToken
    LEFT JOIN videos_category_alloc AS a ON v.VideoToken = a.VideoToken
    WHERE v.VideoToken = "${req.params.VideoToken}";`;

    try {
        const connection = await req.pool?.promise().getConnection();
        const VideoData = await query(connection, GetVideoDataQueryString);
        if (Object.keys(VideoData).length === 0) {
            return res.status(202).json({
                error: true,
            });
        }

        return res.status(202).json({
            error: false,
            VideoTitle: VideoData[0].VideoTitle,
            Views: VideoData[0].Views,
            VideoDescription: VideoData[0].VideoDescription,
            VideoPrice: VideoData[0].PublishDate,
            PublishDate: VideoData[0].PublishDate,
            SportName: VideoData[0].SportName,
            OwnerToken: VideoData[0].OwnerToken,
            OwnerName: VideoData[0].OwnerName,
            Visibility: VideoData[0].Visibility,
        });
    } catch (error: any) {
        logging.error('GET_VIDEO_DATA_FUNC', error.message);
        return res.status(500).json({
            message: error.message,
            error: true,
        });
    }
};

/**
 * Post a comment to a video.
 * @param {CustomRequest} req - The request object containing the user token and video token.
 * @param {Response} res - The response object to send the result.
 * @return {Response} - A JSON response indicating whether the comment was posted successfully.
 */

const PostCommentToVideo = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('POST_COMMENT_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();

        const ownerToken = await utilFunctions.getUserPublicTokenFromPrivateToken(req.pool!, req.body.UserPrivateToken);
        if (ownerToken == null) {
            return res.status(200).json({
                error: true,
            });
        }

        const PostCommentSQL = `
        INSERT INTO comments (ownerToken, videoToken, comment, SentAt) 
        VALUES ("${ownerToken}","${req.body.VideoToken}", "${req.body.Comment}", CURDATE());

        -- Retrieve the ID of the last inserted comment
        SELECT LAST_INSERT_ID() AS id;

        -- Retrieve the UserName associated with the ownerToken
        SELECT UserName FROM users WHERE UserPublicToken = "${ownerToken}";`;
        const resp = await query(connection, PostCommentSQL);

        res.status(202).json({
            error: false,
            id: resp[1][0].id,
            userName: resp[2][0].UserName,
        });
    } catch (error: any) {
        logging.error('POST_COMMENT_FUNC', error.message);
        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

/**
 * delete comment to a video
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const DeleteComment = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('DELETE_COMMENT_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    const connection = await req.pool?.promise().getConnection();

    try {
        const UserPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(req.pool!, req.body.UserPrivateToken);

        if (UserPublicToken == null) {
            return res.status(202).json({
                error: true,
            });
        }

        const PostCommentSQL = `DELETE FROM comments WHERE ownerToken="${UserPublicToken}" AND videoToken="${req.body.VideoToken}" AND id="${req.body.CommentID}";`;
        await query(connection, PostCommentSQL);
        res.status(202).json({
            error: false,
        });
    } catch (error: any) {
        res.status(202).json({
            error: true,
            errmsg: error.msg,
        });
    }
};

/**
 * Update video analityics
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const UpdateVideoAnalytics = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('UPDATE_VIDEO_ANALYTICS_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        if (req.body.WatchTime < 2) {
            return res.status(500).json({
                error: false,
            });
        }

        const connection = await req.pool?.promise().getConnection();
        const UserPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(req.pool!, req.body.UserPrivateToken);
        if (UserPublicToken == null) {
            return res.status(202).json({
                error: false,
            });
        }
        const GetVideoDataQueryString = `SELECT * FROM watched_videos WHERE ownerToken="${UserPublicToken}" AND videoToken="${req.body.VideoToken}"`;
        const getResp = await query(connection, GetVideoDataQueryString);

        if (Object.keys(getResp).length > 0) {
            return res.status(202).json({
                error: false,
            });
        }

        const UpdateVideoAnalyticsQueryString = `UPDATE videos SET  Views=Views+1 WHERE VideoToken="${req.body.VideoToken}";
        INSERT INTO watched_videos (ownerToken, videoToken, WatchTime) VALUES ("${UserPublicToken}" ,"${req.body.VideoToken}", "${req.body.WatchTime}");`;
        await query(connection, UpdateVideoAnalyticsQueryString);
        res.status(202).json({
            error: false,
        });
    } catch (error: any) {
        logging.error(`UPDATE_VIDEO_ANALYTICS_FUNC`, `ERROR: ${error.message}`);

        return res.status(500).json({
            message: error.message,
            error: true,
        });
    }
};

/**
 * get comment from a video
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const GetVideoComments = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('POST_COMMENT_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();

        const GetVideoCommentsSQL = `
        SELECT c.id, c.ownerToken, c.videoToken, c.comment, c.SentAt ,u.UserName AS ownerName
        FROM comments c
        JOIN users u ON c.ownerToken = u.UserPublicToken
        WHERE c.videoToken="${req.params.videoToken}"
    `;

        const VideoComments = await query(connection, GetVideoCommentsSQL);

        return res.status(202).json({
            error: false,
            comments: VideoComments,
        });
    } catch (error: any) {
        res.status(202).json({
            error: true,
            errmsg: error.msg,
        });
    }
};

/**
 * Search a video
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const SearchVideo = async (req: CustomRequest, res: Response) => {
    const NAMESPACE = 'SEARCH_VIDEO_FUNC';
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error(NAMESPACE, error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }
    try {
        const connection = await req.pool?.promise().getConnection();

        // const video_search_server_resp = await axios.get(`${process.env.SEARCH_SERVER}/search/${req.params.search_query}`);
        // if (video_search_server_resp.data.error === true) {
        //     res.status(202).json({
        //         error: true,
        //     });
        // }
        // // console.log(video_search_server_resp.data);
        // let videos: ISearchVideoCards[] = [];
        // for (const video in video_search_server_resp.data.videoSearchedResults) {
        //     if (Object.prototype.hasOwnProperty.call(video_search_server_resp.data.videoSearchedResults, video)) {
        //         const videoData = video_search_server_resp.data.videoSearchedResults[video];
        //         const GetVideoDataSqlQuery = `SELECT VideoTitle, OwnerToken, Likes, Dislikes, u.UserName FROM videos v JOIN users u ON v.OwnerToken = u.UserPublicToken WHERE VideoToken="${videoData.VideoToken}" `;
        //         const getVideoData = await query(connection, GetVideoDataSqlQuery);
        //         let resp = JSON.parse(JSON.stringify(getVideoData));
        //         videos.push({ OwnerName: resp[0].UserName, VideoTitle: resp[0].VideoTitle, OwnerToken: resp[0].OwnerToken, VideoToken: videoData.VideoToken, Likes: resp[0].Likes, Dislikes: resp[0].Dislikes });
        //     }
        // }

        return res.status(202).json({
            error: false,
            // Videos: videos,
        });
    } catch (error: any) {
        console.log(error);
        logging.error(NAMESPACE, error.message);

        res.status(202).json({
            error: true,
            errmsg: error.msg,
        });
    }
};

export default { GetVideoComments, PostCommentToVideo, DeleteComment, SearchVideo, UpdateVideoAnalytics, GetVideoData };

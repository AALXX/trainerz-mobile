import { Response } from 'express';

import multer from 'multer';

import logging from '../../config/logging';
import { CustomRequest, query } from '../../config/mysql';

import utilFunctions from '../../util/utilFunctions';
import { validationResult, body } from 'express-validator';
import fs from 'fs';
import FFmpeg from 'fluent-ffmpeg';

const NAMESPACE = 'AccountUploadServiceManager';

// ////////////////////////////////
//        Video Upload           //
// ////////////////////////////////

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

/**
 * file storage
 */
const storage = multer.diskStorage({
    destination: (req: CustomRequest, file: any, callback: any) => {
        callback(null, `${process.env.ACCOUNTS_FOLDER_PATH}/VideosTmp`);
    },

    filename: (req: CustomRequest, file, cb: any) => {
        cb(null, `${file.originalname}`);
    },
});

const fileFilter = (req: CustomRequest, file: any, cb: any) => {
    // reject all files except jpeg
    if (file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const videoUpload = multer({
    storage: storage,
    // fileFilter: fileFilter,
}).fields([
    {
        name: 'VideoFile',
        maxCount: 1,
    },
]);

// const thumbnailUpload = multer({
//     storage: storage,
//     // fileFilter: fileFilter,
// }).fields([
//     {
//         name: 'VideoThumbnail',
//         maxCount: 1,
//     },
// ]);

const UploadVideoFileToServer = async (req: any, res: Response) => {
    logging.info(NAMESPACE, 'Posting Video service called');
    videoUpload(req, res, async (err: any) => {
        if (req.body.VideoTitle === '') {
            return res.status(200).json({
                error: true,
            });
        }

        if (err) {
            logging.error(NAMESPACE, err.message);

            return res.status(200).json({
                error: true,
            });
        }

        const userPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(req.pool!, req.body.UserPrivateToken);
        if (userPublicToken == null) {
            return res.status(200).json({
                error: true,
            });
        }

        const VideoToken = utilFunctions.CreateVideoToken();
        //* video file does not exist
        fs.mkdir(`${process.env.ACCOUNTS_FOLDER_PATH}/${userPublicToken}/${VideoToken}`, (err) => {
            if (err) {
                logging.error(NAMESPACE, err.message);

                return res.status(200).json({
                    error: true,
                });
            }

            //* Directory Created Succesfully
            fs.rename(`${process.env.ACCOUNTS_FOLDER_PATH}/VideosTmp/${req.files['VideoFile'][0].originalname}`, `${process.env.ACCOUNTS_FOLDER_PATH}/${userPublicToken}/${VideoToken}/Original.mp4`, async (err) => {
                if (err) {
                    logging.error(NAMESPACE, err.message);

                    return res.status(200).json({
                        error: true,
                    });
                }

                await VideoProceesor(
                    `${process.env.ACCOUNTS_FOLDER_PATH}/${userPublicToken}/${VideoToken}/Original.mp4`,
                    `${process.env.ACCOUNTS_FOLDER_PATH}/${userPublicToken}/${VideoToken}/Source.mp4`,
                    req.body.width,
                    req.body.height,
                    16,
                );

                // *Save video data to db
                const success = await SendVideoDataToDb(req, userPublicToken as string, VideoToken, req.body.VideoTitle, req.body.Price);
                if (success == false) {
                    return res.status(200).json({
                        error: true,
                    });
                }

                await ThumbnailProcessor(`${process.env.ACCOUNTS_FOLDER_PATH}/${userPublicToken}/${VideoToken}/Source.mp4`, `${process.env.ACCOUNTS_FOLDER_PATH}/${userPublicToken}/${VideoToken}/`);

                try {
                    if ((await SendVideoCategoryToDb(req, VideoToken, req.body.VideoSport[0])) == false) {
                        return res.status(200).json({
                            error: true,
                        });
                    }

                    return res.status(200).json({
                        error: false,
                    });
                } catch (error) {
                    return res.status(200).json({
                        error: true,
                    });
                }
            });
        });
    });
};

/**
 * Sends the category ID for a video to the database.
 * @param {CustomRequest} req - The custom request object.
 * @param {string} videoToken - The token of the video.
 * @param {string} SportName - The ID of the category.
 * @return {Promise<boolean>} - Returns true if the video category was successfully sent to the database, false otherwise.
 */
const SendVideoCategoryToDb = async (req: CustomRequest, videoToken: string, SportName: string) => {
    try {
        const connection = await req.pool?.promise().getConnection();

        const sendVideoCategoryToDbSQl = `INSERT INTO videos_category_alloc (videoToken, SportName) VALUES ('${videoToken}','${SportName}')`;
        const accData = await query(connection, sendVideoCategoryToDbSQl);

        if (Object.keys(accData).length === 0) {
            return false;
        }

        return true;
    } catch (error: any) {
        return false;
    }
};

/**
 * Sends video data to the database.
 * @param {CustomRequest} req - The custom request object.
 * @param {string} userPublicToken - The public token of the user.
 * @param {string} videoToken - The token of the video.
 * @param {string} VideoTitle - The title of the video.
 * @param {number} price - The visibility of the video.
 * @return {Promise<boolean>} - Returns true if the video data was successfully sent to the database, false otherwise.
 */
const SendVideoDataToDb = async (req: CustomRequest, userPublicToken: string, videoToken: string, VideoTitle: string, price: number) => {
    const today = new Date().toISOString().slice(0, 10);

    try {
        const connection = await req.pool?.promise().getConnection();

        const SendVidsDatasSqlQuery = `INSERT INTO videos (VideoTitle, VideoDescription, PublishDate, VideoPrice, VideoToken, OwnerToken, Visibility)
        VALUES("${VideoTitle}", "", "${today}", "${price}", "${videoToken}", "${userPublicToken}", "public")`;
        const data = await query(connection, SendVidsDatasSqlQuery);

        const vidData = JSON.parse(JSON.stringify(data));

        if (Object.keys(vidData).length === 0) {
            return false;
        }

        return true;
    } catch (error: any) {
        return false;
    }
};

/**
 * Extracts a frame from the video and saves it as Thumbnail_image.png
 * @param {string} videoPath - Path to the video file
 * @param {string} outputPath - Path to save the thumbnail image
 */
const ThumbnailProcessor = async (videoPath: string, outputPath: string) =>
    new Promise((resolve, reject) => {
        try {
            FFmpeg(videoPath)
                .on('end', () => {
                    resolve({ error: false });
                })
                .on('error', (err) => {
                    console.error('Error:', err);
                    reject(err);
                })
                // Extract a frame at 3 second (can be adjusted as needed)
                .screenshots({
                    count: 1,
                    folder: outputPath,
                    filename: 'Thumbnail_image.png',
                    size: '626x352',
                    timemarks: ['3'], // Capture at 3 second into the video
                });
        } catch (err) {
            console.error('Exception:', err);
            reject(err);
        }
    });

/**
 * Processes a video file by transcoding it to a specified resolution and format.
 *
 * @param {string} srcPath - The path to the source video file.
 * @param {string} dstPath - The path to the destination video file.
 * @param {number} width - The desired width of the output video.
 * @param {number} height - The desired height of the output video.
 * @param {number} numThreads - The number of threads to use for the transcoding process.
 * @return {void} A Promise that resolves with an object containing an 'error' property indicating whether the operation was successful.
 */
const VideoProceesor = async (srcPath: string, dstPath: string, width: number, height: number, numThreads: number) =>
    new Promise((resolve, reject) => {
        const ffprobe = FFmpeg.ffprobe;

        ffprobe(srcPath, (err, metadata) => {
            if (err) {
                logging.error('FFprobe Error:', err);
                reject(err);
                return;
            }

            let videoSize = '';
            console.log(width);
            console.log(height);
            if (width! > height!) {
                console.log('landscape');
                // Landscape mode
                videoSize = '1920x1080';
            } else {
                console.log('portrait');
                // Portrait mode
                // Set the desired portrait resolution here
                videoSize = '1080x1920';
            }

            FFmpeg(srcPath)
                .videoCodec('libx264')
                .audioCodec('aac')
                .addOption('-threads', numThreads.toString()) // Set the number of threads
                .on('progress', (progress) => {
                    console.log('Processing: ' + progress.timemark);
                })
                .size(videoSize)
                .on('error', (err) => {
                    logging.error('FFmpeg Error:', err);
                    reject(err);
                })
                .save(dstPath)
                .on('end', () => {
                    resolve({ error: false });
                });
        });
    });

/**
 * Retrieves the list of videos owned by the user with the specified public token.
 *
 * @param {CustomRequest} req - The HTTP request object, containing the user's public token in the `req.params.UserPublicToken` property.
 * @param {Response} res - The HTTP response object, which will be used to send the video data back to the client.
 */
const GetAccountVideos = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('GET_ACCOUNT_VIDEO_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    const GetVideoDataQueryString = `SELECT v.VideoTitle, v.VideoDescription, v.OwnerToken, v.PublishDate, v.VideoPrice, v.VideoToken, v.Visibility, v.Views, u.UserName as OwnerName, a.SportName
    FROM videos AS v
    JOIN users AS u ON v.OwnerToken = u.UserPublicToken
    LEFT JOIN videos_category_alloc AS a ON v.VideoToken = a.VideoToken
    WHERE v.OwnerToken = "${req.params.UserPublicToken}";`;

    try {
        const connection = await req.pool?.promise().getConnection();
        const VideosData = await query(connection, GetVideoDataQueryString);
        return res.status(202).json({
            error: false,
            VideosData: VideosData,
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);
        return res.status(500).json({
            message: error.message,
            error: true,
        });
    }
};

/**
 * Updates the data for a video in the database.
 *
 * @param {CustomRequest} req - The custom request object containing the video data to update.
 * @param {Response} res - The response object to send the update result.
 */
const UpdateVideoData = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('UPDATE_VIDEO_DATA_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();
        const userPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(req.pool!, req.body.UserPrivateToken);
        if (userPublicToken == null) {
            return res.status(200).json({
                error: true,
            });
        }

        const GetVideoDataQueryString = `START TRANSACTION;
        UPDATE videos
        SET 
            VideoTitle = "${req.body.VideoTitle}", 
            VideoDescription = "${req.body.VideoDescription}", 
            VideoPrice = "${req.body.VideoPrice}", 
            Visibility = "${req.body.Visibility}" 
        WHERE 
            VideoToken = "${req.body.VideoToken}" AND OwnerToken = "${userPublicToken}";

        UPDATE videos_category_alloc
        SET 
            SportName = "${req.body.VideoSport}"
        WHERE 
            VideoToken = "${req.body.VideoToken}" AND EXISTS (
                SELECT 1 FROM videos 
                WHERE VideoToken = "${req.body.VideoToken}" AND OwnerToken = "${userPublicToken}"
            );
        
        COMMIT;`;
        await query(connection, GetVideoDataQueryString);

        return res.status(202).json({
            error: false,
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);
        return res.status(500).json({
            message: error.message,
            error: true,
        });
    }
};

/**
 * delete creator video
 * @param {CustomRequest} req
 * @param {Response} res
 */
const DeleteVideo = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('GET_CREATOR_VIDEO_DATA_BY_TOKEN_FUNC', error.errorMsg);
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

        const GetVideoDataQueryString = `DELETE FROM videos WHERE VideoToken="${req.body.VideoToken}" AND OwnerToken="${ownerToken}"; DELETE FROM videos_category_alloc WHERE VideoToken="${req.body.VideoToken}";`;

        await query(connection, GetVideoDataQueryString);

        fs.stat(`${process.env.ACCOUNTS_FOLDER_PATH}/${ownerToken}/${req.body.VideoToken}/`, async (err, stats) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.log(`File does not exist: ${req.body.VideoToken}`);
                    return res.status(202).json({
                        error: true,
                    });
                } else {
                    console.error(`Error checking file: ${err}`);
                    return res.status(202).json({
                        error: true,
                    });
                }
            } else {
                utilFunctions
                    .RemoveDirectory(`${process.env.ACCOUNTS_FOLDER_PATH}/${ownerToken}/${req.body.VideoToken}/`)
                    .then(() => {
                        console.log(`Deleted folder: ${ownerToken}`);
                    })
                    .catch(console.error);
                return res.status(202).json({
                    error: false,
                });
            }
        });
    } catch (error: any) {
        logging.error(NAMESPACE, `ERRRO: ${error.message}`);

        return res.status(500).json({
            message: error.message,
            error: true,
        });
    }
};

export default {
    UploadVideoFileToServer,
    UpdateVideoData,
    GetAccountVideos,
    DeleteVideo,
};

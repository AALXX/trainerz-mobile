import { Response } from 'express';

import multer from 'multer';

import logging from '../../config/logging';
import { CustomRequest, query } from '../../config/mysql';

import axios from 'axios';
import utilFunctions from '../../util/utilFunctions';
import { validationResult, param, body } from 'express-validator';
import fs from 'fs';
import FFmpeg from 'fluent-ffmpeg';

const NAMESPACE = 'AccountUploadServiceManager';

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

                console.log('CUMM');
                await VideoProceesor(
                    `${process.env.ACCOUNTS_FOLDER_PATH}/${userPublicToken}/${VideoToken}/Original.mp4`,
                    `${process.env.ACCOUNTS_FOLDER_PATH}/${userPublicToken}/${VideoToken}/Source.mp4`,
                    '1920x1080',
                    16,
                );

                // *Save video data to db
                const success = await SendVideoDataToDb(req, userPublicToken as string, VideoToken, req.body.VideoTitle);
                if (success == false) {
                    return res.status(200).json({
                        error: true,
                    });
                }

                // await ThumbnailProceesor(`${process.env.ACCOUNTS_FOLDER_PATH}/${userPublicToken}/${VideoToken}/Thumbnail_image.jpg`);
                const file = fs.readFileSync(`${process.env.ACCOUNTS_FOLDER_PATH}/${userPublicToken}/${VideoToken}/Original.mp4`);

                // Encode the binary data as Base64
                // const base64Video = Buffer.from(file).toString('base64');

                const formData = new FormData();
                // formData.append('file', file, {
                //     filename: 'Original.mp4',
                //     contentType: 'video/mp4', // Adjust the content type based on your file type
                // });
                // formData.append('file', file);
                formData.append('video_name', `${req.body.VideoTitle}.mp4`);

                try {
                    // const video_category_server_resp = await axios.post(`${process.env.VIDEO_CATEGORIZE_SERVER}/get-video-category`, formData, {
                    //     headers: {
                    //         'Content-Type': 'multipart/form-data',
                    //     },
                    // });

                    // if (video_category_server_resp.data.error == true) {
                    //     return res.status(200).json({
                    //         error: true,
                    //     });
                    // }

                    // const vide_index_server_resp = await axios.post(`${process.env.SEARCH_SERVER}/index-video`, {
                    //     VideoTitle: req.body.VideoTitle,
                    //     VideoToken: VideoToken,
                    //     VideoVisibility: req.body.VideoVisibility,
                    //     OwnerPrivateToken: req.body.UserPrivateToken,
                    // });

                    // if (vide_index_server_resp.data.error == true) {
                    //     return res.status(200).json({
                    //         error: true,
                    //     });
                    // }

                    // if ((await SendVideoCategoryToDb(req, VideoToken, video_category_server_resp.data.video_type)) == false) {
                    //     return res.status(200).json({
                    //         error: true,
                    //     });
                    // }

                    // * Create a 720p and 480p variant of the video

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
 * @param {string} CategoryId - The ID of the category.
 * @return {Promise<boolean>} - Returns true if the video category was successfully sent to the database, false otherwise.
 */
const SendVideoCategoryToDb = async (req: CustomRequest, videoToken: string, CategoryId: string) => {
    try {
        const connection = await req.pool?.promise().getConnection();

        const sendVideoCategoryToDbSQl = `INSERT INTO videos_categoriy_alloc (videoToken, CategoryId) VALUES ('${videoToken}','${CategoryId}')`;
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
 * @param {string} VideoVisibility - The visibility of the video.
 * @return {Promise<boolean>} - Returns true if the video data was successfully sent to the database, false otherwise.
 */
const SendVideoDataToDb = async (req: CustomRequest, userPublicToken: string, videoToken: string, VideoTitle: string) => {
    const today = new Date().toISOString().slice(0, 10);

    try {
        const connection = await req.pool?.promise().getConnection();

        const SendVidsDatasSqlQuery = `INSERT INTO videos (VideoTitle, VideoDescription, PublishDate, VideoToken, OwnerToken, Visibility)
        VALUES("${VideoTitle}", "", "${today}","${videoToken}", "${userPublicToken}", "public")`;
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
 * Processes and make all thumbnails 626x325
 * @param {string} path
 */
const ThumbnailProceesor = async (path: string) =>
    new Promise((resolve, reject) => {
        try {
            FFmpeg(path)
                .size(`626x352`)
                .on('end', () => {
                    resolve({ error: false });
                })
                .on('error', (err) => {
                    console.error('Error:', err);
                    reject(err);
                })
                .save(path)
                .run();
        } catch {}
    });

/**
 * Processes a video file by transcoding it to a specified size and codec.
 * @param {string} srcPath - The path to the source video file.
 * @param {string} dstPath - The path to the destination video file.
 * @param {string} VideoSize - The desired size of the output video, e.g. "640x360".
 * @param {number} numThreads - The number of threads to use for the video processing.
 */
const VideoProceesor = async (srcPath: string, dstPath: string, VideoSize: string, numThreads: number) =>
    new Promise((resolve, reject) => {
        FFmpeg(srcPath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .addOption('-threads', numThreads.toString()) // Set the number of threads
            .on('progress', (progress) => {
                console.log('Processing: ' + progress.timemark);
            })
            .size(VideoSize)
            .on('error', (err) => {
                logging.error('FFmpeg Error:', err);
                reject(err);
            })
            .save(dstPath)
            .on('end', () => {
                resolve({ error: false });
            });
    });

export default {
    UploadVideoFileToServer,
};

import bcrypt from 'bcrypt';
import logging from '../config/logging';
import { createPool, query } from '../config/mysql';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import utilFunctions from '../util/utilFunctions';
import mysql from 'mysql2';
import axios from 'axios';
import path from 'path';

//* /////////////////////////////
//*      Account related       //
//* /////////////////////////////

/**
 ** Hash the password inputed by user
 * @param {string} password
 */
const HashPassword = async (password: string) => {
    const NAMESPACE = 'HASH_PASSWORD_FUNCTION';

    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(11);

        // Hash password
        return await bcrypt.hash(password, salt);
    } catch (error) {
        logging.error(NAMESPACE, error as string);
    }

    // Return null if error
    return null;
};

/**
 ** checks if username and email exists in database
 * @param {string} UserName
 * @param {string} Email
 * @param {any} callback
 */
const UserNameAndEmailExistCheck = (UserName: string, Email: string, callback: any) => {
    const NAMESPACE = 'USERNAME_EMAIL_EXIST_CHECK_FUNCTION';
    const CheckIfUsernamexExistsQuerryString = `SELECT 1 FROM users WHERE UserName="${UserName}" OR UserEmail="${Email}";`;

    // connect()
    //     .then((pool) => {
    //         query(pool, CheckIfUsernamexExistsQuerryString)
    //             .then((results) => {
    //                 //* Parse rows from database
    //                 const data = JSON.parse(JSON.stringify(results));

    //                 if (Object.keys(data).length === 1) {
    //                     return callback(false, true);
    //                 }

    //                 return callback(false, false);
    //             })
    //             .catch((error) => {
    //                 logging.error(NAMESPACE, error.message, error);
    //                 return callback(true, false);
    //             })
    //             .finally(() => {
    //                 // pool.end();
    //             });
    //     })
    //     .catch((error) => {
    //         logging.error(NAMESPACE, error.message, error);
    //         return callback(true, false);
    //     });
};

/**
 * Get User Private token by provided public Token
 * @param {string} userToken
 * @return {Promise<string | null>}
 */
const getUserPrivateTokenFromPublicToken = async (pool: mysql.Pool, userToken: string): Promise<string | null> => {
    const NAMESPACE = 'GET_USER_PRIVATE_TOKEN_FUNC';
    const GetPricateTokebnQuerryString = `SELECT UserPrivateToken FROM users WHERE UserPublicToken="${userToken}";`;

    try {
        if (userToken === 'undefined') {
            return null;
        }
        const connection = await pool.promise().getConnection();

        const Response = await query(connection, GetPricateTokebnQuerryString);
        const userData = JSON.parse(JSON.stringify(Response));
        if (Object.keys(userData).length != 0) {
            return userData[0].UserPrivateToken;
        } else {
            return null;
        }
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);
        return null;
    }
};
/**
 * Get Email From Private token
 * @param {string} userPrivateToken
 * @param {mysql.Pool} pool
 * @return {Promise<string | null>}
 */
const getUserEmailFromPrivateToken = async (pool: mysql.Pool, userPrivateToken: string): Promise<string | null> => {
    const NAMESPACE = 'GET_USER_EMAIL_FUNC';
    const CheckIfUserFollwsAccountQuerryString = `SELECT UserEmail FROM users WHERE UserPrivateToken="${userPrivateToken}";`;

    try {
        if (userPrivateToken === 'undefined') {
            return null;
        }
        const connection = await pool.promise().getConnection();
        const userData = await query(connection, CheckIfUserFollwsAccountQuerryString);
        if (Object.keys(userData).length != 0) {
            return userData[0].UserEmail;
        } else {
            return null;
        }
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);
        return null;
    }
};

/**
 * Get User Public token by provided private Token
 * @param {string} userPrivateToken
 * @param {mysql.Pool} pool
 * @return {Promise<string | null>}
 */
const getUserPublicTokenFromPrivateToken = async (pool: mysql.Pool, userPrivateToken: string): Promise<string | null> => {
    const NAMESPACE = 'GET_USER_PRIVATE_TOKEN_FUNC';
    const CheckIfUserFollwsAccountQuerryString = `SELECT UserPublicToken FROM users WHERE UserPrivateToken="${userPrivateToken}" ;`;

    try {
        if (userPrivateToken === 'undefined') {
            return null;
        }
        const connection = await pool.promise().getConnection();
        const checkfollowResponse = await query(connection, CheckIfUserFollwsAccountQuerryString);
        let userData = JSON.parse(JSON.stringify(checkfollowResponse));
        if (Object.keys(userData).length != 0) {
            return userData[0].UserPublicToken;
        } else {
            return null;
        }
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);
        return null;
    }
};

/**
 * Gets Users rone on a channel
 * @param {string} userToken
 * @param {string} chanelPublicToken
 * @return {Promise<boolean>}
 */
const getUserRole = async (pool: mysql.Pool, userToken: string, chanelPublicToken: string): Promise<number | null> => {
    const NAMESPACE = 'GET_USER_ROLE_FUNCTION';
    const GetUserRoleQuerryString = `SELECT RoleCategoryId FROM channel_roles_alloc WHERE UserPrivateToken="${userToken}" AND ChannelToken="${chanelPublicToken}";`;

    try {
        if (userToken === 'undefined') {
            return null;
        }
        const connection = await pool.promise().getConnection();
        const data = await query(connection, GetUserRoleQuerryString);
        if (Object.keys(data).length === 0) {
            return null;
        }
        return data[0].RoleCategoryId;
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);
        return null;
    }
};

/**
 * check ig user is blocked
 * @param {string} userToken
 * @param {string} chanelPublicToken
 * @return {Promise<boolean>}
 */
const checkIfUserIsBlocked = async (pool: mysql.Pool, userPrivateToken: string, chanelPublicToken: string): Promise<{ isBanned: boolean; reason?: string }> => {
    const NAMESPACE = 'CHECK_USER_BAN_FUNCTION';
    const GetUserRoleQuerryString = `SELECT * FROM blocked_list WHERE UserToken="${userPrivateToken}" AND CreatorToken="${chanelPublicToken}";`;
    try {
        if (userPrivateToken === 'undefined') {
            return {
                isBanned: false,
            };
        }
        const connection = await pool.promise().getConnection();
        const data = await query(connection, GetUserRoleQuerryString);
        if (Object.keys(data).length === 0) {
            return {
                isBanned: false,
            };
        }

        return {
            isBanned: true,
            reason: data[0].Reason,
        };
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);
        return {
            isBanned: false,
        };
    }
};

/**
 * Checks if user is following the account
 * @param {string} userToken
 * @param {string} accountPublicToken
 * @return {Promise<boolean>}
 */
const userFollowAccountCheck = async (pool: mysql.Pool, userToken: string, accountPublicToken: string): Promise<boolean> => {
    const NAMESPACE = 'USER_FOLLOW_CHECK_FUNCTION';
    const CheckIfUserFollwsAccountQuerryString = `SELECT * FROM user_follw_account_class WHERE userToken="${userToken}" AND accountToken="${accountPublicToken}";`;

    try {
        if (userToken === 'undefined') {
            return false;
        }
        const connection = await pool.promise().getConnection();
        const checkfollowResponse = await query(connection, CheckIfUserFollwsAccountQuerryString);
        let checkfollowdata = JSON.parse(JSON.stringify(checkfollowResponse));
        if (Object.keys(checkfollowdata).length != 0) {
            return true;
        } else {
            return false;
        }
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);
        return false;
    }
};

//* /////////////////////////////
//*      Videos related        //
//* /////////////////////////////

/**
 ** creates video token
 * @return {string}
 */
const CreateVideoToken = (): string => {
    const NAMESPACE = 'CREATE_VIDEO_TOKEN_FUNCTION';

    const secretExt = new Date().getTime().toString();

    const jwtSecretKey = 'secret' + secretExt;

    const userprivateToken = jwt.sign({}, jwtSecretKey);

    return userprivateToken;
};

/**
 * It gets the video that user liked
 * @param {string} userToken
 * @param {string} VideoToken
 * @returns
 */
const getUserLikedOrDislikedVideo = async (pool: mysql.Pool, userToken: string, VideoToken: string): Promise<{ userLiked: boolean; like_or_dislike: number }> => {
    const NAMESPACE = 'USER_LIKED_OR_DISLIKED_FUNCTION';
    const CheckIfUserFollwsAccountQuerryString = `SELECT * FROM user_liked_or_disliked_video_class WHERE userToken="${userToken}" AND videoToken="${VideoToken}";`;

    try {
        if (userToken === 'undefined') {
            return { userLiked: false, like_or_dislike: 0 };
        }

        const connection = await pool.promise().getConnection();
        const checkfollowResponse = await query(connection, CheckIfUserFollwsAccountQuerryString);
        let checkfollowdata = JSON.parse(JSON.stringify(checkfollowResponse));
        if (Object.keys(checkfollowdata).length != 0) {
            return { userLiked: true, like_or_dislike: checkfollowdata[0].like_dislike };
        }
        return { userLiked: false, like_or_dislike: 0 };
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);
        return { userLiked: false, like_or_dislike: 0 };
    }
};

/**
 * It gets the stream that user liked
 * @param {string} userToken
 * @param {string} StreamToken
 * @returns
 */
const getUserLikedOrDislikedStream = async (pool: mysql.Pool, userToken: string, StreamToken: string): Promise<{ userLiked: boolean; like_or_dislike: number }> => {
    const NAMESPACE = 'USER_LIKED_OR_DISLIKED_FUNCTION';
    const CheckIfUserFollwsAccountQuerryString = `SELECT * FROM user_liked_or_disliked_stream_class WHERE userToken="${userToken}" AND StreamToken="${StreamToken}";`;

    try {
        if (userToken === 'undefined') {
            return { userLiked: false, like_or_dislike: 0 };
        }
        const connection = await pool.promise().getConnection();
        const checklikeResponse = await query(connection, CheckIfUserFollwsAccountQuerryString);
        const checklikedata = JSON.parse(JSON.stringify(checklikeResponse));
        // console.log(checklikedata);
        if (Object.keys(checklikedata).length != 0) {
            return { userLiked: true, like_or_dislike: checklikedata[0].like_dislike };
        }
        return { userLiked: false, like_or_dislike: 0 };
    } catch (error: any) {
        logging.error(NAMESPACE, error.message, error);
        return { userLiked: false, like_or_dislike: 0 };
    }
};

/**
 * Removes a directory
 * @param {string} folderPath
 */
const RemoveDirectory = (folderPath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.readdir(folderPath, (err, files) => {
            if (err) {
                return reject(err);
            }

            // Iterate over all files and subdirectories
            Promise.all(
                files.map((file) => {
                    const currentPath = path.join(folderPath, file);

                    return new Promise<void>((resolve, reject) => {
                        fs.lstat(currentPath, (err, stats) => {
                            if (err) {
                                return reject(err);
                            }

                            if (stats.isDirectory()) {
                                // Recursively delete subdirectory
                                RemoveDirectory(currentPath).then(resolve).catch(reject);
                            } else {
                                // Delete file
                                fs.unlink(currentPath, (err) => {
                                    if (err) {
                                        return reject(err);
                                    }
                                    resolve();
                                });
                            }
                        });
                    });
                }),
            )
                .then(() => {
                    // Delete the now-empty folder
                    fs.rmdir(folderPath, (err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                })
                .catch(reject);
        });
    });
};

//* /////////////////////////////
//*        Live related        //
//* /////////////////////////////

/**
 * Start a live
 * @param {string} userPrivateToken
 * @param {string} LiveToken
 * @return {}
 */
const CheckIfLive = async (pool: mysql.Pool, userPrivateToken: string, LiveToken: string): Promise<{ isLive: boolean; error: boolean }> => {
    const NAMESPACE = 'CHECK_IF_IS_LIVE_FUNCTION';

    try {
        const UserPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(pool, userPrivateToken);
        const connection = await pool.promise().getConnection();
        if (UserPublicToken == null) {
            return { isLive: false, error: true };
        }
        const StatALiveQueryString = `SELECT id, Active FROM streams WHERE UserPublicToken="${UserPublicToken}" AND StreamToken="${LiveToken}"`;

        const results = await query(connection, StatALiveQueryString);
        const data = JSON.parse(JSON.stringify(results));
        if (Object.keys(data).length == 0) {
            return { isLive: false, error: false };
        }

        return { isLive: data[0].Active === 0 ? false : true, error: false };
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);
        return { isLive: false, error: true };
    }
};

/**
 * Start a live
 * @param {string} userPrivateToken
 * @return {}
 */
const StartLive = async (pool: mysql.Pool, LiveTitle: string, userPrivateToken: string): Promise<{ error: boolean; LiveToken: string }> => {
    const NAMESPACE = 'START_LIVE_FUNCTION';

    try {
        const StreamToken = CreateVideoToken();
        const UserPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(pool, userPrivateToken);
        const connection = await pool.promise().getConnection();
        if (UserPublicToken == null) {
            return { error: true, LiveToken: '' };
        }
        const currentTimestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''); // Get current timestamp in MySQL format
        const StatALiveQueryString = `INSERT INTO streams(StreamTitle,  UserPublicToken, StartedAt, StreamToken, Active)
        SELECT "${LiveTitle}", "${UserPublicToken}", "${currentTimestamp}",  "${StreamToken}", "1"
        FROM users AS u
        WHERE u.UserPublicToken = "${UserPublicToken}";`;

        const results = await query(connection, StatALiveQueryString);

        const resp = await axios.post('http://localhost:7556/start-snapshot', { StreamToken: StreamToken });
        console.log(resp);

        const data = JSON.parse(JSON.stringify(results));
        if (data.affectedRows == 0) {
            return { error: true, LiveToken: '' };
        }

        return { error: false, LiveToken: StreamToken };
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);
        return { error: true, LiveToken: '' };
    }
};

/**
 * End a live
 * @param {string} userPrivateToken
 * @return {}
 */
const EndLive = async (pool: mysql.Pool, userPrivateToken: string, streamToken: string): Promise<boolean> => {
    const NAMESPACE = 'END_LIVE_FUNCTION';

    try {
        const UserPublicToken = await utilFunctions.getUserPublicTokenFromPrivateToken(pool, userPrivateToken);
        const connection = await pool.promise().getConnection();
        if (UserPublicToken == null) {
            return true;
        }

        const currentTimestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''); // Get current timestamp in MySQL format

        const StatALiveQueryString = `UPDATE streams SET FinishedAt='${currentTimestamp}', Active='0' WHERE UserPublicToken = "${UserPublicToken}";`;

        const results = await query(connection, StatALiveQueryString);

        const data = JSON.parse(JSON.stringify(results));
        if (data.affectedRows == 0) {
            return true;
        }

        return false;
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);
        return true;
    }
};

export default {
    HashPassword,
    UserNameAndEmailExistCheck,
    CreateVideoToken,
    getUserRole,
    checkIfUserIsBlocked,
    userFollowAccountCheck,
    getUserEmailFromPrivateToken,
    getUserLikedOrDislikedVideo,
    getUserPublicTokenFromPrivateToken,
    getUserLikedOrDislikedStream,
    getUserPrivateTokenFromPublicToken,
    RemoveDirectory,
    CheckIfLive,
    StartLive,
    EndLive,
};

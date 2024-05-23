import { Response } from 'express';
import { validationResult } from 'express-validator';
import { CustomRequest, query } from '../../config/mysql';
import logging from '../../config/logging';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs';
import UtilFunc from '../../util/utilFunctions';
import multer from 'multer';
import axios from 'axios';

const NAMESPACE = 'UserAccountService';

/**
 * file storage
 */
const storage = multer.diskStorage({
    destination: (req: CustomRequest, file: any, callback: any) => {
        callback(null, `${process.env.ACCOUNTS_FOLDER_PATH}/PhotosTmp`);
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
 * Gets a personal user account data by User Private Token
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const GetUserAccountData = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('GET_ACCOUNT_DATA', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();
        const GetUserDataQueryString = `SELECT UserName, Description, BirthDate, AccountPrice, LocationCountry, LocationCity, Sport, UserEmail, PhoneNumber, UserVisibility, AccountType, UserPublicToken 
        FROM users WHERE UserPrivateToken='${req.params.accountPrivateToken}';`;

        const data = await query(connection, GetUserDataQueryString);
        if (Object.keys(data).length === 0) {
            return res.status(200).json({
                error: false,
                userData: null,
            });
        }

        return res.status(200).json({
            error: false,
            userData: data[0],
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);

        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

/**
 * Gets a personal user account data by User Private Token
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const GetUserAccountPublicData = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('GET_ACCOUNT_DATA', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();
        const GetUserDataQueryString = `SELECT UserName, Description, AccountPrice, Sport, UserEmail, UserVisibility, AccountType 
        FROM users WHERE UserPublicToken='${req.params.accountPublicToken}';`;

        const data = await query(connection, GetUserDataQueryString);
        if (Object.keys(data).length === 0) {
            return res.status(200).json({
                error: false,
                userData: null,
            });
        }

        return res.status(200).json({
            error: false,
            userData: data[0],
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);

        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

/**
 * Change  users data
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const ChangeUserData = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('CHANGE_ACCOUNT_DATA_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();
        const changeUserDataSQL = `UPDATE users SET 
        UserName='${req.body.userName}', 
        Description='${req.body.userDescription}',
        UserEmail='${req.body.userEmail}', 
        Sport='${req.body.sport}',
        AccountPrice='${req.body.price}',
        AccountType='${req.body.accountType}',
        userVisibility='${req.body.userVisibility}' WHERE UserPrivateToken='${req.body.userPrivateToken}';`;
        await query(connection, changeUserDataSQL);

        const UserPublicToken = await UtilFunc.getUserPublicTokenFromPrivateToken(req.pool!, req.body.userPrivateToken);

        const products = await req.stripe?.products.list();
        // Find the product with the matching name
        const product = products!.data.find((p) => p.metadata.PublicToken === UserPublicToken);
        if (product != null) {
            const prices = await req.stripe?.prices.list({
                product: product.id,
                active: true, // Only list active prices (optional)
            });

            // Create a new price for the same product
            await req.stripe?.prices.create({
                product: product.id,
                unit_amount: req.body.price * 100,
                currency: 'usd',
                recurring: {
                    interval: 'month',
                },
            });

            // Mark the old price as inactive using metadata
            await req.stripe?.prices.update(prices!.data[0].id, {
                active: false,
            });
        }

        const searchServerResp = await axios.post(`${process.env.SEARCH_SERVER}/update-indexed-user`, {
            UserName: req.body.userName,
            UserPrivateToken: req.body.userPrivateToken,
            Sport: req.body.sport,
            AccountType: req.body.accountType,
        });

        if (searchServerResp.data.error === true) {
            return res.status(202).json({
                error: true,
            });
        }

        return res.status(202).json({
            error: false,
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);

        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

/**
 * Register User
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const RegisterUser = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('REGISTER_USER_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    const hashedpwd = await UtilFunc.HashPassword(req.body.password);

    const jwtSecretKey = 'secret' + hashedpwd + req.body.userEmail;
    const privateData = {};

    const publicData = {};

    const userPrivateToken = jwt.sign(privateData, jwtSecretKey);

    const userPublicToken = jwt.sign(publicData, `${process.env.ACCOUNT_REGISTER_SECRET}`);
    const InsertUserQueryString = `
    INSERT INTO users (UserName, Description, BirthDate, LocationCountry, LocationCity, Sport, PhoneNumber, UserEmail, UserPwd, UserVisibility, AccountType, AccountPrice, UserPrivateToken, UserPublicToken)
    VALUES('${req.body.userName}', '${req.body.description}', 
    '${req.body.userBirthDate}', '${req.body.locationCountry}', 
    '${req.body.locationCity}', '${req.body.sport}', '${req.body.phoneNumber}', '${req.body.userEmail}', '${hashedpwd}', 'public', '${req.body.accountType}',
    '${req.body.accountPrice}',  '${userPrivateToken}', '${userPublicToken}');`;

    try {
        const connection = await req.pool?.promise().getConnection();
        await query(connection, InsertUserQueryString);
        fs.mkdir(`../accounts/${userPublicToken}/`, async (err) => {
            if (err) {
                return res.status(200).json({
                    error: true,
                });
            }

            if (req.body.accountType === 'Trainer') {
                const product = await req.stripe?.products.create({ name: req.body.userName, metadata: { PublicToken: userPublicToken } });
                if (product!.id != null) {
                    await req.stripe?.prices.create({
                        product: product!.id,
                        unit_amount: req.body.accountPrice * 100, // Amount in cents (e.g., $15.00)
                        currency: 'usd',
                        recurring: {
                            interval: 'month',
                        },
                    });
                }
            }
            await req.stripe?.customers.create({
                email: req.body.userEmail,
                name: req.body.userName,
            });

            const resp = await axios.post(`${process.env.SEARCH_SERVER}/index-user`, {
                UserName: req.body.userName,
                UserPrivateToken: userPrivateToken,
                Sport: req.body.sport,
            });

            if (resp.data.error == true) {
                console.log('error');
            }

            return res.status(202).json({
                error: false,
                userprivateToken: userPrivateToken,
                userpublictoken: userPublicToken,
            });
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
 * Logs the User into account
 * @param {CustomRequest} req
 * @param {Response} res
 * @return {Response}
 */
const LoginUser = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('LOGiN_USER_FUNC', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();
        const LoginQueryString = `SELECT UserPrivateToken, UserPublicToken, UserPwd FROM users WHERE UserEmail='${req.body.userEmail}';`;

        const accountVideosDB = await query(connection, LoginQueryString);

        const data = JSON.parse(JSON.stringify(accountVideosDB));
        if (Object.keys(data).length === 0) {
            return res.status(200).json({
                error: false,
                userprivateToken: null,
            });
        }
        bcrypt.compare(req.body.password, data[0].UserPwd, (err, isMatch) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    error: true,
                });
            } else if (!isMatch) {
                return res.status(200).json({
                    error: false,
                    userprivateToken: null,
                });
            } else {
                return res.status(200).json({
                    error: false,
                    userprivateToken: data[0].UserPrivateToken,
                    userpublicToken: data[0].UserPublicToken,
                });
            }
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);

        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

const PhotoUploader = multer({
    storage: storage,
    fileFilter: fileFilter,
}).single('photo');

const UploadPhoto = async (req: CustomRequest, res: Response) => {
    PhotoUploader(req, res, async (err: any) => {
        if (err) {
            return res.status(200).json({
                msg: 'falied to upload',
                error: true,
            });
        }

        // console.log(req.file);

        const userPublicToken = await UtilFunc.getUserPublicTokenFromPrivateToken(req.pool!, req.body.UserPrivateToken);
        if (userPublicToken == null) {
            return res.status(200).json({
                error: true,
            });
        }

        const PhotoToken = UtilFunc.CreateVideoToken();

        //* Directory Created Succesfully
        fs.rename(`${process.env.ACCOUNTS_FOLDER_PATH}/PhotosTmp/${req.file?.originalname}`, `${process.env.ACCOUNTS_FOLDER_PATH}/${userPublicToken}/${PhotoToken}.png`, async (err) => {
            if (err) {
                logging.error(NAMESPACE, err.message);

                return res.status(200).json({
                    error: true,
                });
            }

            try {
                const connection = await req.pool?.promise().getConnection();
                const sendVideoCategoryToDbSQl = `INSERT INTO photos (PublishDate, Description, PhotoToken, OwnerToken, Visibility) VALUES (CURDATE(),'${req.body.description}', '${PhotoToken}', '${userPublicToken}', 'public')`;
                await query(connection, sendVideoCategoryToDbSQl);

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
};

const GetAccountPhotos = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('GET_ACCOUNT_DATA', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const connection = await req.pool?.promise().getConnection();
        const GetUserDataQueryString = `SELECT * FROM photos WHERE OwnerToken='${req.params.accountPublicToken}';`;

        const data = await query(connection, GetUserDataQueryString);
        if (Object.keys(data).length === 0) {
            return res.status(200).json({
                error: false,
                photosData: null,
            });
        }

        return res.status(200).json({
            error: false,
            photosData: data,
        });
    } catch (error: any) {
        logging.error(NAMESPACE, error.message);

        res.status(202).json({
            error: true,
            errmsg: error.message,
        });
    }
};

export default {
    GetUserAccountData,
    GetUserAccountPublicData,
    ChangeUserData,
    RegisterUser,
    LoginUser,
    UploadPhoto,
    GetAccountPhotos,
};

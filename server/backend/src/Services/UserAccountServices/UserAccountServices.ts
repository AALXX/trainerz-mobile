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
import nodemailer from 'nodemailer';

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
        const GetUserDataQueryString = `SELECT 
            u.UserName, 
            u.Description, 
            u.BirthDate, 
            u.AccountPrice, 
            u.LocationCountry, 
            u.LocationCity, 
            u.Sport, 
            u.UserEmail, 
            u.PhoneNumber, 
            u.UserVisibility, 
            u.AccountType, 
            u.UserPublicToken, 
            r.Rating
        FROM 
            users u
        LEFT JOIN 
            ratings r
        ON 
            u.UserPublicToken = r.UserToken
        WHERE 
            u.UserPrivateToken = '${req.params.accountPrivateToken}';`;

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

        const GetUserDataQueryString = `SELECT 
            u.UserName, 
            u.Description, 
            u.AccountPrice, 
            u.Sport, 
            u.UserEmail,
            u.PhoneNumber, 
            u.UserVisibility, 
            u.AccountType, 
            r.Rating
        FROM 
            users u
        LEFT JOIN 
            ratings r
        ON 
            u.UserPublicToken = r.UserToken
        WHERE 
            u.UserPublicToken = '${req.params.accountPublicToken}';`;

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
const GetUserAccountSubscriptions = async (req: CustomRequest, res: Response) => {
    const errors = CustomRequestValidationResult(req);
    if (!errors.isEmpty()) {
        errors.array().map((error) => {
            logging.error('GET_ACCOUNT_DATA', error.errorMsg);
        });

        return res.status(200).json({ error: true, errors: errors.array() });
    }

    try {
        const UserEmail = await UtilFunc.getUserEmailFromPrivateToken(req.pool!, req.params.userPrivateToken);

        if (UserEmail == null) {
            return res.status(200).json({
                error: true,
            });
        }

        const customers = await req.stripe?.customers.list({ email: UserEmail });

        if (customers == null) {
            return res.status(200).json({
                error: true,
            });
        }

        // List all subscriptions for the given customer ID
        const subscriptions = await req.stripe?.subscriptions.list({
            customer: customers.data[0].id,
            status: 'active', // Fetch subscriptions of any status
        });

        if (subscriptions == null) {
            return res.status(200).json({
                error: true,
            });
        }

        // Extract product IDs from subscription items
        const productIds: Set<string> = new Set();
        for (const subscription of subscriptions!.data) {
            for (const item of subscription.items.data) {
                if (item.price.product) {
                    productIds.add(item.price.product as string);
                }
            }
        }

        // Fetch product details for each product ID
        const products = await Promise.all(Array.from(productIds).map((productId) => req.stripe?.products.retrieve(productId)));

        if (products == null) {
            return res.status(200).json({
                error: true,
            });
        }

        // Extract PublicToken from products metadata
        const publicTokens = products.map((product) => product!.metadata.PublicToken).filter((token) => token !== undefined);
        const connection = await req.pool?.promise().getConnection();

        // Query the database to get user data based on PublicToken
        const userDataPromises = publicTokens.map(async (token) => {
            const userData = await query(
                connection,
                `SELECT u.AccountType, u.Sport, u.UserName, u.UserPublicToken, r.Rating
                FROM users u
                LEFT JOIN ratings r ON u.UserPublicToken = r.UserToken
                WHERE u.UserPublicToken ="${token}";`,
            );
            return userData[0];
        });

        const userData = await Promise.all(userDataPromises);

        return res.status(200).json({
            error: false,
            userData: userData,
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
                AccountType: req.body.accountType,
                Sport: req.body.sport,
            });

            if (resp.data.error == true) {
                console.log('error');
            }

            // Create a transporter with Gmail SMTP configuration
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.platform_gmail,
                    pass: process.env.platform_gmail_password,
                },
            });

            const mailOptions = {
                from: process.env.platform_gmail,
                to: req.body.userEmail,
                subject: 'Welcome to Trainerz App!',
                text: `Hello,

    An account with the Username: "${req.body.userName}", has been created. Thank you for joining Trainerz app. 
Note that this app is still in development and if you encounter a bug, feel free to report it to us.

Thank you,
Trainerz Team`,
            };

            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    res.status(500).send('Error sending email');
                } else {
                    console.log('Email sent: ' + info.response);
                    res.status(200).send('Email sent successfully');
                }
            });

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

const ChangeUserIcon = async (req: CustomRequest, res: Response) => {
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

        //* Directory Created Succesfully
        fs.rename(`${process.env.ACCOUNTS_FOLDER_PATH}/PhotosTmp/${req.file?.originalname}`, `${process.env.ACCOUNTS_FOLDER_PATH}/${userPublicToken}/Main_Icon.png`, async (err) => {
            if (err) {
                logging.error(NAMESPACE, err.message);

                return res.status(200).json({
                    error: true,
                });
            }

            return res.status(200).json({
                error: false,
            });
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
    ChangeUserIcon,
    GetUserAccountSubscriptions,
    RegisterUser,
    LoginUser,
    UploadPhoto,
    GetAccountPhotos,
};
